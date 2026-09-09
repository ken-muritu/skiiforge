---
name: project-flutter-live-rollback
description: "Flutter setup on the live session was attempted 2026-08-27, destabilized the session, and was fully rolled back on the user's order — do not re-attempt without asking"
metadata: 
  node_type: memory
  type: project
  originSessionId: a69a6545-6fea-41d5-91f1-ef0780594d91
  modified: 2026-08-27T20:39:52.302Z
---

The full Flutter-on-live-session plan (format sdb3, counterfeit-proof capacity check, SDK 3.47.1 to stick, web target via Brave, APK via GitHub Actions) was executed on 2026-08-27 as far as SDK extraction, then the user reported "this flutter thing is crashing my live session" and ordered a complete reversal.

Everything was undone the same day: detached jobs killed, sdb3 unmounted and its ext4 signature erased via wipefs (back to the empty partition it was found as — it read zeros before we formatted it, so nothing of the user's was ever on it), libglu1-mesa purged, apt lists purged, playbook files deleted, ~/.bashrc confirmed never edited. sdb1 (/cdrom boot image) was never touched at any point.

**Why:** sustained multi-GB writes to the suspected-counterfeit stick (~1.7–4 MB/s) loaded page cache/dirty pages and zram swap on a RAM-backed live session; separately, harness-owned background tasks were reaped in wholesale kills ~55 min apart (no OOM in journal) — the combination destabilized the session.

**How to apply:** if Flutter comes up again, ask first. Only retry at the user's explicit request, keep long jobs detached via setsid (harness background tasks are not reliable here), keep RAM headroom, and treat the user's diagnostic profile in [[user_environment]] as ground truth. Related: [[reference_skiiforge]], [[project_fungu]].
