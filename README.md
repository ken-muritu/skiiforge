# Skiiforge

Private command centre for skills, frameworks, and repository due diligence.

## What this repo does
- Maintains a structured inventory of all repositories under `ken-muritu`.
- Tracks integration signals (Vercel, Turso, PayHero, Brevo, GetStream, Cloudinary, Render).
- Publishes normalized findings per project and portfolio-level risk synthesis.
- Runs automatic sync from GitHub events and scheduled reconciliation.

## Structure
- `skills/` reusable skill artifacts and imported baselines
- `frameworks/` secure engineering frameworks and standards
- `inventory/repos/` normalized per-repo snapshots
- `inventory/vercel/` GitHub-to-Vercel mapping verification records
- `findings/portfolio/` systemic gaps and remediation roadmaps
- `schemas/` output schemas validated in CI
- `scripts/` sync, verification, and validation logic
- `.github/workflows/` event + nightly automation

## Sync model
- **Event-driven** (`sync-on-event.yml`) for near real-time updates.
- **Scheduled reconciliation** (`nightly-reconcile.yml`) to recover from missed events/drift.

## Accuracy policy
- Deterministic data generation
- Schema validation before publish
- Freshness and drift checks
- Explicit error reports for failed sources

## Notes
- Remote-only scanning is used for source repositories.
- This command centre never requires cloning upstream repos.
