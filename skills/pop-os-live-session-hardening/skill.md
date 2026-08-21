# Pop!_OS Live-Session Hardening + Dev CLI Bootstrap Skill

## Purpose

Turn a fresh Pop!_OS session (live/USB or installed) into a session that won't quietly run
itself out of disk, won't let the battery die unnoticed, won't suspend and drop network/agents
the instant the lid closes unless you choose that, gives you a real clipboard manager, and has
GitHub/Vercel/Turso CLIs installed and authenticated — reproducibly, from one folder, without
re-deriving the gotchas below each time.

This skill encodes the *method and the hard-won pitfalls* from a real session that: hardened a
7.7G live-session overlay against filling up, installed a large third-party agent (Hermes,
Nous Research) on that same tiny disk without crashing the session, and drove three separate
device-code/OAuth login flows through a live browser non-interactively.

---

## When to Use

Invoke when a request combines any of:
- "set up a script that watches disk usage / cleans cache automatically."
- "alert me before the battery dies" / "battery guard" / "low battery alarm."
- "closing the lid shouldn't suspend / disconnect wifi / kill my agents" / "keep running with
  the lid closed" / "lid switch behavior."
- "clipboard manager with history" on a fresh Linux desktop.
- "install and log into gh/vercel/turso (or similar) CLIs, open the browser for me."
- Preparing a **new** Pop!_OS (or similar apt/systemd) session to match one already configured.

Do NOT use to:
- Manage a headless server with no session D-Bus / no display (notify-send and the battery
  dialog need a graphical session).
- Auto-approve OAuth/device-code logins on the user's behalf — that step is always manual,
  by design (see Environment Reality).
- Justify unattended `rm -rf` on anything outside explicitly-named cache/log/tmp paths.

---

## Environment Reality (learned the hard way)

| Constraint | Detail | Consequence |
|---|---|---|
| **Live-session root is an overlay, not "the disk"** | `df -h /` on a Pop!_OS live session shows `/cow` (overlay, `lowerdir=squashfs`), often **~7.7G total** regardless of the USB/host disk size. | Size every threshold off the *actual* `df -h /`, never off assumed hardware capacity. A 65% alert threshold can mean "1.6GB free," not "plenty." |
| **COSMIC desktop ships without `notify-send`** | Pop!_OS 24.04's new COSMIC DE doesn't preinstall `libnotify-bin` or `zenity`. | Install both explicitly; don't assume desktop notifications work out of the box just because a notification daemon is running. |
| **Passwordless sudo is common but not guaranteed** | Live sessions often have `sudo -n true` succeed with no password. | Gate every root-owned cleanup step behind a `sudo -n true` check so the script degrades to user-space-only cleanup instead of hanging on a password prompt in an unattended run. |
| **`systemd --user` timers >> root cron for GUI feedback** | A `systemd --user` service inherits the logged-in session's D-Bus/env automatically. | `notify-send` just works from a `--user` timer with zero plumbing; a root crontab job would need `DISPLAY`/`DBUS_SESSION_BUS_ADDRESS` hacks and often still fails. |
| **`cmd &` inside a backgrounded tool call double-detaches** | Launching `nohup long_running_cmd & ; echo done` as a single "run in background" call reports "completed" the instant the wrapper's `echo` runs — not when `long_running_cmd` actually finishes. | For anything you truly need to block on, capture the real child PID and poll/wait on *that*, or avoid the extra trailing `&` inside an already-backgrounded call. |
| **A big install on a small overlay can crash the session** | Installing a Python/Node-based agent (venv + node_modules + a bundled Node runtime) pushed usage from 58% to 84% in about 7 minutes. | Attach a disk-space watchdog *during* any large install: poll free space, hard-kill the installer if it drops under a floor (we used 400MB) — before the OS itself starts failing writes. |
| **A large install changes your "normal" baseline permanently** | After installing Hermes, resting usage sat at 79–85% even fully cleaned — most of it was legitimate installed software, not garbage. | Re-tune the alert threshold *after* a big install (we moved 65% → 85%) instead of leaving a threshold that now fires on every single cycle. |
| **`gh auth login --web` needs a stdin newline when driven non-interactively** | It prints a one-time code + the fixed URL `https://github.com/login/device`, then waits on a "Press Enter" prompt before polling. | `printf '\n' | gh auth login --hostname github.com --git-protocol https --web` unblocks it; then open the printed URL yourself and copy the printed code to the clipboard. |
| **Vercel CLI auto-detects non-interactive/agent shells** | `vercel login --help` documents `--non-interactive`, "default when an agent is detected." | Just run `vercel login` — it skips the arrow-key provider menu and prints a device-code URL directly (`vercel.com/oauth/device?user_code=...`). |
| **Turso's `--headless` flag does NOT poll** | `turso auth login --headless` prints a URL and **exits immediately**; it expects a manually-copied token pasted elsewhere. | If a real browser is available in-session, use plain `turso auth login` instead — it opens the browser itself and blocks on a local callback (`localhost:<port>`) until you approve, no code to copy. |
| **CopyQ's history-size config key is lowercase** | `copyq config maxItems 5000` fails with `Invalid option`; the real key is `maxitems`. | `copyq config maxitems 5000`. |
| **Lid-close = suspend is a `systemd-logind` action, not a hard OS rule** | Default is `HandleLidSwitch=suspend` (compiled-in; usually commented-out, not present, in `/etc/systemd/logind.conf`). Suspend is what actually kills wifi/bluetooth/agents on lid close — the radios power off as part of suspending, not because of the lid itself. | Don't edit `/etc/systemd/logind.conf` to "fix" this — that's global, permanent, needs root + a `systemd-logind` restart, and removes the choice. Hold a `systemd-inhibit --what=handle-lid-switch --mode=block` lock instead: logind skips its lid action entirely while any such lock is held, and reverts to normal the instant it's released — a true per-use toggle, confirmed via `systemd-inhibit --list`. |
| **Desktop sessions already use this same inhibitor mechanism** | `systemd-inhibit --list` on this COSMIC session shows `Cosmic Session ... handle-power-key ... block` — the DE itself is built on logind inhibitors, not a competing/independent power daemon. | Trust `--what=handle-lid-switch` to be honored the same way on any systemd-logind desktop (GNOME/KDE/COSMIC) — verify once per DE with `systemd-inhibit --list`, don't assume it needs a DE-specific setting instead. |
| **A real panel tray icon is achievable without writing a native DE applet** | Building a custom COSMIC quick-settings entry means writing/compiling a Rust `iced`-based applet — heavy. But `cosmic-applet-status-area --status-notifier-watcher` was already running, meaning any app that speaks the standard `org.kde.StatusNotifierItem` D-Bus protocol shows up in the panel automatically. `yad --notification` (a 554KB apt package) registers as one — confirmed empirically via `busctl --user call org.kde.StatusNotifierWatcher ... RegisteredStatusNotifierItems` before writing any real code around it. | Before assuming a "put a switch on the panel" request needs a custom applet, check `busctl --user list \| grep -i statusnotifier` for a running watcher, then prove a lightweight tray tool registers with it (empirically, via `RegisteredStatusNotifierItems`) before committing to a design. |
| **`yad`'s running tray icon can't have its image/tooltip updated in place from a separate `--command` invocation** | Each menu/click action runs as its own new process; there's no simple IPC back into the already-running icon process from those. | Supervise yad in a small respawn loop that kills and relaunches it (fresh `--image`/`--text`) whenever the underlying state changes — a sub-second flicker is a non-issue for something toggled a few times a day. |

---

## Required Inputs

| Input | How to obtain |
|---|---|
| Target session's `df -h /` output | Run it first, always — determines whether this is a tiny overlay or a normal disk. |
| Desktop environment / session type | `echo $XDG_CURRENT_DESKTOP $XDG_SESSION_TYPE` — informs which notification/audio stack is present. |
| Sudo mode | `sudo -n true` (passwordless) vs interactive vs none — determines which cleanup tier is reachable. |
| Battery presence (for battery-guard) | `ls /sys/class/power_supply/` — skip battery-guard entirely on a desktop/VM with no `BAT*`. |
| Audio stack | `command -v pactl paplay amixer` — battery-guard's volume ramp needs PulseAudio/PipeWire's `pactl`. |
| (For dev CLI bootstrap) GitHub/Vercel/Turso account access | The human must complete each browser approval — this cannot be scripted around. |

---

## Outputs

This folder itself, cloned onto a new machine:
```
skills/pop-os-live-session-hardening/
├── skill.md              (this file)
├── install.sh            (idempotent bootstrap — packages, scripts, systemd units, CopyQ)
├── bin/
│   ├── disk-cleanup.sh     (systemd-timer-driven, every 5 min)
│   ├── battery-guard.sh    (systemd-service-driven, continuous; supports --test <secs>)
│   ├── lid-guard.sh        (CLI: on|off|toggle|status)
│   └── lid-guard-tray.sh   (panel switch: tray icon wrapping lid-guard.sh)
├── systemd/
│   ├── disk-cleanup.service / .timer
│   ├── battery-guard.service
│   ├── lid-guard.service       (enabled — ON by default at every login)
│   └── lid-guard-tray.service  (enabled — tray icon present at every login)
└── autostart/
    └── copyq.desktop
```
Running `install.sh` reproduces: periodic disk cleanup + notification, a battery alarm with
escalating tiers and snooze, a lid-close guard that's **on by default** (with a panel tray
switch to flip it off when you actually want the lid to suspend), and a running CopyQ clipboard
manager with a 5000-item history. The dev-CLI bootstrap (gh/vercel/turso) is documented but
deliberately **not** auto-run by `install.sh`, since it ends in per-account interactive logins.

---

## Method

### 1. Establish the real environment first
- `df -h /`, `mount | grep -E 'overlay|squashfs'` — confirm live vs installed, and real free space.
- `echo $XDG_CURRENT_DESKTOP $XDG_SESSION_TYPE`, `command -v notify-send zenity copyq pactl`.
- `sudo -n true` — record whether root-owned cleanup steps are reachable.
- `ls /sys/class/power_supply/` — confirm a battery exists before installing battery-guard.

### 2. Install baseline packages
`libnotify-bin` (notify-send), `zenity` (dialogs), `copyq` (clipboard manager), `yad` (tray icon
for lid-guard's panel switch) — see `install.sh`.

### 3. Ship the two hardening scripts + systemd units
- `disk-cleanup.sh`: `flock`-guarded, before/after `df` accounting per cleanup step, tiered
  scope (user-space caches → root-owned caches → an emergency deep-clean below a hard KB
  floor), a critical-urgency notification with a **top-5 space consumers** breakdown, and an
  explicit allowlist mentality — every touched path is named in a `clean_*` function; nothing
  ambient gets `rm -rf`'d.
- `battery-guard.sh`: polls `/sys/class/power_supply/{AC,BAT0}` every 15s, three escalating
  tiers (30/15/5%), an alarm-sound loop with rising `pactl` volume, a `zenity` dialog with a
  5-minute snooze, and a `--test <seconds>` self-test mode that fakes "unplugged" for N seconds
  so you can verify sound/volume/dialog without draining a real battery.
- Both run as `systemd --user` units (timer for the periodic one, long-running service with
  `Restart=always` for the continuous one) — never root cron, for the D-Bus/notify-send reason
  in Environment Reality.
- `lid-guard.sh`: a thin on/off/toggle/status CLI around a `lid-guard.service` unit whose entire
  job is to run `systemd-inhibit --what=handle-lid-switch --mode=block sleep infinity` and stay
  alive. Starting the unit acquires the inhibitor (lid close does nothing); stopping it releases
  the inhibitor (lid close suspends normally). **`lid-guard.service` ships enabled — ON is the
  default at every login/boot** (the user explicitly wants "nothing shuts unless I choose to
  sleep," i.e. the inverse of stock logind behavior, not a per-use opt-in).
- `lid-guard-tray.sh`: the panel switch — a `yad --notification` tray icon that registers with
  the desktop's `org.kde.StatusNotifierWatcher` (confirmed live via
  `cosmic-applet-status-area --status-notifier-watcher` on this session; the same protocol GNOME/
  KDE trays use, so this isn't COSMIC-specific). Left-click toggles; right-click gives an
  explicit on/off/status menu. yad has no live "update this running icon" handle across separate
  `--command` invocations, so the script supervises yad and respawns it (sub-second flicker,
  irrelevant since toggling is rare) whenever `lid-guard.service`'s active state changes, using
  `changes-prevent-symbolic` / `changes-allow-symbolic` (present in Adwaita/Cosmic/breeze icon
  themes) so the icon itself shows current state at a glance. Also ships enabled by default —
  the switch needs to already be on the panel, not launched by hand.

### 4. Enable and verify
```
systemctl --user daemon-reload
systemctl --user enable --now disk-cleanup.timer
systemctl --user enable --now battery-guard.service
~/bin/battery-guard.sh --test 15         # confirm sound + volume ramp + dialog before trusting it unattended
systemctl --user enable --now lid-guard.service        # default ON
systemctl --user enable --now lid-guard-tray.service   # panel switch to flip it off on demand
systemd-inhibit --list | grep lid-guard  # confirm the inhibitor is actually held
busctl --user call org.kde.StatusNotifierWatcher /StatusNotifierWatcher \
  org.freedesktop.DBus.Properties Get ss org.kde.StatusNotifierWatcher RegisteredStatusNotifierItems
  # confirm exactly 1 registered item, not 0 (icon failed) or >1 (a respawn leak)
```
Never verify lid-guard by actually closing the lid or running `systemctl suspend` — confirm the
inhibitor and tray registration through the commands above, or by simulating a click with
`~/bin/lid-guard.sh toggle` and re-checking both. Either proves the mechanism works without ever
risking the live session.

### 5. (Optional) Dev CLI bootstrap
Install `gh` (apt), `vercel` (npm global), `turso` (official install script — **read it before
piping to bash**; it just downloads two prebuilt binaries from GitHub releases). Then log in
**one CLI at a time** (see Common Pitfalls — concurrent logins fight over the clipboard):
```
printf '\n' | gh auth login --hostname github.com --git-protocol https --web   # copy printed code, open printed URL
vercel login                                                                   # copy printed code, open printed URL
turso auth login                                                               # opens browser itself, no code needed
```
For each: extract the code/URL from the command's live output, `xdg-open` the URL, put the
code on the clipboard (`copyq copy` or `wl-copy`), and **wait for explicit human confirmation**
that the browser approval was completed before moving to the next tool — the agent cannot and
should not click "Authorize" itself.

### 6. If installing something large (an agent framework, a toolchain) on the same disk
Run it with a watchdog attached: poll `df --output=avail /` every few seconds in a background
loop, and hard-kill the install process tree if free space drops under a safety floor (we used
400MB) — *in addition to* normal before/after cleanup. Re-run the cleanup script immediately
after a big install to reclaim its own build/download caches (uv/pip/npm wheel caches are pure
waste post-install). Re-tune the alert threshold afterward if the new resting baseline is
legitimately higher than before.

---

## Decision Rules

```
IF running on a live/USB session
THEN treat / as an ephemeral overlay — size every threshold off real `df -h /`, not assumed
     hardware capacity, and tell the user explicitly that state won't survive a reboot unless
     they've set up persistence.

IF sudo -n true fails
THEN skip root-owned cleanup steps rather than prompting — an unattended timer run must never
     block on a password.

IF installing a large toolchain on a disk with < a few GB free
THEN attach a hard-floor watchdog (kill the installer before ENOSPC) in addition to
     before/after df logging around the install.

IF a resting disk baseline creeps above the alert threshold because of legitimately-installed
   software (not garbage)
THEN raise the threshold and add visibility (e.g. "Hermes: ~2.1GB, excluded by design") to the
     notification, rather than let cache-clearing run pointlessly every cycle and cry wolf.

IF driving `gh auth login` non-interactively
THEN pipe a newline and pass --web to force the device-code flow instead of the default
     credential-store prompt sequence.

IF a CLI's --headless/non-interactive login flag exits without waiting even though login isn't
   complete
THEN check for a browser-capable variant (no flag, or --web) before assuming the flow failed —
     headless mode often means "print a link, don't poll," not "still working in the background."

IF two or more device-code login flows would run concurrently
THEN serialize them — one clipboard can hold one code at a time, and interleaved codes will
     silently paste the wrong one.

IF the user wants the lid to "do nothing" when closed (keep agents/network running)
THEN hold a `systemd-inhibit --what=handle-lid-switch --mode=block` lock via `lid-guard.sh on`
     rather than editing `/etc/systemd/logind.conf` — the inhibitor is reversible per-use and
     needs no root, while a config edit is global, needs a `systemd-logind` restart, and
     removes the choice instead of preserving it.

IF the user wants that to be the *default*, not something they invoke each time
THEN enable+start `lid-guard.service` (`[Install] WantedBy=default.target`) instead of leaving
     it as a plain start/stop the user has to remember — "no command needed" means the unit
     itself must come up active at login, not just be capable of it.

IF the user wants a literal "switch" (not a CLI command) to flip a toggle like this
THEN check for a running `org.kde.StatusNotifierWatcher` (`busctl --user list | grep -i
     statusnotifier`) before assuming a custom DE applet is required — a lightweight tray tool
     (e.g. `yad --notification`) can usually register with it directly; confirm empirically via
     `RegisteredStatusNotifierItems` rather than assuming any given tool's build supports it.

IF lid-guard (or any inhibitor-based toggle) needs verifying
THEN check `systemd-inhibit --list` for the named entry — never verify by actually closing the
     lid or issuing `systemctl suspend`, since a broken toggle would suspend the live session
     you're trying to protect.

IF any step would touch session data (chat history, credentials, config, code) rather than a
   clearly-named cache/log/tmp path
THEN don't automate it — name it as permanently excluded in both the script comments and the
     notification, so a high-usage alert doesn't get mistaken for something broken.
```

---

## Best Practices

- **Always fetch and read a `curl | bash` installer before executing it.** `curl -fsSL <url> -o
  file.sh`, then grep for `sudo`, `rm -rf`, `base64 -d`, `eval`, `/dev/tcp`, `curl ... | sh`
  nested inside it, before ever running it. Both installers used this session (Hermes, Turso)
  were reviewed this way first.
- **`flock` any script driven by a timer** so a slow run can't stack with the next tick.
- **Report freed space *and* top consumers**, not just a percentage — "still critical, nothing
  to clean" is not actionable; "Hermes: 2.1GB, uv cache: 300MB" is.
- **Name what's excluded, not just what's cleaned.** A script that never touches
  `sessions/`/`memories/`/`.env` is only trustworthy if that fact is visible in the code and,
  ideally, in the user-facing notification too.
- **Self-test anything alarm-shaped before trusting it unattended** — `battery-guard.sh --test
  15` exists specifically so "did the alarm actually work" is answerable in 15 seconds instead
  of by draining a real battery to 29%.
- **One login flow at a time when a clipboard is the hand-off mechanism.**

---

## Common Pitfalls

1. **Assuming `df -h /` on a live session reflects the real disk.** It's the writable overlay
   only — often under 10GB regardless of USB stick or internal drive size.
2. **Trusting a "background task completed" notification when the launched command itself
   contained a trailing `&`.** That notification covers the wrapper script, not the detached
   child — poll the real PID if you need to know when the actual work finished.
3. **Letting `gh`/`vercel`/`turso` (or similar) login flows run concurrently and share one
   clipboard.** The second code silently overwrites the first before the user pastes it.
4. **Forgetting a freshly-appended PATH line doesn't apply to already-open terminals.**
   `command not found` right after an installer finishes is expected until the user
   `source`s their rc file or opens a new shell — don't debug the install, debug the shell.
5. **Auto-deleting anything under an agent's data directory** (chat sessions, memory files,
   cron job definitions, `.env`) in the name of disk cleanup. Only ever target paths that are
   explicitly named caches/logs/tmp in your own script.
6. **Installing every optional component of a large agent framework by default** on a
   small-disk session (browser automation binaries, a bundled local database server) when the
   task only needed the core tool logged in. Skip the heavy optional pieces up front; document
   how to add them later once there's headroom.
7. **A CLI's `--headless` flag looking like it hung.** It may have already exited by design —
   check the process table before assuming it's still working.

---

## Patterns

### Watchdog for a large install on a small disk
```bash
PID=<installer pid>; MIN_FREE_KB=400000
while kill -0 "$PID" 2>/dev/null; do
  avail=$(df --output=avail / | tail -1 | tr -dc '0-9')
  if [ "$avail" -lt "$MIN_FREE_KB" ]; then
    pkill -TERM -P "$PID"; kill -TERM "$PID"; sleep 2
    pkill -KILL -P "$PID"; kill -KILL "$PID"
    echo "WATCHDOG_ABORTED_INSTALL"; exit 1
  fi
  sleep 8
done
```

### `flock`-guarded, before/after-accounted cleanup step
See `bin/disk-cleanup.sh`'s `step()` helper — every cleanup function is wrapped so freed space
is measured and logged individually, and a failure in one step never aborts the run:
```bash
step() {
  local desc="$1"; shift; local b a freed
  b=$(avail_kb)
  if "$@" >>"$LOG_FILE" 2>&1; then
    a=$(avail_kb); freed=$(( a - b ))
    [ "$freed" -gt 1024 ] && CLEARED+=("$desc (~$(( freed / 1024 ))MB)")
  else
    log "step failed (non-fatal): $desc"
  fi
}
```

### Non-interactive device-code login, generalized
```bash
printf '\n' | gh auth login --hostname github.com --git-protocol https --web \
  > login.log 2>&1 &
sleep 3
code=$(grep -oE '[A-Z0-9]{4}-[A-Z0-9]{4}' login.log | head -1)
url=$(grep -oE 'https://[^ ]+' login.log | head -1)
printf '%s' "$code" | copyq copy -     # or: wl-copy
xdg-open "$url"
# then wait for explicit human confirmation before checking `gh auth status`
```

### Battery alarm self-test (no real battery drain required)
```bash
TEST_END=$(( $(date +%s) + 15 ))
ac_online() { [ "$(date +%s)" -ge "$TEST_END" ]; }   # overrides the real check for N seconds
run_alert 30
wait
```

---

## Validation Checklist

- [ ] `df -h /` read and understood *before* picking any percentage threshold.
- [ ] `bash -n <script>` passes on every script before it's installed or enabled.
- [ ] Cleanup script's touched paths are all explicitly named; grepped to confirm it never
      matches session/credential/config paths (`sessions/`, `memories/`, `.env`, `*.db`).
- [ ] Every `curl | bash` installer was fetched and read before execution.
- [ ] `systemctl --user status <unit>` shows `active (running)` / `active (waiting)` for both
      units after `enable --now`.
- [ ] `battery-guard.sh --test 15` produces audible sound, a rising volume, and a dialog with
      a working snooze — verified before trusting the unattended version.
- [ ] A large install onto a small disk was watched live (watchdog or manual polling), not
      fire-and-forgotten.
- [ ] Each device-code/OAuth login was driven one at a time and confirmed by the human before
      moving to the next.
- [ ] No secrets (`.env`, `auth.json`, tokens, clipboard history, `*.bak`) are included in
      anything committed from this skill — only the automation scripts themselves.
- [ ] Disk-usage threshold re-checked (and raised if needed) after any large software install.
- [ ] `lid-guard.sh on` then `systemd-inhibit --list` shows the `lid-guard` row before trusting
      it; `lid-guard.sh off` then re-running `--list` shows it gone. Never verified by actually
      closing the lid or running `systemctl suspend`.
- [ ] `lid-guard.service` and `lid-guard-tray.service` are both `enable`d (`WantedBy=
      default.target`) — the guard must come up ON and the switch must already be on the panel
      at login, with no command required.
- [ ] After `lid-guard.sh toggle`, `RegisteredStatusNotifierItems` still reports exactly 1 item
      (not 0 — icon died; not >1 — the respawn loop leaked a duplicate).

---

## Notes

- Built and verified on **Pop!_OS 24.04 LTS, COSMIC desktop, Wayland**, in a live/USB session
  with a 7.7G overlay root and passwordless sudo. On GNOME-based sessions, notifications
  usually work without installing anything extra; COSMIC currently does not ship
  `libnotify-bin`/`zenity` by default — adjust `install.sh`'s package list per DE if it drifts.
- **The default `THRESHOLD=85` in `disk-cleanup.sh` is tuned for a session with a large agent
  framework installed.** On a lean session without something Hermes-sized, `THRESHOLD=65` is a
  more useful "something's actually wrong" signal — set it back down if you're not installing
  anything comparably large.
- **The dev-CLI bootstrap is documented, not automated**, because every login step ends in a
  human clicking "Authorize" with their own credentials/2FA — that boundary is intentional, not
  a gap to close.
- **A live/USB session is ephemeral by default.** Everything here (scripts, systemd units,
  installed packages) lives only for the current boot unless the session has persistence set
  up or the target is an installed system — say so explicitly rather than letting someone
  assume it survives a reboot.
