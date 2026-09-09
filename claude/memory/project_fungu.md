---
name: project-fungu
description: "Fungu — friendship-protection peer-debt ledger app (Flutter APK + Next.js/Turso/M-Pesa API), fully built and live 2026-08-24; open threads: YouTube transcripts IP-banned, duplicate account, timezone boundary"
metadata: 
  node_type: memory
  type: project
  originSessionId: 17880d9e-980d-47e0-83cc-5f8fc105b41c
  modified: 2026-08-27T15:48:26.029Z
---

Fungu (`github.com/ken-muritu/Fungu`, private, default branch `master` not main) — Kennedy's tool to help people manage informal peer debts so friendships aren't broken ("ledger not lender", sidesteps DCP licensing; monetization explicitly deferred). Built end-to-end 2026-08-24 in session `a07acf0c` (not in memory until 2026-08-27 — recovered from transcript digest).

**Live artifacts:** Android APK (21MB) at `releases/tag/latest-build` (GitHub Releases, because Actions storage quota was exhausted by ~5.2GB stale artifacts across 10 other repos — churchcrm, varidi, mat3, bodalink, luminary, rpacademy, vela, muritu, msingi, rhema — now cleaned); web PWA (the iOS path — no native iOS build) at https://fungu-web.vercel.app; API at https://fungu-api.vercel.app (Next.js + Drizzle + Turso, phone+PIN auth, M-Pesa/Daraja STK Push C2B + B2C lender forwarding; "Fungu Pay" is branding for the existing M-Pesa layer, no PSP licensing built). Flutter chosen because disk couldn't fit SDK — all Dart hand-written, CI scaffolded platform folders. Research docs in-repo: `BRAINSTORM.md`, `MVP-PRD.md`, `research/youtube-research*.md` (6 passes, ~2,780 videos surfaced).

**Production logging** (user demand: "nothing left out"): event-log table on live DB, server-side helper with PIN/token scrubbing, every route + client ApiClient/screens wired; 42 test scenarios pass. Real testers: "Kennedy Muritu", "Denis Mwangi".

**Fixed via log-driven debugging:** missing `android.permission.INTERNET` (the "no internet" signup bug, verified from APK binary manifest); UTC/local due-date mismatch (would've failed every creation); guarantor ledger visibility + post-registration accept PATCH + self-guarantee validation + detail-screen 404 (guarantor UI never existed); overpayment → negative remaining; 4-digit PINs + no login rate limit (DB lockout applied); Pay double-tap race; duplicate-debt on timeout → idempotency key (unique constraint, client-generated); 14-15s latency → log writes moved to Next 15 `after()`, now <1s. Flutter `viewerRole` default bug (guarantor-invite 403).

**Africa's Talking SMS (2026-08-26, session `e1b85f98`):** integrated into Fungu matching M-Pesa lib conventions (`server/src/lib/sms.ts`, sandbox-vs-live decided by AT username being literally "sandbox"), reminders-cron TODOs turned into real code, pushed to `master` @ `cf97390`. **Test SMS never sent — unresolved 401 "authentication invalid"** on every endpoint/domain/header-casing tried, while deliberately-wrong auth schemes returned a *different* error (so the `apikey:` header format itself is recognized — the key/username pairing is being rejected). User's AT dashboard: app "fungu", username "fungu", **live mode** with KES 10 wallet (a successful test spends real balance; sandbox username avoids that). Check dashboard key regeneration / app pairing first if resuming.

**Open threads:**
1. **YouTube transcript fetch stalled 17/2,276 videos** — YouTube API `captions.download` needs OAuth + video ownership, so bulk is unsanctioned; IP-level flat ban hit (~19 requests), 5s pacing still blocked, waits failed → **proxy-service route was proposed as next step, never executed**.
2. Kennedy created a **duplicate production account** (different phone, after `login_unknown_phone`); proposed "did you mean to log in?" nudge never taken up.
3. "Overdue" flips at UTC midnight = 3am Nairobi — documented trade-off, unfixed.
4. Emulator testing ruled out on this box (needs 3-6GB+).
5. Env vars on Vercel: `PUBLIC_BASE_URL` etc; Turso DB provisioned via CLI, 4 tables created by raw SQL.

**Why:** the user's 2026-08-26 "where we left off with fungu" session died instantly on an OpenRouter 402 credit error (never answered), and the 2026-08-27 context-load session was cut off — so the Fungu status recap still hasn't been delivered and is a likely subject of the next ask.

**How to apply:** treat `fungu-api.vercel.app` + the APK as live/verified. If transcripts come up, the honest framing is: official API path is dead for bulk, waits don't clear the ban, proxy decision is the user's. Related: [[user-environment]] (disk constraints shaped every build decision), [[project-credential-rotation-needed]] (Fungu's YouTube key lives gitignored in `~/Fungu/.env`).
