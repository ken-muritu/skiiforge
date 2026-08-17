# Uber.com — UX/State Crawl

Automated visual documentation pass over **https://www.uber.com**, produced with a
custom Playwright crawler (`crawl.js` in this folder) on **2026-08-17**.

> **Honesty notes**
> - No real account was created and no real sign-up/login was ever submitted. The
>   crawler clicks Sign In / Sign Up entry points and fills form fields with
>   obviously-fake placeholder values (`not-a-valid-email`, `test`) purely to
>   trigger client-side validation UI, then never presses a final submit button.
> - The crawl is intentionally bounded (`MAX_PAGES`, `MAX_DEPTH`, and a politeness
>   delay between navigations, all in `crawl.js`'s `CONFIG` block) rather than an
>   unbounded "crawl everything" pass, out of respect for uber.com being a live
>   third-party production system we have no standing agreement with.
> - `robots.txt` is fetched and honored — any path under a `Disallow:` rule for
>   user-agent `*` is skipped rather than visited.
> - The crawler is built to detect CAPTCHA challenges and HTTP 429/403 responses
>   and stop the whole run cleanly rather than push through them. See "What
>   happened" below for whether that triggered on this run.

---

## What's in this folder

```
research/uber-crawler/
├── README.md               ← this file
├── crawl.js                 ← the crawler (Node.js + Playwright)
├── capture_gaps.js          ← targeted follow-up script for states the first pass missed
├── package.json
├── crawl-log.json           ← first-pass machine-readable summary
├── capture-gaps-log.json    ← follow-up-pass machine-readable summary
├── screenshots/
│   └── <section>/            ← one folder per top-level path segment (home, ride, drive, ...),
│                                plus login-modal/, signup-modal/, popup-cookie/, popup-promo/
└── allscreenshots/           ← every screenshot from this project, flat, one folder,
                                 same pattern as research/mydawa/screenshots-all/
```

## How to run it yourself

```bash
cd research/uber-crawler
npm install
npx playwright install chromium chromium-headless-shell
node crawl.js
```

## Configuration

Everything you're likely to want to change lives in the `CONFIG` object at the top
of `crawl.js`:

| Setting | Purpose |
|---|---|
| `HEADLESS` | `true` = no visible window (default, required on servers/CI). `false` = watch it run in a real browser window (needs a display). |
| `VIEWPORT` | `{ width, height }` emulated browser size — affects layout/breakpoints and what lands in the screenshot. |
| `MAX_PAGES` / `MAX_DEPTH` | Bounds on the crawl so it terminates and doesn't hammer the target site. |
| `REQUEST_DELAY_MS` | Politeness delay between page navigations. |
| `RESPECT_ROBOTS_TXT` | Whether to fetch and honor `robots.txt` `Disallow` rules. |
| `SKIP_PATH_PATTERNS` | Regexes for paths to never enter (logout/checkout/payment by default). |

## What it does, per requirement

1. **Deep crawling** — breadth-first from the homepage, same-hostname links only, external links skipped entirely.
2. **State coverage** — hovers/clicks top nav items to expose dropdowns, expands accordions, advances carousels, clicks Sign In/Sign Up, fills (but never submits) forms to trigger validation.
3. **Popup handling** — cookie-consent banners are detected and screenshotted before being dismissed; any `role="dialog"`/`aria-modal` element is screenshotted wherever it appears, including post-interaction promo popups.
4. **Dynamic content** — each page waits for `networkidle` (with a timeout fallback) before capturing, so maps/pricing widgets have a chance to render.
5. **Structured output** — screenshots land under `screenshots/<section>/`, where section is derived from the URL's first path segment (`home`, `ride`, `drive`, ...), plus dedicated `login-modal/`, `signup-modal/`, `popup-cookie/`, `popup-promo/` folders.
6. **Error handling** — external links are skipped at discovery time; per-page navigation errors are caught and logged without killing the crawl; CAPTCHA/rate-limit detection stops the whole run cleanly, preserving whatever was already captured.

## What happened on this run

Run on 2026-08-17, `MAX_PAGES=12`, `MAX_DEPTH=3`, viewport 1440×900, headless.

- **12 pages visited, 48 screenshots captured, 0 errors, no CAPTCHA/rate-limit block
  encountered.** Full machine-readable detail in `crawl-log.json`.
- The crawl auto-redirected into the Kenya locale (`/ke/en/...`) after the homepage,
  then followed nav links into `drive/`, `business/`, `about/` and its subpages, three
  `/global/en/r/cities/...` city pages (Nairobi, Mombasa, Uasin Gishu), and
  `/ke/en/newsroom/` before hitting the page cap.
- **Sign Up** is a full-page flow (not a modal) on every page it was tried from — captured
  as `<section>-signup-modal-fullpage.png`, followed by a validation-state screenshot after
  filling (never submitting) the form, then the crawler navigated back to where it left off.
  **Login** only exposed a fill-able form on one of the twelve pages visited (`newsroom`);
  elsewhere the trigger either wasn't present in the crawled area or opened a state our
  generic modal selectors didn't recognize as distinct from the base page.
- **No cookie-consent banner was detected/captured on any of the 12 pages.** Either this
  session's locale/cookie state didn't trigger one, or Uber's implementation doesn't match
  the common CMP selectors `crawl.js` looks for — worth widening `COOKIE_BANNER_SELECTORS`
  if a banner is confirmed to exist on a fresh session.
  Likewise, no nav-dropdown or carousel state was distinctly captured — Uber's mega-menu and
  carousel markup didn't match the generic selectors used (`MODAL_SELECTORS` / the carousel
  "next" button heuristic). These are known gaps in the generic selectors, not evidence
  those UI elements don't exist — treat `crawl.js`'s interaction coverage as "attempted
  generically," not "verified against Uber's specific component library."
- The accordion-expansion screenshots are frequently **byte-identical across different
  page URLs** — the generic `[aria-expanded="false"]` selector consistently matches what
  looks like a persistent header/ride-search widget present on every page in this app
  shell, rather than a distinct per-page accordion. Confirmed by hash-comparing outputs;
  this is a selector-specificity limitation, not a crawl failure — the "initial" screenshot
  for every page *is* genuinely distinct content (verified by hash).
- **Bug found and fixed mid-run:** the first attempt visited only 1 page total. Root cause:
  link discovery ran *after* the Sign Up interaction, which had navigated the page to a
  full-page auth flow with few/no same-hostname links, starving the crawl queue. Fixed by
  extracting links from each page's clean initial load, before any interaction can navigate
  away — see the `visitPage()` function. The results above are from the corrected run.
- `MAX_PAGES` was set to 12 for this pass (not the higher number you might reach for)
  because real per-page cost with full interaction simulation ran ~1–2 minutes/page against
  live uber.com. Raise `MAX_PAGES` in `CONFIG` for a more exhaustive run — the script itself
  has no hard ceiling beyond that constant.

## Gap-fill pass (2026-08-17, same day, later) — `capture_gaps.js`

The first pass left several requirement gaps admitted above. Rather than guess at
fixes, this pass inspected the **real live DOM** of uber.com first, then captured
what was actually missing. Uber's site is built on their own
[Base Web](https://baseweb.design) design system, which explains most of the
original gaps: there's no semantic `<header>`/`[role=navigation]`/generic
`[aria-expanded]` markup for the crawler's original generic selectors to find —
everything routes through `data-baseweb="..."` component markers instead.
`crawl.js`'s selectors were updated accordingly (see inline comments at each
`explore*` function) so a future full re-run benefits, not just this one-off pass.

**Findings, gap by gap:**

- **Cookie banner — root cause confirmed, not fixable from here.** Fetched the raw
  page HTML on a completely fresh browser context (no prior cookies/localStorage)
  in both `en-US`/`America/Los_Angeles` and `en-GB`/`Europe/London` locale+timezone
  combinations. **No CMP script (OneTrust/Cookiebot/TrustArc/Osano) is injected into
  the page at all**, in either case — this isn't a client-side toggle we failed to
  click, the consent banner is gated server-side, almost certainly by real geo-IP
  region detection that locale/timezone spoofing can't fake without an actual
  regional proxy/IP. What *does* exist, confirmed present in the page text, is a
  CCPA-style privacy/cookie link in the footer — captured that as the honest,
  real substitute: `popup-cookie/101-footer-privacy-cookie-links.png`.
- **Nav dropdown — selector fixed, partial result.** Real nav lives in
  `[data-baseweb="header-navigation"]`; `crawl.js` now tries that when the semantic
  selector finds nothing. On this run, the container was located and its first 6
  items were hovered, but none revealed a `[data-baseweb="menu"]` panel — captured
  the static container state (`home/102-header-navigation-static.png`) rather than
  claim a dropdown that didn't visibly open. Uber's primary nav here (Ride/Drive/
  Rent) appears to be plain top-level links rather than hover/click submenus; a
  real mega-menu may only exist behind an item this run didn't reach, or may need
  `click` instead of `hover` — worth another pass if a specific dropdown is known
  to exist.
- **Accordion — selector fixed, but flaky/inconsistent.** `[data-baseweb="accordion"]`
  is real (confirmed once via direct DOM inspection: a "trip details" demo card,
  rendered **already expanded**, `aria-expanded="true"`, by default — not a
  collapsed FAQ list). On a second, separate page load it wasn't present at all.
  This reads as content that's conditionally rendered (A/B test, session-based, or
  scroll-triggered) rather than a stable, always-present element — flagged honestly
  rather than forced. `exploreAccordions()` now scopes to
  `[data-baseweb="accordion"]` first when present (falling back to the old generic
  selector for non-Base-Web sites), so it'll capture it correctly whenever it does
  render.
- **Sign In — real gap, now closed.** DOM inspection showed `www.uber.com`'s
  "Log in" is a plain `<a href="https://auth.uber.com/login-redirect?...">` —  a
  real page on a *different subdomain*, not a same-page modal. The original run's
  text/role-based click matching likely landed on a hidden duplicate (mobile-nav
  copies of the same link exist in the DOM), which is why it only ever produced
  validation-state screenshots with no visible login form behind them.
  `exploreAuthEntryPoints()` now tries a direct `href`-pattern match first (more
  reliable than role/text matching when duplicates exist) before falling back to
  the old click-based approach. Captured the real sign-in page
  (`login-modal/103-signin-real-page.png` — phone/email + Google/Apple continue
  options) and its validation state after typing an invalid value
  (`login-modal/104-signin-real-validation-state.png`), never submitted.
- **Carousel — real gap, now closed.** Checked the homepage plus 3 content pages
  for `data-baseweb="carousel"` and common slider-library markers (swiper/slick/
  keen-slider/embla). Found a real ride-options carousel (labeled "1/2" with
  prev/next arrows) on `/ke/en/about/uber-offerings/` and captured both its
  initial state and after clicking "next"
  (`uber-offerings/105-carousel-found.png`, `106-carousel-advanced.png`).
  Not found on the homepage or the other 2 pages checked — genuinely appears
  page-specific rather than a selector miss.
- **Promo popup** — still not observed on any page visited across either pass.
  No evidence one exists on this crawled surface area (marketing pages, no
  active session); not chased further since there's nothing concrete pointing
  at where one would trigger.

**Environment note:** this pass hit repeated Chromium-binary evictions from
`~/.cache/ms-playwright/` between separate script invocations (installed fine,
then gone a few minutes later, several times) — an environment/cache-eviction
issue unrelated to the crawl logic itself, not a uber.com blocking response.
Worth knowing if you re-run this and see the same "Executable doesn't exist"
error: just re-run `npx playwright install chromium chromium-headless-shell`.
