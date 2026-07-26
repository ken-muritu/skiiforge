# wisprflow.ai — Design System (computed, observed 2026-07-26)

> All values extracted from live computed styles via browser devtools, NOT estimated.

## Color
- Page background: rgb(255, 255, 235)  (#FFFFEB, warm cream / paper)
- Primary text: rgb(26, 26, 26)  (#1A1A1A, near-black)
- Secondary text: rgb(51, 51, 51), rgb(118, 118, 118)
- Brand purple (light lavender): rgb(240, 215, 255)  (#F0D7FF)
- Orange accent: rgb(255, 169, 70)  (#FFA946)
- Card surfaces (dark): rgb(26, 26, 26) on cream sections
- Borders: rgba(26,26,26,0.1) – rgba(26,26,26,0.5)
- Cream tint: rgba(255,255,235,0.1)

## Typography  (the signature of this site)
- UI / body: Figtree, Arial, sans-serif
- Headlines (H1): "EB Garamond", Arial, serif — 120px / weight 400 /
  letter-spacing -6px  (large editorial serif, very tight)
- Nav / buttons: Figtree sans
- Mixed serif-headline + sans-body = magazine/editorial premium feel

## Layout / Spacing
- Sticky top nav (logo left, Product/Individuals/Business/Resources/Company,
  "Download for free" button right)
- Centered hero with floating app-icon "ribbon"
- Pill toggle buttons for user segments (Business Owners / Developers / Founders / PMs)
- Horizontal carousels (Essential apps, Documentation, Engineering, PM, Writing)
  with LEFT/RIGHT arrow controls (Previous disabled at start)
- Full-width photographic CTA band (golden-hour runner, motion blur)
- Multi-column footer + giant "Flow" wordmark

## Components observed
- Sticky header w/ dropdown buttons (Product, Resources, Company expand)
- Pill-segmented toggle (selected state has bg fill)
- Dark rounded value cards (white text on dark)
- Quote/testimonial container (light purple, circular avatar)
- App-integration cards (white, rounded, icon + title + desc + arrow)
- Carousel w/ prev/next + "1 / 16" counter
- CTA band (photo + serif overlay + 2 buttons)

## Motion
- Carousel slide transitions; photographic motion-blur on CTA band
- Hover on app cards (arrow icon suggests link hover)
- Not deeply instrumented in this pass (see manifest)

## Iconography
- Flat app icons (Gmail, Slack, Notion, Cursor, etc.) with subtle shadow (floating)
- Brand mark: purple wordmark

## Routes confirmed reachable (real sub-pages)
- /  (home), /about, /use-cases, + footer links: careers, trust-center,
  affiliate, media-kit, whats-new, flow-for-students, flow-for-non-profits,
  flow-for-android, workflows, research, vibe-coding, talk-to-support/sales,
  help-center, bug-bounty, terms, privacy, data-controls
- This is a COMPLETE, production marketing site (vs heyclicky WIP).

## Honest gaps in capture
- Tablet/mobile viewports NOT captured in this pass (desktop-only session).
- Hover/focus/loading micro-states not exhaustively triggered (see manifest).
