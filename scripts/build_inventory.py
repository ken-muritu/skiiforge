#!/usr/bin/env python3
import csv
import json
import os
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "inventory" / "raw"
REPOS_OUT = ROOT / "inventory" / "repos"
VERCEL_OUT = ROOT / "inventory" / "vercel"


PROBE_MAP = {
    ".vercel/repo.json": "vercel",
    "src/lib/turso-api.ts": "turso",
    "src/lib/payhero-webhook.ts": "payhero",
    "src/lib/payhero.ts": "payhero",
    "src/lib/email.ts": "brevo",
    "src/lib/stream/server.ts": "getstream",
    "render.yaml": "render",
}


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def parse_probes(path: Path):
    integrations = {
        "vercel": False,
        "turso": False,
        "payhero": False,
        "brevo": False,
        "getstream": False,
        "cloudinary": False,
        "render": False,
    }
    if not path.exists():
        return integrations

    with path.open("r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) != 2:
                continue
            probe, exit_code = row
            if probe in PROBE_MAP and exit_code == "0":
                integrations[PROBE_MAP[probe]] = True
            if "cloudinary" in probe.lower() and exit_code == "0":
                integrations["cloudinary"] = True
    return integrations


def main():
    REPOS_OUT.mkdir(parents=True, exist_ok=True)
    VERCEL_OUT.mkdir(parents=True, exist_ok=True)

    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    run_id = os.getenv("SKIIFORGE_RUN_ID", generated_at.replace(":", "").replace("-", ""))
    scan_scope = os.getenv("SKIIFORGE_SCAN_SCOPE", "full")
    generator_version = "2.0.0"
    schema_version = "2.0.0"

    repos = load_json(RAW / "repos_full.json", [])
    profiles = []

    for repo in repos:
        name = repo["name"]
        meta = load_json(RAW / f"{name}_meta.json", {})
        prs = load_json(RAW / f"{name}_prs_open.json", [])
        issues = load_json(RAW / f"{name}_issues_open.json", [])
        workflows = load_json(RAW / f"{name}_workflows.json", [])
        runs = load_json(RAW / f"{name}_workflow_runs.json", [])
        has_skills = (RAW / f"{name}_has_cursor_skills.exit").read_text(encoding="utf-8").strip() == "0" if (RAW / f"{name}_has_cursor_skills.exit").exists() else False
        integrations = parse_probes(RAW / f"{name}_path_probes.csv")

        failing_runs = sum(1 for r in runs if r.get("conclusion") == "failure")
        profile = {
            "schema_version": schema_version,
            "generated_at": generated_at,
            "source_sha_or_etag": meta.get("pushed_at", "unknown"),
            "generator_version": generator_version,
            "run_id": run_id,
            "scan_scope": scan_scope,
            "name": name,
            "visibility": meta.get("visibility", "unknown"),
            "default_branch": meta.get("default_branch", repo.get("defaultBranchRef", {}).get("name", "main")),
            "pushed_at": meta.get("pushed_at", repo.get("pushedAt", "")),
            "skills_detected": has_skills,
            "integrations": integrations,
            "open_prs": len(prs),
            "open_issues": len(issues),
            "workflow_count": len(workflows),
            "failing_recent_runs": failing_runs,
        }
        profiles.append(profile)
        (REPOS_OUT / f"{name}.project-profile.json").write_text(json.dumps(profile, indent=2), encoding="utf-8")

    summary = {
        "schema_version": schema_version,
        "generated_at": generated_at,
        "generator_version": generator_version,
        "run_id": run_id,
        "scan_scope": scan_scope,
        "generated_repo_count": len(profiles),
        "profiles": profiles
    }
    (REPOS_OUT / "index.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
