---
name: project-credential-rotation-needed
description: Multiple real secrets echoed in plaintext across sessions and should be rotated — Google/YouTube API key, GitHub OAuth token, a Vercel API token, and a fine-grained GitHub PAT; user has a recurring pattern of pasting credentials directly despite being asked to enter them out-of-band
metadata: 
  node_type: memory
  type: project
  originSessionId: e1b85f98-ca31-448a-9ee0-f2bec9036cb5
  modified: 2026-09-07T21:23:17.214Z
---

While assembling the [[reference-skiiforge]] `claude/` session-history backup on
2026-08-25, two live credentials turned up in plaintext inside old session
transcripts (not secrets files — they'd been echoed into tool output/conversation
during past sessions):

- A Google/YouTube Data API key (`AIzaSy...`), originally from `~/Fungu/.env`
  (`YOUTUBE_API_KEY`), pasted into a session by the user and then re-surfaced by
  a later session searching for it.
- A GitHub OAuth token (`gho_...`) used directly in a `curl -H "Authorization:
  Bearer ..."` command during work on the `618ff6c4` session.

Both were redacted in the copies pushed to `skiiforge/claude/`, but the
originals still exist verbatim in the local `~/.claude/projects/-home-pop-os/`
transcripts (until this live-boot session ends) and now live permanently in
this session's git history-adjacent memory of having been seen.

**Why:** A private repo is not a reason to leave live credentials in cleartext,
and local transcripts having held them in plaintext across a boot is itself
exposure (screen-shares, other tools reading `~/.claude`, etc.).

**How to apply:** User told the assistant (2026-08-30) to stop raising the
YouTube key rotation question — proceed using it as-is, no more nagging.
Don't re-raise the YouTube key. The GitHub OAuth token (`gho_...`) rotation
status is still unconfirmed and hasn't been asked about again since 2026-08-25.

**2026-09-03 addition:** user pasted a Vercel API token (`vcp_...`) directly in
chat to unblock deployment verification on [[project-caspahub]] (this session's
Vercel MCP connector only had access to a different, unrelated Vercel account —
see that memory), explicitly said they'd rotate it and ping when done. Used it
only via direct `curl` calls, never written to any file, memory, or pushed
commit. Per the established pattern above: don't nag about rotation — the user
already stated intent unprompted. Only note it if they ask, or drop this line
once they confirm rotation.

**2026-09-03 addition #2:** same session, same day — asked the user to run
`gh secret set` themselves specifically so a new fine-grained GitHub PAT
(`github_pat_...`, read-only Contents scope on `caspahub-flutter`, created for
the [[project-caspahub]] Flutter CI billing workaround) would never enter the
chat; user pasted it directly anyway with "no need to worry about it, I'll
revoke it later." This is now a repeating pattern — when asked to keep a
credential out of chat, the user pastes it anyway and self-reports intent to
rotate. Design around this going forward: don't rely on the user following an
out-of-band-entry instruction for secrets; treat it as likely they'll paste
directly regardless of what's asked, and minimize what's done with it in that
case (use once, don't echo, don't write to disk/commits) rather than assuming
the safer path will be taken. Confirmed same-session: when the first
fine-grained PAT hit a permissions error, the user's very next move was to
paste a second, classic `ghp_...` token (broader scope, full repo read/write)
directly in chat again with the same "I'll revoke it later" — this is a
reliable pattern, not a one-off, so stop suggesting the out-of-band `gh secret
set` flow as if it will be followed; just ask for the token knowing it'll
likely arrive in-chat, and handle it the same safe way each time.

**2026-09-08 addition:** pattern repeated again, same root cause (Vercel MCP
connector on this Claude account has no access to the Vercel team/account that
actually hosts [[project-caspahub]]'s `caspahub-booking` project — confirmed
via `list_projects` returning zero matches, then `get_runtime_logs` returning
403 Forbidden even when given the correct project/team IDs by other means).
User pasted a Vercel API token (`vcp_...`) directly in chat again to debug why
a newly-added `BREVO_SMS_SENDER` env var wasn't taking effect, again with "no
need to worry, I'll rotate it later, I'll ping you once I do." Used it only
via direct `curl`/API calls (list env vars, trigger a redeploy, add/remove a
temporary diagnostic route) — never written to a file, memory, or commit
message. Root cause found via the token: Brevo account has no SMS add-on/
credits purchased at all (`"No sms related addons are found for the given
organization"`), unrelated to the token itself. Confirms this is a durable,
repeatable pattern across separate sessions/days now — keep applying the same
handling (use once, don't echo, don't persist) rather than expecting it to
stop.
