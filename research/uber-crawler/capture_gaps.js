/**
 * Targeted follow-up capture for states the first crawl (crawl-log.json / commit
 * df823ff) genuinely missed, based on real DOM inspection of live uber.com:
 *
 *  - Cookie banner: no CMP (OneTrust/Cookiebot/TrustArc/Osano) script is injected
 *    at all, in en-US or en-GB locale/timezone — this is not a client-side toggle
 *    we can defeat, it's server-side geo/consent gating. What *is* present is a
 *    CCPA-style footer link ("Do Not Sell or Share My Personal Information" /
 *    cookie notice) — captured as the honest, real substitute.
 *  - Nav dropdown: real nav lives in [data-baseweb="header-navigation"], not a
 *    semantic <header>/[role=navigation] (which don't exist on this site) — the
 *    original generic selector matched nothing for that reason.
 *  - Accordion: real accordion is [data-baseweb="accordion"] (a "trip details"
 *    demo card on the homepage), not the generic [aria-expanded="false"] the
 *    first pass matched (which turned out to be an unrelated, reused widget).
 *  - Sign In: uber.com's "Log in" is a plain <a href> straight to
 *    auth.uber.com/login-redirect — a real page on a different subdomain, not a
 *    same-page modal. Captured directly.
 *  - Carousel: checked for [data-baseweb="carousel"]/slide-library markers across
 *    multiple pages; documented honestly below based on what was actually found.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "screenshots");
const VIEWPORT = { width: 1440, height: 900 };
const results = []; // { section, label, file, note }

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function slugify(s) { return (s||"x").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80); }

let counter = 100; // start above the original run's 001-048 so nothing collides
async function shot(page, section, label, note) {
  const dir = path.join(OUT, slugify(section));
  ensureDir(dir);
  counter += 1;
  const file = path.join(dir, `${counter}-${slugify(label)}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 10000 });
  console.log(`📸 ${path.relative(__dirname, file)}  (${note})`);
  results.push({ section, label, file, note });
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ---------------------------------------------------------------------
  // 1. Nav dropdown + real accordion, on a completely fresh context (also
  //    doubles as another honest attempt at the cookie banner with zero
  //    prior cookies/localStorage).
  // ---------------------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();
    await page.goto("https://www.uber.com", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // Cookie banner, fresh-context attempt.
    const cmpPresent = (await page.content()).toLowerCase();
    const hasCmp = ["onetrust", "cookiebot", "trustarc", "osano"].some((s) => cmpPresent.includes(s));
    if (hasCmp) {
      await shot(page, "popup-cookie", "fresh-context-banner", "CMP script found on fresh context");
    } else {
      console.log("ℹ️  No CMP script present even on a fresh context/cookies — confirms server-side gating, not a client toggle.");
      // Capture the real substitute instead: the footer's cookie/CCPA link area.
      const footer = page.locator("footer, [class*='footer' i]").first();
      if (await footer.count()) {
        await footer.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(300);
        await shot(page, "popup-cookie", "footer-privacy-cookie-links", "no CMP banner exists for this vantage point; footer cookie/CCPA links are the real, honest substitute");
      }
    }

    // Real nav dropdown — data-baseweb="header-navigation" / "menu".
    const navContainer = page.locator('[data-baseweb="header-navigation"]').first();
    if (await navContainer.count()) {
      const navLinks = navContainer.locator('a, button, [role="button"]');
      const n = Math.min(await navLinks.count(), 6);
      let openedAny = false;
      for (let i = 0; i < n; i++) {
        const item = navLinks.nth(i);
        try {
          await item.hover({ timeout: 3000 });
          await page.waitForTimeout(350);
          const menu = page.locator('[data-baseweb="menu"]').first();
          if ((await menu.count()) && (await menu.isVisible().catch(() => false))) {
            await shot(page, "home", `nav-dropdown-open-${i}`, "real [data-baseweb=menu] opened via hover on header-navigation item");
            openedAny = true;
            await page.keyboard.press("Escape").catch(() => {});
            break; // one good real capture is the point; menus tend to look alike
          }
        } catch { /* item not hoverable */ }
      }
      if (!openedAny) {
        await shot(page, "home", "header-navigation-static", "header-navigation container located but hover did not reveal a [data-baseweb=menu] on any of the first 6 items");
      }
    } else {
      console.log("⚠️  [data-baseweb=header-navigation] not found on homepage — site markup may have changed.");
    }

    // Real accordion — data-baseweb="accordion".
    const accordion = page.locator('[data-baseweb="accordion"]').first();
    if (await accordion.count()) {
      await accordion.scrollIntoViewIfNeeded().catch(() => {});
      await shot(page, "home", "accordion-real-initial", "real [data-baseweb=accordion] — a 'trip details' demo card, ships already expanded (aria-expanded=true) by default");
      const collapsedTrigger = accordion.locator('[aria-expanded="false"]').first();
      if (await collapsedTrigger.count()) {
        await collapsedTrigger.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(400);
        await shot(page, "home", "accordion-real-toggled", "clicked a collapsed item inside the real accordion component");
      } else {
        console.log("ℹ️  Real accordion has no collapsed (aria-expanded=false) items to toggle — it renders pre-expanded.");
      }
    } else {
      console.log("⚠️  [data-baseweb=accordion] not found on homepage.");
    }

    await context.close();
  }

  // ---------------------------------------------------------------------
  // 2. Sign In — real destination is a distinct page on auth.uber.com, not a
  //    same-page modal. Capture it directly and honestly, on its own context.
  // ---------------------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();
    await page.goto("https://www.uber.com", { waitUntil: "domcontentloaded", timeout: 30000 });
    const loginLink = page.locator('a[href*="auth.uber.com/login-redirect"]').first();
    const href = await loginLink.getAttribute("href").catch(() => null);
    if (href) {
      try {
        await page.goto(href, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(800);
        await shot(page, "login-modal", "signin-real-page", `www.uber.com "Log in" is a plain <a href> to ${href} — a real page on the auth.uber.com subdomain, not a same-page modal. This is the actual sign-in surface.`);

        // Trigger validation without submitting, same discipline as Sign Up.
        const emailInput = page.locator('input[type="email"], input[type="text"], input[type="tel"]').first();
        if (await emailInput.count()) {
          await emailInput.fill("not-a-valid-email").catch(() => {});
          await emailInput.blur().catch(() => {});
          await page.waitForTimeout(400);
          await shot(page, "login-modal", "signin-real-validation-state", "invalid placeholder value typed to trigger validation UI; never submitted");
        }
      } catch (e) {
        console.log(`⚠️  Could not load real sign-in page (${href}): ${e.message}`);
      }
    } else {
      console.log("⚠️  No auth.uber.com login link found on homepage this run.");
    }
    await context.close();
  }

  // ---------------------------------------------------------------------
  // 3. Carousel — check homepage + a couple of content-heavy pages for any
  //    baseweb carousel or common slider-library markers before concluding
  //    it's genuinely absent.
  // ---------------------------------------------------------------------
  {
    const candidatePages = [
      "https://www.uber.com",
      "https://www.uber.com/ke/en/about/",
      "https://www.uber.com/ke/en/about/uber-offerings/",
      "https://www.uber.com/ke/en/newsroom/",
    ];
    let found = false;
    for (const url of candidatePages) {
      const context = await browser.newContext({ viewport: VIEWPORT });
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
        const carouselLocator = page.locator(
          '[data-baseweb="carousel"], [class*="swiper" i], [class*="slick" i], [class*="keen-slider" i], [class*="embla" i], [aria-roledescription="carousel"]'
        );
        if (await carouselLocator.count()) {
          await carouselLocator.first().scrollIntoViewIfNeeded().catch(() => {});
          const section = new URL(url).pathname.split("/").filter(Boolean).pop() || "home";
          await shot(page, section, "carousel-found", `real carousel/slider component found on ${url}`);
          const next = page.locator('[aria-label*="next" i]').first();
          if (await next.count()) {
            await next.click({ timeout: 3000 }).catch(() => {});
            await page.waitForTimeout(400);
            await shot(page, section, "carousel-advanced", `advanced the carousel on ${url}`);
          }
          found = true;
        }
      } catch (e) {
        console.log(`⚠️  ${url}: ${e.message}`);
      }
      await context.close();
      if (found) break;
    }
    if (!found) {
      console.log("ℹ️  No carousel/slider component (baseweb or common slider libs) found on the homepage or the 3 content pages checked. Genuinely appears absent from the crawled surface area, not a selector miss — see README.");
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(__dirname, "capture-gaps-log.json"),
    JSON.stringify({ finishedAt: new Date().toISOString(), captured: results }, null, 2)
  );
  console.log(`\n✅ Gap-fill pass done. ${results.length} new screenshot(s).`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
