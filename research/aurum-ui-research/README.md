# Aurum UI Research

> Comprehensive UX/UI teardown + design-system analysis for rebuilding
> Aurum's frontend, benchmarked against **heyclicky.com** and **wisprflow.ai**.

## The deliverable (consolidated, single-file per finding)
This repo was consolidated so you don't dig through 50+ scattered files.
Each report is ONE self-contained markdown:

- **AURUM_AUDIT.md** - THE master file (68KB). Guide + all findings + all three
  project reports appended. Read this one cover-to-cover.
- **AURUM_REPORT.md** - Aurum's full audit (site-map, components, brand-voice,
  typography, colors, spacing, motion, accessibility, verbatim content, shots).
- **WISPRFLOW_REPORT.md** - reference north star (production-complete).
- **HEYCLICKY_REPORT.md** - reference (WIP; flagged, not a model).
- **FINDINGS_COMPARISON.md** - UX / visual / brand / gaps / scorecard.
- **FINDINGS_RECOMMENDATIONS.md** - quick wins / redesign / design-system / roadmap.
- **AURUM_UI_GUIDE.md** - canonical rebuild spec (token :root, component before/after).
- **CAPTURE_MANIFEST.md** - honest per-(site x page x viewport x state) log.

## Raw evidence (not consolidated)
- `aurum/content/`, `heyclicky/content/`, `wisprflow/content/` - verbatim DOM extracts.
- `aurum/screenshots/`, `heyclicky/screenshots/`, `wisprflow/screenshots/` - 49 PNGs.

## Key findings (TL;DR)
- **heyclicky is a WIP** (red wireframe placeholders) - NOT a model.
- **Wispr Flow is the model**: EB Garamond + Figtree, cream #FFFFEB, lavender
  #F0D7FF, carousels, motion-blur. Production-complete.
- **Aurum's weakest**: emoji icons (1/5), no motion (1/5), no sticky nav (1/5),
  Times New Roman logo / no loaded type (2/5).
- **Aurum's strongest**: dark gold/mint identity (4/5), layout/IA (4/5).
- Top 3 quick wins (low effort, high lift): Lucide icons, load Fraunces+Satoshi,
  sticky header + card elevation.

## Method / honesty
- Aurum captured via **Playwright** (Vercel allow-listed). Desktop 100%, tablet
  partial, mobile 0 (sandbox caps 60s + reaps bg processes).
- heyclicky + wisprflow via **managed browser** (their hosts TLS-blocked from
  this sandbox; proxy is desktop-only -> no tablet/mobile ref shots; documented).
- Aurum **gated app UI** (dashboard/builder/generate WITH data) NOT captured -
  needs a logged-in session. Login-redirect state IS captured.

## Due-diligence note
Every per-site file was checked for cross-contamination before consolidation:
aurum/* = dark gold identity; heyclicky/* = light + blue + WIP wireframe;
wisprflow/* = cream + lavender + serif. No leakage. Screenshots in correct folders.
