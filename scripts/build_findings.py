#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPOS_DIR = ROOT / "inventory" / "repos"


FIVE_PROJECT_RISKS = {
    "solera": [
        "Webhook verification fallback can accept forged payload shape.",
        "Callback secret transport in URL query.",
        "Weak CSP directives increase XSS blast radius.",
    ],
    "edifice": [
        "Service worker may cache sensitive same-origin API responses.",
        "Mutation surfaces show CSRF/origin-hardening gaps.",
        "CI workflow coverage is incomplete.",
    ],
    "caspahub": [
        "Public booking tracking path can expose customer details.",
        "Cookie-auth mutation routes need explicit CSRF controls.",
        "Payment/webhook trust model contains query-secret weakness.",
    ],
    "addplus": [
        "Password setup flow exposes account takeover risk.",
        "Webhook signature verification path contains weak/stubbed checks.",
        "Browser token storage patterns increase XSS impact.",
    ],
    "makao": [
        "Critical server actions lack strict authz checks.",
        "Webhook verification can be bypassed via permissive logic.",
        "Sensitive settings exposure and public health signal concerns.",
    ],
}


def main():
    index = json.loads((REPOS_DIR / "index.json").read_text(encoding="utf-8"))
    profiles = index["profiles"]

    for profile in profiles:
        name = profile["name"]
        integrations = profile["integrations"]

        integration_map = {
            "repo": name,
            "integrations": integrations,
            "source": "remote path probes"
        }
        (REPOS_DIR / f"{name}.integration-map.json").write_text(json.dumps(integration_map, indent=2), encoding="utf-8")

        risk_register = {
            "repo": name,
            "risk_count": len(FIVE_PROJECT_RISKS.get(name, [])),
            "risks": [
                {"severity": "high", "finding": finding}
                for finding in FIVE_PROJECT_RISKS.get(name, [])
            ],
        }
        (REPOS_DIR / f"{name}.risk-register.json").write_text(json.dumps(risk_register, indent=2), encoding="utf-8")

        control_coverage = {
            "repo": name,
            "known_controls": {
                "ci_present": profile["workflow_count"] > 0,
                "skills_present": profile["skills_detected"],
                "recent_failures_present": profile["failing_recent_runs"] > 0,
            },
            "gaps_flagged": [
                "requires_manual_security_review",
                "requires_webhook_verification_review",
                "requires_csrf_review",
            ],
        }
        (REPOS_DIR / f"{name}.control-coverage.json").write_text(json.dumps(control_coverage, indent=2), encoding="utf-8")

        quality_gap = {
            "repo": name,
            "workflow_count": profile["workflow_count"],
            "failing_recent_runs": profile["failing_recent_runs"],
            "open_prs": profile["open_prs"],
            "open_issues": profile["open_issues"],
            "notes": "Generated from remote metadata; deep code quality checks require targeted review."
        }
        (REPOS_DIR / f"{name}.quality-gap.json").write_text(json.dumps(quality_gap, indent=2), encoding="utf-8")

        skill_index = {
            "repo": name,
            "skills_detected": profile["skills_detected"],
            "frameworks_detected": [],
        }
        (REPOS_DIR / f"{name}.skills-frameworks-index.json").write_text(json.dumps(skill_index, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
