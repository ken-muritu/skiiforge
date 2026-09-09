# claude-history-export

Refreshes `claude/` in this repo (the live-session restore point — see
`claude/README.md`) from the current `~/.claude` state: memory, every session
transcript (bucketed by model into `sessions/{anthropic,ox-alpha,other,
unclassified}/`, including subagent transcripts and out-of-line tool-result
files), and the flat prompt-history log — with secrets redacted before
anything is written.

## Use it when

The user asks to push/refresh Claude logs, session history, or memory to
`skiiforge/claude/` — this script is the whole pipeline, don't hand-roll it
again from scratch.

## Run it

```bash
export SKIIFORGE_REPO=~/skiiforge   # or wherever you cloned this repo
python3 skills/claude-history-export/bin/export-claude-history.py
```

Wipes and rebuilds `claude/sessions/*`, `claude/memory/`, `claude/
history.jsonl.gz`, and `claude/settings.json` under `$SKIIFORGE_REPO`
from the live `~/.claude` state. Does **not** touch `claude/README.md` or
git — review the diff, update the README's dated addition if anything
notable turned up (a new secret shape, a new model tag bucketed as `other`,
a session that had to be split into parts), then commit/push yourself.

## What it does *not* touch

By design — see the "Deliberately excluded" section of `claude/README.md`
for the reasoning: `~/.claude/.credentials.json`, `~/.claude.json` and its
backups, `paste-cache/`, `shell-snapshots/`, `session-env/`,
`file-history/`, `cache/`, `downloads/`, `plugins/`, `jobs/`, `tasks/`,
`telemetry/`, `daemon.log`.

## Before pushing

- Re-run the secret-scan spot check (grep the produced `.gz` files for the
  known token-shape regexes) — the script's own redaction pass is defense in
  depth, not a guarantee, especially against secret shapes it doesn't know.
- If another Claude Code session on this machine might be using the shared
  `~/skiiforge` checkout concurrently, clone to an isolated path instead
  (`SKIIFORGE_REPO=/tmp/.../scratchpad/skiiforge`) so you don't race its
  uncommitted work, then push from there.
- GitHub's 100MB per-file limit is real — the script auto-splits any session
  whose gzip exceeds ~90MB into `<id>.partN-of-M.jsonl.gz`. If a future
  session is somehow *still* too big even split reasonably, raise the part
  count or reconsider what's being embedded in that transcript (e.g. huge
  pasted images) before forcing it in.
