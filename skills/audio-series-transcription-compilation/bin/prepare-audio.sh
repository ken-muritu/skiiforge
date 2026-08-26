#!/usr/bin/env bash
# Prepare "<PREFIX> <N>.<ext>" source recordings for transcription. Re-encodes
# each to a compact mono mp3 and uses it as ONE COMPLETE file whenever it fits
# under the Modulate API's limits — splitting is a FALLBACK, not the default.
# Run this before transcribe.py; only reach for split-audio.sh directly if you
# have a specific reason to want fixed-length parts instead of the minimal
# split this script falls back to.
#
# Usage: prepare-audio.sh <src_dir> <prefix> [out_dir]
# Example: prepare-audio.sh ~/Downloads "KisumuD2Testimony"
#   -> fits under both caps:     ~/Downloads/KisumuD2Testimony 1.mp3   (one file)
#   -> doesn't fit either cap:   ~/Downloads/KisumuD2Testimony Parts/KisumuD2Testimony 1 - Part 1.mp3, ...
#
# Known Modulate limits (see skill.md "Modulate API Reference"):
#   - 100MB max file size (DOCUMENTED — a 413 if exceeded).
#   - ~2 hour max duration (UNDOCUMENTED, found empirically 2026-08-26: a
#     7000s/56MB mono-64k file transcribed fine; an 8797s/70MB file from the
#     same encode settings — well under the 100MB cap — failed every retry
#     with a 400 "audio could not be processed" error. Treat both caps as
#     real; hitting either one requires a split, hitting neither means don't
#     split at all.)
#
# This script re-encodes to mono 64kbps mp3 regardless of source format —
# that's plenty for STT accuracy (validated across every teaching processed
# with this skill so far) and is what buys the size headroom that avoids
# splitting in the first place for anything up to ~2.9 hours of raw audio.
set -euo pipefail

SRC_DIR="${1:?usage: prepare-audio.sh <src_dir> <prefix> [out_dir]}"
PREFIX="${2:?prefix required, e.g. 'Faith'}"
OUT_DIR="${3:-$SRC_DIR}"

SIZE_CAP_BYTES=$((95 * 1000 * 1000))   # 95MB — 5MB margin under the documented 100MB cap
DURATION_CAP_S=7000                     # ~1h56m — margin under the empirical ~2h20m failure point

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found — install with: sudo apt-get install -y ffmpeg" >&2; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "ffprobe not found (ships with ffmpeg)" >&2; exit 1; }

mkdir -p "$OUT_DIR"
shopt -s nullglob

any=0
for src in "$SRC_DIR"/"$PREFIX "*.*; do
  base=$(basename "$src")
  rest="${base#"$PREFIX "}"
  n="${rest%.*}"
  # skip files that don't match "<PREFIX> <digits>.<ext>" (transcripts, zips, etc.)
  case "$n" in ''|*[!0-9]*) continue ;; esac
  # don't re-process our own output on a re-run
  case "$base" in *.mp3) if [ "$src" -ef "$OUT_DIR/$base" ] 2>/dev/null; then continue; fi ;; esac
  any=1

  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  dur_i=${dur%.*}

  compact="$OUT_DIR/$PREFIX $n.mp3"
  if [ -e "$compact" ]; then
    echo "$base -> $(basename "$compact") already exists, skipping re-encode (delete it to force)"
  else
    ffmpeg -y -v error -i "$src" -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 64k "$compact"
  fi
  sz=$(stat -c%s "$compact")

  if [ "$sz" -le "$SIZE_CAP_BYTES" ] && [ "$dur_i" -le "$DURATION_CAP_S" ]; then
    echo "$base -> $(basename "$compact") — COMPLETE, one file (${sz} bytes, ${dur_i}s) — no split needed"
    continue
  fi

  echo "$base -> compact encode is ${sz} bytes / ${dur_i}s — exceeds a cap, splitting (fallback)"
  rm -f "$compact"

  # Split into the MINIMUM number of equal parts that clears both caps —
  # not a fixed default length. Almost always just 2 parts in practice,
  # since this branch only triggers when a source barely exceeds a cap.
  parts_by_size=$(( (sz + SIZE_CAP_BYTES - 1) / SIZE_CAP_BYTES ))
  parts_by_dur=$(( (dur_i + DURATION_CAP_S - 1) / DURATION_CAP_S ))
  parts=$parts_by_size
  [ "$parts_by_dur" -gt "$parts" ] && parts=$parts_by_dur
  seg_s=$(( (dur_i + parts - 1) / parts ))

  part_dir="$OUT_DIR/$PREFIX Parts"
  mkdir -p "$part_dir"
  i=1
  offset=0
  while [ "$offset" -lt "$dur_i" ]; do
    ffmpeg -y -v error -ss "$offset" -t "$seg_s" -i "$src" -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 64k \
      "$part_dir/$PREFIX $n - Part $i.mp3"
    offset=$((offset + seg_s))
    i=$((i + 1))
  done
  echo "$base -> split into $((i - 1)) part(s) under $part_dir — transcribe.py that directory, then bin/consolidate-transcripts.sh \"$part_dir/Transcripts\" \"$PREFIX\" to rejoin (it discovers whatever part count actually exists, no fixed-count assumption)"
done

[ "$any" -eq 1 ] || echo "No files matching '$PREFIX <N>.<ext>' found in $SRC_DIR"
