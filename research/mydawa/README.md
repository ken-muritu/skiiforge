# MYDAWA — Complete Site Content Archive (README)

Research archive of **https://mydawa.com/** — Kenya's online pharmacy & health platform.
Produced by an automated documentation pass (Hermes Agent), 2026-07-25.

> STATUS: This master document consolidates all content captured this session.
> Live full-site crawl is **PENDING browser-backend recovery** (managed browser was in
> a sustained 502 outage at time of writing). Sections already verified from the live
> site are marked [VERIFIED]; sections pending live fetch are marked [PENDING].
> No real purchase was placed; auth was crossed only with the account owner's consent
> (SMS OTP) and only up to the cart/checkout boundary.

## 0. Site Identity
- Name: MYDAWA. Tagline: "for your health". Positioning: "Kenya's Most Trusted Online Pharmacy".
- Regulated: PPB (Pharmacy and Poisons Board of Kenya) "Authorized Pharmacy", Health Safety Code **P0940**.
- Delivery: Kenya-wide; standard delivery window "4-6 hours" cited on product pages. Campaign observed: "FREE DELIVERY ALL WEEKEND WITHIN NAIROBI AND MOMBASA" (MYDAWA "Back in Bloom", 1st–31st July).
- Auth model: **phone + SMS OTP only** (no password, no CAPTCHA). Cart/checkout/account are auth-gated.

## 1. Top Navigation (icon + label)
Shop by Category · Shop by Condition · Shop by Brand · Services · My Health Center.
Persistent CTAs: "Speak to a Doctor" (telehealth), "Upload Prescription".
Utility bar: logo, global search, delivery-location chip, Deals, Sign In/Account, cart.

## 2. Homepage [VERIFIED]
- Promo banner: "MYDAWA is Back in Bloom — your favourite health & wellness essentials… at lower everyday prices."
- Search module ("What Are You Looking For?") + trending chips: La Roche-Posay Anthelios UVMune 400 SPF50, PEP Tablets 90's, Mariprist, La Roche Lipikar Baume AP+M, CeraVe Foam Cleanser, Postinor 2, CeraVe Moisturizing Lotion, Zelaton 15 Gel, NOW Magnesium Glycinate, La Roche-Posay Anthelios Shaka Spray.
- "Get Started" tiles (15): Femvive, Reproductive Health & Sexual, Supplements & Nutrition, Medical Devices, New on MYDAWA, Snacks & Drinks, Mum & Baby, Offers, Pata Tiba Na Thao, Health Conditions, Family Planning, IV Therapy, Beauty & Skin Care, Personal Care, Dermatological Skincare.
- BLOOM FLASH SALES: live countdown + "View All". Sample items (name · was · now KES): Dewpoint's Activated Charcoal Soap 150g 470/414; Dr Organic Pro Collagen Dragons Blood Moisturiser 3,990/3,591; Yves Rocher Repair Lotion 390ml 2,798/2,519; Aunt Jackie's Grapeseed Hair Shine Boss 118ml 1,879/1,654; Nascita Make-Up Angled Powder Brush 896/789; Dermol Emollient Cream 500ml 2,320/2,042; Nascita Cleaning Sponge 202; Revlon Super Lustrous Lipstick Black Cherry 1,678/1,477; Rexona Invisible Black&White Deo 741/653; Dr Organic Ageless Cleansing Balm 2,610/2,297.
- "Get 400 KES OFF Your Next Order" — Share Your Shopping List (Skincare, Baby Care, Mothercare, Haircare, Wellness, Personal Care; JPG/PNG/PDF ≤20MB; min spend KSh 2,000; voucher 15 days).
- Supplement Finder ("Not sure which supplements are right for you?") — goals: Energy, Immunity, Sleep, Gut Health, Skin & Hair, Bone & Joint → /vitamin-quiz.
- Product grids: Recommended For You, Offers For You, New on MYDAWA, Popular Sun Care.
- My Health Center tabs: Chronic Conditions, Sexual & Reproductive Health, IV Therapy, Pata Tiba Model, Telehealth.

## 3. Catalogue [VERIFIED]
- /products: "Showing 20 of **13,213 products**". Filter sidebar: Category (150+ checkboxes), Brand, Price, Discounts. SORT: Recommended, Popularity, Price Low→High, Price High→Low, Offers, New Products. SHOW per page: 20/40/80/100. Grid/list toggle. 4-col grid.
- Shop by Category & Shop by Condition open a filtered listing (NOT a hover menu).
- /brands: A–Z brand index (6,500+ brands), live "Search brands…" filter, 5-col grid. Brand pages: /brand/<slug>.

### Shop by Category roots (15) [VERIFIED]
beauty-and-skin-care · dermatological-skincare · family-planning · femvive · health-conditions · iv-therapy · medical-devices · mum-and-baby · new-on-mydawa · offers · pata-tiba-na-thao · personal-care · reproductive-health-and-sexual · snacks-and-drinks · supplements-and-nutrition

### Shop by Condition roots (40+) [VERIFIED]
allergies-allergic-reactions · anti-inflammatory-conditions · bladder-and-urinary-health · blood-and-circulation-health · bone-joint-and-muscle-health · brain-and-nerve-conditions · cancer-care · cold-and-flu · dependence · diabetes · diagnostic-tests · emergency-care · eye-and-ear-conditions · foot-conditons · gastrointestinal-conditions · heart-conditions · hemorrhoidsvaricose-veins · hypertension · immunosuppressants · infections · insomnia · liver-and-kidney-conditions · malaria · mens-health · mental-health · motion-sickness · oral-conditions · pain-and-inflammation · pregnancy · respiratory-conditions · sickle-cell-disease · skin-conditions · thyroid-conditions · vaccines · weight-management · wellness-check-ups · wound-and-burn-care

### Product Detail [VERIFIED] (example: La Roche-Posay Anthelios Fluid UVMune 400 SPF50 50ml, KES 3,200)
Image gallery (1/3) + thumbnails · brand link · rating 4.7 (14 Ratings · 14 Reviews) · "In Stock" · "Standard Delivery: 4-6 hours" · "49/50 sold in the last 7 days" · Add To Cart + Wish List · OVERVIEW · accordions (How to use, Precautions & Disclaimer) · Customer Reviews (star distribution, sort Latest/Oldest/High/Low Rated, Helpful/Report, Load More) · Similar Products carousel.

## 4. Offers [VERIFIED] (/offer)
"Best Value Offers For You" grid (discount badges 5%–20%, "Add To Cart" or "Notify Me" for out-of-stock). "Sale Is Live" + "Shop Now" banner strip. "Offers By Categories" (10 tiles). "Smart Savings On Popular Brands" (Garnier, Nice & Lovely, MEGA, Holland & Barrett, Nivea, Eucerin, Dove, La Roche-Posay, Molfix, Bio-Oil).
- /flash-sale [PENDING live fetch].

## 5. Search [VERIFIED]
Header + homepage search. Query via /products?search=<term> (reuses PLP shell). paracetamol → results grid; nonexistent term → empty grid (no dedicated no-results template observed). Autocomplete/type-ahead [PENDING].

## 6. Authentication [VERIFIED]
- /login & /register: phone + SMS OTP only. Country +254, mobile field, "Send code". No password, no CAPTCHA. /mycart → redirects to /login?ReturnUrl=%2Fmycart (auth gate).
- Authenticated (as account "Kennedy", with owner consent): header shows "Hello, Kennedy" + saved "Delivery to Kennedy Muritu". 

## 7. Shopping Journey [PARTIAL]
- Cart (/mycart): "My Cart", 3-step checkout indicator: (1) Cart Summary → (2) Delivery Details → (3) Payment. Empty state captured. Populated cart + Delivery + Payment steps [PENDING — backend outage + cart-not-persisting quirk]. No real order placed.
- Account dashboard / orders / prescriptions [PENDING].

## 8. Healthcare Services [PARTIAL]
- Telehealth (/telehealth) [VERIFIED]: "Talk to a Doctor on Phone for Free". Services: Prescription (validate/renew + delivery), Lab Tests from Home, Family Planning (incl. injectables at home), IV Therapy at Home, Chronic Care (Mzima: diabetes, hypertension, asthma). How It Works: Book free consult → call from provider → care plan → delivery. FAQ accordion. Booking CTAs gate to login.
- Mzima Chronic Care (/diabetes, /hypertension, /sicklecell, /lupus, /arthritis) [VERIFIED for /diabetes]: hero "Diabetes Care Made Simpler with Mzima" + Book a Consultation; condition explainer; "Why It Matters" complications; signs & symptoms; management; "How the Mzima Program Supports You" (care plan, free monthly follow-up calls, nutrition reviews, specialist check); FAQ; CTA.
- IV Therapy (/ivtherapy), Pata Tiba Na Thao (/patatiba), PrEP (/prep), PEP (/pep), Sexual & Reproductive (/sexualwellness), Family Planning (/familyplanning), Health Center (/health-center), Mzima Program (/mzimaprogram), Vitamin Quiz (/vitamin-quiz), Upload Prescription (/submit-a-prescription) [PENDING live fetch].

## 9. Branding [VERIFIED]
- Logo: "MYDAWA Logo" (alt), tagline "for your health".
- Color: primary brand MAGENTA ~#e01070 (gradient to #500040); neutral base light grey #f0f0f0, near-black #101020 text; teal/green healthcare identity (Mzima, delivery, In Stock). See markdown-all/color-palette.md (PIL pixel extraction).
- Icons: line icons (nav, search, location, cart, wishlist). Marketing imagery + app QR.

## 10. Footer (all pages) [VERIFIED]
App QR + "Scan QR to Download the MYDAWA Mobile App". Newsletter signup. Link columns:
- SHOP BY CATEGORY (15 roots)
- ABOUT US: Who We Are, Quality Statement, Careers, Terms & Conditions, Privacy Cookies, Disclaimer, Copyright
- HELP CENTER: FAQs, Contact Us, Shipping Policy, Return Policy, Pharmacovigilance
- READ & LEARN: My Health Center
- Authorized Pharmacy (PPB P0940) · App Store + Google Play badges.

## 11. Information / Legal routes [PENDING live fetch]
/who-we-are · /quality-statement · /careers · /terms-conditions · /privacy-cookies · /disclaimer · /copyright · /help-center/faq · /contact-us · /return-policy · /pharmacovigilance · /upload-shopping-list

## 12. Full Route Inventory (crawl map)
See markdown-all/url-inventory.md (926-link homepage graph + category/condition/brand trees)
and scripts/cap.py (parametric capture matrix: areas × desktop/tablet/mobile).
PENDING live crawl will extend README §3–§11 with every condition/category/brand/health
page's extracted text.

## 13. How to reproduce / complete
- Browser-tool passes: re-establish the managed browser; resume PENDING sections; commit incrementally.
- Full device matrix + gated cart/checkout/account: `python3 scripts/cap.py all` on a host
  with egress + Playwright (and MYDAWA_STATE for gated areas). Idempotent (skip-existing).
- Safety: no real purchase; auth only with owner consent; public content only.
