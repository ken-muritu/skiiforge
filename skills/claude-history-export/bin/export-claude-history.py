#!/usr/bin/env python3
"""Export ~/.claude session history + memory to skiiforge/claude/, redacting secrets.

Never prints secret values. Reads known-secret sources locally, builds an
exact-match + regex redaction pass, applies it to every text file being
exported, then gzips session transcripts and writes an index.
"""
import gzip
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone

HOME = Path.home()
CLAUDE = HOME / ".claude"
PROJECTS = CLAUDE / "projects"
REPO = Path(os.environ.get("SKIIFORGE_REPO", str(HOME / "skiiforge")))
OUT = REPO / "claude"

REDACT = "[REDACTED-by-export]"

# ---------------------------------------------------------------------------
# 1. Collect exact known secret values (never printed)
# ---------------------------------------------------------------------------
known_secrets = set()

modulate_key = CLAUDE.parent / ".config" / "modulate" / "api_key"
if modulate_key.exists():
    v = modulate_key.read_text().strip()
    if v:
        known_secrets.add(v)

try:
    r = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=10)
    v = r.stdout.strip()
    if v:
        known_secrets.add(v)
except Exception:
    pass

cred_file = CLAUDE / ".credentials.json"
if cred_file.exists():
    try:
        data = json.loads(cred_file.read_text())
        def walk(o):
            if isinstance(o, dict):
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
            elif isinstance(o, str) and len(o) >= 16:
                known_secrets.add(o)
        walk(data)
    except Exception:
        pass

# any stray .env files anywhere under home (none found at export time, but stay defensive)
for envf in HOME.glob("**/.env"):
    try:
        for line in envf.read_text(errors="ignore").splitlines():
            m = re.match(r'^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$', line)
            if not m:
                continue
            key, val = m.group(1), m.group(2).strip().strip('"').strip("'")
            if re.search(r'(KEY|TOKEN|SECRET|PASSWORD|PWD)', key, re.I) and len(val) >= 8:
                known_secrets.add(val)
    except Exception:
        pass

print(f"[redact] collected {len(known_secrets)} exact known-secret value(s) (not shown)")

# sort longest-first so substrings don't get partially clobbered before the full match
known_secrets_sorted = sorted(known_secrets, key=len, reverse=True)

# ---------------------------------------------------------------------------
# 2. Regex safety net for common secret shapes
# ---------------------------------------------------------------------------
REGEXES = [
    re.compile(r'AIza[0-9A-Za-z\-_]{35}'),                              # Google API key
    re.compile(r'gh[oprsu]_[0-9A-Za-z]{30,255}'),                        # GitHub OAuth/PAT (classic)
    re.compile(r'github_pat_[0-9A-Za-z_]{20,255}'),                      # GitHub fine-grained PAT
    re.compile(r'vcp_[0-9A-Za-z]{10,100}'),                              # Vercel token (as pasted historically)
    re.compile(r'sk-ant-[0-9A-Za-z\-_]{20,}'),                           # Anthropic API key
    re.compile(r'sk-[A-Za-z0-9]{20,}'),                                  # generic sk- style key
    re.compile(r'AKIA[0-9A-Z]{16}'),                                     # AWS access key id
    re.compile(r'xox[baprs]-[0-9A-Za-z\-]{10,}'),                        # Slack token
    re.compile(r'-----BEGIN[ A-Z]*PRIVATE KEY-----[\s\S]*?-----END[ A-Z]*PRIVATE KEY-----'),
    re.compile(r'(Bearer\s+)([A-Za-z0-9\-_.=]{15,})'),                   # Authorization: Bearer <tok>
    re.compile(r'("(?:x-api-key|api[_-]?key|apikey|access[_-]?token|secret|client[_-]?secret|password)"\s*:\s*")([^"]{6,})(")', re.I),
]

def redact_text(text: str) -> str:
    for s in known_secrets_sorted:
        if s and s in text:
            text = text.replace(s, REDACT)
    for rx in REGEXES:
        if rx.groups >= 2:
            text = rx.sub(lambda m: m.group(1) + REDACT + (m.group(3) if rx.groups >= 3 else ""), text)
        else:
            text = rx.sub(REDACT, text)
    return text

# ---------------------------------------------------------------------------
# 3. Discover sessions across all project dirs
# ---------------------------------------------------------------------------
def classify_bucket(text: str) -> set:
    models = set(re.findall(r'"model"\s*:\s*"([^"]+)"', text))
    return models

def bucket_for(models: set) -> str:
    for m in models:
        if m.startswith("claude-") or "anthropic" in m.lower():
            return "anthropic"
    for m in models:
        if "ox-alpha" in m or m.startswith("stealth/"):
            return "ox-alpha"
    if models:
        # some other real model tag we haven't seen before -- keep visible, don't silently bucket as anthropic
        return "other"
    return "unclassified"

sessions = {}  # session_id -> {"jsonl": Path, "project_dir": Path}
for proj_dir in sorted(PROJECTS.iterdir()):
    if not proj_dir.is_dir():
        continue
    for jf in proj_dir.glob("*.jsonl"):
        sid = jf.stem
        sessions[sid] = {"jsonl": jf, "project_dir": proj_dir}

print(f"[scan] found {len(sessions)} session transcript(s) across {len(list(PROJECTS.iterdir()))} project dir(s)")

# ---------------------------------------------------------------------------
# 4. Wipe and rebuild claude/sessions/*, writing redacted+gzipped copies
# ---------------------------------------------------------------------------
sessions_root = OUT / "sessions"
for old_bucket in ("anthropic", "ox-alpha", "unclassified", "other"):
    d = sessions_root / old_bucket
    if d.exists():
        for f in d.rglob("*"):
            if f.is_file():
                f.unlink()

index_rows = []
other_models_seen = set()

for sid, info in sorted(sessions.items()):
    jf = info["jsonl"]
    raw = jf.read_text(errors="ignore")
    models = classify_bucket(raw)
    bucket = bucket_for(models)
    other_models_seen |= (models if bucket == "other" else set())
    bucket_dir = sessions_root / bucket
    bucket_dir.mkdir(parents=True, exist_ok=True)

    redacted = redact_text(raw)

    MAX_GZ_BYTES = 90 * 1024 * 1024  # stay safely under GitHub's 100MB hard limit

    def gzip_size(text: str) -> int:
        return len(gzip.compress(text.encode("utf-8")))

    lines = redacted.splitlines(keepends=True)
    whole_size = gzip_size(redacted) if lines else 0

    total_out_bytes = 0
    if whole_size <= MAX_GZ_BYTES:
        out_gz = bucket_dir / f"{sid}.jsonl.gz"
        with gzip.open(out_gz, "wt", encoding="utf-8") as f:
            f.write(redacted)
        total_out_bytes = out_gz.stat().st_size
    else:
        # split into balanced line-chunks until every part's gzip size clears the cap
        n_parts = 2
        while True:
            chunk_len = -(-len(lines) // n_parts)  # ceil
            chunks = ["".join(lines[i:i + chunk_len]) for i in range(0, len(lines), chunk_len)]
            sizes = [gzip_size(c) for c in chunks]
            if all(s <= MAX_GZ_BYTES for s in sizes):
                break
            n_parts += 1
        for i, chunk in enumerate(chunks, start=1):
            part_gz = bucket_dir / f"{sid}.part{i}-of-{len(chunks)}.jsonl.gz"
            with gzip.open(part_gz, "wt", encoding="utf-8") as f:
                f.write(chunk)
            total_out_bytes += part_gz.stat().st_size
        print(f"[split] {sid}: {whole_size/1e6:.0f}MB whole -> {len(chunks)} parts (line-ordered, concat gunzip to restore)")

    # timestamps: first/last "timestamp" field in the transcript
    ts_matches = re.findall(r'"timestamp"\s*:\s*"([^"]+)"', raw)
    first_ts = ts_matches[0] if ts_matches else ""
    last_ts = ts_matches[-1] if ts_matches else ""

    size_kb = total_out_bytes // 1024

    # subagents + tool-results, if the project has a same-named subdir
    session_subdir = info["project_dir"] / sid
    n_subagents = 0
    if session_subdir.is_dir():
        sub_src = session_subdir / "subagents"
        if sub_src.is_dir():
            sub_dst = bucket_dir / f"{sid}-subagents"
            sub_dst.mkdir(parents=True, exist_ok=True)
            for f in sub_src.iterdir():
                content = f.read_text(errors="ignore")
                content = redact_text(content)
                if f.suffix == ".jsonl":
                    with gzip.open(sub_dst / (f.name + ".gz"), "wt", encoding="utf-8") as out:
                        out.write(content)
                    n_subagents += 1
                else:
                    (sub_dst / f.name).write_text(content, encoding="utf-8")

        tr_src = session_subdir / "tool-results"
        if tr_src.is_dir():
            tr_dst = bucket_dir / f"{sid}-tool-results"
            tr_dst.mkdir(parents=True, exist_ok=True)
            for f in tr_src.iterdir():
                if not f.is_file():
                    continue
                try:
                    content = f.read_text(errors="ignore")
                except Exception:
                    continue
                content = redact_text(content)
                with gzip.open(tr_dst / (f.name + ".gz"), "wt", encoding="utf-8") as out:
                    out.write(content)

    index_rows.append({
        "id": sid,
        "bucket": bucket,
        "models": ", ".join(sorted(models)) if models else "(none recorded)",
        "size_kb": size_kb,
        "first_ts": first_ts,
        "last_ts": last_ts,
        "subagents": n_subagents,
        "project": info["project_dir"].name,
    })

if other_models_seen:
    print(f"[bucket] NEW/unrecognized model tag(s) bucketed as 'other', review: {sorted(other_models_seen)}")

# ---------------------------------------------------------------------------
# 5. Index
# ---------------------------------------------------------------------------
index_rows.sort(key=lambda r: r["first_ts"])
lines = [
    "# Session index",
    "",
    "| id | bucket | model(s) | size (gz) | first ts | last ts | subagents | project dir |",
    "|---|---|---|---|---|---|---|---|",
]
for r in index_rows:
    lines.append(
        f"| {r['id']} | {r['bucket']} | {r['models']} | {r['size_kb']}KB | {r['first_ts']} | {r['last_ts']} | {r['subagents']} | {r['project']} |"
    )
(sessions_root / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"[index] wrote {len(index_rows)} rows")

# ---------------------------------------------------------------------------
# 6. Memory mirror
# ---------------------------------------------------------------------------
mem_src = PROJECTS / "-home-pop-os" / "memory"
mem_dst = OUT / "memory"
if mem_dst.exists():
    for f in mem_dst.glob("*"):
        f.unlink()
mem_dst.mkdir(parents=True, exist_ok=True)
n_mem = 0
if mem_src.is_dir():
    for f in mem_src.glob("*.md"):
        content = redact_text(f.read_text(errors="ignore"))
        (mem_dst / f.name).write_text(content, encoding="utf-8")
        n_mem += 1
print(f"[memory] copied {n_mem} memory file(s)")

# ---------------------------------------------------------------------------
# 7. Prompt history (~/.claude/history.jsonl) -> claude/history.jsonl.gz
# ---------------------------------------------------------------------------
hist_src = CLAUDE / "history.jsonl"
if hist_src.exists():
    content = redact_text(hist_src.read_text(errors="ignore"))
    with gzip.open(OUT / "history.jsonl.gz", "wt", encoding="utf-8") as out:
        out.write(content)
    print(f"[history] exported prompt history ({hist_src.stat().st_size} bytes raw)")

# ---------------------------------------------------------------------------
# 8. settings.json (small, plain)
# ---------------------------------------------------------------------------
settings_src = CLAUDE / "settings.json"
if settings_src.exists():
    content = redact_text(settings_src.read_text(errors="ignore"))
    (OUT / "settings.json").write_text(content, encoding="utf-8")

print("[done] export pass complete")
