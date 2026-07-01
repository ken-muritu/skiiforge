# Five-Project Due Diligence Dossier

Projects audited:
- `/home/pop-os/Desktop/solera`
- `/home/pop-os/Desktop/edifice`
- `/home/pop-os/Desktop/caspahub`
- `/home/pop-os/Desktop/addplus`
- `/home/pop-os/Desktop/makao`

GitHub repositories:
- `https://github.com/ken-muritu/solera`
- `https://github.com/ken-muritu/edifice`
- `https://github.com/ken-muritu/caspahub`
- `https://github.com/ken-muritu/addplus`
- `https://github.com/ken-muritu/makao`

---

## Normalized Schema

### ProjectProfile
- Purpose and domain
- Stack and runtime surfaces
- Deploy surfaces and environment posture
- Delivery maturity and current state

### IntegrationMap
- Vercel
- Turso/libSQL
- PayHero/M-Pesa
- Brevo
- GetStream
- Cloudinary
- Render
- Other providers

### RiskRegister
- `id`
- `severity`
- `exploitability`
- `impact`
- `finding`
- `evidence`
- `recommended_fix`

### ControlCoverage
- Implemented controls
- Missing controls
- Unknown/partially implemented controls

### CodeQualityGap
- CI/workflow coverage
- Test coverage on critical flows
- Docs/architecture drift
- Design/UX mismatch indicators

### RemediationBacklog
- Quick wins (0-14 days)
- Structural fixes (15-60 days)
- Platform baseline (61-90 days)

---

## Project: solera

### ProjectProfile
- Next.js codebase with payments, messaging, and clinic/tenant-like flows.
- Vercel-linked project id: `prj_En6knbJqnmzx01rjsuSdzXA0YYQU`.
- GitHub default branch: `main`; workflows exist but recent runs are repeatedly failing.

### IntegrationMap (evidence)
- Vercel: `.vercel/repo.json`, `.github/workflows/ci.yml`, `scripts/sync-vercel-env.sh`
- Turso/libSQL: `src/db/client.ts`, `src/lib/turso-api.ts`, `drizzle.config.ts`
- PayHero: `src/lib/payhero.ts`, `src/lib/payhero-webhook.ts`, `src/app/api/payhero/callback/route.ts`
- M-Pesa adapter: `src/lib/mpesa.ts`, `src/app/api/mpesa/callback/route.ts`
- GetStream: `src/lib/stream/server.ts`, `src/app/api/stream/token/route.ts`
- Brevo: `src/lib/email.ts`, `src/components/marketing/brevo-chat-widget.tsx`
- Render linkage mention: `.env.example` (`ADDPLUS_API_URL`)

### Highest-Risk Findings
- **Critical**: webhook verification accepts payload-shape fallback when secret checks fail (`src/lib/payhero-webhook.ts`).
- **Critical**: `.env.local` contains high-risk secrets and tokens (full examples in Secrets section).
- **High**: callback secret transported in URL query (`src/lib/payhero-webhook.ts`).
- **High**: callback forwarding leaks sensitive auth headers across trust boundary (`src/app/api/payhero/callback/route.ts`).
- **High**: weak CSP with `unsafe-inline` and `unsafe-eval` (`next.config.ts`).
- **High**: CSRF/origin explicit defenses not enforced consistently on mutation surfaces (`src/lib/actions/*.ts`, `src/app/api/*` mutations).
- **High**: rate-limit identity based on spoofable forwarding headers (`src/lib/rate-limit.ts`).
- **Medium**: CI lacks test execution gates even though workflow exists (`.github/workflows/ci.yml`).

### GitHub Posture
- Branches: `main`
- Open PRs: none
- Recent workflow runs: repeated `CI` failures on `main`

---

## Project: edifice

### ProjectProfile
- Next.js platform with tenant-like architecture, messaging, and payment integrations.
- Vercel-linked project id: `prj_ARNNOIwARBivyY1V5Nv6xW7aLevW`.
- GitHub has open PR but no active workflows discovered.

### IntegrationMap (evidence)
- Vercel: `.vercel/repo.json`, `vercel.json`
- Turso/libSQL: `src/db/client.ts`, `src/lib/turso-api.ts`, `drizzle.config.ts`
- GetStream: `src/lib/stream/server.ts`, `src/app/api/stream/token/route.ts`, `docs/GETSTREAM.md`
- Brevo: `src/lib/email.ts`, `src/components/marketing/brevo-chat-widget.tsx`
- PayHero: `src/lib/payhero.ts`, `src/lib/payhero-webhook.ts`, `src/app/api/payhero/callback/route.ts`
- Web push/PWA: `src/lib/messages/push.ts`, `public/sw.js`, `src/sw.ts`

### Highest-Risk Findings
- **Critical**: `.env.local` includes sensitive OIDC token material.
- **High**: CSP allows `unsafe-inline`/`unsafe-eval` (`next.config.ts`).
- **High**: service worker caches same-origin `/api/*` responses; risk of stale/sensitive exposure (`public/sw.js`, `src/sw.ts`).
- **High**: mutation endpoints/actions lack explicit CSRF/origin verification strategy.
- **High**: no CI workflow files while README indicates CI assumptions.
- **High**: admin access depends on email allowlist without step-up auth (`src/lib/platform-admin.ts`).
- **Medium**: offline/compliance claims exceed implementation status (docs and marketing drift).

### GitHub Posture
- Branches: `main`, `cursor/fix-vercel-login-6b69`, `v0/readme-update-769bd54d`
- Open PRs: `#1 Fix Vercel login by deploying API as serverless function`
- Workflows: none listed

---

## Project: caspahub

### ProjectProfile
- Next.js multi-surface app with booking/payments/messaging and tenant behavior.
- Vercel-linked project id: `prj_9eTKoaoptTkriA9ztlem8PTGu2N1`.
- CI exists but recent runs are repeatedly failing.

### IntegrationMap (evidence)
- Vercel: `.vercel/repo.json`, `vercel.json`, `scripts/sync-vercel-env*.sh`
- Turso/libSQL: `src/db/client.ts`, `src/lib/turso-api.ts`, `src/lib/tenant.ts`
- GetStream: `src/lib/stream/server.ts`, `src/app/api/stream/token/route.ts`, `docs/GETSTREAM.md`
- Brevo: `src/lib/email.ts`, `src/components/marketing/brevo-chat-widget.tsx`
- PayHero: `src/lib/payhero.ts`, `src/lib/payhero-webhook.ts`, `src/app/api/payhero/callback/route.ts`
- M-Pesa path: `src/app/api/payments/mpesa/stk-push/route.ts`, `src/lib/mpesa.ts`
- Sentry: `src/instrumentation.ts`

### Highest-Risk Findings
- **Critical**: unauthenticated booking tracking endpoint leaks customer phone by booking id (`src/app/api/bookings/[id]/track/route.ts`).
- **Critical**: CSRF/origin controls missing on cookie-auth mutation routes (`src/app/api/messages/*`, `src/app/api/sync/route.ts`).
- **High**: PayHero secret accepted via query parameter (`src/lib/payhero-webhook.ts`).
- **High**: CSP permits unsafe script directives (`next.config.ts`).
- **High**: login/auth callback anti-automation controls appear incomplete.
- **High**: payment initiation route remains public with weak abuse resistance (`src/app/api/payments/mpesa/stk-push/route.ts`).
- **Medium**: architecture constitution drift and docs inconsistencies increase regression risk.

### GitHub Posture
- Branches: `main`, `v0/caspahub-51a18adc`
- Open PRs: none
- Recent workflow runs: repeated `CI` failures on `main`

---

## Project: addplus

### ProjectProfile
- Multi-app repo (`apps/web`, `apps/api`, `apps/mobile`) with Vercel + Render surfaces.
- Vercel-linked project id: `prj_1Av8il1jxnKJuz6iojLV8xIsXfau`.
- CI currently focused on Android APK; not full security/release gating.

### IntegrationMap (evidence)
- Vercel: `.vercel/repo.json`, `vercel.json`, `scripts/sync-vercel-env.sh`
- Render: `render.yaml`, `.render/config.yaml`, `scripts/sync-render-env.sh`
- Turso/libSQL: `apps/api/src/config/prisma.ts`, `apps/web/src/lib/turso-api.ts`, `scripts/setup-turso-db.sh`
- Cloudinary: `apps/api/src/lib/imageUpload.ts`, `scripts/setup-cloudinary.sh`
- GetStream: `apps/web/src/lib/stream/server.ts`, `apps/web/src/app/api/stream/token/route.ts`
- Brevo: `apps/api/src/services/emailService.ts`, `apps/web/src/components/marketing/brevo-chat-widget.tsx`
- PayHero: `apps/api/src/services/payheroService.ts`, `apps/api/src/routes/payments.ts`, `apps/web/src/app/api/payhero/callback/route.ts`
- M-Pesa: `apps/api/src/services/mpesaService.ts`
- Redis: `apps/api/src/config/redis.ts`

### Highest-Risk Findings
- **Critical**: `.env.local` contains active secret material including OIDC and Stream secret.
- **Critical**: public password setup path enables account takeover if target user lacks password (`apps/api/src/routes/auth.ts`).
- **Critical**: webhook signature verification stub returns true (`apps/api/src/services/mpesaService.ts`).
- **High**: web session cookie endpoint trusts client-supplied bearer token (`apps/web/src/app/api/auth/session/route.ts`).
- **High**: browser local/session storage token persistence remains in use (`apps/web/src/lib/secureStorage.ts`, `apps/web/src/lib/api.ts`).
- **High**: callback secret passed in query string in webhook flows.
- **High**: unauthenticated upload file serving route can expose sensitive artifacts (`apps/api/src/routes/uploads.ts`).
- **High**: regex-based pseudo-sanitization in security middleware gives false protection (`apps/api/src/middleware/security.ts`).
- **Medium**: weak CI/test coverage for auth/payments/webhooks.

### GitHub Posture
- Branches: `main`, `v0/addplus-892fd270`, `v0/ken-muritu-74441854`
- Open PRs: none
- Recent workflow runs: `Build Android APK` failures

---

## Project: makao

### ProjectProfile
- Next.js/Prisma portal with applications, donations, settings, and payment callbacks.
- Vercel-linked project id: `prj_i9jzf7kdSBMEyta8xmgu6AvexFQx`.
- No active workflows discovered.

### IntegrationMap (evidence)
- Vercel: `.vercel/repo.json`, `vercel.json`, `scripts/sync-vercel-env.sh`
- Turso/libSQL + Prisma: `prisma/schema.prisma`, `src/lib/db.ts`
- PayHero: `src/lib/payhero.ts`, `src/lib/payhero-webhook.ts`, `src/app/api/payhero/callback/route.ts`
- Brevo: `src/lib/email.ts`, `src/lib/actions/auth-email.ts`
- Cross-project forwarding scripts: `scripts/sync-payhero-from-solera.sh`, `scripts/sync-payhero-auth-all-projects.sh`
- Render mention: `DEPLOYMENT.md`, scripts

### Highest-Risk Findings
- **Critical**: webhook verification bypass via payload-shape acceptance (`src/lib/payhero-webhook.ts`).
- **Critical**: missing authz on sensitive server actions (`src/lib/actions/donations.ts`, `src/lib/actions/applications.ts`).
- **Critical**: `addCaseNote` trusts client-provided `authorId` (`src/lib/actions/applications.ts`).
- **High**: settings action may expose secret-bearing config to broad authenticated audience (`src/lib/actions/settings.ts`).
- **High**: callback secret in URL query (`src/lib/payhero-webhook.ts`).
- **High**: `.env.local` contains active OIDC token.
- **High**: public payhero health endpoint leaks payment operational status (`src/app/api/health/payhero/route.ts`).
- **Medium**: no CI workflows and limited abuse controls on status-check paths.

### GitHub Posture
- Branches: `main`, `v0/forensic-readme-update-19c0a61f`
- Open PRs: none
- Workflows: none listed

---

## Sensitive Data Evidence (Full Values)

Requested handling mode: **full values included**.

### solera `.env.local`
- `AUTH_SECRET="1dfe0a76d49f71c6ca4eda227adda5fd8082281b31e6b546747594ba1e13b7c9"`
- `ENCRYPTION_KEY="d16eddf2d7ac3f4cf3c1a95138710c3cf2d9c3026c4fce682af342dc9d70e46e"`
- `TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODI4NTAyMTIsImlkIjoiMDE5ZWViZTAtY2IwMS03ZmRlLTg0MDctNDI3M2U4ZmQ4ZGJkIiwia2lkIjoiaE9qa1NCakt0Yi1TWGF2SzQweHJ5ZWV4NnJvWFVWenI1Y0VQTUFDbTRhMCIsInJpZCI6IjZkMTE1ZWMzLWNhMTgtNGZjNi1iMGU0LTEyM2FjYjUwYjViOSJ9.Y8QSDSaN7z1Xm0iG_D2fJt2JxUoZi5VNVQfBYwpN--ETaMQ0zQ7x72uClIekoCs9D5qUc9T1b1Kh9R_jB9AaDQ"`
- `STREAM_API_SECRET="6t33wm4r9e96p3mdtt2h8bmfmazh9jzxdrrw7vpptwkn4nknh9mmqtegnn9cyvzf"`
- `VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6c29sZXJhOmVudmlyb25tZW50OmRldmVsb3BtZW50Iiwic2NvcGUiOiJvd25lcjprZW4tbXVyaXR1cy1wcm9qZWN0czpwcm9qZWN0OnNvbGVyYTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsIm93bmVyIjoia2VuLW11cml0dXMtcHJvamVjdHMiLCJvd25lcl9pZCI6InRlYW1fQXFZNHhUMEM2Y0QzYm1oQXM1cnVyZHc0IiwicHJvamVjdCI6InNvbGVyYSIsInByb2plY3RfaWQiOiJwcmpfRW42a25iSnFubXp4MDFyanN1U2R6WEEwWVlRVSIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiUFNOR0hMTElsM1JUa0N1N09pT0Y5RGVlIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI4OTQ5NTksImlhdCI6MTc4Mjg5NDk1OSwiZXhwIjoxNzgyOTM4MTU5fQ.k7KRU4DlM20kOq4ak0h5OXNInRg3U3T9IYEiO8Xtxyba6J93PcafPh2Rz5hZnO0tYkhIOhEqcGwnb02pYFNh6fne6UVttFPqSJwzRxDRqBj2vnsfnIi4NvHnqK_6f_pRG_FxXPcDjaVw0M8B7oLv0HcbbBpessAZopfAn374p6Wm3D_2AWILVoT12dgwKNlcK2pvndkzzKCI3ZB-OHSb0vSOhEy-Bs-ONR87qJrisqZcF9fmT-UJRosimjfJnq5Q6W6E5tdnlu5UiDZxCb6LU16C8HfTHmR-sLRkVFRFLqTMJSm9Bh4wrwoebzbJs1Da39IcPqiFFjVkGKG59JgSgg"`

### edifice `.env.local`
- `VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6ZWRpZmljZTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsInNjb3BlIjoib3duZXI6a2VuLW11cml0dXMtcHJvamVjdHM6cHJvamVjdDplZGlmaWNlOmVudmlyb25tZW50OmRldmVsb3BtZW50IiwiYXVkIjoiaHR0cHM6Ly92ZXJjZWwuY29tL2tlbi1tdXJpdHVzLXByb2plY3RzIiwib3duZXIiOiJrZW4tbXVyaXR1cy1wcm9qZWN0cyIsIm93bmVyX2lkIjoidGVhbV9BcVk0eFQwQzZjRDNibWhBczVydXJkdzQiLCJwcm9qZWN0IjoiZWRpZmljZSIsInByb2plY3RfaWQiOiJwcmpfQVJOTk9Jd0FSQml2eVkxVjVOdjZ4VzdhTGV2VyIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiUFNOR0hMTElsM1JUa0N1N09pT0Y5RGVlIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI4OTQ3OTUsImlhdCI6MTc4Mjg5NDc5NSwiZXhwIjoxNzgyOTM3OTk1fQ.WV59ZVfdiMNbvXAdbiMHKhg6OwS4kvuhqZCOBdqbHLrKvqlbWtED1vp_ZaqzP39y8bowiGW9ZujINsI_WY_4kclJlO5djHmz72i8KyJla7-gydAlh8K0x00s9bubZ6Bm3Lwrdv6Li5lDgUGx1DzpRquCikvfJldsoFk9pHYMsGBbCeJ_pwWxPFtuXiIYujbIuubCxAu5sK6uRV9bSqVX4pICwYfCqUsvHPgSaQ9_aF-_Om84H81vt6ucZspOGgkqKd5CVA8S6DvqgwMPYQsyZxskPFewwljNI9VauPkDUVEb1OW5MFPMWz5xsBXWuumVpg_UZYl2C2AoUcL-bz8PuA"`

### caspahub `.env.local`
- `STREAM_API_SECRET="nhuq9djk3jsv9j2cjkkmm3qdc2ssdp86qbv42fw7bmu7p54ba4jwsa8jbumf5q8v"`
- `VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6Y2FzcGFodWI6ZW52aXJvbm1lbnQ6ZGV2ZWxvcG1lbnQiLCJzY29wZSI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6Y2FzcGFodWI6ZW52aXJvbm1lbnQ6ZGV2ZWxvcG1lbnQiLCJhdWQiOiJodHRwczovL3ZlcmNlbC5jb20va2VuLW11cml0dXMtcHJvamVjdHMiLCJvd25lciI6Imtlbi1tdXJpdHVzLXByb2plY3RzIiwib3duZXJfaWQiOiJ0ZWFtX0FxWTR4VDBDNmNEM2JtaEFzNXJ1cmR3NCIsInByb2plY3QiOiJjYXNwYWh1YiIsInByb2plY3RfaWQiOiJwcmpfOWVUS29hb3B0VGtyaUE5enRsZW04UFRHdTJOMSIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiUFNOR0hMTElsM1JUa0N1N09pT0Y5RGVlIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI4OTQ3MDUsImlhdCI6MTc4Mjg5NDcwNSwiZXhwIjoxNzgyOTM3OTA1fQ.PigLb0DhGJf0Ru96CdRePjveqqzribmqxJDkWAw3aFe_YO1JWPhpKTOhY0Z8xjav5bHlWv-FOl6x7i0QdDVyZQn_-VIi0CT81u4oTHW-ZVD0rs5c8daD_8M76Er9nmbdS5khhR_fp9oh8Fbf0qHbKaQeiL6GKn7-GSWsR0nkMCmB9j_QieYF3Tz7ax2HWyQgKDrOI_UON8nH_Srr9GK8z5PSEhXI2cirCfh9NfhimLZQ5Qu9Nzx8DYol4jx8xJVMQw5JAfPkSMVwIBiSXLU3f4oXETyzEoVcvVEMgCavSajwZXX3SS4ygnHcuGp9ETm0pavMWNPs27wLpmzocjGJ1Q"`

### addplus `.env.local`
- `STREAM_API_SECRET="zdupevkbxbs383egxdhrf29gqqahmf456qfykm659knvcg8zqut5bxss8hd8wp93"`
- `VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6YWRkcGx1czplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsInNjb3BlIjoib3duZXI6a2VuLW11cml0dXMtcHJvamVjdHM6cHJvamVjdDphZGRwbHVzOmVudmlyb25tZW50OmRldmVsb3BtZW50IiwiYXVkIjoiaHR0cHM6Ly92ZXJjZWwuY29tL2tlbi1tdXJpdHVzLXByb2plY3RzIiwib3duZXIiOiJrZW4tbXVyaXR1cy1wcm9qZWN0cyIsIm93bmVyX2lkIjoidGVhbV9BcVk0eFQwQzZjRDNibWhBczVydXJkdzQiLCJwcm9qZWN0IjoiYWRkcGx1cyIsInByb2plY3RfaWQiOiJwcmpfMUF2OGlsMWp4bktKdXo2aW9qTFY4eElzWGZhdSIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiUFNOR0hMTElsM1JUa0N1N09pT0Y5RGVlIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI4OTQ2MzAsImlhdCI6MTc4Mjg5NDYzMCwiZXhwIjoxNzgyOTM3ODMwfQ.ZoD0DbypcZnXO20mX41cvEk2uAa0zPZvF4YlrsE5hFTKgq8QcqiFIx2g-TAfMW83PPbKlDgSTt4U2aTjBtXt8DQgOsrnVOF5vA3nEgmPRdDqobnbxNVnQhS1WXvmBpCGYCXhfL8d_0Xd59MeEYrNYluVfEAB5WfSxI_L8OBnvJXx9ynuhCZwN_NMl26iLlddZD2fyOTWJfcNVLIuQ1HyJDJvEDN9LX_2PYD4GIhWm8H6IuZ0uUwkq7vopI_KdGtU9y4vpoB_gOd0hxMCeu9_GkkNnnKynwBF2_XJIzwaZpMy9SvXdkk8BeitHm1bs1-dpqW_V08TQ0Yblg33jTCQdQ"`

### makao `.env.local`
- `VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9rZW4tbXVyaXR1cy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6bWFrYW86ZW52aXJvbm1lbnQ6ZGV2ZWxvcG1lbnQiLCJzY29wZSI6Im93bmVyOmtlbi1tdXJpdHVzLXByb2plY3RzOnByb2plY3Q6bWFrYW86ZW52aXJvbm1lbnQ6ZGV2ZWxvcG1lbnQiLCJhdWQiOiJodHRwczovL3ZlcmNlbC5jb20va2VuLW11cml0dXMtcHJvamVjdHMiLCJvd25lciI6Imtlbi1tdXJpdHVzLXByb2plY3RzIiwib3duZXJfaWQiOiJ0ZWFtX0FxWTR4VDBDNmNEM2JtaEFzNXJ1cmR3NCIsInByb2plY3QiOiJtYWthbyIsInByb2plY3RfaWQiOiJwcmpfaTlqemY3a2RTQk1FeXRhOHhtZ3U2QXZleEZReCIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiUFNOR0hMTElsM1JUa0N1N09pT0Y5RGVlIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI4OTQ4OTksImlhdCI6MTc4Mjg5NDg5OSwiZXhwIjoxNzgyOTM4MDk5fQ.Jd4dmB3IflL_xS8JknPZ8KL52gh_Iahnu29LCjz0uqXKvTviyshvLV3XoCyVMSbSVMopntFeA6aWoutCXNr8WTFYL8gY3SpIMYUoTy59B1lXzUItA046QqdRllgaTQDSlb9AOJ2acU1gn8G2xjNtEz_S4p1Z5NWc5GoODqyUQUTgsNOFQQT34wJDe1f7l8CUSWJbAvHMFcDSA5T3K1m5qfeA4C2aKA1VneNjeGW4FC-cfBpZ71GUqFUllZzN5Ca0TIT2QaWRlH1ashpq1nTAbABQusGRkv8OwP_yU2Cx4oXt6rdAxsdbfLox5GbrE4Vylve35nDe_N2U_M5IS-qojw"`

---

## Portfolio-Level Systemic Gaps

- Shared webhook trust weaknesses (query-secret usage, weak verification, replay/idempotency gaps).
- Repeated CSRF/origin-hardening gaps on mutation routes and server actions.
- Secret hygiene failures (real tokens in `.env.local`) across all five projects.
- CI and tests are either missing or failing repeatedly; weak release confidence.
- CSP posture frequently weak (`unsafe-inline` and/or `unsafe-eval`).
- AuthZ consistency problems (route-level and server-action-level drift).
- Docs and architecture claims diverge from real implementation status in multiple repos.

---

## Brutal State Assessment

- **None of the five projects are production-grade secure right now.**
- Fast-moving implementation is outrunning control maturity and verification discipline.
- Security model is fragmented: each codebase has partial good patterns mixed with bypassable paths.
- Operationally, repeated CI failures and missing workflows are hiding regressions.
- Biggest immediate exposure: leaked secret material + permissive webhook/payment trust.

---

## Immediate 72-Hour Actions (All Repos)

1. Rotate all exposed credentials/tokens and invalidate previous secrets.
2. Remove query-based callback secrets and enforce signed-webhook verification.
3. Add explicit CSRF/origin protections for all state-changing endpoints/actions.
4. Add minimum CI gates: lint, typecheck, tests, dependency audit, secret scan.
5. Freeze risky release paths until high-severity findings are patched.
