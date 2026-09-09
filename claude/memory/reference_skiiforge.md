---
name: reference-skiiforge
description: GitHub repo ken-muritu/skiiforge holds reusable Claude skills and research docs produced in this environment
metadata: 
  node_type: memory
  type: reference
  originSessionId: a65b2d12-80c8-4cb9-8dcc-91f66f426c64
  modified: 2026-08-26T12:06:18.362Z
---

`https://github.com/ken-muritu/skiiforge` is where durable outputs get pushed, since the local machine is an ephemeral live-boot session ([[user-environment]]).

- `skills/audio-series-transcription-compilation` — a skill encoding the full audio pipeline: compress each source to ONE complete mono mp3 first, check it against BOTH the 100MB size cap AND an undocumented ~2hr Modulate duration cap (found 2026-08-26), and only split (into the minimum part count needed, not fixed 29-min chunks) if that single file still doesn't clear both → transcribe via Modulate API → consolidate only if split → compile into a teaching doc → **verify** (added 2026-08-20: cross-checks any scripture/fact reference the speaker cites, keeps what the speaker actually said but supplies the correct/intended verse alongside it, per user instruction not to silently alter misquotes). `bin/prepare-audio.sh` (added 2026-08-26) automates the compress→check→split-only-as-fallback logic — see [[feedback-audio-pipeline-no-default-split]].
- `research/` — due-diligence reports, e.g. `caspahub-due-diligence-report.md` (three passes as of 2026-08-21: initial verification, an independent second pass, and a third pass verifying a Tom-facing DRB against full commit history + documenting the same-day pharmacy-dead-code cleanup — see [[project-caspahub]]), plus earlier ones referenced as "spacefs-com-profile, mydawa, etc." The user re-feeds this doc to a separate Claude Chat session to draft the actual Tom-facing DRB — keep it technically accurate and complete, but the doc itself now carries an explicit instruction not to name the removed dead-code vertical in anything Tom-facing.
- `claude/` — added 2026-08-25, the live-session restore point: `claude/memory/` mirrors this exact memory store, `claude/sessions/{anthropic,ox-alpha,unclassified}/` holds every session transcript to date bucketed by model, `claude/README.md` has restore steps. Pushed right before a planned reboot since `/home` is on this machine's RAM-backed overlay and does not survive one. Excludes live auth (`.credentials.json`, `.claude.json` backups) by design — re-auth via `claude login` after restore, not from the repo. See [[project-credential-rotation-needed]].

**Why:** Future sessions on a fresh live-boot machine should clone this repo to recover skills/scripts rather than rebuilding them from scratch, and should restore `claude/memory/` first thing to regain full context.

**How to apply:** When the user asks to set up audio transcription, teaching-doc compilation, or references "the skill we set up," check this repo first before rebuilding. After a fresh live-boot with no local `~/.claude/projects/-home-pop-os/memory/`, proactively suggest pulling `claude/memory/` from this repo before starting work.
