# claude/ — live-session restore point

Full backup of this pop-os live-boot session's Claude Code state, made 2026-08-25
right before a planned reboot. This machine boots from USB with the root filesystem
as a RAM-backed overlay (`/cow`, capped ~7.7G) — **nothing under `/home` survives a
reboot**, including `~/.claude`. This folder is the persistence layer.

## Contents

- `memory/` — full copy of the auto-memory store (`MEMORY.md` index + topic files:
  user profile, feedback, project state, references). This is what future Claude
  Code sessions read automatically on this machine. **Restore this first.**
- `sessions/anthropic/` — every session transcript run on a standard Anthropic
  model (claude-sonnet-5 etc.), `.jsonl`, plus a `<id>-subagents/` dir alongside
  any session that spawned subagents.
- `sessions/ox-alpha/` — every session run with `--model stealth/ox-alpha`
  (OpenRouter stealth model), same layout.
- `sessions/unclassified/` — sessions with no real model tag recorded (empty/
  aborted sessions, or only `<synthetic>` compaction events — trivial, kept for
  completeness).
- `sessions/index.md` — table of every session: id, bucket, model(s), size,
  first/last timestamp.
- `settings.json` — Claude Code settings (theme, permission mode). Non-secret.

## Deliberately excluded

`~/.claude/.credentials.json`, `~/.claude/backups/*.claude.json.backup.*`, and
`~/.claude/.claude.json` were **not** copied — they hold live OAuth session
tokens for this Claude Code install, not "memory." Restoring account auth after
reboot should go through `claude login` fresh, not a token copied out of a repo.

Two real secrets that had been echoed into transcript content during past
sessions (a Google/YouTube API key from `Fungu/.env`, and a GitHub OAuth
token used in a curl header) were found and **redacted** to
`[REDACTED-...-by-backup]` in the copies here before this was pushed — the
private-repo boundary is not a reason to keep live credentials in cleartext.
**Both of those should be rotated** since they sat in cleartext in local
session logs; ask Claude to help if that hasn't happened yet.

## Restore after reboot

```bash
# 1. memory — do this first, every future session reads it automatically
cp -a claude/memory/. ~/.claude/projects/-home-pop-os/memory/

# 2. session history (optional — for reference/continuity, not required for
#    normal operation)
mkdir -p ~/.claude/projects/-home-pop-os
cp claude/sessions/anthropic/*.jsonl ~/.claude/projects/-home-pop-os/ 2>/dev/null
cp claude/sessions/ox-alpha/*.jsonl ~/.claude/projects/-home-pop-os/ 2>/dev/null
cp claude/sessions/unclassified/*.jsonl ~/.claude/projects/-home-pop-os/ 2>/dev/null
# subagent dirs (<id>-subagents/) need to land at
# ~/.claude/projects/-home-pop-os/<id>/subagents/ — match the id prefix.

# 3. settings
cp claude/settings.json ~/.claude/settings.json

# 4. re-auth (not restorable from this backup, by design)
claude login
```
