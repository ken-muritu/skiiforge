---
name: feedback-audio-pipeline-no-default-split
description: "Audio transcription pipeline must compress to one complete file first; splitting into fixed-size chunks is a fallback, not a default step"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 93fae224-09d7-48b6-a711-6ec84cbd0136
  modified: 2026-08-27T21:22:46.083Z
---

Never default to splitting a source recording into fixed-size chunks (e.g. "29-minute parts") before checking whether a compressed single file clears the transcription API's limits. Compress first (mono, moderate bitrate — 64kbps mono was validated), check the result against every real limit, and only split — into the *minimum* part count that clears them — if compression genuinely isn't enough.

**Why:** On 2026-08-26 (Kisumu Day-2 Suleman teaching, three ~1.5–2.5hr source recordings), I force-split every source into fixed 29-minute chunks unconditionally, pattern-matching the original "Faith" series run without checking whether it was actually needed. The user caught this: "we didn't need to put audio in parts just need complete teaching audios." A same-environment precedent (the "God Gives Kingdom" run) had already shown a 101-minute source compressing to 56MB and transcribing whole, no split — that fact was even already recorded in [[reference-skiiforge]]'s memory line ("split if >100MB, else skip") before I started, and I didn't apply it. Redoing it properly also surfaced a second real constraint Modulate doesn't document: an undocumented duration ceiling somewhere between ~1h56m and ~2h26m, distinct from and in addition to the known 100MB size cap — a file can be small enough in bytes and still get rejected for being too long. Both caps now need checking independently. A third constraint found 2026-08-28: the API's format whitelist is `.aac .aiff .flac .mov .mp3 .mp4 .ogg .opus .wav .webm` — **`.m4a` is rejected with 400** even though it's just AAC-in-MP4 (~/bin/transcribe.py's AUDIO_EXTS wrongly lists it); fix is a lossless remux `ffmpeg -i in.m4a -c copy out.mp4`.

**How to apply:** Before running any audio-series-transcription-compilation work, re-read the skill's current Method §1 (updated 2026-08-26, pushed to `ken-muritu/skiiforge`) rather than recalling it from memory — it now leads with "compress to one file, split only as fallback" and documents both caps. `skills/audio-series-transcription-compilation/bin/prepare-audio.sh` automates this (compress → check size+duration → split into minimum parts only if needed) and should be reached for directly instead of hand-rolling the ffmpeg/split-audio.sh steps. When a request references "the same pipeline" or "the same skill" used before, check the actual skill doc and prior session logs for what was really done — don't assume the most recent or most memorable prior run (e.g. the 5-part Faith series, which did need splitting) is representative of the default case.
