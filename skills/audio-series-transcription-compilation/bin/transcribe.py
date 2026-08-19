#!/usr/bin/env python3
"""Transcribe every audio/video file in a folder via the Modulate STT batch API.

Usage: transcribe.py <src_dir> [name_filter]

Reads the API key from ~/.config/modulate/api_key (create it with `chmod 600`
BEFORE running this — never hardcode the key in this script or commit it
anywhere). Writes "<name>.txt" into a Transcripts/ subfolder of src_dir.

Idempotent: skips any file that already has a non-empty .txt transcript, so
it's safe to re-run on a folder that new source files keep landing in over
time — only the new ones get transcribed.
"""
import sys
import time
from pathlib import Path

import requests

# Modulate STT — multilingual batch model, synchronous, .mp3/.mp4/.wav/etc,
# 100MB file limit. See https://docs.modulate.ai/get-started/stt for the full
# reference (other endpoints: english-only "vfast" variant, streaming/WebSocket).
API_URL = "https://platform.modulate.ai/api/velma-2-stt-batch"
KEY_FILE = Path.home() / ".config/modulate/api_key"

AUDIO_EXTS = (
    ".mp3", ".mp4", ".wav", ".m4a", ".aac", ".flac",
    ".ogg", ".opus", ".webm", ".aiff", ".mov",
)


def get_api_key() -> str:
    if not KEY_FILE.exists():
        sys.exit(
            f"API key not found at {KEY_FILE}\n"
            f"Create it first: umask 077 && printf '<your key>' > {KEY_FILE} && chmod 600 {KEY_FILE}"
        )
    return KEY_FILE.read_text().strip()


def transcribe(path: Path, api_key: str) -> str:
    with open(path, "rb") as f:
        resp = requests.post(
            API_URL,
            headers={"X-API-Key": api_key},
            data={"speaker_diarization": "true"},
            files={"upload_file": (path.name, f, "application/octet-stream")},
            timeout=600,
        )
    resp.raise_for_status()
    return resp.json().get("text", "")


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: transcribe.py <src_dir> [name_filter]")
    src_dir = Path(sys.argv[1]).expanduser()
    only = sys.argv[2] if len(sys.argv) > 2 else None
    out_dir = src_dir / "Transcripts"
    out_dir.mkdir(parents=True, exist_ok=True)

    api_key = get_api_key()
    files = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in AUDIO_EXTS)
    if only:
        files = [f for f in files if only in f.name]
    if not files:
        print("No matching audio files found.")
        return

    for path in files:
        out_path = out_dir / (path.stem + ".txt")
        if out_path.exists() and out_path.stat().st_size > 0:
            print(f"skip (already done): {path.name}")
            continue
        print(f"transcribing: {path.name} ({path.stat().st_size / 1e6:.1f}MB) ...", flush=True)
        try:
            text = transcribe(path, api_key)
        except requests.HTTPError as e:
            body = e.response.text[:300] if e.response is not None else ""
            print(f"  FAILED: {e} — {body}")
            continue
        except Exception as e:
            print(f"  FAILED: {e!r}")
            continue
        out_path.write_text(text, encoding="utf-8")
        print(f"  saved: {out_path.name} ({len(text)} chars)")
        time.sleep(1)  # be polite between calls; no documented rate limit but don't hammer it


if __name__ == "__main__":
    main()