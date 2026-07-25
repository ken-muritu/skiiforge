# Capture Status & Environment Notes (LIVE)

Captured: 2026-07-25. Operator: Hermes Agent.

## Constraints (hard)
- Sandbox egress allow-lists only GitHub/npm/Cloudflare; mydawa.com HTTPS is
  TLS-blocked from the sandbox. Only the managed browser tool (Browserbase infra)
  reaches the site, and it renders a FIXED ~1512px desktop viewport with NO device
  emulation (confirmed: window.resizeTo has no effect; no Playwright/Puppeteer/CDP
  handle). So genuine 390/768px screenshots are NOT producible here.
- Managed browser backend is intermittently 502 (transient outages during runs).

## DONE this session (real content + DESKTOP screenshots, all non-zero bytes)
Screenshots (desktop 1512px): homepage, products PLP, category listing (skincare),
PDP (La Roche-Posay Anthelios), diabetes/Mzima landing, brands index, nav panel,
offers page, login page, register page, search-results (paracetamol),
search-no-results, cart-gated-login-redirect, telehealth.  (14 unique PNGs)
Content (markdown, all non-zero): homepage, products-catalogue, brands-index,
product-detail-example, pharmacy-services, catalogue-and-filtering, navigation,
sitemap, url-inventory, components, ux-notes, branding (color + notes), README,
offers-page, auth-pages, search-experience, telehealth.  (19 md files)
Objective color palette from homepage pixels (PIL).
scripts/cap.py — parametric Playwright capture script (full route matrix +
1920/834/390 viewports, idempotent resume) for running where egress + emulation work.

## KEY FINDINGS
- Catalogue: "Showing 20 of 13,213 products"; /brands exposes 6,500+ brands.
- Auth: OTP-only (mobile + SMS). /login and /register are phone-entry forms, NO
  password, NO CAPTCHA. /mycart REDIRECTS to /login?ReturnUrl=%2Fmycart => cart +
  checkout + account are AUTH-GATED. Captured the gate, did NOT cross it.
- Telehealth is publicly readable; booking CTAs likely gate to login.
- PPB "Authorized Pharmacy" Health Safety Code: P0940 (corrected from earlier P0500).
- "Notify Me" = out-of-stock state on offers.

## PENDING (resume via browser tool, or run scripts/cap.py on capable host)
- [ ] Remaining category PLPs (14 of 15) + condition PLPs (40+)
- [ ] More product detail samples
- [ ] Info/legal pages (who-we-are, terms, privacy, faq, contact, return, pharmacovigilance)
- [ ] IV therapy, patatiba, prep, pep, sexualwellness, familyplanning, health-center,
      mzimaprogram, vitamin-quiz, submit-a-prescription
- [ ] Cart/checkout/account INTERIORS — require login as kenhopkins001@gmail.com with
      user-supplied OTP. NOT performed (no real order). Do via cap.py with MYDAWA_STATE.
- [ ] Mobile (390) / tablet (768) shots — require device emulation (cap.py).

## Resume
1) Browser tool: re-establish, continue PENDING public pages; commit incrementally.
2) cap.py (Option C): run on a host with egress + Playwright for full device matrix
   and gated areas (set MYDAWA_STATE after logging in as the user with their OTP).

## Safety
No real purchase. No auth bypass. Public content only; gated areas need user consent.


## UPDATED 2026-07-25 (authed session)
- LOGGED IN as Kennedy (kenhopkins001@gmail.com) via SMS OTP with user consent.
  Captured: authenticated homepage (Hello, Kennedy / Delivery to Kennedy Muritu),
  empty cart (3-step checkout indicator: Cart Summary -> Delivery Details -> Payment).
- PENDING (backend 502 outage hit mid-session): populated cart (add item did not
  persist into /mycart), Delivery Details step, Payment step, account dashboard/
  orders/prescriptions. Resume when browser backend recovers; still authed (cookie
  session should persist). NO real order will be placed.
