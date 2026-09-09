---
name: project-tokenrouter-setup
description: "claude-tr/tr2 (TokenRouter, qwen-only) + claude-ox/ox2 (OpenRouter, free-tier) all route through a shared _claude_relay retry/error-classifier added 2026-08-30 in ~/.bashrc; FATAL (402 credits, 403/404 no-access) fails fast in --print mode, TRANSIENT (503 shapes) keeps retrying; interactive mid-session inline errors still uncatchable by design"
metadata: 
  node_type: memory
  type: project
  originSessionId: e1b85f98-ca31-448a-9ee0-f2bec9036cb5
  modified: 2026-08-30T19:52:21.841Z
---

Added a `claude-tr` bash function to `~/.bashrc` (right after `claude-ox`),
parallel setup for [[reference-skiiforge]]-style live-session tooling but
routing through TokenRouter (`https://api.tokenrouter.com`) instead of
OpenRouter.

**Key facts confirmed directly (not assumed from TokenRouter's docs), since
the user explicitly asked not to assume anything:**
- The docs' own example models (`anthropic/claude-sonnet-4.6`, `-opus-4.6`,
  `-haiku-4.5`) all return 403 "no access" on the key the user provided —
  this specific key does **not** have Anthropic-model access.
- `GET /v1/models` shows the key's only actual model is the free
  `qwen/qwen3.8-max-free`.
- That free model is flaky: 3 of 4 manual test calls hit 503 "gateway
  overloaded: hard concurrency limit reached" before one succeeded — worse
  than what originally justified `claude-ox`'s retry/reattach hardening, so
  `claude-tr` ships with that hardening from the start. No `--fallback-model`
  exists for it, unlike `claude-ox` — this key has nothing else to fall back
  to.

**Why:** the user said "no need to worry, I'll revoke it later" about the
API key when handing it over — it's a deliberately temporary/trial key, not
a long-term credential.

**How to apply:** don't treat this key as permanent. If the user mentions
TokenRouter, upgrading the key, or getting real Anthropic-model access
through it, that's the natural point to revisit this setup. If they later
confirm the key was revoked, delete this memory (and consider whether
`claude-tr` in `~/.bashrc` should be removed too, since it'll be nonfunctional
once revoked — though on this live-boot machine `~/.bashrc` won't survive a
reboot anyway).

**Verified end-to-end 2026-08-25** (not just raw curl): `claude-tr --print
"..."` round-tripped successfully twice through the real Claude Code CLI —
correct auth, correct base URL, correct model routing, model self-confirmed
it was `qwen/qwen3.8-max-free` via the TokenRouter proxy. One cosmetic,
non-blocking warning each run: Claude Code doesn't recognize this model id,
so it assumes a 200k-token context window for auto-compact (safe default;
the model is TokenRouter-custom-tagged so there's no verified real window
size to set instead — left as-is rather than guessed).

Also went through the rest of `tokenrouter.com/docs` (feature-guide,
management-api-documentation, faq, zcode-setup, openclaw-setup): confirmed
Claude Code CLI is the only supported Claude integration path (Desktop/Web
aren't supported by TokenRouter), and that the docs' `/v1`-suffixed base URL
guidance is for their OpenAI-Chat-Completions-format tools (ZCode, OpenClaw)
only — Claude Code's Anthropic-Messages-format path correctly uses no `/v1`
suffix, confirmed both by the claude-code-setup page and by direct testing.
Quota/wallet-balance details are gated behind a separate "Management Key"
this account doesn't have — regular API key gets 401 against those endpoints.

**claude-tr2 added 2026-08-27** (second TokenRouter key, `~/.bashrc`, same
shape as claude-tr): also qwen-only per /v1/models, verified round-trip
before wiring in.

**New 503 error shape (2026-08-27):** `503 cache-only admission rejected a
cold, unavailable, or overloaded request` — under load the gateway admits
only cache-hit requests and rejects cold ones; a mid-session 503 does NOT
crash the process, it leaves the session idle at the prompt (looks like a
stall), so the wrapper's <15s abnormal-exit reattach never fires. Recovery:
send the session a cross-session message (SendMessage ping wakes it and it
resumes its pending work) or press Enter in its terminal. Transient —
minutes later a direct cold /v1/messages call on the same key returned 200.
Checked TokenRouter docs 2026-08-27 (feature-guide + claude-code-setup):
"cache-only admission" is NOT documented anywhere — docs cover only
dashboard features; this shape is evidence-recorded here, not doc-sourced.

**Third 503 shape hit 2026-08-30:** `503 No available channel for model
qwen/qwen3.8-max-free under group default (distributor)` — the distributor
has zero channels for the free model, server-side and transient, same as
the other two 503 shapes above.

**Fix applied 2026-08-30** in `~/.bashrc`, prompted by that 503 plus a
`claude-ox`/`claude-ox2` OpenRouter 402 (`requires more credits... requested
up to 32000 tokens, but can only afford 10297`) seen the same session. Root
cause of the 402: `claude-ox`/`claude-ox2` carried
`--fallback-model claude-sonnet-5,claude-opus-4-8` — when the free
z-ai/glm-5.3-flash call failed, Claude Code silently retried on OpenRouter's
PAID Anthropic models, which this free-tier key can't afford. Fixes:
1. Removed that paid `--fallback-model` from claude-ox/ox2 entirely — no
   free alternative was ever confirmed, so failing clean beats a confusing
   402.
2. All four wrappers (claude-ox, claude-ox2, claude-tr, claude-tr2) now call
   a shared `_claude_relay` function that, for non-interactive `--print`
   calls only, captures output and runs `_claude_relay_classify` on it:
   FATAL patterns (`requires more credits`, `no access to model`,
   `not_found_error`) fail fast without wasting retries; TRANSIENT patterns
   (`no available channel`, `cache-only admission`, `gateway overloaded`,
   `hard concurrency limit`, bare `503`) keep the existing retry/reattach
   loop. claude-tr/claude-tr2 also gained a `_claude_relay_preflight` curl
   check (prints a warning, doesn't block launch) before entering the
   interactive session.
3. **Still NOT fixable, confirmed again:** interactive-TUI mid-session
   inline errors (session stays alive, one reply errors) can't be caught
   from a wrapping shell — that's a Claude Code CLI limitation. The fix
   above only helps `--print`/non-interactive calls and process-crash cases.
   Recovery for the interactive case is unchanged: retry the turn, `/model`
   to switch, or relaunch with a different wrapper.

Verified with `bash -n ~/.bashrc` (syntax) and by sourcing in an interactive
subshell to confirm all four functions + the three shared helpers define
correctly, plus a standalone unit test of `_claude_relay_classify` against
the literal 402/403/both-503 error strings — no live API calls made (to
avoid spending the account's limited credits during verification).
