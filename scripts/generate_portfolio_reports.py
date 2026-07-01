#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOS_INDEX = ROOT / "inventory" / "repos" / "index.json"
VERCEL_VERIFICATION = ROOT / "inventory" / "vercel" / "verification.json"
QUARANTINE = ROOT / "inventory" / "quarantine" / "sync-failures.json"
POLICY = ROOT / "schemas" / "sync-policy.json"
PORTFOLIO = ROOT / "findings" / "portfolio"


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    index = load_json(REPOS_INDEX, {"profiles": [], "generated_repo_count": 0})
    profiles = index.get("profiles", [])
    verification = load_json(VERCEL_VERIFICATION, [])
    quarantine = load_json(QUARANTINE, {"failures": []})
    policy = load_json(POLICY, {})

    verified_count = sum(1 for item in verification if item.get("verification_status") == "verified")
    mismatch_count = sum(1 for item in verification if item.get("verification_status") == "mismatch")
    missing_count = sum(1 for item in verification if item.get("verification_status") == "missing")
    fetch_failed_count = sum(1 for item in verification if item.get("verification_status") == "fetch_failed")

    freshness_cutoff_hours = policy.get("max_snapshot_age_hours", 24)
    repo_count_total = len(profiles)
    repo_count_stale = 0
    for profile in profiles:
        ts = profile.get("generated_at")
        if not ts:
            repo_count_stale += 1
            continue
        parsed = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        age = (datetime.now(timezone.utc) - parsed).total_seconds() / 3600
        if age > freshness_cutoff_hours:
            repo_count_stale += 1
    repo_count_fresh = max(repo_count_total - repo_count_stale, 0)

    metrics = {
        "generated_at": now,
        "repo_count_total": repo_count_total,
        "repo_count_fresh": repo_count_fresh,
        "repo_count_stale": repo_count_stale,
        "validation_failures": len(quarantine.get("failures", [])),
        "vercel_verified_count": verified_count,
        "quarantined_sources_count": len(quarantine.get("failures", [])),
        "vercel_mismatch_count": mismatch_count,
        "vercel_missing_count": missing_count,
        "vercel_fetch_failed_count": fetch_failed_count,
    }
    PORTFOLIO.mkdir(parents=True, exist_ok=True)
    (PORTFOLIO / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    dashboard = [
        "# Skiiforge Metrics Dashboard",
        "",
        f"- Generated at: {now}",
        f"- Repo count total: {repo_count_total}",
        f"- Repo count fresh: {repo_count_fresh}",
        f"- Repo count stale: {repo_count_stale}",
        f"- Validation failures: {metrics['validation_failures']}",
        f"- Vercel verified count: {verified_count}",
        f"- Quarantined sources count: {metrics['quarantined_sources_count']}",
        f"- Vercel mismatch count: {mismatch_count}",
        f"- Vercel missing count: {missing_count}",
        f"- Vercel fetch failed count: {fetch_failed_count}",
    ]
    (PORTFOLIO / "metrics-dashboard.md").write_text("\n".join(dashboard), encoding="utf-8")

    drift_report = {
        "generated_at": now,
        "repo_count": repo_count_total,
        "stale_count": repo_count_stale,
        "missing_vercel_mapping_count": missing_count,
        "mismatch_vercel_mapping_count": mismatch_count,
        "fetch_failed_vercel_mapping_count": fetch_failed_count,
        "quarantined_sources_count": metrics["quarantined_sources_count"],
    }
    (PORTFOLIO / "drift-report.json").write_text(json.dumps(drift_report, indent=2), encoding="utf-8")

    risks = {
        "generated_at": now,
        "risks": [
            {
                "risk_id": "RISK-001",
                "category": "availability",
                "likelihood": "medium",
                "impact": "high",
                "owner": "platform",
                "mitigation": "retry/backoff and quarantine replay",
                "status": "open",
                "last_reviewed_at": now,
            },
            {
                "risk_id": "RISK-002",
                "category": "data-freshness",
                "likelihood": "medium",
                "impact": "high",
                "owner": "platform",
                "mitigation": "event + reconcile + stale SLO alerts",
                "status": "open",
                "last_reviewed_at": now,
            },
            {
                "risk_id": "RISK-003",
                "category": "schema-drift",
                "likelihood": "medium",
                "impact": "medium",
                "owner": "platform",
                "mitigation": "versioned schemas and CI validation",
                "status": "open",
                "last_reviewed_at": now,
            },
            {
                "risk_id": "RISK-004",
                "category": "permissions",
                "likelihood": "medium",
                "impact": "high",
                "owner": "security",
                "mitigation": "least-privilege tokens and scope checks",
                "status": "open",
                "last_reviewed_at": now,
            },
            {
                "risk_id": "RISK-005",
                "category": "sensitive-data",
                "likelihood": "low",
                "impact": "high",
                "owner": "security",
                "mitigation": "output filtering and log redaction",
                "status": "open",
                "last_reviewed_at": now,
            },
        ],
    }
    (PORTFOLIO / "risk-register.json").write_text(json.dumps(risks, indent=2), encoding="utf-8")
    print("Generated metrics, drift report, and risk register")


if __name__ == "__main__":
    main()
