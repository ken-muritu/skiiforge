# DESIGN_GAPS — Aurum vs References

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
