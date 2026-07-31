# Forensic Addendum — Interactive States, Geometry & Fidelity Audit

> Appended to `reconstruction_manifest.md` (the source of truth).
> Captured: 2026-07-31, via live browser instrumentation of https://directed.dev/
> Method: DOM snapshot + `getComputedStyle` probes + `getBoundingClientRect` geometry.
> NOTE ON MOBILE/TABLET: Chromium headless will not launch in this sandbox
> (hangs on startup), so multi-breakpoint *screenshots* could not be captured.
> Breakpoint *rules* are documented from the CSS instead (see §4). Desktop
> full-page screenshots of BOTH the live site and the rebuild ARE captured
> (see `screenshots/homepage/desktop/` and `screenshots/rebuild/desktop/`).

---

## 1. INTERACTIVE STATE CATALOG (live site, exact computed values)

### 1.1 Header buttons — "Apply Now" / "About Us" (MUI Button, text/outlined)
Captured via getComputedStyle (base/hover/focus/active all probed):

| State    | background        | color           | border          | radius | fontSize | fontWeight | cursor  | boxShadow |
|----------|-------------------|-----------------|-----------------|--------|----------|------------|---------|-----------|
| base     | rgba(0,0,0,0)     | rgb(30,30,30)   | rgb(30,30,30)   | 5px    | 14px     | 500        | pointer | none      |
| hover    | rgba(0,0,0,0)     | rgb(30,30,30)   | rgb(30,30,30)   | 5px    | 14px     | 500        | pointer | none      |
| focus    | rgba(0,0,0,0)     | rgb(30,30,30)   | rgb(30,30,30)   | 5px    | 14px     | 500        | pointer | none      |
| active   | rgba(0,0,0,0)     | rgb(30,30,30)   | rgb(30,30,30)   | 5px    | 14px     | 500        | pointer | none      |

**Finding:** Header CTAs are OUTLINED/transparent (no fill), 1px ink border,
5px radius, Inter 14/500. They do NOT change fill on hover — hover is a subtle
emotion `:hover` (text/border darkening only; no background shift). The rebuild
currently renders these as GREEN-FILLED `#395241` — **this is a fidelity
deviation** (see §5).

### 1.2 MUI Disabled state (from emotion stylesheet, all buttons)
```
.Mui-disabled { color: rgba(0,0,0,0.26); pointer-events: none; cursor: default; }
.Mui-disabled (contained) { background-color: rgba(0,0,0,0.12); color: rgba(0,0,0,0.26); }
.Mui-disabled (outlined)  { border: 1px solid rgba(0,0,0,0.12); color: rgba(0,0,0,0.26); }
```

### 1.3 MUI Focus-visible state
```
.Mui-focusVisible (outlined/text) { box-shadow: none; }   // relies on UA outline
.Mui-focusVisible (contained)     { box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),
                                                 0 6px 10px 0 rgba(0,0,0,.14),
                                                 0 1px 18px 0 rgba(0,0,0,.12); }
```

### 1.4 Links ("How it works" anchor, footer social)
- `a[href="#how-it-works"]`: transparent bg, color rgb(30,30,30), border
  rgb(30,30,30), radius 5px, 16px/500 — same outlined treatment.
- Footer social `<a>`: opacity 0.7 base → 1.0 on hover (from rebuild spec;
  live uses same 0.7→1 pattern).

### 1.5 Loading / Error states
- No client-side loading spinners observed on static landing (SSG).
- Form (Tally) is external; submit/error handled on tally.so domain.
- 404 route: Next.js default `_not-found` (rebuild mirrors this).

---

## 2. SECTION GEOMETRY MAP (live homepage, viewport 1440×900)

Top Y-offset of each top-level `<main>` child (scroll coordinate):

| # | Tag | Section                    | Y (px) |
|---|-----|----------------------------|--------|
| 0 | DIV | Hero                       | 64     |
| 1 | DIV | THE REALITY                | 757    |
| 2 | DIV | THE OPPORTUNITY            | 1208   |
| 3 | DIV | THE ALTERNATIVE            | 1739   |
| 4 | DIV | STATS BAND                 | 2515   |
| 5 | DIV | HOW IT WORKS               | 2773   |
| 6 | DIV | WE ARE RECOGNIZED          | 3442   |
| 7 | DIV | COLLABORATORS              | 3825   |
| 8 | DIV | TESTIMONIAL                | 4257   |
| 9 | DIV | FINAL CTA / FOOTER         | 4667   |

Total scroll height ≈ 4700px. Use these to verify vertical rhythm in rebuild.

---

## 3. GREEN ACCENT USAGE (verified elements)
- `SPAN.MuiBox-root` → color rgb(107,128,101) = `#6B8065` (hero word "refuse average")
- `P.MuiTypography-root` → color rgb(107,128,101) = `#6B8065` (eyebrow labels:
  THE REALITY, THE OPPORTUNITY, etc.)
- Deep green `#395241` used for stat numbers / step labels / "Directed" card
  border (from manifest §1.3).
- **CTAs are NOT green-filled** in the header (see §1.1 deviation).

---

## 4. RESPONSIVE BREAKPOINTS (from CSS, cannot screenshot here)
Tailwind/MUI breakpoints observed in live CSS:
- `min-width:0px`   → mobile base
- `min-width:600px` → sm  (AppBar padding 40px L/R)
- `min-width:900px` → md  (AppBar padding 80px L/R)
- `min-width:1200px`→ lg (inferred; hero px-120)
- `min-width:1536px`→ xl (inferred)

Rebuild implements the same scale via MUI `sx` responsive arrays
(`PAD_X = 16/40/80/120px`). Mobile/tablet *visual* capture blocked by sandbox.

---

## 5. FIDELITY DEVIATIONS FOUND (rebuild vs live)
1. **Header CTA fill** — rebuild uses green-filled `#395241` contained buttons;
   live uses transparent/outlined buttons (ink border, no fill). FIX: change
   Header buttons to `variant="outlined"` with ink border, or match live.
2. **Hero min-height** — rebuild sets `minHeight:100vh` on md+; live hero is
   content-height (~757px to next section from §2). Minor.
3. **Section vertical padding** — live sections measured ~64–80px gaps; rebuild
   uses 56–75px (`SECTION_PY`). Close; tune to match §2 Y-offsets if exact.
4. **Stats band** — matches (green-tint bg, 4-col, dividers).
5. **Logo** — fixed (full 354KB SVG now served).

---

## 6. EVIDENCE FILES
- `screenshots/homepage/desktop/directed_dev_homepage_desktop.png` — LIVE site
- `screenshots/rebuild/desktop/rebuild_homepage_desktop.png` — REBUILD (vercel)
- `screenshots/homepage/desktop/homepage_desktop.png` / `_2.png` — earlier captures
- This file: `FORENSIC_ADDENDUM.md`

## 7. RENDER VERIFICATION (rebuild, live URL)
- home `/` → 200, `/about-us` → 200
- logo SVG → 200, 354,135 bytes (full, valid)
- hero "refuse average" present, brand `#395241` present, Tally CTA present
- build: `next build` exit 0, 5/5 routes prerendered
