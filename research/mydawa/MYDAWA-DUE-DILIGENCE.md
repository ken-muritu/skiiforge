# MYDAWA — Due Diligence Assessment

> **Method & scope.** This due-diligence assessment is derived *solely* from the captured research
> archive of https://mydawa.com/ (research/mydawa/, 2026-07-25): the master combined document
> (`markdown-all/MASTER.md`), per-page docs, `screenshots-all/MANIFEST.md`, and `routes.json`.
> It follows the same evidence discipline as the companion Executive Report: **no external knowledge,
> no invented findings**. Where a due-diligence domain cannot be assessed from a front-end-only
> capture, it is marked **[Cannot assess — not in sources]** with the *reason* (the data simply is
> not present in the archive). This document is an *archival* due diligence, not a penetration test
> or a review of MYDAWA's private infrastructure.
>
> **Archive limitations that bound this assessment:**
> - Capture was **desktop-only at ~1512 px**; no mobile/tablet behaviour was verifiable.
> - The backend, source code, APIs, infrastructure, and internal policies were **not** accessible.
> - Authentication was crossed only with owner consent and only up to the cart/checkout boundary;
>   no order was placed and no non-public data was accessed.
> - Some intended page captures were lost to browser outages (see §6, Data-Quality Risk).

---

## 1. Executive Due-Diligence Summary

MYDAWA presents as a regulated, PPB-authorized Kenyan online pharmacy with an integrated digital-
health layer (telehealth, chronic-care "Mzima", at-home services). From the *observable* surface, the
platform's consumer trust signals are reasonable (authorization code P0940, low-friction OTP auth,
auth-gated commerce). However, a rigorous DD cannot clear the platform on security, compliance, or
operational resilience because **the overwhelming majority of DD-relevant evidence (backend security,
data protection, infrastructure, personnel/access controls, financials, contracts) is outside this
archive**. The findings below separate *observed facts* from *assessment gaps*.

**Top-line:**
- ✅ Regulated posture is signalled (PPB Authorized Pharmacy, code P0940).
- ⚠️ Authentication relies on phone+OTP with **no password and no CAPTCHA observed** — a convenience/
  security trade-off whose server-side strength is unverifiable here.
- ⚠️ Commerce and health data are auth-gated, but the *enforcement mechanism, session management, and
  authorization model* are not assessable from the front end.
- ⚠️ Telehealth + prescription handling + chronic-care imply **sensitive health data (PHI)** processing;
  the legal basis, consent, and safeguards are **[Cannot assess]**.
- ⚠️ Operational resilience of the *capture path* was poor (repeated 502s) — this reflects the research
  tooling, not necessarily MYDAWA; still, no public status/observability surface was observed.
- ❌ No evidence available to assess: encryption at rest/in transit (beyond HTTPS assumption), secrets
  management, audit logging, backups/DR, third-party/subprocessor risk, financials, or litigation.

---

## 2. Regulatory & Compliance Posture

### 2.1 What is documented
- **PPB (Pharmacy and Poisons Board of Kenya)** — MYDAWA presents as an *"Authorized Pharmacy"* with
  health-safety code **P0940** (footer + vision-confirmed). This is the single strongest compliance
  signal in the archive.
- **Pharmacovigilance** is surfaced as a footer HELP CENTER link — indicating medicines-safety
  reporting is at least acknowledged as a function.
- **Legal/governance pages** exist as links: Terms & Conditions, Privacy Cookies, Disclaimer,
  Copyright, Quality Statement, Return Policy, Shipping Policy, Contact Us, FAQs. Their *contents* are
  **[Cannot assess — not fetched]**.

### 2.2 What cannot be assessed
- Data-protection compliance (e.g., Kenya's Data Protection Act 2019 / ODPC registration, lawful basis
  for processing health data, data-subject rights, retention) — **[Cannot assess]**.
- Medicine-dispensing legality per product class (prescription-only vs OTC enforcement online) —
  **[Cannot assess]** (no observation of prescription-validation workflow beyond a "Upload Prescription"
  CTA and a telehealth "Prescription … validate/renew" service line).
- Subprocessor / cross-border transfer agreements — **[Cannot assess]**.
- Certifications (ISO, SOC 2, PCI DSS for payments) — **[Cannot assess]**.

### 2.3 Compliance risk rating: **MEDIUM (inconclusive)**
Signal present (PPB) but insufficient evidence to confirm end-to-end regulatory adherence, especially
for health-data processing and prescription governance.

---

## 3. Security Assessment (observable surface)

### 3.1 Authentication & session
- **Mechanism observed:** phone number → "Send code" → **SMS OTP**; `/login` and `/register` are
  near-identical OTP-mobile entry screens. **No password field, no CAPTCHA** observed.
- **Implication (stated as a trade-off, not a confirmed vulnerability):** account takeover exposure is
  tied to **SIM-swap / SMS-interception** risk inherent to OTP-only auth. Whether MYDAWA implements
  binding, rate-limiting, OTP expiry, or step-up for high-risk actions is **[Cannot assess]**.
- **Auth-gating:** `/mycart` returns `302 → /login?ReturnUrl=%2Fmycart`, confirming server-side
  enforcement of the gate (good signal). How sessions are issued/stored/expired is **[Cannot assess]**.

### 3.2 Authorization & data exposure
- Cart/checkout/account are gated. During capture, an authenticated session revealed a *saved delivery
  address* ("Kennedy Muritu") and personalized "Offers For You" — i.e., authenticated state changes
  UI/data. **No evidence of broken access control** was observed, but exhaustive IDOR/horizontal-
  privilege testing was **not performed** (and is out of scope for a front-end archive).

### 3.3 Transport & infrastructure security
- **TLS/HTTPS:** the site is served over HTTPS (implied by capture success and standard practice) but
  **certificate posture, HSTS, CSP, and headers are [Cannot assess]** from the archive.
- **Encryption at rest, key management, secrets management, WAF, DDoS protection:** **[Cannot assess]**.
- **API security (auth, rate limiting, object-level authz):** **[Cannot assess]** — no API was tested.

### 3.4 Security risk rating: **MEDIUM (inconclusive)**
OTP-only auth is a known weaker pattern; absent server-side controls we cannot rate it lower. No
*confirmed* vulnerability, but material assurance gaps remain.

---

## 4. Privacy & Data-Protection Assessment

- **Data types implied:** identity (phone), contact/delivery address, order/prescription history,
  health conditions (chronic-care enrollment, telehealth), possibly payment instruments.
- **Consent & lawful basis:** the login screen references "Terms and Privacy Policy"; substantive
  consent mechanics are **[Cannot assess]**.
- **Sensitive health data:** telehealth, Mzima, family-planning, PrEP/PEP, and prescription upload all
  process **special-category health data** under typical regimes. The *safeguards, minimization,
  retention, and sharing* for this are **[Cannot assess]**.
- **Cookie/tracking:** "Privacy Cookies" link present; actual cookie/pixel behaviour **[Cannot assess]**.

**Privacy risk rating: MEDIUM-HIGH (inconclusive)** — high-sensitivity data is clearly handled, but the
controls protecting it are entirely outside the archive.

---

## 5. Operational & Business Resilience

- **Availability (of capture path):** repeated **502 outages** of the managed browser backend during
  capture. *Caveat:* this measures the research tooling, not provably MYDAWA's uptime. Still, no public
  status page or observability surface was observed.
- **Business model signals (from UI):** commerce margins + delivery; flash-sale/discount engine;
  voucher incentives (400 KES off, min spend KSh 2,000, 15-day); telehealth (free consult used as
  acquisition/retention); Mzima as a recurring-care/membership-style wedge. Financials, unit economics,
  funding, and churn are **[Cannot assess]**.
- **Supply/fulfilment:** "Standard Delivery: 4–6 hours", "FREE DELIVERY … NAIROBI AND MOMBASA" — implies
  a local fulfilment/pharmacy network. Capacity, SLAs, and partner pharmacies are **[Cannot assess]**.
- **Key-person / vendor concentration:** **[Cannot assess]**.

**Operational risk rating: MEDIUM (inconclusive)** — plausible model, but resilience and economics
unverifiable from the archive.

---

## 6. Data-Quality & Methodology Risk (of THIS archive)

This is a meta-risk about the evidence base itself, and it is the *one* area where we have hard,
confirmed findings:

- **Duplicate-screenshot defect (confirmed):** of **26** PNGs captured, only **11 were unique**;
  **11 were byte-identical copies of the logged-out `/login` page**, saved when the flaky browser
  reset to `/login` during 502/outage windows and overwrote intended captures (offers, register,
  search-results, search-no-results, cart-gate, auth-gate). Source: `screenshots-all/MANIFEST.md`.
  → *Impact on DD:* any conclusion relying on those "pages" would be unsound; they are excluded.
- **Coverage gaps (confirmed/candidate):** populated cart, Delivery/Payment steps, account
  dashboard/orders/prescriptions, and most healthcare/info/legal pages were **not captured** (outages
  + cart-not-persisting quirk). → *Impact:* DD cannot rely on those surfaces.
- **Front-end-only scope:** by construction, this archive cannot speak to backend/security/compliance
  substance. → *Impact:* all §2–§5 "Cannot assess" items are limitations of evidence, not clean bills.

**Methodology risk rating: MEDIUM** — the archive is internally honest (MANIFEST + capture-status
disclose these gaps) but is narrow; DD conclusions must be read as *provisional pending primary evidence*.

---

## 7. Findings Register

| # | Area | Finding | Severity | Evidence | Status |
|---|------|---------|----------|----------|--------|
| F1 | Compliance | PPB-authorized pharmacy, code P0940 | Positive | footer + vision | Confirmed |
| F2 | Auth | Phone+OTP only; no password/CAPTCHA observed | Medium | /login,/register | Confirmed (surface) |
| F3 | Auth | Server-side OTP controls (expiry/rate/step-up) | Unknown | — | Cannot assess |
| F4 | Access ctrl | /mycart server-redirects to /login | Positive | observed 302 | Confirmed |
| F5 | Privacy | Processes special-category health data | High (sensitivity) | telehealth/Mzima/PrEP/PEP | Confirmed (scope) |
| F6 | Privacy | Safeguards/lawful basis for health data | Unknown | — | Cannot assess |
| F7 | Security | TLS/headers/CSP/cert posture | Unknown | — | Cannot assess |
| F8 | Security | API/authz/rate-limit testing | Not performed | — | Out of scope |
| F9 | Resilience | Capture-path 502 outages | Low (tooling) | session log | Confirmed |
| F10 | Data quality | 11/26 PNGs duplicate login page | Medium (evidence) | MANIFEST | Confirmed |
| F11 | Coverage | Cart/checkout/account/most pages uncaptured | Medium | capture-status | Confirmed |
| F12 | Compliance | Pharmacovigilance function referenced | Positive (signal) | footer link | Confirmed (signal) |

Severity key: Positive = strength; Medium/High = risk or sensitivity requiring primary evidence to
resolve; Unknown/Cannot assess = not reachable from this archive.

---

## 8. Recommendations (to close the gaps)

These are *evidence-gathering* recommendations, not assertions of deficiency:

1. **Obtain MYDAWA's primary compliance artifacts:** PPB licence, Data Protection Act registration,
   Privacy Policy + Terms (full text), Pharmacovigilance SOP.
2. **Commission a backend/infra review:** TLS config, CSP, secrets management, audit logging, backups/DR,
   WAF/DDoS — outside any front-end archive.
3. **Assess auth robustness:** OTP expiry/rate-limiting, SIM-swap mitigations, step-up for prescription/
   payment actions, session lifetime.
4. **Map health-data flows:** lawful basis, consent, minimization, retention, subprocessor contracts
   (esp. telehealth, Mzima, PrEP/PEP, prescription upload).
5. **Re-run the capture to fill §6 gaps:** use `scripts/cap.py` on a host with egress + Playwright
   (and a logged-in `MYDAWA_STATE`) to capture populated cart, Delivery/Payment, account pages, and the
   full category/condition/brand/healthcare/info crawl — including tablet/mobile viewports.
6. **Re-capture the clobbered pages** (offers/register/search/cart-gate) lost to the duplicate-login bug.

---

## 9. Conclusion

From the *observable* surface, MYDAWA is a credibly-regulated (PPB P0940), convenience-oriented
pharmacy + digital-health platform with sensible auth-gating and a coherent care portfolio. **However,
this due-diligence pass is necessarily provisional:** the archive is front-end-only and desktop-only,
several commerce/account/healthcare surfaces were not captured, and core security/compliance/resilience
evidence is absent. No *confirmed* vulnerability or compliance failure was found, but **material
assurance gaps remain unresolved** and should be closed with primary evidence (items in §8) before any
reliance (investment, partnership, or integration) is placed on this assessment.

*Prepared 2026-07-25 from research/mydawa/ captured sources. Companion document:
`MYDAWA-EXECUTIVE-REPORT.md`. All findings are grounded in the archive; "[Cannot assess]" denotes
evidence gaps, not presumed deficiencies.*
