---
name: project-theinnercircle
description: "The Inner Circle editorial site — v2 transformation shipped 2026-08-23, Tally join form wired in; Tally API schema knowledge"
metadata: 
  node_type: memory
  type: project
  originSessionId: 17f7a693-cc90-4d3e-984e-edc0dbb37203
  modified: 2026-08-24T15:42:22.641Z
---

The Inner Circle (`github.com/ken-muritu/theinnercircle` → `theinnercircle-ke.vercel.app`, Vercel project `theinnercircle`) — quiet editorial Next.js site for the user's community ("work before recognition", Kenya-rooted, Ruiru·Thika). Benchmark: jaligroup.org (fully reverse-engineered from its JS bundle 2026-08-23).

Shipped as commit `4ca33fd` (2026-08-23): `/story`, `/vision`, rewritten `/join` (intentional door), homepage arc, 2 journal + 1 work pieces, sitemap/robots/RSS/OG-image, founder portrait `public/ken-muritu.jpg`. Founder decisions locked: **one-step-but-intentional join**; WhatsApp room opens only after Kennedy personally reads introductions.

Upgrade shipped 2026-08-24 commit `3452698`: paper-grain overlay + rule-grid hairlines, living index of real journal/work pieces on the homepage (replaces abstract teasers), ping-dot status kicker, accent period-dot on join CTA, quiet "write to the circle" email line in footer. Patterns borrowed from fariraimasocha.co.zw teardown (see [[project-portfolio]]).

Join form: Tally form **Xx6ZoV** ("Join The Inner Circle", PUBLISHED, workspace `nG691j`) at `https://tally.so/r/Xx6ZoV`, linked from `/join` via `SITE.joinForm` in `lib/site.ts`. User said they'll revoke the Tally API key later — never commit it. Portfolio contact form: **xX5rBv** ("Get in touch", PUBLISHED, required ToS/Privacy consent checkbox), wired via `NEXT_PUBLIC_TALLY_CONTACT_ID` on Vercel project `kennedymuritu` (all scopes) + local `.env.local`.

Hard-won Tally create-form schema (docs are stubs; fully verified empirically 2026-08-24 by create→GET round-trip):
- Base URL `https://api.tally.so/forms` (NO `/v1` prefix). Create = POST with {name, status:"DRAFT", blocks:[...]}. Publish = PATCH same URL with {status:"PUBLISHED"} (works; `hasDraftBlocks` flips false). Delete = DELETE → 204.
- Every block: {uuid, groupUuid, groupType, type, payload} — flat array; groupType must match the GROUP's semantic type or validation says `"groupType" must be [...]`.
- FORM_TITLE: own group, groupType TEXT, payload {title, html:""} (only FORM_TITLE takes `title`).
- LABEL: always its OWN group (server rejects sharing with inputs), groupType LABEL, payload {html:"<p>…</p>"}.
- Question text lives in a sibling TITLE block: own group, groupType QUESTION, payload {html:"<p>…</p>"} — TITLE rejects `title`.
- Inputs (INPUT_TEXT/INPUT_EMAIL/TEXTAREA): own group, groupType = the input type, payload {placeholder, isRequired} only — `label`/`html` rejected.
- Checkbox questions: TITLE(QUESTION) + option blocks type CHECKBOX sharing their own groupUuid, groupType **CHECKBOXES** (plural), each payload {text, index, isFirst, isLast, isRequired-on-first}. Multiple choice = same but type MULTIPLE_CHOICE_OPTION, groupType **MULTIPLE_CHOICE**.
- PATCH /forms/{id} accepts {status} AND full {blocks} replacement (blocks update in place, form ID + embed URL preserved) — but on PATCH, FORM_TITLE payload must OMIT `html` (empty string rejected on update, fine on create).
- Submissions: GET /forms/{id}/submissions (list has empty `responses`; per-submission data via previewUrl/pdfUrl). DELETE /forms/{id}/submissions/{subId} → 204. POST submissions is not allowed with an API key ("Unauthorized") — E2E fill tests must drive the real form in a browser.
- Validation errors arrive one at a time (first bad block) and echo the offending block back — iterate.
- Probe forms deleted after use. See [[user-environment]].
