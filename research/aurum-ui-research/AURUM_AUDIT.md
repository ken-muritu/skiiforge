# AURUM — UI/UX AUDIT & REDESIGN STUDY (MASTER)

> Single consolidated deliverable. Generated 2026-07-26.

> Compiled from the full `research/aurum-ui-research/` audit. References: heyclicky.com (WIP — not a model), wisprflow.ai (north star).


---

# AURUM — UI STYLE GUIDE (canonical rebuild reference)

> Built from `research/aurum-ui-research/` audit. Every token/claim
> traces to a captured file. Sources cited inline.

## 0. Executive verdict (plain language)
Aurum's homepage is **competent but reads as unshipped**: emoji icons
(placeholder-grade), a logo rendering in **Times New Roman** (serif
fallback, not a loaded face), flat surfaces with **no elevation or motion**,
and a nav that **scrolls away**. The two references split: **heyclicky
is a WIP** (red wireframe placeholders — do NOT model on it); **Wispr Flow
is production-complete and is the model** (EB Garamond + Figtree, cream
#FFFFEB, lavender #F0D7FF, carousels, motion-blur). Aurum should
keep its dark gold/mint identity and lift fidelity to the Wispr tier.

## 1. Design principles (justified by reference)
1. **Load a real type system.** Wispr uses EB Garamond (120px/400/-6px)
   + Figtree — serif-display + sans-body reads premium. Aurum's
   Times New Roman logo is the #2 fidelity gap. [wisprflow/typography.md]
2. **Icons are a system, not emoji.** Wispr uses flat app icons w/
   subtle float-shadow. Aurum's Target/Check/Pencil emoji read as placeholder.
   [design-systems/aurum.md iconography, comparison/DESIGN_GAPS Gap 1]
3. **Motion conveys the value prop.** Wispr's photo motion-blur = "speed".
   Aurum's only motion is gold hover-brightness. Add card lift, button
   press-scale, page fade-in. [wisprflow/motion.md, aurum/motion.md]
4. **Sticky, blurred nav.** Wispr's header persists + blurs on scroll.
   Aurum's scrolls away. [wisprflow/content, aurum/components.md #1]
5. **Generous editorial whitespace.** Both refs use calm, large gaps.
   Aurum is decent here — keep it. [wisprflow/spacing.md]

## 2. Design tokens (drop into `:root` of globals.css)

```css
:root{
  /* color — keep Aurum's dark identity, add semantic tokens */
  --bg:#0B0D12; --surface-1:#10131A; --surface-2:#161E22; --surface-3:#232833;
  --border:#2F3644;
  --text:#E8EBF0; --text-muted:#9AA3B2;
  --gold:#E9C46A; --gold-soft:rgba(233,196,106,.12); --gold-hi:rgba(233,196,106,.25);
  --mint:#7FE7C4;
  --danger:#FF6B6B; --success:#5BD98C; --warning:#FFB454;  /* MISSING before — add for form/toast */
  /* type — LOAD these via next/font, do NOT fallback */
  --font-sans:"Satoshi","General Sans",system-ui,sans-serif;
  --font-serif:"Fraunces","Playfair Display",Georgia,serif;
  --fs-hero:clamp(40px,7vw,88px); --fs-h1:56px; --fs-h2:32px; --fs-h3:20px;
  --fs-body:16px; --fs-small:13px;
  --lh-body:1.55; --ls-tight:-0.02em;
  /* spacing — 8px base */
  --sp-1:8px; --sp-2:16px; --sp-3:24px; --sp-4:32px; --sp-5:48px; --sp-6:64px;
  --container:1200px;
  /* radius */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:999px;
  /* elevation — NONE existed before; add */
  --shadow-1:0 1px 2px rgba(0,0,0,.4);
  --shadow-2:0 8px 24px rgba(0,0,0,.45);
  --shadow-gold:0 8px 24px rgba(233,196,106,.18);
  /* motion */
  --ease:cubic-bezier(.4,0,.2,1); --t-fast:140ms; --t-med:220ms; --t-slow:360ms;
}
@media (prefers-reduced-motion:reduce){ *{transition:none!important; animation:none!important} }
```

## 3. Component redesign (before → after)

**Button (.btn-gold)** — before: solid gold, hover `brightness(1.07)` only.
after: `--r-pill`, `--shadow-gold` on hover, `translateY(-1px) scale(1.01)`,
active `scale(.98)`, focus-visible ring. [DESIGN_SYSTEM_PLAN.md]

**Icon** — before: emoji (Target/Check/Pencil). after: **Lucide** React,
20–24px, `currentColor`, stroke 1.75. [comparison/DESIGN_GAPS Gap 1]

**Card** — before: flat dark block, no shadow. after: `--surface-1`, `--r-lg`,
`--shadow-1`; hover `--shadow-2` + border brighten + `translateY(-2px)`.

**NavBar** — before: scrolls away. after: `position:sticky; top:0;
backdrop-filter:blur(12px)` + `border-bottom` appears on scroll>0. [wisprflow/content]

**Input** — before: label + input, mint focus. keep focus, add `--r-md`,
error state uses `--danger` border + inline message (icon+text, not color-only).

**Progress bar** — before: fills on mark-complete. after: add `--t-med`
transition + subtle gold glow on 100%.

**Footer** — before: single centered CTA. after: multi-column (Product /
Resources / Company) like Wispr, + giant wordmark. [wisprflow/content footer]

**404** — keep Next default; restyle to dark/gold.

## 4. Page-by-page notes (Aurum routes)

- **/ (home)**: swap emoji→Lucide; Fraunces hero "real mastery" gradient;
  sticky header; card hover-lift; sharpen CTA to 1 signature line (open Q below).
- **/login /signup /forgot /reset**: card elevation; focus ring; error
  states with `--danger` + icon; reduced-motion guard.
- **/discover**: empty-state illustration (currently UNCONFIRMED capture —
  add a "no public Masteries yet" art + CTA).
- **/dashboard** (gated, UNCONFIRMED capture): continue-learning card w/ gold
  progress; my-Masteries grid (hover-lift); recent-activity feed.
- **/masteries + /masteries/new**: form tokens; validation UI.
- **/masteries/[id]** (CORE, gated): icon + progress-motion + resource
  cards + quiz/project editor; fork confirm modal.
- **/generate** (gated): topic input + proposal preview + save; loading skeleton.

## 5. Open questions (need YOUR call)
1. **Signature line.** Current "Turn scattered YouTube tutorials into real
   mastery" is competent but generic. Borrow Wispr's "cheat code for your
   inbox" move? Suggested alt: *"Your learning, actually finished."* — pick or write.
2. **Light mode?** Aurum is dark-only. Wispr is light/cream. Keep dark-only
   (brand) or add a light theme later? (No action now — dark is fine.)
3. **Mint vs gold primacy.** Currently gold primary, mint secondary. Keep, or
   promote mint to primary CTA? (Recommend: keep gold primary.)
4. **Carousel on /discover?** Wispr's app-carousel is its signature. Add a
   "featured public Masteries" carousel on /discover or home? (Nice-to-have.)
5. **Gated app capture.** To finish the audit's app-section screenshots, I need
   a logged-in browser session (credentials or a test account). The public
   routes + login-redirect state are captured; the dashboard/builder WITH data
   are not.

## 6. Do's / Don'ts
- DO load Fraunces + Satoshi via `next/font`. DON'T leave Times New Roman.
- DO use Lucide. DON'T ship emoji as product icons.
- DO add `--shadow` + hover-lift. DON'T ship flat-only surfaces.
- DO keep the dark gold/mint brand. DON'T copy Wispr's cream palette.
- DO add `prefers-reduced-motion`. DON'T animate without a reduced fallback.


---
## FINDINGS: COMPARISON

# Findings Comparison

> Consolidated findings. Generated 2026-07-26.


## UX Comparison (Aurum vs heyclicky vs Wispr Flow)

> Every claim traceable to a captured file (design-systems/*.md,
> screenshots/*, content/*.md). Gaps flagged UNCONFIRMED.

## Navigation Comparison
- Aurum: logo + 2 text links (Discover, Log in) + gold CTA. **Scrolls away** (not sticky). [screenshots/aurum/*/home_*]
- heyclicky: logo + 2 in-page links + CTA. Not sticky. [design-systems/heyclicky.md]
- Wispr Flow: **sticky** header, dropdowns (Product/Resources/Company), CTA right. [content/wisprflow.md, vision]
- **Gap**: Aurum lacks sticky + dropdowns. LOW-effort fix.

## Layout Comparison
- All three: centered hero + generous whitespace.
- Aurum: 4-col feature grid. [home shots]
- Wispr Flow: carousels (16+ apps) + photo band. [use-cases DOM]
- heyclicky: WIP wireframe blocks. [home_404 shot]
- **Gap**: Aurum has no carousel/photo-band motion. MED effort.

## Typography Comparison
- Aurum: system-ui stack + **Times New Roman** logo (serif fallback). [design-systems/aurum.md]
- heyclicky: Inter 88px/500/-2.64px. [computed]
- Wispr Flow: **EB Garamond serif H1 120px/400/-6px** + Figtree sans. [computed]
- **Gap**: Aurum's type is unloaded/fallback. LOW-effort: load Fraunces + a sans.

## Motion Comparison
- Aurum: gold hover brightness(1.07) only. [motion.md]
- heyclicky: hero .mov autoplay. [motion.md]
- Wispr Flow: carousel slides + photo motion-blur. [vision]
- **Gap**: Aurum is the least animated. MED effort.

## Branding Comparison
- Aurum: "Knowledge Operating System", competent/direct. [brand-voice.md]
- heyclicky: playful/ASCII/anti-AI-grifter. [brand-voice.md]
- Wispr Flow: premium editorial, "cheat code for your inbox". [brand-voice.md]
- **Gap**: Aurum's voice is competent but not memorable.

## Content Comparison
- Aurum: hero + 4 feature cards + auth. [content/aurum.md]
- heyclicky: hero + features + THE DREAM + FEEDBACK tweets + pricing + FAQ. [content/heyclicky.md]
- Wispr Flow: hero + sections + 13-footer-subpages + press. [content/wisprflow.md]
- **Gap**: Aurum's app content (dashboard/mastery builder) UNCONFIRMED.

## Component Comparison
- Aurum: **emoji/unicode icons** (Target/Check/Pencil). [components.md]
- heyclicky: emoji + bare SVG. [components.md]
- Wispr Flow: flat app icons w/ subtle float-shadow. [components.md]
- **Gap**: Aurum's emoji icons read as placeholder. LOW effort: Lucide.

## UX Comparison
- Aurum: standard SaaS flow (signup->dashboard). Gated content UNCONFIRMED.
- Wispr Flow: rich use-case browser (carousels). heyclicky: minimal.

## Accessibility Comparison
- Aurum: high contrast (#E8EBF0 on #0B0D12), mint focus ring. [accessibility.md]
- Wispr Flow: high contrast (near-black on cream). [accessibility.md]
- **Gap**: Aurum missing prefers-reduced-motion + explicit danger/success tokens. LOW effort.

## Information Architecture
- Aurum: / -> /discover -> /dashboard -> /masteries -> /masteries/[id] -> /generate. [site-map.md]
- Wispr Flow: home -> about/use-cases + 13 subpages.
- heyclicky: single page + anchors.

## Visual Hierarchy
- Aurum: serif logo > gold H1 gradient > grey body. Clear. [vision]
- Wispr Flow: 120px serif H1 > editorial body. Strongest.

## Responsiveness
- Aurum: 3 viewports captured (desktop full; tablet/mobile partial). [manifest]
- References: desktop only this pass. UNCONFIRMED tablet/mobile.

## Empty States
- Aurum: /discover empty UNCONFIRMED; app empty states UNCONFIRMED (gated).
- Wispr Flow: carousel "1/16" counters imply populated.

## Forms
- Aurum: label + input + mint focus; validation-error UNCONFIRMED capture. [manifest]
- Wispr Flow: no marketing forms.

## CTA Comparison
- Aurum: "Build your first Mastery", "Get started". [content]
- Wispr Flow: "Download for free", "Try Flow". Repeated.
- heyclicky: "download for mac", "get pro/max".

## Conversion Strategy
- Aurum: dual CTA (action + low-commit "Explore").
- Wispr Flow: free-download repeated + use-case carousels (reduce friction).
- heyclicky: tweet social proof + founder transparency.

## Visual Analysis (side-by-side)

## Color identity
| | Aurum | heyclicky | Wispr Flow |
|---|---|---|---|
| Mode | **Dark** #0B0D12 | Light #F5F5F5 | Warm cream #FFFFEB |
| Brand | Gold #E9C46A | Blue #0F7FFF | Lavender #F0D7FF + Orange #FFA946 |
| Text | #E8EBF0 | #000 | #1A1A1A |

Aurum is the ONLY dark site. References are light/editorial. Aurum's
gold-on-near-black is closer in *spirit* to premium SaaS than to
either reference — but it lacks the *warmth* (cream, serif) the
references use to feel human.

## Type personality
- Aurum: system sans + Times New Roman logo = **unfinished**.
- heyclicky: Inter, tight (-2.64px) = clean tech.
- Wispr Flow: **EB Garamond serif + Figtree** = magazine premium.
Wispr Flow's pairing is the model to borrow (serif display + sans body).

## Icon fidelity
- Aurum: emoji (placeholder-grade).
- heyclicky: bare SVG.
- Wispr Flow: real flat icon set (highest fidelity).
Aurum's emoji is the single most visible fidelity gap.

## Motion energy
- Aurum: static (hover brightness only).
- heyclicky: video-driven.
- Wispr Flow: carousel + motion-blur (highest energy).
Aurum feels "still" vs Wispr Flow's "speed".

## Overall polish verdict
- Aurum homepage: competent, structured, but reads as **unshipped**
  (emoji icons, fallback serif, flat). NOT broken — upgradeable.
- heyclicky: WIP (wireframe placeholders) — NOT a model.
- Wispr Flow: **production-complete, premium** — THE model.

## Brand Analysis

## Mission framing
- Aurum: "Knowledge Operating System" — positions as infrastructure for learning.
- heyclicky: "an ai buddy that lives on your mac" — companion/persona.
- Wispr Flow: "The Voice Interface Company" — category definer.
Wispr Flow's category-claim is the strongest positioning move.

## Voice consistency
- Aurum: direct, second-person, competent. Consistent across hero/cards/CTA. [brand-voice.md]
- heyclicky: playful, ASCII, anti-grifter. Consistent (founder-driven).
- Wispr Flow: premium, confident, fast. Consistent.

## Memorability
- Aurum: "real mastery" gradient is the one distinctive hook. Underused.
- heyclicky: tweet social proof + ASCII faces = memorable persona.
- Wispr Flow: "cheat code for your inbox" = one liners that stick.
**Aurum should mint 1-2 signature lines** (open Q in DESIGN_GUIDE).

## Trust building
- Aurum: "it's free" + fork/social proof. Adequate.
- heyclicky: founder tweets + "screenshots never stored" transparency.
- Wispr Flow: press (WSJ, VC lists) + named testimonials.
Aurum's gated app (uncaptured) likely has more trust surface to mine.

## Conversion language
- Aurum: dual CTA (action + low-commit "Explore"). Sound.
- Wispr Flow: free-download repeated + use-case browser.
- heyclicky: waitlist + tweet FOMO.

## Design Gaps (prioritized)

> Prioritized. Each cites a captured file. Effort: LOW / MED / HIGH.

## Gap 1 — Emoji/unicode icons (HIGHEST leverage)
- **What**: Aurum uses Target/Check/Pencil emoji in feature cards + nav. [design-systems/aurum.md iconography, components.md #9]
- **Reference**: Wispr Flow uses flat app icons w/ subtle shadow; heyclicky uses bare SVG. Neither uses emoji as primary iconography.
- **Why it matters**: emoji read as placeholder/low-fidelity vs a real icon set. Affects every card, nav, feature.
- **Fix**: Replace with **Lucide** (React) — matches Vercel/Linear vibe Aurum already leans toward. [DESIGN_GUIDE.md component redesign]
- **Effort**: LOW. **Affects**: all pages.

## Gap 2 — No loaded type system (logo = Times New Roman fallback)
- **What**: Aurum's logo renders in Times New Roman (serif default); UI is system-ui stack. [design-systems/aurum.md typography, allFonts dump showed "Times New Roman"]
- **Reference**: Wispr Flow pairs EB Garamond (120px serif H1) + Figtree; heyclicky uses Inter 88px/500.
- **Fix**: Load a deliberate display serif + geometric sans (e.g. **Fraunces + Satoshi/General Sans**). [DESIGN_GUIDE.md token spec]
- **Effort**: LOW. **Affects**: logo + all headlines.

## Gap 3 — No sticky header
- **What**: Aurum's nav scrolls away. [components.md #1, home shots]
- **Reference**: Wispr Flow has a **sticky** blurred nav. [content/wisprflow.md]
- **Fix**: position:sticky + backdrop-blur + border-on-scroll.
- **Effort**: LOW. **Affects**: all pages.

## Gap 4 — Flat surfaces, no elevation/motion
- **What**: Cards/buttons have no shadow; only gold hover brightness(1.07). [motion.md, colors.md]
- **Reference**: Wispr Flow cards have subtle shadow + carousel motion + photo motion-blur.
- **Fix**: add --shadow-1/2, hover lift, button press-scale, page fade-in. [DESIGN_GUIDE.md]
- **Effort**: MED. **Affects**: cards, buttons, app surfaces.

## Gap 5 — No semantic color tokens (danger/success)
- **What**: Token dump found NO error/success colors. [design-systems/aurum.md allColors]
- **Fix**: add --danger/--success/--warning; use in form errors + toasts.
- **Effort**: LOW. **Affects**: forms, toasts.

## Gap 6 — Missing prefers-reduced-motion
- **What**: No reduced-motion media query found. [accessibility.md]
- **Fix**: wrap transitions; disable on reduced-motion.
- **Effort**: LOW.

## Gap 7 — Voice not distinctive
- **What**: "Turn scattered YouTube tutorials into real mastery" is competent but generic SaaS. [brand-voice.md]
- **Reference**: Wispr Flow "cheat code for your inbox", heyclicky "no AI 2.0 bullshit".
- **Fix**: sharpen hero + CTA to one memorable line (open Q in DESIGN_GUIDE).
- **Effort**: MED (writing).

## Gap 8 — Auth-gated app UI uncaptured
- **What**: /dashboard /masteries /generate show login-redirect; real content UNCONFIRMED. [manifest]
- **Fix**: log in + screenshot with data (needs credentials).
- **Effort**: LOW (needs session).

## Scorecard

> 1-5 (5 = best). Aurum vs references. UNCONFIRMED = not enough
> data to score (gated/desktop-only).

| Dimension | Aurum | heyclicky | Wispr Flow | Notes |
|---|---|---|---|---|
| Color system | 4 | 3 | 4 | Aurum dark is cohesive; heyclicky WIP |
| Typography | 2 | 3 | 5 | Aurum fallback serif drags it |
| Iconography | 1 | 2 | 5 | Aurum emoji = biggest gap |
| Motion | 1 | 2 | 5 | Aurum near-static |
| Components | 3 | 1 | 4 | heyclicky wireframe |
| Layout/IA | 4 | 3 | 5 | Aurum solid; Wispr richest |
| Sticky nav | 1 | 1 | 5 | Aurum + heyclicky both scroll away |
| Accessibility | 3 | 2 | 3 | Aurum high-contrast but no reduced-motion |
| Brand voice | 3 | 4 | 4 | Aurum competent, not memorable |
| Content depth | 3* | 3 | 5 | *Aurum gated app UNCONFIRMED |
| Responsive | 3* | 1* | 1* | *desktop-only this pass for refs; Aurum tablet/mobile partial |

## Weighted read
- **Aurum's weakest**: Iconography (1), Motion (1), Sticky nav (1), Type (2).
- **Aurum's strongest**: Color (4), Layout/IA (4), Content intent (3).
- **North star**: Wispr Flow (5s across the board except none).
- **heyclicky is NOT a model** — it's a WIP; do not benchmark Aurum against it.

## Top 3 fixes (highest score lift, lowest effort)
1. Icons: emoji -> Lucide (LOW, +4 on iconography).
2. Type: load Fraunces + Satoshi (LOW, +2-3 on typography).
3. Sticky header + card elevation (LOW, +2-3 on nav/components/motion).


---
## FINDINGS: RECOMMENDATIONS

# Findings Recommendations

> Consolidated findings. Generated 2026-07-26.


## Quick Wins (do first)

1. **Icons: emoji -> Lucide** [design-systems/aurum.md #9]
   - Remove Target/Check/Pencil unicode from feature cards + nav.
   - Add `lucide-react`; use `<Target/> <CheckCircle/> <Pencil/> <Sparkles/>`.
   - Effort: ~1hr. Affects: home, dashboard, mastery builder, every card.

2. **Load a real type system** [design-systems/aurum.md typography]
   - Add Fraunces (display serif) + Satoshi/General Sans (sans) via `next/font`.
   - Replace Times New Roman logo + system-ui stack.
   - Effort: ~1hr. Affects: logo + all headlines/body.

3. **Sticky header** [components.md #1]
   - `position: sticky; top:0; backdrop-blur` + border-on-scroll in NavBar.
   - Effort: ~30min. Affects: all pages.

4. **Card/button elevation + hover** [motion.md, DESIGN_GUIDE.md]
   - Add `--shadow-1/2`; hover lift (`translateY(-2px)`), button press-scale.
   - Effort: ~1hr. Affects: cards, buttons, app surfaces.

5. **Semantic color tokens** [design-systems/aurum.md colors]
   - Add `--danger/--success/--warning` + use in form errors/toasts.
   - Effort: ~30min.

6. **prefers-reduced-motion** [accessibility.md]
   - Wrap transitions; disable on reduced-motion.
   - Effort: ~15min.

7. **Capture gated app UI** [manifest]
   - Log in, screenshot /dashboard /masteries/[id] /generate with data.
   - Effort: ~30min (needs credentials). Unblocks the whole app audit.

Total quick-win effort: ~5-6 hrs. Lifts Aurum from "unshipped" to
"premium SaaS" on the SCORECARD (iconography 1->5, type 2->4, nav 1->4).

## Redesign Plan

> Goal: keep Aurum's dark identity + structure (they work), upgrade
> fidelity to Wispr Flow's tier. NOT a structural redo.

## Phase 0 — Foundations (token system)
- Implement `:root` token block from AURUM_UI_GUIDE.md (color/type/
  spacing/radius/shadow/motion).
- Load Fraunces + Satoshi via next/font. Add Lucide.
- Effort: 1 day.

## Phase 1 — Marketing (public)
- Home: swap emoji->Lucide icons; Fraunces hero; sticky header;
  card hover-lift; sharpen CTA copy to 1 signature line.
- /discover: empty-state illustration; card lift.
- /login /signup /forgot /reset: card elevation; focus ring;
  error states with icon+text (not color-only).
- Effort: 2-3 days.

## Phase 2 — Authenticated app (gated, currently UNCONFIRMED)
- /dashboard: continue-learning card w/ gold progress; my-masteries
  grid (hover-lift); recent-activity feed.
- /masteries + /masteries/new: form tokens; validation UI.
- /masteries/[id]: THE core surface — icon+progress-motion+resource
  cards+quiz/project editor; fork confirm modal.
- /generate: topic input + proposal preview + save; loading skeleton.
- Effort: 3-4 days (after gated capture).

## Phase 3 — Motion + polish
- Page fade-in; button press-scale; carousel/slide for discover or
  mastery lessons; reduced-motion guard.
- Effort: 1-2 days.

## Phase 4 — Content/voice
- Mint 2 signature lines (hero + CTA). Refresh empty/error microcopy.
- Effort: 1 day (writing).

## Total: ~2 weeks, 1 engineer. No backend changes required
(the audit is purely frontend fidelity).

## Design System Plan (token spec)

> Mirror of AURUM_UI_GUIDE.md `:root`, expanded with rationale.

## Color (keep dark identity, refine)
```
--bg:#0B0D12; --surface-1:#10131A; --surface-2:#161E22; --surface-3:#232833;
--border:#2F3644; --text:#E8EBF0; --text-muted:#9AA3B2;
--gold:#E9C46A; --gold-soft:rgba(233,196,106,.12); --mint:#7FE7C4;
--danger:#FF6B6B; --success:#5BD98C; --warning:#FFB454;
```
Rationale: keep Aurum's gold/mint brand; ADD danger/success (missing).

## Type (load, don't fallback)
```
--font-sans:"Satoshi","General Sans",system-ui,sans-serif;
--font-serif:"Fraunces","Playfair Display",Georgia,serif;
--fs-hero:clamp(40px,7vw,88px); --fs-h1:56px/600/-0.02em;
--fs-h2:32px/600; --fs-h3:20px/600; --fs-body:16px/1.55; --fs-small:13px;
```
Rationale: Fraunces (warm editorial, Wispr-like) for display; Satoshi
for UI. Replaces Times New Roman + system stack.

## Spacing (8px base)
```
--sp-1:8; --sp-2:16; --sp-3:24; --sp-4:32; --sp-5:48; --sp-6:64; --container:1200px;
```

## Radius
```
--r-sm:8; --r-md:12; --r-lg:16; --r-pill:999;
```

## Elevation
```
--shadow-1:0 1px 2px rgba(0,0,0,.4);
--shadow-2:0 8px 24px rgba(0,0,0,.45);
--shadow-gold:0 8px 24px rgba(233,196,106,.18);
```

## Motion
```
--ease:cubic-bezier(.4,0,.2,1); --t-fast:140ms; --t-med:220ms; --t-slow:360ms;
@media (prefers-reduced-motion:reduce){ *{transition:none!important} }
```

## Component rules
- Button: --r-pill, --shadow-gold on hover, `translateY(-1px) scale(1.01)`,
  active `scale(.98)`.
- Card: --surface-1, --r-lg, --shadow-1, hover --shadow-2 + border brighten.
- Icon: Lucide, 20-24px, currentColor, stroke 1.75.
- Input: --r-md, padding --sp-2, error border --danger + message.
- NavBar: sticky, backdrop-blur, border-bottom on scroll.

## Implementation Roadmap

> Sequenced, with checkpoints. Each step is independently shippable.

## Week 1 — Foundations + Quick Wins
- [ ] Day 1: token `:root` (DESIGN_SYSTEM_PLAN) + next/font (Fraunces+Satoshi) + Lucide dep.
- [ ] Day 2: replace emoji icons -> Lucide across home + nav.
- [ ] Day 3: sticky header + card/button elevation + hover micro-interactions.
- [ ] Day 4: semantic danger/success tokens + form error UI + reduced-motion.
- [ ] Day 5: **CAPTURE GATED APP UI** (login + screenshot dashboard/mastery builder/generate).
- Checkpoint: SCORECARD iconography 1->5, type 2->4, nav 1->4.

## Week 2 — Authenticated app + motion
- [ ] Day 6-7: /dashboard + /masteries + /masteries/new restyle w/ tokens.
- [ ] Day 8-9: /masteries/[id] builder (core surface) — icon, progress-motion,
  resource cards, quiz/project editor, fork modal.
- [ ] Day 10: /generate proposal preview + loading skeleton.
- [ ] Day 11-12: motion pass (page fade-in, carousel for discover/lessons,
  reduced-motion guard) + voice/copy refresh (2 signature lines).
- [ ] Day 13: regression screenshot pass (3 viewports) vs this audit's shots.
- Checkpoint: full SCORECARD parity with Wispr Flow tier.

## Definition of Done
- All routes render with loaded fonts + Lucide icons + tokens.
- Tablet/mobile capture completed (re-run rig with session that persists).
- No emoji icons remain; no Times New Roman; sticky nav present.
- Reduced-motion respected.

## Risks
- Gated capture needs a real login (you provide credentials or a test account).
- Sandbox cannot keep long servers alive — run the rig from your machine
  (or a CI with a browser) for the full tablet/mobile pass.


---
## APPENDIX: AURUM REPORT (full)

# Aurum — Full UI Audit Report

> Consolidated from per-section files in `aurum/`. Generated 2026-07-26.


## Site Map

> Source: deployed aurumio.vercel.app (Playwright capture) + repo
> /root/aurum/frontend/app route tree. Gated = auth required.

## Routes (all confirmed)
| Route | Type | Auth | Notes |
|--------|------|------|-------|
| `/` | page | public | Landing/hero, 4 feature cards, badge, 2 CTAs |
| `/login` | page | public | "Welcome back", username+password, forgot link |
| `/signup` | page | public | display_name+username+email+password |
| `/forgot` | page | public | identifier -> Brevo email or MVP link |
| `/reset?uid=&token=` | page | public | new password set (Suspense) |
| `/discover` | page | public | public Masteries search + grid; works logged-out |
| `/dashboard` | page | **gated** | continue-learning, my-masteries, recent activity |
| `/masteries` | page | **gated** | list + "New Mastery" entry |
| `/masteries/new` | page | **gated** | title/goal/desc/public toggle |
| `/masteries/[id]` | page | **gated** | builder: modules->lessons->resources, progress, notes, fork |
| `/generate` | page | **gated** | topic -> YouTube-grounded proposal -> save |
| `/404` | page | public | Next.js default not-found |

## Navigation paths
- Public nav: logo (->/), Discover (->/discover), Log in (->/login), Get started (gold btn ->/signup)
- Post-login nav (UNCONFIRMED — gated capture only reached login-redirect):
  expected: Dashboard, Masteries, Discover, Log out
- Footer: "Get started — it's free" (CTА)

## Modals / overlays (in app, UNCONFIRMED capture)
- /masteries/[id] builder: YouTube search picker (modal/drawer), resource attach,
  quiz/project-prompt editor, fork confirm.
- /generate: proposal preview + "Save to my Masteries" confirm.

## Onboarding (UNCONFIRMED)
- Signup -> auto-login -> redirected to /dashboard. No multi-step wizard captured.

## CTA destinations
- "Build your first Mastery" -> /masteries/new
- "Explore public Masteries" -> /discover
- "Get started" -> /signup
- "Forgot your password?" -> /forgot

## Hidden / conditional
- /reset requires valid uid+token (Brevo-sent). Bad token -> 400.
- Auth-guarded pages without session -> 307/redirect to /login.

## Hash / query states
- /reset?uid=..&token=.. (query-param state, real)
- /masteries/[id]? (single dynamic param)

## Brand Voice

> Source: verbatim content extract (content/aurum.md) + captured DOM.

## Mission (derived from hero)
"Turn scattered YouTube tutorials into real mastery." — the product
positiones itself as the antidote to tutorial-hoarding / never-finishing.

## Positioning
- Category: "Knowledge Operating System" / "Your Knowledge Operating System" (badge).
- Vs alternatives: implicit contrast with "bookmark great videos and never finish them"
  (names the user's failing behavior, then offers the fix).

## Messaging / taglines
- H1: "Turn scattered YouTube tutorials into real mastery."
- Sub: "You bookmark great videos and never finish them. Aurum turns a pile
  of good content into a structured path — modules, lessons, progress, and
  notes — so you actually cross the finish line."
- Badge: "Your Knowledge Operating System"
- Feature H3s: "Structure the chaos", "Track what sticks",
  "Notes in context", "Discover & remix"
- CTAs: "Build your first Mastery →", "Explore public Masteries",
  "Get started — it's free"

## Tone
- **Direct, competent, slightly aspirational.** Second person ("you", "your").
- Not playful (vs heyclicky's ASCII/anti-AI-grifter voice). Not premium-editorial
  (vs Wispr Flow's "cheat code for your inbox"). Sits BETWEEN — a competent
  SaaS voice that is clear but not yet *memorable*.
- Reading level: simple, short sentences. No jargon beyond "modules/lessons/progress".

## Emotional triggers used
- **Guilt/relief**: "never finish them" -> "actually cross the finish line".
- **Structure as safety**: "a pile of good content into a structured path".

## Trust signals
- "it's free" (lowers friction).
- Public "Discover & remix" (social proof via others' Masteries + fork).

## Conversion techniques
- Dual CTA (action + low-commitment "Explore").
- Hero badage pre-frames category before the headline lands.

## Consistency
- "Mastery"/"Masteries" spelling: product uses "Mastery" (brand noun) consistently.
- Voice is consistent across hero/cards/CTA. No flat utility copy observed
  (but gated empty/error states UNCONFIRMED — see manifest).

## Typography

> Source: Playwright computed token dump (_aurum_tokens_raw.json) + globals.css.

## Fonts
- **UI / body**: `ui-sans-serif, system-ui, -apple-system, "Segoe UI",
  Roboto, sans-serif` — i.e. SYSTEM FONT STACK, no loaded webfont.
- **Logo**: `Times New Roman` (serif) — confirmed in allFonts dump. This is a
  **serif DEFAULT**, not a loaded display face.
- **Headlines**: inherit the system sans, bold weight.

## Weights
- Buttons: weight 800 (heavy) per token dump anchor sample.
- H1/H2: bold (700) — UNCONFIRMED exact value in this pass.

## Sizes (confirmed)
- Body: 16px / line-height 24.8px
- H1 (home hero): UNCONFIRMED exact px (visually large, ~clamp needed)
- AllFonts also listed "Times New Roman" — the ONLY serif present.

## Letter-spacing
- Body: normal. Headline tracking UNCONFIRMED.

## Paragraph / heading hierarchy
- H1 hero -> H2 section -> H3 card title -> body -> caption.
- Clear hierarchy via size+weight (no tracked-out editorial serif like Wispr).

## Responsive scaling
- UNCONFIRMED (tablet/mobile shots captured but not typographically measured).

## Fallback fonts
- System stack -> every OS renders a DIFFERENT sans (SF on mac, Segoe on
  Win, Roboto on Android). **Inconsistency risk** — references load webfonts
  (Inter / Figtree) so they look identical everywhere.

## Button / label typography
- Buttons: 800 weight, system sans. No tracking.

## Code typography
- N/A (no code surfaces in marketing/auth).

## Key finding
Aurum has NO loaded webfont and leans its logo on Times New Roman.
References load Inter (heyclicky) / Figtree+EB Garamond (Wispr).
**Fix**: load a deliberate display serif + geometric sans (see DESIGN_GUIDE).

## Colors

> Source: Playwright computed token dump + globals.css + vision review.

## Backgrounds
- Page bg: `rgb(11,13,18)` = **#0B0D12** (near-black navy). Dark mode ONLY.
- Surface-1 (cards): `rgb(16,19,26)` = #10131A
- Surface-2: `rgb(22,26,34)` = #161E22
- Surface-3: `rgb(35,40,51)` = #232833
- Stepped dark surfaces = subtle depth, NO shadows used.

## Text
- Primary: `rgb(232,235,240)` = #E8EBF0 (near-white)
- Muted: `rgb(154,163,178)` = #9AA3B2

## Brand / accent
- **GOLD**: `rgb(233,196,106)` = #E9C46A (logo, primary CTA, feature H3s)
  - tints: rgba(233,196,106,0.10), rgba(233,196,106,0.25)
- **MINT/teal**: used in gradient text "real mastery" (yellow->mint) + mint CTA.
  Value UNCONFIRMED exact (gradient stop in globals.css).

## Borders
- `rgb(47,54,68)` = #2F3644 (card/input borders)
- Hairline rgba(11,13,18,0.85) on some overlays.

## Hover / pressed / focus
- Hover: brightness(1.07) on gold button (NO bg change, NO scale, NO shadow).
- Focus (input): mint outline (confirmed on /login shot).
- Pressed / disabled: UNCONFIRMED in CSS.

## Error / warning / success / info
- **NOT detected** in token dump — possible gap. Values UNCONFIRMED
  (gated form-error states not captured). MUST add explicit --danger/--success.

## Gradients
- Hero text gradient: yellow (#E9C46A-ish) -> mint. Exact stops UNCONFIRMED.

## Opacity / overlay / shadow colors
- Shadows: **none** on cards/buttons (flat). Overlay rgba(11,13,18,0.85).
- Glass: none observed (no backdrop-blur on header — it scrolls away).

## HEX/RGB/HSL summary
| Token | HEX | RGB |
|-------|-----|-----|
| bg | #0B0D12 | 11,13,18 |
| surface-1 | #10131A | 16,19,26 |
| surface-2 | #161E22 | 22,26,34 |
| surface-3 | #232833 | 35,40,51 |
| text | #E8EBF0 | 232,235,240 |
| muted | #9AA3B2 | 154,163,178 |
| gold | #E9C46A | 233,196,106 |
| border | #2F3644 | 47,54,68 |

## Spacing

> Source: captured screenshots (visual) + globals.css. Exact scale UNCONFIRMED
> (no token dump of padding/margin values in this pass — flag for rebuild verification).

## Grid / container
- Centered max-width container (value UNCONFIRMED; visually ~1100-1200px).
- Hero: single centered column, strong vertical rhythm.
- Feature section: **4-column grid** (desktop), even gaps.

## Margins / padding
- Generous section padding (hero has significant top/bottom space).
- Card internal padding UNCONFIRMED exact.

## Section spacing
- Large gaps between hero -> features -> footer (premium uncluttered feel).

## Card spacing
- Even grid gaps; card padding appears ~16-24px (UNCONFIRMED).

## Button spacing
- Padding UNCONFIRMED (token dump sample was a nav <a>, showed 0px — NOT
  the .btn class; verify in rebuild).

## Whitespace rhythm
- Generous — matches "premium SaaS" reference tier.

## Responsive behavior
- tablet/mobile shots captured but spacing NOT measured (UNCONFIRMED).
- Mobile: single-column stack expected (verify against shots).

## Known gap
- **No explicit spacing scale** documented in globals.css token dump.
  Recommend a fixed 8px-based scale in rebuild (see DESIGN_GUIDE :root).

## Motion

> Source: globals.css review + README + captured (static) shots.

## Current motion (confirmed minimal)
- **Button hover**: `filter: brightness(1.07)` only. No transform, no shadow shift.
- **Hero text gradient**: static gradient (no animated sweep confirmed).
- **Progress bar**: fills on mark-complete (optimistic UI) — transition
  duration UNCONFIRMED.

## What is ABSENT vs references
- No page/section fade-in or scroll-reveal.
- No card hover lift / shadow.
- No button press scale.
- No carousel/slide (references: Wispr Flow carousels).
- No loading skeleton/spinner captured (gated + fast public pages).
- No micro-interaction on nav/links.

## Duration / easing
- UNCONFIRMED (no transition tokens dumped). Recommend:
  --t-fast 140ms, --t-med 220ms, --ease cubic-bezier(0.4,0,0.2,1).

## Transform / opacity / scale / blur
- None observed.

## Scroll animations
- None. (Wispr Flow: motion-blur photo band; Aurum: static.)

## Page transitions
- Next.js default (instant client nav). No shared-element/animated route transition.

## Loading animations
- UNCONFIRMED (no slow/loading state captured).

## Cursor interactions
- None.

## Accessibility

> Source: captured DOM + computed styles. Partial (gated app UNCONFIRMED).

## Contrast
- Text #E8EBF0 on bg #0B0D12: **high contrast** (passes AA/AAA).
- Muted #9AA3B2 on #0B0D12: ratio ~7:1 (passes AA).
- Gold #E9C46A on dark: decorative (logo) — body text is near-white, OK.
- **Risk**: mint CTA "Get started" white text on mint — contrast UNCONFIRMED
  (verify mint is dark enough or use dark text).

## Keyboard navigation
- Inputs focusable (mint focus outline confirmed on /login).
- Button focus ring: UNCONFIRMED (CSS not dumped for :focus-visible).
- Gated app focus order UNCONFIRMED.

## ARIA
- Next.js app; semantic HTML expected but UNCONFIRMED in this pass.
- Mobile hamburger: attempted (selector heuristic) — UNCONFIRMED presence.

## Screen reader support
- UNCONFIRMED (no SR test run; gated app not reached).

## Focus order
- UNCONFIRMED beyond login form.

## Semantic HTML
- Form labels present ("Username", "Password") — good.
- Heading hierarchy H1->H2->H3 present on home.

## Motion reduction
- `prefers-reduced-motion`: UNCONFIRMED (no media-query found in globals.css review).
  **Recommend**: add it (disable brightness/transition for reduced-motion users).

## Touch targets
- Mobile shots captured; button size UNCONFIRMED (verify >=44px).

## Responsive accessibility
- UNCONFIRMED (tablet/mobile not measured).

## Color dependency
- Status conveyed by text+color (login sub "Log in to continue").
- Error states: UNCONFIRMED (no error captured) — ensure errors are NOT
  color-only (add icon + text, like references' inline messages).

## Components

> Source: globals.css in repo + captured screenshots + DOM. Classes named
> as they appear in the deployed CSS.

## 1. Navigation (NavBar.jsx)
- Purpose: top nav, public + (expected) authed.
- Variants: logo (serif gold) | text links (Discover, Log in) | gold CTA button.
- States captured: default, (sticky-on-scroll UNCONFIRMED — header scrolls away).
- Spacing: centered max-width container, link gap ~24px.
- Radius: n/a (text links). Button radius from .btn-gold.
- Shadow: none.
- Issue: NOT sticky (Wispr Flow is). Visual hierarchy: logo left, CTA right.

## 2. Hero (home)
- Purpose: value prop.
- Variants: badge pill + H1 (gradient text "real mastery") + sub + 2 CTAs.
- Gradient: linear yellow->mint on "real mastery" span.
- States: static (no scroll-reveal captured).

## 3. Buttons (.btn-gold / .btn-ghost / .btn-mint)
- Purpose: primary/secondary actions.
- Variants:
  - .btn-gold: solid gold (#E9C46A), dark text, weight 800.
  - .btn-ghost: transparent, white 1px border.
  - .btn-mint: mint green, white text.
- States: hover = brightness(1.07) only (NO bg change, NO scale, NO shadow).
  pressed/disabled/focus-ring UNCONFIRMED in CSS.
- Spacing: padding UNCONFIRMED (token dump showed 0px on an <a> sample — likely a nav link, not .btn).
- Radius: from globals.css (value UNCONFIRMED in this pass — verify in rebuild).
- Shadow: none.

## 4. Cards (feature cards, mastery cards, dashboard)
- Purpose: group content.
- Variants: feature card (icon + H3 gold + grey desc), mastery card, continue-learning card.
- States: static; hover lift/shadow UNCONFIRMED.
- Spacing: grid, even gaps, generous section padding.
- Radius: from globals.css.
- Shadow: none (flat dark blocks, surface #10131A/#161E22).

## 5. Inputs (.input / form fields)
- Purpose: text entry.
- Variants: text, email, password.
- States captured: default, **focus = mint outline** (confirmed on /login shot),
  validation-error (UNCONFIRMED capture — submit selector timed out).
- Spacing: label (grey, small) above input.

## 6. Badges / Pills
- Purpose: resource-type tags (youtube/doc/pdf/blog/github...), "Your Knowledge OS" badge.
- States: static. Radius: pill.

## 7. Progress bar (mastery builder)
- Purpose: lesson completion %.
- States: fills on mark-complete (optimistic UI). Transition UNCONFIRMED.

## 8. Notes (per-lesson)
- Purpose: timestamped insights. UNCONFIRMED capture (gated).

## 9. Icons
- **Emoji / unicode** (Target, Checkmark, Pencil, Bullseye) — confirmed in
  feature cards + design-token dump. NOT a unified icon library.
- This is the #1 fidelity gap vs references (see comparison/DESIGN_GAPS).

## 10. Footer
- Minimal: single centered "Get started — it's free" CTA. No multi-column links.

## 11. Toasts / notifications
- UNCONFIRMED (gated actions not captured).

## 12. 404
- Next.js default: large "404" + "This page could not be found."

## 13. Loading / skeleton
- UNCONFIRMED (no loading state captured; gated + fast public pages).

## Verbatim Content Captures


### dashboard

- Intended: continue-learning card (with progress bar), my-masteries grid, recent activity feed.
- Observed without session: 307 redirect to /login "Welcome back".
- GATED CONTENT UNCONFIRMED (needs logged-in browser).

### discover

- Public Masteries browser.
- Search input + grid of public Masteries.
- Empty state if no public Masteries exist (UNCONFIRMED capture — public data may be empty).

### forgot

- H2: "Forgot your password?"
- Field: identifier (email or username)
- Submit: "Send reset link"
- (MVP mode returns the reset link in response if BREVO_API_KEY unset)

### generate

- Topic input -> YouTube-grounded proposal (module + lessons w/ video resources).
- "Save to my Masteries" creates the real Mastery.
- Observed without session: redirect to /login.

### home

> Captured from live DOM 2026-07-26.

- title: "Aurum — Mastery, Refined."
- Badge: "Your Knowledge Operating System"
- H1: "Turn scattered YouTube tutorials into real mastery."
- Sub: "You bookmark great videos and never finish them. Aurum turns a pile of good content into a structured path — modules, lessons, progress, and notes — so you actually cross the finish line."
- CTA primary: "Build your first Mastery →"
- CTA ghost: "Explore public Masteries"
- Feature 1 — H3 "Structure the chaos" / "Group videos into modules and lessons. One clear path from 'I want to learn X' to 'I can do X.'"
- Feature 2 — H3 "Track what sticks" / "Mark lessons complete, watch your progress bar fill, and always know the next thing to do."
- Feature 3 — H3 "Notes in context" / "Capture insights per lesson — timestamped to the moment they mattered."
- Feature 4 — H3 "Discover & remix" / "Browse public Masteries built by others and fork them into your own learning plan."
- Footer CTA: "Get started — it's free"

### login

- H2: "Welcome back"
- Sub: "Log in to continue your Masteries."
- Label "Username"
- Label "Password"
- Submit: "Log in"
- Link: "Forgot your password?"
- "No account? Create one →"

### masteries-new

- Form: title, goal, description, public/private toggle.
- Submit creates a Mastery.
- Observed without session: redirect to /login.

### masteries

- Intended: grid of user's Masteries + "New Mastery" entry point.
- Observed without session: redirect to /login.
- GATED CONTENT UNCONFIRMED.

### notfound

- "404"
- "This page could not be found." (Next.js default)

### reset

- H2: "Reset your password"
- Fields: new password, confirm password
- Submit: "Reset password"
- Uses Suspense-wrapped useSearchParams

### signup

- H2: "Create your account"
- Fields: Display name, Username, Email, Password
- Submit: "Create account"
- "Already have an account? Log in"

## Screenshots Captured

### desktop (36)

- dashboard_full_desktop.png
- dashboard_initial_desktop.png
- dashboard_scroll-1000_desktop.png
- discover_full_desktop.png
- discover_initial_desktop.png
- discover_scroll-1000_desktop.png
- forgot_full_desktop.png
- forgot_initial_desktop.png
- forgot_scroll-1000_desktop.png
- generate_full_desktop.png
- generate_initial_desktop.png
- generate_scroll-1000_desktop.png
- home_full_desktop.png
- home_initial_desktop.png
- home_scroll-1000_desktop.png
- login_full_desktop.png
- login_initial_desktop.png
- login_scroll-1000_desktop.png
- masteries-new_full_desktop.png
- masteries-new_initial_desktop.png
- masteries-new_scroll-1000_desktop.png
- masteries_full_desktop.png
- masteries_initial_desktop.png
- masteries_scroll-1000_desktop.png
- notfound_full_desktop.png
- notfound_initial_desktop.png
- notfound_scroll-1000_desktop.png
- reset_full_desktop.png
- reset_initial_desktop.png
- reset_scroll-1000_desktop.png
- signup_filled-valid_desktop.png
- signup_focus-input_desktop.png
- signup_full_desktop.png
- signup_hover-button_desktop.png
- signup_initial_desktop.png
- signup_scroll-1000_desktop.png

### tablet (4)

- home_full_tablet.png
- home_initial_tablet.png
- login_full_tablet.png
- login_initial_tablet.png



---
## APPENDIX: WISPRFLOW REPORT (reference)

# Wispr Flow — Reference UI Report (North Star)

> Consolidated from per-section files in `wisprflow/`. Generated 2026-07-26.


## Site Map

> Source: live DOM 2026-07-26 (managed browser). **Production-complete.**

## Routes (all REACHED / confirmed in footer)
| Route | Status | Notes |
|--------|--------|-------|
| `/` home | REACHED | full editorial landing |
| `/about` | REACHED | founder video, careers, press |
| `/use-cases` | REACHED | 16+ app carousels, tabs |
| `/careers` | footer link | UNCONFIRMED reach |
| `/trust-center` | footer | UNCONFIRMED |
| `/media-kit` | footer | UNCONFIRMED |
| `/whats-new` | footer | UNCONFIRMED |
| `/flow-for-students` `/flow-for-non-profits` `/flow-for-android` | footer | UNCONFIRMED |
| `/workflows` `/research` `/vibe-coding` | footer | UNCONFIRMED |
| `/talk-to-support` `/talk-to-sales` `/help-center` `/bug-bounty` | footer | UNCONFIRMED |
| `/terms` `/privacy` `/data-controls` | footer | UNCONFIRMED |

## Navigation
- Sticky header: logo + Product(dropdown) / Individuals(dropdown) / Business / Resources(dropdown) / Company(dropdown) + "Download for free" CTA.

## Modals / overlays
- YouTube iframe (about page "The Mission Behind Wispr Flow").
- "Watch on YouTube" / Share / Hide player controls.

## Onboarding
- None on marketing site (app download). "Try Flow" CTA.

## CTA destinations
- "Download for free" / "Download for Windows" / "Try Flow".

## Footer
- Columns: Company / Product / Resources + giant "Flow" wordmark + social.

## Carousels (core pattern)
- Essential apps (16), Documentation (5), Engineering (13), Project mgmt (6), Writing (9).
- Each: horizontal scroll, prev/next arrows, "1 / N" counter.

## Tabs
- use-cases: Business Owners / Developers / Founders / Product Managers.

## Hidden / conditional
- "Ask ChatGPT / Claude / Perplexity" (still-not-sure section).

## Findings
- **This is the model.** Complete, editorial, premium, motion-rich.
  Aurum should benchmark against Wispr Flow, not heyclicky.

## Brand Voice

> Verbatim from DOM.

## Mission
"The Voice Interface Company." — positions as category definer.

## Positioning
- "The voice-to-text AI that turns speech into clear, polished writing in every app."
- Contrasts with "broken" native dictation ("I thought voice typing on Mac was broken").

## Tone
- **Premium, editorial, confident, fast.** Second person ("you").
- Not meme-y (vs heyclicky); not generic (vs Aurum's current).

## Taglines / signature lines
- "Don't type, just speak"
- "Voice that finally works is here."
- "4x faster than typing" / "at the speed of thought"
- **"It's like having a cheat code for clearing out your inbox."** (testimonial)
- **"Voice is the future of human-computer interaction."** (Reid Hoffman)

## CTAs
- "Download for free" / "Download for Windows" / "Try Flow"

## Emotional triggers
- Speed ("4x faster", "speed of thought"), magic ("feels like magic").

## Trust signals
- Backed by (press): WSJ, Notable Capital, AI 50 Brink List.
- Testimonials: Reid Hoffman (LinkedIn), Steven Bartlett, Teams at Clay.

## Conversion techniques
- Free download CTA repeated; "Try Flow" secondary.
- Use-case carousels reduce "will it work for ME?" friction.

## Consistency
- Voice consistent across home/about/use-cases. Distinctive, memorable.

## Typography

> Computed from live homepage (the signature of this site).

## Fonts
- **UI / body**: Figtree, Arial, sans-serif
- **Headlines (H1)**: **"EB Garamond", Arial, serif** — editorial serif
- Mixed serif-headline + sans-body = magazine/premium feel.

## Weights
- H1: 400 (serif, large). Body: 400.

## Sizes (confirmed)
- **H1: 120px** / weight 400 / letter-spacing **-6px** (very tight, huge)
- Body: 16px / line-height 20.8px

## Letter-spacing
- H1: -6px (dramatic editorial tightening).

## Heading hierarchy
- H1 120px serif -> H2 serif/sans -> H3 -> body -> caption.

## Responsive scaling
- UNCONFIRMED (desktop-only capture).

## Fallback
- Figtree (web) + EB Garamond (web) loaded; Arial fallback.

## Button / label typography
- Figtree sans, weight 400-500.

## Code typography
- N/A on marketing pages.

## Colors

> Computed from live homepage.

## Backgrounds
- **Page: rgb(255,255,235) = #FFFFEB** (warm cream / paper)
- Dark cards: rgb(26,26,26) #1A1A1A

## Text
- Primary: rgb(26,26,26) #1A1A1A (near-black)
- Secondary: rgb(51,51,51) #333, rgb(118,118,118) #767

## Accent
- **Purple (lavender)**: rgb(240,215,255) #F0D7FF (brand, testimonial bg)
- **Orange**: rgb(255,169,70) #FFA946 (accents)
- Cream tint: rgba(255,255,235,0.1)

## Borders
- rgba(26,26,26,0.1) – rgba(26,26,26,0.5)

## Gradients
- None dumped (warm flat palette).

## Shadows
- Subtle on app icons (float shadow). Cards: minimal.

## Glass / opacity
- rgba overlays for tinted sections.

## HEX/RGB
| Token | HEX | RGB |
|-------|-----|-----|
| bg | #FFFFEB | 255,255,235 |
| text | #1A1A1A | 26,26,26 |
| purple | #F0D7FF | 240,215,255 |
| orange | #FFA946 | 255,169,70 |
| dark-card | #1A1A1A | 26,26,26 |

## Spacing

> Visual + computed.

## Grid / container
- Sticky nav full-width; hero centered; max-width content (~1100-1200px implied).

## Margins / padding
- Generous section padding; hero has large vertical rhythm.

## Section spacing
- Hero -> features/carousel -> testimonial -> app-grid -> photo CTA -> footer.
- Large gaps (editorial calm).

## Card spacing
- Carousel cards: white, rounded, even gaps, arrow controls.

## Button spacing
- Pill buttons, comfortable padding.

## Whitespace rhythm
- **Generous, calm, premium** (contrast with dense SaaS).

## Responsive
- UNCONFIRMED (desktop-only).

## Key finding
- Spacing is a core part of the "premium" feel — Aurum's
  current spacing is decent but lacks the editorial generosity.

## Motion

> Source: homepage (the motion model among the three).

## Current motion
- **Carousel slide transitions** (app categories).
- **Photo band motion-blur** (golden-hour runner = "speed/flow").
- Arrow-icon hover states on app cards.

## Duration / easing
- UNCONFIRMED exact values (not dumped). Recommend ~200-300ms ease.

## Transform / opacity / scale
- Carousel translateX; photo blur (speed metaphor).

## Scroll animations
- UNCONFIRMED (no scroll-reveal captured in this pass).

## Page transitions
- UNCONFIRMED.

## Hover animations
- App-card arrow hover; button hovers (subtle).

## Loading animations
- UNCONFIRMED (marketing pages are static-fast).

## Key finding
- Wispr Flow uses motion to convey its VALUE PROP ("speed/flow").
  Aurum's only motion is a gold hover-brightness — a missed opportunity.
  Aurum should add: card hover-lift, button press-scale, carousel/slide,
  and a hero motion element echoing "learning flow".

## Accessibility

> Partial (desktop home/about/use-cases).

## Contrast
- Near-black #1A1A1A on cream #FFFFEB: high (passes AAA).
- Purple #F0D7FF is decorative (not body text). Good.

## Keyboard navigation
- Dropdown buttons, carousel arrows, links focusable. UNCONFIRMED tab order.

## ARIA
- tablist/tab/tabpanel present (use-cases segmented control). Good pattern.

## Screen reader
- UNCONFIRMED.

## Focus order
- UNCONFIRMED beyond visible controls.

## Semantic HTML
- h1/h2/h3, lists, nav present. Solid.

## Motion reduction
- prefers-reduced-motion: UNCONFIRMED.

## Touch targets
- UNCONFIRMED (desktop-only).

## Responsive accessibility
- UNCONFIRMED.

## Color dependency
- Carousel state conveyed by arrow + counter (not color-only). Good.

## Known gaps
- Full a11y pass needs the gated app + mobile/tablet (UNCONFIRMED).

## Components

> Source: home + about + use-cases DOM + computed styles.

## 1. Navigation (sticky)
- Sticky top bar, logo left, dropdowns (Product/Resources/Company), CTA right.
- Purpose: persistent wayfinding. Variant: expanded dropdown panels.

## 2. Hero
- H1 serif "Don't type, just speak", sub sans, 2 CTAs, floating app-icon ribbon.

## 3. Buttons
- **Pill-shaped** (fully rounded), purple fill ("Download for free"),
  white outline ("Try Flow"). Weight 400-500. Subtle shadow.

## 4. Cards
- **Dark rounded rectangles** (rgb 26,26,26) with WHITE text.
  Value-prop cards (4 across). Subtle depth.

## 5. Inputs
- UNCONFIRMED (no form on marketing pages).

## 6. Badges / pills
- Segment toggle pills (Business Owners / Developers / Founders / PMs). Selected = bg fill.

## 7. Testimonials
- Light-purple rounded container, quote + circular avatar (Reid Hoffman, etc.).

## 8. Carousel
- Horizontal scroll, prev/next arrows, "1 / 16" counter. Core pattern.
- App cards: white, rounded, icon + title + desc + arrow.

## 9. Icons
- **Flat app icons** (Gmail, Slack, Notion, Cursor...) with subtle float shadow.
- Brand mark: purple wordmark.

## 10. Photo band (CTA)
- Full-width golden-hour runner photo, motion blur, serif overlay + 2 CTAs.

## 11. Footer
- Multi-column (Company/Product/Resources) + giant "Flow" wordmark + social.

## 12. Motion
- Carousel slide transitions; photo motion-blur; arrow hovers.

## Key finding
- **Real, cohesive component system.** This is what Aurum's
  rebuild should aspire to (minus the emoji-icon gap Aurum has).

## Verbatim Content Captures


### about

- H1: "The Voice Interface Company."
- H2: "From our founder" / iframe "The Mission Behind Wispr Flow"
- H2: "Build magical experiences with us" / "Discover careers at Wispr"
- H2: "Backed by thebest"
- H2: "In the news":
  - "The best AI dictation apps, tested and ranked" (May 2, 2026)
  - "Notable Capital Launches Inaugural Prosumer AI 40 list" (Apr 20)
  - "The AI 50 Brink List" (Apr 16)
  - "Vibe Coding For Coaches: Build Your First App In A Day" (Apr 2)
  - "Wispr Flow - Top Enterprise Tech 30 VC Survey" (Mar 31)
  - "Wispr Flow is the dictation upgrade Android users deserve" (Feb 28)
  - "The New Office Oddity: Co-Workers Dictating Everything Into AI" (Feb 6)
  - "I thought voice typing on Mac was broken — until I tried Wispr Flow" (Jan 31)
  - "Wispr Flow is 'scary good' - WSJ" (Jan 23)

### home

- title: "Wispr Flow | Effortless Voice Dictation"
- H1: "Don't type, just speak"
- Sub: "The voice-to-text AI that turns speech into clear, polished writing in every app."
- CTAs: "Download for Windows" / "Try Flow" / "Available on Mac, Windows, iPhone, and Android"
- Hero demo (before/after, verbatim):
  - Raw: "Umm, hope your week has started well...I was talking to Cheyene earlier but reception was really bad and I think their going to handle the first part of the project, but I'm not totally sure..."
  - Corrected: "Hope your week is off to a good start. I was talking to Cheyene earlier, but the reception was really bad. I think they're going to handle the first part of the project, but I'm not totally sure..."
- H2: "Write faster in all your apps, on any device" / "Used by professionals everywhere to speed up their thoughts" / "4x faster than typing" / "Voice that finally works is here. Flow lets you create, code, message, and write at the speed of thought, 4x faster than your keyboard." / "Made for the way you work" / "Select one to see Flow in action." / "One tool. Your workflow." / "AI Auto Edits" / "Personal dictionary" / "Snippet library" / "100+ languages" / "Flow, wherever you work" / "Love letters to Flow" / "STILL NOT SURE THAT WISPR FLOW IS RIGHT FOR YOU?"
- Testimonials: Reid Hoffman ("Voice is the future of human-computer interaction." Cofounder LinkedIn/Greylock); Steven Bartlett ("90% faster everywhere" "Flow fits into every corner of how I work." Host Diary of a CEO); Teams at Clay ("20% faster GTM execution" "Flow gave our team a shared speed advantage." 200+ employees B2B); Gaurav Vohra ("4x faster responses" "Flow lets me reply in seconds, not minutes.")
- Footer columns: Company (About, Careers, Trust Center, Become an Affiliate, Media Kit); Product (What's New, Use Cases, Flow for Students, Flow for Non-Profits, Flow for Android); Resources (Workflows, Research, Vibe Coding, Talk to Support, Talk to Sales, HelpCenter, Bug Bounty, Terms, Privacy, Data Controls)

### use-cases

- H1: "Flow in every application" / "Work at the speed you think in every app you use. Email, messages, docs or code—Flow works in any text box."
- Tabs: "Business Owners" (selected) / "Developers" / "Founders" / "Product Managers"
- Carousels (verbatim app names):
  - Essential apps (16): Arc, Cursor, Chrome, LinkedIn, Perplexity, Notion, X, WhatsApp, Apple Mail, VS Code, iMessage, Gmail, Slack, Claude, Superhuman, ChatGPT
  - Documentation (5): Apple Notes, Evernote, Google Docs, Obsidian, Notion
  - Engineering (13): Cursor, Discord, GitHub, Jira, Linear, Stack Overflow, Warp, VS Code, Canva, Replit, Lovable, v0, Bolt
  - Project management (6): ClickUp, Jira, Linear, Monday, Notion, Trello
  - Writing (9): Evernote, Google Docs, LinkedIn, Medium, Obsidian, Notion, Substack, Claude, ChatGPT
- Testimonial (Business Owners tab): "It's like having a cheat code for clearing out your inbox. The accuracy and responsiveness feel like magic."

## Screenshots Captured

### desktop (5)

- about_press_desktop.png
- home_hero_desktop.png
- home_initial_desktop.png
- home_testimonials-footer_desktop.png
- use-cases_carousel_desktop.png



---
## APPENDIX: HEYCLICKY REPORT (reference, WIP)

# heyclicky — Reference UI Report (WIP)

> Consolidated from per-section files in `heyclicky/`. Generated 2026-07-26.


## Site Map

> Source: live DOM 2026-07-26 (managed browser). **Only homepage
> reachable**; sub-routes are in-page anchors or 404.

## Routes
| Route | Status | Notes |
|--------|--------|-------|
| `/` (home) | REACHED | full single-page: hero, features, THE DREAM, FEEDBACK, PRICING, FAQ, footer |
| `/pricing` | **404** | in-page anchor, not a route |
| `/features` | **404** | in-page anchor |
| `/about` | **404** | not found |
| `/support` `/privacy` | footer links | UNCONFIRMED reach |
| `/windows-waitlist` | implied | linked from hero |

## Navigation
- Header: logo "heyclicky" + "features" + "pricing" (clickable, in-page) + "get heyclicky" link
- Footer: features / pricing / try it / privacy / support / instagram / x / linkedin / youtube

## Modals / overlays
- Hero video players (.mov) with unmute/play (not true modals)
- FAQ accordion (9 buttons, expanded=false default)

## Onboarding
- None (desktop Mac app download; "windows waitlist" form implied)

## CTA destinations
- "download for mac" (Mac binary)
- "windows waitlist"
- "start free" / "get pro" ($20/mo) / "get max" ($100/mo)
- "reach out to us"

## Footer / legal
- privacy, support links present; full legal pages UNCONFIRMED

## Hidden / conditional
- Live site renders lower sections as **RED WIREFRAME placeholders**
  (work-in-progress). Hero + pricing + FAQ are built.

## Findings
- This is a **WIP**, not a finished design reference. Use ONLY its
  hero/type/pricing/FAQ as signal; do NOT model Aurum on
  the placeholder sections.

## Brand Voice

> Verbatim from DOM.

## Mission (implied)
"an ai buddy that lives on your mac" — positions as a
desktop companion, anti-"AI grifter" stance.

## Positioning
- "finally do the thing" / "spawn agents with your voice"
- Contrasts with terminal/complexity: "no terminal needed".

## Tone
- **Playful, meme-y, founder-driven.** ASCII faces (^ ω ^, { ^-^ },
  (¬_¬), ¯\_(ツ)_/¯), tweet social proof.
- Second person ("you"), casual ("no AI 2.0 bullshit").
- Anti-corporate, in-group humor.

## Taglines
- "an ai buddy that lives on your mac"
- "100% free. sonoma 14.2 or higher"
- "no AI 2.0 bullshit" (sub-text, strong stance)

## CTAs
- "download for mac" / "windows waitlist" / "start free" / "get pro" / "get max"

## Emotional triggers
- Belonging ("they use it everyday" x5), founder transparency (Farza).
- Anti-grifter credibility.

## Trust signals
- Real tweet embeds from known founders (Greg Brockman, Lenny Rachitsky).

## Consistency
- Voice consistent across hero/FAQ/pricing. Meme aesthetic is intentional.

## Typography

> Computed from live homepage.

## Fonts
- **Inter** ("Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, sans-serif)
- Mono (Geist Mono) observed in font stack list.

## Weights
- Body 400. H1 500.

## Sizes (confirmed)
- H1: **88px** / weight 500 / letter-spacing **-2.64px** (tight, large)
- Body: 16px / line-height 24px

## Letter-spacing
- H1: -2.64px (editorial tight). Body: normal.

## Heading hierarchy
- H1 88px -> H2 (pricing "heyclicky, your way", FAQ "frequently asked questions") -> button text.

## Responsive scaling
- UNCONFIRMED (desktop-only capture).

## Fallback
- Inter has web fallback; mono uses Geist Mono stack.

## Button / label typography
- weight 400, padding 0px (flat), radius 0px.

## Code typography
- Geist Mono stack present (dev-tool aesthetic).

## Colors

> Computed from live homepage.

## Backgrounds
- Page: **rgb(245,245,245) = #F5F5F5** (near-white)
- Dark demo blocks: rgb(26,26,26) #1A1A1A

## Text
- Primary: rgb(0,0,0) #000
- Muted: rgb(98,98,98) #626262

## Accent
- **Blue**: rgb(15,127,255) #0F7FFF (links/CTA)
- **Purple/blue blocks**: rgb(34,24,152) #221898, rgb(101,168,239) #65A8EF
- **Orange**: rgb(255,102,0) #FF6600
- **Red (wireframe)**: rgb(237,27,38) #ED1B26
- **Yellow tint**: rgba(254,234,61,0.35)

## Borders
- rgba(0,0,0,0.05) – rgba(0,0,0,0.5)

## Gradients
- Hero has a colorful arch graphic (purple->teal->yellow pixels) — decorative.
- No CSS gradient token dumped.

## Shadows
- None captured.

## Glass / opacity
- rgba overlays minimal.

## HEX/RGB
| Token | HEX | RGB |
|-------|-----|-----|
| bg | #F5F5F5 | 245,245,245 |
| text | #000000 | 0,0,0 |
| accent-blue | #0F7FFF | 15,127,255 |
| wireframe-red | #ED1B26 | 237,27,38 |
| orange | #FF6600 | 255,102,0 |

## Spacing

> Visual + computed. Exact scale UNCONFIRMED (wireframe layout).

## Grid / container
- Hero: centered single column. Lower: grids of placeholder boxes.

## Margins / padding
- Hero has generous vertical space. Button padding 0px (flat).
- Card padding UNCONFIRMED (wireframe).

## Section spacing
- Large gaps between hero -> features -> THE DREAM -> FEEDBACK -> pricing -> FAQ.

## Card spacing
- Wireframe boxes evenly spaced (intended grid).

## Button spacing
- 0px internal padding (text/link style).

## Whitespace rhythm
- Generous (premium feel even in WIP).

## Responsive
- UNCONFIRMED (desktop-only).

## Motion

> Source: homepage. Minimal.

## Current motion
- Hero .mov videos autoplay (muted) — the primary "motion".
- No CSS transitions/transforms captured on buttons/links/cards.

## Duration / easing
- None captured (transition: none implied).

## Transform / opacity / scale
- None.

## Scroll animations
- None observed.

## Page transitions
- None (single page + anchors).

## Hover animations
- None captured.

## Loading animations
- None (no app shell).

## Key finding
- heyclicky's motion is **video-driven, not CSS-driven**.
  Not a CSS-motion reference. Wispr Flow is the motion model.

## Accessibility

> Partial (desktop homepage only).

## Contrast
- Black text on #F5F5F5: high (passes AA).
- Blue #0F7FFF on white: ~3.6:1 (borderline for small text).

## Keyboard navigation
- Nav links focusable (text links). UNCONFIRMED tab order.

## ARIA
- FAQ buttons toggle (accordion) — aria-expanded UNCONFIRMED.

## Screen reader
- UNCONFIRMED.

## Focus order
- UNCONFIRMED.

## Semantic HTML
- h1/h2 present; structure reasonable.

## Motion reduction
- prefers-reduced-motion: UNCONFIRMED.

## Touch targets
- UNCONFIRMED (desktop-only).

## Responsive accessibility
- UNCONFIRMED.

## Color dependency
- FAQ state conveyed by expand + text (not color-only). Good.

## Known gaps
- WIP site; full a11y audit blocked by placeholder sections.

## Components

> Source: homepage DOM + computed styles.

## 1. Navigation
- logo (serif wordmark), 2 text links, 1 CTA link. No dropdown.

## 2. Hero
- H1 serif "heyclicky", sub sans, 2 CTAs (black fill / white-border),
  sub-text, 5 inline .mov video players w/ unmute+play.

## 3. Buttons
- Primary: black bg, white text ("download for mac"), radius 0.
- Secondary: white bg, black border ("windows waitlist").
- No padding captured (flat link/button style), no shadow, no transition.

## 4. Cards
- Feature blocks: RED WIREFRAME outline boxes (placeholder, not real).

## 5. Inputs
- UNCONFIRMED (waitlist form not captured).

## 6. Badges / pills
- None observed (nav is plain text).

## 7. Pricing
- Tablist (monthly / yearly -20%), 3 plan links (start free / get pro / get max).
- "no cap!" image.

## 8. FAQ accordion
- 9 buttons, expanded=false default, click toggles. Text inline.

## 9. Testimonials
- Embedded tweets (Farza + 8 users) with handle/date/engagement.

## 10. Footer
- Columns: product / resources / connect + disclaimer.

## 11. Icons
- Emoji + bare SVG (unmute, play). No unified set.

## 12. Motion
- Hero .mov autoplay (muted). No CSS transitions captured.

## Key finding
- Component library is NOT production-realized (wireframe blocks).
  Not a reliable component reference for Aurum.

## Verbatim Content Captures


### faq

1. what is heyclicky? an ai buddy that lives on your mac. press the hotkey and it sees what you see, so you can ask it anything out loud and it'll walk you through whatever you're working on, or say "heyclicky agent" and it'll go do the task for you.
2. is my data private? yes. we only see your screen when you press the hotkey, and screenshots are never stored. we do keep basic text summaries so heyclicky has context. you can delete your account and all its data in settings.
3. is heyclicky watching my screen all the time? no. we never look at your screen unless you press the hotkey.
4. what can heyclicky actually do? it teaches you any tool, walks you through whatever you're stuck on, draws right on your screen to point the way, and runs agents to do tasks for you.
5. what's the difference between talk and agents? talk is the conversation. ask anything, out loud, as much as you want. agents are heyclicky actually doing tasks for you, and those are counted per month on each plan.
6. which apps does it work with? anything on your screen. if you can see it, heyclicky can see it. no plugins or integrations needed.
7. do i need a mac? for now, yes. heyclicky is mac-only (sonoma 14.2 or higher). windows is coming, join the waitlist.
8. is it free? you can start for free. when you're ready for more, pro is $20/month and max is $100/month. cancel anytime.
9. what happens if i hit my agent limit? talk keeps working, always. agent messages pause until your next cycle, or you can upgrade to max for 1,000 a month.
10. can i cancel anytime? yes. everything is month-to-month, no lock-in. cancel in one click and keep access through the end of your cycle.

### home

- title: "heyclicky - an ai buddy on your mac"
- H1: "heyclicky"
- Tagline: "an ai buddy that lives on your mac"
- CTA: "download for mac" / "100% free. sonoma 14.2 or higher" / "windows waitlist"
- Feature: "finally do the thing" / "from fl studio to claude code, jump into any tool, ask questions and heyclicky draws on your screen and teaches you."
- Feature: "use your screen as context" / "if you hit a wall, you can show heyclicky and it'll walk you through the next step."
- Feature: "spawn agents with your voice" / "we let you spawn ai agents with just your voice no terminal needed. connect your gmail or notion and start doing stuff."
- THE DREAM / notes
- FEEDBACK / "they use it everyday" (x5)
- Tweets (verbatim handles+dates): greg brockman @gdb (5/30), josh pigford @shpigford (4/27), joshua @4xiom_ (5/30), william wang @iamwilliamwang (4/6), lenny rachitsky @lennysan (4/27), belabbas anis @0xbelabbaa (5/30), aaron epstein @aaron_epstein (6/16), putri karunia @putrikarunian (4/6), sharif shameem @sharifshameem (4/25)
- PRICING: H2 "heyclicky, your way" / tabs "monthly" (sel) / "yearly -20%" / links "start free" / "get pro" / "get max" / "no cap!" / "reach out to us"
- FAQ (accordion, verbatim): what is heyclicky? / is my data private? (yes...) / is heyclicky watching my screen all the time? (no...) / what can heyclicky actually do? / what's the difference between talk and agents? / which apps does it work with? / do i need a mac? (yes, sonoma 14.2+) / is it free? (start free, pro $20/mo, max $100/mo) / what happens if i hit my agent limit? / can i cancel anytime? (yes)

### pricing

- **404** — this route is an in-page anchor, NOT a separate route.
  Nav "pricing" scrolls to the on-page PRICING section. Direct
  visit to /pricing returns Next.js 404 ("This page could not be found").
- On-page PRICING section (verbatim): H2 "heyclicky, your way";
  tablist "monthly" (selected) / "yearly -20%"; plan links
  "start free" / "get pro" / "get max"; "no cap!"; "reach out to us".
- Prices: pro $20/month, max $100/month (from FAQ: "pro is $20/month
  and max is $100/month").

## Screenshots Captured

### desktop (4)

- home_404-pricing_desktop.png
- home_dream_feedback_pricing_faq_desktop.png
- home_hero_features_desktop.png
- home_initial_desktop.png


