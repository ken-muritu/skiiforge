/**
 * Uber.com UX/state crawler
 * ---------------------------------------------------------------------------
 * Crawls https://www.uber.com starting from the homepage, follows internal
 * links, and captures screenshots of pages plus interaction-triggered states
 * (nav dropdowns, modals, cookie banners, form validation, carousels).
 *
 * Usage:
 *   npm install playwright
 *   npx playwright install chromium
 *   node crawl.js
 *
 * Everything you're likely to want to tweak lives in the CONFIG block below.
 * ---------------------------------------------------------------------------
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIG — edit these to change crawl behavior
// ============================================================================
const CONFIG = {
  // Where the crawl starts. Only links on this same hostname are followed.
  START_URL: "https://www.uber.com",
  ALLOWED_HOSTNAMES: ["www.uber.com", "uber.com"],

  // --- Headless mode ---
  // true  = no visible browser window (default; required on servers/CI/sandboxes).
  // false = opens a real browser window you can watch — useful for debugging
  //         locally, but requires a display (X server) and will fail on a
  //         headless machine like a CI runner or this sandbox.
  HEADLESS: true,

  // --- Viewport size ---
  // Controls the emulated browser window size, which affects layout,
  // responsive breakpoints, and what ends up in the screenshot.
  // Common presets: desktop 1440x900, laptop 1280x800, mobile 390x844 (iPhone 12/13).
  VIEWPORT: { width: 1440, height: 900 },

  // Bound the crawl so it can't run forever or hammer a production site.
  // Raise these for a more exhaustive run once you've reviewed the output.
  MAX_PAGES: 12,
  MAX_DEPTH: 3,

  // Politeness delay between page navigations, in milliseconds. Keep this
  // reasonably high (>=1500ms) out of respect for uber.com's infrastructure —
  // this is not our site, and we have no rate-limit exemption from them.
  REQUEST_DELAY_MS: 1800,

  // Per-action timeouts.
  NAV_TIMEOUT_MS: 30_000,
  ACTION_TIMEOUT_MS: 4_000,

  // Where screenshots + the crawl log land.
  OUTPUT_DIR: path.join(__dirname, "screenshots"),
  LOG_FILE: path.join(__dirname, "crawl-log.json"),

  // Respect robots.txt Disallow rules for the default (unnamed) user agent.
  RESPECT_ROBOTS_TXT: true,

  // Skip any URL whose path matches one of these (regex, case-insensitive).
  // These are typically account/payment/legal-risk flows we never want to
  // interact with beyond a screenshot of the entry point.
  SKIP_PATH_PATTERNS: [/\/logout/i, /\/checkout/i, /\/payment/i],
};

// Section a URL path maps to, for the structured output folders the task
// asked for (home, ride, drive, login-modal, popup-cookie, ...). Extend this
// as you discover more sections you care about.
function sectionForPath(pathname) {
  if (pathname === "/" || pathname === "") return "home";
  const first = pathname.split("/").filter(Boolean)[0] || "misc";
  return first.toLowerCase();
}

// ============================================================================
// Small utilities
// ============================================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(str) {
  return (str || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Very small robots.txt parser — handles User-agent: * and Disallow: lines only. */
async function loadRobotsDisallowRules(baseUrl) {
  if (!CONFIG.RESPECT_ROBOTS_TXT) return [];
  try {
    const res = await fetch(new URL("/robots.txt", baseUrl).toString());
    if (!res.ok) return [];
    const text = await res.text();
    const rules = [];
    let inWildcardBlock = false;
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const [rawKey, ...rest] = line.split(":");
      const key = rawKey.trim().toLowerCase();
      const value = rest.join(":").trim();
      if (key === "user-agent") {
        inWildcardBlock = value === "*";
      } else if (key === "disallow" && inWildcardBlock && value) {
        rules.push(value);
      }
    }
    return rules;
  } catch (e) {
    console.warn(`[robots.txt] could not fetch/parse, proceeding without it: ${e.message}`);
    return [];
  }
}

function isDisallowedByRobots(pathname, disallowRules) {
  return disallowRules.some((rule) => pathname.startsWith(rule));
}

/** Detects CAPTCHA challenges or explicit rate-limiting responses. */
async function detectBlocking(page, response) {
  if (response) {
    const status = response.status();
    if (status === 429 || status === 403) {
      return `HTTP ${status} (likely rate-limited or blocked)`;
    }
  }
  try {
    const captchaFrame = await page
      .locator('iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[title*="challenge" i]')
      .first();
    if (await captchaFrame.count() > 0 && (await captchaFrame.isVisible().catch(() => false))) {
      return "CAPTCHA iframe detected (recaptcha/hcaptcha)";
    }
    const bodyText = (await page.locator("body").innerText().catch(() => "")).toLowerCase();
    if (
      bodyText.includes("verify you are human") ||
      bodyText.includes("unusual traffic") ||
      bodyText.includes("access denied")
    ) {
      return "Anti-bot interstitial text detected on page";
    }
  } catch {
    // If we can't even inspect the page, don't treat that as a block —
    // let the caller's normal error handling deal with it.
  }
  return null;
}

// ============================================================================
// Screenshot + logging helpers
// ============================================================================

let shotCounter = 0;
const log = { startedAt: new Date().toISOString(), pages: [], blockedAt: null, errors: [] };

async function screenshot(page, section, label) {
  const dir = path.join(CONFIG.OUTPUT_DIR, slugify(section));
  ensureDir(dir);
  shotCounter += 1;
  const file = path.join(dir, `${String(shotCounter).padStart(3, "0")}-${slugify(label)}.png`);
  try {
    await page.screenshot({ path: file, fullPage: true, timeout: CONFIG.ACTION_TIMEOUT_MS });
    console.log(`  📸 ${path.relative(__dirname, file)}`);
    return file;
  } catch (e) {
    console.warn(`  ⚠️  screenshot failed for ${label}: ${e.message}`);
    return null;
  }
}

// ============================================================================
// Popup / modal / cookie-banner capture
// ============================================================================

/** Common selectors for cookie-consent banners across CMPs (OneTrust, Cookiebot, etc.) + generic patterns. */
const COOKIE_BANNER_SELECTORS = [
  '#onetrust-banner-sdk',
  '[id*="cookie" i][class*="banner" i]',
  '[class*="cookie-consent" i]',
  '[class*="cookie-banner" i]',
  'div[role="dialog"][aria-label*="cookie" i]',
];

/** Generic modal/dialog selectors — most component libraries use one of these. */
const MODAL_SELECTORS = [
  '[role="dialog"]',
  '[aria-modal="true"]',
  '[class*="modal" i]:visible',
  '[class*="popup" i]:visible',
];

async function captureCookieBannerIfPresent(page, section) {
  for (const selector of COOKIE_BANNER_SELECTORS) {
    const el = page.locator(selector).first();
    if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
      await screenshot(page, "popup-cookie", `${section}-cookie-banner`);
      return true;
    }
  }
  return false;
}

async function dismissCookieBanner(page) {
  // Try the common "Accept" wording first; fall back to closing via Escape.
  const acceptButton = page.getByRole("button", {
    name: /accept|agree|got it|allow all/i,
  });
  try {
    if (await acceptButton.first().isVisible({ timeout: 2000 })) {
      await acceptButton.first().click({ timeout: CONFIG.ACTION_TIMEOUT_MS });
      return true;
    }
  } catch {
    /* no visible accept button within timeout — fall through */
  }
  await page.keyboard.press("Escape").catch(() => {});
  return false;
}

async function captureAnyModal(page, section, label) {
  for (const selector of MODAL_SELECTORS) {
    const el = page.locator(selector).first();
    if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
      await screenshot(page, section, label);
      return true;
    }
  }
  return false;
}

// ============================================================================
// Interaction simulators
// ============================================================================

/** Clicks each top-level nav item, screenshots any dropdown/submenu that opens, then closes it. */
async function exploreNav(page, section) {
  const navItems = page.locator('header nav a, [role="navigation"] a, nav [role="menuitem"]');
  const count = Math.min(await navItems.count().catch(() => 0), 5); // cap — nav bars can be huge on mega-menus
  for (let i = 0; i < count; i++) {
    const item = navItems.nth(i);
    const text = (await item.innerText().catch(() => "")) || `nav-item-${i}`;
    try {
      await item.hover({ timeout: CONFIG.ACTION_TIMEOUT_MS });
      await page.waitForTimeout(400); // let a hover-triggered dropdown animate in
      const opened = await captureAnyModal(page, section, `nav-dropdown-${text}`);
      if (!opened) {
        // Some nav items are dropdowns only on click, not hover.
        await item.click({ timeout: CONFIG.ACTION_TIMEOUT_MS }).catch(() => {});
        await page.waitForTimeout(400);
        await captureAnyModal(page, section, `nav-click-${text}`);
      }
      await page.keyboard.press("Escape").catch(() => {});
    } catch {
      // Non-interactive or off-screen nav item — skip it, not worth failing the crawl over.
    }
  }
}

/** Finds and clicks Sign In / Sign Up / Log In entry points, captures whatever modal/page appears. */
async function exploreAuthEntryPoints(page, section) {
  const authLabels = [
    { pattern: /sign in|log in/i, folder: "login-modal" },
    { pattern: /sign up|create account|register/i, folder: "signup-modal" },
  ];

  for (const { pattern, folder } of authLabels) {
    const trigger = page.getByRole("button", { name: pattern }).or(page.getByRole("link", { name: pattern }));
    try {
      if (!(await trigger.first().isVisible({ timeout: 2000 }))) continue;
      const urlBefore = page.url();
      await trigger.first().click({ timeout: CONFIG.ACTION_TIMEOUT_MS });
      await page.waitForTimeout(800);

      const modalShown = await captureAnyModal(page, folder, `${section}-${folder}`);
      if (!modalShown) {
        // Some sites navigate to a full auth page rather than opening a modal.
        if (page.url() !== urlBefore) {
          await page.waitForLoadState("networkidle", { timeout: CONFIG.NAV_TIMEOUT_MS }).catch(() => {});
          await screenshot(page, folder, `${section}-${folder}-fullpage`);
        }
      }

      // Trigger client-side validation without ever submitting real data.
      await triggerFormValidation(page, folder, section);

      // Return to the original page/state rather than staying deep in the auth flow.
      if (page.url() !== urlBefore) {
        await page.goto(urlBefore, { waitUntil: "domcontentloaded", timeout: CONFIG.NAV_TIMEOUT_MS }).catch(() => {});
      } else {
        await page.keyboard.press("Escape").catch(() => {});
      }
    } catch {
      // Trigger not present/visible on this page — that's expected on most pages.
    }
  }
}

/**
 * Fills visible form inputs with intentionally-invalid placeholder values
 * (never real personal data) to trigger client-side validation UI, then
 * screenshots the result. Does NOT click any final "Submit"/"Create account"
 * button — we only want to see validation states, never actually register
 * an account or send real data anywhere.
 */
async function triggerFormValidation(page, section, context) {
  const emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
  const textInputs = page.locator('input[type="text"], input[type="tel"], input:not([type])');

  try {
    if (await emailInput.count()) {
      await emailInput.fill("not-a-valid-email", { timeout: CONFIG.ACTION_TIMEOUT_MS });
      await emailInput.blur().catch(() => {});
    }
    const textCount = Math.min(await textInputs.count().catch(() => 0), 3);
    for (let i = 0; i < textCount; i++) {
      await textInputs
        .nth(i)
        .fill("test", { timeout: CONFIG.ACTION_TIMEOUT_MS })
        .catch(() => {});
    }
    await page.waitForTimeout(400);
    await screenshot(page, section, `${context}-validation-state`);
  } catch {
    // Forms vary a lot page-to-page; a failure here just means "nothing to validate."
  }
}

/** Expands the first few accordion-style elements found. */
async function exploreAccordions(page, section) {
  const accordionTriggers = page.locator('[aria-expanded="false"]');
  const count = Math.min(await accordionTriggers.count().catch(() => 0), 5);
  for (let i = 0; i < count; i++) {
    try {
      await accordionTriggers.nth(i).click({ timeout: CONFIG.ACTION_TIMEOUT_MS });
      await page.waitForTimeout(300);
    } catch {
      /* not actually clickable / detached after a prior click re-rendered the list */
    }
  }
  if (count > 0) await screenshot(page, section, "accordions-expanded");
}

/** Clicks "next" on the first couple of carousel-like components found. */
async function exploreCarousels(page, section) {
  const nextButtons = page.locator(
    '[class*="carousel" i] button[aria-label*="next" i], [class*="carousel" i] [class*="next" i], button[aria-label*="next slide" i]'
  );
  const count = Math.min(await nextButtons.count().catch(() => 0), 3);
  for (let i = 0; i < count; i++) {
    try {
      await nextButtons.nth(i).click({ timeout: CONFIG.ACTION_TIMEOUT_MS });
      await page.waitForTimeout(400);
    } catch {
      /* carousel control not interactable — skip */
    }
  }
  if (count > 0) await screenshot(page, section, "carousel-advanced");
}

// ============================================================================
// Link discovery
// ============================================================================

async function extractInternalLinks(page, baseUrl) {
  const hrefs = await page.$$eval("a[href]", (els) => els.map((el) => el.getAttribute("href")));
  const links = new Set();
  for (const href of hrefs) {
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      continue;
    }
    try {
      const url = new URL(href, baseUrl);
      url.hash = ""; // dedupe fragment-only variants of the same page
      if (!CONFIG.ALLOWED_HOSTNAMES.includes(url.hostname)) continue; // external link — skip per requirements
      links.add(url.toString());
    } catch {
      // Malformed href — ignore.
    }
  }
  return [...links];
}

// ============================================================================
// Per-page visit
// ============================================================================

async function visitPage(page, url, depth, disallowRules) {
  const parsed = new URL(url);

  if (CONFIG.SKIP_PATH_PATTERNS.some((re) => re.test(parsed.pathname))) {
    console.log(`⏭️  skipping (matches SKIP_PATH_PATTERNS): ${url}`);
    return { links: [], blocked: null };
  }
  if (isDisallowedByRobots(parsed.pathname, disallowRules)) {
    console.log(`⏭️  skipping (robots.txt disallow): ${url}`);
    return { links: [], blocked: null };
  }

  const section = sectionForPath(parsed.pathname);
  console.log(`\n🌐 [depth ${depth}] ${url}  →  section "${section}"`);

  let response;
  try {
    response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: CONFIG.NAV_TIMEOUT_MS });
    // Prefer network-idle for dynamic content (maps/pricing widgets), but don't
    // let a page that never goes idle (e.g. live map polling) hang the crawl.
    await page.waitForLoadState("networkidle", { timeout: CONFIG.NAV_TIMEOUT_MS }).catch(() => {});
  } catch (e) {
    log.errors.push({ url, error: e.message });
    console.warn(`  ⚠️  navigation failed: ${e.message}`);
    return { links: [], blocked: null };
  }

  const blocked = await detectBlocking(page, response);
  if (blocked) {
    return { links: [], blocked };
  }

  const hadCookieBanner = await captureCookieBannerIfPresent(page, section);
  if (hadCookieBanner) await dismissCookieBanner(page);

  await screenshot(page, section, "initial");

  // Extract links from THIS clean page load before any interaction below has a
  // chance to navigate us away (e.g. clicking Sign Up can jump to a full-page
  // auth flow, sometimes on another subdomain). Discovering links up front
  // means a detour later can never starve the crawl queue.
  const links = await extractInternalLinks(page, url);

  await exploreNav(page, section);
  await exploreAccordions(page, section);
  await exploreCarousels(page, section);
  await exploreAuthEntryPoints(page, section);

  // Any promo/newsletter popup that appeared as a result of the above interactions.
  await captureAnyModal(page, "popup-promo", `${section}-post-interaction`);

  log.pages.push({ url, section, depth, status: response ? response.status() : null });

  return { links, blocked: null };
}

// ============================================================================
// Main crawl loop (breadth-first, bounded by MAX_PAGES / MAX_DEPTH)
// ============================================================================

async function main() {
  ensureDir(CONFIG.OUTPUT_DIR);
  const disallowRules = await loadRobotsDisallowRules(CONFIG.START_URL);
  if (disallowRules.length) {
    console.log(`robots.txt: honoring ${disallowRules.length} disallow rule(s) for user-agent *`);
  }

  const browser = await chromium.launch({ headless: CONFIG.HEADLESS });
  const context = await browser.newContext({ viewport: CONFIG.VIEWPORT });
  const page = await context.newPage();

  const visited = new Set();
  const queue = [{ url: CONFIG.START_URL, depth: 0 }];

  while (queue.length && visited.size < CONFIG.MAX_PAGES) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > CONFIG.MAX_DEPTH) continue;
    visited.add(url);

    const { links, blocked } = await visitPage(page, url, depth, disallowRules);

    if (blocked) {
      log.blockedAt = { url, reason: blocked, at: new Date().toISOString() };
      console.error(`\n🛑 Stopping crawl — blocking behavior detected: ${blocked}`);
      break;
    }

    for (const link of links) {
      if (!visited.has(link)) queue.push({ url: link, depth: depth + 1 });
    }

    await sleep(CONFIG.REQUEST_DELAY_MS); // politeness delay — see CONFIG
  }

  await browser.close();

  log.finishedAt = new Date().toISOString();
  log.pagesVisited = visited.size;
  log.screenshotsCaptured = shotCounter;
  fs.writeFileSync(CONFIG.LOG_FILE, JSON.stringify(log, null, 2));

  console.log(`\n✅ Done. Visited ${visited.size} page(s), captured ${shotCounter} screenshot(s).`);
  console.log(`   Log: ${CONFIG.LOG_FILE}`);
  if (log.blockedAt) console.log(`   ⚠️  Stopped early due to blocking: ${log.blockedAt.reason}`);
}

main().catch((e) => {
  console.error("Fatal crawler error:", e);
  process.exitCode = 1;
});
