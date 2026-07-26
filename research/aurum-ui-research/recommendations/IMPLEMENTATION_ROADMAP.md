# IMPLEMENTATION_ROADMAP

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
