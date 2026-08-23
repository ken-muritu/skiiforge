#!/usr/bin/env bash
# One-shot per-boot health check of every custom guard on this live session.
#
# Every live session is a fresh boot with no persistence — you cannot assume
# yesterday's setup carried over, and a crashed COSMIC shell (2026-08-23) can
# leave user units in surprising states. This runs ~2 min after login via
# guards-doctor.timer and answers, in one notification: are the guards armed,
# are the resources sane, are the CLIs still authed. Also runnable by hand
# anytime as `guards-doctor.sh`.
#
# Every external call is timeout-wrapped — a hung network or a wedged disk
# must never hang the doctor.
set -uo pipefail

STATE_DIR="$HOME/.local/state/guards-doctor"
LOG_FILE="$STATE_DIR/doctor.log"
mkdir -p "$STATE_DIR"
log() { echo "$(date -Iseconds) $*" >> "$LOG_FILE"; }

NOTIFY=0
[ "${1:-}" = "--notify" ] && NOTIFY=1

PASS=0; FAIL=0; WARN=0
ok()   { PASS=$((PASS+1)); printf '  ✓ %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  ✗ %s\n' "$1"; }
warn() { WARN=$((WARN+1)); printf '  ⚠ %s\n' "$1"; }

THRESHOLD=75  # keep in sync with disk-cleanup.sh

echo "=== guards doctor $(date -Iseconds) ==="

# ---- guard units -----------------------------------------------------------
if systemctl --user is-active --quiet disk-cleanup.timer; then
  ok "disk-cleanup.timer active (5-min storage guard)"
else
  bad "disk-cleanup.timer NOT active — start: systemctl --user enable --now disk-cleanup.timer"
fi

if systemctl --user is-active --quiet battery-guard.service; then
  ok "battery-guard.service running"
else
  bad "battery-guard.service NOT running — start: systemctl --user start battery-guard.service"
fi

lid_state="OFF (lid close suspends normally)"
systemctl --user is-active --quiet lid-guard.service && lid_state="ON (lid close does nothing)"
printf '  • lid-guard: %s\n' "$lid_state"

if systemctl --user is-enabled --quiet guards-doctor.timer 2>/dev/null; then
  ok "guards-doctor.timer enabled (this check re-runs each boot)"
else
  warn "guards-doctor.timer not enabled"
fi

# ---- resources -------------------------------------------------------------
pct="$(df --output=pcent / | tail -1 | tr -dc '0-9')"
avail_mb=$(( $(df --output=avail / | tail -1 | tr -dc '0-9') / 1024 ))
if [ "${pct:-100}" -lt "$THRESHOLD" ]; then
  ok "disk ${pct}% used (${avail_mb}MB free, threshold ${THRESHOLD}%)"
else
  bad "disk ${pct}% used ≥ threshold ${THRESHOLD}% (${avail_mb}MB free)"
fi

mem_avail_mb=$(( $(free -k | awk '/^Mem:/{print $7}') / 1024 ))
swap_pct=$(free -k | awk '/^Swap:/{if ($2>0) print int($3*100/$2); else print 0}')
if [ "$mem_avail_mb" -ge 1500 ] && [ "${swap_pct:-0}" -lt 40 ]; then
  ok "RAM ${mem_avail_mb}MB available, swap ${swap_pct}% used"
else
  warn "RAM pressure: ${mem_avail_mb}MB available, swap ${swap_pct}% used (/tmp is RAM-backed)"
fi

printf '  • /tmp (RAM tmpfs): %s used\n' "$(du -sh /tmp 2>/dev/null | cut -f1)"

# ---- battery ---------------------------------------------------------------
bat="$(cat /sys/class/power_supply/BAT0/capacity 2>/dev/null || echo '?')"
ac="$(cat /sys/class/power_supply/AC/online 2>/dev/null || echo '?')"
if [ "$ac" = "1" ]; then
  printf '  • battery: %s%% (on AC)\n' "$bat"
elif [ "${bat:-100}" -gt 30 ]; then
  printf '  • battery: %s%% (on battery, above alarm tier)\n' "$bat"
else
  warn "battery ${bat}% on battery — guard should be alarming"
fi

# ---- CLI auth (network calls, hard-timeboxed) ------------------------------
# A flaky network must read as "unknown/offline", never as "logged out" —
# otherwise the doctor cries wolf every time DNS hiccups.
if timeout 6 curl -sfI https://api.github.com >/dev/null 2>&1 \
   || timeout 6 getent hosts api.github.com >/dev/null 2>&1; then
  online=1
else
  online=0
  warn "network unreachable — CLI auth checks skipped (not a logout)"
fi

if [ "$online" -eq 1 ]; then
  if timeout 15 gh auth status >/dev/null 2>&1; then
    ok "gh authenticated ($(timeout 15 gh api user --jq .login 2>/dev/null || echo '?'))"
  else
    bad "gh NOT authenticated — run: gh auth login"
  fi

  # vercel is a slow-starting Node CLI: measured ~9s cold, so 25s ceiling
  vc_user="$(timeout 25 vercel whoami 2>/dev/null | tail -1)"
  if [ -n "$vc_user" ]; then
    ok "vercel authenticated ($vc_user)"
  else
    bad "vercel NOT authenticated — run: vercel login"
  fi

  ts_user="$(timeout 15 turso auth whoami 2>/dev/null || timeout 15 turso whoami 2>/dev/null | tail -1)"
  if [ -n "$ts_user" ]; then
    ok "turso authenticated ($ts_user)"
  else
    bad "turso NOT authenticated — run: turso auth login"
  fi
fi

# ---- internal SSD watch (informational) ------------------------------------
# Why live-boot at all: the internal SSD's SATA link drops at 6.0 Gbps
# (healthy per SMART; marginal physical connection). Track its state and any
# link errors this boot so degradation is visible early.
sda_sz="$(lsblk -ndo SIZE /dev/sda 2>/dev/null || true)"
if [ -n "$sda_sz" ]; then
  printf '  • internal SSD (sda): present (%s)\n' "$sda_sz"
else
  printf '  • internal SSD (sda): absent/disabled this boot\n'
fi
ata_errs="$(journalctl -k -b --no-pager 2>/dev/null | grep -cE 'DID_BAD_TARGET|ata[0-9]+: (hardreset failed|link is slow)' || true)"
if [ "${ata_errs:-0}" -eq 0 ]; then
  printf '  • SATA link errors this boot: none seen\n'
else
  warn "SATA link errors this boot: $ata_errs (see journalctl -k -b | grep ata)"
fi

# ---- summary ----------------------------------------------------------------
summary_line="${PASS} ok, ${FAIL} failed, ${WARN} warned"
echo "=== ${summary_line} ==="
log "${summary_line}"

if [ "$NOTIFY" -eq 1 ]; then
  if [ "$FAIL" -eq 0 ]; then
    urgency="normal"; icon="emblem-ok"; head="Guards armed — all checks passed"
    [ "$WARN" -gt 0 ] && head="Guards armed (${WARN} warning${WARN:+s})"
  else
    urgency="critical"; icon="dialog-error"; head="⚠ Guards: ${FAIL} check(s) FAILED"
  fi
  ac_note="(on AC)"
  [ "$ac" != "1" ] && ac_note="(on battery)"
  command -v notify-send >/dev/null 2>&1 && \
    notify-send -u "$urgency" -i "$icon" "$head" \
      "Disk ${pct}% · RAM ${mem_avail_mb}MB avail · battery ${bat}% ${ac_note}
gh/vercel/turso: see terminal — full detail: guards-doctor.sh" 2>/dev/null
fi

# nonzero exit only for real failures so timers/logs stay quiet otherwise
[ "$FAIL" -eq 0 ]
