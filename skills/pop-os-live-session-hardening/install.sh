#!/usr/bin/env bash
# Bootstraps disk-cleanup, battery-guard, and CopyQ on a fresh Pop!_OS (or any
# apt + systemd --user + freedesktop-notifications) desktop or live session.
# Idempotent: safe to re-run.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Installing required packages (needs sudo)"
sudo apt-get update -qq
sudo apt-get install -y libnotify-bin zenity copyq yad

echo "==> Installing scripts to ~/bin"
mkdir -p "$HOME/bin"
cp "$SCRIPT_DIR"/bin/disk-cleanup.sh "$SCRIPT_DIR"/bin/battery-guard.sh \
   "$SCRIPT_DIR"/bin/lid-guard.sh "$SCRIPT_DIR"/bin/lid-guard-tray.sh "$HOME/bin/"
chmod +x "$HOME/bin/disk-cleanup.sh" "$HOME/bin/battery-guard.sh" \
         "$HOME/bin/lid-guard.sh" "$HOME/bin/lid-guard-tray.sh"

echo "==> Installing systemd --user units"
mkdir -p "$HOME/.config/systemd/user"
cp "$SCRIPT_DIR"/systemd/disk-cleanup.service "$SCRIPT_DIR"/systemd/disk-cleanup.timer \
   "$SCRIPT_DIR"/systemd/battery-guard.service "$SCRIPT_DIR"/systemd/lid-guard.service \
   "$SCRIPT_DIR"/systemd/lid-guard-tray.service \
   "$HOME/.config/systemd/user/"

echo "==> Installing CopyQ autostart entry"
mkdir -p "$HOME/.config/autostart"
cp "$SCRIPT_DIR"/autostart/copyq.desktop "$HOME/.config/autostart/"

echo "==> Installing lid-guard's pinnable panel launcher"
mkdir -p "$HOME/.local/share/applications"
cp "$SCRIPT_DIR"/desktop/lid-guard-toggle.desktop "$HOME/.local/share/applications/"
update-desktop-database "$HOME/.local/share/applications" >/dev/null 2>&1 || true

echo "==> Enabling services"
systemctl --user daemon-reload
systemctl --user enable --now disk-cleanup.timer
systemctl --user enable --now battery-guard.service
systemctl --user enable --now lid-guard.service       # default ON: lid close does nothing
# lid-guard-tray.service is installed but NOT enabled here: on COSMIC it registers with the
# status-notifier watcher but the applet doesn't actually paint it (confirmed — see skill.md).
# Left in the repo for other desktops (GNOME/KDE) where SNI trays are known to work; on COSMIC
# use the pinned .desktop launcher (just installed) and/or a custom keyboard shortcut instead.

if ! pgrep -x copyq >/dev/null 2>&1; then
  nohup copyq >/dev/null 2>&1 &
  disown
fi
command -v copyq >/dev/null 2>&1 && copyq config maxitems 5000 >/dev/null 2>&1 || true

cat <<'EOF'

Done.
  - disk-cleanup.timer runs every 5 minutes (see skill.md for the 65%/85% threshold note)
  - battery-guard.service runs continuously; test it anytime with:
      ~/bin/battery-guard.sh --test 15
  - CopyQ is running and will autostart on future logins (history capped at 5000 items)
  - lid-guard is ON by default: closing the lid now does nothing (agents/network/session stay
    up). To flip it off with a click instead of a terminal:
      1. Open your app launcher, search "Lid Guard Toggle", right-click (or drag) it onto the
         panel/dock to pin it — same as pinning any other app.
      2. Optional: also bind a keyboard shortcut that asks for confirmation before switching —
         run `cosmic-settings keyboard`, add a custom shortcut with command
         `~/bin/lid-guard.sh confirm-toggle` and a key combo of your choice (avoid Ctrl+P —
         that's Print in most apps). It pops a Yes/No dialog either direction before acting.
    Or from a terminal:
      ~/bin/lid-guard.sh off             # this lid close suspends normally (wifi/bluetooth drop)
      ~/bin/lid-guard.sh on              # back to the default (lid close does nothing)
      ~/bin/lid-guard.sh confirm-toggle  # same toggle, but asks first (zenity Yes/No)
      ~/bin/lid-guard.sh status          # check which mode is currently active

Check status with:
  systemctl --user status disk-cleanup.timer battery-guard.service lid-guard.service

Optional dev tooling (NOT installed by this script — see skill.md "Dev CLI bootstrap"):
  sudo apt-get install -y gh
  npm install -g vercel        # needs Node.js on PATH
  curl -fsSL https://get.tur.so/install.sh | bash
Then authenticate one at a time (they share the clipboard for device codes):
  gh auth login --web
  vercel login
  turso auth login
EOF
