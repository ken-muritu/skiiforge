# DueDiligenceMyDawa — MYDAWA Executive Report & Due Diligence

> **Combined document.** This file merges two companion assessments of https://mydawa.com/ produced from the `research/mydawa/` archive (2026-07-25):
> - **Part A — Comprehensive Executive Platform Report** (what the platform is, architecture, UX, use cases, roadmap, support).
> - **Part B — Due Diligence Assessment** (regulatory/compliance, security, privacy, operational resilience, findings register, live black-box pass).
>
> **Evidence discipline:** both parts are grounded *only* in the captured sources (markdown-all/MASTER.md, per-page docs, screenshots-all/MANIFEST.md, routes.json) and, for Part B's live section, direct navigation of mydawa.com. No external knowledge or fabricated findings. Items marked **[Not documented / Cannot assess]** are evidence gaps, not assertions about the live platform. No real purchase was placed; auth was crossed only with owner consent and only up to the cart/checkout boundary.

## Contents

- **Part A — Executive Platform Report**
  - 1. Executive Summary
  - 2. Platform Architecture & Features
  - 3. User Experience & Workflow
  - 4. Security, Compliance & Reliability
  - 5. Use Cases & Applications
  - 6. Roadmap & Future Vision
  - 7. Support & Resources
  - 8. Cross-Document Analysis
  - 9. Capture Status & Limitations
  - 10. Conversation Log (prompt → action)
- **Part B — Due Diligence Assessment**
  - 1. Executive DD Summary
  - 2. Regulatory & Compliance Posture
  - 3. Security Assessment (observable surface)
  - 4. Privacy & Data-Protection
  - 5. Operational & Business Resilience
  - 6. Data-Quality & Methodology Risk
  - 7. Findings Register
  - 8. Recommendations
  - 9. Conclusion
  - 10. LIVE Due-Diligence Pass (navigated mydawa.com)

---

# PART A — Comprehensive Executive Platform Report

## 1. Executive Summary

MYDAWA is presented in the captured sources as **Kenya's online pharmacy and health platform**,
positioned as *"Kenya's Most Trusted Online Pharmacy"* with the tagline *"for your health."*
The platform combines e-commerce for medicines, wellness and personal-care products with
**healthcare services** — including telehealth (phone consults), chronic-care management
(the "Mzima" program), IV therapy at home, family planning, and prescription upload.

### Platform mission / vision / value proposition (as expressed in sources)
- **Mission & value proposition:** Provide health and wellness essentials online with
  delivery across Kenya; a captured campaign message reads *"MYDAWA is Back in Bloom — your
  favourite health & wellness essentials are all available, at lower everyday prices."*
- **Trust signal:** The site presents itself as a PPB (Pharmacy and Poisons Board of Kenya)
  *"Authorized Pharmacy"* displaying health-safety code **P0940**.
- **Convenience:** Standard delivery window cited on product pages is *"4–6 hours"*; a campaign
  offered *"FREE DELIVERY ALL WEEKEND WITHIN NAIROBI AND MOMBASA"* (MYDAWA "Back in Bloom", 1st–31st July).

### Target users
- General consumers seeking medicines, supplements, personal care, baby care, mothercare,
  haircare, wellness.
- Patients managing chronic conditions (diabetes, hypertension, asthma, etc.) via Mzima.
- Users wanting remote care (telehealth phone consults, lab tests from home, family planning at home).
- (Account-owner observation during capture: a logged-in session shows a saved delivery address
  "Kennedy Muritu" and a personalized "Offers For You" module.)

### Core problems being solved
- Access to medicines and health products with home delivery (Kenya-wide; "4–6 hours" standard).
- Access to licensed pharmacy oversight (PPB authorization, code P0940).
- Remote healthcare access (free phone consults; care at home for labs, family planning, IV therapy).
- Chronic-condition support beyond dispensing (Mzima program: care plans, follow-up calls, nutrition reviews).

### Strategic positioning
- Hybrid **retail pharmacy + digital health services** marketplace.
- Auth model is **phone + SMS OTP only** (no password, no CAPTCHA observed) — lowering sign-up friction.
- Cart/checkout/account are **auth-gated** (`/mycart` → `/login?ReturnUrl=%2Fmycart`).

### High-level architecture
**[Not documented in provided sources]** — the captured documentation is a *front-end / content*
archive (pages, components, copy, routes, branding). It does **not** include backend architecture,
technology stack, infrastructure, or data models. The only engineering artifact present is
`scripts/cap.py` (a documentation capture script), which is *not* part of MYDAWA's own system.

### Business objectives (inferred only from observed UI/copy — not a stated strategy doc)
- Drive repeat purchase via personalized "Offers For You", "Share Your Shopping List" voucher
  (400 KES off, min spend KSh 2,000, 15-day validity), and flash sales with countdowns.
- Expand into managed care (Mzima chronic-care program, telehealth).

### Why the platform exists (from observed copy)
- To make health & wellness essentials available online at "lower everyday prices" with delivery.

### Key Takeaways
- MYDAWA is an online pharmacy + health-services platform for the Kenyan market.
- Regulated/authorized by PPB (code P0940); standard delivery "4–6 hours."
- Three intertwined pillars: **product commerce**, **telehealth**, **chronic/home care (Mzima)**.
- Auth is phone-OTP only; commerce flows are gated behind login.
- This report's sources are a *documentation capture*, not MYDAWA's internal engineering specs;
  backend/stack/compliance details beyond PPB are not in-scope of the provided documents.

---

## 2. Platform Architecture & Features

> **Architecture note.** The provided sources document the **information architecture** (routes,
> navigation, page modules) and **UI components**, not the system/software architecture. Items
> such as technology stack, infrastructure, APIs, and integrations are **[Not documented in
> provided sources]** unless a UI surface implies them (e.g., an "Upload Prescription" feature).

### 2.1 Information architecture (as captured)
Top-level navigation (icon + label): **Shop by Category · Shop by Condition · Shop by Brand ·
Services · My Health Center**. Persistent CTAs: **"Speak to a Doctor"** (telehealth) and
**"Upload Prescription"**. Utility bar: logo, global search, delivery-location chip, Deals,
Sign In/Account, cart.

Catalogue scale: **13,213 products** displayed at `/products` ("Showing 20 of 13,213 products").
Brand index: **6,500+ brands** at `/brands`. Shop-by-Category roots: **15**. Shop-by-Condition
roots: **40+**.

### 2.2 Core Features (documented)

#### Homepage
- **Purpose:** Primary entry/landing and discovery surface.
- **Modules observed:** top promo banner; search module ("What Are You Looking For?") with trending
  chips; 15 "Get Started" category tiles; "BLOOM FLASH SALES" with live countdown + "View All";
  "Get 400 KES OFF Your Next Order — Share Your Shopping List"; Supplement Finder
  ("Not sure which supplements are right for you?") with goal chips (Energy, Immunity, Sleep, Gut
  Health, Skin & Hair, Bone & Joint) → `/vitamin-quiz`; product grids (Recommended For You, Offers
  For You, New on MYDAWA, Popular Sun Care); My Health Center tabs (Chronic Conditions, Sexual &
  Reproductive Health, IV Therapy, Pata Tiba Model, Telehealth).
- **Share Your Shopping List:** accepts JPG/PNG/PDF ≤20MB; one reward per customer; voucher valid
  15 days; minimum spend KSh 2,000.

#### Products Catalogue (`/products`)
- **Filters (left sidebar, collapsible):** Category (150+ checkboxes), Brand, Price, Discounts.
- **Result controls:** SORT (Recommended, Popularity, Price Low→High, Price High→Low, Offers, New
  Products); SHOW per page (20/40/80/100); grid/list toggle; 4-column grid.
- **Shop by Category / Condition** open a filtered listing (not a hover menu).

#### Product Detail (example: La Roche-Posay Anthelios Fluid UVMune 400 SPF50 50ml, KES 3,200)
- Image gallery (1/3) + thumbnails; brand link; rating **4.7** (14 Ratings · 14 Reviews);
  "In Stock"; "Standard Delivery: 4–6 hours"; "49/50 sold in the last 7 days"; **Add To Cart** +
  **Add to Wish List**; OVERVIEW; accordions (How to use, Precautions & Disclaimer); Customer
  Reviews (star distribution, sort Latest/Oldest/High/Low Rated, Helpful/Report, Load More);
  Similar Products carousel.

#### Brands Index (`/brands`, `/brand/<slug>`)
- A–Z brand index (6,500+ brands), live "Search brands…" filter, 5-column grid; per-brand pages.

#### Offers & Flash Sales (`/offer`, `/flash-sale`)
- "Best Value Offers For You" grid (discount badges 5%–20%; "Add To Cart" or "Notify Me" for
  out-of-stock). "Sale Is Live" + "Shop Now" banner. "Offers By Categories" (10 tiles). "Smart
  Savings On Popular Brands" (Garnier, Nice & Lovely, MEGA, Holland & Barrett, Nivea, Eucerin,
  Dove, La Roche-Posay, Molfix, Bio-Oil). `/flash-sale` dedicated page **[PENDING live fetch]**.

#### Search (`/products?search=<term>`)
- Reuses the PLP shell. `paracetamol` → results grid; nonexistent term → empty grid (no dedicated
  no-results template observed). Autocomplete/type-ahead **[Not documented]**.

#### Authentication (`/login`, `/register`)
- **Phone + SMS OTP only.** Country +254, mobile field, "Send code". No password, no CAPTCHA.
- `/register` mirrors the OTP-mobile entry ("Enter your mobile number to get started…").
- Auth-gate: `/mycart` redirects to `/login?ReturnUrl=%2Fmycart`.

#### Shopping Journey / Cart (`/mycart`)
- "My Cart" with a **3-step checkout indicator**: (1) Cart Summary → (2) Delivery Details →
  (3) Payment. Empty state: "Your Cart Is Empty" + "Start Shopping !".
- Populated cart + Delivery + Payment steps **[PENDING — not captured]**. No real order placed.

#### Telehealth (`/telehealth`)
- "Talk to a Doctor on Phone for Free". Services: Prescription (validate/renew + delivery), Lab
  Tests from Home, Family Planning (incl. injectables at home), IV Therapy at Home, Chronic Care
  (Mzima: diabetes, hypertension, asthma). **How It Works:** Book free consult → call from provider
  → care plan → delivery. FAQ accordion. Booking CTAs gate to login.

#### Mzima Chronic Care (`/diabetes`, `/hypertension`, `/sicklecell`, `/lupus`, `/arthritis`)
- (Verified for `/diabetes`) hero "Diabetes Care Made Simpler with Mzima" + Book a Consultation;
  condition explainer; "Why It Matters" (complications); signs & symptoms; management; "How the
  Mzima Program Supports You" (care plan, free monthly follow-up calls, nutrition reviews,
  specialist check); FAQ; CTA.

#### Other healthcare routes (links present, **[PENDING live fetch]**)
`/ivtherapy`, `/patatiba`, `/prep`, `/pep`, `/sexualwellness`, `/familyplanning`, `/health-center`,
`/mzimaprogram`, `/vitamin-quiz`, `/submit-a-prescription`.

#### Footer (all pages)
- App QR + "Scan QR to Download the MYDAWA Mobile App"; newsletter signup. Columns: SHOP BY
  CATEGORY (15 roots); ABOUT US (Who We Are, Quality Statement, Careers, Terms & Conditions,
  Privacy Cookies, Disclaimer, Copyright); HELP CENTER (FAQs, Contact Us, Shipping Policy, Return
  Policy, Pharmacovigilance); READ & LEARN (My Health Center); Authorized Pharmacy (PPB P0940);
  App Store + Google Play badges.

### 2.3 Functional Modules (documented)
- **Authentication** — phone-OTP login/register; auth-gates cart/checkout/account.
- **Catalogue & Search** — 13,213 products, category/condition/brand browse, filtered PLP, query search.
- **Cart & Checkout** — 3-step indicator; empty state captured; remainder pending.
- **Telehealth** — free phone consult + service menu.
- **Chronic Care (Mzima)** — condition programs with care plans/follow-up.
- **Prescription Upload** — "Upload Prescription" CTA (`/submit-a-prescription`) **[PENDING fetch]**.
- **Offers/Flash Sales** — discount grids, countdowns, brand savings.
- **Account** — authenticated homepage personalization; dashboard/orders/prescriptions **[PENDING]**.
- **Notifications / Billing / Reporting / Analytics / Admin / CRM / AI / Automation / APIs /
  Mobile apps / Offline** — **[Not documented in provided sources]** (the site references *mobile
  apps* via App Store/Google Play badges, but no technical mobile/API/offline details are captured).

### 2.4 Key Takeaways
- The platform is a content-rich commerce + health-services front end organized around Category,
  Condition, Brand, Services, and My Health Center.
- Catalogue is very large (13,213 products; 6,500+ brands); filtering and sorting are first-class.
- Commerce is gated behind phone-OTP auth; checkout is a 3-step flow.
- Health services (telehealth, Mzima, IV therapy, family planning) are a distinct, prominent pillar.
- Backend/system architecture, tech stack, and most integrations are outside the provided sources.

---

## 3. User Experience & Workflow

### 3.1 User Types (mentioned/implied in sources)
- **Guest / shopper** — browses, searches, views offers; must log in to cart/checkout.
- **Registered/authenticated customer** ("Kennedy" observed) — personalized offers, saved delivery
  address, cart/checkout/account access.
- **Patient (chronic care)** — enrolls in Mzima, books telehealth.
- **Healthcare seeker** — uses telehealth, lab tests at home, family planning at home, IV therapy.
- **Admin / staff / clinician / partner** — **[Not documented in provided sources]**.

### 3.2 User Journey
- **Registration / Login:** phone number → "Send code" → SMS OTP → verify. No password.
- **Onboarding:** **[Not documented]** beyond account creation via OTP.
- **Daily usage / Navigation:** top nav (Category/Condition/Brand/Services/Health Center);
  global search; homepage discovery tiles and grids.
- **Primary workflow (shop):** browse/search → PDP → Add To Cart → (login gate if needed) →
  cart (3-step) → Delivery → Payment. *Populated cart + Delivery + Payment not captured.*
- **Primary workflow (care):** Telehealth "Book a Consultation" → free phone consult → care plan →
  delivery; Mzima enrollment per condition.
- **Administrative workflows:** **[Not documented]**.
- **Collaboration workflows:** **[Not documented]**.
- **Exit points:** footer links, app-store badges, live-chat widget, "Start Shopping !" from empty cart.

### 3.3 UX Philosophy (from observed UI)
- **Design principles (objective, from pixel extraction):** primary brand **magenta ~#e01070**
  (gradient to #500040); neutral base light grey **#f0f0f0**; near-black text **#101020**;
  teal/green healthcare identity (Mzima, delivery, "In Stock").
- **Accessibility (visual):** **[Not documented beyond color extraction]** — no ARIA/contrast
  findings in sources.
- **Responsiveness / Mobile:** The managed capture tool rendered a **fixed ~1512 px desktop**
  viewport with **no device emulation**; therefore true mobile/tablet behavior is **[Not
  documented]**. The site advertises mobile apps (App Store / Google Play).
- **User-centered decisions:** low-friction OTP auth; personalized "Offers For You"; "Notify Me"
  for out-of-stock; free telehealth consult.

### 3.4 Key Takeaways
- Friction-light entry (OTP, no password); commerce gated behind login.
- Strong discovery via category/condition/brand + search + homepage modules.
- Health services are woven into the main nav and homepage, not bolted on.
- True responsive/mobile UX could not be verified from the provided (desktop-only) capture.

---

## 4. Security, Compliance & Reliability

> **Important.** The provided sources are a **front-end content/UX archive**. They contain **no**
> backend security, infrastructure, monitoring, backup, or disaster-recovery documentation.
> Statements below are limited to what the captured UI/source explicitly shows.

### 4.1 Security (observed)
- **Authentication:** phone + SMS OTP (no password, no CAPTCHA observed). Implication: account
  possession is tied to SIM/phone control.
- **Authorization:** cart/checkout/account are auth-gated (redirect to `/login?ReturnUrl=…`).
- **Encryption / data protection / secrets / API security / infrastructure security:**
  **[Not documented in provided sources]**.
- **Pharmacovigilance** is listed as a footer HELP CENTER link (a medicines-safety function), but
  its implementation is **[Not documented]**.

### 4.2 Compliance (referenced)
- **PPB (Pharmacy and Poisons Board of Kenya)** — MYDAWA presents as an "Authorized Pharmacy" with
  health-safety code **P0940** (observed in footer + captured vision check).
- Other legal/governance pages exist as links: Terms & Conditions, Privacy Cookies, Disclaimer,
  Copyright, Quality Statement, Return Policy, Shipping Policy — but their contents are
  **[Not documented]** (pending fetch).

### 4.3 Reliability (observed/limitations)
- **Availability:** During capture, the managed browser backend exhibited **repeated 502 outages**;
  the site itself was reachable when the tool was healthy.
- **Monitoring / Logging / Backups / DR / Scalability / Fault tolerance:** **[Not documented]**.
- **Error handling (observed UX):** empty search results render an empty grid (no dedicated
  no-results template noted); cart empty-state messaging; "Notify Me" for out-of-stock.

### 4.4 Key Takeaways
- Only front-end, user-facing trust signals are documented (PPB P0940, OTP auth, auth-gated
  commerce, Pharmacovigilance link).
- No backend security, compliance certifications beyond PPB, or reliability engineering is in the
  provided sources — these are gaps to close with MYDAWA's internal documentation.

---

## 5. Use Cases & Applications

1. **Everyday medicine & wellness reordering**
   - Audience: general consumers. Problem: access to meds/personal care. Workflow: search/browse →
     PDP → cart → checkout. Capabilities: 13,213-product catalogue, filters, OTP auth, 3-step cart.
     Outcome: home delivery ("4–6 hours"). Value: convenience + PPB-authorized supply.

2. **Chronic condition management (Mzima)**
   - Audience: diabetes/hypertension/asthma patients. Problem: ongoing care continuity. Workflow:
     condition page → Book a Consultation → care plan + monthly follow-up calls + nutrition reviews
     + specialist check. Capabilities: Mzima program, telehealth. Value: managed care beyond dispensing.

3. **Remote consultation (Telehealth)**
   - Audience: anyone needing advice. Problem: access to a doctor. Workflow: "Speak to a Doctor" →
     free phone consult → care plan → delivery. Value: free, remote first-step care.

4. **At-home clinical services**
   - Audience: patients needing labs/family planning/IV therapy at home. Problem: clinic access.
     Workflow: service selection → booking (gates to login). Value: care delivered to home.

5. **Brand-led shopping**
   - Audience: brand-loyal shoppers. Problem: finding specific brands. Workflow: /brands A–Z or
     "Smart Savings On Popular Brands". Capabilities: 6,500+ brand index. Value: choice + savings.

6. **Deal-seeking**
   - Audience: price-sensitive shoppers. Workflow: /offer, BLOOM FLASH SALES (countdown), "Notify Me".
     Value: discounts 5%–20%, vouchers (400 KES off, min spend KSh 2,000).

### Key Takeaways
- MYDAWA spans transactional pharmacy commerce and longitudinal health services.
- Strong fit for the Kenyan market: delivery, PPB trust, OTP-low-friction, free telehealth.

---

## 6. Roadmap & Future Vision

- **Planned features / future architecture / product vision / partnerships / scalability goals:**
  **[Not documented in provided sources]**. The captured documentation is a point-in-time archive
  (2026-07-25) of the *existing* public + authenticated UI; it contains no roadmap, roadmap dates,
  or stated future direction.
- The only forward-looking *product* signals are live UI features themselves (Mzima expansion across
  conditions, telehealth, vitamin quiz, share-shopping-list voucher) — these are **current** features,
  not a stated roadmap.

### Key Takeaways
- No explicit roadmap is present in the provided sources; future-direction statements would require
  MYDAWA's internal/product strategy documents, which are outside this archive.

---

## 7. Support & Resources

- **Help Center (footer HELP CENTER):** FAQs, Contact Us, Shipping Policy, Return Policy,
  Pharmacovigilance. (Contents **[Not documented — pending fetch]**.)
- **Documentation / Knowledge Base / Community / Discord / GitHub / Tutorials:** **[Not documented in
  provided sources]** for the platform itself. (Note: this *archive* lives in a GitHub repo
  `ken-muritu/skiiforge`, but that is the research archive, not a MYDAWA support channel.)
- **App support:** "Scan QR to Download the MYDAWA Mobile App" (App Store + Google Play badges).
- **Live chat:** a floating chat widget is present on pages ("Open Live chat widget").
- **Contact:** "Contact Us" link present (content pending).

### Key Takeaways
- User-facing support surfaces observed: footer Help Center links, in-page live-chat widget, and
  mobile-app distribution. Detailed support content is not in the provided sources.

---

## 8. Cross-Document Analysis

The provided sources are mutually consistent and were produced by the same capture effort:
- `README.md` (master index), `markdown-all/MASTER.md` (19 per-page docs combined), the per-page
  `.md` files, `screenshots-all/MANIFEST.md`, and `routes.json` all describe the same site and the
  same capture date (2026-07-25).
- **No contradictions** were found across documents. The MANIFEST adds a critical honesty note: of
  26 captured PNGs only **11 were unique** (11 were identical logged-out login pages saved during
  browser 502/outage resets) — a documentation-quality caveat, not a platform contradiction.
- **Complementary detail:** `routes.json` enumerates 96 routes (15 categories, 40 conditions, 16
  healthcare, 12 info/legal, 5 account-gated, 6 sample products, 5 marketing) that the prose docs
  reference but do not individually expand.

---

## 9. Capture Status & Limitations (from "Capture Status" source)

- **Constraints (hard):** sandbox egress allow-lists only github/npm/Cloudflare; mydawa.com is
  TLS-blocked from the terminal. The *only* live path is the managed browser tool (fixed ~1512 px
  desktop, **no device emulation** — genuine 390/768 px shots impossible via that tool).
- **DONE (real content + desktop screenshots, all non-zero bytes):** homepage, PLP (13,213),
  category, PDP, diabetes/Mzima, brands, nav panel, offers, login, register, search (results +
  no-results), telehealth, authenticated homepage, empty cart.
- **KEY FINDINGS:** PPB code **P0940**; OTP-only auth; cart/checkout 3-step indicator; `/mycart`
  auth-gate; "Notify Me" out-of-stock UX; cart did not persist across hard navigation in the tool.
- **PENDING (resume via browser tool, or run `scripts/cap.py` on a capable host):**
  - Re-capture clobbered pages (offers/register/search/cart-gate overwritten by login-page dupes).
  - Full category (15), condition (40+), brand (6,500+ sample), healthcare, info/legal crawls.
  - Populated cart + Delivery + Payment steps (auth-gated; stop before order).
  - Account dashboard/orders/prescriptions.
  - Tablet (768 px) / Mobile (390 px) screenshots (only via `cap.py` with egress + Playwright).
- **Safety:** no real purchase; auth only with owner consent; public content only.

---

## 10. Conversation Log (prompt → action audit trail)

> Verbatim user prompts from this session, each paired with the action taken. (Pre-compaction
> prompts are not recoverable from tooling; this log begins at the earliest prompt retained.)

1. *"can't we find a way around mydawa just as we did with the above such that we have screenshots
   that capture the entire mydawa website?"* → Explained the prior 'way around' was cloning local git
   repos (github egress) — does not apply to a live TLS-blocked site; managed browser is the only
   path (fixed 1512px, no device emulation); proposed Options A/B/C.
2. *"3 to completion"* → Option 3: finish desktop capture via browser tool (A) AND build the Playwright
   `cap.py` + full route matrix (C). Captured offers, login, register, search-results, search-no-results,
   cart-gate, telehealth; wrote 19 content docs; committed `cap.py`.
3. *"let's proceed with what's remaining, ask me for the OTP I'll send you"* → Logged in as Kennedy via
   SMS OTP (consent). Captured authenticated homepage + empty cart (3-step indicator). 502 outages
   blocked populated cart/checkout.
4. *Mobile "+254 115594826" and OTPs "562661 / 878752 / 300186 / 167433"* → Supplied number + OTPs
   across attempts; blank-frame + 502 quirks required re-sends; final success used 167433. No order.
5. *"let's retry... ensure we complete to the end/successfully"* → Re-attempted gated capture; session
   had logged out (cookie lost in outage); re-logged in, added item, but cart did not persist across
   navigation. Paused; committed progress.
6. *"another thing, let's crawl the entire site (entire!) and put all the contents in the readme file
   but for now let's finish up"* → Built master README (verified/pending markers) + `routes.json` (96 routes).
7. *"can we place all screenshots in one folder (all!) then all md files in another (all!)"* →
   Consolidated `screenshots-all/` (11 unique PNGs + MANIFEST) and `markdown-all/`; discovered 26 PNGs →
   11 unique (11 identical login-page dupes from resets); removed old subfolders.
8. *"in the md folder, add a master md for all the mds (combine all their md files to one)"* → Created
   `markdown-all/MASTER.md` (all 19 per-page docs combined, 44 KB).
9. *"in this github.com/ken-muritu/skiiforge/tree/main/research/mydawa can you update the readme to
   include and capture all we have as of now to the core and how we got there, and what's pending/
   remaining"* → Rewrote README as master index (inventory + journey + pending + reproducibility).
10. *"maybe something to add, is right from the prompt I gave you (basically the chat log, coupled with
    what was done in the readme)"* → Appended Conversation Log (prompt → action) to README.
11. *"does the chat log include the prompts for the task right from the start? including the pasted txt
    ones"* → Clarified pre-compaction prompts are not recoverable from tooling (compaction removed them;
    session_search returned 0). Offered to reconstruct Phase 0 from artifacts or accept pasted verbatim.
12. *Pasted "Comprehensive Executive Platform Report Prompt" (meta-instruction to analyze ONLY provided
    sources, no invention) and: "in this case the platform is Mydawa, based on what we have as of now...
    commit and push to skillforge"* → This report generated strictly from `markdown-all/MASTER.md`,
    per-page docs, MANIFEST, and `routes.json`; committed to `ken-muritu/skiiforge` (the repo that
    exists; "skillforge" is not a repo under this account).

---

*End of report. All platform claims above are grounded in the captured MYDAWA research archive
(research/mydawa/, 2026-07-25). Items marked [Not documented in provided sources] are gaps in the
archive, not assertions about the live platform.*

---

# PART B — Due Diligence Assessment

## 1. Executive Due-Diligence Summary

MYDAWA presents as a regulated, PPB-authorized Kenyan online pharmacy with an integrated digital-
health layer (telehealth, chronic-care "Mzima", at-home services). From the *observable* surface, the
platform's consumer trust signals are reasonable (authorization code P0940, low-friction OTP auth,
auth-gated commerce). However, a rigorous DD cannot clear the platform on security, compliance, or
operational resilience because **the overwhelming majority of DD-relevant evidence (backend security,
data protection, infrastructure, personnel/access controls, financials, contracts) is outside this
archive**. The findings below separate *observed facts* from *assessment gaps*.

**Top-line:**
- ✅ Regulated posture is signalled (PPB Authorized Pharmacy, code P0940).
- ⚠️ Authentication relies on phone+OTP with **no password and no CAPTCHA observed** — a convenience/
  security trade-off whose server-side strength is unverifiable here.
- ⚠️ Commerce and health data are auth-gated, but the *enforcement mechanism, session management, and
  authorization model* are not assessable from the front end.
- ⚠️ Telehealth + prescription handling + chronic-care imply **sensitive health data (PHI)** processing;
  the legal basis, consent, and safeguards are **[Cannot assess]**.
- ⚠️ Operational resilience of the *capture path* was poor (repeated 502s) — this reflects the research
  tooling, not necessarily MYDAWA; still, no public status/observability surface was observed.
- ❌ No evidence available to assess: encryption at rest/in transit (beyond HTTPS assumption), secrets
  management, audit logging, backups/DR, third-party/subprocessor risk, financials, or litigation.

---

## 2. Regulatory & Compliance Posture

### 2.1 What is documented
- **PPB (Pharmacy and Poisons Board of Kenya)** — MYDAWA presents as an *"Authorized Pharmacy"* with
  health-safety code **P0940** (footer + vision-confirmed). This is the single strongest compliance
  signal in the archive.
- **Pharmacovigilance** is surfaced as a footer HELP CENTER link — indicating medicines-safety
  reporting is at least acknowledged as a function.
- **Legal/governance pages** exist as links: Terms & Conditions, Privacy Cookies, Disclaimer,
  Copyright, Quality Statement, Return Policy, Shipping Policy, Contact Us, FAQs. Their *contents* are
  **[Cannot assess — not fetched]**.

### 2.2 What cannot be assessed
- Data-protection compliance (e.g., Kenya's Data Protection Act 2019 / ODPC registration, lawful basis
  for processing health data, data-subject rights, retention) — **[Cannot assess]**.
- Medicine-dispensing legality per product class (prescription-only vs OTC enforcement online) —
  **[Cannot assess]** (no observation of prescription-validation workflow beyond a "Upload Prescription"
  CTA and a telehealth "Prescription … validate/renew" service line).
- Subprocessor / cross-border transfer agreements — **[Cannot assess]**.
- Certifications (ISO, SOC 2, PCI DSS for payments) — **[Cannot assess]**.

### 2.3 Compliance risk rating: **MEDIUM (inconclusive)**
Signal present (PPB) but insufficient evidence to confirm end-to-end regulatory adherence, especially
for health-data processing and prescription governance.

---

## 3. Security Assessment (observable surface)

### 3.1 Authentication & session
- **Mechanism observed:** phone number → "Send code" → **SMS OTP**; `/login` and `/register` are
  near-identical OTP-mobile entry screens. **No password field, no CAPTCHA** observed.
- **Implication (stated as a trade-off, not a confirmed vulnerability):** account takeover exposure is
  tied to **SIM-swap / SMS-interception** risk inherent to OTP-only auth. Whether MYDAWA implements
  binding, rate-limiting, OTP expiry, or step-up for high-risk actions is **[Cannot assess]**.
- **Auth-gating:** `/mycart` returns `302 → /login?ReturnUrl=%2Fmycart`, confirming server-side
  enforcement of the gate (good signal). How sessions are issued/stored/expired is **[Cannot assess]**.

### 3.2 Authorization & data exposure
- Cart/checkout/account are gated. During capture, an authenticated session revealed a *saved delivery
  address* ("Kennedy Muritu") and personalized "Offers For You" — i.e., authenticated state changes
  UI/data. **No evidence of broken access control** was observed, but exhaustive IDOR/horizontal-
  privilege testing was **not performed** (and is out of scope for a front-end archive).

### 3.3 Transport & infrastructure security
- **TLS/HTTPS:** the site is served over HTTPS (implied by capture success and standard practice) but
  **certificate posture, HSTS, CSP, and headers are [Cannot assess]** from the archive.
- **Encryption at rest, key management, secrets management, WAF, DDoS protection:** **[Cannot assess]**.
- **API security (auth, rate limiting, object-level authz):** **[Cannot assess]** — no API was tested.

### 3.4 Security risk rating: **MEDIUM (inconclusive)**
OTP-only auth is a known weaker pattern; absent server-side controls we cannot rate it lower. No
*confirmed* vulnerability, but material assurance gaps remain.

---

## 4. Privacy & Data-Protection Assessment

- **Data types implied:** identity (phone), contact/delivery address, order/prescription history,
  health conditions (chronic-care enrollment, telehealth), possibly payment instruments.
- **Consent & lawful basis:** the login screen references "Terms and Privacy Policy"; substantive
  consent mechanics are **[Cannot assess]**.
- **Sensitive health data:** telehealth, Mzima, family-planning, PrEP/PEP, and prescription upload all
  process **special-category health data** under typical regimes. The *safeguards, minimization,
  retention, and sharing* for this are **[Cannot assess]**.
- **Cookie/tracking:** "Privacy Cookies" link present; actual cookie/pixel behaviour **[Cannot assess]**.

**Privacy risk rating: MEDIUM-HIGH (inconclusive)** — high-sensitivity data is clearly handled, but the
controls protecting it are entirely outside the archive.

---

## 5. Operational & Business Resilience

- **Availability (of capture path):** repeated **502 outages** of the managed browser backend during
  capture. *Caveat:* this measures the research tooling, not provably MYDAWA's uptime. Still, no public
  status page or observability surface was observed.
- **Business model signals (from UI):** commerce margins + delivery; flash-sale/discount engine;
  voucher incentives (400 KES off, min spend KSh 2,000, 15-day); telehealth (free consult used as
  acquisition/retention); Mzima as a recurring-care/membership-style wedge. Financials, unit economics,
  funding, and churn are **[Cannot assess]**.
- **Supply/fulfilment:** "Standard Delivery: 4–6 hours", "FREE DELIVERY … NAIROBI AND MOMBASA" — implies
  a local fulfilment/pharmacy network. Capacity, SLAs, and partner pharmacies are **[Cannot assess]**.
- **Key-person / vendor concentration:** **[Cannot assess]**.

**Operational risk rating: MEDIUM (inconclusive)** — plausible model, but resilience and economics
unverifiable from the archive.

---

## 6. Data-Quality & Methodology Risk (of THIS archive)

This is a meta-risk about the evidence base itself, and it is the *one* area where we have hard,
confirmed findings:

- **Duplicate-screenshot defect (confirmed):** of **26** PNGs captured, only **11 were unique**;
  **11 were byte-identical copies of the logged-out `/login` page**, saved when the flaky browser
  reset to `/login` during 502/outage windows and overwrote intended captures (offers, register,
  search-results, search-no-results, cart-gate, auth-gate). Source: `screenshots-all/MANIFEST.md`.
  → *Impact on DD:* any conclusion relying on those "pages" would be unsound; they are excluded.
- **Coverage gaps (confirmed/candidate):** populated cart, Delivery/Payment steps, account
  dashboard/orders/prescriptions, and most healthcare/info/legal pages were **not captured** (outages
  + cart-not-persisting quirk). → *Impact:* DD cannot rely on those surfaces.
- **Front-end-only scope:** by construction, this archive cannot speak to backend/security/compliance
  substance. → *Impact:* all §2–§5 "Cannot assess" items are limitations of evidence, not clean bills.

**Methodology risk rating: MEDIUM** — the archive is internally honest (MANIFEST + capture-status
disclose these gaps) but is narrow; DD conclusions must be read as *provisional pending primary evidence*.

---

## 7. Findings Register

| # | Area | Finding | Severity | Evidence | Status |
|---|------|---------|----------|----------|--------|
| F1 | Compliance | PPB-authorized pharmacy, code P0940 | Positive | footer + vision | Confirmed |
| F2 | Auth | Phone+OTP only; no password/CAPTCHA observed | Medium | /login,/register | Confirmed (surface) |
| F3 | Auth | Server-side OTP controls (expiry/rate/step-up) | Unknown | — | Cannot assess |
| F4 | Access ctrl | /mycart server-redirects to /login | Positive | observed 302 | Confirmed |
| F5 | Privacy | Processes special-category health data | High (sensitivity) | telehealth/Mzima/PrEP/PEP | Confirmed (scope) |
| F6 | Privacy | Safeguards/lawful basis for health data | Unknown | — | Cannot assess |
| F7 | Security | TLS/headers/CSP/cert posture | Unknown | — | Cannot assess |
| F8 | Security | API/authz/rate-limit testing | Not performed | — | Out of scope |
| F9 | Resilience | Capture-path 502 outages | Low (tooling) | session log | Confirmed |
| F10 | Data quality | 11/26 PNGs duplicate login page | Medium (evidence) | MANIFEST | Confirmed |
| F11 | Coverage | Cart/checkout/account/most pages uncaptured | Medium | capture-status | Confirmed |
| F12 | Compliance | Pharmacovigilance function referenced | Positive (signal) | footer link | Confirmed (signal) |

Severity key: Positive = strength; Medium/High = risk or sensitivity requiring primary evidence to
resolve; Unknown/Cannot assess = not reachable from this archive.

---

## 8. Recommendations (to close the gaps)

These are *evidence-gathering* recommendations, not assertions of deficiency:

1. **Obtain MYDAWA's primary compliance artifacts:** PPB licence, Data Protection Act registration,
   Privacy Policy + Terms (full text), Pharmacovigilance SOP.
2. **Commission a backend/infra review:** TLS config, CSP, secrets management, audit logging, backups/DR,
   WAF/DDoS — outside any front-end archive.
3. **Assess auth robustness:** OTP expiry/rate-limiting, SIM-swap mitigations, step-up for prescription/
   payment actions, session lifetime.
4. **Map health-data flows:** lawful basis, consent, minimization, retention, subprocessor contracts
   (esp. telehealth, Mzima, PrEP/PEP, prescription upload).
5. **Re-run the capture to fill §6 gaps:** use `scripts/cap.py` on a host with egress + Playwright
   (and a logged-in `MYDAWA_STATE`) to capture populated cart, Delivery/Payment, account pages, and the
   full category/condition/brand/healthcare/info crawl — including tablet/mobile viewports.
6. **Re-capture the clobbered pages** (offers/register/search/cart-gate) lost to the duplicate-login bug.

---

## 9. Conclusion

From the *observable* surface, MYDAWA is a credibly-regulated (PPB P0940), convenience-oriented
pharmacy + digital-health platform with sensible auth-gating and a coherent care portfolio. **However,
this due-diligence pass is necessarily provisional:** the archive is front-end-only and desktop-only,
several commerce/account/healthcare surfaces were not captured, and core security/compliance/resilience
evidence is absent. No *confirmed* vulnerability or compliance failure was found, but **material
assurance gaps remain unresolved** and should be closed with primary evidence (items in §8) before any
reliance (investment, partnership, or integration) is placed on this assessment.

*Prepared 2026-07-25 from research/mydawa/ captured sources. Companion document:
`MYDAWA-EXECUTIVE-REPORT.md`. All findings are grounded in the archive; "[Cannot assess]" denotes
evidence gaps, not presumed deficiencies.*


---

## 10. LIVE Due-Diligence Pass (navigated mydawa.com, 2026-07-25)

> Added after a live black-box pass through the managed browser. Scope: front-end only, desktop
> viewport, no devtools/network inspector, no source access, no backend testing. The browser backend
> was unstable (intermittent 502/timeouts), so the live pass was partial; remaining probes are listed
> as PENDING. No login was performed in this pass (the earlier authed session from the capture effort
> is separate and documented in capture-status.md).

### 10.1 Confirmed live observations
- **Account route correction (finding F13):** `/account` returns a **404 ("Page Not Found")**, NOT an
  auth-gate redirect. The real account surfaces are enumerated in robots.txt: `/my-account`,
  `/My-Account`, `/my-orders`, `/my-profile`, `/order-issue`. *DD implication:* the earlier `routes.json`
  guess of `/account` was wrong; the production route namespace uses `my-account`/`my-orders` etc.
- **robots.txt discloses the internal API/route taxonomy (finding F14):** the file reveals (by name)
  the backend endpoint surface, including:
  - Transactional/gated: `/checkout`, `/mycart`, `/login`, `/home/login`, `/register`, `/My-Account`,
    `/my-account`, `/my-orders`, `/my-profile`, `/order-issue`, `/payment`, `/payment-status`,
    `/order-confirmation`, `/wishlist`.
  - **Internal API endpoints (named, "Disallow"):** `/linkeditem`, `/productsearch`, `/categorysearch`,
    `/brandsearch`, `/addcart`, `/notifyme`, `/addwishlistproduct`, `/getpickuporders`, `/regions`.
  - Search: `Disallow: /search?`.
  - Sitemap declared: `https://mydawa.com/sitemap.xml`.
  *DD implication:* this is **standard robots.txt practice** (not a vulnerability per se), but it does
  confirm a server-side API layer exists behind those paths and names its functions. The endpoints are
  not directly exercised here; whether they enforce auth/rate-limiting/object-level authorization is
  **[Cannot assess — not tested]**.
- **Homepage (live) confirmation:** "Get the App" dropdown, "Deals" nav link, and a **dynamic BLOOM
  FLASH SALES countdown** (observed ticking, e.g. "01h 15m 33s") — confirms time-sensitive promo logic
  is server/client-driven and live.

### 10.2 Probes attempted but BLOCKED by backend outage (PENDING)
- Fetch + parse `/sitemap.xml` (to enumerate real public URL scale and confirm the 13,213-product /
  6,500-brand figures against the declared sitemap).
- Read `/privacy-cookies` and `/terms-conditions` full text (compliance DD — lawful basis, cookies,
  health-data handling).
- Probe a named API endpoint (e.g., `/productsearch?...` or `/regions`) logged-out to observe auth/
  rate-limit behaviour (passive, non-destructive).
- Re-confirm auth-gate redirect on `/my-account` and `/mycart` while logged out.
- Re-capture the clobbered pages (offers/register/search/cart-gate) lost to the earlier duplicate-
  login defect.

### 10.3 Updated risk read (live)
- The live pass **raises no new confirmed vulnerability**, but it (a) corrects the account-route
  assumption, and (b) confirms a named internal API surface via robots.txt. The central DD conclusion
  is unchanged: **provisional**, because backend/authz/infra/API behaviour remains untested.
- Recommendation upgrade: a future pass should, with owner consent and a logged-in session, exercise
  `/my-account`, `/my-orders`, `/payment-status` for **broken-access-control / IDOR** checks (object-
  level authorization across orders), and should test the named API endpoints' auth requirements.
