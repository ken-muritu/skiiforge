#!/usr/bin/env bash
# Periodic safe disk-usage check + cleanup + desktop notification.
# Runs every 5 min via the disk-cleanup.timer systemd --user unit.
set -uo pipefail

THRESHOLD=85
STATE_DIR="$HOME/.local/state/disk-cleanup"
LOCK_FILE="$STATE_DIR/run.lock"
LOG_FILE="$STATE_DIR/cleanup.log"
mkdir -p "$STATE_DIR"

log() { echo "$(date -Iseconds) $*" >> "$LOG_FILE"; }

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "skip: previous run still in progress"
  exit 0
fi

# rotate log once it grows past ~1MB
if [ -f "$LOG_FILE" ] && [ "$(stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)" -gt 1048576 ]; then
  tail -n 500 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

usage_pct() { df --output=pcent / | tail -1 | tr -dc '0-9'; }
avail_kb()  { df --output=avail / | tail -1 | tr -dc '0-9'; }

HAVE_SUDO=0
sudo -n true 2>/dev/null && HAVE_SUDO=1

before_pct=$(usage_pct)
before_avail=$(avail_kb)
log "=== run start: usage ${before_pct}% ==="

CLEARED=()

step() {
  local desc="$1"; shift
  local b a freed
  b=$(avail_kb)
  if "$@" >>"$LOG_FILE" 2>&1; then
    a=$(avail_kb)
    freed=$(( a - b ))
    if [ "$freed" -gt 1024 ]; then
      CLEARED+=("$desc (~$(( freed / 1024 ))MB)")
    fi
  else
    log "step failed (non-fatal): $desc"
  fi
}

# ---- user-space caches (no root needed) ----
clean_trash()    { rm -rf "$HOME"/.local/share/Trash/files/* "$HOME"/.local/share/Trash/info/* 2>/dev/null; }
clean_thumbs()   { find "$HOME/.cache/thumbnails" -type f -mtime +7 -delete 2>/dev/null; }
clean_browsers() {
  local d
  for d in "$HOME/.cache/google-chrome" "$HOME/.cache/BraveSoftware" "$HOME/.cache/chromium" \
           "$HOME"/.cache/mozilla/firefox/*/cache2 "$HOME/.cache/microsoft-edge"; do
    [ -d "$d" ] && find "$d" -mindepth 1 -delete 2>/dev/null
  done
  return 0
}
clean_pip()   { command -v pip  >/dev/null 2>&1 && pip cache purge; }
clean_npm()   { command -v npm  >/dev/null 2>&1 && npm cache clean --force; }
clean_yarn()  { command -v yarn >/dev/null 2>&1 && yarn cache clean; }
clean_go()    { command -v go   >/dev/null 2>&1 && go clean -cache; }
clean_cargo() { [ -d "$HOME/.cargo/registry/cache" ] && rm -rf "$HOME"/.cargo/registry/cache/*; return 0; }
clean_uv()    { [ -x "$HOME/.hermes/bin/uv" ] && "$HOME/.hermes/bin/uv" cache clean; }

# ---- Hermes agent (~/.hermes): only its own regenerable caches/logs.
# sessions/, memories/, cron/, config.yaml, .env, SOUL.md, and the
# hermes-agent code checkout are NEVER touched by any step here.
clean_hermes_caches() {
  local d
  for d in "$HOME/.hermes/audio_cache" "$HOME/.hermes/image_cache"; do
    [ -d "$d" ] && find "$d" -type f -mtime +2 -delete 2>/dev/null
  done
  return 0
}
clean_hermes_pycache() {
  [ -d "$HOME/.hermes/hermes-agent" ] && \
    find "$HOME/.hermes/hermes-agent" -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null
  return 0
}
rotate_hermes_logs() {
  local f
  for f in "$HOME"/.hermes/logs/*.log "$HOME"/.hermes/logs/curator/*.log; do
    [ -f "$f" ] || continue
    if [ "$(stat -c%s "$f" 2>/dev/null || echo 0)" -gt 5242880 ]; then
      tail -n 2000 "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    fi
  done
  return 0
}
clean_hermes_misc_cache() {
  [ -d "$HOME/.hermes/cache" ] && find "$HOME/.hermes/cache" -type f -mtime +1 -delete 2>/dev/null
  [ -f "$HOME/.hermes/models_dev_cache.json" ] && \
    find "$HOME/.hermes/models_dev_cache.json" -mtime +1 -delete 2>/dev/null
  return 0
}
rotate_hermes_backups() {
  ls -t "$HOME"/.hermes/config.yaml.bak.* 2>/dev/null | tail -n +4 | xargs -r rm -f
  return 0
}

# ---- root-owned system caches ----
clean_tmp() {
  sudo find /tmp -mindepth 1 -mtime +1 \
    -not -path "/tmp/.X11-unix*" -not -path "/tmp/.ICE-unix*" \
    -not -path "/tmp/systemd-private-*" -not -path "*snap-private-tmp*" \
    -exec rm -rf {} + 2>/dev/null
  return 0
}
clean_coredumps() { sudo find /var/crash /var/lib/systemd/coredump -type f -mtime +1 -delete 2>/dev/null; return 0; }
clean_snap_old() {
  snap list --all 2>/dev/null | awk '/disabled/{print $1, $3}' | \
    while read -r name rev; do sudo snap remove "$name" --revision="$rev" >/dev/null 2>&1; done
  return 0
}
clean_docker() { sudo docker system prune -f; }
clean_podman() { podman system prune -f; }
deep_journal_vacuum() { sudo journalctl --vacuum-time=6h; }
deep_tmp_sweep() {
  sudo find /tmp -mindepth 1 -mmin +180 \
    -not -path "/tmp/.X11-unix*" -not -path "/tmp/.ICE-unix*" \
    -not -path "/tmp/systemd-private-*" -not -path "*snap-private-tmp*" \
    -exec rm -rf {} + 2>/dev/null
  return 0
}
top_consumers() {
  du -sh "$HOME/.hermes" "$HOME/.cache" "$HOME/.npm" "$HOME/.cargo" \
    /var/cache/apt/archives 2>/dev/null | sort -rh | head -5
}

step "Trash"           clean_trash
step "Thumbnail cache"  clean_thumbs
step "Browser caches"   clean_browsers
step "pip cache"        clean_pip
step "npm cache"        clean_npm
step "yarn cache"       clean_yarn
step "Go build cache"   clean_go
step "Cargo registry cache" clean_cargo
step "uv package cache" clean_uv
step "Hermes audio/image cache (>2d)" clean_hermes_caches
step "Hermes __pycache__"      clean_hermes_pycache
step "Hermes log rotation (>5MB)" rotate_hermes_logs
step "Hermes misc cache (>1d)" clean_hermes_misc_cache
step "Hermes config backups (keep 3)" rotate_hermes_backups

if systemctl --user is-active --quiet hermes-gateway.service 2>/dev/null; then
  :
elif systemctl --user list-unit-files hermes-gateway.service >/dev/null 2>&1; then
  log "warning: hermes-gateway.service is installed but not active"
fi

if [ "$HAVE_SUDO" -eq 1 ]; then
  step "APT package cache"        sudo apt-get clean
  step "APT autoclean"            sudo apt-get autoclean -y
  step "systemd journal (>2d)"    sudo journalctl --vacuum-time=2d
  step "Old core dumps"           clean_coredumps
  step "Orphaned /tmp files (>1d)" clean_tmp
  command -v snap    >/dev/null 2>&1 && step "Old snap revisions"       clean_snap_old
  command -v flatpak >/dev/null 2>&1 && step "Unused flatpak runtimes"  flatpak uninstall --unused -y
  if command -v docker >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    step "Unused docker data" clean_docker
  fi
  command -v podman  >/dev/null 2>&1 && step "Unused podman data"       clean_podman
else
  log "no passwordless sudo: skipped root-owned cleanup steps"
fi

EMERGENCY_FLOOR_KB=400000
if [ "$HAVE_SUDO" -eq 1 ] && [ "$(avail_kb)" -lt "$EMERGENCY_FLOOR_KB" ]; then
  log "EMERGENCY: free space under 400MB after standard cleanup — running deeper pass"
  step "Deep journal vacuum (>6h)" deep_journal_vacuum
  step "Deep /tmp sweep (>3h)"     deep_tmp_sweep
fi

after_pct=$(usage_pct)
after_avail=$(avail_kb)
freed_total_mb=$(( (after_avail - before_avail) / 1024 ))
log "=== run end: usage ${after_pct}% (freed ${freed_total_mb}MB) ==="

if [ "${#CLEARED[@]}" -eq 0 ]; then
  summary="Nothing needed clearing."
else
  summary=$(printf '%s\n' "${CLEARED[@]}")
fi

urgency="normal"
title="Disk cleanup — ${after_pct}% used"
top_note=""
if [ "$after_pct" -ge "$THRESHOLD" ]; then
  urgency="critical"
  title="⚠ Disk at ${after_pct}% (≥${THRESHOLD}% threshold)"
  top_note="
Top space users:
$(top_consumers)"
fi

# Hermes (~/.hermes and its code checkout) is never touched by any step
# above — surface its footprint so a high-usage alert isn't mistaken for
# a leak when it's actually just Hermes' legitimate size.
hermes_note=""
if [ -d "$HOME/.hermes" ]; then
  hermes_mb=$(du -sm "$HOME/.hermes" 2>/dev/null | cut -f1)
  hermes_note="
Hermes agent: ~${hermes_mb}MB (not cleaned, excluded by design)"
fi

notify-send -u "$urgency" -i drive-harddisk "$title" "${summary}
Freed ~${freed_total_mb}MB this run${hermes_note}${top_note}"
