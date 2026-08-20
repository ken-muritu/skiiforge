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
