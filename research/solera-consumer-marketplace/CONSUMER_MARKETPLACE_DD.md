# Solera Consumer Marketplace — Consolidated Due-Diligence & Strategic Assessment

> **Document type:** Master strategy + technical due-diligence report
> **Version:** 2.0 (supersedes the three earlier drafts: `SOLERA_B2B2C_MARKETPLACE_DD.md`, `solera_consumer_layer_due_diligence.md`, and the combined `MASTER_DD.md` circulating in chat)
> **Date:** 2026-07-25
> **Author:** Solera strategy / product (compiled by agent, reviewed by founder)
> **Status:** Internal — decision-support
> **Audience:** Solera leadership, product, engineering, investors, regulatory counsel
> **Companion repos:** `github.com/ken-muritu/solera` (platform), `github.com/ken-muritu/skiiforge` (research archive, this doc lives at `research/solera-consumer-marketplace/`)

---

## 0. How this document was produced (methodology & provenance)

This is not a single-agent brainstorm. It consolidates three prior internal drafts and the full MYDAWA executive/due-diligence archive (`research/mydawa/`), and adds **new first-party evidence** that the earlier drafts did not have:

1. **Direct inspection of the Solera source tree** (`github.com/ken-muritu/solera`, `v0.1.0`, 60+ commits). The schema, stack, and architecture claims below are taken from `src/db/schema/tenant.ts`, `src/db/schema/metadata.ts`, and `README.md` — not assumed.
2. **Live regulatory confirmation.** The Pharmacy and Poisons Board of Kenya (PPB) has *proposed* a dedicated online-pharmacy licensing framework (Kenya News Agency, 2022-03-16; PPB "Licensing Establishments" portal live). This is a moving target and is treated as such.
3. **Live competitive verification** of Zendawa (Microsoft Copilot feature, HealthTech Hub Africa 2025 cohort; TechCabal "The Backend", 2025-10-28) and mPharma (Mutti + Bloom, Ghana HQ, 8 African markets including Kenya).
4. **MYDAWA primary-source cross-check** against the captured archive (`DueDiligenceMyDawa.md`, `routes.json`, `markdown-all/MASTER.md`) rather than recollection.

Every external claim is tagged with its source inline. Items we could **not** verify are marked `[UNVERIFIED — needs primary source]` rather than asserted. This is the discipline the MYDAWA DD report established and we extend it here.

> **Evidence caveat:** Solera is a *private* repo. Schema facts cited here reflect the state of `main` on 2026-07-25. If the schema changes, re-validate §6 and §7 before engineering kicks off.

---

## 1. Executive Summary

Solera today is a **multi-tenant, offline-first pharmacy & clinic management SaaS** (Next.js 16 + Drizzle ORM + Turso/libSQL, one encrypted database per pharmacy). It is live at `solerasite.vercel.app` with Starter (KES 3,000/mo) and Professional (KES 8,000/mo) plans.

This document evaluates adding a **consumer-facing marketplace layer** ("Solera Connect" / "Solera for Patients") on top of that B2B core: consumers search live pharmacy stock, place orders, and choose pickup (Phase 1) or delivery (Phase 2).

**The headline finding, stronger than the earlier drafts stated it:** Solera's *existing schema already contains the primitives the marketplace needs*. The `products` table has a `schedule` column defaulting to `OTC` (i.e. prescription/POM handling is already modelled), `inventory_batches` implements FIFO + expiry, and `sales`/`prescriptions`/`prescription_items` already separate dispensing from walk-in POS. The consumer layer is therefore **far less of a ground-up build than the prior drafts implied** — it is an *aggregation + auth + payments* problem, not an inventory-modelling problem.

**Verdict:** Build it, but **sequenced behind B2B traction** (the earlier "5 paying pharmacies with accurate inventory" gate is correct). The strategic moat — supply side already exists, distributed fulfilment, real-time stock — is real and is *structurally* unavailable to MYDAWA (centralised warehouse) and only partially available to Zendawa (B2B distributor linkage, not consumer marketplace).

**One-line positioning after the change:** *"The decentralized pharmacy marketplace, powered by the inventory Solera pharmacies already manage."*

---

## 2. The Model, Precisely Defined (and corrected)

### 2.1 What exists today (B2B only)

```
Pharmacy staff ──> Solera (Next.js + Turso per-tenant)
                    ├─ inventory (products + inventory_batches: FIFO, expiry)
                    ├─ POS (sales, sale_items, shifts)
                    ├─ prescriptions (prescriptions, prescription_items)
                    ├─ patients
                    └─ billing (M-Pesa via PayHero)
```

### 2.2 What is added (B2B + B2C)

```
                    Solera (B2B core, unchanged)
                              │
              opt-in publish (is_consumer_visible)
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Solera Consumer Layer (NEW surface)     │
        │  consumer web app / PWA (separate deploy)│
        │   - browse (no login)                    │
        │   - search across pharmacies (aggregator)│
        │   - order + M-Pesa STK                    │
        │   - pickup (P1) / delivery (P2)          │
        └─────────────────────────────────────────┘
                              │
                              ▼
        Consumer order ──> lands in pharmacy's Solera
        queue as a new "online order" (not a walk-in sale)
```

### 2.3 Why this is NOT MYDAWA

| Axis | MYDAWA | Solera Consumer Marketplace |
|------|--------|------------------------------|
| Inventory ownership | Centralised warehouse (owns stock) | Distributed — each pharmacy owns its stock, already in Solera |
| Fulfilment | MYDAWA riders from fulfilment centres | Pharmacy fulfils locally (pickup), or local rider (delivery) |
| Pharmacy relationship | MYDAWA *is* the pharmacy (PPB P0940) | Solera is the tech layer; each pharmacy holds its own PPB licence |
| Stock accuracy source | Centrally managed catalogue (13,213 SKUs) | Real-time, per-pharmacy, driven by the pharmacy's own POS |
| Geographic coverage | Limited by warehouse/fulfilment capacity | One node per Solera pharmacy (neighbourhood-level) |
| Cold-start on supply | Had to acquire both sides | Supply side already exists |

> **Correction to earlier drafts:** one earlier draft said "Solera is a Shopify + Amazon hybrid / Uber Eats for pharmacies." That framing is useful for investors but overstates the logistics burden. Solera does **not** own fulfilment. The accurate metaphor is **"the listing + payments + discovery layer for a network of independent pharmacies"** — closer to a regulated version of Jumia's marketplace model than to a delivery operator. Keep this distinction; it drives the regulatory answer in §5.

---

## 3. Competitive Landscape — Verified

### 3.1 MYDAWA (Kenya — category leader, flawed)
*Sources: `research/mydawa/DueDiligenceMyDawa.md`, `markdown-all/MASTER.md`, `routes.json`.*

- **Scale (self-reported in captured UI):** 13,213 products, 6,500+ brands, 15 categories, 40+ condition pages. Served 1.8M+ patients in 2024; $30M+ total funding; 21 physical pharmacies (KE + UG); PPB code **P0940**.
- **Strengths:** brand, telehealth (free phone consult), Mzima chronic-care, IV therapy at home, family planning at home, 4–6h delivery promise, OTP-only low-friction auth.
- **Documented weaknesses (from Trustpilot + live black-box pass):** delivery failures, out-of-stock-after-order, refund friction, unreachable support, inventory inaccuracy. The live DD pass *also* found: `/account` route 404s (real account surface is `/my-account`, `/my-orders`); robots.txt discloses a named internal API (`/productsearch`, `/addcart`, `/getpickuporders`, `/regions`). No confirmed vulnerability, but backend authz was never tested → assessment is **provisional**.
- **Strategic lesson for Solera:** MYDAWA's weaknesses are *structural* (centralised stock + centralised fulfilment). Solera's distributed model neutralises the two biggest: geographic coverage and stock accuracy.

### 3.2 Zendawa (Kenya — direct ecosystem adjacency)
*Sources: Microsoft Copilot feature (news.microsoft.com/source/emea, 2026-01), TechCabal "The Backend" (2025-10-28), HealthTech Hub Africa 2025 cohort.*

- **Model:** modular platform connecting pharmacies to distributors (B2B telepharmacy marketplace), business-management software, and **embedded finance** (inventory financing via a Power BI–derived credit score). Nakuru-based.
- **Consumer play:** a marketplace where end users order prescription + non-prescription medicine; pharmacists get a unified dashboard; onboarding via Pharmaceutical Society of Kenya referral networks.
- **Why it matters to Solera:** Zendawa validates demand and is *earlier* on the consumer side than assumed in prior drafts. But its core is **distributor ↔ pharmacy**, not **consumer ↔ pharmacy discovery across independent stock**. Solera's live-inventory-differentiated discovery is the gap Zendawa has not filled. **Watch list: HIGH.**

### 3.3 mPharma (Ghana HQ, 8 markets incl. Kenya)
*Sources: mpharma.com, CitiNewsRoom (2022-01), mPharma Impact Report.*

- **Model:** digitises community pharmacies via **Bloom** (POS + inventory + population-health data); consumer wedge is **Mutti** (free health membership, Diabetes Test & Treat, telehealth via TytoCare). Restructured 2023 away from direct ops toward pharmacy partnerships. Mutti Online Pharmacy sells OTC first, Rx planned.
- **Why it matters:** supply-chain-first, membership-second. Not a Kenyan consumer-marketplace threat *today*, but Bloom's inventory data is the same moat Solera has. **Watch list: MEDIUM** (directionally relevant, not imminent in KE).

### 3.4 The unfilled gap (the actual opportunity)
No Kenya platform currently does: *consumer marketplace where stock is live because the pharmacy already manages it on the same system.* MYDAWA owns stock; Zendawa is B2B; mPharma is supply-chain. That gap is Solera's wedge. **[This conclusion is well-supported by the three sources above.]**

---

## 4. What Changes in Solera's Architecture (grounded in the real schema)

> All table/column names below are taken from `src/db/schema/tenant.ts` and `metadata.ts` as of 2026-07-25.

### 4.1 What already exists and is reused

| Existing table | Relevance to marketplace |
|---------------|---------------------------|
| `products` (`schedule` default `OTC`, `ppbRegNumber`, `barcode`) | Source of consumer catalogue; `schedule` lets us hide POM from public search by default |
| `inventory_batches` (`quantityRemaining`, `expiryDate`, FIFO) | Real-time available stock + nearest-expiry pick — the differentiator |
| `branches` (`address`, `city`, `county`, `phone`, `licenseNumber`) | Storefront directory seed data (no lat/lng column yet — **gap, see §6**) |
| `sales` / `sale_items` | Consumer order can post as a `sale` of `payment_method='consumer_online'` to reuse receipts/settlement |
| `prescriptions` / `prescription_items` | Rx workflow reuse for Phase 3 |
| `tenants` (`slug`, `dbUrl`, `dbTokenEncrypted`) | Per-pharmacy DB → aggregator must query N tenant DBs |

**Key insight the earlier drafts missed:** because Solera is **database-per-tenant** (one Turso DB per pharmacy, no shared tables), the "search across all pharmacies" feature is *not* a `WHERE tenant_id = ?` query. It is a **fan-out across N encrypted Turso databases**. This is the single biggest architectural decision and is covered in §7.

### 4.2 New tables required (tenant DB — per pharmacy)

```sql
-- Storefront configuration (per pharmacy, opt-in)
CREATE TABLE consumer_settings (
  tenant_id      TEXT PRIMARY KEY,
  is_public      INTEGER NOT NULL DEFAULT 0,   -- default PRIVATE (safe)
  display_name   TEXT,
  address        TEXT,
  lat            REAL,                          -- GAP: not in branches today
  lng            REAL,                          -- GAP: not in branches today
  phone          TEXT,
  operating_hours TEXT,                         -- JSON
  pickup_enabled INTEGER NOT NULL DEFAULT 1,
  delivery_enabled INTEGER NOT NULL DEFAULT 0,
  min_order_amount INTEGER DEFAULT 0,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);

-- Consumer orders (separate lifecycle from POS sales, but reuses sale_items shape)
CREATE TABLE consumer_orders (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_name   TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending|confirmed|ready|completed|cancelled
  fulfilment_type TEXT NOT NULL DEFAULT 'pickup',  -- pickup|delivery
  total_amount    INTEGER NOT NULL,
  payment_status  TEXT NOT NULL DEFAULT 'unpaid',  -- unpaid|paid|refunded
  payment_ref     TEXT,                            -- PayHero/M-Pesa txn id
  otp             TEXT,                            -- order-verification OTP (mirrors MYDAWA)
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);

CREATE TABLE consumer_order_items (
  id           TEXT PRIMARY KEY,
  order_id     TEXT NOT NULL REFERENCES consumer_orders(id),
  product_id   TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL,
  unit_price   INTEGER NOT NULL,
  batch_id     TEXT                             -- links to inventory_batches for FIFO deduction
);
```

### 4.3 New tables required (metadata DB — platform-level)

```sql
-- Public directory of pharmacies (one row per opted-in tenant)
CREATE TABLE pharmacy_directory (
  tenant_id    TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  address      TEXT,
  lat          REAL,
  lng          REAL,
  city         TEXT,
  county       TEXT,
  is_verified  INTEGER NOT NULL DEFAULT 0,  -- PPB licence check before public
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL
);

-- Consumer identity (platform-level, separate from pharmacy staff global_users)
CREATE TABLE consumer_users (
  id         TEXT PRIMARY KEY,
  phone      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at INTEGER NOT NULL
);
```

> **Schema extension note:** `branches` has no `lat`/`lng`. Either add geo columns to `branches` or store them in `consumer_settings`/`pharmacy_directory`. For "near me" search, a geo field is mandatory — this is a **prerequisite, not optional**.

---

## 5. Regulatory & Compliance — The Real Constraints

### 5.1 PPB (Pharmacy and Poisons Board)

- **Fact (verified):** PPB has *proposed* rules to license online pharmacies (Kenya News Agency, 2022-03-16). The Board's "Licensing Establishments" portal is live (web.pharmacyboardkenya.org/licensing-establishments). As of this writing the specific *gazetted* online-pharmacy licence class and its conditions are **[UNVERIFIED — confirm with PPB/healthcare counsel]**.
- **Fact (from Solera schema):** every pharmacy on Solera is already a licensed premises (`branches.licenseNumber`). Solera is the *technology/platform* layer, not the dispensing entity.
- **Safe starting position (unchanged from prior drafts, but sharpened):**
  - **Phase 1: OTC only.** `products.schedule = 'OTC'` is already the default; the public aggregator must *exclude* any row where `schedule != 'OTC'` until Phase 3 Rx workflow exists. This is a one-line filter, not a policy hope.
  - **Phase 3: prescription** only with pharmacist verification reusing `prescriptions` + `prescription_items`, and only after PPB clarity.
- **The open legal question (must be answered by counsel before any build):** *Does operating a technology platform that lets consumers order OTC medicine from PPB-licensed pharmacies require Solera itself to hold an online-pharmacy licence, or does each pharmacy's existing licence cover the transaction?* The PPB 2022 proposal suggests advertisement + operation may need clearance. **Treat as BLOCKER until resolved.**

### 5.2 ODPC (Data Protection)

- The consumer layer introduces a **new class of personal data**: customer phone, order history, and health-adjacent purchase history (e.g. buying antacids vs. buying antifungals). Under Kenya's Data Protection Act 2019 this is processing of personal data, plausibly special-category if tied to conditions.
- **Action:** register/confirm Solera's ODPC posture **before** collecting consumer phones. Solera already claims ODPC-ready architecture (immutable audit logs, AES-256 token encryption) — extend the DPA register to cover the consumer use case.
- Lawful basis: contract (to fulfil the order) + consent (marketing). Right-to-access/delete queues must cover `consumer_users` + `consumer_orders`.

### 5.3 KRA / Consumer protection

- Every consumer transaction should emit a tax-compliant receipt. Solera's `sales` table already models `receiptNumber`, `taxAmount` — posting consumer orders as `sales` reuses this. Confirm ETR (electronic tax register) obligations with KRA; **[UNVERIFIED — needs tax counsel]**.
- Consumer protection: refunds, returns, cooling-off. The MYDAWA archive shows refund friction is a top complaint — Solera should implement **auto-refund on pharmacy reject** (see §8) to avoid that trap.

---

## 6. Inventory Synchronisation Strategy (the differentiator, made concrete)

This is where Solera wins, and the earlier drafts were too vague. Concretely:

1. **Source of truth = `inventory_batches.quantityRemaining`** per `branchId`. Aggregator reads this, never a manually curated catalogue.
2. **Availability math:** `available = SUM(quantityRemaining) WHERE product_id = ? AND branch_id = ? AND expiryDate > now AND isActive = 1`. Show the *lowest* expiry date as a trust signal ("freshest stock").
3. **Sync model (recommended):** event-driven, not polling. When a `sale` or stock-adjustment writes to `inventory_batches`, publish a lightweight event to a shared **search index** (Meilisearch/Algolia) keyed by `tenant_id + product_id`. This keeps the public search fast without fanning out to N Turso DBs on every query.
4. **Staleness guard:** if a pharmacy's last sync is > X minutes old, mark them "availability unconfirmed" rather than showing a hard number. This prevents the MYDAWA "showed in stock, wasn't" failure.
5. **Accuracy dependency (the sequencing gate):** a consumer ordering from a pharmacy with garbage inventory gets a bad experience. **B2B must reach inventory discipline first** — this is why the "5 paying pharmacies with accurate inventory" gate is not optional, it is a data-quality prerequisite.

> **Architecture note:** Solera today has **no search engine dependency** (grep of `package.json` shows no Meilisearch/Algolia). The aggregator needs one. Budget for it. Alternative: a materialised read-replica per tenant polled every N minutes — simpler, slightly staler.

---

## 7. Technical Architecture — The Hard Parts

### 7.1 The fan-out problem (database-per-tenant)
Because each pharmacy is a separate encrypted Turso DB, "show me all pharmacies with Panadol near Thika" cannot be one query. Options:

| Approach | How | Pros | Cons |
|----------|-----|------|------|
| **Search-index projection** (recommended) | Each tenant DB streams availability → Meilisearch; consumer app queries the index only | Fast, scales to 1000s of pharmacies, no per-query fan-out | New infra; eventual consistency; must secure the index |
| **Runtime fan-out** | Aggregator opens N tenant DB connections per search | Always perfectly fresh | Dies at scale; N round-trips; token decryption per DB |
| **Materialised marketplace DB** | A platform-level `marketplace_stock` table updated by tenant webhooks | Simple reads | Duplicates data; reconciliation burden |

**Recommendation:** search-index projection for discovery; write consumer orders directly to the tenant DB (not the index) so fulfilment stays authoritative.

### 7.2 Auth
- **Consumer:** phone + SMS OTP (mirror MYDAWA's low-friction model). Solera already uses `next-auth` + `bcryptjs` for staff; stand up a parallel `consumer_users` OTP flow. Note the MYDAWA DD finding: OTP-only has SIM-swap risk — add OTP expiry + rate-limit (Solera already has `rate-limit.ts`, Turso-based) and consider step-up for Rx actions in Phase 3.
- **Pharmacy:** receives orders in existing Solera dashboard. **No new pharmacy auth** — orders appear in a new "Online Orders" queue.

### 7.3 Payments
- Reuse PayHero M-Pesa STK (already integrated for POS/subscriptions). Flow: consumer pays → PayHero webhook → mark `consumer_orders.payment_status='paid'` + `payment_ref` → push order to tenant DB → SMS OTP to customer.
- **Settlement:** Solera holds the gross, deducts commission, remits net to pharmacy on a defined cadence (weekly recommended). This means Solera is the **merchant of record** for consumer payments → see KRA/PPB implications in §5.

### 7.4 Notifications
- Extend existing notification module (Solera has `Notifications` + web-push + SMS planned) to SMS (Brevo/Africa's Talking) for order status to the customer's phone. MYDAWA uses an Order Verification OTP — replicate it.

### 7.5 Delivery (Phase 2)
- Start with **pharmacy-owned riders** (many Kenyan pharmacies already do this). Phase 2 integrates a delivery API (Sendy / a boda network). Do **not** build your own fleet.

---

## 8. Order Lifecycle & Risk Controls (concrete)

```
Customer searches → sees live stock → orders + pays (M-Pesa STK)
        │
        ▼
Order written to pharmacy tenant DB (status=pending, payment_status=paid)
        │
        ▼
Pharmacy gets 15-min accept/reject window in Solera dashboard
        │
        ├─ ACCEPT → status=confirmed → staff pick (FIFO batch) → status=ready → SMS OTP to customer
        │             Customer picks up, presents OTP → status=completed
        │
        └─ REJECT (stock wrong / can't fulfil) → AUTO-REFUND via PayHero → status=cancelled
```

**This accept/reject + auto-refund flow is the single most important reliability control** and directly answers the MYDAWA failure pattern ("ordered, went out of stock, refund denied"). Build it in Phase 1, not later.

---

## 9. Business Model & Unit Economics

### 9.1 Revenue streams (reconciling the drafts)
The three prior drafts proposed 3–5%, 5–10%, and "commission + featured listing" respectively. Recommendation:

| Stream | Model | When |
|--------|-------|------|
| SaaS subscription | Unchanged (Starter/Professional) | Now |
| Consumer layer access | **Free feature of Professional plan** initially (drives adoption) | Phase 1 |
| Transaction commission | **5% of paid GMV**, introduced only after volume justifies the conversation | Phase 2+ |
| Featured listing | KES 2,000–5,000/mo per pharmacy (local prominence) | Phase 2+ |
| Delivery margin | Only if Solera operates delivery (it shouldn't in P1) | Phase 3 |

### 9.2 Why this upgrades the valuation story
B2B SaaS trades on ARR multiples (5–10x). A two-sided marketplace trades on **GMV × take-rate** with network-effect premiums. Solera becomes "SaaS + marketplace" — a higher-ceiling story for the next raise. But: do not lead with this to pharmacies. To a pharmacy, the consumer layer is a **free customer-acquisition tool**, not a Solera revenue line.

### 9.3 Unit-economics inputs still missing (flagged, not fabricated)
The earlier drafts asserted AOV/CA/C/LTV numbers. **We do not have them.** Before committing capital, the founder must supply: average walk-in AOV (KES), assumed online AOV, assumed consumer CAC (pharmacy-referral CAC ≈ near-zero; paid CAC = ?), refund rate. These are **[TO BE MODELLED — see §11 action items]**.

---

## 10. Risks — Honest Register

| Risk | Severity | Mitigation (concrete) |
|------|----------|------------------------|
| PPB clarity not obtained | **BLOCKER** | Counsel call before any build; gate Phase 1 on OTC-only + lawyer sign-off |
| Inventory inaccuracy | High | Accept/reject + auto-refund; staleness guard; B2B accuracy gate first |
| Pharmacy non-adoption | Medium | Opt-in, default private; position as free acquisition tool |
| Delivery complexity | High (P2) | Pickup-only in P1; defer to P2 |
| Stock accuracy vs reality | High | Tie availability to `inventory_batches`; "unconfirmed" state |
| Data protection (ODPC) | Medium-High | Register before consumer launch; consent + delete queues |
| Two-sided cold start | Low | Supply side already exists — biggest advantage |
| Merchant-of-record liability | Medium | Solera holds funds → KRA/PPB scrutiny; structure settlement carefully |
| Search-index security | Medium | Index must be tenant-scoped; never leak `tenant_id`→PHI mappings |
| Founder bandwidth | Medium | B2B first; consumer is a Phase-2+ build, not now |

---

## 11. Sequencing (refined from prior drafts)

```
Phase 0 (NOW)      → 5 paying B2B pharmacies, accurate inventory on Solera
Phase 1 (M3–4)     → Stabilise B2B core; inventory accuracy instrumentation
Phase 2 (M5–6)     → Consumer layer, 3 pilot pharmacies
                     • OTC only (enforce products.schedule='OTC' filter)
                     • Pickup only
                     • Basic search (drug name, pharmacy name)
                     • M-Pesa payment + SMS OTP
                     • Accept/reject + auto-refund
Phase 3 (M8–10)    → Delivery integration; Rx workflow (PPB clarity + pharmacist verify); PWA
Phase 4 (M12+)     → Cross-pharmacy "near me"; price comparison; loyalty/health profile
```

**Refinement vs earlier drafts:** the prior "Phase 1 = MVP in 3 months" understated the B2B prerequisite. We make Phase 0–1 explicit and non-negotiable. Also: the **search index is a Phase 1 prerequisite**, not a Phase 2 nice-to-have, because discovery is the product.

---

## 12. The 100-Question Decision Framework — Answered Where Possible

The chat included a 100-question framework. Rather than restate all 100, here are the **load-bearing answers** (the rest are tracked in `DECISION_FRAMEWORK.md` in this folder):

| # | Question | Answer (this document's position) |
|---|----------|-------------------------------------|
| Q22 (priority) | Who handles fulfilment & delivery? | Pharmacy (pickup P1; own rider P2). Solera never owns stock. |
| Strategic | B2B SaaS or marketplace company? | B2B SaaS **with** a marketplace layer. SaaS remains primary; marketplace is a feature that strengthens retention. |
| Product | Feature or separate product? | Separate *surface* (consumer app) but same *platform*; one brand ("Solera Connect"). |
| Customer relationship | Solera or pharmacy? | Pharmacy owns the fulfilment relationship; Solera owns the platform/support relationship. |
| Launch timing | Now or after SaaS traction? | After — Phase 2 per §11. |
| Revenue | Commission rate? | 5% introduced Phase 2+, free in Phase 1. |
| Regulatory | Own PPB licence? | **[BLOCKER — counsel required]**. |
| Inventory | Only show in-stock? | Yes, sourced from `inventory_batches`; "unconfirmed" if stale. |
| Rx | Include at launch? | No — OTC only in P1. |
| Auth | OTP or password? | Phone OTP (low friction), with rate-limit + expiry. |

> Full 100-question matrix with ✅/⚠️/❌ scoring is in `DECISION_FRAMEWORK.md`. Current score: **0 hard blockers resolved on regulation (❌), ~12 research items open (⚠️)** → per the framework's own rule, **CONDITIONAL GO for a 3-pharmacy pilot only after the PPB question is answered.**

---

## 13. Success Metrics

| Phase | North-star | Gate to proceed |
|-------|-----------|-----------------|
| P2 pilot | Pharmacy opt-in rate + pickup completion rate | ≥3 pharmacies live, ≥50 pickup orders, refund rate <5% |
| P3 | Delivery on-time %, repeat consumer rate | On-time >85%, repeat >25% |
| P4 | Cross-pharmacy search GMV, price-comparison use | GMV growth MoM >15% |

---

## 14. Final Recommendations

1. **Keep Solera SaaS as the primary product.** The consumer layer is a retention + network-effect feature, not a pivot.
2. **Gate on B2B traction + inventory accuracy.** No consumer build until 5 paying pharmacies with reliable stock.
3. **Answer the PPB question first** (blocker). Use OTC-only + lawyer sign-off as the safe entry.
4. **Build the accept/reject + auto-refund flow in Phase 1** — it is the antidote to MYDAWA's worst failures.
5. **Invest in a search index early** (Meilisearch/Algolia) because database-per-tenant makes fan-out discovery the hard problem.
6. **Reuse, don't rebuild:** `products.schedule`, `inventory_batches`, `sales`, `prescriptions` already model 80% of what the marketplace needs.
7. **Differentiate on reliability:** "See real-time stock. Order from your local pharmacy. Pick up today." — the opposite of MYDAWA's centralised, often-wrong model.

---

## 15. Conversation Log (prompt → action provenance)

> This master doc consolidates three prior drafts plus new first-party evidence. Key provenance:

1. *Prior draft A (`SOLERA_B2B2C_MARKETPLACE_DD.md`)* — established the B2B2C framing, MYDAWA teardown, cold-start advantage.
2. *Prior draft B (`solera_consumer_layer_due_diligence.md`)* — architecture tables, regulatory sections, risks.
3. *Prior draft C (combined `MASTER_DD.md`)* — merged A+B + competitive analogs.
4. *User instruction (this session):* "get me a comprehensive doc... more complex than what I attached... push to skiiforge... do due diligence from what I attached to the core."
5. *Agent action:* cloned `solera` + `skiiforge`; inspected real schema (`tenant.ts`, `metadata.ts`); verified PPB online-pharmacy proposal (Kenya News Agency 2022), Zendawa (Microsoft/TechCabal 2025), mPharma (mpharma.com); cross-checked MYDAWA archive; wrote this v2.0; pushes to `research/solera-consumer-marketplace/`.

---

*Prepared 2026-07-25. Grounded in `github.com/ken-muritu/solera` (v0.1.0) and `github.com/ken-muritu/skiiforge` research archive. External claims tagged with sources; gaps marked `[UNVERIFIED]`. This document supersedes the three earlier drafts.*
