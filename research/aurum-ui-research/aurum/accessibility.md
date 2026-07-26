# Aurum — Accessibility Audit

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
