# Aurum — Color System

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
