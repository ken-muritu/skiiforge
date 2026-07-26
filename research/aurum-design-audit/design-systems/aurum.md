# aurumio.vercel.app — Design System (computed, observed 2026-07-26)

> Values from Playwright computed-style dump on the live deployed app + visual review.

## Color
- Page background: rgb(11, 13, 18)  (#0B0D12, near-black navy)
- Primary text: rgb(232, 235, 240)  (#E8EBF0, near-white)
- Muted text: rgb(154, 163, 178)  (#9AA3B2)
- Brand GOLD accent: rgb(233, 196, 106)  (#E9C46A)
- Gold tints: rgba(233,196,106,0.1), rgba(233,196,106,0.25)
- Secondary MINT/teal accent: used in gradient text "real mastery" (yellow->mint)
- Surfaces (cards): rgb(16,19,26) (#10131A), rgb(22,26,34) (#161E22),
  rgb(35,40,51) (#232833) — stepped dark surfaces
- Borders: rgb(47,54,68) (#2F3644)
- Semantic: success/error colors NOT detected in token dump (possible gap)

## Typography
- UI / body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
- LOGO: "Times New Roman" (serif) — confirmed in allFonts dump
- Headlines: system sans, bold (hero "Turn scattered YouTube tutorials into real mastery")
- Body: 16px / line-height 24.8px
- Buttons: weight 800 (heavy), but padding 0px / radius 0px in observed
  anchor sample (likely a nav <a>, not the .btn class — verify in rebuild)

## Layout / Spacing
- Strictly CENTER-aligned hero (strong vertical rhythm)
- 4-column feature grid (cards, even spacing)
- Generous section padding
- Sticky-ish top nav: serif logo left, Discover / Log in links + gold "Get started" btn right

## Components observed (from vision + code in repo)
- NavBar (components/NavBar.jsx): logo + links + Get started
- Buttons: .btn-gold (solid gold, dark text), .btn-ghost (transparent, white border),
  .btn-mint (mint green, white text) — gradient text effect on hero
- Cards: solid dark blocks, slightly lighter than bg (subtle depth, no heavy shadow)
- Feature cards w/ emoji-style icons (Target, Checkmark, Pencil, Bullseye)
- Auth cards (login/signup): centered rounded card, label + input, gold submit
- Progress bar (mastery builder), pills/badges for resource types
- Forms: label (grey) + input (focus outline mint), validation errors

## Motion
- Gradient text + gold hover brightness(1.07) per README; no heavy shadows
- (Details to confirm in code review during rebuild)

## Iconography
- Emoji / unicode as icons (Target, Checkmark, Pencil) — NOT a unified
  icon library (Lucide/heroicons). This is a polish gap vs references.

## Confirmed routes (Playwright, 3 viewports x initial+full)
- / /login /signup /forgot /reset /discover /dashboard /masteries
  /masteries/new /generate /404
- AUTH-GATED routes (/dashboard /masteries /masteries/new /generate)
  were captured in their LOGIN-REDIRECT state (no session). The gated
  CONTENT state is UNCONFIRMED — needs a logged-in browser (see manifest).

## Honest gaps
- Tablet/mobile viewports captured (Playwright) but NOT visually reviewed 1-by-1.
- Hover/focus/validation states: initial-load + full captured for all routes;
  signup hover/focus captured; signup validation-error FAILED to capture
  (submit button selector timeout) — see manifest.
- Authenticated app UI (dashboard with data, mastery builder) NOT captured.
