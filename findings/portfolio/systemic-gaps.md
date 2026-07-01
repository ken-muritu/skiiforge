# Portfolio Systemic Gaps

Current recurring themes across repositories:

- Webhook trust weaknesses (query-string secrets, signature/replay inconsistencies).
- CSRF/origin defenses are inconsistent on mutation routes and server actions.
- Secret hygiene gaps (sensitive values present in local env files and operational tokens).
- CI quality gates are absent or failing across multiple repositories.
- Authz enforcement is uneven between API handlers and server actions.
- Security header and CSP hardening is not consistently enforced.

These findings are refreshed by the sync workflows and inventory scripts.
