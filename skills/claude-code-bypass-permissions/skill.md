# claude-code-bypass-permissions

How this machine's Claude Code install ended up running every tool call —
including destructive ones — without a confirmation prompt, exactly which
settings fields control that, and how to check, change, or revert it.

## Use it when

The user asks how "bypass mode" / "dangerous mode" / running Claude Code
without approval prompts works or is configured, wants to replicate this
setup elsewhere, wants to lock it down again, or is debugging why a
destructive command ran (or didn't) without being asked.

## What bypass permissions mode actually is

Claude Code's default behavior is to pause before most tool calls (editing
a file, running a shell command, etc.) and ask the human to approve it.
`permissions.defaultMode` controls that gate. Valid values:

- `"default"` (alias: `"manual"`) — the normal ask-every-time behavior.
- `"acceptEdits"` — auto-approves file edits, still asks for other things.
- `"plan"` — plan-mode research only, no mutating actions.
- `"dontAsk"` — a narrower auto-approval mode.
- `"auto"` — routes tool calls through a classifier (`autoMode` settings)
  that allows/soft-blocks/hard-blocks based on rules, rather than a flat
  allow-everything.
- `"bypassPermissions"` — skips the approval gate entirely, for every tool,
  including ones that delete files, force-push, or run arbitrary shell
  commands. **This is what's active on this machine.**

## How it's enabled here

Two things had to happen, both are one-time, both live in the **global**
settings file `~/.claude/settings.json` (applies to every project this user
account runs Claude Code from, not just one repo):

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "skipDangerousModePermissionPrompt": true
}
```

1. **`permissions.defaultMode: "bypassPermissions"`** — sets the actual
   mode described above.
2. **`skipDangerousModePermissionPrompt: true`** (top-level, not nested
   under `permissions`) — bypass mode normally shows a one-time in-session
   warning dialog the first time it activates ("you're about to let Claude
   run everything unattended, are you sure"). This flag is the literal
   record that the user has already accepted that dialog, so it doesn't
   show again. Without this flag set, `defaultMode: bypassPermissions`
   alone would still work, but you'd hit that confirmation dialog once per
   fresh acceptance.

Other ways to get the same mode, if you don't want it permanent/global:

- **Per-launch flag**: `claude --permission-mode bypassPermissions` (or
  the older `--dangerously-skip-permissions`) — applies to that one
  invocation only, doesn't touch any settings file.
- **In-session toggle**: `Shift+Tab` cycles permission modes live, or run
  `/permissions` — also session-scoped, doesn't persist.

A change to the settings file takes effect on the **next new session** —
it is not retroactive to a session already running.

## Precedence across settings files

Settings load in this order, later overrides earlier, per-field (not
whole-file replacement):

1. `~/.claude/settings.json` — **global/user**, personal, applies to every
   project. (This is the only file that sets it on this machine.)
2. `.claude/settings.json` — **project**, meant to be committed to the
   repo, applies to everyone working in that project.
3. `.claude/settings.local.json` — **local**, personal override for one
   project, meant to be gitignored.

So a project you're in could have its own `.claude/settings.json` or
`settings.local.json` with a *different* `permissions.defaultMode` (e.g.
`"default"`), and that would win over this global bypass setting for that
project only. Check for those before assuming bypass is active everywhere:

```bash
cat ~/.claude/settings.json 2>/dev/null | jq .permissions
cat ./.claude/settings.json 2>/dev/null | jq .permissions
cat ./.claude/settings.local.json 2>/dev/null | jq .permissions
```

On this machine, as of this writing, only the global file sets anything —
no project/local override exists anywhere it's been used from.

## Related fields worth knowing about (not currently set here)

- **`permissions.disableBypassPermissionsMode: "disable"`** — an
  admin/managed-settings killswitch. If an org's managed policy sets this,
  bypass mode can't be enabled at all, no matter what the user or project
  settings say. Only meaningful in enterprise/MDM-managed deployments.
- **`permissions.blockReadsOutsideWorkingDirectories: true`** — if set
  true from *any* settings source, file-tool reads outside the working
  directory are refused in every mode, bypass included. True from any
  source wins (can't be re-opened by a lower-precedence file).
- **`permissions.additionalDirectories: [...]`** — extends the permission
  scope to extra directories beyond the working directory.
- **`skipAutoPermissionPrompt`** — the sibling one-time-acceptance flag
  for `"auto"` mode specifically (a narrower, classifier-based mode, not
  the same as full bypass).
- Enterprise **managed settings** (server-managed policy, MDM,
  `managed-settings.json`) sit above all of the above and can lock or
  override permission behavior outright — not relevant on a personal,
  unmanaged install like this one, but worth knowing this isn't the
  absolute ceiling in a corporate deployment.

## The important caveat

Bypass mode only removes the **harness's** interactive confirmation gate.
It does not change the model's own judgment about what's safe to do
unattended. Claude Code's system prompt still instructs the model to pause
and confirm before genuinely risky, hard-to-reverse actions (force pushes,
deleting uncommitted work, wiping a drive, sending things externally) even
when nothing in settings.json would stop it from just doing them. In
practice on this machine that's meant: destructive shell commands run
without a permission prompt, but the model still asks explicit yes/no
questions before things like formatting a USB drive or deleting a
directory it didn't create — that's the model choosing to ask, not the
harness making it.

## Checking / reverting

Check current mode:
```bash
cat ~/.claude/settings.json | jq .
```

Turn bypass off again (takes effect next new session):
```bash
jq '.permissions.defaultMode = "default"' ~/.claude/settings.json > /tmp/s.json \
  && mv /tmp/s.json ~/.claude/settings.json
```
or just delete the `permissions.defaultMode` key entirely to fall back to
the harness's own default.

## Origin

First configured on this machine in the very first Claude Code session
ever run here, at the user's explicit request to "run all commands without
waiting for my approval." Every session since has inherited it via the
global settings file.
