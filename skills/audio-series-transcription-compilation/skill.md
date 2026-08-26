# Audio Series → Compress (Split if Needed) → Transcribe → Compile → Verify Skill

## Purpose

Turn a folder of long raw audio/video recordings (a multi-part sermon/lecture/talk series,
meeting recordings, etc.) into one polished, chronologically-correct, voice-preserving,
fact-verified markdown document — reproducibly, end to end: get each source recording down to
**one complete audio file** (compress first; only **split** into the minimum number of chunks
if compression genuinely can't get it under the API's limits), **transcribe** each file/chunk
via a speech-to-text API, **consolidate** back into one transcript per source recording (a
no-op if it was never split), **compile** all of it into a single publication-quality document
using an LLM with a specific, load-bearing prompt, then **verify** every scripture/source
citation the compiled document contains against a real source before calling it done.

**Splitting is a fallback, not the default step.** The most common real mistake with this
skill is reaching for a fixed-size split (e.g. "29-minute parts") on every source regardless
of whether it's actually needed. Check Method §1 before doing that — most single sermons/
teachings compress to well under the API's limits as one file, and a single continuous
transcription pass is both cheaper and cleaner (no part-boundary seams to verify) than
stitching chunks back together.

Built and verified on a real 5-part "Faith" sermon series (Pastor Charles Muchemi): 5 source
`.mp4` files (53–99 minutes each) → 17 stream-copy-split parts → 17 real transcriptions via
the Modulate STT API → 5 consolidated per-session transcripts → 1 compiled 6-session teaching
document with correct chronological reordering (the numbered parts were **not** taught in
1-2-3-4-5 order — the compile step had to figure that out from internal evidence). Extended
after a follow-up 3-part "Emotional Intelligence" series (same speaker) surfaced a real
citation error the compiling model was confident about and wrong on — see the Scripture
Citation Rule under Decision Rules and Method §5. Further extended after a 3-source "Kisumu
Day 2" run got the split step backwards — it split every source into fixed 29-minute chunks
unconditionally (matching the *Faith* series' pattern) without first checking whether a
compressed single file would fit under the API's limits, which for a single ~1.5–2.5 hour
sermon it almost always does (a same-environment "God Gives Kingdom" run had already
established this: a 101-minute source compressed to 56MB and was transcribed as one file, no
split at all). That run also surfaced an undocumented **duration** ceiling on top of the known
100MB size ceiling — see "Modulate API Reference" and Method §1.

---

## When to Use

Invoke when a request combines any of:
- "split this audio/video into chunks" + "transcribe it" — the mechanical first half.
- "turn these sermon/lecture/meeting recordings into one document" — the compile step.
- A series of recordings whose *file order* is known to not match the *actual teaching
  order* (very common with sermon series, recurring lecture series, multi-session
  workshops) — this skill's compile step exists specifically for that case.
- "don't leave anything out" + "make it read like [speaker] is talking to the reader" —
  the voice-preservation requirement this skill's prompt is tuned for.

Do NOT use for:
- A single short recording that doesn't need splitting — just transcribe it directly.
- Content where summarization (not full-fidelity compilation) is actually wanted — this
  skill is explicitly anti-summary; see the prompt's "do not leave out a thing."
- Transcription of copyrighted/third-party material without the rights to do so.

---

## Environment Reality (learned the hard way)

| Constraint | Detail | Consequence |
|---|---|---|
| **Filenames with spaces + unquoted bash loops** | `for p in $some_var` where `$some_var` holds space-containing paths silently word-splits — and can leave a stray `cat`/similar command with zero real arguments, which then **hangs reading stdin** instead of erroring. | Never iterate an unquoted variable of paths. Use bash arrays (`arr=("$dir"/*.ext)`) or `nullglob` + a `for f in "$dir"/*.ext` loop with the glob itself quoted-per-token, never `$(ls ...)` fed into an unquoted `for`. |
| **`ffmpeg -f segment -c copy` isn't frame-exact** | Requested 1740s (29min) segments came out as 1740.01–1740.03s in practice — it snaps to the nearest packet/keyframe boundary since there's no re-encode. | Expect ~tens-of-milliseconds drift, not exact cuts. Don't build downstream logic that assumes exact segment lengths. |
| **A binary named `brave`/`ffmpeg`/etc. "works" once, then silently no-ops** | Not applicable to `ffmpeg` specifically here, but the general lesson from this session: always verify a command actually ran (check its real exit code / process count / output file), don't trust that a prior successful invocation means the pattern is reliable every time. | For a batch job (17 files here), verify per-file (duration check, non-empty output) rather than trusting the loop completed cleanly just because it exited 0. |
| **The Modulate STT API is synchronous batch, not async/polling** | `POST /velma-2-stt-batch` blocks until the transcript is ready and returns it directly — no job-id + poll-status dance. | A ~4MB / 29-minute audio part took roughly 1-2 minutes per call in practice. For a full series (17 parts here) budget 20-30 minutes total, run it as a background task, don't block on it synchronously in a foreground call with a short timeout. |
| **Source files can arrive incrementally** | In the real run, `Faith 4.mp4` and `Faith 5.mp4` were dropped into the folder in separate later requests, well after 1-3 were already split/transcribed. | Every script here is written idempotent/incremental by design: `split-audio.sh` only touches files matching the naming pattern, `transcribe.py` skips any file that already has a non-empty transcript. Just re-run the same three commands on the whole folder each time new source files show up. |

---

## Required Inputs

| Input | How to obtain |
|---|---|
| Source recordings | Any filename works for the common single-file-per-source path (Method §1). Only the fallback split path needs the `<PREFIX> <N>.<ext>` convention (e.g. `Faith 1.mp4`) — `split-audio.sh`/`consolidate-transcripts.sh` rely on it to auto-discover parts and derive output names. |
| `ffmpeg` | `sudo apt-get install -y ffmpeg` (also installs `ffprobe`, used to sanity-check durations) |
| A speech-to-text API + key | This skill is written against **Modulate** (`docs.modulate.ai`) — see §"Modulate API Reference" below for the exact contract. Swap `bin/transcribe.py`'s `API_URL`/request shape if using a different provider; the rest of the pipeline (split, consolidate, compile) is provider-agnostic. |
| `python3` + `requests` | `python3 -c "import requests"` to check; `pip install requests` (or your distro's equivalent) if missing. |
| (For the compile step) An LLM with file-attachment or Write-tool access | Either paste the filled-in prompt from `prompts/compile-teaching.md` into a chat with the transcripts attached, or hand an agent the transcripts + that file and ask it to follow the Structural Rulebook directly. |
| (Optional but valuable) Broader-context recordings | Full session/meeting recordings that cover the same material more broadly than the curated numbered parts — these help the compile step recover true chronological order. Not required, but noticeably improves the result if available. |
| (For the verify step) Web access — WebFetch or equivalent | Required to check every scripture/source citation against a real source (e.g. biblegateway.com) instead of trusting the compiling model's memory. An agent without this can't complete Method §5; a chat-route user should verify citations themselves before treating the document as final. |

---

## Modulate API Reference (verified against the real docs and a real call)

- **Base URL:** `https://platform.modulate.ai/api`
- **Auth:** header `X-API-Key: <key>` (not `Authorization: Bearer`)
- **Endpoint used here:** `POST /velma-2-stt-batch` — multilingual, synchronous, speaker
  diarization available
- **Submission:** multipart form, field name `upload_file`
- **Supported formats:** `.aac .aiff .flac .mov .mp3 .mp4 .ogg .opus .wav .webm` — note **`.m4a`
  is NOT supported** despite being a common yt-dlp/ffmpeg output container (see below);
  convert to `.mp3` before uploading.
- **Limits:** 100MB max file size (`413` if exceeded), empty files rejected (`400`) — **and a
  separate, undocumented duration ceiling somewhere between 7,000s (~1h56m, confirmed working)
  and 8,797s (~2h26m, confirmed failing)**, found empirically 2026-08-26: a mono-64kbps-mp3 file
  at 7000s/56MB transcribed fine; the same encode settings on an 8797s/70MB file from a
  different source (well under the 100MB size cap) failed every retry with a `400` "The audio
  could not be processed. It may be corrupted or in an unsupported format." error, even though
  `ffmpeg -f null -` confirmed the file decoded cleanly end to end with zero errors. Splitting
  that one file in half (two ~4400s/35MB parts) transcribed both halves without issue. **Treat
  ~1h55m (6,900s) as the safe per-call ceiling** until narrowed further, and check duration
  independently of size — a file well under 100MB can still fail purely for being too long.
- **Unsupported format is a hard `400`, not a `413`:** uploading `.m4a` (not in the supported-
  formats list) fails fast before any real processing — cheap/harmless to hit by accident (e.g.
  leaving both a source `.m4a` and its converted `.mp3` in the same folder when calling
  `transcribe.py`; the `.m4a` attempt just fails fast and the `.mp3` attempt still succeeds
  right after), but don't rely on that — just don't hand it `.m4a` files in the first place.
- **Response:** `{"text": "...", "duration_ms": N, "utterances": [{"utterance_uuid", "text",
  "start_ms", "duration_ms", "speaker", "language", ...}]}` — this skill's script only uses
  the top-level `text` field; `utterances` is there if you want per-speaker/per-timestamp
  breakdown later.
- **Faster alternative:** `/velma-2-stt-batch-english-vfast` — same shape, English-only,
  faster, no emotion/accent/deepfake signals. Swap `API_URL` in `bin/transcribe.py` if
  speed matters more than the multilingual model's extra signals.
- **API key handling:** store it at `~/.config/modulate/api_key`, `chmod 600`, **never**
  hardcode it in a script or commit it anywhere. Create it with:
  ```bash
  mkdir -p ~/.config/modulate
  umask 077
  printf '<your key>' > ~/.config/modulate/api_key
  chmod 600 ~/.config/modulate/api_key
  ```

---

## Outputs

**Common case — source compresses under both API caps, no split needed:**
```
Downloads/
├── <Source>.m4a                              ← raw download, kept for reference
├── <Source>.mp3                              ← compressed complete file (Method §1)
└── Transcripts/
    └── <Source>.txt                          ← transcribe.py output, one call, no stitching
```
Repeat per source recording; the "compile" step (§4) reads directly from each source's single
`Transcripts/<Source>.txt`. No `consolidate-transcripts.sh` step needed — there's nothing to
join.

**Fallback case — a source is too long/large even compressed, so it was split:**
```
Downloads/
├── <Prefix> Parts (29min)/                  ← split-audio.sh output (or manual -ss/-t cuts
│   ├── <Prefix> 1 - Part 1.mp4                 into the minimum part count, see Method §1)
│   ├── <Prefix> 1 - Part 2.mp4  ...
│   └── Transcripts/                          ← transcribe.py output
│       ├── <Prefix> 1 - Part 1.txt
│       └── ...
├── <Prefix> Transcripts/                     ← consolidate-transcripts.sh output
│   ├── <Prefix> 1.txt   (all its parts joined in order)
│   └── ... one per source recording
└── <Compiled Document Title>.md              ← the final compile step's output
```

Either way, the compile step (§4) produces one `<Compiled Document Title>.md` reading from
whichever per-source transcripts exist (single-file or consolidated) — the compiled document's
structure doesn't change based on which path a given source took to get there.

---

## Method

### 1. Get each source down to one complete file — compress before you split

**Automated:** `bin/prepare-audio.sh <src_dir> <prefix>` does exactly what this section
describes — compresses each `<prefix> <N>.<ext>` source to mono 64kbps mp3, checks the result
against both caps, and only falls back to a minimal split (not a fixed segment length) if it
still doesn't clear them. Prefer this over doing the steps below by hand.

**Default path (works for most single sermons/teachings, up to ~1h55m):** convert straight to
a compact single mp3, no splitting:
```bash
ffmpeg -y -i "Source.m4a" -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 64k "Source.mp3"
```
Downmixing to mono (`-ac 1`) matters — a stereo source at the same bitrate setting roughly
doubles the resulting file size for no transcription-accuracy benefit; speech content is
mono-equivalent anyway. 64kbps mono keeps even a ~2 hour recording around 55-70MB, comfortably
under the 100MB size cap — the *duration* cap (~1h55m safe ceiling, see Modulate API Reference)
is what actually binds first for anything sermon-length or longer, not size.

Check both constraints on the compressed output before deciding you're done:
```bash
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "Source.mp3"
```
If duration ≤ ~6,900s AND size ≤ 100MB: you're done, transcribe this one file, skip splitting
entirely. This is the common case — verified on real single-session teachings from 56min to
~2h03m (Day-2 Kisumu run: three ~1h31m–2h03m sources all compressed to 44-71MB and transcribed
as one file each, no splitting, after an earlier pass on the same sources had wastefully forced
them all through fixed 29-minute chunking instead).

**Fallback (only if the compressed file still exceeds either cap — most often because the
source itself runs longer than ~2 hours):** split into the *minimum* number of roughly-equal
parts that clears both caps, not a fixed default segment length:
```bash
n=$(python3 -c "import math; print(math.ceil(<duration_seconds>/6900))")
# then split into n parts, e.g. via bin/split-audio.sh's segment-time approach, or manual
# ffmpeg -ss/-t cuts at duration/n boundaries — whichever is more convenient for n parts.
bin/split-audio.sh ~/Downloads "Faith" 29   # legacy fixed-minutes form, still fine when a
                                             # source is long enough that a ~29min segment
                                             # length happens to divide it into few-enough parts
```
`bin/split-audio.sh` still exists and still works exactly as before for a genuinely long
source (e.g. the original 5-part *Faith* series, or a multi-hour full-service recording).
Don't reach for it (or any splitting) first — verify the compressed single file doesn't
already clear both caps. When splitting genuinely is needed, prefer the smallest part count
that clears both caps (e.g. a source at 2h26m only needs 2 parts, not 5-6) — verify part
counts/durations before moving on — `ffprobe -v error -show_entries format=duration -of csv=p=0
<file>` on each output.

### 2. Transcribe
```bash
python3 bin/transcribe.py "$HOME/Downloads"                    # common case: whole folder,
                                                                 # single files, one call each
python3 bin/transcribe.py "$HOME/Downloads/Faith Parts (29min)" # fallback case: a Parts folder
```
Run this as a **background** task and check back rather than blocking on it — budget ~1-2 min
per 29-minute part in the fallback case, but a single-file call on a ~1.5-2 hour source takes
proportionally longer (several minutes), not less just because it's one call. Test on one
file first (`transcribe.py <dir> "<name filter>"`) to confirm the API key and request shape
work before committing to a full batch of several sources — cheap insurance against
discovering an auth/format problem partway through.

### 3. Consolidate — only if a source was split
```bash
bin/consolidate-transcripts.sh "$HOME/Downloads/Faith Parts (29min)/Transcripts" "Faith"
```
Joins parts back into one transcript per original recording. Spot-check a join boundary
(the point where two parts meet) to confirm it reads as a natural mid-sentence cut, not
mangled or duplicated text. **Skip this step entirely for any source that stayed a single
file** — its `Transcripts/<Source>.txt` from step 2 already is the complete transcript.

### 4. Compile
Gather the N consolidated transcripts (from step 3) plus any broader-context recordings.
Use `prompts/compile-teaching.md` — either:
  - **Chat route:** paste the filled-in prompt into an LLM chat, attach all the transcripts.
  - **Agent route:** hand an agent (this skill + the transcripts) and have it follow the
    Structural Rulebook in `prompts/compile-teaching.md` directly, writing the `.md` file
    itself.

Either way, the output must satisfy the Validation Checklist below before considering it done.

### 5. Verify every scripture/source citation (required, not optional polish)
Nothing upstream of this step fact-checks anything — split/transcribe/consolidate are purely
mechanical, and an LLM's recall of exact verse wording (or even the right chapter/verse
number) from memory is good but not guaranteed correct. Before the compiled document is
considered done, go back through every citation it contains and, for each one:

1. **Look it up against a real source** (an agent with WebFetch: fetch the passage from an
   authoritative site, e.g. `https://www.biblegateway.com/passage/?search=<ref>&version=<translation>`,
   in the translation the brief specified; a chat-route user without tool access should paste
   the reference into a search themselves) — don't trust the compiling model's memory alone,
   including for very well-known verses. Confident recall of a wrong reference is exactly how
   the reference-run's "Romans 12:4" (members of one body) slipped in for what was clearly
   meant to be Romans 2:4 ("the goodness of God leads you to repentance") — the compiling
   model was sure it was right, and wasn't.
2. **Confirm the reference number actually matches the content being quoted or paraphrased.**
   Speakers misspeak chapter/verse numbers under the pressure of live teaching far more often
   than they misquote the substance — verify the number independently of how confident the
   speaker sounded saying it.
3. **Apply the Scripture Citation Rule below** to render the result — this is where "verified"
   and "voice-preserving" meet: the fix must never come at the cost of erasing what the
   speaker actually said.

---

## Decision Rules

```
IF a source file's numbered order (1, 2, 3...) is assumed to match teaching/recording order
THEN verify against internal evidence first (explicit dates, "last time we...", "this is our
     Nth session" references) — numbered-part order and true chronological order are NOT the
     same thing until proven so. This was true in the reference run (order was NOT 1-2-3-4-5).

IF a scripture/quote is spoken as a paraphrase, OR the speaker's stated chapter/verse number
   does not match the content they are quoting (a misspoken or mistranscribed citation)
THEN apply the Scripture Citation Rule: verify the correct reference against a real source
     (see Method §5), then render BOTH the speaker's own words and the verified citation —
     never one in place of the other, and never silently. Keep the speaker's paraphrase (and
     their spoken reference, if they gave one — even if it was wrong) in the surrounding prose,
     attributed as their own words exactly as said. Immediately follow it with the corrected
     citation supplying the real verse text in a blockquote, so the compiler's correction is
     visibly a correction, not something ventriloquized as the speaker's own statement. Do not
     quietly drop or swap out a wrong reference number as if the speaker had gotten it right —
     that erases real information (it shows what the speaker actually said, uncertainty and
     all) in the name of tidiness. See `prompts/compile-teaching.md` for the exact rendering
     pattern and a worked example.

IF you're about to split a source into fixed-size chunks (e.g. "29-minute parts") without
   first checking whether a compressed single file clears both API caps
THEN stop — that's the exact mistake a real run made (Method §1's "Kisumu Day 2" note). Convert
     to mono + a moderate bitrate first, check duration AND size against the caps, and only
     split if that single file still doesn't clear both. Most single sermons/teachings don't
     need splitting at all.

IF new source recordings land in the folder after earlier ones were already processed
THEN just re-run split → transcribe → consolidate on the whole folder again — all three
     scripts are idempotent/incremental by design and will only touch the new files.

IF a transcription call fails for one file (network error, bad format, API error)
THEN log it and continue to the next file — never let one failure abort the whole batch.
     `transcribe.py` already does this; preserve that behavior in any modification.

IF the compiled document is missing a prayer/declaration/punchline that exists in the source
THEN that's a hard failure of the compile step, not a stylistic nitpick — the prompt's "do
     not leave out a thing" is a completeness requirement, re-run or manually patch it in.
```

---

## Best Practices

- **Compress to one file and check both caps before ever splitting.** This is the single
  highest-value habit this skill teaches — see Method §1. Don't default to splitting just
  because a previous run (even a previous run *in this same skill's history*) split.
- **Verify the pipeline on one file end-to-end before batching.** Whichever path Method §1
  puts you on (single file or split), transcribe one file/part first, confirm the transcript
  reads correctly, *then* run the full batch.
- **Store the API key outside any git-tracked directory**, `chmod 600`, referenced by path
  from the script — never inline in code that might get committed or shared.
- **Run the transcription step as a background/async task** and check back — it's the slow
  part of the pipeline by a wide margin, and blocking on it wastes a foreground turn. A
  single-file call on a ~1.5-2 hour source can itself take several minutes — budget for that,
  don't assume it's fast just because it's one call instead of several.
- **When splitting is genuinely needed, keep the numbered-parts naming convention
  (`<Prefix> <N>.<ext>`) consistent** across a whole series — every script here depends on it
  for auto-discovery.
- **Give the compile step the broader-context recordings if you have them**, even though
  they're "just context" — they're what makes correct chronological reordering possible
  when the numbered parts alone don't carry enough evidence.

---

## Common Pitfalls

0. **Splitting into fixed-size chunks by default, without checking if a compressed single
   file would clear both API caps.** This happened in a real run (three ~1.5-2.5 hour sources
   all force-split into 29-minute parts unconditionally) even though this exact skill's own
   history already had the counter-example (a single 101-minute source compressed to 56MB and
   transcribed whole). Always try Method §1's compress-first path before splitting.
1. **Trusting numbered file order as chronological order.** The whole reason this skill's
   compile prompt exists is that this assumption was wrong in the reference case — Part 1
   was not taught first.
2. **Iterating filenames-with-spaces via an unquoted bash variable.** Silently mangles paths
   and can hang a stray command reading stdin. Always use arrays or a properly quoted glob.
3. **Letting the compile step transcribe the speaker's spoken paraphrase — or a misspoken
   chapter/verse number — as the literal scripture/source citation, without verifying it.**
   Confident recall from memory is not verification; look the reference up against a real
   source. And the fix is not "quietly swap in the correct citation" — that deletes what the
   speaker actually said. Keep the paraphrase (and any spoken reference, right or wrong) in
   the prose as their own words, and follow it with the verified citation. See the Scripture
   Citation Rule under Decision Rules.
4. **Summarizing instead of compiling.** The brief explicitly wants completeness ("do not
   leave out a thing") and voice preservation ("as if [speaker] is speaking directly") — a
   third-person condensed summary fails the brief even if it's well-written.
5. **Assuming `ffmpeg -f segment` gives frame-exact cuts.** It doesn't, with stream copy —
   expect small (sub-second) drift; don't build anything downstream that depends on exact
   segment boundaries.
6. **Blocking on the transcription batch in a short-timeout foreground call.** It's slow
   (minutes per file); run it in the background.
7. **Forgetting to re-run the pipeline when new source files show up.** Every script here is
   safe to re-run on the whole folder — do that rather than trying to run a one-off command
   for just the new file (easy to get the naming/output-folder wrong doing it manually).

---

## Patterns

### Safe iteration over filenames with spaces (the bug that actually hung a command this run)
```bash
# WRONG — word-splits on spaces, can hang a downstream command reading empty stdin
parts=$(ls "$dir"/*.txt)
for p in $parts; do cat "$p"; done

# RIGHT — array + quoted expansion
shopt -s nullglob
parts=("$dir"/*.txt)
IFS=$'\n' parts=($(printf '%s\n' "${parts[@]}" | sort -V)); unset IFS
for p in "${parts[@]}"; do cat "$p"; done
```

### Idempotent per-file processing (used by transcribe.py)
```python
out_path = out_dir / (path.stem + ".txt")
if out_path.exists() and out_path.stat().st_size > 0:
    print(f"skip (already done): {path.name}")
    continue
```

### Verify a batch ffmpeg split actually produced the expected part count
```bash
total_s=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
expected_parts=$(python3 -c "import math; print(math.ceil($total_s/1740))")
actual_parts=$(ls "$out_dir/$prefix $n - Part "*.* | wc -l)
[ "$expected_parts" -eq "$actual_parts" ] || echo "MISMATCH: expected $expected_parts, got $actual_parts"
```

---

## Validation Checklist

- [ ] Every source was compressed to a single mono file and checked against BOTH the 100MB
      size cap and the ~1h55m duration cap before deciding whether it needed splitting at all.
- [ ] `ffmpeg`/`ffprobe` confirmed installed.
- [ ] If a source did need splitting: part count matches the minimum needed to clear both
      caps, not a fixed default segment length assumed without checking.
- [ ] No `.m4a` (or other unsupported-format) file was left for `transcribe.py` to attempt —
      harmless if it happens, but check for it rather than relying on the fast-fail.
- [ ] API key stored at `~/.config/modulate/api_key`, `chmod 600`, not present in any script.
- [ ] One file transcribed and manually read before running the full batch.
- [ ] Transcription run as background/async, not blocking a short-timeout foreground call.
- [ ] Every source file has a corresponding non-empty `.txt` transcript (no silent skips due
      to a bug rather than genuine "already done").
- [ ] If any sources were split: consolidated per-recording transcripts read naturally across
      part-join boundaries.
- [ ] Compiled document's session order verified against internal evidence, not assumed from
      file numbering.
- [ ] Every prayer/declaration/punchline/named-illustration from the source transcripts is
      present in the compiled document.
- [ ] Every scripture/source citation was verified against a real source (not taken on the
      compiling model's memory alone) — both the reference number and the wording.
- [ ] Every corrected citation still shows the speaker's own words/reference as they actually
      said them (right or wrong), immediately followed by the verified citation — never one
      silently swapped for the other.
- [ ] Document reads in first/second person, addressed to the reader — not third-person
      summary.
- [ ] Structural Rulebook sections all present: title block, epigraph, framing note, PART
      sections in chronological order, closing prayer, summary table, core-declarations list,
      closing pull-quote, footer attribution.

---

## Notes

- Built and verified with the Modulate STT API specifically; swapping providers only
  requires changing `bin/transcribe.py`'s request/response handling — `split-audio.sh` and
  `consolidate-transcripts.sh` don't care which transcription provider was used.
- The compile step's quality depends heavily on the exact prompt wording in
  `prompts/compile-teaching.md` — the annotated "load-bearing phrases" section there explains
  why each clause matters, so adapt carefully rather than paraphrasing the prompt loosely.
- This skill was built for a sermon series specifically, but nothing about it is
  faith-content-specific — swap "scripture" for whatever authoritative source citations your
  content uses (case law, academic references, a technical spec) and the same structure and
  prompt logic applies to any multi-session teaching/lecture/talk series.