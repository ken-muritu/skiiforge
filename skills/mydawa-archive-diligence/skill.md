# MYDAWA-Style Live-Site Archive + Due-Diligence Skill

## Purpose

Capture a **complete visual + content archive** of a live, egress-restricted web app (exemplified by
https://mydawa.com/ — Kenya's online pharmacy) AND produce two deliverables from it:
1. A **Comprehensive Executive Platform Report** (what the platform is).
2. A **Due Diligence Assessment** (regulatory/compliance/security/privacy/resilience + a LIVE
   black-box pass), merged into one file `DueDiligenceMyDawa.md`.

The skill encodes the *method and the hard-won pitfalls* from a real run, so a future agent does not
repeat them: the `write_file` 0-byte bug, the duplicate-login-screenshot bug, the managed-browser 502
outages, the fixed-viewport/no-emulation limit, the sandbox egress block, and the auth-with-consent
OTP flow.

---

## When to Use

Invoke for any request that combines:
- "archive / screenshot / document a live website" (especially one blocked from the sandbox terminal).
- "due diligence / security review / compliance check of a site" — front-end / black-box only.
- "generate an executive report + DD from what we captured."
- Consolidating many captures into "one screenshots folder + one markdown folder" and a single report.

Do NOT use to:
- Attack or exploit the target (no SQLi, no auth bypass, no real purchases). Passive black-box only.
- Access non-public data beyond what the account owner explicitly authorizes.
- Claim backend/infra findings the front-end capture cannot support (mark them [Cannot assess]).

---

## Environment Reality (learned the hard way)

| Constraint | Detail | Consequence |
|---|---|---|
| **Sandbox egress** | Allow-listed to github/npm/Cloudflare only. `curl https://mydawa.com` → `000` (TLS reset); `http` → `403` (WAF). | The managed browser tool (Browserbase infra) is the **only** path to the live site. No Playwright/curl from terminal. |
| **Managed browser viewport** | Fixed ~1512 px, DPR 2, `touch:false`, **no CDP/viewport/emulation handle**. `window.resizeTo` is a no-op. | Genuine **mobile (390) / tablet (768)** shots are IMPOSSIBLE via this tool. Document responsive behaviour via observation, never fake it. |
| **No residential proxy** | Browserbase `stealth_warning`: "Running WITHOUT residential proxies." | Bot detection may be aggressive; expect intermittent **502 outages** of the CDP/launch endpoint. Build backoff + resume. |
| **`write_file` 0-byte bug** | In this sandbox, `write_file` silently produced **0-byte** deliverable files (the first push shipped 12 empty `.md`). | **Write all deliverables via in-process Python `open().write()`** (execute_code / terminal python). Validate byte counts before commit. |
| **Duplicate-login screenshot bug** | During 502/outage resets the page fell back to `/login`; a "copy latest screenshot" step then saved that *same* login page over intended captures. | 26 PNGs → only **11 unique** (11 identical login pages). **Dedupe by content hash** before committing; emit a MANIFEST. |

---

## Required Inputs

| Input | How to obtain |
|---|---|
| Live base URL | From the request. |
| Repo to commit into | `git clone` / verify `gh` auth (`gh auth status`). NOTE: the working repo was `ken-muritu/skiiforge` — there is **no `skillforge` repo**; confirm the real owner before pushing. |
| (If auth needed) Account owner consent + contact channel for OTP | Get explicit go-ahead; you will request the OTP mid-flow. Never place a real order. |
| Capture script for full matrix | `scripts/cap.py` (Playwright, desktop/tablet/mobile, idempotent, gated areas via `MYDAWA_STATE`). Runs only on a host with egress + Playwright — NOT in this sandbox. |

---

## Method

### Phase 0 — Recon & route map
1. `browser_navigate` the homepage; snapshot the link graph.
2. Pull `robots.txt` and `sitemap.xml` (same-origin, fetch via browser). **DD goldmine:** robots.txt
   discloses the internal route + API taxonomy (e.g. mydawa exposed `/productsearch`, `/addcart`,
   `/getpickuporders`, `/regions`, gated `/my-account`, `/my-orders`, `/payment-status`).
3. Build `routes.json` (marketing / categories / conditions / healthcare / info-legal / account-gated
   / sample-products). This is the crawl map.

### Phase 1 — Capture (desktop)
- Navigate each public route; `browser_vision` for screenshots; copy from the REAL cache path
  `/root/.hermes/cache/screenshots/*.png` (the tool's reported virtual path is false) into the repo.
- Extract real DOM text via `browser_console` (e.g. `document.title`, heading/link counts) — **never
  fabricate content**. Write via Python.
- For auth-gated routes: log in with owner consent (phone + SMS OTP). Click "Send code" → user
  supplies OTP → enter 6 digits → "Verify". Session is cookie-based; **502s can drop it** (re-login).
- Capture the cart/checkout gate, empty cart (note the checkout step indicator, e.g. 3-step
  Cart→Delivery→Payment), authenticated homepage. **Stop before any order placement.**

### Phase 2 — Consolidate (user's "all in one folder" request)
- `screenshots-all/` : dedupe PNGs by MD5; keep one per unique image; add `MANIFEST.md` tracing every
  original file. `mobile/` + `tablet/` stay empty (no emulation possible).
- `markdown-all/` : move all per-page `.md` here. Add `MASTER.md` = all 19 per-page docs concatenated
  verbatim under headings + table of contents.
- Keep `README.md` at root as master index; keep `scripts/cap.py` + `routes.json`.

### Phase 3 — Reports
- **Executive Report** (Part A): exec summary, architecture/features, UX, security/compliance,
  use cases, roadmap, support, cross-doc analysis, capture-status, conversation log.
- **Due Diligence** (Part B): regulatory (PPB P0940 for mydawa), security (OTP-only auth, auth-gating,
  SIM-swap trade-off), privacy (special-category health data), operational resilience, a **confirmed
  data-quality defect** (11/26 dup login shots), a findings register (F1–F14), recommendations, and a
  **LIVE pass** section (robots.txt disclosure, `/account`→404 correction, pending probes).
- **Merge** both into one file `DueDiligenceMyDawa.md`. Delete the separate source files afterward.
- Mark every non-evidenced topic **[Not documented / Cannot assess]** — do NOT invent.

---

## Key Findings (mydawa-specific, for reuse)
- PPB-authorized pharmacy, health-safety code **P0940**.
- Auth = **phone + SMS OTP only** (no password, no CAPTCHA). `/mycart` → `/login?ReturnUrl=…`.
- Catalogue: **13,213 products**; **6,500+ brands**; 15 categories; 40+ conditions.
- Checkout = 3-step indicator (Cart Summary → Delivery Details → Payment).
- `cap.py` route matrix: 15 categories, 40+ conditions, healthcare, info/legal, gated checkout/account.

---

## Verification Gate (do this before EVERY commit)
```
find research/<site> -type f -size 0 | wc -l   # MUST be 0
git add -A && git commit && git push
```
- All deliverable files written via Python, byte-count validated.
- Screenshots deduped + MANIFEST present.
- No real order placed; auth only with consent.

---

## Resume / Failure Handling
- **502 / timeout:** wait (sleep 30–90s), retry once. If repeated, STOP looping (loop-guard trips);
  commit progress, mark sections PENDING, resume when backend recovers.
- **Blank-frame on snapshot after navigation:** re-navigate to a clean frame, then do the full
  type→click→single-snapshot sequence; never type on `about:blank`.
- **Cart not persisting across navigation:** known mydawa quirk — capture via the cart-preview dialog
  or scripted add-then-screenshot in `cap.py`; or accept empty-cart + note the limitation.
- **Pre-compaction prompts lost:** `session_search` may return nothing for earlier turns. Do NOT
  fabricate verbatim early prompts — reconstruct Phase 0 from repo artifacts and ask the user to
  paste verbatim if needed.

---

## Outputs (final repo layout)
```
research/<site>/
├── README.md                     # master index: what we have / how we got here / pending
├── DueDiligenceMyDawa.md         # PART A (exec report) + PART B (DD), merged
├── routes.json                   # crawl map (96 routes)
├── screenshots-all/              # 11 unique PNGs + MANIFEST.md
├── markdown-all/                 # 19 per-page .md + MASTER.md
└── scripts/cap.py                # Playwright full-matrix capture (run off-sandbox)
```
