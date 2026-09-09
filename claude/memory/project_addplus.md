---
name: project-addplus
description: "ADDPlus+ marketplace audit (Aug 2026) — repo cloned to ~/addplus, dual-architecture problem, top findings before polish/hardening phase"
metadata: 
  node_type: memory
  type: project
  originSessionId: ce40e218-0353-46dd-9faa-d25b3eeacc85
  modified: 2026-08-25T02:19:31.959Z
---

ADDPlus+ (ken-muritu/addplus, private; web addplus.vercel.app, API addplus-api.onrender.com, Turso `addplus-db`) = Kennedy's multi-vendor Nairobi SME marketplace (M-Pesa escrow, 5%+5% levy, collective fund).

**Non-obvious structural fact:** July 2026 grafted the [[reference-skiiforge]]-adjacent **Solera pharmacy platform** (Drizzle metadata Turso DB, per-tenant DBs with *pharmacy* schema, NextAuth v5, PayHero SaaS billing, Stream Chat) into this Prisma/Express monorepo. The two stacks coexist but the Solera layer is ~90% dead code — live login/signup/orders all run on the legacy Express API path. Audit found: onboarding redirect-killed (`next.config.js` `/onboarding`→`/signup`), paid subscriptions can never activate, `getProfileForUser` server action leaks password hashes unauthenticated, legal/contact pages still verbatim Solera pharmacy text, profit-share cron double-pays lifetime levy pool weekly, Daraja signature stub rejects real production callbacks.

**Status (2026-08-25):** Hardening pass **shipped** — commit `53ca0a4` pushed to main; Vercel + Render deploys verified live. Solera layer stripped from web (user chose strip over finish-migration); 14 API security/money fixes landed (exactly-once profit share, transactional stock decrement, cancel-race guard, B2C reconciliation, Daraja IP-whitelist model); mobile core rescued (identifier login, real base URL, refresh interceptor, no fake-data fallbacks, assets generated). Still open: run `eas init`; zero tests; Daraja creds are placeholders (PayHero is the live rail); B2C payouts need go-live creds. **Render CLI v2 at ~/bin/render, logged in as kenhopkins.ke@gmail.com** (token in ~/.render/cli.yaml); addplus-api = srv-d8jtnd5dt1ts739b8vig. Fixed live 2026-08-25: PAYHERO_CALLBACK_URL pointed at solerasite.vercel.app (confirmations going to wrong product!) → addplus; NODE_ENV development → production. Docs committed: docs/REALITY_BASELINE.md (assumed-vs-actual payments) + docs/FIRST_ORDERS_PLAYBOOK.md (20-order validation sprint). Next phase per user: product focus, not bug discussion. **Authenticity pass shipped & live-verified**: mockData.ts deleted entirely, vision voice (Newton's thesis, honest 10% levy, held-until-delivery) across site, all fabrication removed (fake reviews/promos/policies/COD/delivery claims), dark-mode+NaN+empty-state sweep — homepage ADR-007 freeze explicitly overridden by user. Site now claims only verified-working features. Related: never mention pharmacy history to Tom (see [[project-caspahub]]).
