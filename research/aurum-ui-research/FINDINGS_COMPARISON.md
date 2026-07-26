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
