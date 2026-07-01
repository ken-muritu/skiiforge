# Secure Multi-Integration System Framework

## 1) Architecture Baseline
- Enforce one auth boundary pattern across API routes and server actions.
- Centralize authorization policy checks (`role`, `permission`, `tenant scope`) before business logic.
- Separate public, authenticated, privileged, and machine-to-machine routes explicitly.
- Use one canonical integration adapter per provider; avoid drift copies.

## 2) Security Control Baseline
- **Secrets**: never commit runtime secrets; enforce pre-commit and CI secret scanning.
- **Webhooks**: require HMAC/signature + timestamp + replay window + idempotency key.
- **CSRF**: explicit origin/referer + anti-CSRF token for cookie-auth mutation routes.
- **CSP**: remove unsafe script directives; use nonce/hash model.
- **Rate limits**: per-IP + per-identity + per-tenant on sensitive endpoints.
- **Session**: prefer httpOnly secure cookies; avoid browser token storage.
- **Uploads**: signed URL model, strict allowlists, and authz checks.

## 3) Reliability Baseline
- Every external API call has timeout + retry strategy + bounded concurrency.
- Add circuit-breaker behavior for failing providers (payments, email, chat).
- Distinguish synchronous user-critical from async eventually-consistent flows.
- Add dead-letter/reconciliation process for payment and webhook failures.

## 4) CI/CD Release Gates
- Required checks: lint, typecheck, unit tests, integration tests, build.
- Security checks: dependency audit, SAST, secret scan.
- Block merge on failing required checks.
- Run migration safety checks and rollback rehearsal for schema changes.

## 5) Testing Priority Pyramid
- Tier 1 (must-have): authn/authz, payments, webhook verification, tenant isolation.
- Tier 2: input validation, rate limiting, message/notification integrity.
- Tier 3: UX parity and non-critical behavior.
- Include at least one exploit-regression test per critical vulnerability fixed.

## 6) Evidence-Based Due Diligence Template

Use this checklist per project:
- ProjectProfile complete
- IntegrationMap complete
- RiskRegister complete (critical/high always with evidence paths)
- ControlCoverage complete
- CodeQualityGap complete
- GitHub posture complete
- 30/60/90 remediation roadmap complete

## 7) Remediation Execution Model

### 0-14 days (stabilize)
- Rotate secrets and remove leaked credentials.
- Patch critical auth/webhook/IDOR/account-takeover findings.
- Enforce minimum CI gates.

### 15-60 days (harden)
- Standardize authz and CSRF model.
- Replace weak CSP and weak token storage patterns.
- Consolidate integration adapters and validation schemas.

### 61-90 days (institutionalize)
- Add security champion workflow and threat-model reviews.
- Add quarterly control validation and incident simulation.
- Maintain architecture/doc parity checks as CI quality gates.

## 8) Owner Matrix Template
- `Security Lead`: controls, secret lifecycle, incident readiness
- `Backend Lead`: authz, webhooks, data integrity, provider adapters
- `Frontend Lead`: token handling, CSP-safe integration, UX consistency
- `DevOps Lead`: CI/CD policy, deployment safeguards, observability
- `Product/PM`: claim-vs-implementation parity and release risk acceptance
