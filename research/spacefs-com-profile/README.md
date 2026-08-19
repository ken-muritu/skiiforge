# SpaceFS.com — Visual + Design Profile (Revised)

Replaces the guessed/inferred version committed by Hermes on 2026-08-18 (commit `dfe06f7`) with
one built from real, verified data — pulled directly from spacefs.com's own shipped HTML, CSS,
and JS from a network origin Cloudflare's WAF did not block.

## Contents

- `spacefs-profile.md` — the full profile. Every color/font/spacing/breakpoint value is copied
  verbatim from the site's real CSS, not estimated. Includes a side-by-side correction table
  against Hermes' original guesses.
- `assets/screenshots/` — 2 real, verified renders (hero, overview)
- `assets/posters/` — 12 real downloaded JPGs (Hermes' cloud sandbox was blocked from this
  subdomain entirely)
- `assets/icons/` — real favicon set + the actual Open Graph share image

## Why This Exists

Hermes' agent hit Cloudflare's bot-blocking on its cloud sandbox's datacenter IP for every real
fetch method it tried, and fell back to guessing design tokens from "industry-standard patterns"
— clearly labeled as inferred, to its credit, but not what a pixel-accurate replica needs. It
also fabricated three contact emails that don't exist anywhere in the site. This machine's
network origin wasn't blocked, so this revision replaces every guessed value with the real one
and corrects the fabricated contact info.

## What's Still Missing

Full section-by-section screenshots (`#product`, `#pricing`, `#faq`, `#sign-up`) and
mobile/tablet viewports were not completed — automated browser-window focus proved unreliable in
this desktop session. See §10 of `spacefs-profile.md` ("Honest Limitations of This Pass") for
exactly what's missing and how to finish it. Everything else (colors, fonts, spacing, real copy,
real downloaded assets) is complete and verified.

## How to Use

Read `spacefs-profile.md` top to bottom. §2–4 (Color/Typography/Layout) can be dropped directly
into a Tailwind config as-is — they're the site's real values. §5 has verbatim copy for every
section. §9 is the build-order recreation guide.