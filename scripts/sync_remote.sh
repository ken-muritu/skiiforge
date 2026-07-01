#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="$ROOT/inventory/raw"
TMP_RAW="$ROOT/inventory/.raw_tmp"
QUARANTINE_DIR="$ROOT/inventory/quarantine"
mkdir -p "$TMP_RAW" "$QUARANTINE_DIR"
rm -rf "$TMP_RAW"/*

RUN_ID="${SKIIFORGE_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
FAILURES_FILE="$QUARANTINE_DIR/sync-failures.json"
echo '{"run_id":"'"$RUN_ID"'","failures":[]}' > "$FAILURES_FILE"

record_failure() {
  local repo="$1"
  local stage="$2"
  local details="$3"
  python3 - "$FAILURES_FILE" "$repo" "$stage" "$details" <<'PY'
import json, sys
path, repo, stage, details = sys.argv[1:5]
data = json.load(open(path, "r", encoding="utf-8"))
data["failures"].append({"repo": repo, "stage": stage, "details": details})
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
PY
}

safe_api() {
  local repo="$1"
  local stage="$2"
  local endpoint="$3"
  local outfile="$4"
  local jq_filter="$5"
  if gh api "$endpoint" --jq "$jq_filter" > "$outfile"; then
    return 0
  fi
  record_failure "$repo" "$stage" "$endpoint"
  echo "[]" > "$outfile"
  return 1
}

if ! gh repo list ken-muritu --limit 300 --json name,isPrivate,defaultBranchRef,pushedAt,url > "$TMP_RAW/repos_full.json"; then
  record_failure "global" "repo_list" "gh repo list failed"
  exit 1
fi

jq -r '.[].name' "$TMP_RAW/repos_full.json" > "$TMP_RAW/repo_names.txt"

while read -r repo; do
  echo "Scanning $repo"
  safe_api "$repo" "meta" "repos/ken-muritu/$repo" "$TMP_RAW/${repo}_meta.json" '{name,private,default_branch,pushed_at,visibility,has_wiki,has_projects,open_issues_count,fork,size,language}' >/dev/null || true
  safe_api "$repo" "branches" "repos/ken-muritu/$repo/branches" "$TMP_RAW/${repo}_branches.json" '[.[].name]' >/dev/null || true
  safe_api "$repo" "prs" "repos/ken-muritu/$repo/pulls?state=open" "$TMP_RAW/${repo}_prs_open.json" '[.[] | {number,title,head:.head.ref,base:.base.ref,updated_at}]' >/dev/null || true
  safe_api "$repo" "issues" "repos/ken-muritu/$repo/issues?state=open" "$TMP_RAW/${repo}_issues_open.json" '[.[] | select(.pull_request|not) | {number,title,updated_at}]' >/dev/null || true
  safe_api "$repo" "workflows" "repos/ken-muritu/$repo/actions/workflows" "$TMP_RAW/${repo}_workflows.json" '[.workflows[]? | {name,path,state}]' >/dev/null || true
  safe_api "$repo" "workflow_runs" "repos/ken-muritu/$repo/actions/runs?per_page=20" "$TMP_RAW/${repo}_workflow_runs.json" '[.workflow_runs[]? | {name,conclusion,status,head_branch,updated_at}]' >/dev/null || true

  if gh api repos/ken-muritu/"$repo"/contents/.cursor/skills >/dev/null 2>&1; then
    echo "0" > "$TMP_RAW/${repo}_has_cursor_skills.exit"
  else
    echo "1" > "$TMP_RAW/${repo}_has_cursor_skills.exit"
  fi

  : > "$TMP_RAW/${repo}_path_probes.csv"
  for p in .vercel/repo.json vercel.json render.yaml package.json next.config.ts next.config.js drizzle.config.ts prisma/schema.prisma src/lib/turso-api.ts src/lib/payhero-webhook.ts src/lib/payhero.ts src/lib/email.ts src/lib/stream/server.ts apps/web/src/lib/turso-api.ts apps/web/src/lib/payhero-webhook.ts apps/web/src/lib/stream/server.ts apps/api/src/services/emailService.ts apps/api/src/lib/imageUpload.ts; do
    if gh api repos/ken-muritu/"$repo"/contents/"$p" >/dev/null 2>&1; then
      code=0
    else
      code=$?
    fi
    printf '%s,%s\n' "$p" "$code" >> "$TMP_RAW/${repo}_path_probes.csv"
  done
done < "$TMP_RAW/repo_names.txt"

mkdir -p "$RAW"
rm -rf "$RAW"
mv "$TMP_RAW" "$RAW"
