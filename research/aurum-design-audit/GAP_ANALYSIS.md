# GAP_ANALYSIS — Aurum vs heyclicky vs Wispr Flow

> Side-by-side, every dimension. Sourced from the computed design-system
> files (design-systems/*.md) + captured screenshots + DOM extracts.
> Cite: screenshots/... | design-systems/...md.

## 1. Color
| Dimension | heyclicky | Wispr Flow | Aurum |
|-----------|-----------|-------------|--------|
| Base bg | #F5F5F5 near-white | #FFFFEB warm cream | #0B0D12 near-black navy |
| Text | #000 black | #1A1A1A near-black | #E8EBF0 near-white |
| Brand accent | #0F7FFF blue | #F0D7FF lavender + #FFA946 orange | #E9C46A gold |
| Mode | Light | Light (warm) | Dark |
| Surfaces | flat white | cream + dark cards | stepped dark (#10131A/#161E22/#232833) |
| Borders | rgba(0,0,0,0.08-0.5) | rgba(26,26,26,0.1-0.5) | #2F3644 |

Observation: Aurum is the ONLY dark-mode site of the three. References are
light/editorial. Aurum's gold-on-near-black is closer in *spirit* to a
premium SaaS (Linear/Vercel vibe the vision model noted) than to either
reference. The references' defining trait is **editorial warmth** (cream,
serif headlines, lavender) which Aurum lacks entirely.

## 2. Typography
| | heyclicky | Wispr Flow | Aurum |
|---|---|---|---|
| UI font | Inter | Figtree | system-ui stack |
| Headline font | Inter (88px/500/-2.64px) | **EB Garamond serif** (120px/400/-6px) | system sans (bold) |
| Logo | (serif wordmark per vision) | purple wordmark | **Times New Roman serif** (confirmed in token dump) |
| Body | 16px/24px | 16px/20.8px | 16px/24.8px |

Observation: Wispr Flow's signature is a **serif display headline + sans
body** pairing (EB Garamond + Figtree). Aurum ALSO mixes serif (logo,
Times New Roman) + sans (UI) — but inconsistently and with system
fallbacks, not a deliberate, loaded pairing. heyclicky uses pure Inter.
Aurum's typography is *unfinished*: it relies on Times New Roman
(serif default) for the logo rather than a loaded display face.

## 3. Spacing / Layout
| | heyclicky | Wispr Flow | Aurum |
|---|---|---|---|
| Hero align | centered | centered | **centered** |
| Grid | 1-col -> grids | sticky nav + carousels + bands | 4-col feature grid |
| Whitespace | generous | generous | generous |
| Nav | logo + 2 text links + CTA | **sticky**, dropdowns, CTA right | logo + 2 links + gold CTA |

Observation: Aurum's homepage layout is structurally closest to a polished
SaaS — but it is the ONLY one of the three WITHOUT a sticky header
(Wispr Flow has sticky; heyclicky header scrolls). Aurum's authenticated
app surfaces (dashboard/mastery builder) were NOT captured, so the
in-app spacing discipline is UNCONFIRMED.

## 4. Components
| Component | heyclicky | Wispr Flow | Aurum |
|---|---|---|---|
| Buttons | flat text/link + black/white fill, radius 0 | **pill-shaped**, purple fill, shadow | gold fill / ghost / mint, radius (in globals.css) |
| Cards | red wireframe boxes | dark rounded w/ white text, subtle shadow | solid dark blocks, no shadow |
| Icons | emoji + bare SVG | flat app icons w/ subtle float shadow | **emoji/unicode** (Target, Check, Pencil) |
| Testimonials | tweet embeds | quote container + avatar | none in app yet |
| Carousel | none | **core pattern** (16+ apps) | none |
| Accordion | FAQ (9 items) | none | none |

Observation (the big one): **Aurum uses emoji/unicode as icons**
(confirmed in design-systems/aurum.md + vision of feature cards). Both
reference sites use either a real icon library (Wispr = flat app icons)
or none (heyclicky). Aurum's emoji icons read as **lower-fidelity /
placeholder** vs the references' intentional iconography. This is the
single highest-leverage visual fix.

## 5. Motion
| | heyclicky | Wispr Flow | Aurum |
|---|---|---|---|
| Hero | autoplay .mov videos | photo band w/ motion blur | gradient text |
| Transitions | none captured | carousel slides, hover | gold hover brightness(1.07) (per README) |
| Loading | n/a | carousel | UNCONFIRMED (app not captured) |

Observation: Aurum has the LEAST motion of the three. Wispr Flow's
carousel + motion-blur photo band create perceived *speed* (on-brand for
a dictation product). Aurum's only motion is a hover brightness shift.

## 6. Brand voice (from content extracts)
| | heyclicky | Wispr Flow | Aurum |
|---|---|---|---|
| Person | "you" + playful ASCII | "you" + confident | "you" + direct |
| Tone | meme-y, anti-AI-grifter ("No AI 2.0 bullshit") | premium, editorial, fast | helpful, structured |
| Signature | ASCII faces (^ ω ^), tweet social proof | "cheat code for your inbox" | "real mastery" gradient |

Observation: Aurum's copy ("Turn scattered YouTube tutorials into real
mastery") is solid but **generic SaaS**. Wispr Flow's voice is
distinctive ("cheat code for clearing your inbox", "Voice is the future
of human-computer interaction"). heyclicky's is personality-driven (ASCII,
founder tweets). Aurum sits between — competent, not memorable.

## 7. Completeness (capture reality)
- heyclicky: **WIP** — homepage only, lower sections are red wireframe
  placeholders. Sub-routes 404.
- Wispr Flow: **production-complete** — home + about + use-cases + 13
  footer sub-pages all reachable.
- Aurum: **production-complete marketing + auth**; authenticated app
  (dashboard/mastery builder/generate) NOT captured (gated).

## PRIORITIZED FIXES (for the rebuild — see DESIGN_GUIDE.md)
1. **Icons**: replace emoji/unicode with a real library (Lucide or
   Heroicons). Effort: LOW. Affects: every card, nav, feature.
   (evidence: design-systems/aurum.md iconography section)
2. **Type pairing**: load a deliberate display serif + sans (e.g.
   **Fraunces/Satoshi or General Sans + a serif**) instead of Times
   New Roman fallback. Effort: LOW. Affects: logo + all headlines.
3. **Sticky header**: add sticky/top-blur header like Wispr Flow.
   Effort: LOW. Affects: all pages.
4. **Motion**: add micro-interactions (button press scale, card hover
   lift, page fade-in) to match reference energy. Effort: MED.
5. **Surface depth**: add subtle shadows/elevation to cards (Wispr
   dark cards have shadow; Aurum cards are flat). Effort: LOW.
6. **Voice**: sharpen copy toward a distinctive line (Wispr-style
   memorable phrase) for hero + CTAs. Effort: MED (writing).
7. **Capture gated app UI**: log in and screenshot dashboard/mastery
   builder/generate with real data. Effort: LOW (needs credentials).
