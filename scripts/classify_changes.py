#!/usr/bin/env python3
import subprocess


def main():
    result = subprocess.run(
        ["git", "diff", "--cached", "--name-only"],
        capture_output=True,
        text=True,
        check=True,
    )
    changed = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if not changed:
        print("none")
        return
    if any(path.startswith("inventory/repos/") and path.endswith(".risk-register.json") for path in changed):
        print("risk-impacting")
        return
    if any(path.startswith("inventory/vercel/verification.json") for path in changed):
        print("integration-change")
        return
    print("metadata-only")


if __name__ == "__main__":
    main()
