# UX Notes — Objective Observations (2026-07-25)

Based on captured pages: homepage, /products (PLP), product detail, /brands,
/diabetes (Mzima). Observations of the interface, not copied marketing copy.

## Navigation patterns
- Top utility bar: logo, global search ("Search for Medication & Products."), delivery-location chip (default 80100, Mombasa), Deals, Sign In, cart.
- Primary nav is icon+label triggers: Shop by Category, Shop by Condition, Shop by Brand, Services, My Health Center.
- Two persistent high-intent CTAs: "Speak to a Doctor" and "Upload Prescription".
- "Shop by Category"/"Shop by Condition" navigate to a full filterable listing page (left sidebar + grid), NOT a hover mega-menu. Listing-first pattern.
- Breadcrumbs on interior pages (Home > Products > ...).

## Layout patterns
- Homepage: long vertical scroll of modules (promo banner -> search -> Get Started tiles -> Flash Sales carousel -> Share List promo -> Supplement Finder -> Recommended/Offers/New/Sun Care grids -> My Health Center tabs -> footer).
- PLP: two-column (sticky filter sidebar + 4-col grid, 20/page; 40/80/100 options).
- PDP: two-column (gallery left, info right) on desktop; reviews + similar below.
- Consistent footer: app QR, newsletter, four link columns, PPB "Authorized Pharmacy" badge, store badges.

## Reusable UI patterns
- Product card: image (wishlist heart top-right) + name + price (strikethrough old when discounted) + colored Add To Cart.
- Flash-sale badge ("12% Off", "20% Off") + live countdown timer.
- Accordions for FAQ and PDP "How to use" / "Precautions".
- Review block: star distribution, sort (Latest/Oldest/High/Low Rated), per-review Helpful/Report, Load More.
- Cart preview dialog ("Added to Cart", View Cart / Checkout) on add.
- Floating pink help button fixed to right edge.

## Conversion flow
- Strong "Book a Consultation" / "Speak to a Doctor" prompts throughout healthcare.
- Promotions: Bloom Flash Sales (countdown), 400 KES OFF shopping-list voucher, brand-day promos.
- Delivery reassurance: "Standard Delivery: 4-6 hours", "In Stock", "X sold in last 7 days".

## Search UX
- Header search + dedicated homepage search module ("What Are You Looking For?") with trending chips.
- PLP SORT (Recommended/Popularity/Price/Offers/New) and filter sidebar = sorted/filtered browse.
- Empty/autocomplete/no-results states: PENDING screenshot capture (browser outage).

## Mobile UX
- Could NOT be empirically captured (browser renders fixed ~1512px desktop; no device emulation available). Site promotes a mobile app heavily and uses fluid grids, implying responsive design; true 390/768px shots pending a configurable browser.

## Accessibility (visual)
- High-contrast text on white; large tappable CTAs; image alt text present (e.g. "MYDAWA Logo", brand names).
- Color-only status ("In Stock" green) should be verified for non-color cues.
- No CAPTCHA on public browsing; auth (login/OTP) is the gated boundary.

## Design-system observations
- Dual identity: magenta/pink brand color (primary CTA, Bloom campaign) + teal/green healthcare/trust color (Mzima program, delivery icons). Neutral white/light-grey base.
- Rounded cards, soft shadows, generous spacing; friendly health-and-wellness tone.
- Typography: clean sans-serif (specific family to be confirmed from CSS).
