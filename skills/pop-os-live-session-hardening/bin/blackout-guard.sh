#!/usr/bin/env bash
# Blackout guard: if AC is unplugged, battery is at/below threshold, and the
# machine has been idle (no keyboard/mouse activity) for a while, gracefully
# close heavy user apps (browsers, media players) and suspend to RAM.
#
# Why: on this live-boot laptop, overnight blackouts have left the browser,
# music, and terminal running on battery until the machine died — killing the
# session. Suspend-to-RAM keeps the session alive (RAM stays powered, ~1-2W)
# while everything else stops draining.
#
# Runs every 60s via the blackout-guard.timer systemd --user unit.
#
# SAFETY — what is NEVER killed:
#   Only an explicit whitelist of app names is ever signalled (browsers and
#   media players, all of which restore their state on next launch). Terminal
#   emulators, claude/node, hermes, the guard suite itself, the audio stack,
#   and the compositor are untouched by construction — and suspend preserves
#   them all in RAM anyway.
set -uo pipefail

# ---- config ----
BLACKOUT_BATTERY_PCT=60   # act when battery is at or below this
IDLE_MINUTES=10           # require this many consecutive idle minutes
GRACE_SECONDS=30          # warning window before acting (activity aborts)
COOLDOWN_MINUTES=30       # after acting, don't re-act for this long

STATE_DIR="$HOME/.local/state/blackout-guard"
LOG_FILE="$STATE_DIR/blackout.log"
TRIGGERED_FILE="$STATE_DIR/last-triggered"
IDLE_COUNT_FILE="$STATE_DIR/idle-count"
mkdir -p "$STATE_DIR"

log() { echo "$(date -Iseconds) $*" >> "$LOG_FILE"; }

HAVE_SUDO=0
sudo -n true 2>/dev/null && HAVE_SUDO=1

# ---- power state (glob-tolerant: AC/AC0/ACAD, BAT0/BAT1, USB-C PD sources) ----
ac_online() {
  local p
  for p in /sys/class/power_supply/AC*/online /sys/class/power_supply/ucsi-source-psy-*/online; do
    [ -f "$p" ] || continue
    [ "$(cat "$p" 2>/dev/null)" = "1" ] && return 0
  done
  return 1
}
battery_pct() {
  local p
  for p in /sys/class/power_supply/BAT*/capacity; do
    [ -f "$p" ] && { cat "$p" 2>/dev/null; return; }
  done
  echo 100   # no battery found -> treat as mains-powered, guard stays inert
}
battery_status() {
  local p
  for p in /sys/class/power_supply/BAT*/status; do
    [ -f "$p" ] && { cat "$p" 2>/dev/null; return; }
  done
  echo Unknown
}

# ---- idle detection ----
# Primary: logind's IdleHint (the desktop reports session idle). If that is
# unavailable or unparseable, fall back to sampling /dev/input/event*: one
# 5-second sample per run, and IDLE_MINUTES consecutive idle samples must
# accumulate before the machine counts as idle (~60s timer cadence, so the
# real-world idle requirement is ~IDLE_MINUTES plus a few seconds).
# An input "sample" cat's the event devices for N seconds: if ANY bytes
# flowed, there was input. (tail -f would NOT work here — it never exits on
# activity, so its timeout can't distinguish idle from active.)
idle_hint() {
  local out
  out=$(busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
        org.freedesktop.login1.Manager IdleHint 2>/dev/null) || return 2
  case "$out" in
    "b true")  return 0 ;;
    "b false") return 1 ;;
    *)         return 2 ;;   # unparseable -> caller uses sampling
  esac
}
input_events_in() {   # $1 = sample seconds; true if any input seen
  [ "$HAVE_SUDO" -eq 1 ] || return 1
  local probe size
  probe=$(mktemp) || return 1
  sudo -n timeout "$1" cat /dev/input/event* > "$probe" 2>/dev/null
  size=$(stat -c%s "$probe" 2>/dev/null || echo 0)
  rm -f "$probe"
  [ "${size:-0}" -gt 0 ]
}
is_idle() {
  idle_hint && return 0
  local rc=$?
  [ "$rc" -eq 1 ] && return 1        # logind explicitly says: active
  # rc=2 (hint unavailable): fall back to input sampling. If we can't sample
  # either, we cannot CONFIRM idle — fail safe and report "not idle" so the
  # guard never acts on a guess.
  [ "$HAVE_SUDO" -eq 1 ] || return 1
  ! input_events_in 5
}

idle_count() { cat "$IDLE_COUNT_FILE" 2>/dev/null || echo 0; }
set_idle_count() { echo "$1" > "$IDLE_COUNT_FILE"; }

# ---- graceful app shutdown (WHITELIST only — see header) ----
KILL_NAMES=(brave chrome chromium firefox firefox-esr
            spotify vlc mpv celluloid rhythmbox audacious lollypop)

collect_app_pids() {
  local name pids=()
  for name in "${KILL_NAMES[@]}"; do
    while IFS= read -r p; do
      [ -n "$p" ] && pids+=("$p")
    done < <(pgrep -x -u "$USER" "$name" 2>/dev/null)
  done
  [ ${#pids[@]} -gt 0 ] && printf '%s\n' "${pids[@]}"
  return 0
}

# ---- status / test modes ----
if [ "${1:-}" = "--status" ]; then
  echo "AC online:        $(ac_online && echo yes || echo no)"
  echo "Battery:          $(battery_pct)% ($(battery_status))"
  echo "Threshold:        act at <= ${BLACKOUT_BATTERY_PCT}% + idle >= ${IDLE_MINUTES}min"
  echo "Idle samples hit: $(idle_count)/${IDLE_MINUTES}"
  echo "Idle check now:   $(is_idle && echo idle || echo active/unknown)"
  echo "Last triggered:   $(cat "$TRIGGERED_FILE" 2>/dev/null || echo never)"
  exit 0
fi
if [ "${1:-}" = "--test" ]; then
  # Simulate the full decision path WITHOUT signalling anything or suspending.
  echo "TEST: simulating blackout conditions (nothing will be killed or suspended)"
  log "TEST MODE run"
  echo "  power conditions: forced TRUE (test)"
  echo "  idle check: $(is_idle && echo idle || echo 'NOT idle right now (would keep counting)')"
  mapfile -t tpids < <(collect_app_pids)
  if [ ${#tpids[@]} -gt 0 ]; then
    names=$(ps -o comm= -p "$(IFS=,; echo "${tpids[*]}")" 2>/dev/null | sort -u | tr '\n' ' ')
    echo "  apps that WOULD receive SIGTERM: ${#tpids[@]} process(es) [${names}]"
  else
    echo "  apps that WOULD receive SIGTERM: none running"
  fi
  echo "  final action that WOULD run: systemctl suspend"
  exit 0
fi

# ---- main pass (one evaluation per timer tick) ----
if ac_online; then
  # power restored: reset the idle tally so a fresh outage starts from zero
  [ "$(idle_count)" != "0" ] && set_idle_count 0
  exit 0
fi

cap=$(battery_pct)
status=$(battery_status)
if [ "$cap" -gt "$BLACKOUT_BATTERY_PCT" ]; then
  [ "$(idle_count)" != "0" ] && set_idle_count 0
  exit 0
fi
# unplug events that are really still charging (USB-C PD quirks) shouldn't act
if [ "$status" != "Discharging" ] && [ "$status" != "Not charging" ]; then
  exit 0
fi

now=$(date +%s)
last=$(cat "$TRIGGERED_FILE" 2>/dev/null || echo 0)
if [ $(( now - last )) -lt $(( COOLDOWN_MINUTES * 60 )) ]; then
  log "conditions met but in cooldown (acted $(( (now - last) / 60 ))min ago)"
  exit 0
fi

if ! is_idle; then
  set_idle_count 0
  exit 0
fi

count=$(( $(idle_count) + 1 ))
set_idle_count "$count"
if [ "$count" -lt "$IDLE_MINUTES" ]; then
  [ $(( count % 5 )) -eq 1 ] && log "unplugged, battery ${cap}%, idle sample ${count}/${IDLE_MINUTES}"
  exit 0
fi

# ---- trigger ----
log "TRIGGER: AC off, battery ${cap}% (${status}), idle >= ${IDLE_MINUTES}min — acting"
notify-send -u critical -i battery-caution \
  "Blackout guard — battery ${cap}%" \
  "Power is out and the machine is idle. Closing browsers/media and suspending in ${GRACE_SECONDS}s to save battery. Move the mouse or press a key to abort."

# grace window: any input (or AC returning) aborts
t=0
while [ "$t" -lt "$GRACE_SECONDS" ]; do
  sleep 5; t=$(( t + 5 ))
  if ac_online; then
    log "aborted: AC restored during grace window"
    set_idle_count 0
    exit 0
  fi
  if input_events_in 1; then
    log "aborted: input resumed during grace window"
    set_idle_count 0
    notify-send -u normal -i battery-caution "Blackout guard aborted" "Activity detected — nothing was closed."
    exit 0
  fi
done

mapfile -t pids < <(collect_app_pids)
if [ ${#pids[@]} -gt 0 ]; then
  log "sending SIGTERM to ${#pids[@]} app process(es): ${pids[*]}"
  kill "${pids[@]}" 2>/dev/null
  sleep 10   # let browsers save session state
fi

echo "$now" > "$TRIGGERED_FILE"
set_idle_count 0
log "suspending to RAM (session preserved)"
notify-send -u critical -i system-suspend "Blackout guard" "Suspending now — session stays alive in RAM."
sleep 2
systemctl suspend 2>/dev/null || sudo -n systemctl suspend
log "resume after suspend (or suspend command returned)"
