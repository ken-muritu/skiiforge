#!/usr/bin/env bash
# Panel switch for lid-guard: a tray icon in COSMIC's status area (registers via
# org.kde.StatusNotifierWatcher, confirmed live on this session's bus) so you can
# toggle lid behavior with a click instead of a terminal command.
#
# yad has no live "update this running icon's image" handle across separate
# --command invocations, so this supervises yad and respawns it (a sub-second
# icon flicker) whenever lid-guard's on/off state changes. Toggling is
# infrequent, so that's a non-issue in exchange for much simpler, more robust
# code than juggling a FIFO's reader/writer lifetime.
set -uo pipefail

LID_GUARD="$HOME/bin/lid-guard.sh"
LOCK="${XDG_RUNTIME_DIR:-/tmp}/lid-guard-tray.lock"

exec 9>"$LOCK"
flock -n 9 || { echo "lid-guard-tray already running"; exit 0; }

state()    { systemctl --user is-active --quiet lid-guard.service && echo on || echo off; }
icon_for() { [ "$1" = on ] && echo "changes-prevent-symbolic" || echo "changes-allow-symbolic"; }
text_for() {
  if [ "$1" = on ]; then
    echo "Lid guard: ON — closing the lid does nothing"
  else
    echo "Lid guard: OFF — closing the lid suspends normally"
  fi
}

while true; do
  s=$(state)
  yad --notification \
    --image="$(icon_for "$s")" \
    --text="$(text_for "$s")" \
    --command="$LID_GUARD toggle" \
    --menu="Turn ON (stay awake)!$LID_GUARD on|Turn OFF (allow sleep)!$LID_GUARD off|Status!$LID_GUARD status" \
    --no-middle &
  ypid=$!

  # Respawn to refresh the icon/tooltip the moment state changes; otherwise
  # exit cleanly if the icon itself was quit (e.g. middle-click, log out).
  while kill -0 "$ypid" 2>/dev/null; do
    if [ "$(state)" != "$s" ]; then
      kill "$ypid" 2>/dev/null
      wait "$ypid" 2>/dev/null
      break
    fi
    sleep 1
  done
  wait "$ypid" 2>/dev/null
done
