#!/usr/bin/env bash
# Hourly reminder-only sweep for uncommitted work.
#
# On an ephemeral live session the one unrecoverable loss is uncommitted work
# when the session dies (it has happened). This never commits, pushes, or
# touches anything — it only notices dirty repos and pings, at most once every
# NUDGE_INTERVAL_SECS per repo, until you commit or stash.
set -uo pipefail

STATE_DIR="$HOME/.local/state/dirty-work-nudge"
LAST_NOTIFY="$STATE_DIR/notified.tsv"     # repo<TAB>epoch_of_last_nudge
LOG_FILE="$STATE_DIR/nudge.log"
NUDGE_INTERVAL_SECS=$(( 2 * 60 * 60 ))    # per-repo re-nudge cadence
DIRTY_MIN_AGE_SECS=$(( 45 * 60 ))         # ignore just-edited work-in-flight
mkdir -p "$STATE_DIR"

log() { echo "$(date -Iseconds) $*" >> "$LOG_FILE"; }
now=$(date +%s)

notify() {
  command -v notify-send >/dev/null 2>&1 && \
    notify-send -u normal -i git "$1" "$2" 2>/dev/null
  return 0
}

# Repo discovery: default roots scanned to depth 4, heavy/never-touch trees
# pruned. Extra roots (one path per line) in ~/.config/guards/project-dirs.
mapfile -t roots < <(
  { cat ~/.config/guards/project-dirs 2>/dev/null || true
    echo "$HOME"
  } | sed "s|^~|$HOME|" | grep -v '^$' | sort -u
)

prune_expr=( \( -name node_modules -o -name .cache -o -name .hermes \
               -o -name .cargo -o -name .rustup -o -name .npm \
               -o -name .local -o -name .config -o -name snap \
               -o -name .claude -o -name .turso \) -prune )

repos=()
for root in "${roots[@]}"; do
  [ -d "$root" ] || continue
  while IFS= read -r g; do
    repos+=( "${g%/.git}" )
  done < <(timeout 60 find "$root" "${prune_expr[@]}" -o \
             -maxdepth 4 -type d -name .git -print 2>/dev/null)
done

declare -A seen=()
dirty_count=0
for repo in "${repos[@]}"; do
  [ -d "$repo/.git" ] || continue
  [ -n "${seen[$repo]:-}" ] && continue
  seen["$repo"]=1

  changes="$(timeout 15 git -C "$repo" status --porcelain 2>/dev/null)" || continue
  [ -n "$changes" ] || continue
  n=$(printf '%s\n' "$changes" | wc -l)

  # Skip brand-new edits: mtime of the newest uncommitted path within window
  newest=0
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    f="${f#??? }"
    f="$(printf '%s' "$f" | sed -e 's/^"//' -e 's/"$//' -e 's/.* -> //')"
    [ -e "$repo/$f" ] || continue
    m=$(stat -c%Y "$repo/$f" 2>/dev/null || echo 0)
    [ "$m" -gt "$newest" ] && newest=$m
  done <<< "$changes"
  [ $(( now - newest )) -ge "$DIRTY_MIN_AGE_SECS" ] || continue

  branch="$(timeout 10 git -C "$repo" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
  last=0
  if [ -f "$LAST_NOTIFY" ]; then
    last=$(awk -F'\t' -v r="$repo" '$1==r{print $2}' "$LAST_NOTIFY")
  fi
  [ $(( now - ${last:-0} )) -ge "$NUDGE_INTERVAL_SECS" ] || continue

  notify "Uncommitted work: $(basename "$repo")" \
    "$n changed file(s) on branch '${branch}'.
Reminder only — nothing is committed or pushed automatically."
  log "nudged: $repo ($n files, branch $branch)"
  printf '%s\t%s\n' "$repo" "$now" >> "$STATE_DIR/.notified.tmp"
  dirty_count=$((dirty_count+1))
done

# merge this round's nudges into the state file, pruning stale entries (>48h)
if [ -f "$STATE_DIR/.notified.tmp" ]; then
  cat "$LAST_NOTIFY" "$STATE_DIR/.notified.tmp" 2>/dev/null | \
    awk -F'\t' -v cutoff=$(( now - 172800 )) '$2 > cutoff' | sort -u -k1,1 > "$LAST_NOTIFY.new"
  mv "$LAST_NOTIFY.new" "$LAST_NOTIFY"
  rm -f "$STATE_DIR/.notified.tmp"
fi

log "scan done: ${#seen[@]} repos checked, $dirty_count nudged"
