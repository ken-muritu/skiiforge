# Aurum — Component Inventory

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
