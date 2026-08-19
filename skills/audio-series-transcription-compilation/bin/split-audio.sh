#!/usr/bin/env bash
# Split every "<PREFIX> <N>.<ext>" audio/video file in SRC_DIR into fixed-length
# parts via ffmpeg stream copy (lossless, fast — no re-encoding). Produces
# "<PREFIX> <N> - Part <K>.<ext>" files in OUT_DIR.
#
# Usage: split-audio.sh <src_dir> <prefix> [segment_minutes] [out_dir]
# Example: split-audio.sh ~/Downloads "Faith" 29
#          -> ~/Downloads/Faith Parts (29min)/Faith 1 - Part 1.mp4 ...
#
# Safe to re-run: only source files matching "<PREFIX> <N>.<ext>" are touched;
# already-split output is simply overwritten for that N (ffmpeg re-splits fresh
# each run — this script does not skip, since the point is a full authoritative
# re-split if the source changed; delete OUT_DIR first if you want a clean run).
set -euo pipefail

SRC_DIR="${1:?usage: split-audio.sh <src_dir> <prefix> [segment_minutes] [out_dir]}"
PREFIX="${2:?prefix required, e.g. 'Faith'}"
MINUTES="${3:-29}"
OUT_DIR="${4:-$SRC_DIR/$PREFIX Parts (${MINUTES}min)}"
SEGMENT_SECONDS=$(( MINUTES * 60 ))

command -v ffmpeg >/dev/null 2>&1 || {
  echo "ffmpeg not found — install with: sudo apt-get install -y ffmpeg" >&2
  exit 1
}

mkdir -p "$OUT_DIR"
shopt -s nullglob

any=0
for src in "$SRC_DIR"/"$PREFIX "*.*; do
  base=$(basename "$src")
  rest="${base#"$PREFIX "}"
  n="${rest%.*}"
  ext="${base##*.}"
  # skip files that don't match "<PREFIX> <digits>.<ext>" (e.g. transcripts, zips)
  case "$n" in ''|*[!0-9]*) continue ;; esac
  any=1

  tmp=$(mktemp -d)
  ffmpeg -v error -i "$src" -c copy -map 0 -f segment \
    -segment_time "$SEGMENT_SECONDS" -reset_timestamps 1 \
    "$tmp/part_%d.$ext"

  i=1
  for part in $(cd "$tmp" && ls part_*."$ext" | sort -V); do
    mv "$tmp/$part" "$OUT_DIR/$PREFIX $n - Part $i.$ext"
    i=$((i + 1))
  done
  rmdir "$tmp"
  echo "Split $base -> $((i - 1)) parts"
done

[ "$any" -eq 1 ] || echo "No files matching '$PREFIX <N>.<ext>' found in $SRC_DIR"