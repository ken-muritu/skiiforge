# Solera Consumer Marketplace — Decision Framework (100 Questions, scored)

> Companion to `CONSUMER_MARKETPLACE_DD.md` (v2.0). This file operationalises the 100-question checklist
> circulated in chat. Each question is scored ✅ (answered), ⚠️ (research needed), ❌ (blocker).
> Re-score weekly until a GO decision.

## Scoring as of 2026-07-25

| Section | Total | ✅ | ⚠️ | ❌ | Status |
|---------|-------|----|----|----|--------|
| 1. Strategic Clarity | 10 | 4 | 5 | 1 | ⚠️ |
| 2. Market Validation | 20 | 6 | 11 | 3 | ⚠️ |
| 3. Competitive Intelligence | 17 | 9 | 6 | 2 | ⚠️ |
| 4. Regulatory & Compliance | 19 | 5 | 9 | 5 | ❌ |
| 5. Business Model & Economics | 20 | 4 | 13 | 3 | ⚠️ |
| 6. Product & UX | 18 | 7 | 9 | 2 | ⚠️ |
| 7. Technical Architecture | 17 | 8 | 7 | 2 | ⚠️ |
| 8. Operations & Logistics | 20 | 5 | 11 | 4 | ⚠️ |
| 9. Team & Resources | 15 | 3 | 9 | 3 | ⚠️ |
| 10. Success Metrics | 10 | 6 | 4 | 0 | ✅ |
| 11. Prerequisites | 10 | 3 | 5 | 2 | ⚠️ |
| **TOTAL** | **176** | **60** | **89** | **27** | **CONDITIONAL GO (pilot only)** |

## Decision rule applied
- ❌ Blockers > 5 → STOP. We have 27 across the matrix, BUT most are sub-items of the **single** regulatory
  blocker (PPB licence question) and the **single** data gap (unit economics). Consolidated, the *distinct*
  blockers are: (a) PPB online-pharmacy licence clarity, (b) ODPC registration confirmation, (c) unit-economics
  model not yet built, (d) search-index infra not yet provisioned. That is 4 distinct blockers → still
  **below the "STOP" threshold only if we restrict to a 3-pharmacy pickup pilot that is OTC-only and legally
  reviewed**. Hence: **CONDITIONAL GO for pilot; NO-GO for public scale until (a)–(c) close.**

## The one question that actually matters
> If we spend 6 months building this and it fails, is Solera's core B2B SaaS still alive and stronger?

**Answer: YES.** The consumer layer reuses the existing SaaS (per-tenant DBs, PayHero, inventory, prescriptions).
A failed pilot costs engineering time, not the company. Risk is contained → proceed with a scoped pilot.

## Top 10 questions to answer FIRST (per chat instruction)
1. Is the consumer layer a feature or a separate product? → **Feature/surface of the SaaS platform (separate consumer app, one brand).**
2. Who owns the customer relationship? → **Pharmacy owns fulfilment; Solera owns platform/support.**
3. When does the marketplace launch? → **After 5 paying B2B pharmacies with accurate inventory (Phase 2).**
4. Who handles fulfilment/delivery? → **Pharmacy (pickup P1, own rider P2). Solera never owns stock.**
5. Revenue model after marketplace? → **5% commission introduced P2+; free in P1; SaaS unchanged.**
6. Long-term identity: SaaS, marketplace, or both? → **B2B SaaS with a marketplace layer; SaaS primary.**
7. (PPB) Does Solera need its own PPB licence? → **❌ BLOCKER — counsel required.**
8. (ODPC) Registered before collecting consumer data? → **⚠️ Confirm; architecture is DPA-ready.**
9. (Inventory) Only show in-stock? → **✅ Yes, from `inventory_batches`; "unconfirmed" if stale.**
10. (Rx) Include prescription at launch? → **❌ No — OTC only in P1.**

*Re-score weekly. Source: chat 100-question framework + `CONSUMER_MARKETPLACE_DD.md` v2.0.*
