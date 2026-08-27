#!/usr/bin/env bash
# Periodic safe disk-usage check + cleanup + desktop notification.
# Runs every 5 min via the disk-cleanup.timer systemd --user unit.
set -uo pipefail

THRESHOLD=75
STATE_DIR="$HOME/.local/state/disk-cleanup"
LOCK_FILE="$STATE_DIR/run.lock"
LOG_FILE="$STATE_DIR/cleanup.log"
TALLY_FILE="$STATE_DIR/offender-tally.tsv"   # per-run "step<TAB>KB freed" rows
BOOT_MARKER="$STATE_DIR/digest-boot-id"      # boot_id already digest-notified
mkdir -p "$STATE_DIR"

# --digest: print cumulative top space-eaters this session (aggregated from
# every step's measured frees) without running any cleanup. Root-cause view:
# shows which tools chronically leak so they can be fixed at the source.
if [ "${1:-}" = "--digest" ]; then
  if [ ! -f "$TALLY_FILE" ]; then
    echo "no offender tally yet (nothing freed since session start)"
    exit 0
  fi
  awk -F'\t' '{s[$1]+=$2} END{for(d in s) printf "%8.0fMB  %s\n", s[d]/1024, d}' "$TALLY_FILE" | sort -rn
  exit 0
fi

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
# /tmp is a SEPARATE tmpfs (RAM-backed), not part of the / overlay df above
# measures — a session scratchpad can balloon there and never move the /
# usage%, while quietly eating real RAM via swap. Tracked independently.
tmp_used_kb()   { df --output=used /tmp | tail -1 | tr -dc '0-9'; }
mem_avail_kb()  { free -k | awk '/^Mem:/{print $7}'; }
swap_used_pct() {
  local total used
  read -r total used < <(free -k | awk '/^Swap:/{print $2, $3}')
  [ "${total:-0}" -gt 0 ] || { echo 0; return; }
  echo $(( used * 100 / total ))
}

MEM_AVAIL_FLOOR_KB=1500000   # <1.5G available RAM
SWAP_USED_PCT_THRESHOLD=40   # >=40% of swap in use

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
      # cumulative per-step tally -> root-cause digest (see --digest / end of run)
      printf '%s\t%s\n' "$desc" "$freed" >> "$TALLY_FILE"
    fi
  else
    log "step failed (non-fatal): $desc"
  fi
}

# Package-manager download caches are pure re-download cost when purged
# preemptively: an unconditional every-5-min purge means every install
# re-fetches everything (slower, more bandwidth, more disk churn from the
# partial downloads themselves). Evict them only when usage is within
# EVICT_MARGIN_PCT of the threshold — i.e. when the space will actually be
# needed soon — and never while a package manager is mid-install, since
# purging its cache under it risks corrupting an in-flight install.
EVICT_MARGIN_PCT=10

pkg_manager_busy() {
  local p
  for p in npm pnpm yarn pip pip3 uv cargo go apt apt-get dpkg; do
    pgrep -x "$p" >/dev/null 2>&1 && return 0
  done
  return 1
}

step_gated() {
  local desc="$1"; shift
  if pkg_manager_busy; then
    log "skip: $desc (package manager running)"
    return 0
  fi
  if [ "$(usage_pct)" -lt $(( THRESHOLD - EVICT_MARGIN_PCT )) ]; then
    log "skip: $desc (usage below ${THRESHOLD}-${EVICT_MARGIN_PCT}% evict line)"
    return 0
  fi
  step "$desc" "$@"
}

# ---- user-space caches (no root needed) ----
clean_trash()    { rm -rf "$HOME"/.local/share/Trash/files/* "$HOME"/.local/share/Trash/info/* 2>/dev/null; }
clean_thumbs()   { [ -d "$HOME/.cache/thumbnails" ] && find "$HOME/.cache/thumbnails" -type f -mtime +7 -delete 2>/dev/null; return 0; }
clean_browsers() {
  local d
  for d in "$HOME/.cache/google-chrome" "$HOME/.cache/BraveSoftware" "$HOME/.cache/chromium" \
           "$HOME"/.cache/mozilla/firefox/*/cache2 "$HOME/.cache/microsoft-edge"; do
    [ -d "$d" ] && find "$d" -mindepth 1 -delete 2>/dev/null
  done
  return 0
}
# Chromium-family browsers (Brave, Chrome, Chromium, Edge) keep their real,
# regenerable disk caches INSIDE the profile under ~/.config/<vendor>/<product>/,
# not under ~/.cache — clean_browsers() above only ever hit an empty path for
# these. Found via audit: Brave-Browser-Beta's Service Worker cache alone was
# 691M, on a 7.7G disk, silently never touched by any prior cleanup step.
# ONLY touches known-regenerable cache subdirs, both at the browser-root level
# and per-profile. Deliberately never touches: Extensions (installed code),
# IndexedDB/File System/Local Extension Settings (real site & extension data),
# History/Cookies/Sessions/Preferences/Web Data/Local Storage/Session Storage/
# Favicons (real browser state — touching these would sign the user out of
# sites, lose saved logins/autofill, lose open tabs, or reset extensions).
clean_chromium_profile_caches() {
  local base profile
  for base in "$HOME/.config/BraveSoftware/Brave-Browser-Beta" \
              "$HOME/.config/BraveSoftware/Brave-Browser" \
              "$HOME/.config/google-chrome" "$HOME/.config/chromium" \
              "$HOME/.config/microsoft-edge"; do
    [ -d "$base" ] || continue
    for d in "$base/GPUPersistentCache" "$base/component_crx_cache" "$base/Safe Browsing"; do
      [ -d "$d" ] && find "$d" -mindepth 1 -delete 2>/dev/null
    done
    for profile in "$base"/Default "$base"/Profile\ *; do
      [ -d "$profile" ] || continue
      for d in "Cache" "Service Worker" "GPUCache" "Code Cache" "DawnCache" "DawnWebGPUCache" "DawnGraphiteCache"; do
        [ -d "$profile/$d" ] && rm -rf "${profile:?}/${d:?}" 2>/dev/null
      done
    done
  done
  return 0
}
# The Claude CLI's self-updater (~/.local/share/claude/versions/<ver>) does
# not clean up its own old versions — found via audit: two full copies
# (2.1.235 + 2.1.237, ~330M each) sitting side by side, only one in use.
# This recurs on every auto-update, so it needs to be a permanent step, not
# a one-off delete. Only ever removes versions OTHER than the one the
# ~/.local/bin/claude symlink currently resolves to.
clean_stale_claude_versions() {
  local versions_dir="$HOME/.local/share/claude/versions"
  local claude_bin
  claude_bin=$(command -v claude 2>/dev/null) || return 0
  [ -d "$versions_dir" ] || return 0
  local active
  active=$(readlink -f "$claude_bin" 2>/dev/null) || return 0
  local f base
  for f in "$versions_dir"/*; do
    [ -f "$f" ] || continue
    [ "$f" = "$active" ] && continue
    base=$(basename "$f")
    rm -f "$f" "$HOME/.local/state/claude/locks/$base.lock" 2>/dev/null
  done
  return 0
}
# NOTE: guards use `|| return 0` (not `&&`) so a merely-absent optional tool
# is not indistinguishable from a real failure in the log — see step().
clean_pip()   { command -v pip  >/dev/null 2>&1 || return 0; pip cache purge; }
clean_npm()   { command -v npm  >/dev/null 2>&1 || return 0; npm cache clean --force; }
clean_yarn()  { command -v yarn >/dev/null 2>&1 || return 0; yarn cache clean; }
clean_go()    { command -v go   >/dev/null 2>&1 || return 0; go clean -cache; }
clean_cargo() { [ -d "$HOME/.cargo/registry/cache" ] && rm -rf "$HOME"/.cargo/registry/cache/*; return 0; }
clean_uv()    { [ -x "$HOME/.hermes/bin/uv" ] && "$HOME/.hermes/bin/uv" cache clean; }
clean_electron_cache() { [ -d "$HOME/.cache/electron" ] && rm -rf "$HOME"/.cache/electron/*; return 0; }

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
# `git gc --auto` only ever compacts .git's own internal object store (loose
# objects -> packs); it never touches tracked/untracked working-tree files,
# so it's safe to run against the live hermes-agent checkout unconditionally.
# git decides internally whether there's actually enough garbage to bother
# repacking, so this is a cheap no-op most runs.
clean_hermes_git_gc() {
  [ -d "$HOME/.hermes/hermes-agent/.git" ] || return 0
  git -C "$HOME/.hermes/hermes-agent" gc --auto --quiet
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
clean_apt_index_cache() { sudo rm -f /var/cache/apt/pkgcache.bin /var/cache/apt/srcpkgcache.bin; return 0; }
# /var/lib/apt/lists/* (the package index, ~350MB after one `apt update`) is
# pure re-download cost, exactly like the download caches — so it gets the
# same gated treatment: purge only near the threshold, never mid-install.
# `apt install` still works after a purge; `apt update` just re-fetches.
clean_apt_lists() { sudo find /var/lib/apt/lists -mindepth 1 -not -name lock -not -name partial -delete 2>/dev/null; return 0; }
# rsyslog files grow UNBOUNDED on live-boot (no logrotate config runs for
# them): found /var/log/syslog at 154MB + 87MB rotated on a 7.7G disk while
# journalctl vacuuming happily left them alone. Rotated copies (>7d) are
# deleted outright; live files >50MB are archived to .1 then truncated in
# place (truncate keeps the inode, so rsyslog keeps writing without a
# restart).
clean_rotated_logs() {
  sudo find /var/log -maxdepth 1 -type f \( -name "*.gz" -o -name "*.1" -o -name "*.old" \) -mtime +7 -delete 2>/dev/null
  local f
  for f in /var/log/syslog /var/log/kern.log /var/log/auth.log; do
    [ -f "$f" ] || continue
    if [ "$(sudo stat -c%s "$f" 2>/dev/null || echo 0)" -gt 52428800 ]; then
      sudo cp "$f" "$f.1" 2>/dev/null && sudo truncate -s 0 "$f" 2>/dev/null
    fi
  done
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
    "$HOME/.config/BraveSoftware" "$HOME/Downloads" \
    /var/cache/apt/archives /var/lib/apt/lists /var/log 2>/dev/null | sort -rh | head -6
}

step "Trash"           clean_trash
step "Thumbnail cache"  clean_thumbs
step "Browser caches"   clean_browsers
step "Chromium profile caches (Service Worker/GPUCache/etc.)" clean_chromium_profile_caches
step "Stale Claude CLI versions" clean_stale_claude_versions
step_gated "pip cache"        clean_pip
step_gated "npm cache"        clean_npm
step_gated "yarn cache"       clean_yarn
step_gated "Go build cache"   clean_go
step_gated "Cargo registry cache" clean_cargo
step_gated "uv package cache" clean_uv
step_gated "Electron download cache" clean_electron_cache
step "Hermes audio/image cache (>2d)" clean_hermes_caches
step "Hermes __pycache__"      clean_hermes_pycache
step "Hermes log rotation (>5MB)" rotate_hermes_logs
step "Hermes misc cache (>1d)" clean_hermes_misc_cache
step "Hermes config backups (keep 3)" rotate_hermes_backups
step "Hermes-agent git gc (safe, working tree untouched)" clean_hermes_git_gc

if systemctl --user is-active --quiet hermes-gateway.service 2>/dev/null; then
  :
elif systemctl --user list-unit-files hermes-gateway.service >/dev/null 2>&1; then
  log "warning: hermes-gateway.service is installed but not active"
fi

if [ "$HAVE_SUDO" -eq 1 ]; then
  step "APT package cache"        sudo apt-get clean
  step "APT autoclean"            sudo apt-get autoclean -y
  step "APT index cache"          clean_apt_index_cache
  step_gated "APT package lists (regenerable)" clean_apt_lists
  step "rsyslog rotate/truncate"  clean_rotated_logs
  step "systemd journal (>2d)"    sudo journalctl --vacuum-time=2d
  step "systemd journal (>100MB)" sudo journalctl --vacuum-size=100M
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

# Predictive, not just reactive: once usage closes on the threshold, run the
# 3-hour /tmp sweep NOW instead of waiting for a full emergency. /tmp is a
# RAM-backed tmpfs the standard 1-day sweep misses for hours; relieving it
# early keeps the session away from both the disk and RAM emergency paths.
if [ "$HAVE_SUDO" -eq 1 ] && [ "$(usage_pct)" -ge $(( THRESHOLD - EVICT_MARGIN_PCT )) ]; then
  log "usage within ${EVICT_MARGIN_PCT}% of threshold — elevated pre-clean"
  step "Elevated: early /tmp sweep (>3h)" deep_tmp_sweep
fi

EMERGENCY_FLOOR_KB=400000
disk_emergency=0
[ "$(avail_kb)" -lt "$EMERGENCY_FLOOR_KB" ] && disk_emergency=1

mem_emergency=0
mem_avail_now=$(mem_avail_kb)
swap_pct_now=$(swap_used_pct)
{ [ "${mem_avail_now:-999999999}" -lt "$MEM_AVAIL_FLOOR_KB" ] || [ "${swap_pct_now:-0}" -ge "$SWAP_USED_PCT_THRESHOLD" ]; } && mem_emergency=1

if [ "$HAVE_SUDO" -eq 1 ] && { [ "$disk_emergency" -eq 1 ] || [ "$mem_emergency" -eq 1 ]; }; then
  [ "$disk_emergency" -eq 1 ] && log "EMERGENCY: free disk space under 400MB after standard cleanup"
  [ "$mem_emergency" -eq 1 ]  && log "EMERGENCY: RAM/swap pressure (avail ${mem_avail_now}KB, swap ${swap_pct_now}% used) — /tmp is a separate RAM-backed tmpfs the standard 1-day sweep misses for hours"
  log "running deeper pass"
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

# / usage% never reflects /tmp (separate RAM-backed tmpfs) or RAM/swap
# pressure — surface both every run so a Hermes-scratch or swap blowup is
# visible before it needs the emergency path above.
tmp_note="
/tmp: $(du -sh /tmp 2>/dev/null | cut -f1) used, RAM avail: $(( $(mem_avail_kb) / 1024 ))MB, swap: ${swap_pct_now}% used"
if [ "$mem_emergency" -eq 1 ]; then
  urgency="critical"
  title="⚠ RAM/swap pressure (swap ${swap_pct_now}%) — ${title#⚠ }"
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

# Compact the tally (aggregate duplicate step names) so it stays tiny, and
# once per boot surface the session's top space-eaters as a digest
# notification — how the next chronic offender gets noticed without grepping
# logs (this is how the Claude-versions and Brave SW-cache leaks were found).
if [ -f "$TALLY_FILE" ]; then
  digest="$(awk -F'\t' '{s[$1]+=$2} END{for(d in s) printf "%d\t%s\n", s[d], d}' "$TALLY_FILE" | sort -rn)"
  printf '%s\n' "$digest" > "$TALLY_FILE"
  boot_id="$(cat /proc/sys/kernel/random/boot_id 2>/dev/null)"
  if [ -n "$boot_id" ] && [ "$(cat "$BOOT_MARKER" 2>/dev/null)" != "$boot_id" ]; then
    top5="$(printf '%s\n' "$digest" | head -5 | awk -F'\t' '{printf "• %s — ~%dMB total\n", $2, $1/1024}')"
    if [ -n "$top5" ]; then
      notify-send -u normal -i drive-harddisk \
        "Session space digest — top eaters" \
        "${top5}
Full list anytime: disk-cleanup.sh --digest"
    fi
    echo "$boot_id" > "$BOOT_MARKER"
    log "digest notified for boot $boot_id"
  fi
fi

notify-send -u "$urgency" -i drive-harddisk "$title" "${summary}
Freed ~${freed_total_mb}MB this run${hermes_note}${tmp_note}${top_note}"
