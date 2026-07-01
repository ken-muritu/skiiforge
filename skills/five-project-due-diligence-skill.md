# Five-Project Brutal Due Diligence Skill

## Purpose
Use this skill to run deep due diligence for a portfolio of full-stack projects with Vercel, Turso/libSQL, payments, messaging, and third-party integrations.  
This skill is both:
- a source-of-truth dossier for the five audited projects (`solera`, `edifice`, `caspahub`, `addplus`, `makao`)
- a reusable framework for auditing and hardening similar systems

## Inputs Expected
- Repository root paths
- GitHub org/user + repo names
- Deployment surfaces (Vercel, Render, etc.)
- Explicit secret-handling preference for reporting (redacted or full values)

## Mandatory Audit Method
1. **Inventory**
   - Confirm local project roots and all git remotes.
   - Confirm Vercel linkage (`.vercel/repo.json`) and deployment scripts.
2. **Integration Mapping**
   - Enumerate Turso, PayHero/M-Pesa, Brevo, GetStream, Cloudinary, Render, and other providers from code and config.
3. **Security Review**
   - Check auth/authz on every mutation path (API routes + server actions).
   - Validate webhook verification quality (signature, replay, idempotency, secret transport).
   - Review CSRF model, CSP/security headers, rate limits, secret exposure, unsafe storage patterns, and data leaks.
4. **Quality + Reliability Review**
   - Verify CI workflows, test coverage on critical paths, docs/architecture drift, and operational readiness.
5. **GitHub Posture Review**
   - Branch hygiene, PR/issue hygiene, workflow presence and run conclusions, stale failure patterns.
6. **Synthesis**
   - Build cross-project risk matrix and a sequenced remediation backlog.

## Output Contract
Always produce:
- `ProjectProfile` per repo
- `IntegrationMap` per repo
- `RiskRegister` with severity + exploitability + impact + evidence path
- `ControlCoverage` checklist
- `CodeQualityGap` and docs/design drift notes
- `RemediationBacklog` (quick wins vs structural fixes)

## Severity Definitions
- **Critical**: immediate exploit or high-likelihood compromise path
- **High**: materially weak control likely to be exploited or cause major breach
- **Medium**: meaningful weakness that elevates risk or operational fragility
- **Low**: hygiene or non-blocking hardening gap

## Hard Rules
- No assumptions without evidence file paths.
- Every critical/high finding must reference exact files.
- Mark unknown/unverified items explicitly.
- If requested, include full secret values and call out immediate rotation actions.

## Portfolio Deliverables
Read these files in this skill folder:
- `reference.md` for the full project-by-project dossier and current-state evidence
- `framework.md` for the reusable secure-system development framework, controls, and execution templates
