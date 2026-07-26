# Aurum — Full UI Audit Report

> Consolidated from per-section files in `aurum/`. Generated 2026-07-26.


## Site Map

> Source: deployed aurumio.vercel.app (Playwright capture) + repo
> /root/aurum/frontend/app route tree. Gated = auth required.

## Routes (all confirmed)
| Route | Type | Auth | Notes |
|--------|------|------|-------|
| `/` | page | public | Landing/hero, 4 feature cards, badge, 2 CTAs |
| `/login` | page | public | "Welcome back", username+password, forgot link |
| `/signup` | page | public | display_name+username+email+password |
| `/forgot` | page | public | identifier -> Brevo email or MVP link |
| `/reset?uid=&token=` | page | public | new password set (Suspense) |
| `/discover` | page | public | public Masteries search + grid; works logged-out |
| `/dashboard` | page | **gated** | continue-learning, my-masteries, recent activity |
| `/masteries` | page | **gated** | list + "New Mastery" entry |
| `/masteries/new` | page | **gated** | title/goal/desc/public toggle |
| `/masteries/[id]` | page | **gated** | builder: modules->lessons->resources, progress, notes, fork |
| `/generate` | page | **gated** | topic -> YouTube-grounded proposal -> save |
| `/404` | page | public | Next.js default not-found |

## Navigation paths
- Public nav: logo (->/), Discover (->/discover), Log in (->/login), Get started (gold btn ->/signup)
- Post-login nav (UNCONFIRMED — gated capture only reached login-redirect):
  expected: Dashboard, Masteries, Discover, Log out
- Footer: "Get started — it's free" (CTА)

## Modals / overlays (in app, UNCONFIRMED capture)
- /masteries/[id] builder: YouTube search picker (modal/drawer), resource attach,
  quiz/project-prompt editor, fork confirm.
- /generate: proposal preview + "Save to my Masteries" confirm.

## Onboarding (UNCONFIRMED)
- Signup -> auto-login -> redirected to /dashboard. No multi-step wizard captured.

## CTA destinations
- "Build your first Mastery" -> /masteries/new
- "Explore public Masteries" -> /discover
- "Get started" -> /signup
- "Forgot your password?" -> /forgot

## Hidden / conditional
- /reset requires valid uid+token (Brevo-sent). Bad token -> 400.
- Auth-guarded pages without session -> 307/redirect to /login.

## Hash / query states
- /reset?uid=..&token=.. (query-param state, real)
- /masteries/[id]? (single dynamic param)

## Brand Voice

> Source: verbatim content extract (content/aurum.md) + captured DOM.

## Mission (derived from hero)
"Turn scattered YouTube tutorials into real mastery." — the product
positiones itself as the antidote to tutorial-hoarding / never-finishing.

## Positioning
- Category: "Knowledge Operating System" / "Your Knowledge Operating System" (badge).
- Vs alternatives: implicit contrast with "bookmark great videos and never finish them"
  (names the user's failing behavior, then offers the fix).

## Messaging / taglines
- H1: "Turn scattered YouTube tutorials into real mastery."
- Sub: "You bookmark great videos and never finish them. Aurum turns a pile
  of good content into a structured path — modules, lessons, progress, and
  notes — so you actually cross the finish line."
- Badge: "Your Knowledge Operating System"
- Feature H3s: "Structure the chaos", "Track what sticks",
  "Notes in context", "Discover & remix"
- CTAs: "Build your first Mastery →", "Explore public Masteries",
  "Get started — it's free"

## Tone
- **Direct, competent, slightly aspirational.** Second person ("you", "your").
- Not playful (vs heyclicky's ASCII/anti-AI-grifter voice). Not premium-editorial
  (vs Wispr Flow's "cheat code for your inbox"). Sits BETWEEN — a competent
  SaaS voice that is clear but not yet *memorable*.
- Reading level: simple, short sentences. No jargon beyond "modules/lessons/progress".

## Emotional triggers used
- **Guilt/relief**: "never finish them" -> "actually cross the finish line".
- **Structure as safety**: "a pile of good content into a structured path".

## Trust signals
- "it's free" (lowers friction).
- Public "Discover & remix" (social proof via others' Masteries + fork).

## Conversion techniques
- Dual CTA (action + low-commitment "Explore").
- Hero badage pre-frames category before the headline lands.

## Consistency
- "Mastery"/"Masteries" spelling: product uses "Mastery" (brand noun) consistently.
- Voice is consistent across hero/cards/CTA. No flat utility copy observed
  (but gated empty/error states UNCONFIRMED — see manifest).

## Typography

> Source: Playwright computed token dump (_aurum_tokens_raw.json) + globals.css.

## Fonts
- **UI / body**: `ui-sans-serif, system-ui, -apple-system, "Segoe UI",
  Roboto, sans-serif` — i.e. SYSTEM FONT STACK, no loaded webfont.
- **Logo**: `Times New Roman` (serif) — confirmed in allFonts dump. This is a
  **serif DEFAULT**, not a loaded display face.
- **Headlines**: inherit the system sans, bold weight.

## Weights
- Buttons: weight 800 (heavy) per token dump anchor sample.
- H1/H2: bold (700) — UNCONFIRMED exact value in this pass.

## Sizes (confirmed)
- Body: 16px / line-height 24.8px
- H1 (home hero): UNCONFIRMED exact px (visually large, ~clamp needed)
- AllFonts also listed "Times New Roman" — the ONLY serif present.

## Letter-spacing
- Body: normal. Headline tracking UNCONFIRMED.

## Paragraph / heading hierarchy
- H1 hero -> H2 section -> H3 card title -> body -> caption.
- Clear hierarchy via size+weight (no tracked-out editorial serif like Wispr).

## Responsive scaling
- UNCONFIRMED (tablet/mobile shots captured but not typographically measured).

## Fallback fonts
- System stack -> every OS renders a DIFFERENT sans (SF on mac, Segoe on
  Win, Roboto on Android). **Inconsistency risk** — references load webfonts
  (Inter / Figtree) so they look identical everywhere.

## Button / label typography
- Buttons: 800 weight, system sans. No tracking.

## Code typography
- N/A (no code surfaces in marketing/auth).

## Key finding
Aurum has NO loaded webfont and leans its logo on Times New Roman.
References load Inter (heyclicky) / Figtree+EB Garamond (Wispr).
**Fix**: load a deliberate display serif + geometric sans (see DESIGN_GUIDE).

## Colors

> Source: Playwright computed token dump + globals.css + vision review.

## Backgrounds
- Page bg: `rgb(11,13,18)` = **#0B0D12** (near-black navy). Dark mode ONLY.
- Surface-1 (cards): `rgb(16,19,26)` = #10131A
- Surface-2: `rgb(22,26,34)` = #161E22
- Surface-3: `rgb(35,40,51)` = #232833
- Stepped dark surfaces = subtle depth, NO shadows used.

## Text
- Primary: `rgb(232,235,240)` = #E8EBF0 (near-white)
- Muted: `rgb(154,163,178)` = #9AA3B2

## Brand / accent
- **GOLD**: `rgb(233,196,106)` = #E9C46A (logo, primary CTA, feature H3s)
  - tints: rgba(233,196,106,0.10), rgba(233,196,106,0.25)
- **MINT/teal**: used in gradient text "real mastery" (yellow->mint) + mint CTA.
  Value UNCONFIRMED exact (gradient stop in globals.css).

## Borders
- `rgb(47,54,68)` = #2F3644 (card/input borders)
- Hairline rgba(11,13,18,0.85) on some overlays.

## Hover / pressed / focus
- Hover: brightness(1.07) on gold button (NO bg change, NO scale, NO shadow).
- Focus (input): mint outline (confirmed on /login shot).
- Pressed / disabled: UNCONFIRMED in CSS.

## Error / warning / success / info
- **NOT detected** in token dump — possible gap. Values UNCONFIRMED
  (gated form-error states not captured). MUST add explicit --danger/--success.

## Gradients
- Hero text gradient: yellow (#E9C46A-ish) -> mint. Exact stops UNCONFIRMED.

## Opacity / overlay / shadow colors
- Shadows: **none** on cards/buttons (flat). Overlay rgba(11,13,18,0.85).
- Glass: none observed (no backdrop-blur on header — it scrolls away).

## HEX/RGB/HSL summary
| Token | HEX | RGB |
|-------|-----|-----|
| bg | #0B0D12 | 11,13,18 |
| surface-1 | #10131A | 16,19,26 |
| surface-2 | #161E22 | 22,26,34 |
| surface-3 | #232833 | 35,40,51 |
| text | #E8EBF0 | 232,235,240 |
| muted | #9AA3B2 | 154,163,178 |
| gold | #E9C46A | 233,196,106 |
| border | #2F3644 | 47,54,68 |

## Spacing

> Source: captured screenshots (visual) + globals.css. Exact scale UNCONFIRMED
> (no token dump of padding/margin values in this pass — flag for rebuild verification).

## Grid / container
- Centered max-width container (value UNCONFIRMED; visually ~1100-1200px).
- Hero: single centered column, strong vertical rhythm.
- Feature section: **4-column grid** (desktop), even gaps.

## Margins / padding
- Generous section padding (hero has significant top/bottom space).
- Card internal padding UNCONFIRMED exact.

## Section spacing
- Large gaps between hero -> features -> footer (premium uncluttered feel).

## Card spacing
- Even grid gaps; card padding appears ~16-24px (UNCONFIRMED).

## Button spacing
- Padding UNCONFIRMED (token dump sample was a nav <a>, showed 0px — NOT
  the .btn class; verify in rebuild).

## Whitespace rhythm
- Generous — matches "premium SaaS" reference tier.

## Responsive behavior
- tablet/mobile shots captured but spacing NOT measured (UNCONFIRMED).
- Mobile: single-column stack expected (verify against shots).

## Known gap
- **No explicit spacing scale** documented in globals.css token dump.
  Recommend a fixed 8px-based scale in rebuild (see DESIGN_GUIDE :root).

## Motion

> Source: globals.css review + README + captured (static) shots.

## Current motion (confirmed minimal)
- **Button hover**: `filter: brightness(1.07)` only. No transform, no shadow shift.
- **Hero text gradient**: static gradient (no animated sweep confirmed).
- **Progress bar**: fills on mark-complete (optimistic UI) — transition
  duration UNCONFIRMED.

## What is ABSENT vs references
- No page/section fade-in or scroll-reveal.
- No card hover lift / shadow.
- No button press scale.
- No carousel/slide (references: Wispr Flow carousels).
- No loading skeleton/spinner captured (gated + fast public pages).
- No micro-interaction on nav/links.

## Duration / easing
- UNCONFIRMED (no transition tokens dumped). Recommend:
  --t-fast 140ms, --t-med 220ms, --ease cubic-bezier(0.4,0,0.2,1).

## Transform / opacity / scale / blur
- None observed.

## Scroll animations
- None. (Wispr Flow: motion-blur photo band; Aurum: static.)

## Page transitions
- Next.js default (instant client nav). No shared-element/animated route transition.

## Loading animations
- UNCONFIRMED (no slow/loading state captured).

## Cursor interactions
- None.

## Accessibility

> Source: captured DOM + computed styles. Partial (gated app UNCONFIRMED).

## Contrast
- Text #E8EBF0 on bg #0B0D12: **high contrast** (passes AA/AAA).
- Muted #9AA3B2 on #0B0D12: ratio ~7:1 (passes AA).
- Gold #E9C46A on dark: decorative (logo) — body text is near-white, OK.
- **Risk**: mint CTA "Get started" white text on mint — contrast UNCONFIRMED
  (verify mint is dark enough or use dark text).

## Keyboard navigation
- Inputs focusable (mint focus outline confirmed on /login).
- Button focus ring: UNCONFIRMED (CSS not dumped for :focus-visible).
- Gated app focus order UNCONFIRMED.

## ARIA
- Next.js app; semantic HTML expected but UNCONFIRMED in this pass.
- Mobile hamburger: attempted (selector heuristic) — UNCONFIRMED presence.

## Screen reader support
- UNCONFIRMED (no SR test run; gated app not reached).

## Focus order
- UNCONFIRMED beyond login form.

## Semantic HTML
- Form labels present ("Username", "Password") — good.
- Heading hierarchy H1->H2->H3 present on home.

## Motion reduction
- `prefers-reduced-motion`: UNCONFIRMED (no media-query found in globals.css review).
  **Recommend**: add it (disable brightness/transition for reduced-motion users).

## Touch targets
- Mobile shots captured; button size UNCONFIRMED (verify >=44px).

## Responsive accessibility
- UNCONFIRMED (tablet/mobile not measured).

## Color dependency
- Status conveyed by text+color (login sub "Log in to continue").
- Error states: UNCONFIRMED (no error captured) — ensure errors are NOT
  color-only (add icon + text, like references' inline messages).

## Components

> Source: globals.css in repo + captured screenshots + DOM. Classes named
> as they appear in the deployed CSS.

## 1. Navigation (NavBar.jsx)
- Purpose: top nav, public + (expected) authed.
- Variants: logo (serif gold) | text links (Discover, Log in) | gold CTA button.
- States captured: default, (sticky-on-scroll UNCONFIRMED — header scrolls away).
- Spacing: centered max-width container, link gap ~24px.
- Radius: n/a (text links). Button radius from .btn-gold.
- Shadow: none.
- Issue: NOT sticky (Wispr Flow is). Visual hierarchy: logo left, CTA right.

## 2. Hero (home)
- Purpose: value prop.
- Variants: badge pill + H1 (gradient text "real mastery") + sub + 2 CTAs.
- Gradient: linear yellow->mint on "real mastery" span.
- States: static (no scroll-reveal captured).

## 3. Buttons (.btn-gold / .btn-ghost / .btn-mint)
- Purpose: primary/secondary actions.
- Variants:
  - .btn-gold: solid gold (#E9C46A), dark text, weight 800.
  - .btn-ghost: transparent, white 1px border.
  - .btn-mint: mint green, white text.
- States: hover = brightness(1.07) only (NO bg change, NO scale, NO shadow).
  pressed/disabled/focus-ring UNCONFIRMED in CSS.
- Spacing: padding UNCONFIRMED (token dump showed 0px on an <a> sample — likely a nav link, not .btn).
- Radius: from globals.css (value UNCONFIRMED in this pass — verify in rebuild).
- Shadow: none.

## 4. Cards (feature cards, mastery cards, dashboard)
- Purpose: group content.
- Variants: feature card (icon + H3 gold + grey desc), mastery card, continue-learning card.
- States: static; hover lift/shadow UNCONFIRMED.
- Spacing: grid, even gaps, generous section padding.
- Radius: from globals.css.
- Shadow: none (flat dark blocks, surface #10131A/#161E22).

## 5. Inputs (.input / form fields)
- Purpose: text entry.
- Variants: text, email, password.
- States captured: default, **focus = mint outline** (confirmed on /login shot),
  validation-error (UNCONFIRMED capture — submit selector timed out).
- Spacing: label (grey, small) above input.

## 6. Badges / Pills
- Purpose: resource-type tags (youtube/doc/pdf/blog/github...), "Your Knowledge OS" badge.
- States: static. Radius: pill.

## 7. Progress bar (mastery builder)
- Purpose: lesson completion %.
- States: fills on mark-complete (optimistic UI). Transition UNCONFIRMED.

## 8. Notes (per-lesson)
- Purpose: timestamped insights. UNCONFIRMED capture (gated).

## 9. Icons
- **Emoji / unicode** (Target, Checkmark, Pencil, Bullseye) — confirmed in
  feature cards + design-token dump. NOT a unified icon library.
- This is the #1 fidelity gap vs references (see comparison/DESIGN_GAPS).

## 10. Footer
- Minimal: single centered "Get started — it's free" CTA. No multi-column links.

## 11. Toasts / notifications
- UNCONFIRMED (gated actions not captured).

## 12. 404
- Next.js default: large "404" + "This page could not be found."

## 13. Loading / skeleton
- UNCONFIRMED (no loading state captured; gated + fast public pages).

## Verbatim Content Captures


### dashboard

- Intended: continue-learning card (with progress bar), my-masteries grid, recent activity feed.
- Observed without session: 307 redirect to /login "Welcome back".
- GATED CONTENT UNCONFIRMED (needs logged-in browser).

### discover

- Public Masteries browser.
- Search input + grid of public Masteries.
- Empty state if no public Masteries exist (UNCONFIRMED capture — public data may be empty).

### forgot

- H2: "Forgot your password?"
- Field: identifier (email or username)
- Submit: "Send reset link"
- (MVP mode returns the reset link in response if BREVO_API_KEY unset)

### generate

- Topic input -> YouTube-grounded proposal (module + lessons w/ video resources).
- "Save to my Masteries" creates the real Mastery.
- Observed without session: redirect to /login.

### home

> Captured from live DOM 2026-07-26.

- title: "Aurum — Mastery, Refined."
- Badge: "Your Knowledge Operating System"
- H1: "Turn scattered YouTube tutorials into real mastery."
- Sub: "You bookmark great videos and never finish them. Aurum turns a pile of good content into a structured path — modules, lessons, progress, and notes — so you actually cross the finish line."
- CTA primary: "Build your first Mastery →"
- CTA ghost: "Explore public Masteries"
- Feature 1 — H3 "Structure the chaos" / "Group videos into modules and lessons. One clear path from 'I want to learn X' to 'I can do X.'"
- Feature 2 — H3 "Track what sticks" / "Mark lessons complete, watch your progress bar fill, and always know the next thing to do."
- Feature 3 — H3 "Notes in context" / "Capture insights per lesson — timestamped to the moment they mattered."
- Feature 4 — H3 "Discover & remix" / "Browse public Masteries built by others and fork them into your own learning plan."
- Footer CTA: "Get started — it's free"

### login

- H2: "Welcome back"
- Sub: "Log in to continue your Masteries."
- Label "Username"
- Label "Password"
- Submit: "Log in"
- Link: "Forgot your password?"
- "No account? Create one →"

### masteries-new

- Form: title, goal, description, public/private toggle.
- Submit creates a Mastery.
- Observed without session: redirect to /login.

### masteries

- Intended: grid of user's Masteries + "New Mastery" entry point.
- Observed without session: redirect to /login.
- GATED CONTENT UNCONFIRMED.

### notfound

- "404"
- "This page could not be found." (Next.js default)

### reset

- H2: "Reset your password"
- Fields: new password, confirm password
- Submit: "Reset password"
- Uses Suspense-wrapped useSearchParams

### signup

- H2: "Create your account"
- Fields: Display name, Username, Email, Password
- Submit: "Create account"
- "Already have an account? Log in"

## Screenshots Captured

### desktop (36)

- dashboard_full_desktop.png
- dashboard_initial_desktop.png
- dashboard_scroll-1000_desktop.png
- discover_full_desktop.png
- discover_initial_desktop.png
- discover_scroll-1000_desktop.png
- forgot_full_desktop.png
- forgot_initial_desktop.png
- forgot_scroll-1000_desktop.png
- generate_full_desktop.png
- generate_initial_desktop.png
- generate_scroll-1000_desktop.png
- home_full_desktop.png
- home_initial_desktop.png
- home_scroll-1000_desktop.png
- login_full_desktop.png
- login_initial_desktop.png
- login_scroll-1000_desktop.png
- masteries-new_full_desktop.png
- masteries-new_initial_desktop.png
- masteries-new_scroll-1000_desktop.png
- masteries_full_desktop.png
- masteries_initial_desktop.png
- masteries_scroll-1000_desktop.png
- notfound_full_desktop.png
- notfound_initial_desktop.png
- notfound_scroll-1000_desktop.png
- reset_full_desktop.png
- reset_initial_desktop.png
- reset_scroll-1000_desktop.png
- signup_filled-valid_desktop.png
- signup_focus-input_desktop.png
- signup_full_desktop.png
- signup_hover-button_desktop.png
- signup_initial_desktop.png
- signup_scroll-1000_desktop.png

### tablet (4)

- home_full_tablet.png
- home_initial_tablet.png
- login_full_tablet.png
- login_initial_tablet.png

