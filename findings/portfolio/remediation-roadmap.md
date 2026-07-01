# Portfolio Remediation Roadmap

## 0-14 days
- Rotate exposed credentials and enforce secret scanning in CI.
- Patch critical auth/webhook/account-takeover vectors.
- Add required CI checks (lint, typecheck, tests, dependency scan).

## 15-60 days
- Standardize webhook verification and replay protection.
- Standardize CSRF/origin strategy across all mutation surfaces.
- Consolidate authz checks into shared guards and middleware.

## 61-90 days
- Add deterministic drift reporting and freshness SLAs.
- Enforce architecture/doc parity checks in CI.
- Schedule quarterly control validation and incident simulation drills.
