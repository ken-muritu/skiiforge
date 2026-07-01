#!/usr/bin/env python3
import base64
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOS_INDEX = ROOT / "inventory" / "repos" / "index.json"
VERCEL_PROJECTS = ROOT / "inventory" / "vercel" / "projects.json"
OUTPUT = ROOT / "inventory" / "vercel" / "verification.json"


def gh_api(path: str):
    result = subprocess.run(
        ["gh", "api", path],
        capture_output=True,
        text=True,
    )
    return result.returncode, result.stdout, result.stderr


def fetch_repo_json(repo: str):
    code, out, _ = gh_api(f"repos/ken-muritu/{repo}/contents/.vercel/repo.json")
    if code != 0:
        return None, "fetch_failed"
    try:
        payload = json.loads(out)
        content = base64.b64decode(payload["content"]).decode("utf-8")
        return json.loads(content), None
    except Exception:
        return None, "fetch_failed"


def main():
    repos = json.loads(REPOS_INDEX.read_text(encoding="utf-8")).get("profiles", [])
    vercel_projects = json.loads(VERCEL_PROJECTS.read_text(encoding="utf-8")).get("projects", [])
    vercel_by_name = {project["name"]: project for project in vercel_projects}

    results = []
    for profile in repos:
        repo = profile["name"]
        mapping, mapping_error = fetch_repo_json(repo)
        vercel_project = vercel_by_name.get(repo)

        if mapping_error:
            status = "fetch_failed"
            reason = "repo_json_unavailable"
            results.append(
                {
                    "repo": repo,
                    "verification_status": status,
                    "reason_code": reason,
                    "evidence": ".vercel/repo.json missing or unreadable",
                }
            )
            continue

        projects = mapping.get("projects", [])
        repo_match = next((p for p in projects if p.get("name") == repo), None)
        if not repo_match:
            results.append(
                {
                    "repo": repo,
                    "verification_status": "mismatch",
                    "reason_code": "repo_json_name_mismatch",
                    "evidence": projects,
                }
            )
            continue

        if not vercel_project:
            results.append(
                {
                    "repo": repo,
                    "verification_status": "missing",
                    "reason_code": "vercel_project_not_found",
                    "repo_json_project_id": repo_match.get("id"),
                    "repo_json_project_name": repo_match.get("name"),
                }
            )
            continue

        if repo_match.get("id") != vercel_project.get("id"):
            results.append(
                {
                    "repo": repo,
                    "verification_status": "mismatch",
                    "reason_code": "project_id_mismatch",
                    "repo_json_project_id": repo_match.get("id"),
                    "vercel_project_id": vercel_project.get("id"),
                    "repo_json_project_name": repo_match.get("name"),
                    "vercel_project_name": vercel_project.get("name"),
                }
            )
            continue

        results.append(
            {
                "repo": repo,
                "verification_status": "verified",
                "reason_code": "id_name_org_match",
                "repo_json_project_id": repo_match.get("id"),
                "repo_json_project_name": repo_match.get("name"),
                "vercel_project_id": vercel_project.get("id"),
                "vercel_project_name": vercel_project.get("name"),
                "latestProductionUrl": vercel_project.get("latestProductionUrl"),
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote {len(results)} verification records")


if __name__ == "__main__":
    main()
