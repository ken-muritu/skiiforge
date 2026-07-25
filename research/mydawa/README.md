# MYDAWA — Visual & Content Research Archive

Automated documentation pass over **https://mydawa.com/** (Kenya's online pharmacy & health platform),
produced by Hermes Agent on **2026-07-25**. This README is the master index: it captures everything
we have collected, explains *how we got here*, and lists what is still pending.

> **Honesty notes**
> - No real purchase was ever placed. Authentication was crossed only with the account owner's
>   consent (SMS OTP) and only up to the cart/checkout boundary.
> - The managed browser backend was unstable (repeated 502 outages). Some intended captures were
>   lost to resets — see "How we got here" and the `screenshots-all/MANIFEST.md`.
> - Mobile/tablet (390/768 px) screenshots are **not** possible through the managed browser tool
>   (fixed ~1512 px viewport, no device emulation). They require `scripts/cap.py` on a host with
>   egress + Playwright (see "How to finish").

---

## 1. What we have (current inventory)

```
research/mydawa/
├── README.md                 ← this master index
├── routes.json               ← exhaustive crawl map (96 routes, 7 groups)
├── screenshots-all/          ← ALL screenshots in one folder (deduped)
│   ├── MANIFEST.md           ← traces every original file; documents the dup bug
│   └── 11 unique PNGs        (homepage, PLP, PDP, diabetes/Mzima, brands, offers,
│                              telehealth, authed-home, empty-cart, nav-panel, login)
├── markdown-all/             ← ALL markdown in one folder
│   ├── MASTER.md             ← every per-page .md combined into one 44 KB doc
│   └── 19 per-page .md files (homepage, navigation, catalogue, offers, search,
│                              auth, telehealth, components, branding, UX, sitemap…)
└── scripts/
    └── cap.py                ← parametric Playwright capture (desktop/tablet/mobile,
                               gated areas) — the durable "complete the archive" tool
```

Totals committed: **11 unique PNGs**, **20 markdown docs** (19 per-page + MASTER), **1 route map**,
**1 capture script**. **Zero zero-byte files.**

### Verified screenshots (11 distinct)
| File | What it shows |
|---|---|
| `homepage-desktop-1512px.png` | Homepage (logged-out) |
| `products-catalogue-root.png` | /products PLP — "13,213 products" |
| `product-detail-laroche-anthelios.png` | PDP example |
| `diabetes-mzima-landing.png` | Mzima chronic-care landing |
| `brands-index.png` | /brands A–Z index |
| `offers-page.png` | /offer |
| `telehealth.png` | /telehealth |
| `authenticated-homepage.png` | Homepage as logged-in "Kennedy" |
| `cart-empty.png` | /mycart empty + 3-step checkout indicator |
| `category-listing-skincare.png` | Shop-by-Category panel / skincare listing |
| `login-page.png` | /login (logged-out OTP screen) |

### Verified content (markdown) — all in `markdown-all/`
homepage · navigation-hierarchy · products-catalogue · catalogue-and-filtering ·
product-detail-example · brands-index · offers-page · search-experience · auth-pages ·
authenticated-state · pharmacy-services · telehealth · components-inventory ·
branding-notes · color-palette · ux-observations · sitemap · url-inventory ·
capture-status · **MASTER.md** (all of the above combined).

---

## 2. How we got here (the journey)

1. **Kickoff.** Goal: a complete visual + content archive of mydawa.com pushed to this repo.
   Sandbox egress is allow-listed (github/npm/Cloudflare only); mydawa.com is **TLS-blocked**
   from the terminal (`curl` → 000). The *only* path to the live site is the managed browser tool
   (Browserbase infra), which renders a **fixed ~1512 px desktop viewport with no device emulation**.

2. **First pass + disaster.** Initial captures were written with `write_file`, which in this
   sandbox **silently produced 0-byte files** — the first push (`5979c4f`) shipped 12 empty `.md`
   files. Caught via an audit, rebuilt with in-process Python writes, re-pushed (`f5530a0`).

3. **Content capture.** Logged the public site: homepage, PLP (13,213 products), category/condition
   trees (15 categories, 40+ conditions), 6,500+ brands, offers, search, telehealth, Mzima/diabetes,
   branding (PIL colour extraction → PPB code **P0940**), components, UX notes, sitemap/URL inventory.

4. **Auth + cart/checkout (with consent).** Logged in as the account owner ("Kennedy") via SMS OTP
   (no password, no order). Captured authenticated homepage + empty cart (3-step indicator:
   Cart Summary → Delivery Details → Payment). The *populated* cart + Delivery/Payment steps could
   not be captured: the browser kept 502-ing, and MYDAWA's cart did not persist across a hard
   navigation in this tool.

5. **The duplicate-image bug.** During the flaky session the browser repeatedly reset to the
   logged-out `/login` screen; my "copy latest screenshot" step then saved that *same* login page
   over several intended captures (offers/register/search/cart-gate). Result: of 26 PNGs, only
   **11 were unique** — 11 were identical login pages. Consolidation (below) collapsed these and
   `screenshots-all/MANIFEST.md` documents exactly which intended pages were lost.

6. **Consolidation (your request).** Collapsed all screenshots into `screenshots-all/` (deduped,
   with manifest) and all markdown into `markdown-all/`. Added `MASTER.md` combining all 19 per-page
   docs into one file. Commit `fac42bf`.

7. **Current state.** The managed browser backend is in a sustained 502 outage, so the remaining
   live captures (full category/condition/brand crawl, populated checkout, mobile/tablet) are blocked
   until it recovers or `scripts/cap.py` runs on a capable host.

---

## 3. What's pending / remaining

### A. Live content not yet fetched (browser was down / reset-bug losses)
- **Re-capture the clobbered pages** (highest priority): `offers`, `register`, `search-results`,
  `search-no-results`, `cart-login-gate`, `auth-gate` were overwritten by the login-page duplicate.
- **Full category crawl** (15 category roots) — text + screenshots per category.
- **Full condition crawl** (40+ condition roots).
- **Brand pages** (6,500+ — sample a representative set).
- **Healthcare pages**: /ivtherapy, /patatiba, /prep, /pep, /sexualwellness, /familyplanning,
  /health-center, /mzimaprogram, /vitamin-quiz, /submit-a-prescription.
- **Info/legal**: /who-we-are, /quality-statement, /careers, /terms-conditions, /privacy-cookies,
  /disclaimer, /copyright, /help-center/faq, /contact-us, /return-policy, /pharmacovigilance,
  /upload-shopping-list.
- **/flash-sale** dedicated page.

### B. Shopping journey (auth-gated, owner-consented)
- Populated cart, **Delivery Details** step, **Payment** step (stop before placing any order).
- Account dashboard / orders / prescriptions pages.

### C. Device matrix (cannot be done via managed browser tool)
- **Tablet (768 px) and Mobile (390 px)** screenshots for every key page — only `scripts/cap.py`
  on a host with egress + Playwright can produce these.

### D. README "entire site" crawl
- Fold the full live crawl (A) into this README so it becomes the single complete content document.

---

## 4. How to finish (reproducibility)

- **Managed-browser passes** (when backend is healthy): resume section A/B above; commit incrementally.
- **Complete device matrix + gated areas**: `python3 scripts/cap.py all` on a host with egress +
  Playwright. Gated routes use a logged-in `MYDAWA_STATE` (storage_state JSON). Idempotent
  (skip-existing), full-page shots, 1920/834/390 viewports. No real order is placed by the script.
- **Safety constraints**: no real purchase; auth only with owner consent; public content only;
  do not access non-public data.

---

## 5. Site content (verified extracts) — quick reference

- **Identity**: MYDAWA, "for your health", PPB-authorized (code **P0940**), Kenya-wide delivery
  (standard "4–6 hours"). Campaign: "Back in Bloom" / "FREE DELIVERY ALL WEEKEND… NAIROBI AND MOMBASA".
- **Auth**: phone + SMS OTP only (no password, no CAPTCHA). /mycart → `/login?ReturnUrl=%2Fmycart`.
- **Catalogue**: 13,213 products; filters by Category (150+), Brand, Price, Discount; sort + 20/40/80/100.
- **Navigation**: Shop by Category · Shop by Condition · Shop by Brand · Services · My Health Center;
  CTAs "Speak to a Doctor", "Upload Prescription".
- **Healthcare**: Telehealth (free phone consult), Mzima chronic care (diabetes/hypertension/etc.),
  IV therapy at home, Pata Tiba Na Thao, PrEP/PEP, family planning.
- **Branding**: primary magenta ~#e01070; neutral grey #f0f0f0; near-black #101020; teal/green
  healthcare accent. See `markdown-all/color-palette.md`.

> For the full per-section write-ups, see `markdown-all/` (or the combined `markdown-all/MASTER.md`).
> For the complete route map, see `routes.json`.
