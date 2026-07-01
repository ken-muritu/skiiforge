#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "inventory" / "vercel" / "projects.json"


def fetch_page(next_cursor=None):
    cmd = ["vercel", "project", "ls", "--json"]
    if next_cursor is not None:
        cmd.extend(["--next", str(next_cursor)])
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    lines = [
        line
        for line in result.stdout.splitlines()
        if not line.startswith("Vercel CLI") and not line.startswith("Fetching projects")
    ]
    return json.loads("\n".join(lines).strip())


def main():
    all_projects = []
    next_cursor = None
    while True:
        payload = fetch_page(next_cursor=next_cursor)
        all_projects.extend(payload.get("projects", []))
        next_cursor = payload.get("pagination", {}).get("next")
        if not next_cursor:
            break
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"projects": all_projects}, indent=2), encoding="utf-8")
    print(f"Collected {len(all_projects)} Vercel projects")


if __name__ == "__main__":
    main()
