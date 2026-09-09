---
name: project-foveo
description: "Foveo gaze-reading extension (Chrome + Firefox) — github.com/ken-muritu/foveo (private); WebGazer pinned to 2.0.1 because current build's tfhub.dev model URLs are dead; Firefox port done 2026-08-28, needs one manual Load-Temporary-Add-on click to verify"
metadata: 
  node_type: memory
  type: project
  originSessionId: a69a6545-6fea-41d5-91f1-ef0780594d91
  modified: 2026-08-28T06:48:57.559Z
---

**Foveo** — gaze-contingent reading assistant extension (Ken's PRD v0.1). MVP built and pushed to private repo github.com/ken-muritu/foveo on 2026-08-28 (4 commits: scaffold / gaze engine / content script / orchestration). Same day, ported to Firefox (2 more commits: `4af1481` cross-browser API + manifest, `60c1b8a` README) — Chrome Web Store needs a $5 fee Ken doesn't have right now, AMO is free.

**Why:** Ken pasted the full PRD and said to validate it, build the MVP, and push — no approval needed. Firefox port was requested the same way (session ran out of OpenRouter credits mid-research; a peer session read the dead session's transcript directly off disk to recover full context, then finished the port under the same standing no-approval-needed instruction for this repo).

**Key facts not derivable from a quick glance:**
- **WebGazer pinned to 2.0.1** (vendored, 2.3 MB): the current 3.5.x build's TFFaceMesh weights hard-code tfhub.dev URLs, which 404 since tfhub's sunset (upstream issue brownhci/WebGazer#314 open). 2.0.1 bundles tracking.js in-file → zero runtime network. Full rationale in repo `docs/VALIDATION.md` + `src/vendor/README.md`.
- Architecture: dedicated engine *window* owns the camera (MV3 popups can't); gaze relays engine → service worker → content script over kept ports; screen-space transform via window.screenLeft/screenTop on both sides.
- **Firefox port:** `manifest.json` now carries both `background.service_worker` (Chrome) and `background.scripts` (Firefox event page) — this pair makes Chrome <121 refuse to load the manifest, so `minimum_chrome_version` was bumped 116→121 to match. Added `browser_specific_settings.gecko` (id `foveo@ken-muritu.dev`, `strict_min_version: 109.0`, `data_collection_permissions.required: ["none"]` — correct since all processing stays on-device). All five files touching `chrome.*` (service-worker.js, popup.js, content.js, gaze-engine.js, calibration.js) now alias `const api = typeof browser !== 'undefined' ? browser : chrome` and call through `api.*` — no polyfill library needed since Firefox's `browser.*` is promise-native and Chrome 116+ already resolves promises without a callback.
- **Status:** code complete, never run in either browser — no webcam dogfood yet (that's Ken's Phase 3). No local node, no Playwright/Selenium/geckodriver in this environment, so verification was static (JSON validation, syntax-preserving `chrome.`→`api.` sed, WebSearched the Chrome-121 background-key gotcha before it shipped) — not an actual browser load. One manual step remains: Firefox is already open to `about:debugging#/runtime/this-firefox` on this session's display — click **Load Temporary Add-on** and select `/home/pop-os/foveo/manifest.json` to confirm it loads clean.
- **Open items:** LICENSE file deliberately absent (vendored WebGazer is GPLv3 — combined-work question left to Ken); AMO submission itself not yet done (just made loadable); PRD §9 roadmap next = MediaPipe backend swap (seam in src/engine/backend.js), auto-scroll, store packaging for both.
- Local copy /home/pop-os/foveo lives on the RAM-backed live-boot disk — the GitHub remote is the durable artifact. See [[user_environment]].
