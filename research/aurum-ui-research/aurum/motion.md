# Aurum — Animation Audit

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
