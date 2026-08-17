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
├── README.md          ← this file
├── crawl.js            ← the crawler (Node.js + Playwright)
├── package.json
├── crawl-log.json      ← machine-readable summary: pages visited, statuses, any block event
└── screenshots/
    └── <section>/       ← one folder per top-level path segment (home, ride, drive, ...),
                           plus login-modal/, signup-modal/, popup-cookie/, popup-promo/
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
