# UX_COMPARISON — Aurum vs heyclicky vs Wispr Flow

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
