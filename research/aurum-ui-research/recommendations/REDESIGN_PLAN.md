# REDESIGN_PLAN — rebuild Aurum UI from this research

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
