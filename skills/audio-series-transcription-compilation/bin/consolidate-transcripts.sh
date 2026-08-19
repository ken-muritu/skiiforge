#!/usr/bin/env bash
# Join "<PREFIX> <N> - Part <K>.txt" transcripts back into one "<PREFIX> <N>.txt"
# per original source recording, parts concatenated in order with a blank-line
# join (part boundaries land mid-sentence — that's expected, not a bug).
#
# Usage: consolidate-transcripts.sh <transcripts_dir> <prefix> [out_dir]
# Example: consolidate-transcripts.sh "~/Downloads/Faith Parts (29min)/Transcripts" "Faith"
#          -> ~/Downloads/Faith Transcripts/Faith 1.txt ... Faith 5.txt
set -euo pipefail

T="${1:?usage: consolidate-transcripts.sh <transcripts_dir> <prefix> [out_dir]}"
PREFIX="${2:?prefix required, e.g. 'Faith'}"
OUT="${3:-$(dirname "$T")/$PREFIX Transcripts}"
mkdir -p "$OUT"

shopt -s nullglob

# Discover distinct <N> values from "<PREFIX> <N> - Part <K>.txt" filenames.
# IMPORTANT: iterate the glob as an array, never `for x in $unquoted_var` —
# filenames here always contain spaces and word-splitting will silently mangle
# paths (and can even hang a stray `cat` reading stdin on a malformed arg).
declare -A seen
for f in "$T"/"$PREFIX "*" - Part "*.txt; do
  base=$(basename "$f")
  rest="${base#"$PREFIX "}"
  n="${rest%% - Part *}"
  seen["$n"]=1
done

if [ "${#seen[@]}" -eq 0 ]; then
  echo "No '$PREFIX <N> - Part <K>.txt' files found in $T"
  exit 0
fi

for n in "${!seen[@]}"; do
  parts=("$T"/"$PREFIX $n - Part "*.txt)
  IFS=$'\n' parts=($(printf '%s\n' "${parts[@]}" | sort -V))
  unset IFS

  out="$OUT/$PREFIX $n.txt"
  : > "$out"
  first=1
  for p in "${parts[@]}"; do
    [ "$first" -eq 0 ] && printf '\n\n' >> "$out"
    cat "$p" >> "$out"
    first=0
  done
  echo "$PREFIX $n.txt <- ${#parts[@]} parts, $(wc -c < "$out") chars"
done