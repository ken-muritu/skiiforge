# heyclicky.com — Design System (computed, observed 2026-07-26)

> All values extracted from live computed styles via browser devtools, NOT estimated.
> NOTE: the live site rendered largely as RED WIREFRAME / PLACEHOLDER BLOCKS on
> most sections (hero was built; features/footage/testimonials were red outline boxes).
> This is itself a finding: heyclicky's public site is a WORK-IN-PROGRESS.

## Color
- Page background: rgb(245, 245, 245)  (#F5F5F5, near-white)
- Primary text: rgb(0, 0, 0)  (#000 black)
- Accent blue (links/CTA): rgb(15, 127, 255)  (#0F7FFF)
- Red (wireframe outlines / placeholder boxes): rgb(237, 27, 38)  (#ED1B26)
- Dark section text: rgb(26, 26, 26)  (#1A1A1A)
- Soft purple/blue blocks: rgb(34, 24, 152) (#221898), rgb(101, 168, 239) (#65A8EF)
- Warning yellow tint: rgba(254, 234, 61, 0.35)
- Orange accent: rgb(255, 102, 0)  (#FF6600)
- Borders: rgba(0,0,0,0.08) – rgba(0,0,0,0.5) range

## Typography
- Font family: Inter ("Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, sans-serif)
- H1: 88px / weight 500 / letter-spacing -2.64px  (tight, large)
- Body: 16px / line-height 24px
- Buttons & links: weight 400, padding 0px (no internal padding — flat text/link style)
- Border-radius: 0px on buttons/links (sharp corners)
- Box-shadow: none on observed components

## Layout / Spacing
- Single-column, centered hero -> expands to grids lower down
- Generous vertical whitespace between sections
- No detected fixed spacing scale (appears ad-hoc in wireframe)

## Components observed
- Nav: logo (serif wordmark) + text links "features" / "pricing" + "get heyclicky" link
- Primary button: black bg, white text ("download for mac")
- Secondary: white bg, black border ("windows waitlist")
- Hero video player (mov files) with unmute/play overlays
- Pricing: tablist (monthly / yearly -20%), 3 plans (start free / get pro $20/mo / get max $100/mo)
- FAQ: accordion buttons (expanded=false default), 9 items
- Footer: columns product / resources / connect + disclaimer

## Motion
- No transitions observed on buttons/links (shadow:none, no transition captured)
- Hero videos autoplay (muted .mov files)

## Iconography
- Emoji + simple SVG icons (unmute, play). No unified icon set detected.

## Honest gaps in capture
- Only the HOMEPAGE was reachable. /pricing, /features, /about returned 404
  (they are in-page anchors, not routes).
- Tablet/mobile viewports NOT captured (managed-browser session was desktop-only
  in this pass — see CAPTURE_MANIFEST.md).
- Computed tokens captured from homepage DOM only.
