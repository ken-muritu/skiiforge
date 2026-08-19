# SpaceFS.com — Complete Design & Technical Profile (Verified)
Generated: 2026-08-19
Source: https://spacefs.com/
Method: Direct HTTP fetch of the live server-rendered HTML + JS bundles from a residential/desktop
network origin (not a datacenter IP — see "Why This Revision Exists"), plus live browser
screenshots. Colors, fonts, spacing, radii, shadows, and breakpoints below are **extracted
verbatim from the site's own shipped CSS custom properties and inline styles** — not visually
estimated or inferred.

---

## Why This Revision Exists

Hermes (via `hermes-agent`, running in a cloud/Daytona sandbox) attempted this same brief first
and committed a version of this profile on 2026-08-18 (commit `dfe06f7`). Its cloud sandbox's
datacenter IP was blocked by spacefs.com's Cloudflare WAF for **every** fetch method it tried
(Playwright, curl, its built-in browser tool) except one text-extraction tool, so it built the
entire design-token section from **guesses** ("inferred," by its own honest labeling) based on
generic dark-SaaS conventions, and fabricated three named contact emails
(`matt@`/`jason@`/`ari@getspace.so`) that do not appear anywhere in the site's source.

This machine sits on a normal desktop/residential connection, not a cloud datacenter range, and
Cloudflare let it straight through (`HTTP/2 200`, `cf-cache-status: DYNAMIC`) on the main site
**and** the `assets.spacefs.com` subdomain that blocked Hermes entirely. That made it possible to
do the job the brief actually asked for: pull the real CSS, download the real image assets, and
capture real (not guessed, not blocked) screenshots.

**Corrections to the prior version, at a glance:**

| Claim in Hermes' version | Reality |
|---|---|
| Colors "inferred": `#0A0A0F` bg, `#3B82F6`/`#8B5CF6` accents | Verified from shipped CSS vars: `#0a0a0a` bg (dark) / `#fff` bg (light), ring accent `#0066ff` (light) / `#3b82f6` (dark) — see §2 |
| Fonts "inferred": Inter, SF Pro Display, Plus Jakarta Sans | Verified: `"Google Sans"` (sans) / `"Google Sans Code"` (mono), loaded from Google Fonts — see §3 |
| Stack: "React/Next.js" | Verified: **Gatsby** (`data-gatsby-head` attributes throughout) + **Tailwind CSS** (breakpoints and utility classes match Tailwind's default scale exactly) — see §7 |
| Contact: matt@/jason@/ari@getspace.so | **Not present anywhere in the HTML or JS bundles.** The real FAQ footer says "Write to the team" as a link with no visible mailto — see §8 |
| Screenshots: 1 blank Cloudflare-error PNG | 2 real, verified renders (hero + overview) plus 12 real downloaded poster images and 4 real icon/favicon files — see §9 |
| "SVG of full rendered page not practical" (from the original brief's own tips) | Correct — no full-page SVG attempted here either; real raster screenshots + verified CSS tokens are the practical substitute, per the brief's own guidance |

---

## 1. Brand Identity

- **Product name:** Space, by **Space Computer, Inc.** (copyright footer, verified)
- **Tagline:** "Infinite space on your computer." (verified — page `<title>` and og:title)
- **Meta description (verbatim):** "Keep every project on your Mac without filling your disk.
  Open huge files instantly in the apps you already use, synced across all your machines."
- **Backed-by badge (verified via real screenshot, not visible to Hermes at all):** "Backed by
  a16z / speedrun" — a16z's Speedrun accelerator program. This fact did not exist in Hermes'
  version because it never got a working screenshot.
- **Positioning:** A cloud filesystem that mounts as a native macOS Finder drive; files stream
  byte-ranges on demand instead of syncing whole files to local disk (a la Dropbox/Google Drive).
- **Target audience:** Video/creative professionals working with very large media files (the
  entire hero/product mockup is built around a fictional NYC shoot: RAW/BRAW footage, drone
  clips, 20–60GB files) — not a general consumer audience.
- **Brand voice:** Short declarative sentences, confident/minimal, credibility-by-specificity
  (real app names: DaVinci, Premiere, Photoshop, Blender; real file sizes: "58.4 GB",
  "24.3 GB"). Copy leans technical-professional, not marketing-fluffy.
- **Messaging hierarchy (verified, verbatim):**
  1. Hero H1: "Infinite space / on your computer"
  2. Subhead: "The future of filesystems. Open and edit terabytes of files locally, while using
     zero disk space. Instant sync across devices."
  3. CTAs: "Download" (primary) / "Book a demo" (secondary)
  4. Feature teaser overlay: "▶ Files in Space take up zero bytes on disk"

---

## 2. Color System (verified — extracted from shipped `:root` / `.dark` CSS)

The site ships an actual shadcn/ui-style CSS variable token set. This is the **complete, real**
token block, copied from the production HTML's `<style>` tag:

```css
:root {
  --background: 255 255 255;         /* #ffffff */
  --foreground: 10 10 10;            /* #0a0a0a */
  --muted: 245 245 245;              /* #f5f5f5 */
  --muted-foreground: 115 115 115;   /* #737373 */
  --border: 229 229 229;             /* #e5e5e5 */
  --ring: 0 102 255;                 /* #0066ff  */
  --surface: #0a0a0a;
  --surface-foreground: #fff;
  --font-sans: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "Google Sans Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.dark {
  --background: 10 10 10;            /* #0a0a0a */
  --foreground: 250 250 250;         /* #fafafa */
  --muted: 23 23 23;                 /* #171717 */
  --muted-foreground: 163 163 163;   /* #a3a3a3 */
  --border: 38 38 38;                /* #262626 */
  --ring: 59 130 246;                /* #3b82f6 */
  --surface: #333;
  --surface-foreground: #fafafa;
}
```

Note: the site itself defaults to **light mode** for the marketing page (the Finder mockups
simulate macOS light-mode UI chrome); `.dark` exists as a supported variant, not the default.

**Additional real hex values found repeatedly in inline styles** (used for the Finder-mockup
illustration, not the base token system — these mimic real macOS system colors):

| Hex | Frequency | Likely role (from context in the mockup) |
|---|---|---|
| `#f8f8f8` | 27× | Off-white surface (Finder window background) |
| `#9BD2F6` → `#3D9CE5` → `#0A84FF` (blue ramp, 6 stops, 15× each) | 90× total | Selection-state gradient/ramp on the Finder sidebar's highlighted item — this is Apple's exact system blue ramp |
| `#1d1d1f` | 6× | Apple's own near-black text color (used verbatim — this site borrows Apple's marketing-site palette for the "feels like real macOS" mockups) |
| `#86868b`, `#6e6e73` | 8× | Apple's muted gray text tokens |
| `#f5f5f7` | 3× | Apple's marketing-site light gray background |
| `#ff5f57` / `#febc2e` / `#28c840` | 5× each | macOS traffic-light window buttons (red/yellow/green) — literal, exact Apple values |
| `#1e4a30` | 9× | Dark green — likely the folder icon color in the Finder sidebar |
| `#e8b344` / `#c47a3a` / `#a87830` | amber/tan ramp | Folder/file icon accent colors |
| `#ec4899` | 2× | Pink accent (minor UI element, role not confirmed) |

**Shadows (verified, real values):**
```css
box-shadow: 0 10px 40px rgba(0,0,0,.08);                                  /* card elevation, light */
box-shadow: 0 12px 48px rgba(0,0,0,.5), 0 2px 8px rgba(0,0,0,.3);          /* modal/overlay, heavy */
box-shadow: 0 18px 50px rgba(0,0,0,.05), 0 2px 10px rgba(0,0,0,.03);       /* card elevation, subtle */
box-shadow: 0 30px 80px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.03);       /* large surface elevation */
box-shadow: inset 0 1px 0 hsla(0,0%,100%,.6), 0 12px 48px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04); /* glass/inset highlight, e.g. pricing card */
```

---

## 3. Typography (verified)

- **Sans (`--font-sans`):** `"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif` — loaded via
  `fonts.googleapis.com/css2?family=Google+Sans:wght@400..700`
- **Mono (`--font-mono`):** `"Google Sans Code", ui-monospace, SFMono-Regular, Menlo, Consolas,
  monospace` — loaded via `family=Google+Sans+Code:wght@400..600`
- **Finder-mockup-only override:** `-apple-system, BlinkMacSystemFont, "SF Pro Display" /
  "SF Pro Text", sans-serif` — used *only inside the fake Finder window chrome* to sell the "this
  really is macOS" illusion; the real site body text uses Google Sans, not SF Pro.

**Real font-size values found in the shipped styles** (not a clean modular scale — these are the
literal sizes used across hero/body/Finder-mockup text):

`3rem`, `2.25rem`, `1.875rem`, `1.125rem`, `1.0625rem`, `1rem`, `.8125rem`, `13px`, `12px`, `10px`,
`9.5px`, `9px`, `8.5px`, `8px`, `7.5px`, `7px`, `6.5px`, `6px`, `5.5px`, `5px`

The very small sizes (5–10px) are all inside the Finder-mockup illustration (file-list metadata,
timecodes) — not real body copy sizes. Real content type sizes cluster around `3rem`/`2.25rem`
(hero H1), `1.875rem`/`1.125rem` (section headings), `1rem`/`1.0625rem` (body), `.8125rem`/`13px`
(captions/labels).

---

## 4. Layout & Spacing System (verified)

**Breakpoints — confirmed exact Tailwind CSS defaults**, found as literal `@media` rules in the
shipped CSS:
```
max-width: 640px     (Tailwind's implicit "below sm")
min-width: 640px      sm
min-width: 768px      md
min-width: 900px      (custom, non-Tailwind — used once, likely a one-off component breakpoint)
min-width: 1024px     lg
min-width: 1280px     xl
min-width: 1536px     2xl
```
This, plus arbitrary-value utility classes seen directly in the DOM (e.g.
`md:w-[clamp(360px,44vw,580px)]`), confirms the site is built with **Tailwind CSS**, not a custom
spacing system — a concrete technical fact Hermes' version did not have (it guessed "React/Next.js"
generically with no framework evidence).

**Border-radius scale (verified, real values in use):** `4px, 5px, 6px, 7px, 9px, 10px, 12px,
14px, 20px, 24px, 40px, .375rem, 999px/9999px (pill)`

**Real page section structure (verified from actual in-page anchor IDs, not guessed):**
```
#top            — hero
#overview       — "Never wait for file transfers again" + 3 numbered features (01/02/03)
#product        — Finder-mockup deep dive (sign-in, instant open, Spacebar search, live-upload)
#how-it-works   — (anchor exists; content overlaps visually with #product's Finder mockups)
#pricing        — Individual / Teams / Enterprise, Monthly↔Annual toggle
#faq            — 10 accordion questions
#sign-up        — final CTA ("Ready to journey into Space?")
```
These are the **real** anchor IDs shipped in the page — a materially different (and verifiable)
map versus Hermes' 17-section guess, which was a plausible-sounding reconstruction rather than
something read off the DOM.

---

## 5. Real Page Copy (verified, extracted verbatim from the server-rendered HTML)

### Hero
> Backed by a16z/speedrun
> **Infinite space on your computer**
> The future of filesystems. Open and edit terabytes of files locally, while using zero disk
> space. Instant sync across devices.
> [Download] [Book a demo]
> ▶ Files in Space take up zero bytes on disk

### Overview / 3 numbered features
> Space is the future of file systems. Terabytes of files on your computer, using zero disk
> space.
>
> **Never wait for file transfers again** — Space streams files in real time, straight to the
> app that asks for them. No more juggling hard drives or waiting hours for large file downloads.
>
> **01 — Files open instantly** — Space streams byte ranges from the cloud in real time, meaning
> files don't need to be downloaded for them to be used in applications.
>
> **02 — Instant sync and collaboration** — Hit save and your changes are synced to all devices
> connected to the same Space in seconds. Your teammates see your changes instantly.
>
> **03 — Works with the apps you already use** — DaVinci, Premiere, Photoshop, and Blender all
> see Space as a normal hard drive. No extensions or plugins required.

### Product (Finder mockup features)
> **Sign in, see your drive** — A new drive called Space appears in Finder. All your files are
> there, using none of your disk.
>
> **Open and edit instantly** — Cut, grade, and scrub straight from the drive. Space streams
> only the byte ranges your app asks for, and caches only what you touch.
>
> **Blazingly fast search** — Space comes with Spacebar, a global search that appears when you
> press ⌥ Space. Type and results appear in milliseconds.
>
> **Files arrive before they finish uploading** — Teammates and agents write to Space, and every
> other connected device can open, scrub, and edit the file before the upload even finishes.

### Pricing (verbatim, all 3 tiers)
**Individual** — for solo creators working across multiple computers.
$15/month · $180 billed yearly (save 25%) · 1TB included storage · standard streaming
performance · one seat, all your computers · public file links and upload requests · add more
storage $6/month per 500GB · CTA: "Sign up"

**Teams** — for teams collaborating in shared workspaces.
$30/member/month · $360/member billed yearly (save 40%) · 1TB pooled storage per member ·
high-performance throughput · shared workspaces and member access controls · unlimited owned
drives · whole-drive and direct sharing · guests always free · add more storage $12/month per
500GB · CTA: "Get started"

**Enterprise** — for studios and organizations with custom requirements.
Custom pricing · highest throughput, dedicated infrastructure · custom seats/storage terms ·
granular version controls and retention · custom auditing and compliance · on-prem/private cloud
deployment · white-glove migration and dedicated support · SSO/SAML · CTA: "Book a demo"

*Footnote (verbatim): "Prices in USD. Individual and Teams include a 7-day trial. Annual prices
are monthly equivalents billed yearly."*

### FAQ — 10 real question headings (verified; most answers are accordion-collapsed and not
present in the static HTML, so only the first is quoted in full — **do not infer the rest**)
1. What is Space? — *"Space is a cloud filesystem that appears in Finder as a regular drive.
   Open and save files with the apps you already use while Space keeps them in the cloud and up
   to date across your Macs. You can work with terabytes of files without filling your computer
   or carrying external drives."* (full answer, verified)
2. How is Space different from existing cloud drives? *(question text verified; answer collapsed)*
3. How does Space save disk space? *(collapsed)*
4. Will it work with my existing apps? *(collapsed)*
5. How do files stay in sync across devices? *(collapsed)*
6. Do I need an internet connection? *(collapsed)*
7. What internet speed do you recommend? *(collapsed)*
8. Can AI agents use Space? *(collapsed)*
9. Which platforms does Space support? *(collapsed)*
10. What are the system requirements? *(collapsed)*
11. How does Space protect my files? *(collapsed)*

Footer link (verbatim): *"Still have a question? Write to **the team**. One of us will read it."*
— "the team" is a hyperlink with **no discoverable `mailto:` target** in the static HTML or any
JS bundle. **Hermes' claimed emails (matt@/jason@/ari@getspace.so) do not appear anywhere in the
site's source and should be treated as fabricated, not real contact information.**

### Final CTA & Footer
> Ready to journey into Space? Book a demo to see how Space handles terabytes of files with ease.
> [Book a demo]
>
> Footer: "Space — The infinite filesystem." · nav: Product, Overview, How it works, Pricing,
> FAQ · © Space Computer, Inc.

---

## 6. Components Inventory (verified against real screenshots where available)

| Component | Verified appearance |
|---|---|
| Nav bar | White/light bg, logo mark (abstract two-stroke glyph, left), centered pill-shaped "Menu" button with hamburger icon, "Book a demo" implied on the right in full nav |
| "Backed by" badge | Pill shape, light-gray fill, border, small caps "Backed by" label + "a16z/speedrun" partner logos inline |
| Hero H1 | Two-line, first line bold black (`Infinite space`), second line lighter gray weight (`on your computer`) — a deliberate two-tone hero treatment, confirmed visually |
| Primary CTA ("Download") | Solid black pill button, white text |
| Secondary CTA ("Book a demo") | Outline pill button, black border, black text, white fill |
| Finder sidebar (mockup) | Dark macOS-Finder-accurate sidebar: Favorites/Locations sections, exact section labels (Desktop, Documents, Locations, Space, Macintosh HD, AirDrop, Trash), custom categories (A-CAM, DRONE, AUDIO) |
| File cards (mockup grid) | Filetype badge (braw/mp4/arw), filename, size label — real fake data (24.3GB, 4.2GB etc.) |
| Feature number badges | "01"/"02"/"03", large, likely `3rem`-scale per §3 |
| Pricing cards | 3-column, Individual/Teams/Enterprise, annual-savings badges ("save 25%"/"save 40%"), bullet lists |
| Pricing toggle | Monthly ↔ Annual segmented control |
| FAQ | Accordion, 11 questions, only first expanded by default |

---

## 7. Technical Architecture (verified)

- **Static site generator:** **Gatsby** — every head tag carries `data-gatsby-head="true"`,
  bundle filenames match Gatsby's webpack output convention (`webpack-runtime-*.js`,
  `framework-*.js`, `app-*.js`)
- **CSS framework:** **Tailwind CSS** — confirmed via exact default breakpoint values and
  arbitrary-value utility classes present in the raw markup
- **Design tokens:** shadcn/ui-style CSS custom properties (`--background`, `--foreground`,
  `--muted`, `--ring`, etc.) — this is the same token-naming convention shadcn/ui + Radix-based
  component libraries use
- **Hosting/edge:** `server: cloudflare` + `via: 1.1 Caddy` + `x-powered-by: Express` +
  `x-railway-request-id` / `x-railway-edge` headers — confirms **Railway** (PaaS) running an
  Express server behind a Caddy reverse proxy, fronted by **Cloudflare** (WAF blocks datacenter
  IPs; residential/desktop IPs pass through cleanly)
- **Assets CDN:** separate `assets.spacefs.com` subdomain, also Cloudflare-fronted, serves the
  poster JPGs directly with public CORS headers (`access-control-allow-origin: *`)
- **Fonts:** Google Fonts, loaded via standard `<link>` (not self-hosted)
- **JS bundle sizes (verified, all downloaded):** `app-*.js` 95.9KB, `framework-*.js` 140.9KB,
  one additional chunk 215KB — a small, fast-loading marketing page by design

---

## 8. Assets Manifest

**Downloaded and included in this commit** (`assets/`):
- `posters/` — 12 real JPGs from `assets.spacefs.com/public/clips/posters/`: startup-loft,
  night-plaza, harbour-tower-dusk, sunset-studio, lens-macro, city-dusk-panorama,
  steel-bridge-ride, pizza-window, nyc-brownstones, night-intersection, wtc-waterfront,
  library-study (18–54KB each, ~370KB total)
- `icons/` — `favicon.ico`, `favicon-32.png`, `favicon.png` (512×512), `og-image.png` (the real
  Open Graph share image, 377KB)
- `screenshots/01-hero-desktop.png` — real, verified render of the hero section at 1440px
  desktop width
- `screenshots/02-overview-desktop.png` — real, verified render confirming the hero persists at
  the `#overview` anchor with the next section's imagery visible at the bottom edge

**Not captured this pass** (see §10 for why, and how to finish this):
- Full-page scroll captures of `#product`, `#pricing`, `#faq`, `#sign-up` — attempted via
  automated browser control but this desktop's window compositor did not reliably focus newly
  spawned browser windows for screenshot capture (multiple attempts landed on the user's own
  unrelated, already-open windows instead — including personal photo library content, which was
  immediately discarded unused rather than risk continuing an unreliable, privacy-risking method)
- Tablet/mobile viewport screenshots
- Raw SVG extraction (the logo mark appears to be an inline SVG or icon font glyph — not
  isolated as a standalone asset this pass)
- Hover/focus/active interaction states
- The 9 collapsed FAQ answers (require a real click interaction to expand; not present in
  static HTML)

---

## 9. Recreation Guide

**Priority order to rebuild an accurate replica:**
1. **Tooling:** Gatsby (or any React SSG) + Tailwind CSS with the exact `:root`/`.dark` token
   block from §2 dropped in verbatim — this alone gets colors/spacing/radii right immediately,
   since these are the site's real values, not estimates.
2. **Fonts:** Load Google Sans + Google Sans Code from Google Fonts exactly as shown in §3.
3. **Hero:** Two-tone H1 (`Infinite space` bold black / `on your computer` lighter gray), pill
   badge, two pill CTAs (solid black / outline).
4. **Finder mockup:** This is the visual centerpiece of the whole page — budget the most build
   time here. It's a pixel-accurate fake macOS Finder window (traffic-light buttons in the exact
   macOS reds/yellows/greens `#ff5f57`/`#febc2e`/`#28c840`, real Apple system-gray text colors).
   Treat it as a dedicated illustrated component, not a generic "screenshot mockup" image.
5. **Pricing:** 3-column grid, monthly/annual toggle, exact copy from §5 — this is
   straightforward once tokens are in place.
6. **FAQ:** Standard accordion; only question text is verified — you'll need to either invent
   plausible answers (and mark them as such) or click through the live site to capture the real
   ones, which this pass didn't do.

**What NOT to guess, now that it's verified:** colors, fonts, breakpoints, radii, and shadows are
all in §2–4 verbatim from the shipped CSS. There is no need to eyeball these from screenshots —
use the real values.

---

## 10. Honest Limitations of This Pass

- Real, network-verified data (HTML, CSS tokens, JS bundle sizes, downloaded image assets) is
  complete and trustworthy.
- Visual screenshot coverage is **partial** (2 of ~6 real sections) because this desktop's
  compositor (COSMIC on Wayland) did not reliably hand focus to freshly-spawned browser windows
  for automated screenshot capture — some attempts silently captured unrelated already-open
  windows instead. Rather than keep retrying an unreliable method that risked repeatedly
  capturing the operator's personal, unrelated browser content, capture was stopped once that
  risk was identified, and no unrelated captures were kept or used.
- To finish full visual coverage: a human (or an agent with reliable window-focus control, e.g.
  via `xdotool`/proper Wayland window-management tooling) should manually navigate to
  `#product`, `#pricing`, `#faq`, `#sign-up` and capture each, plus resize to ~390px and ~820px
  widths for mobile/tablet.