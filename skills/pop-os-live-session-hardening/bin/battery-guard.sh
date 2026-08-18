#!/usr/bin/env bash
# Monitors battery while AC is unplugged. Below 30% (then 15%, then 5%) it
# raises an escalating alarm: sound loop + rising volume + a dialog with a
# 5-minute snooze. Runs continuously as a systemd --user service.
set -uo pipefail

STATE_DIR="$HOME/.local/state/battery-guard"
LOG_FILE="$STATE_DIR/battery-guard.log"
SNOOZE_FILE="$STATE_DIR/snooze_until"
ALERT_LOCK="$STATE_DIR/alert.lock"
mkdir -p "$STATE_DIR"
rm -f "$ALERT_LOCK"

log() { echo "$(date -Iseconds) $*" >> "$LOG_FILE"; }

AC_PATH="/sys/class/power_supply/AC/online"
BAT_PATH="/sys/class/power_supply/BAT0/capacity"

SOUND="/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
[ -f "$SOUND" ] || SOUND="/usr/share/sounds/freedesktop/stereo/dialog-warning.oga"

ac_online()   { [ -f "$AC_PATH" ] && [ "$(cat "$AC_PATH" 2>/dev/null)" = "1" ]; }
battery_pct() { [ -f "$BAT_PATH" ] && cat "$BAT_PATH" 2>/dev/null || echo 100; }

run_alert() {
  local tier="$1"
  [ -f "$ALERT_LOCK" ] && return
  touch "$ALERT_LOCK"
  log "alert triggered at tier ${tier}%"
  (
    trap 'rm -f "$ALERT_LOCK"' EXIT
    local sink vol
    sink=$(pactl get-default-sink 2>/dev/null)
    [ -n "$sink" ] && pactl set-sink-mute "$sink" 0 2>/dev/null
    vol=$(pactl get-sink-volume "$sink" 2>/dev/null | grep -oP '\d+%' | head -1 | tr -d '%')
    [ -z "${vol:-}" ] && vol=50
    if [ "$vol" -lt 50 ]; then
      [ -n "$sink" ] && pactl set-sink-volume "$sink" 50% 2>/dev/null
      vol=50
    fi

    notify-send -u critical -i battery-caution "Low battery: ${tier}%" \
      "Plug in the charger. The alarm will keep sounding — and getting louder — until you do, or snooze it."

    (
      local v="$vol"
      while ! ac_online; do
        paplay "$SOUND" >/dev/null 2>&1
        v=$(( v + 10 )); [ "$v" -gt 100 ] && v=100
        [ -n "$sink" ] && pactl set-sink-volume "$sink" "${v}%" 2>/dev/null
        sleep 1
      done
    ) &
    local soundpid=$!

    if command -v zenity >/dev/null 2>&1; then
      zenity --question --title="Low Battery — ${tier}%" \
        --text="Battery is at ${tier}%.\nPlug in the charger.\n\nClick Snooze to silence the alarm for 5 minutes." \
        --ok-label="Snooze 5 min" --cancel-label="Dismiss" 2>/dev/null &
      local zpid=$!
      while kill -0 "$zpid" 2>/dev/null; do
        if ac_online; then kill "$zpid" 2>/dev/null; fi
        sleep 1
      done
      wait "$zpid" 2>/dev/null
      local rc=$?
      if [ "$rc" -eq 0 ]; then
        echo $(( $(date +%s) + 300 )) > "$SNOOZE_FILE"
        log "snoozed 5 min at tier ${tier}%"
      fi
    else
      while ! ac_online; do sleep 5; done
    fi

    kill "$soundpid" 2>/dev/null
    log "alert ended (tier ${tier}%)"
  ) &
}

if [ "${1:-}" = "--test" ]; then
  DURATION="${2:-15}"
  echo "Simulating a 30% low-battery alert for ${DURATION}s (sound + volume ramp + dialog)."
  echo "Click 'Snooze 5 min' to test that path, or just wait — it auto-ends like AC got plugged in."
  TEST_END=$(( $(date +%s) + DURATION ))
  ac_online() { [ "$(date +%s)" -ge "$TEST_END" ]; }
  log "TEST MODE: simulating tier 30% alert for ${DURATION}s"
  run_alert 30
  wait
  echo "Test complete."
  exit 0
fi

log "battery-guard started"
while true; do
  if ac_online; then
    rm -f "$SNOOZE_FILE" 2>/dev/null
  else
    cap=$(battery_pct)
    now=$(date +%s)
    snooze_until=0
    [ -f "$SNOOZE_FILE" ] && snooze_until=$(cat "$SNOOZE_FILE" 2>/dev/null || echo 0)
    if [ "$now" -ge "$snooze_until" ]; then
      if   [ "$cap" -le 5 ];  then run_alert 5
      elif [ "$cap" -le 15 ]; then run_alert 15
      elif [ "$cap" -le 30 ]; then run_alert 30
      fi
    fi
  fi
  sleep 15
done
