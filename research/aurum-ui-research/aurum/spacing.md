# Aurum — Spacing System

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
