#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOS_DIR = ROOT / "inventory" / "repos"
INDEX_PATH = REPOS_DIR / "index.json"


def main():
    if not INDEX_PATH.exists():
        raise SystemExit("Missing inventory/repos/index.json")

    data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    profiles = data.get("profiles", [])
    if data.get("generated_repo_count") != len(profiles):
        raise SystemExit("generated_repo_count mismatch")

    required = {
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

    print(f"Validated {len(profiles)} project profiles")


if __name__ == "__main__":
    main()
