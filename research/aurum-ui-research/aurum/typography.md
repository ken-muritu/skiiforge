# Aurum — Typography

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
