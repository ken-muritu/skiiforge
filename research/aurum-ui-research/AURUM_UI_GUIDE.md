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
