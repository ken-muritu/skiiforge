---
name: project-edifice-audit
description: Edifice due-diligence audit completed 2026-08-25; report at ~/edifice-inspection.md; key findings and repo state
metadata: 
  node_type: memory
  type: project
  originSessionId: 87a527cc-f23c-4363-b02e-2293642860e7
  modified: 2026-08-25T18:14:04.517Z
---

Edifice (ken-muritu/edifice, School OS for African private schools) full due-diligence audit completed 2026-08-25. Repo cloned at `~/edifice`, audited at HEAD `7a6e145` (= origin/main = live deploy). Report delivered as **`~/edifice-inspection.md`** (user chose md over artifact; HTML twin at `~/edifice-inspection.html`). Chain: qwen session (`qwen/qwen3.8-max-free` via TokenRouter `claude-tr`) did the field survey but its stream died twice mid-report; ox-alpha reconstructed findings from its transcript + authoritative handoff relayed by pop-os-5d, independently re-verified every headline claim, and wrote the final report.

Key verified findings (full detail F1–F13 in the report): offline sync replay unconditionally throws (`sync/replay.ts:10`) while UI/marketing still promise offline-first; dashboard ships hardcoded `attendanceToday: 94` (`actions/school.ts:252`) + hardcoded DeltaBadge direction; "AI insights" are three if-clauses (`dashboard/data.ts:103`); billing copy claims M-Pesa monthly renewal, none enforced (revenue leak); tsconfig excludes hide dead pharmacy-graft files (pos/pharmacy/barcode) from typecheck; live demo creds in `replit.md` fail in production; README forensic-audit stale vs HEAD; fabricated testimonials + KEMIS/ODPC/KRA compliance overclaims in marketing-content.ts.

Stack reality (briefs were outdated): Next.js 16 App Router, Drizzle+Turso database-per-tenant (not Prisma), NextAuth v5, PayHero (not Daraja), 7-role RBAC. What holds: auth stack, tenant provisioning, messaging client, tests 30/30, build clean 66 routes.

Note: artifact publishing fails from sessions authed with ANTHROPIC_AUTH_TOKEN (needs claude.ai login) — see [[user_environment]]; TokenRouter qwen key remains flagged for revocation ([[project_tokenrouter_setup]]). Related: [[project_addplus]] shares the Solera pharmacy-graft lineage.
