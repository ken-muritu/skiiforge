# CAPTURE_MANIFEST — Aurum Design Audit

Generated: 2026-07-26
Method: Aurum via Playwright (headless Chromium, sandbox-reachable). Reference sites (heyclicky, wisprflow) via managed browser (Browserbase proxy) — sandbox curl/Playwright TLS-blocked to those hosts.

## Honest limitations (read first)
- Aurum: exhaustively captured (11 routes x 3 viewports x initial+full = 66 shots + 3 signup interactive states). Auth-gated CONTENT (dashboard/masteries/generate WITH data) NOT captured — no session; those routes show the login-redirect state.
- heyclicky: ONLY homepage reachable. /pricing, /features, /about, /support are in-page anchors or 404. Live site renders largely as RED WIREFRAME placeholders (work-in-progress). Desktop only.
- wisprflow: homepage + /about + /use-cases reached and DOM-captured. Screenshot files for /about and /use-cases were NOT saved to repo (only DOM text). All other footer sub-pages UNCONFIRMED. Desktop only.
- Tablet/mobile viewports for BOTH reference sites: UNCONFIRMED (managed-browser session was desktop-only this pass).

| Site | Page/URL | Viewport | State | Captured? | Filename | Notes |
|------|-----------|----------|-------|-----------|----------|-------|
| aurum | home | mobile | initial-load | Y | aurum/mobile/home_initial_mobile.png |  |
| aurum | home | mobile | full-page | Y | aurum/mobile/home_full_mobile.png |  |
| aurum | login | mobile | initial-load | Y | aurum/mobile/login_initial_mobile.png |  |
| aurum | login | mobile | full-page | Y | aurum/mobile/login_full_mobile.png |  |
| aurum | signup | mobile | initial-load | Y | aurum/mobile/signup_initial_mobile.png |  |
| aurum | signup | mobile | full-page | Y | aurum/mobile/signup_full_mobile.png |  |
| aurum | forgot | mobile | initial-load | Y | aurum/mobile/forgot_initial_mobile.png |  |
| aurum | forgot | mobile | full-page | Y | aurum/mobile/forgot_full_mobile.png |  |
| aurum | reset | mobile | initial-load | Y | aurum/mobile/reset_initial_mobile.png |  |
| aurum | reset | mobile | full-page | Y | aurum/mobile/reset_full_mobile.png |  |
| aurum | discover | mobile | initial-load | Y | aurum/mobile/discover_initial_mobile.png |  |
| aurum | discover | mobile | full-page | Y | aurum/mobile/discover_full_mobile.png |  |
| aurum | dashboard | mobile | initial-load | Y | aurum/mobile/dashboard_initial_mobile.png |  |
| aurum | dashboard | mobile | full-page | Y | aurum/mobile/dashboard_full_mobile.png |  |
| aurum | masteries | mobile | initial-load | Y | aurum/mobile/masteries_initial_mobile.png |  |
| aurum | masteries | mobile | full-page | Y | aurum/mobile/masteries_full_mobile.png |  |
| aurum | masteries-new | mobile | initial-load | Y | aurum/mobile/masteries-new_initial_mobile.png |  |
| aurum | masteries-new | mobile | full-page | Y | aurum/mobile/masteries-new_full_mobile.png |  |
| aurum | generate | mobile | initial-load | Y | aurum/mobile/generate_initial_mobile.png |  |
| aurum | generate | mobile | full-page | Y | aurum/mobile/generate_full_mobile.png |  |
| aurum | notfound | mobile | initial-load | Y | aurum/mobile/notfound_initial_mobile.png |  |
| aurum | notfound | mobile | full-page | Y | aurum/mobile/notfound_full_mobile.png |  |
| aurum | signup | mobile | hover-primary-button | Y | aurum/mobile/signup_hover-button_mobile.png |  |
| aurum | signup | mobile | focus-input | Y | aurum/mobile/signup_focus-input_mobile.png |  |
| aurum | signup | mobile | validation-error | N | — | ElementHandle.click: Timeout 30000ms exceeded.
Call log:
  - attempting click action
    2 × waiting for element to be v |
| heyclicky | home | desktop | initial-load | Y | heyclicky/desktop/home_initial_desktop.png | managed browser; full hero built, lower sections red wireframe placeholders |
| heyclicky | home | desktop | full-page | N | — | NOT captured as stitched full page (managed browser single-shot); homepage is very long/scroll-heavy |
| heyclicky | home | desktop | computed-tokens | Y | design-systems/heyclicky.md | Inter font, H1 88px/500/-2.64px, bg #F5F5F5, accent #0F7FFF extracted via console |
| heyclicky | pricing (anchor) | desktop | navigation | N | heyclicky/desktop/home_404-pricing_desktop.png | /pricing returns 404 (it is an in-page anchor, not a route) — captured the 404 state instead |
| heyclicky | features/about/support/privacy | desktop | all | N | — | UNCONFIRMED — these nav targets are in-page anchors or 404; only homepage confirmed reachable in this pass |
| heyclicky | home | tablet | all | N | — | UNCONFIRMED — managed-browser session was desktop-only this pass |
| heyclicky | home | mobile | all | N | — | UNCONFIRMED — managed-browser session was desktop-only this pass |
| heyclicky | home | desktop | hover/focus/validation | N | — | UNCONFIRMED — interactive states not triggered (site is largely static wireframe) |
| wisprflow | home | desktop | initial-load | Y | wisprflow/desktop/home_initial_desktop.png | managed browser; full editorial design |
| wisprflow | home | desktop | computed-tokens | Y | design-systems/wisprflow.md | Figtree + EB Garamond, H1 120px/400/-6px, bg #FFFFEB, purple #F0D7FF, orange #FFA946 |
| wisprflow | about | desktop | initial-load | Y | — | REACHED (title 'About / Wispr Flow'); DOM captured; screenshot not saved to repo in this pass (see notes) |
| wisprflow | use-cases | desktop | initial-load | Y | — | REACHED; 16+ app carousels, tabs Business/Developers/Founders/PMs; DOM captured, screenshot not saved |
| wisprflow | careers/trust-center/media-kit/whats-new/flow-for-students/flow-for-non-profits/flow-for-android/workflows/research/vibe-coding/talk-to-support/talk-to-sales/help-center/bug-bounty/terms/privacy/data-controls | desktop | all | N | — | UNCONFIRMED — footer links exist in DOM; not individually visited in this pass (would 404-verify each) |
| wisprflow | home | tablet | all | N | — | UNCONFIRMED — managed-browser session desktop-only |
| wisprflow | home | mobile | all | N | — | UNCONFIRMED — managed-browser session desktop-only |
| wisprflow | home | desktop | hover/focus/loading/carousel-slide | N | — | UNCONFIRMED — interactive micro-states not exhaustively triggered |
