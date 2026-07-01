#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOS_DIR = ROOT / "inventory" / "repos"
INDEX_PATH = REPOS_DIR / "index.json"
POLICY_PATH = ROOT / "schemas" / "sync-policy.json"
VERCEL_VERIFICATION_PATH = ROOT / "inventory" / "vercel" / "verification.json"
QUARANTINE_PATH = ROOT / "inventory" / "quarantine" / "sync-failures.json"


def main():
    if not INDEX_PATH.exists():
        raise SystemExit("Missing inventory/repos/index.json")

    data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    profiles = data.get("profiles", [])
    if data.get("generated_repo_count") != len(profiles):
        raise SystemExit("generated_repo_count mismatch")

    if not POLICY_PATH.exists():
        raise SystemExit("Missing schemas/sync-policy.json")
    policy = json.loads(POLICY_PATH.read_text(encoding="utf-8"))

    required = {
        "schema_version",
        "generated_at",
        "source_sha_or_etag",
        "generator_version",
        "run_id",
        "scan_scope",
        "name",
        "visibility",
        "default_branch",
        "pushed_at",
        "skills_detected",
        "integrations",
        "open_prs",
        "open_issues",
        "workflow_count",
        "failing_recent_runs",
    }

    for profile in profiles:
        missing = required.difference(profile.keys())
        if missing:
            raise SystemExit(f"Profile {profile.get('name')} missing fields: {sorted(missing)}")

    max_age_hours = policy.get("max_snapshot_age_hours", 24)
    now = datetime.now(timezone.utc)
    stale_repos = []
    for profile in profiles:
        generated_at = profile.get("generated_at")
        try:
            ts = datetime.fromisoformat(generated_at.replace("Z", "+00:00"))
        except Exception as exc:
            raise SystemExit(f"Invalid generated_at for {profile.get('name')}: {generated_at}") from exc
        age_hours = (now - ts).total_seconds() / 3600
        if age_hours > max_age_hours:
            stale_repos.append(profile.get("name"))

    if stale_repos:
        raise SystemExit(f"Stale snapshots found ({len(stale_repos)}): {stale_repos[:10]}")

    max_failed_sources = policy.get("max_failed_sources", 0)
    if QUARANTINE_PATH.exists():
        quarantine = json.loads(QUARANTINE_PATH.read_text(encoding="utf-8"))
        failures = quarantine.get("failures", [])
        if len(failures) > max_failed_sources:
            raise SystemExit(f"Failed sources exceeded threshold: {len(failures)} > {max_failed_sources}")

    if VERCEL_VERIFICATION_PATH.exists():
        allowed = set(policy.get("required_verification_statuses", []))
        if allowed:
            verification = json.loads(VERCEL_VERIFICATION_PATH.read_text(encoding="utf-8"))
            invalid = [
                item for item in verification
                if item.get("verification_status") not in allowed
            ]
            if invalid:
                raise SystemExit(f"Invalid verification statuses found: {invalid[:3]}")

    print(f"Validated {len(profiles)} project profiles")


if __name__ == "__main__":
    main()
