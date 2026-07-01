#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="$ROOT/inventory/raw"
mkdir -p "$RAW"

gh repo list ken-muritu --limit 300 --json name,isPrivate,defaultBranchRef,pushedAt,url > "$RAW/repos_full.json"
jq -r '.[].name' "$RAW/repos_full.json" > "$RAW/repo_names.txt"

while read -r repo; do
  echo "Scanning $repo"
  gh api repos/ken-muritu/"$repo" --jq '{name,private,default_branch,pushed_at,visibility,has_wiki,has_projects,open_issues_count,fork,size,language}' > "$RAW/${repo}_meta.json"
  gh api repos/ken-muritu/"$repo"/branches --jq '[.[].name]' > "$RAW/${repo}_branches.json"
  gh api repos/ken-muritu/"$repo"/pulls?state=open --jq '[.[] | {number,title,head:.head.ref,base:.base.ref,updated_at}]' > "$RAW/${repo}_prs_open.json"
  gh api repos/ken-muritu/"$repo"/issues?state=open --jq '[.[] | select(.pull_request|not) | {number,title,updated_at}]' > "$RAW/${repo}_issues_open.json"
  gh api repos/ken-muritu/"$repo"/actions/workflows --jq '[.workflows[]? | {name,path,state}]' > "$RAW/${repo}_workflows.json"
  gh api repos/ken-muritu/"$repo"/actions/runs?per_page=20 --jq '[.workflow_runs[]? | {name,conclusion,status,head_branch,updated_at}]' > "$RAW/${repo}_workflow_runs.json"
  gh api repos/ken-muritu/"$repo"/contents/.cursor/skills >/dev/null 2>&1; echo $? > "$RAW/${repo}_has_cursor_skills.exit"

  : > "$RAW/${repo}_path_probes.csv"
  for p in .vercel/repo.json vercel.json render.yaml package.json next.config.ts next.config.js drizzle.config.ts prisma/schema.prisma src/lib/turso-api.ts src/lib/payhero-webhook.ts src/lib/payhero.ts src/lib/email.ts src/lib/stream/server.ts apps/web/src/lib/turso-api.ts apps/web/src/lib/payhero-webhook.ts apps/web/src/lib/stream/server.ts apps/api/src/services/emailService.ts apps/api/src/lib/imageUpload.ts; do
    gh api repos/ken-muritu/"$repo"/contents/"$p" >/dev/null 2>&1
    code=$?
    printf '%s,%s\n' "$p" "$code" >> "$RAW/${repo}_path_probes.csv"
  done
done < "$RAW/repo_names.txt"
