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
    """Return (mapping, error_kind, detail).

    error_kind:
      - None: success or absent file (not a transport failure)
      - "fetch_failed": API/auth/decode/transport failure
    detail:
      - "present" | "absent" | error message
    """
    code, out, stderr = gh_api(f"repos/ken-muritu/{repo}/contents/.vercel/repo.json")
    if code != 0:
        combined = f"{stderr} {out}".lower()
        if code == 404 or "404" in combined or "not found" in combined:
            return None, None, "absent"
        return None, "fetch_failed", stderr.strip() or f"http_{code}"

    try:
        payload = json.loads(out)
        content = base64.b64decode(payload["content"]).decode("utf-8")
        return json.loads(content), None, "present"
    except Exception as exc:
        return None, "fetch_failed", f"decode_error: {exc}"


def verify_with_repo_json(repo: str, mapping: dict, vercel_project: dict | None):
    projects = mapping.get("projects", [])
    repo_match = next((p for p in projects if p.get("name") == repo), None)
    if not repo_match:
        return {
            "repo": repo,
            "verification_status": "mismatch",
            "reason_code": "repo_json_name_mismatch",
            "evidence": projects,
        }

    if not vercel_project:
        return {
            "repo": repo,
            "verification_status": "missing",
            "reason_code": "vercel_project_not_found",
            "repo_json_project_id": repo_match.get("id"),
            "repo_json_project_name": repo_match.get("name"),
            "evidence": "repo.json present but no Vercel API project with matching repo name",
        }

    if repo_match.get("id") != vercel_project.get("id"):
        return {
            "repo": repo,
            "verification_status": "mismatch",
            "reason_code": "project_id_mismatch",
            "repo_json_project_id": repo_match.get("id"),
            "vercel_project_id": vercel_project.get("id"),
            "repo_json_project_name": repo_match.get("name"),
            "vercel_project_name": vercel_project.get("name"),
        }

    return {
        "repo": repo,
        "verification_status": "verified",
        "reason_code": "repo_json_and_vercel_api_match",
        "repo_json_project_id": repo_match.get("id"),
        "repo_json_project_name": repo_match.get("name"),
        "vercel_project_id": vercel_project.get("id"),
        "vercel_project_name": vercel_project.get("name"),
        "latestProductionUrl": vercel_project.get("latestProductionUrl"),
    }


def verify_without_repo_json(repo: str, vercel_project: dict | None):
    if vercel_project:
        return {
            "repo": repo,
            "verification_status": "verified",
            "reason_code": "vercel_api_name_match",
            "vercel_project_id": vercel_project.get("id"),
            "vercel_project_name": vercel_project.get("name"),
            "latestProductionUrl": vercel_project.get("latestProductionUrl"),
            "evidence": (
                ".vercel/repo.json not in remote repository (typically gitignored); "
                "verified via Vercel API project name match"
            ),
        }

    return {
        "repo": repo,
        "verification_status": "missing",
        "reason_code": "no_vercel_linkage",
        "evidence": (
            "No .vercel/repo.json in remote repository and no Vercel project "
            "with matching name"
        ),
    }


def main():
    repos = json.loads(REPOS_INDEX.read_text(encoding="utf-8")).get("profiles", [])
    vercel_projects = json.loads(VERCEL_PROJECTS.read_text(encoding="utf-8")).get("projects", [])
    vercel_by_name = {project["name"]: project for project in vercel_projects}

    results = []
    for profile in repos:
        repo = profile["name"]
        mapping, error_kind, detail = fetch_repo_json(repo)
        vercel_project = vercel_by_name.get(repo)

        if error_kind == "fetch_failed":
            results.append(
                {
                    "repo": repo,
                    "verification_status": "fetch_failed",
                    "reason_code": "repo_json_fetch_error",
                    "evidence": detail,
                }
            )
            continue

        if detail == "present" and mapping is not None:
            results.append(verify_with_repo_json(repo, mapping, vercel_project))
        else:
            results.append(verify_without_repo_json(repo, vercel_project))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote {len(results)} verification records")


if __name__ == "__main__":
    main()
