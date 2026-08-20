# CaspaHub — Due Diligence & Repo Verification Report

**Date:** August 20, 2026
**Method:** Direct audit of `ken-muritu/caspahub` and `ken-muritu/caspahub-booking` (both cloned fresh from GitHub, `main` branch, latest commit each dated **2026-08-18**), cross-checked line-by-line against the attached "CaspaHub — Complete Agent Context Document." Every claim below was checked against actual source — file hashes, grep results, live HTTP requests — not re-derived from the same conversation history the original document came from.

**Bottom line up front:** The architecture, stack, and bug findings in the context document are **almost entirely accurate** — genuinely good, verifiable work. But **the `caspahub-booking` "what's missing" section is significantly stale.** Both repos picked up real commits on **August 18**, after the document's context was compiled, and most of the Week 1–3 sprint items in Part 5 are **already built and live**. If the 6-week sprint plan is run as written, roughly the first two weeks would be spent re-building things that already exist. That's the single most important thing this report has to tell you.

---

## 1. What's Confirmed Accurate

Everything in this section was checked directly and matches the document.

### Stack & versions
- `caspahub`: Next.js `16.2.9`, React `19.2.4`, TypeScript `^5`, `drizzle-orm ^0.45.2`, `next-auth ^5.0.0-beta.31`, `bcryptjs ^3.0.3`, `@sentry/nextjs`, `recharts`, `react-hook-form`, `jsbarcode`, `idb`, `uuid`, `@serwist/next` — all confirmed present and at the stated versions.
- `caspahub-booking`: same base versions, plus `leaflet ^1.9.4`, `react-leaflet ^5.0.0`, `stream-chat`, `web-push`, `zustand` — confirmed.
- **One nuance the document doesn't mention:** `stream-chat`, `stream-chat-react`, `web-push`, and `zustand` are *also* dependencies of `caspahub` itself, not exclusive to `caspahub-booking` as the "plus:" framing in Part 2 implies. This is consistent with the document's own note that GetStream is "partially wired server-side" in `caspahub` — just worth knowing it's not a clean stack split.

### Database architecture
- `src/lib/tenant.ts` is **23,644 bytes** — the document's "23.6KB" is exact, not rounded.
- Metadata DB (`src/db/schema/metadata.ts`) has 14 tables, all matching the document's description (tenants, plans, subscriptions, globalUsers, tenantMemberships, tenantInvitations, auditLogs, notificationQueue, pushSubscriptions, platformSupportTickets, complianceRequests, plus onboardingLocks and profileChangeRequests and platformSupportMessages, which the document doesn't name but doesn't contradict either).
- **13 pharmacy/clinic legacy tables** in the tenant schema — this exact count is confirmed: `categories, suppliers, products, inventoryBatches, patients, prescriptions, prescriptionItems, appointments, consultations, vitals, patientConsents, sales, saleItems`.

### Confirmed bugs (all verified against actual source, not just described)
| Claim | Verified | Evidence |
|---|---|---|
| `syncBookingPayment` is dead code | ✅ Exact | Defined once in `wash.ts:210`, zero other references anywhere in `src/` |
| PayHero webhook uses `confirmBookingPayment` instead | ✅ Exact | `payhero/callback/route.ts` imports and calls it; the two functions are genuinely separate code paths |
| `recordLoyaltyTransaction` is a no-op | ✅ Exact, and worse than described | It *is* called (from `sync/replay.ts`), but its body is `await requireTenantAction(...); return { ok: true, ...payload };` — a permission check followed by an echo, zero DB write. The UI and replay queue both believe it worked. |
| `carwash.ts` / `pharmacy.ts` byte-identical dead code | ✅ Exact | Identical MD5 hashes, zero imports of either file anywhere; content is unmistakably pharmacy/PHI logic (`createPatientSchema`, `encryptPatientFields`, `compliance`) sitting in a file named `carwash.ts` |
| Daraja direct always returns 501 | ✅ Exact | `mpesa/callback/route.ts` is 6 lines, literally always returns `{ ResultCode: 1, ResultDesc: "Not configured" }` at HTTP 501 |
| Hardcoded time slots on booking page | ✅ Exact | `const TIMES = ['8:00 AM', '9:00 AM', ...]` — literal array, no availability query |
| QR code is static, unscannable SVG | ✅ Exact | Hardcoded `<rect>` finder-pattern shapes, not generated from booking data |
| "Share booking status" button has no handler | ✅ Exact | `<button>` with `Share2` icon and label, **zero** `onClick` prop |
| WhatsApp toggle is unpersisted | ✅ Exact | `useState(false)`, no API call anywhere in the component |
| `/api/branches` fans out with no caching | ✅ Confirmed, and worse than described | It doesn't just skip caching — on every single request it loops every active tenant and runs `migrateTenantSchema()` (a schema migration check) **before** each query. That's not just uncached, it's a full migration check per tenant per request. |
| RBAC: 7 roles × 4 actions | ✅ Exact | `super_admin, admin, manager, supervisor, attendant, cashier, consumer` × `read, write, delete, admin` |
| Env var validation throws in production | ✅ Confirmed, with more nuance | `src/lib/env.ts` only throws when `NODE_ENV=production` **and** (`VERCEL=1` or `CI` or `REQUIRE_ENV=1`) — local `next build` without secrets is intentionally allowed to succeed. Reasonable design, just more conditional than "the app should throw" implies. |
| Brand SVG kit exists in `caspahub` repo | ✅ Partially | A `caspahub logos/` folder exists with 5 files (logo-only and logo+wordmark, SVG/JPEG, horizontal/vertical). The document's much longer list (icon-only, monochrome, Android adaptive, iOS master, PWA icon set, splash, OG image, email signature) is **not** all in that folder — but a full PWA icon set (13 sizes, `favicon.ico`, maskable icon) does exist under `public/icons/`. So the assets exist, just not consolidated the way Part 7 implies. |
| `caspahub-booking` is live | ✅ Confirmed | `https://caspahub-booking.vercel.app/` returns HTTP 200 right now — the document's uncertainty ("Vercel project creation was in_progress when the session ended") is resolved; it's fully deployed. |

---

## 2. What's Stale — The Important Part

The document's Part 2 ("Known bugs in `caspahub-booking`") and Part 5 (sprint plan) describe a snapshot from **August 13**. Both repos have since had real commits (last one **August 18**, two days after this document's own compile date). Here is what's actually true today, checked directly against the running source:

| Document claims (Part 2 / Part 5) | Actual current state |
|---|---|
| Service worker `notificationclick` defaults to `/my-washes` (404) | **Already fixed.** `src/sw.ts` already resolves to `/washes` in both the push-display and click-handler paths. No `/my-washes` string exists anywhere in the file. |
| No `/` marketing homepage — root redirects to `/find` | **False as written.** `src/app/page.tsx` is a full marketing homepage: hero, trust bar, "how it works," featured washes pulled live from `/api/branches`, an operator CTA, an install section, and a full footer (Find a Wash / Track Booking / For Operators / About / Privacy / Terms / Help). It only client-redirects to `/find` or `/onboarding` on **mobile viewports**, and only after checking a `localStorage` onboarding flag — desktop visitors see the full page. |
| No onboarding flow | **False.** `src/app/onboarding/` exists and is exactly what the homepage redirects first-time mobile visitors to. |
| No notifications center UI | **False.** `src/app/notifications/` exists, plus a full backing API (see below). |
| No forgot-password / reset-password flow | **False.** Both `src/app/forgot-password/` and `src/app/reset-password/` exist, with matching API routes `/api/auth/forgot-password` and `/api/auth/reset-password`. |
| No vehicle management UI | **False.** `VehicleManager` component, wired into `/account`, backed by `listVehiclesForUser()` and a full CRUD API (`/api/account/vehicles`, `/api/account/vehicles/[id]`). |
| No account deletion flow | **False.** `DeleteAccountButton` component on `/account`, backed by `DELETE /api/account/delete`. |
| No rating/review submission UI | **False.** `RatingPrompt` component fires on the tracker once a booking hits `COMPLETED`, backed by `POST /api/bookings/[id]/rate`. Already gated correctly — it explicitly checks completion, not just "ready." |
| No static `/privacy` / `/terms` pages | **False.** Both exist and are linked in the homepage footer. |
| "API surface (9 routes)" | **Undercounted.** Actual route count is **21**, not 9. The missing ones from the document's list: `/api/account/*` (4 routes), `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/bookings/[id]/rate`, `/api/bookings/lookup`, `/api/notifications` (3 routes), `/api/push/subscribe`, `/api/push/unsubscribe`. |
| Part 5's "New API routes needed" table (13 routes) | **12 of 13 already exist**, verified by direct path match. Only `GET /api/branches/[id]/reviews` (a reviews-*listing* endpoint, distinct from the rating-*submission* endpoint that does exist) is genuinely missing. |

**What this means concretely for the 6-week sprint plan (Part 5):** Week 1's "build onboarding flow," "add /washes tab," Week 2's "shareable wash profile page" (still genuinely missing — see below), "rating submission," "forgot-password," "/privacy and /terms pages," and Week 3's "notifications center," "vehicle management," "account deletion," "all missing API routes" — **the large majority of this is done.** The only Part-5 item confirmed genuinely still missing is:

- **`/[branchSlug]` shareable wash profile page** — confirmed absent, no such route exists in `src/app`. This is the one real gap from that whole list.
- **`GET /api/branches/[id]/reviews`** — confirmed absent (a listing endpoint separate from the rating-submission one that already exists).

Everything else in Part 5's fix table should be re-verified screen-by-screen (not just route-existence) before assuming it's launch-ready, but the *scaffolding* claimed missing is not missing.

---

## 3. A Genuine Architectural Discrepancy Worth Resolving

The document states, twice, in the strongest possible terms:

> "**Status is NEVER stored as a mutable column.** Every status change is an `INSERT` into `washBookingEvents`. Current status = the latest event row. This is the most important architectural decision in the platform." (Part 2)
> "**Never UPDATE booking status directly.** Always INSERT a new `washBookingEvents` row." (Part 9, rule #1, "non-negotiable")

**What the code actually does** (`src/lib/actions/wash.ts`, the main status-transition function):

```ts
await tenantDb
  .update(schema.washBookings)
  .set({ status, bayNumber: bayNumber ?? booking.bayNumber, updatedAt: now })
  .where(eq(schema.washBookings.id, bookingId));

await tenantDb.insert(schema.washBookingEvents).values({
  id: nanoid(), bookingId, status, createdAt: now,
});
```

This is a **dual-write pattern**: `washBookings.status` *is* a real, directly-mutated column — updated on every single transition — and `washBookingEvents` is *also* appended to, alongside it. Same pattern confirmed in `bookings.ts` for cancellation (`.set({ status: "CANCELLED", ... })`).

This isn't a bug exactly — dual-write (mutable current-state column + append-only log for audit/history) is a legitimate, common pattern, and it does deliver the audit-trail benefit the document describes. But the specific rule as written — "status is *never* a mutable column," framed as the platform's single most important, non-negotiable architectural decision — **does not match what the codebase actually does today**, in the very file (`wash.ts`) that implements the pattern. Two things worth deciding deliberately, not by default:

1. Is the intent that new code should follow the *stricter* pure-event-sourced rule the document states (derive status only from `washBookingEvents`, stop writing to the column), or should the document be corrected to describe the dual-write pattern that's actually implemented?
2. If it's staying dual-write, what enforces the two writes never drifting out of sync? Right now, nothing does — a partial failure between the `UPDATE` and the `INSERT` (no transaction wraps them) would leave `washBookings.status` and the latest `washBookingEvents` row disagreeing, silently.

This matters because Part 9 is explicitly written as the rulebook for future contributors (human or agent) — right now it's instructing people to follow a rule the existing code doesn't itself follow.

---

## 4. New Findings Not in the Original Document

- **Table count discrepancy:** Part 10's Quick Reference says `src/db/schema/tenant.ts` has "22 tables (9 carwash + 13 pharmacy legacy)." The actual file has **26 tables**. The 13 pharmacy-legacy count is exactly right; the non-pharmacy count is **13, not 9** — the document undercounts the messaging subsystem specifically (`conversations`, `conversationMembers`, `messages`, `messageDeliveries`, `typingIndicators`, `supportTickets`, `staffPresence` — 7 tables, of which the document's prose only names 2: "conversations, messages").
- **`caspahub` still carries its own parallel consumer flow.** `src/app/find`, `src/app/book`, `src/app/track`, `src/app/profile`, and `src/app/onboarding` all exist inside the `caspahub` repo too — not just in `caspahub-booking`. The document's Part 2 routing list for `caspahub` does mention these exist, but doesn't flag that this means **two separate, independently-maintained implementations of the same consumer booking flow exist across two repos simultaneously.** Worth a deliberate decision: is `caspahub`'s copy the deprecated original (pre-dating the `caspahub-booking` split) that should be removed, or is it still serving a purpose? Given `caspahub-booking` is visibly the more complete, more polished, and the one that's actually live and referenced as "the app," `caspahub`'s copy looks like unflagged dead weight — the same category of issue as the `carwash.ts`/`pharmacy.ts` dead code the document already calls out.
- **Undocumented required env var:** `src/lib/env.ts`'s `REQUIRED` array includes `TURSO_API_TOKEN` alongside `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and `AUTH_SECRET`. Part 8's env var table doesn't list `TURSO_API_TOKEN` at all — this is presumably the token used to call the Turso Cloud API for provisioning new tenant databases (distinct from the metadata DB's own connection token), and it's missing from the reference table.
- **Hardcoded `bays: 2`** in the `/api/branches` aggregate-search response (`src/app/api/branches/route.ts`) — every branch from every tenant reports exactly 2 bays regardless of actual configuration. Not mentioned anywhere in the document.

---

## 5. Recommendations

1. **Do a fresh screen-by-screen pass on `caspahub-booking` before finalizing the sprint plan.** The route/component scaffolding for onboarding, notifications, vehicle management, account deletion, rating, and forgot-password all exist — but "the route exists" isn't the same as "the feature is finished and bug-free." Given how much of Part 5's plan turned out to already be built, the highest-value next step is verifying *quality*, not re-building from scratch.
2. **Resolve the booking-status dual-write question explicitly** (Section 3 above) before more code is written against either interpretation of the rule.
3. **Decide the fate of `caspahub`'s duplicate consumer flow** (`/find`, `/book`, `/track`, `/profile`, `/onboarding` inside the operator repo) — likely safe to remove alongside the already-flagged `carwash.ts`/`pharmacy.ts` dead code, but worth a deliberate call rather than leaving two implementations to drift.
4. **`/[branchSlug]` and `GET /api/branches/[id]/reviews` are the two genuinely-confirmed-missing items** from the original Part 5 list — these are real, worth keeping on the plan.
5. **Add `TURSO_API_TOKEN` to the env var reference table**, and note the `mustEnforce` conditions on when missing-env actually throws vs. just warns.
6. **Re-run this kind of direct-repo check periodically**, not just at major planning moments — this document itself would have been stale within a week if it weren't for the August 18 commits landing between compile and read.

---

*Compiled by cloning both repos fresh (`git clone --depth 1`) and checking every claim above against literal source — file hashes, grep matches, and a live HTTP request to the deployed app — rather than re-summarizing prior conversation. Where a claim couldn't be directly verified from source (e.g., "10 real bookings completed" or Tom's own survey results), it's simply not repeated here as fact.*
---

## Expanded Audit — Supplement (Second Independent Pass, Aug 20 2026)

**Auditor:** Ken Muritu (independent second pass, separate from the report above)
**Method:** Fresh clone of both `ken-muritu/caspahub` and `ken-muritu/caspahub-booking` (full clones, not depth-1), every critical source file read in full, full repo trees, grep across all source, cross-checked against the report above.
**What this adds:** Full commit history for both repos, deep-dive into `caspahub`'s operator-side code (wash.ts, rbac.ts, tenant.ts, middleware.ts, bookings.ts) that the original report did not cover, verification of the Aug 18 commits, and a consolidated launch-readiness view across both repos.

---

## A. Full Commit Histories — Both Repos

### A.1 caspahub (Operator OS) — 81 commits, Apr 1 → Aug 18, 2026

| Date | Commits | What Happened |
|---|---|---|
| **Apr 1** | `f2d8999`–`9f06222` | Project genesis: Next.js 15 scaffold, mock-data layer, Vercel config |
| **Apr 5–7** | `27c95bd`–`2c0f3e8` | UI iteration; Next.js upgraded to 15.1.11 for CVE-2025-55182 |
| **Apr 7–15** | `17cf857`, `86756b9` | Modal component, interactive dashboard pages |
| **May 9** | `3d4d98e`–`22ce19c` | Marketing landing page; two-sided platform pivot (B2C consumer + APK pipeline) |
| **May 10** | `f4e2f23`–`ca11f88` | APK artifacts removed; Supabase auth wired then removed same week; local auth fallback |
| **May 26** | `b729123`–`bb105ca` | Turso + Prisma 7 + NextAuth v5; 14-model Prisma schema; 24 REST API routes; tenant middleware; seed; CI |
| **Jun 24–25** | `114cdae`–`482f53f` | Booking-first pivot; tier gating (booking/growth/enterprise); three-surface Vercel deploy; `CASPAHUB_SURFACE` env var |
| **Jun 29** | `a747e2f` | **THE REPLATFORM** — Eras II/III deleted wholesale. Rebuilt on Solera/Edifice platform: Drizzle ORM, one Turso DB per tenant, Auth.js v5 JWT, server actions, single Vercel deploy |
| **Jun 29–30** | `f198235`–`901b3f2` | Domain alignment to car wash; branding pass; official SVG logo kit; favicon iteration (6 commits) |
| **Jun 30** | `246a1a1`–`ed1f4a2` | Security hardening; pharmacy POS client deleted; Stream Chat Stage 0/1 wired |
| **Jul 1** | `4de8776`–`f56aecd` | Stream Chat Stage 2 (client UI); moodboard screenshots (170 shots); README rewrite |
| **Jul 14–Aug 18** | `f56aecd`–`c5a1996` | Incremental polish: hero artwork, dark-mode removal, branches geo/hours, PayHero booking confirmation fix, theme-store fix |

**Key observation:** 2+ week gap between Jul 14 and Aug 13 with almost no commits. Aug 13–18 burst added small polish items — nothing architectural.

### A.2 caspahub-booking (Consumer App) — 19 commits, Aug 13 → Aug 18, 2026

| Date | Commit | What |
|---|---|---|
| **Aug 13** | `3f8e42e` | Initial commit |
| **Aug 13** | `f1a4690` | Full consumer app scaffolded: find, book, track, auth, payments, chat, push |
| **Aug 13** | `e5106c3` | Stream ChannelData type fix; root redirect to `/find` |
| **Aug 13** | `97bc68a` | Dropped unused `TURSO_API_TOKEN` requirement |
| **Aug 13** | `0651953` | Logo rendering fix |
| **Aug 13** | `8203f97` | Comprehensive executive platform report README |
| **Aug 16** | `feb0ee9` | Service worker deep-link fix (`/washes` + `/track/[id]` instead of dead `/my-washes`) |
| **Aug 16** | `a93b0f2` | Rating/review columns + `consumer_vehicles` + `consumer_notifications` tables |
| **Aug 16** | `6f17c0b` | Rating, vehicle, notification, account-deletion data-access helpers |
| **Aug 16** | `5da92ff` | Rating, notifications, account, and auth API routes per V1 PRD |
| **Aug 16** | `f95bc15` | My Washes, Account, Notifications tabs; bottom tab bar fix |
| **Aug 16** | `3a20c70` | Post-wash rating capture on live tracker |
| **Aug 16** | `99d84f2` | Marketing homepage, onboarding flow, install guide, legal/static pages |
| **Aug 16** | `fc56ec5` | Forgot/reset password pages, link from login |
| **Aug 17** | `1c12837` | Official SVG brand kit |
| **Aug 17** | `30eef10` | Dark mode disabled app-wide |
| **Aug 17** | `743f746` | theme-store.ts TypeScript build fix |
| **Aug 17** | `7e528de` | Official hero artwork for homepage |
| **Aug 18** | `2273bb0`–`f232840` | Hero image crop/sizing polish; ENCRYPTION_KEY redeploy triggers |

**Key observation:** Aug 16 was the big day — 7 commits that added essentially the entire feature set. The original report's snapshot was taken between Aug 13 and Aug 16, so it missed all of this.

---

## B. caspahub (Operator OS) — File-by-File Deep Dive

### B.1 Repository Structure (236 TS/TSX files under src/)

```
caspahub/
├── src/
│   ├── middleware.ts              # Auth.js wrapper — RBAC, email-verify, tenant status, admin gate (141 lines)
│   ├── instrumentation.ts         # Sentry init (minimal)
│   ├── sw.ts                      # Serwist service worker + push handlers
│   ├── app/
│   │   ├── page.tsx               # Marketing landing (285 lines)
│   │   ├── (auth)/                # login, signup, verify-email, forgot/reset-password, accept-invite
│   │   ├── find/ book/[branchId]/ track/[bookingId]/ profile/  # Consumer flow (DUPLICATE — see B.5)
│   │   ├── onboarding/            # Operator tenant provisioning
│   │   ├── suspended/ trial-expired/
│   │   ├── (app)/                 # Operator OS (RBAC-gated) — 16 pages: dashboard, bookings, queue, customers, staff, payments, loyalty, analytics, fleet, messages, settings, account, admin
│   │   └── api/                   # 18 route handlers
│   ├── components/                # 73 files
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema/metadata.ts     # 14 metadata tables
│   │   └── schema/tenant.ts       # 26 tenant tables (13 car-wash + 13 pharmacy ghost + 7 messaging — see B.3)
│   └── lib/
│       ├── auth.ts                # NextAuth v5 — JWT, credentials, 24h sessions (196 lines)
│       ├── rbac.ts                # 7 roles × 4 actions (95 lines)
│       ├── tenant.ts              # Tenant lifecycle, DB provisioning, token rotation (659 lines)
│       ├── actions/wash.ts        # Status machine — THE core of the platform (297 lines)
│       ├── actions/context.ts     # requireTenantAction, requireBillingAction (68 lines)
│       ├── bookings.ts            # Consumer booking engine (460 lines)
│       ├── payhero*.ts / payments/*.ts
│       ├── stream/{config,server}.ts
│       ├── messages/              # 10 files — Turso + SSE messaging
│       ├── sync/{idempotency,permissions,replay}.ts
│       ├── compliance/* / phi.ts / barcode.ts   # 👻 pharmacy-era
│       └── ... (full tree in original report)
├── docs/                          # 8 docs
├── caspahub logos/                # 5 official brand files
├── .env.example                   # ✅ complete
├── .github/workflows/ci.yml      # tsc → test → lint → build — 20 FAILING recent runs 🔴
└── dev.db                         # 🟡 GHOST: 163KB SQLite from Prisma era, still tracked
```

### B.2 Critical Path: The Booking Status Machine (`src/lib/actions/wash.ts`)

This is the heart of the operator OS. Every wash status transition flows through here.

```
STATUS_FLOW = ["BOOKED", "QUEUED", "BAY_ASSIGNED", "WASHING", "READY", "COMPLETED", "CANCELLED"]
```

**What the code actually does (verified line-by-line):**

```typescript
// wash.ts: updateBookingStatus()
await tenantDb
  .update(schema.washBookings)
  .set({ status, bayNumber: bayNumber ?? booking.bayNumber, updatedAt: now })
  .where(eq(schema.washBookings.id, bookingId));

await tenantDb.insert(schema.washBookingEvents).values({
  id: nanoid(), bookingId, status, createdAt: now,
});
```

**This is a dual-write pattern:** `washBookings.status` is a real mutable column that gets UPDATEd on every transition, AND `washBookingEvents` is appended to as an audit log. The original report describes this as a "pure event-sourced" rule (status is NEVER a mutable column) — the code does both. Not a bug per se, but the documentation is wrong and there's no transaction wrapping the two writes.

**Status transitions exposed:**
- `queueBookingForm` → `QUEUED`
- `advanceBookingStatus` → next in STATUS_FLOW
- `markReadyForm` → `READY`
- `completeBookingForm` → `COMPLETED`
- `cancelConsumerBooking` (in bookings.ts) → `CANCELLED` (phone-verified)

### B.3 Schema: 26 Tables in Tenant DB — 13 Are Ghost Pharmacy Code

`src/db/schema/tenant.ts` (398 lines, 15KB) has 26 tables:

| Group | Tables | Status |
|---|---|---|
| **Car wash (active)** | `branches`, `users`, `wash_services`, `wash_bookings`, `wash_booking_events` | ✅ Live |
| **Messaging** | `conversations`, `conversation_members`, `messages`, `message_deliveries`, `typing_indicators`, `staff_presence`, `support_tickets` | ✅ Live |
| **Pharmacy ghost** 👻 | `categories`, `suppliers`, `products`, `inventory_batches`, `patients`, `prescriptions`, `prescription_items`, `shifts`, `sales`, `sale_items`, `appointments`, `consultations`, `vitals`, `patient_consents` | ❌ Never used |

Every new tenant gets all 13 pharmacy tables created. They consume storage and complicate the schema. The pharmacy POS client was deleted from UI in `246a1a1`, but the schema tables and the `carwash.ts`/`pharmacy.ts` dead code files (byte-identical, 2133+ bytes each, zero imports) remain.

### B.4 Middleware & Auth Flow (`src/middleware.ts`, 141 lines)

```
HTTP → middleware.ts
  ├─ Public routes: /, /login, /signup, /find, /book/*, /track/*, /pricing, /about, etc.
  ├─ Email-verify gate → redirect /verify-email
  ├─ Suspended tenants → /suspended
  ├─ Trial-expired → /trial-expired (except /settings, /api/payments)
  ├─ Admin routes → platform-admin email check
  ├─ App routes → require login + tenant
  ├─ RBAC path check → redirect to home with ?error=forbidden
  └─ Consumer routes → /profile requires login
```

Auth.js v5, JWT, 24h maxAge, 4h updateAge, `sessionVersion` invalidates all sessions on password reset, `trustHost: true` (required on Vercel).

### B.5 Duplicate Consumer Flow Inside caspahub ⚠️

`caspahub` contains its own copy of the consumer booking flow:
- `src/app/find/` — branch discovery
- `src/app/book/[branchId]/` — booking
- `src/app/track/[bookingId]/` — tracker
- `src/app/profile/` — history
- `src/app/onboarding/` — provisioning

This is the same surface `caspahub-booking` provides as its entire product. `caspahub`'s copy is independently maintained, uses the same `bookings.ts` and `payhero.ts` logic, and appears functional. Since `caspahub-booking` is the standalone deployed app (`caspahub-booking.vercel.app`), `caspahub`'s copy is unflagged dead weight — the same category as `carwash.ts`/`pharmacy.ts`.

### B.6 RBAC: Clean and Complete (`src/lib/rbac.ts`, 95 lines)

7 roles (`super_admin`, `admin`, `manager`, `supervisor`, `attendant`, `cashier`, `consumer`) × 4 actions (`read`, `write`, `delete`, `admin`) × full module matrix. Well-structured.

**Gaps:** `/reports` module exists in RBAC + top bar but no page exists (404). `super_admin` not in `team-roles.ts` — can't be re-assigned through invite UI.

### B.7 CI: Broken 🔴

`.github/workflows/ci.yml` — single workflow (tsc → test → lint → build). 20 failing recent runs per Jul 1 snapshot. Blocks automated deploy confidence for the entire operator side.

---

## C. caspahub-booking — Confirmed Status (Aug 18 Reality)

### C.1 Marketing Homepage — Fully Built

Contrary to the original report's snapshot, `src/app/page.tsx` (214 lines) is a complete marketing page: hero, trust bar, how-it-works, featured washes (live from API), operator CTA, install section, full footer. Only client-redirects to `/find` or `/onboarding` on mobile viewports — desktop sees the full page.

### C.2 Full Feature Status (Updated)

| Feature | Status |
|---|---|
| Cross-tenant wash discovery | ✅ Working |
| Booking creation | ✅ Working |
| M-Pesa STK Push (real + simulated) | ✅ Working |
| PayHero webhook confirmation | ✅ Working (BKG-/SUB-/SALE- all routed) |
| Live tracking (5s poll, 6-stage) | ✅ Working |
| Booking cancellation | ✅ Working |
| Guest checkout | ✅ Working |
| Consumer auth | ✅ Working |
| Onboarding flow | ✅ Working |
| Forgot/reset password | ✅ Working |
| Notification center | ✅ Working |
| Vehicle management | ✅ Working |
| Account deletion | ✅ Working |
| Post-wash rating | ✅ Working |
| Profile + cross-tenant history | ✅ Working |
| Real-time chat (Stream) | ✅ Working |
| Web Push to staff | ✅ Working |
| PWA installability | ✅ Working |
| Static pages (/privacy, /terms, etc.) | ✅ Working |
| Marketing homepage | ✅ Working |
| /for-operators + /install | ✅ Working |
| Theming (light/dark/system) | ✅ Working |
| **/[branchSlug] wash profile page** | ❌ Missing |
| **GET /api/branches/[id]/reviews** | ❌ Missing |
| Operator dashboard | ❌ Not in this repo (by design) |
| Native apps | ❌ Not yet |

### C.3 API Surface: 21 Routes

Original report counted 9. Actual count is 21. Missing from original count: `/api/account/*` (4), `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/bookings/[id]/rate`, `/api/bookings/lookup`, `/api/notifications` (3), `/api/push/subscribe`, `/api/push/unsubscribe`.

---

## D. Verified Bugs (Independent Confirmation)

All bugs from the original report confirmed, plus new findings:

| Bug | Severity | Notes |
|---|---|---|
| `syncBookingPayment` dead code | Medium | Defined in `wash.ts`, zero callers |
| `recordLoyaltyTransaction` no-op | Medium | Returns `{ok:true}` without DB write |
| `carwash.ts` / `pharmacy.ts` dead code | Low | Byte-identical, zero imports, pharmacy logic in carwash file |
| Daraja direct returns 501 | Info | By design |
| Hardcoded time slots | Low | Acceptable for MVP |
| Static QR code | Low | Acceptable for MVP |
| "Share" button has no handler | Low | Easy fix |
| WhatsApp toggle unpersisted | Low | Easy fix |
| `/api/branches` fans out per request, no caching | Medium | Full migration check per tenant per request |
| `caspahub` CI broken (20 failing) | **High** | Blocks deploy confidence |
| `caspahub` duplicate consumer flow | Medium | Unflagged dead weight or undocumented active surface |
| Schema 26 tables, not 22 | Low | Messaging undercounted |
| `TURSO_API_TOKEN` missing from env table | Low | Required by `env.ts` |
| `bays: 2` hardcoded | Low | Every branch reports 2 bays |
| `dev.db` tracked in repo | Low | Ghost from Prisma era |

---

## E. Two-Track Launch Plan (Response to Co-Founder's Brief)

### E.1 Reality Check

The co-founder's concern — "Q3 almost gone, nothing to test" — does not match reality for the consumer side. `caspahub-booking` has a **complete, deployable MVP** on `caspahub-booking.vercel.app`. What's missing is not features — it's: (1) CI confidence, (2) cleanup of dead weight, (3) two small genuinely-missing items, (4) operator-side parity.

### E.2 Track A — Consumer MVP to Market (2-3 weeks)

| Week | Focus | Deliverable |
|---|---|---|
| **Week 1** | Quick fixes + cleanup | Wire share button, persist WhatsApp toggle, replace static QR, remove dead files (`carwash.ts`, `pharmacy.ts`, `dev.db` gitignore), resolve duplicate consumer flow in `caspahub` |
| **Week 2** | CI + two missing items + smoke test | Fix CI, add `/[branchSlug]` page + reviews API, smoke-test full consumer journey |
| **Week 3** | Soft launch | Deploy to production Vercel, enable real PayHero credentials, test with real operators |

### E.3 Track B — Operator OS Hardening (Parallel, 4-6 weeks)

| Week | Focus | Deliverable |
|---|---|---|
| **1-2** | CI + schema cleanup | Fix CI, remove pharmacy tables from car-wash tenant provisioning, remove dead code |
| **3-4** | Duplicate flow + RBAC cleanup | Resolve duplicate consumer flow, fix /reports 404, add super_admin to team-roles |
| **5-6** | Operator beta | Verify all operator modules on real tenant, fix gaps, prepare beta |

### E.4 P0/P1/P2 Action Items

**P0 — Before consumer launch:**
1. Fix `caspahub-booking` CI
2. Wire/remove "Share" button
3. Persist/remove WhatsApp toggle
4. Replace/static QR or remove
5. Fix mailto stub or build real form
6. Add `/[branchSlug]` page
7. Add `GET /api/branches/[id]/reviews`

**P1 — Before operator launch:**
1. Fix `caspahub` CI (20 failing)
2. Remove 13 pharmacy ghost tables from tenant provisioning
3. Delete `carwash.ts` + `pharmacy.ts` from both repos
4. Decide and act on duplicate consumer flow
5. Fix `/reports` 404
6. Add `super_admin` to `team-roles.ts`
7. Gitignore + remove `dev.db`

**P2 — Post-launch:**
1. Real capacity model for time slots
2. Implement `recordLoyaltyTransaction` or remove
3. Decide on `syncBookingPayment` — wire or delete
4. Review listing UI on wash profile
5. KRA eTIMS, staff commissions, fleet billing (operator Phase 2)
6. Native mobile apps (future)

---

## F. Bottom Line

The consumer side (`caspahub-booking`) is essentially launch-ready today — the code is complete, deployed, and working. The operator side (`caspahub`) has all the modules built but carries meaningful technical debt (CI broken, pharmacy dead weight, duplicate consumer flow) that needs a focused cleanup pass before it can be considered production-ready.

The single most important finding from this second pass: **the original report's sprint plan would waste ~2 weeks re-building features that already exist.** A revised plan focused on cleanup, CI, the two missing items, and a soft launch gets a testable product to market inside Q3.

*This supplement was compiled by a separate, independent full clone-and-read pass — not derived from the report above or from conversation history. Where it repeats a finding from the original report, that's confirmation, not redundancy.* 

---

## G. Third Pass — DRB Verification + Cleanup (2026-08-21)

A Development Review Brief drafted by a separate Claude Chat session (for Thomas Kaingu Mweri, "Tom," Ken's business partner) was checked claim-by-claim against both live repos and their **full commit history** (`caspahub`: 97 commits since 2026-03-31; `caspahub-booking`: 23 commits since 2026-08-13, pulled via `gh api` — no local clone needed). Several of that DRB's specific claims did not hold up. Corrections, plus a same-day cleanup pass, below.

> **Note for whoever (human or Claude Chat) drafts the next Tom-facing DRB from this document:** do not name the removed dead-code vertical below, or reference where it came from, in anything Tom will read. State only that the operator repo has been cleaned up and its CI is green through Build. This is a firm instruction from Ken, not a suggestion.

### G.1 Corrections to the previous DRB draft

| Claim in the draft DRB | What the code/history actually shows |
|---|---|
| "Wire the Share button — no click handler" | False. Already fully wired: `navigator.share` with a clipboard-copy fallback and a "Link copied" confirmation state (`src/app/track/[bookingId]/page.tsx`). Nothing to do. |
| "Persist WhatsApp notification toggle — resets on refresh" | No WhatsApp toggle exists anywhere in `caspahub-booking` (zero matches, code search + full-tree grep). The real push-notification toggle (`notification-toggle.tsx`) correctly re-syncs its subscribed state from the browser's `PushManager` on every mount — it does not reset. Likely a mix-up with a feature that was never built. |
| "Reviews endpoint doesn't exist yet" | Overstated. `getBranchReviews()` (`src/lib/bookings.ts`) is a fully implemented function already wired into `GET /api/branches?branchId=X`, returning real `reviewCount`/`avgRating`/`reviews`. The data exists; only a dedicated `/api/branches/[id]/reviews` sub-route is missing, and a `/[branchSlug]` public page to display it. |
| "Fix CI pipeline" (consumer app, `caspahub-booking`) | Wrong framing. This repo has **no CI workflow and no test files at all**. Nothing is failing — nothing exists yet. It's a "stand one up" task. |
| "20 failing automated tests" (operator app, `caspahub`) | Wrong. CI was failing at the `npm ci` (install) step on every run since at least 2026-07-02 — `package-lock.json` had drifted from `package.json` (missing `webpack` + ~40 transitive deps), so it never reached the Test step at all. The actual test suite has **25 tests across 5 files**; once install was fixed, **all 25 pass**, confirmed both locally and in real GitHub Actions CI. |
| Wash-discovery API "will slow down as we add operators" | Understated — it's a live-request cost *today*, not a future risk. `GET /api/branches` (`caspahub-booking`) runs a full tenant-DB schema migration check for every active tenant on every single request, uncached. Confirmed by reading `src/app/api/branches/route.ts` directly. Not yet fixed. |
| Tracker QR code is "a decorative image, not scannable" | Confirmed true — it's a hand-drawn SVG pattern in `track/[bookingId]/page.tsx`, not an encoded/scannable code. Not yet fixed. |

### G.2 Cleanup completed 2026-08-21 (pushed to `caspahub` `main`, commit `5fc2850`)

Traced full blast radius (every importer, grepped across the whole repo) before deleting anything — nothing below had a single live caller outside the cluster being removed:

- Deleted two byte-for-byte identical 889-line dead action files and everything that only existed to serve them: a dead payment-reconciliation path (webhook branch, status-check branch, reference-builder functions), request-validation schemas, a barcode utility + an unused UI component, a patient-data encryption helper, and a compliance/notifications stub module.
- Deleted two orphaned integration-test scripts that were never wired into `package.json` or CI (confirmed via the repo's own README, which already documented one of them as "not in CI").
- Dropped **14 unused tables** from the tenant schema and from `migrateTenantSchema`'s per-tenant provisioning (one more than the "13" cited in the previous pass — a 14th table was confirmed to have zero live callers too, same standard applied). These were being silently created for every new operator signup. **Existing tenant databases still carry their already-provisioned empty copies** — `migrateTenantSchema` only ever runs `CREATE TABLE IF NOT EXISTS`, never drops, so this fix is forward-only by design (deliberately not retroactive, to avoid an unattended DROP running on every API request).
- Regenerated `package-lock.json` to match `package.json`.

**Verified before pushing:** full local `npm install` + `npx tsc --noEmit` + `npm test` + `npm run build`, all clean. **Verified after pushing, in real CI:** Install → Type-check → Test → Build all pass for the first time since at least July. Only **Lint** still fails, on 5 pre-existing unused-variable warnings from an unrelated 2026-08-17 dark-mode-removal commit, in files this cleanup never touched — small, quick, optional, not yet done.

### G.3 Still open (not part of this pass)

- **Duplicate consumer booking flow inside `caspahub`**: `src/app/book/[branchId]`, `src/app/track/[bookingId]`, and `consumer-shell.tsx` still exist in the operator repo, diverged ~44 lines from the canonical version in `caspahub-booking`. Confirmed real. Safe to delete now that `caspahub-booking` is the canonical consumer app — not yet done.
- The 5 pre-existing Lint warnings noted above.
- Everything else in Section E's P0/P1/P2 list that this pass didn't touch (branch slug page, reviews sub-route, Share/QR/WhatsApp-toggle items — see corrections in G.1 above for which of those are already resolved or non-issues).

### G.4 Updated P0/P1/P2 (supersedes Section E for the items below)

**P0 — before consumer launch** (unchanged from Section E except items marked): 
1. Add `/[branchSlug]` wash profile page
2. Add `GET /api/branches/[id]/reviews` (or build the profile page directly off the existing embedded review data in `GET /api/branches?branchId=X`)
3. Replace the fake QR code (or remove it)
4. Add caching to the wash discovery API
5. ~~Fix `caspahub-booking` CI~~ → **Stand up a CI pipeline for `caspahub-booking`** (none exists)
6. ~~Wire "Share" button~~ → **done, no action needed**
7. ~~Persist WhatsApp toggle~~ → **not a real item, no action needed**

**P1 — before operator launch:**
1. ~~Fix `caspahub` CI (20 failing)~~ → **done** (Install/Type-check/Test/Build all green; only Lint red, see below)
2. ~~Remove pharmacy ghost tables from tenant provisioning~~ → **done** (14 tables dropped)
3. ~~Delete dead duplicate action files~~ → **done**
4. Delete the duplicate consumer booking flow from `caspahub` (still open, see G.3)
5. Fix the 5 pre-existing Lint warnings (optional, quick)
6. Decide and act on the `/reports` 404 and `super_admin`/`team-roles.ts` gap noted in Section E (not re-verified this pass)
7. Gitignore + remove `dev.db` (not re-verified this pass)

**P2 — post-launch:** unchanged from Section E.

### G.5 Bottom line after this pass

The consumer app's real gap list is now shorter than any previous pass found: one real feature (`/[branchSlug]` page, built on data that already exists) and two real rough edges (fake QR, uncached discovery API) — the CI and UI-wiring items from earlier passes turned out to be either already done or not real. The operator repo went from "carries meaningful technical debt" to "clean, tested, CI green through Build" in this pass. What's left (duplicate consumer flow, 5 lint warnings) is small and well-scoped.
