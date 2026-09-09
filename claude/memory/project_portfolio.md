---
name: project-portfolio
description: "Personal portfolio kennedymuritu.vercel.app — editorial rebuild shipped 2026-08-24 (chapter arc, odometers, legal pages, Tally embed pending form ID)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 926d7900-28c4-42f7-94ff-ee0d3fe1961d
  modified: 2026-08-27T15:48:26.120Z
---

Kennedy's portfolio `github.com/ken-muritu/muritukennedy` → `kennedymuritu.vercel.app` (Vercel project `kennedymuritu`, Turso DB `kennedy-portfolio` via turso CLI).

Shipped 2026-08-24 commit `25c02c5`: full editorial rebuild borrowing patterns from a teardown of fariraimasocha.co.zw — numbered chapter homepage (01 work / 02 about / 03 writing / 04 next / 05 contact), label-mono running heads, rolling-digit odometer stats (`components/odometer.tsx`), WorkGrid cutout cards with layoutId in-place expansion, hairline essay rows, per-letter CTA reveal + copy-email, rule-grid/ping-dot/nav-scrim CSS. Theme switch = View Transitions circular reveal w/ crossfade fallback (`lib/theme.ts`). Deleted 19 dead components. Terms `/terms` + Privacy `/privacy` written Kenya-DPA-2019-grounded (ODPC registration currently exempt: solo, <KES 5M); click-wrap design needs required consent checkbox on Tally forms.

Data honesty fixes: prod DB `projects_shipped` corrected 5+ → **40+** (verified 43 Vercel production deployments via `vercel project ls`); fabricated `community_members=127` removed (UI hides counts when 0). Stat values editable in admin /stats panel.

Batch 2 shipped 2026-08-24 commit `0173b03`: Tally contact form **xX5rBv** live (PUBLISHED, required ToS/Privacy consent checkbox; env `NEXT_PUBLIC_TALLY_CONTACT_ID` on Vercel all scopes + `.env.local`, never committed); stack icons replace the skills text row (`components/stack-logos.tsx` + `public/logos/*.svg` simple-icons via CSS mask, M-Pesa Daraja falls back to mono chip); About paragraphs render admin markdown (`**bold**`/`*italic*`) in a single measured column — raw asterisks were the "unprofessional formatting"; all 8 projects have real hero captures in `public/projects/*-hero.png` (headless Firefox screenshots of the live deployments, `MOZ_HEADLESS=1 LIBGL_ALWAYS_SOFTWARE=1 firefox --no-remote --screenshot`; Rewind's sub-paragraph is scroll-linked and stays half-faded in captures). Prod Turso Project.imageUrl + seed kept in sync.

Review pass shipped 2026-08-24 commit `8d59325`: **the theme vars are plain hex (`--x: #f4f1ea`), so Tailwind `/N` opacity modifiers compile to NOTHING** — `bg-muted-foreground/60` etc. silently render transparent. Root fix rejected (37 direct `var()` consumers in globals.css incl. color-mix lines would break); instead all public `/N` usages were replaced with `color-mix(in_srgb,var(--x)_N%,transparent)` arbitrary classes — the convention globals.css itself uses. Admin panel still has ~30 dead tint classes (cosmetic only, left alone). Symptom that surfaced it: stack icons painted invisible (mask over no background) and the project-modal scrim never dimmed. Site is `defaultTheme="dark" enableSystem={false}` — Playwright `colorScheme:'light'` does NOT flip it; set `localStorage.theme=light` via addInitScript instead. Local prod preview needs DATABASE_URL/DATABASE_AUTH_TOKEN in `.env.local` (static build bakes DB data; token via `turso db tokens create kennedy-portfolio`).

Related: [[project-theinnercircle]] for Tally API schema. See [[user-environment]].

**Open items (2026-08-24, session `926d7900`):** a **mystery Tally submission arrived 15:22 UTC** on the contact form (not the QA test; list view showed empty responses) — left in place, flagged to the user to check his Tally dashboard; never asked about since, could be a real lead. The Tally API key used that day: user said "**do not revoke it until I say so**" — still in force. Playwright light-mode QA trick: `localStorage.theme=light` via addInitScript (enableSystem=false ignores colorScheme).
