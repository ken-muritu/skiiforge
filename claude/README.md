# claude/ — live-session restore point

Full backup of this pop-os live-boot session's Claude Code state. This machine
boots from USB with the root filesystem as a RAM-backed overlay (`/cow`, capped
~7.7G) — **nothing under `/home` survives a reboot**, including `~/.claude`.
This folder is the persistence layer.

First created 2026-08-25; refreshed 2026-09-10 with the full current session
set, memory (previously never actually landed in the repo despite the original
README claiming it — fixed this round), prompt history, and a change to gzip
compression since raw transcripts have grown past what plain `.jsonl` can hold
under GitHub's 100MB per-file limit.

## Contents

- `memory/` — full copy of the auto-memory store (`MEMORY.md` index + topic
  files: user profile, feedback, project state, references). This is what
  future Claude Code sessions read automatically on this machine. **Restore
  this first.**
- `sessions/anthropic/` — every session transcript run on a standard Anthropic
  model (claude-sonnet-5 etc.), gzip-compressed as `<id>.jsonl.gz`.
- `sessions/ox-alpha/` — every session run with the OpenRouter stealth model
  tagged `stealth/ox-alpha`, same layout.
- `sessions/other/` — sessions run on any other non-Anthropic model tag seen
  in the transcript (e.g. `qwen/qwen3.8-max-free`, `z-ai/glm-5.3-flash`) —
  split out from `unclassified` so a real (if unexpected) model tag doesn't
  get lost in the "no model recorded" bucket.
- `sessions/unclassified/` — sessions with no real model tag recorded at all
  (empty/aborted sessions, or only `<synthetic>` compaction events).
- `sessions/<id>-subagents/agent-*.jsonl.gz` + `.meta.json` — subagent
  transcripts for any session that spawned them, alongside the parent
  session's file in the same bucket dir.
- `sessions/<id>-tool-results/*.txt.gz` — large tool-call outputs stored
  out-of-line by Claude Code, alongside the parent session.
- `sessions/<id>.partN-of-M.jsonl.gz` — a handful of sessions compress to
  over ~90MB as a single file (large embedded content, e.g. pasted images)
  and are split by whole line into ordered parts instead. Restore by
  `gunzip`-ing each part **in order** and concatenating.
- `sessions/index.md` — table of every session: id, bucket, model(s),
  compressed size, first/last timestamp, subagent count, source project dir.
- `history.jsonl.gz` — `~/.claude/history.jsonl`, the flat prompt-entry log
  Claude Code keeps across all sessions/projects on this machine.
- `settings.json` — Claude Code settings (theme, permission mode). Non-secret.

## Deliberately excluded

Live auth, unchanged from the original policy:
`~/.claude/.credentials.json`, `~/.claude/backups/*.claude.json.backup.*`, and
`~/.claude.json` were **not** copied — they hold live OAuth session tokens for
this Claude Code install, not "memory." Restore account auth after reboot via
`claude login` fresh, not a token copied out of a repo.

Also excluded this round, all Claude-Code-internal operational state rather
than conversation history, and each a plausible place for a live secret to
sit verbatim outside of transcript text:

- `~/.claude/paste-cache/` — raw clipboard pastes, cached per-paste-event.
  Exactly where a directly-pasted API key/token would land as its own file.
- `~/.claude/shell-snapshots/` and `~/.claude/session-env/` — captured shell
  state/exported environment variables for each session's bash tool.
- `~/.claude/file-history/` — snapshots of arbitrary file contents edited
  during sessions (could carry secrets from whatever file was being edited).
- `~/.claude/cache/`, `~/.claude/downloads/`, `~/.claude/plugins/` — tool
  caches, not history.
- `~/.claude/jobs/`, `~/.claude/tasks/`, `~/.claude/telemetry/`,
  `~/.claude/daemon.log` — background-task/daemon bookkeeping (pids, locks,
  telemetry event counters), not conversation content.

### Secret redaction

Every file above was passed through a redaction pass before being written
here — see `bin/export-claude-history.py` in this repo's `skills/` tree (or
ask Claude to re-run the pipeline; the script lives in session scratch space
by default, not committed here). It does two things:

1. **Exact-match redaction** of live secret values read directly from their
   real local sources at export time (the Modulate API key, the active
   `gh auth token`, anything token-shaped inside `~/.claude/.credentials.json`,
   any `.env` files found under `$HOME`) — without ever printing those values
   anywhere, including in command output.
2. **Pattern redaction** as a safety net for secret shapes regardless of
   whether their exact value was known ahead of time: Google API keys
   (`AIza...`), GitHub OAuth/PAT tokens (`gho_`/`ghp_`/`github_pat_...`),
   Vercel tokens (`vcp_...`), Anthropic keys (`sk-ant-...`), AWS access keys
   (`AKIA...`), Slack tokens (`xox...`), PEM private key blocks, `Bearer <tok>`
   headers, and JSON fields literally named `api_key`/`secret`/`password`/etc.

Matches are replaced with `[REDACTED-by-export]`. This pass has, historically,
found and redacted a real Google/YouTube API key (from `Fungu/.env`, pasted
into chat and re-echoed by later sessions) and a real GitHub OAuth token
(used directly in a `curl -H "Authorization: Bearer ..."` command) sitting in
plaintext across old transcripts — **both should be rotated** if that hasn't
happened yet; see the `credential-rotation-needed` memory for the running
list (it now also covers a Vercel token and two GitHub PATs pasted directly
in-chat on other occasions).

**This is defense in depth, not a guarantee.** Anything pasted into chat in a
shape this pass doesn't recognize could still be sitting in the redacted
copies. Treat this repo as private, not as safe-to-publish.

**2026-09-09 addition:** session `da55f37a-def8-461e-b126-49f3c445c392` (the
Ardena demo-video / adb screen-capture session — see
`skills/adb-app-demo-video/`) was added to `sessions/anthropic/`. The same
YouTube API key surfaced again (re-echoed by a `grep` that went looking for
it) and a phone unlock PIN the user pasted in-chat were both found and
**redacted** the same way before this push. The YouTube key still isn't
rotated as of this addition — it keeps resurfacing across unrelated sessions
because it's never actually been changed at the source (`Fungu/.env`).

## Restore after reboot

```bash
# 1. memory — do this first, every future session reads it automatically
mkdir -p ~/.claude/projects/-home-pop-os/memory
cp -a claude/memory/. ~/.claude/projects/-home-pop-os/memory/

# 2. session history (optional — for reference/continuity, not required for
#    normal operation)
mkdir -p ~/.claude/projects/-home-pop-os
for f in claude/sessions/{anthropic,ox-alpha,other,unclassified}/*.jsonl.gz; do
  [ -e "$f" ] || continue
  gunzip -c "$f" > ~/.claude/projects/-home-pop-os/"$(basename "$f" .jsonl.gz)".jsonl
done
# multi-part sessions: concatenate gunzipped parts in order first, e.g.
#   for id in $(ls claude/sessions/*/*.part1-of-*.jsonl.gz); do : ; done
#   (see sessions/index.md for which ids are split, and into how many parts)

# subagent dirs (<id>-subagents/) need to land at
# ~/.claude/projects/-home-pop-os/<id>/subagents/ — match the id prefix, and
# gunzip each agent-*.jsonl.gz back to agent-*.jsonl.
# Same pattern for <id>-tool-results/ -> .../<id>/tool-results/.

# 3. prompt history + settings
gunzip -c claude/history.jsonl.gz > ~/.claude/history.jsonl
cp claude/settings.json ~/.claude/settings.json

# 4. re-auth (not restorable from this backup, by design)
claude login
```
