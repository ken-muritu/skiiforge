# Findings Recommendations

> Consolidated findings. Generated 2026-07-26.


## Quick Wins (do first)

1. **Icons: emoji -> Lucide** [design-systems/aurum.md #9]
   - Remove Target/Check/Pencil unicode from feature cards + nav.
   - Add `lucide-react`; use `<Target/> <CheckCircle/> <Pencil/> <Sparkles/>`.
   - Effort: ~1hr. Affects: home, dashboard, mastery builder, every card.

2. **Load a real type system** [design-systems/aurum.md typography]
   - Add Fraunces (display serif) + Satoshi/General Sans (sans) via `next/font`.
   - Replace Times New Roman logo + system-ui stack.
   - Effort: ~1hr. Affects: logo + all headlines/body.

3. **Sticky header** [components.md #1]
   - `position: sticky; top:0; backdrop-blur` + border-on-scroll in NavBar.
   - Effort: ~30min. Affects: all pages.

4. **Card/button elevation + hover** [motion.md, DESIGN_GUIDE.md]
   - Add `--shadow-1/2`; hover lift (`translateY(-2px)`), button press-scale.
   - Effort: ~1hr. Affects: cards, buttons, app surfaces.

5. **Semantic color tokens** [design-systems/aurum.md colors]
   - Add `--danger/--success/--warning` + use in form errors/toasts.
   - Effort: ~30min.

6. **prefers-reduced-motion** [accessibility.md]
   - Wrap transitions; disable on reduced-motion.
   - Effort: ~15min.

7. **Capture gated app UI** [manifest]
   - Log in, screenshot /dashboard /masteries/[id] /generate with data.
   - Effort: ~30min (needs credentials). Unblocks the whole app audit.

Total quick-win effort: ~5-6 hrs. Lifts Aurum from "unshipped" to
"premium SaaS" on the SCORECARD (iconography 1->5, type 2->4, nav 1->4).

## Redesign Plan

> Goal: keep Aurum's dark identity + structure (they work), upgrade
> fidelity to Wispr Flow's tier. NOT a structural redo.

## Phase 0 — Foundations (token system)
- Implement `:root` token block from AURUM_UI_GUIDE.md (color/type/
  spacing/radius/shadow/motion).
- Load Fraunces + Satoshi via next/font. Add Lucide.
- Effort: 1 day.

## Phase 1 — Marketing (public)
- Home: swap emoji->Lucide icons; Fraunces hero; sticky header;
  card hover-lift; sharpen CTA copy to 1 signature line.
- /discover: empty-state illustration; card lift.
- /login /signup /forgot /reset: card elevation; focus ring;
  error states with icon+text (not color-only).
- Effort: 2-3 days.

## Phase 2 — Authenticated app (gated, currently UNCONFIRMED)
- /dashboard: continue-learning card w/ gold progress; my-masteries
  grid (hover-lift); recent-activity feed.
- /masteries + /masteries/new: form tokens; validation UI.
- /masteries/[id]: THE core surface — icon+progress-motion+resource
  cards+quiz/project editor; fork confirm modal.
- /generate: topic input + proposal preview + save; loading skeleton.
- Effort: 3-4 days (after gated capture).

## Phase 3 — Motion + polish
- Page fade-in; button press-scale; carousel/slide for discover or
  mastery lessons; reduced-motion guard.
- Effort: 1-2 days.

## Phase 4 — Content/voice
- Mint 2 signature lines (hero + CTA). Refresh empty/error microcopy.
- Effort: 1 day (writing).

## Total: ~2 weeks, 1 engineer. No backend changes required
(the audit is purely frontend fidelity).

## Design System Plan (token spec)

> Mirror of AURUM_UI_GUIDE.md `:root`, expanded with rationale.

## Color (keep dark identity, refine)
```
--bg:#0B0D12; --surface-1:#10131A; --surface-2:#161E22; --surface-3:#232833;
--border:#2F3644; --text:#E8EBF0; --text-muted:#9AA3B2;
--gold:#E9C46A; --gold-soft:rgba(233,196,106,.12); --mint:#7FE7C4;
--danger:#FF6B6B; --success:#5BD98C; --warning:#FFB454;
```
Rationale: keep Aurum's gold/mint brand; ADD danger/success (missing).

## Type (load, don't fallback)
```
--font-sans:"Satoshi","General Sans",system-ui,sans-serif;
--font-serif:"Fraunces","Playfair Display",Georgia,serif;
--fs-hero:clamp(40px,7vw,88px); --fs-h1:56px/600/-0.02em;
--fs-h2:32px/600; --fs-h3:20px/600; --fs-body:16px/1.55; --fs-small:13px;
```
Rationale: Fraunces (warm editorial, Wispr-like) for display; Satoshi
for UI. Replaces Times New Roman + system stack.

## Spacing (8px base)
```
--sp-1:8; --sp-2:16; --sp-3:24; --sp-4:32; --sp-5:48; --sp-6:64; --container:1200px;
```

## Radius
```
--r-sm:8; --r-md:12; --r-lg:16; --r-pill:999;
```

## Elevation
```
--shadow-1:0 1px 2px rgba(0,0,0,.4);
--shadow-2:0 8px 24px rgba(0,0,0,.45);
--shadow-gold:0 8px 24px rgba(233,196,106,.18);
```

## Motion
```
--ease:cubic-bezier(.4,0,.2,1); --t-fast:140ms; --t-med:220ms; --t-slow:360ms;
@media (prefers-reduced-motion:reduce){ *{transition:none!important} }
```

## Component rules
- Button: --r-pill, --shadow-gold on hover, `translateY(-1px) scale(1.01)`,
  active `scale(.98)`.
- Card: --surface-1, --r-lg, --shadow-1, hover --shadow-2 + border brighten.
- Icon: Lucide, 20-24px, currentColor, stroke 1.75.
- Input: --r-md, padding --sp-2, error border --danger + message.
- NavBar: sticky, backdrop-blur, border-bottom on scroll.

## Implementation Roadmap

> Sequenced, with checkpoints. Each step is independently shippable.

## Week 1 — Foundations + Quick Wins
- [ ] Day 1: token `:root` (DESIGN_SYSTEM_PLAN) + next/font (Fraunces+Satoshi) + Lucide dep.
- [ ] Day 2: replace emoji icons -> Lucide across home + nav.
- [ ] Day 3: sticky header + card/button elevation + hover micro-interactions.
- [ ] Day 4: semantic danger/success tokens + form error UI + reduced-motion.
- [ ] Day 5: **CAPTURE GATED APP UI** (login + screenshot dashboard/mastery builder/generate).
- Checkpoint: SCORECARD iconography 1->5, type 2->4, nav 1->4.

## Week 2 — Authenticated app + motion
- [ ] Day 6-7: /dashboard + /masteries + /masteries/new restyle w/ tokens.
- [ ] Day 8-9: /masteries/[id] builder (core surface) — icon, progress-motion,
  resource cards, quiz/project editor, fork modal.
- [ ] Day 10: /generate proposal preview + loading skeleton.
- [ ] Day 11-12: motion pass (page fade-in, carousel for discover/lessons,
  reduced-motion guard) + voice/copy refresh (2 signature lines).
- [ ] Day 13: regression screenshot pass (3 viewports) vs this audit's shots.
- Checkpoint: full SCORECARD parity with Wispr Flow tier.

## Definition of Done
- All routes render with loaded fonts + Lucide icons + tokens.
- Tablet/mobile capture completed (re-run rig with session that persists).
- No emoji icons remain; no Times New Roman; sticky nav present.
- Reduced-motion respected.

## Risks
- Gated capture needs a real login (you provide credentials or a test account).
- Sandbox cannot keep long servers alive — run the rig from your machine
  (or a CI with a browser) for the full tablet/mobile pass.
