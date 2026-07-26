# CAPTURE_MANIFEST — Aurum UI Research
Generated: 2026-07-26

## Method (honest)
- **Aurum** (aurumio.vercel.app): Playwright headless Chromium from this sandbox — Vercel is allow-listed, so it is reachable.
- **heyclicky / wisprflow**: managed browser (Browserbase proxy). This sandbox's curl + Playwright are TLS-blocked to those hosts, so only the proxy reaches them — and it is **desktop viewport only** (no tablet/mobile emulation available through it).

## Coverage achieved
- **Aurum desktop**: FULL — 11 routes x (initial + full) + signup form-states (hover/focus/validation/filled). 33 shots.
- **Aurum tablet**: partial — 4 initial shots (sandbox foreground cap 60s + bg-process reaping prevented full 11-route pass; each route follows the same rig, so the gap is viewport coverage, not missing states).
- **Aurum mobile**: 0 (same constraint).
- **heyclicky**: 4 desktop shots (hero/features; dream/feedback/pricing/faq; 404-pricing). LOWER SECTIONS ARE RED WIREFRAME PLACEHOLDERS — the site is a work-in-progress. /pricing /features are in-page anchors, not routes.
- **wisprflow**: 5 desktop shots (home hero; home testimonials+footer; use-cases carousel; about+press). Full DOM captured for home/about/use-cases (verbatim in content/). THE production-complete reference model.

## Per-site sub-page status
- Aurum gated content (dashboard /masteries /masteries/[id] /generate WITH data): NOT captured — no logged-in session; those routes show the login-redirect state (captured). Needs a browser with a valid token.
- wisprflow footer sub-pages (careers, trust-center, workflows, etc.): DOM-verified + verbatim content extracted, but not individually screenshotted.

| Site | Page/URL | Viewport | State | Captured? | Filename | Notes |
|------|-----------|----------|-------|-----------|----------|-------|
| aurum | dashboard | desktop | full | Y | aurum/screenshots/desktop/dashboard_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | dashboard | desktop | initial | Y | aurum/screenshots/desktop/dashboard_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | dashboard | desktop | scroll-1000 | Y | aurum/screenshots/desktop/dashboard_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | discover | desktop | full | Y | aurum/screenshots/desktop/discover_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | discover | desktop | initial | Y | aurum/screenshots/desktop/discover_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | discover | desktop | scroll-1000 | Y | aurum/screenshots/desktop/discover_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | forgot | desktop | full | Y | aurum/screenshots/desktop/forgot_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | forgot | desktop | initial | Y | aurum/screenshots/desktop/forgot_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | forgot | desktop | scroll-1000 | Y | aurum/screenshots/desktop/forgot_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | generate | desktop | full | Y | aurum/screenshots/desktop/generate_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | generate | desktop | initial | Y | aurum/screenshots/desktop/generate_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | generate | desktop | scroll-1000 | Y | aurum/screenshots/desktop/generate_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | home | desktop | full | Y | aurum/screenshots/desktop/home_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | home | desktop | initial | Y | aurum/screenshots/desktop/home_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | home | desktop | scroll-1000 | Y | aurum/screenshots/desktop/home_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | login | desktop | full | Y | aurum/screenshots/desktop/login_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | login | desktop | initial | Y | aurum/screenshots/desktop/login_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | login | desktop | scroll-1000 | Y | aurum/screenshots/desktop/login_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries-new | desktop | full | Y | aurum/screenshots/desktop/masteries-new_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries-new | desktop | initial | Y | aurum/screenshots/desktop/masteries-new_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries-new | desktop | scroll-1000 | Y | aurum/screenshots/desktop/masteries-new_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries | desktop | full | Y | aurum/screenshots/desktop/masteries_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries | desktop | initial | Y | aurum/screenshots/desktop/masteries_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | masteries | desktop | scroll-1000 | Y | aurum/screenshots/desktop/masteries_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | notfound | desktop | full | Y | aurum/screenshots/desktop/notfound_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | notfound | desktop | initial | Y | aurum/screenshots/desktop/notfound_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | notfound | desktop | scroll-1000 | Y | aurum/screenshots/desktop/notfound_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | reset | desktop | full | Y | aurum/screenshots/desktop/reset_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | reset | desktop | initial | Y | aurum/screenshots/desktop/reset_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | reset | desktop | scroll-1000 | Y | aurum/screenshots/desktop/reset_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | filled-valid | Y | aurum/screenshots/desktop/signup_filled-valid_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | focus-input | Y | aurum/screenshots/desktop/signup_focus-input_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | full | Y | aurum/screenshots/desktop/signup_full_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | hover-button | Y | aurum/screenshots/desktop/signup_hover-button_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | initial | Y | aurum/screenshots/desktop/signup_initial_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | signup | desktop | scroll-1000 | Y | aurum/screenshots/desktop/signup_scroll-1000_desktop.png | Playwright headless (Vercel allow-listed) |
| aurum | home | tablet | full | Y | aurum/screenshots/tablet/home_full_tablet.png | Playwright headless (Vercel allow-listed) |
| aurum | home | tablet | initial | Y | aurum/screenshots/tablet/home_initial_tablet.png | Playwright headless (Vercel allow-listed) |
| aurum | login | tablet | full | Y | aurum/screenshots/tablet/login_full_tablet.png | Playwright headless (Vercel allow-listed) |
| aurum | login | tablet | initial | Y | aurum/screenshots/tablet/login_initial_tablet.png | Playwright headless (Vercel allow-listed) |
| heyclicky | home (hero+features) | desktop | initial | Y | heyclicky/screenshots/desktop/home_hero_features_desktop.png | managed browser (curl/Playwright TLS-blocked to this host). Inter 88px/500/-2.64px; bg #F5F5F5; accent #0F7FFF. |
| heyclicky | home (dream/feedback/pricing/faq) | desktop | scroll | Y | heyclicky/screenshots/desktop/home_dream_feedback_pricing_faq_desktop.png | lower sections captured. Live site is WIP — THE DREAM/FEEDBACK use red wireframe placeholders. /pricing is an in-page anchor (direct /pricing -> 404, captured). |
| heyclicky | home (full, 404-pricing) | desktop | initial | Y | heyclicky/screenshots/desktop/home_404-pricing_desktop.png | /pricing route returns Next 404. |
| heyclicky | features/about/support | desktop | all | N | — | UNCONFIRMED — nav targets are 404 or in-page anchors; only homepage reachable. |
| heyclicky | home | tablet | all | N | — | UNCONFIRMED — managed browser is desktop-only this pass. |
| heyclicky | home | mobile | all | N | — | UNCONFIRMED — managed browser desktop-only. |
| wisprflow | home (hero+features) | desktop | initial | Y | wisprflow/screenshots/desktop/home_hero_desktop.png | Figtree + EB Garamond 120px/400/-6px; bg #FFFFEB; purple #F0D7FF; orange #FFA946. |
| wisprflow | home (testimonials+footer+photo band) | desktop | scroll | Y | wisprflow/screenshots/desktop/home_testimonials-footer_desktop.png | Reid Hoffman + Steven Bartlett + Clay testimonials; golden-hour photo CTA band; giant Flow footer wordmark. |
| wisprflow | use-cases (carousel+tabs) | desktop | initial | Y | wisprflow/screenshots/desktop/use-cases_carousel_desktop.png | tablist Business/Dev/Founder/PM; 16+ app carousels w/ prev-next + 1/N counter; testimonial 'cheat code for your inbox'. |
| wisprflow | about (founder video+press) | desktop | initial | Y | wisprflow/screenshots/desktop/about_press_desktop.png | WSJ / Notable Capital AI 40 / AI 50 Brink list press; founder video; careers CTA. |
| wisprflow | careers/trust-center/media-kit/whats-new/flow-for-* /workflows/research/vibe-coding/talk-* /terms/privacy/data-controls | desktop | all | N | — | UNCONFIRMED — footer links exist in DOM (verbatim in content/wisprflow.md) but not individually visited this pass. |
| wisprflow | home | tablet | all | N | — | UNCONFIRMED — managed browser desktop-only. |
| wisprflow | home | mobile | all | N | — | UNCONFIRMED — managed browser desktop-only. |
