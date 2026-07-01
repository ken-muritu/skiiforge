#!/usr/bin/env python3
import json
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "schemas" / "sync-policy.json"
METRICS = ROOT / "findings" / "portfolio" / "metrics.json"
VERIFICATION = ROOT / "inventory" / "vercel" / "verification.json"
ALERTS = ROOT / "findings" / "portfolio" / "alerts.json"
ALERTS_MD = ROOT / "findings" / "portfolio" / "alerts.md"


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    policy = load_json(POLICY, {})
    metrics = load_json(METRICS, {})
    verifications = load_json(VERIFICATION, [])

    alerts = []
    max_stale = policy.get("max_stale_repos", 0)
    max_failed = policy.get("max_failed_sources", 0)
    expected_core = set(policy.get("expected_core_repos", []))
    alert_on_core_statuses = set(policy.get("alert_on_core_vercel_statuses", ["mismatch", "fetch_failed", "missing"]))
    must_be_verified = policy.get("core_repo_must_be_verified", True)

    stale = metrics.get("repo_count_stale", 0)
    failed = metrics.get("quarantined_sources_count", 0)
    if stale > max_stale:
        alerts.append(f"Freshness SLO breached: stale={stale}, threshold={max_stale}")
    if failed > max_failed:
        alerts.append(f"Failed source threshold breached: failed={failed}, threshold={max_failed}")

    true_fetch_failures = [
        item
        for item in verifications
        if item.get("verification_status") == "fetch_failed"
    ]
    if true_fetch_failures:
        sample = ", ".join(item.get("repo", "?") for item in true_fetch_failures[:5])
        alerts.append(
            f"Vercel verification transport failures: count={len(true_fetch_failures)} repos=[{sample}]"
        )

    verification_by_repo = {item.get("repo"): item for item in verifications}
    for core_repo in sorted(expected_core):
        item = verification_by_repo.get(core_repo)
        if not item:
            alerts.append(f"Missing verification record for expected core repo: {core_repo}")
            continue

        status = item.get("verification_status")
        if must_be_verified and status != "verified":
            if status in alert_on_core_statuses:
                alerts.append(
                    f"Core repo not verified: {core_repo} status={status} "
                    f"reason={item.get('reason_code')}"
                )

    payload = {"alert_count": len(alerts), "alerts": alerts}
    ALERTS.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    ALERTS_MD.write_text(
        "# Skiiforge Alerts\n\n" + ("\n".join(f"- {item}" for item in alerts) if alerts else "- No active alerts"),
        encoding="utf-8",
    )

    step_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if step_summary:
        Path(step_summary).write_text(
            "## Skiiforge Alert Summary\n\n"
            + ("\n".join(f"- {item}" for item in alerts) if alerts else "- No active alerts")
            + "\n",
            encoding="utf-8",
        )
    print(f"Alerts generated: {len(alerts)}")


if __name__ == "__main__":
    main()
