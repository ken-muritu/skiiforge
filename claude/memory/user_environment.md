---
name: user-environment
description: "Live-boot ephemeral Pop!_OS (internal SSD SATA link fault is WHY), git id ken-muritu; Hermes agent removed 2026-08-28"
metadata: 
  node_type: memory
  type: user
  originSessionId: cdab73b8-09e6-47dd-bceb-86f1981dfe77
  modified: 2026-08-27T21:07:59.258Z
---

Runs Pop!_OS from a live USB (ephemeral — everything not pushed to git dies on reboot) because their internal 238GB SSD's SATA link drops at 6.0 Gbps minutes into any session; SMART is clean (0 reallocated, 0 CRC, PASSED) so the drive itself is fine — it's a marginal physical connection (connector seating), stable at the kernel's 3.0 Gbps fallback. Software mitigation exists: `libata.force=3.0` boot param. Real fix: reseat/replace connector.

Other facts:
- Git identity: ken-muritu / kenhopkins.ke@gmail.com
- System theme is DARK — plain `firefox --headless --screenshot` follows OS prefers-color-scheme, so system-themed sites capture dark; for light-mode captures use Playwright with `page.emulateMedia({colorScheme:'light'})` (chromium downloaded to `~/.cache/ms-playwright`; the npm setup lives in a jobs tmp dir, reinstall per session)
- Hermes agent (Nous Research, `~/.hermes`) was REMOVED completely on 2026-08-28 at the user's explicit request: ~/.hermes (798M), the hermes-gateway.service user unit, and all guard-script references (disk-cleanup's 6 hermes steps + gateway check + hermes_note, dirty-work-nudge prune entry, blackout-guard comment, dead clean_uv step since uv lived inside ~/.hermes). Small state backup (config.yaml, SOUL.md, auth.json, state.db*, skills, cron) saved to ~/Downloads/hermes-state-backup-2026-08-28.tar.gz — it sits on RAM-backed / and dies at reboot unless the user moves it. Do not reinstall hermes without asking.
- Their boot flash was previously discovered counterfeit (125GB advertised, ~32GB real, f3probe-verified "limbo" type); a working live USB was rebuilt onto the verified-good region
- Guard suite lives in [[skiiforge-repo]] at `skills/pop-os-live-session-hardening/` (disk-cleanup, battery-guard, lid-guard, guards-doctor, dirty-work-nudge, guarded-install); install.sh reproduces everything on a fresh session

**Why:** every session starts fresh and can die anytime; work must be pushed to survive.
**How to apply:** never reboot/restart the session without asking; keep heavy writes off `/`; push finished work promptly; treat uncommitted local changes as at-risk ([[caspahub-due-diligence]] style pushes only after user validates).
