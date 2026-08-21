#!/usr/bin/env bash
# Toggle whether closing the laptop lid does anything at all.
#
# Default logind behavior (HandleLidSwitch=suspend — the compiled-in default;
# unset/commented in /etc/systemd/logind.conf on this system) suspends the
# machine the instant the lid closes, which powers down wifi/bluetooth and
# freezes every running process — including any agents you want to keep going.
#
# This deliberately does NOT edit /etc/systemd/logind.conf (that needs root,
# a systemd-logind restart, and applies globally/permanently). Instead it
# holds/releases a `systemd-inhibit --what=handle-lid-switch` lock — the same
# inhibitor mechanism the desktop session itself already uses (see e.g.
# "Cosmic Session ... handle-power-key ... block" in `systemd-inhibit --list`).
# While the lock is held, logind skips its lid-switch action entirely, as if
# the event never happened; release it and the very next lid close goes right
# back to normal (suspend) behavior. That makes this a genuine per-use choice,
# not a permanent system change — nothing here can leave you unable to
# suspend, and no root-owned file is ever touched.
set -uo pipefail

UNIT="lid-guard.service"

usage() { echo "Usage: $(basename "$0") on|off|toggle|status" >&2; exit 1; }

is_active() { systemctl --user is-active --quiet "$UNIT"; }

notify() {
  command -v notify-send >/dev/null 2>&1 && notify-send -i drive-harddisk "$1" "$2" 2>/dev/null
  return 0
}

turn_on() {
  systemctl --user start "$UNIT"
  sleep 0.3
  if is_active; then
    notify "Lid guard: ON" "Closing the lid will do nothing until you turn this off."
    echo "ON  — safe to close the lid now; agents/network/session stay up."
  else
    echo "Failed to start $UNIT — check: systemctl --user status $UNIT" >&2
    exit 1
  fi
}

turn_off() {
  systemctl --user stop "$UNIT" 2>/dev/null
  notify "Lid guard: OFF" "Closing the lid will suspend as normal again."
  echo "OFF — default lid behavior restored (suspend; wifi/bluetooth will drop)."
}

status() {
  if is_active; then
    echo "ON  — closing the lid will do nothing (agents, network, session stay up)."
    systemd-inhibit --list 2>/dev/null | grep '^lid-guard ' | sed 's/^/  inhibitor: /'
  else
    echo "OFF — closing the lid uses the normal default (suspend; wifi/bluetooth drop)."
  fi
}

case "${1:-}" in
  on)     turn_on ;;
  off)    turn_off ;;
  toggle) if is_active; then turn_off; else turn_on; fi ;;
  status) status ;;
  *)      usage ;;
esac
