# Android App Demo Video Skill (adb capture → branded 9:16 edit)

## Purpose

Turn a real Android app, driven live over `adb` on a physical (or emulated) device, into
a polished, mobile-native (9:16) marketing demo video — with a branded intro, contextual
callouts (bubble captions + arrows pointing at the actual UI element being discussed),
smooth cross-dissolve transitions, and a layered music+SFX audio mix — without re-deriving
the timing, coordinate-math, and tooling pitfalls documented below.

This skill encodes the *method*, not one app. It was built and fully verified producing a
~50s vertical demo of a car-rental app ("Ardena") for a WhatsApp send, through **seven**
full revision cycles driven by real user feedback (pacing, transition polish, contextual
captions, a real timing bug, brand-color correction). Another agent should be able to point
this at a different Android app and reproduce a professional result on the first or second
pass instead of the seventh.

---

## When to Use

Invoke when a request combines any of:
- "record my phone screen and turn it into a demo video" / "app walkthrough video."
- "make this look professional" for a screen-recording-based product video.
- "add captions/callouts that point to what's happening on screen."
- "convert this to 9:16 / vertical / TikTok-Reels-Shorts format."
- Sourcing royalty-free music/SFX for a video without a paid license.
- Compositing a screenshot or poster onto a "hand holding phone" mockup photo.
- Any request to drive a real Android app's UI via `adb` for capture purposes (not just
  screenshots — this skill is specifically about turning that into an edited video).

Do NOT use to:
- Take a handful of one-off screenshots with no video/editing component (that's simpler —
  just `adb exec-out screencap`, no need for this whole pipeline).
- Automate destructive real-world actions inside the app being demoed (real payments, real
  bookings, messaging real support staff) — the whole point of the capture discipline below
  is staying inside safe, reversible UI states.
- Web app screenshots/video — this is Android-device-specific (`adb`/`screenrecord`). See
  `webapp-screenshot-library` for the Playwright equivalent on web apps.

---

## Environment Reality (learned the hard way)

| Constraint | Detail | Consequence |
|---|---|---|
| **Cold app launch is much slower than it feels like it should be** | A real app on a mid/low-end device took **~14 seconds** from `monkey -c android.intent.category.LAUNCHER` to a fully interactive first screen. Assuming 2-4s and proceeding blind caused every subsequent tap to land on the wrong screen. | Always measure once with a live screenshot-poll before scripting a blind sequence: launch, then screenshot at increasing intervals (2s, 4s, 6s...) until the target screen is confirmed, and use *that* number (with a small margin) everywhere else. |
| **Each separate `adb shell` invocation carries real overhead (~1-1.5s+)** | A single bash script issuing 10+ separate `adb shell input tap ...` calls drifted the *cumulative* real-world timing far ahead of what the sum of `sleep`s implied — early taps fired on the wrong (still-loading) screen, later taps landed on whatever screen happened to be showing by the time they finally executed, not the one intended. This produced a "monkey-testing" cascade where taps meant for a "Reserve" button coincidentally landed on bottom-nav tabs instead (see Common Pitfalls #3). | Prefer **one continuous take per scene** with generous, empirically-measured sleeps, and verify with a screenshot immediately before trusting a multi-step blind sequence, rather than assuming linear sleep-sum timing holds. |
| **The recording process itself has its own brief startup hitch** | The very first `adb shell input tap` issued within ~1s of starting `adb shell screenrecord ...` was reliably swallowed — no visible effect — even though the identical tap worked perfectly when tested live (no recording) moments earlier. | Add a 2.5s+ buffer after starting `screenrecord` before the first interaction inside that same take. |
| **`adb push` does NOT make a file appear in the phone's media apps** | Files pushed straight into `/sdcard/Download/` are invisible to Gallery/Video-library apps until the system's media index (MediaStore) knows about them. The classic fix, `am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://...`, is unreliable on modern Android (implicit-broadcast restrictions) and silently did nothing here. | Use `adb shell content insert --uri content://media/external/video/media --bind _data:s:"/storage/emulated/0/Download/<file>" --bind mime_type:s:"video/mp4"` for each file — confirmed reliable. **Verify by actually opening the target app yourself** (find its real launcher activity via `adb shell dumpsys package <pkg> | grep -B2 android.intent.action.MAIN`, not the package's "obvious"-looking activity name, which may be a hidden internal player component rather than the library/browser UI the user actually sees) and screenshotting it — don't just trust that the insert command exited 0. |
| **A phone left connected across a long multi-hour session accumulates real notifications** | Screen recordings taken without Do Not Disturb risk a heads-up notification banner sliding into frame mid-take, ruining an otherwise-clean recording, discovered only by full-resolution frame review after the fact. | `adb shell cmd notification set_dnd priority` (or toggle DND via Settings once) before any take intended for final use. Re-verify by scanning full-resolution frames afterward, not thumbnails (see next row). |
| **Downscaled contact-sheet thumbnails hide thin light text on dark backgrounds** | A full-video QC contact sheet (1fps tiles resized to ~216×384) appeared to show a "black gap" — no logo — during a branded splash that, at full resolution, clearly showed the logo the whole time. Chased as a real bug for several tool calls before full-res frames at the same timestamps proved it was a rendering/downscale artifact of the *review method*, not the video. | Use a contact sheet only for a first-pass structural scan (are the right *scenes* in the right *order*). Any specific concern — a suspected gap, a transition, a caption's exact wording — must be re-checked with a **full-resolution** frame extracted at that exact timestamp before it's reported as a bug. |
| **`ffmpeg -ss` before `-i` on a small MP4 can appear to seek to a wildly wrong frame in ad-hoc spot-checks** | Not fully root-caused, but confirmed to disagree with `-i` before `-ss` on some 1-2s clips. | When a single spot-check frame looks implausible (content from a totally different part of the timeline), re-extract via a second independent method (e.g. `fps=` filter dump, or `-i` before `-ss`) before concluding the underlying video is broken. |
| **A caption/overlay timing plan based on an *earlier* capture of "the same" screen sequence can silently drift wrong** | Tab-switch timing measured during one recording session was reused, unverified, when a *later* re-recorded take (same script, same device) was substituted in — but the later take's real screen-transition timestamps differed by several seconds (a "Messages" tab was held ~4s longer than the version originally measured). The result: a callout captioned "Your profile, verified" displayed while the Messages screen — not Profile — was still on screen, and the actual Profile screen got under a second of visibility before the next transition swallowed it. | **Never reuse timing estimates across a re-shot take.** Every time the underlying footage changes (even from "the same" script), re-derive exact screen-transition timestamps from THAT specific file via ground-truth frame extraction (see Method §6) before setting any caption/overlay timing against it. |

---

## Required Inputs

| Input | How to obtain |
|---|---|
| A connected device, screen unlocked | `adb devices -l`; if locked, wake + swipe + PIN (`adb shell input text "<pin>"` + `KEYCODE_ENTER`) — **never** commit the PIN anywhere, including this session's own logs (see Common Pitfalls #9). |
| Target app's package name(s) | `adb shell pm list packages | grep -i <name>` |
| A safe, scripted-in-advance tap/scroll sequence per "scene" | Derived from a first exploratory pass (screenshot after each single action) before ever attempting a blind chained sequence. |
| Brand reference material | The app's own UI (its real message-bubble style, button color, logo) is the most authentic source — check it live rather than guessing a palette. Marketing posters/exports (e.g. a WhatsApp media export) are a good secondary source for a static logo/tagline asset. |
| A "hero" static asset (optional) | A photo of a hand holding a phone, or similar mockup, if the brief wants a non-screen-recording opening/closing shot. |
| `ffmpeg` with `libx264`, `zoompan`, `xfade`, `drawtext`, `adelay`/`amix`/`alimiter` (standard modern ffmpeg build) | `ffmpeg -version` |
| Python3 + Pillow (`PIL`) | For perspective-warp compositing and callout-bubble rendering. |
| A permanent-marker-style (or brand-matched) font file, if the brief wants a "handwritten" caption look | e.g. Google Fonts' `Permanent Marker`, fetched via a direct raw GitHub URL — `https://github.com/google/fonts/raw/main/apache/permanentmarker/PermanentMarker-Regular.ttf` |
| Royalty-free music + SFX | See Method §5 for a source confirmed to work without a Cloudflare bot-wall. |

---

## Outputs

```
<project>/
├── scene_*.mp4                  (raw captures, one per continuous "scene"/take)
├── final_*.mp4                  (cleaned re-shoots once timing/DND issues are fixed)
├── seg_*.mp4                    (per-segment: cropped, pillarboxed, captioned/overlaid)
├── callout_*.png                (transparent bubble+arrow overlays, one per caption moment)
├── intro_pillarboxed.png / intro_zoom.mp4   (static hero-shot intro, if used)
├── chain*.mp4 / c*.mp4          (intermediate crossfade-chain outputs — keep until final QC passes)
├── video_no_audio_v*.mp4        (fully assembled video track)
├── audio_mix_v*.aac             (music + SFX mix for one variant)
├── <name>_demo_v<N>[_<variant>].mp4   (final deliverables — one per music/style variant requested)
└── music/, sfx/                 (sourced royalty-free assets, kept for re-mixing)
```

---

## Method

### 1. Reconnaissance before any scripted sequence
- `adb devices -l` — confirm connection.
- Wake, unlock, `adb shell pm list packages | grep -i <app>` for exact package name(s).
- Force-stop, launch via `monkey -c android.intent.category.LAUNCHER`, then **poll with
  screenshots** at increasing waits until the real first screen is confirmed — record that
  number. This single measurement (not a guess) is the buffer used everywhere downstream.
- Map the flow you intend to show by tapping through it ONE action at a time, screenshotting
  after each, and recording the exact `(x, y)` coordinates and the screen each one produces.
  Do this before ever chaining actions blindly.
- `adb shell cmd notification set_dnd priority` if the take must be clean for final use.

### 2. Capture scenes as continuous takes, not stitched single actions
- One `adb shell screenrecord --bit-rate 8000000 /sdcard/<name>.mp4 &` per scene, backgrounded
  as a **local** process (`&` on the bash side) so subsequent `adb shell input ...` calls in
  the same script can run while it records.
- 2.5s+ buffer after starting the recorder before the first interaction (see Environment
  Reality). Use the launch-timing number from step 1 for any relaunch-within-a-scene.
- Stop with `adb shell pkill -INT screenrecord` (graceful mp4 finalization), `wait` the
  backgrounded PID, small sleep, then `adb pull` and `adb shell rm` the remote copy.
- If a scene's blind sequence drifts (verified via full-res frame checks — see §6), do **not**
  patch it with more guessed sleeps. Re-shoot that scene as its own clean continuous take with
  generous, re-measured timing. Two or three short clean scenes stitched with a crossfade beat
  one long scene full of drift-recovery hacks.
- Prefer showing fewer, deliberate actions per scene over cramming a long tap sequence into
  one take — every extra chained action multiplies the chance of drift (see Environment
  Reality's per-command-overhead row).

### 3. Convert to a branded 9:16 canvas
Real device footage is rarely exactly 9:16, and always carries a status/notification bar the
audience shouldn't see.
```
crop=<w>:<h - statusbar_px>:0:<statusbar_px>          # strip the status bar
scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=25,eq=brightness=-0.15   # blurred-fill background layer
scale=-2:1920                                          # sharp foreground layer, same crop, fit-to-height
overlay=(W-w)/2:(H-h)/2                                # composite fg centered on the blurred bg
```
This "blurred background fill" (common in professional short-form edits) avoids both black
pillarbox bars and cropping any real UI content, since the phone's native aspect is usually
*taller* than 9:16 (fit-to-height overflows width slightly; fit-to-width leaves vertical gaps
filled by the blurred layer instead of bars).

### 4. Contextual callouts (bubble caption + arrow to the exact UI element)
A flat top-banner caption reads as an ad; a caption that visually points at the specific price,
button, or tab it's talking about reads as a guided tour. Two supporting techniques:

**Coordinate transform** — once you know the crop (`statusbar_px`) and scale factor
(`scale = 1920 / (source_h - statusbar_px)`) from step 3, any raw-screenshot coordinate
`(x, y)` maps onto the final 1080×1920 canvas as:
```python
def to_canvas(x, y, statusbar_px, scale, x_offset):
    return (x_offset + x * scale, (y - statusbar_px) * scale)
```
`x_offset` is the `(1080 - fg_width) / 2` centering offset from the overlay step.

**Bubble-and-arrow rendering** — see `scripts/render_callout.py` in this skill for the full,
parameterized implementation (message-bubble background matching the app's own real chat-bubble
style, a curved hand-drawn-style arrow with an arrowhead, and drop-shadowed text). Key points:
- Sample the app's OWN UI for brand colors before choosing an accent — open the actual
  in-app chat/message screen (or any screen with the brand's true interactive color) and
  sample pixels with PIL rather than guessing a color. A demo video's captions should look
  like they belong to the app, not like a foreign sticker.
- Render each callout as its own full-canvas transparent PNG (text + bubble + arrow baked
  into one image), sized/positioned so the arrowhead lands exactly on the target coordinate
  from the transform above.
- Composite each callout onto its segment via `ffmpeg`'s `overlay` filter fed by a
  **looped, alpha-faded copy** of that PNG — not `drawtext`, which can't draw arrows, and not
  a hard-cut overlay, which pops jarringly (see Method §7 for the fade technique, reused here).
- Chain multiple callouts on one segment as sequential single-overlay passes (verify each
  before adding the next) rather than one giant filter graph — much easier to debug when a
  timing or position is off.

### 5. Sourcing royalty-free music & SFX without a paid license
Several well-known "free music" sites (Pixabay, Chosic, ...) sit behind Cloudflare bot-walls
that block plain `curl` (`HTTP 403`, "Just a moment..." challenge page). **Mixkit** did not,
and additionally embeds clean structured metadata directly in its static HTML:
```bash
curl -s -A "Mozilla/5.0" "https://mixkit.co/free-stock-music/tag/<mood>/" -o page.html
# Music pages: JSON-LD blocks with name/genre/artist/duration/url
python3 -c "
import re
html = open('page.html').read()
pattern = re.compile(r'\"name\":\"([^\"]+)\",\"genre\":\"([^\"]*)\",\"byArtist\":\"([^\"]*)\",\"duration\":\"([^\"]*)\",\"url\":\"(https://assets\.mixkit\.co/[^\"]+)\"')
for m in pattern.finditer(html): print(m.groups())
"
# SFX pages: title sits in a nearby <h2 class="item-grid-card__title"> after the audio-player div
```
Direct download: `curl -sL -A "Mozilla/5.0" -o track.mp3 "https://assets.mixkit.co/music/<id>/<id>.mp3"`
(same pattern for `.../sfx/<id>/<id>-preview.mp3`). Mixkit's free license permits commercial
use with no attribution required (verify current terms at `mixkit.co/license/` for the
specific asset type before shipping). Build 15s previews (`-ss 8 -t 15` with in/out fades) to
send the user a quick pick between several mood/genre candidates before committing one.

### 6. Ground-truth every timing assumption against THIS specific file
Before setting any caption/overlay/SFX timestamp against a piece of footage:
```bash
for t in 3 5 7 9 11 13 15 17; do
  ffmpeg -y -ss $t -i the_actual_file.mp4 -frames:v 1 "gt_${t}.png"
done
# then actually LOOK at each frame (full resolution) and note the real transition points
```
Do this on the **exact file** being used in the final edit — not an earlier take, not "the
same script run again" (see Environment Reality's timing-drift row: a re-shot take with
identical script and coordinates still measured several seconds different on a real screen
transition). Only after this ground-truth pass should caption/SFX timestamps be written.

### 7. Smooth transitions instead of hard cuts between segments
Stitching segments with the `concat` demuxer alone is a hard, jarring cut — especially between
segments that are actually separate recording *sessions* (e.g. a fresh app relaunch), where the
cut also has to paper over a discontinuity in on-screen state.
```bash
ffmpeg -i seg_a.mp4 -i seg_b.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.45:offset=<dur(a)-0.45>,format=yuv420p" \
  -c:v libx264 -pix_fmt yuv420p out.mp4
```
Chain multiple segments by feeding each xfade's output as the next call's first input,
recomputing `offset = <cumulative duration so far> - <fade duration>` from `ffprobe` at each
step (don't hand-calculate a running total — it drifts). For a "diving into the screen"-style
opening (e.g. a static hero photo zooming into a phone screen before cutting to real footage),
use `transition=fadewhite` for that specific cut and a plain `fade` for the rest — a flash
through white sells a "passing through" moment; a plain dissolve suits ordinary scene changes.
Caption/overlay text should **fade in/out** (0.25-0.35s), not pop, using the same `fade` filter
with `alpha=1` on a looped PNG (see Method §4) — this alone measurably reduces a "rushed" or
"unpolished" feel independent of anything else.

### 8. Layered audio: music bed + individual SFX, precisely timed
```bash
ffmpeg -y -ss <start> -t <total_dur> -i music.mp3 \
  -i tap.mp3 -i whoosh.mp3 -i success.mp3 \
  -filter_complex "
  [0:a]afade=t=in:st=0:d=1,afade=t=out:st=<total_dur-2.5>:d=2.5,volume=0.65[music];
  [1:a]adelay=<ms>|<ms>,volume=1.1[a1];
  [2:a]adelay=<ms>|<ms>,volume=1.3[a2];
  [3:a]adelay=<ms>|<ms>,volume=1.1[a3];
  [music][a1][a2][a3]amix=inputs=4:normalize=0,alimiter=limit=0.95[aout]
  " -map "[aout]" -c:a aac -b:a 192k mix.aac
```
`amix`'s default behavior divides every input's volume by the input count — always pass
`normalize=0` and control level explicitly per-`volume=` instead, or the mix goes quiet.
`alimiter` as the final stage prevents clipping from overlapping peaks without manually riding
levels. Verify afterward, don't assume:
```bash
ffmpeg -i final.mp4 -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
ffmpeg -i final.mp4 -af "silencedetect=noise=-50dB:d=0.3" -f null - 2>&1 | grep silence
# spot-check each SFX actually landed audibly:
for t in <each sfx timestamp>; do
  ffmpeg -ss $((t - 1)) -t 0.5 -i final.mp4 -af volumedetect -f null - 2>&1 | grep max_volume
done
```
`max_volume` should stay just under 0dB (not at/above it — that's clipping); each SFX
timestamp's window should show a clear peak, not silence.

### 9. Delivering variants + getting the file actually visible on the user's phone
- If multiple music/style options are requested, keep the video track identical and only swap
  the audio mix — mux each combination with `-c:v copy` (no re-encode needed) for near-instant
  variant generation.
- To push to the user's own device: `adb push file.mp4 /sdcard/Download/`, then
  `adb shell content insert --uri content://media/external/video/media --bind _data:s:"<path>" --bind mime_type:s:"video/mp4"`
  for **each** file (the media-scan broadcast alone is not reliable — see Environment
  Reality). Verify by opening the actual video-library app yourself and screenshotting it,
  not by trusting the insert command's exit code.

---

## Decision Rules

```
IF a blind multi-step tap sequence is about to be scripted
THEN first measure real launch/transition timing via screenshot-polling on this exact
     device/app, and verify each individual coordinate once with a screenshot before
     chaining it into a sequence.

IF more than ~5 chained taps/swipes are needed in one continuous take
THEN expect real per-command overhead to accumulate; prefer shorter scenes with generous
     buffers, or verify the result frame-by-frame and re-shoot rather than patch drift with
     more guessed sleeps.

IF a scene's captured footage doesn't match the intended screen sequence
THEN re-shoot that scene as its own clean take rather than trying to caption/edit around
     the drift — editing cannot fix wrong on-screen content.

IF reusing timing (caption windows, SFX cues) from an earlier capture of "the same" flow
THEN don't. Re-derive exact transition timestamps from ground-truth frames of the CURRENT
     file before trusting any timestamp against it.

IF a QC contact sheet (downscaled thumbnails) suggests something is missing/wrong
THEN re-check with full-resolution frames at that exact timestamp before reporting it as a
     bug — downscaling can hide thin light text on dark backgrounds.

IF the footage's native aspect ratio isn't exactly the target (e.g. 9:16)
THEN fill the difference with a blurred/darkened extension of the same footage, not black
     bars and not a crop that cuts off real UI (status bar excepted — always crop that).

IF adding text captions over screen-recorded footage
THEN prefer a callout (bubble + arrow to the specific UI element) over a static banner
     whenever the caption references something with an on-screen location; make it fade
     in/out, not pop.

IF choosing an accent color or bubble style for captions
THEN sample it from the app's own live UI (its real chat bubble, its real button/brand
     color) rather than picking an arbitrary color — verify with an actual pixel sample,
     not a guess from a screenshot glance.

IF segments being stitched come from separate recording sessions (not one continuous take)
THEN use a longer/more deliberate crossfade at that specific boundary — the discontinuity
     in on-screen state is more noticeable there than between two moments of one take.

IF sourcing royalty-free audio and a site returns HTTP 403 / a bot-check page to curl
THEN try Mixkit next (confirmed curl-friendly with structured metadata) rather than
     fighting the bot-wall.

IF mixing multiple audio inputs with ffmpeg's amix filter
THEN always pass normalize=0 and set levels explicitly via per-input volume=, and finish
     with alimiter — otherwise the mix silently loses loudness proportional to input count.

IF pushing a file to a user's Android phone that should appear in their media apps
THEN use `content insert` into the MediaStore, not just `adb push` + a scanner broadcast —
     and verify by opening the real target app and screenshotting the result yourself.

IF a device PIN, password, or other credential is given to unlock a phone for this workflow
THEN never let it persist verbatim in any committed log, skill doc, or session backup —
     redact it the same way any other secret gets redacted before a push (see the sibling
     `claude/` session-backup convention in this repo).

IF the user gives specific, concrete feedback ("skips before X is shown", "captions feel
   static", "wrong background color") rather than vague dissatisfaction
THEN verify the specific claim first (ground-truth frames, pixel samples, timing math)
     before changing anything — several rounds in the source session turned out to be real,
     verifiable bugs, not just taste, and the verification step is what made the fix land
     correctly on the first attempt instead of guessing.
```

---

## Best Practices

- **Measure, don't assume, every timing number** — cold-launch duration, per-tap overhead,
  screen-transition points. Every guessed number in this domain turned out wrong at least
  once in the source session.
- **One clean continuous take beats a stitched-and-patched one.** Re-shooting a short scene is
  cheaper than debugging accumulated drift across a long one.
- **Verify with full-resolution frames for anything specific; contact sheets only for the
  broad structural pass.**
- **Sample brand colors from the real app, not a guess.**
- **Keep every intermediate file** (`scene_*`, `chain*`, `seg_*`) until final QC passes — the
  crossfade-chain rebuild pattern means you'll often need to re-render just one link, not the
  whole pipeline, if a fix is needed later.
- **Send short previews (music, styles) before committing** a full render to one choice —
  much cheaper than re-rendering three full variants because the first pick was wrong.
- **When multiple output variants are wanted (e.g. 3 music tracks), keep the video track
  frozen and only re-mux audio** — instant with `-c:v copy`, versus re-rendering video three
  times.
- **Redact secrets from anything derived from a session log** (API keys, PINs, tokens) using
  the same discipline as any other credential-handling task — a demo-video task is not exempt
  just because the primary deliverable is a video.

---

## Common Pitfalls

1. **Assuming cold-launch and screen-transition timing from a first guess.** Always measure.
2. **Chaining 10+ blind taps in one continuous take.** Per-command overhead compounds into a
   "monkey-testing" cascade where later taps hit whatever screen happens to be showing, not
   the intended one — including, memorably, taps meant for a "Reserve" button coincidentally
   landing on unrelated bottom-navigation tabs purely by x-coordinate overlap.
3. **Trusting the tap right after starting `screenrecord`.** It's commonly swallowed by a
   startup hitch; buffer 2.5s+.
4. **Reporting a "black gap" or missing content from a downscaled contact sheet without a
   full-resolution recheck.** Burned several tool calls chasing a non-bug this way.
5. **Reusing a previous capture's screen-transition timestamps for a freshly re-shot take.**
   Directly caused a real shipped bug: a callout referencing "Profile" displayed over the
   Messages screen, and Profile itself got under a second of visibility before the next
   transition cut it off — traced only by ground-truth frame-checking the *specific* file in
   use, not the earlier one the estimate came from.
6. **Picking an arbitrary accent color (e.g. "red" because it pops) instead of the app's own
   brand color.** Looks like a foreign sticker rather than an in-app tooltip; costs a full
   re-render cycle to fix once flagged.
7. **A hand-drawn perspective-warp composite (screenshot → "hand holding phone" photo) with a
   hand-mask based on color-heuristics ("skin tone") instead of hand-traced geometry.** A
   color-based mask reliably false-triggers on unrelated dark/warm-toned pixels in whatever
   was warped onto the screen, producing a large wrong-content wedge where a thumb was
   supposed to be restored. Trace the occluding hand/finger region as a fixed polygon from
   the *unmodified* source photo instead — geometry doesn't care what's on the screen.
8. **Assuming `adb push` + a `MEDIA_SCANNER_SCAN_FILE` broadcast makes a file visible in the
   phone's own apps.** It routinely doesn't on modern Android. Use `content insert`, and
   verify by actually opening the target app.
9. **Letting a device PIN typed in chat end up verbatim in a committed session backup.**
   Scan for it explicitly (word-boundary match, since a 4-digit PIN can coincidentally
   substring-match unrelated numbers like filenames or UUIDs) and redact before any push.
10. **Treating "the video is 2s longer/shorter than expected" as fine without re-checking
    downstream timestamps.** A freeze-frame pad, an added segment, or a re-shot scene shifts
    every absolute timestamp after it — re-derive `ffprobe` durations at each step rather than
    hand-adding numbers from memory.

---

## Patterns

### Wake, unlock, and verify a device is ready
```bash
adb shell input keyevent KEYCODE_WAKEUP
adb shell input swipe 360 1300 360 400 300   # swipe-up lock screen, if present
# PIN entry, if needed — do NOT let this literal value end up in any committed log:
adb shell input text "<pin>"
adb shell input keyevent KEYCODE_ENTER
adb exec-out screencap -p > /tmp/unlock_check.png   # verify visually before proceeding
```

### Measure real cold-launch timing (run once per app/device)
```bash
adb shell am force-stop <pkg>
adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1
for t in 2 4 6 8 10 12 14; do
  sleep 2
  adb exec-out screencap -p > "launch_check_${t}.png"
done
# inspect each — note the smallest t where the real first screen is fully loaded
```

### One continuous scene take
```bash
adb shell screenrecord --bit-rate 8000000 /sdcard/scene.mp4 &
RECPID=$!
sleep 2.5                                   # startup-hitch buffer
adb shell input tap X Y; sleep 1.5
adb shell input swipe X1 Y1 X2 Y2 400; sleep 1.5
# ... more verified actions ...
sleep 1
adb shell pkill -INT screenrecord
wait "$RECPID" 2>/dev/null
sleep 1.3
adb pull /sdcard/scene.mp4 ./scene.mp4
adb shell rm /sdcard/scene.mp4
```

### Blurred 9:16 pillarbox + status-bar crop (one segment)
```bash
STATUSBAR_PX=52
PB="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=25,eq=brightness=-0.15"
ffmpeg -y -i scene.mp4 -filter_complex \
  "[0:v]crop=iw:ih-${STATUSBAR_PX}:0:${STATUSBAR_PX},split=2[a][b];[a]${PB}[bg];[b]scale=-2:1920[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,fps=30" \
  -c:v libx264 -pix_fmt yuv420p -crf 19 seg.mp4
```

### Chained crossfade (repeat per additional segment, recomputing offset each time)
```bash
D1=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 clip_a.mp4)
OFFSET=$(python3 -c "print(${D1}-0.45)")
ffmpeg -y -i clip_a.mp4 -i clip_b.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.45:offset=${OFFSET},format=yuv420p" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 chain.mp4
```

### Fade a looped PNG overlay in/out and composite (used for both captions and hand-drawn arrows)
```bash
DUR=<segment duration>
ffmpeg -y -i base.mp4 -loop 1 -t $DUR -i callout.png -filter_complex \
  "[1:v]format=rgba,fade=t=in:st=<start>:d=0.3:alpha=1,fade=t=out:st=<end-0.3>:d=0.3:alpha=1[c];[0:v][c]overlay=0:0" \
  -c:v libx264 -pix_fmt yuv420p -crf 19 base_with_callout.mp4
```

### Sample a brand color from the app's own UI
```python
from PIL import Image
im = Image.open("real_app_screenshot.png").convert("RGB")
print(im.getpixel((x, y)))   # sample several points on the real button/bubble/logo
```

See `scripts/render_callout.py` for the full bubble+arrow renderer.

---

## Validation Checklist

- [ ] Cold-launch and every screen-transition timestamp measured on THIS device/app/take,
      not assumed or reused from an earlier capture.
- [ ] Every scene verified via full-resolution screenshot immediately after capture — not
      just "the command exited 0."
- [ ] No blind chain of more than a handful of taps without an intermediate verification.
- [ ] 9:16 canvas confirmed no black bars and no real UI cropped (status bar excepted).
- [ ] Every caption/callout timing re-derived from ground-truth frames of the exact final
      footage being used (not an earlier take of "the same" sequence).
- [ ] Callout accent color sampled from the real app UI, not guessed.
- [ ] Every segment-to-segment cut is a cross-dissolve, not a hard `concat`-only cut.
- [ ] Captions fade in/out; none of them hard-pop on/off.
- [ ] Audio: `volumedetect` shows `max_volume` just under 0dB (no clipping); no unexpected
      `silencedetect` gaps; each individual SFX cue spot-checked for an audible peak at its
      timestamp.
- [ ] If multiple variants were requested, video track is byte-identical (only audio swapped)
      unless the user asked for visual differences too.
- [ ] Any file pushed to the user's phone verified visible by actually opening the target
      app and screenshotting it — not just a successful `adb push`/insert exit code.
- [ ] Any secret (PIN, token, key) that appeared anywhere in this workflow's own logs is
      redacted before those logs are committed/pushed anywhere.
- [ ] Final full-resolution spot-check across intro, every transition boundary, every
      callout, and the end card — done deliberately, in that order, not skipped because
      earlier passes looked fine.

---

## Notes

- **Built and fully verified** producing a real ~50s vertical car-rental app demo across
  seven complete revision cycles, each driven by specific real user feedback — this is not a
  theoretical pipeline, every pitfall above was hit and fixed in that order.
- **App-specific literals in this doc's source session** (Ardena's blue, its exact tab
  coordinates, "Toyota Voxy") are examples, not rules — the transferable knowledge is the
  measurement discipline, the coordinate math, and the ffmpeg patterns.
- **The perspective-warp "screenshot onto a hand-holding-phone photo" technique** turned out
  to be unnecessary in the source session once a pre-composited version of that exact image
  was supplied directly by the user — but the geometry (`find_coeffs` homography-solve +
  hand-traced polygon masking) is kept here since a future request may need it built from
  scratch. See `scripts/render_callout.py`'s neighboring history in the source session if a
  from-scratch perspective composite is ever actually needed again.
- **This skill assumes physical/authorized access to the device and app being demoed.** It
  is a content-production technique, not a device-automation or security-testing tool.
