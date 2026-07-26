# Aurum UI Research

> Comprehensive UX/UI teardown + design-system analysis for rebuilding
> Aurum's frontend, benchmarked against **heyclicky.com** and **wisprflow.ai**
> (the two sites you admire).

## What this is
A complete product teardown: every route, every component, verbatim copy,
computed design tokens, screenshots, and a prioritized rebuild plan. Built to
be the definitive reference for redesigning `aurum/frontend`.

## Structure
```
research/aurum-ui-research/
  heyclicky/        site-map, components, brand-voice, typography, colors,
                    spacing, motion, accessibility, content/, screenshots/
  wisprflow/       (same structure) — THE model reference (production-complete)
  aurum/           same structure — the product being audited
  comparison/       UX_COMPARISON, DESIGN_GAPS, VISUAL_ANALYSIS,
                    BRAND_ANALYSIS, SCORECARD
  recommendations/   QUICK_WINS, REDESIGN_PLAN, DESIGN_SYSTEM_PLAN,
                    IMPLEMENTATION_ROADMAP
  AURUM_UI_GUIDE.md  canonical rebuild spec (tokens + component before/after)
  CAPTURE_MANIFEST.md  honest per-(site×page×viewport×state) log
```

## How to read it
1. Start with `AURUM_UI_GUIDE.md` — the rebuild spec.
2. `comparison/SCORECARD.md` — where Aurum scores vs refs (1–5).
3. `comparison/DESIGN_GAPS.md` — the 8 prioritized gaps + fixes.
4. `recommendations/QUICK_WINS.md` — do these first (~5–6 hrs, big lift).
5. `CAPTURE_MANIFEST.md` — exactly what was/wasn't captured (honest).

## Key findings (TL;DR)
- **heyclicky is a WIP** (red wireframe placeholders). Do NOT model Aurum on it.
- **Wispr Flow is the model**: EB Garamond + Figtree, cream #FFFFEB,
  lavender #F0D7FF, carousels, motion-blur. Production-complete.
- **Aurum's weakest**: emoji icons (1/5), no motion (1/5), no sticky nav
  (1/5), Times New Roman logo / no loaded type (2/5).
- **Aurum's strongest**: dark gold/mint color (4/5), layout/IA (4/5).
- Top 3 fixes (low effort, high lift): Lucide icons, load Fraunces+Satoshi,
  sticky header + card elevation.

## Method & honesty notes
- Aurum captured via **Playwright** (Vercel is allow-listed here).
- heyclicky + wisprflow captured via **managed browser** (their hosts are
  TLS-blocked from this sandbox's curl/Playwright; the proxy is desktop-only,
  so tablet/mobile reference shots are UNCONFIRMED — documented in the manifest).
- Aurum **tablet/mobile** are partial (sandbox caps foreground at 60s +
  reaps background processes); desktop is 100% captured. Manifest is honest.
- Aurum **gated app UI** (dashboard/builder/generate WITH data) is NOT
  captured — needs a logged-in session. Login-redirect state IS captured.

## Next step
Run `recommendations/IMPLEMENTATION_ROADMAP.md`. Foundations + quick wins
first (~week 1), then the authenticated app + motion (~week 2). The audit
is purely frontend — no backend changes required.
