# AURUM_UI_GUIDE — Rebuild Spec

> Canonical design reference for rebuilding Aurum's UI from scratch.
> Derived from the audit of aurumio.vercel.app vs heyclicky.com +
> wisprflow.ai. Cite: screenshots/... | design-systems/....md.

## 1. Executive Summary (plain language)
Aurum's homepage is already a competent dark-mode SaaS landing — but it
reads as **unfinished** next to the references for three concrete reasons:
(1) it uses **emoji/unicode as icons** instead of a real icon set;
(2) its **typography leans on Times New Roman** (a serif *fallback*)
rather than a deliberate loaded display face; (3) it has **almost no
motion or elevation**, so it feels static vs Wispr Flow's lively
carousels and Aurum's own gold-hover-only interaction. The fix is NOT a
redesign of structure (layout is fine) — it is a **fidelity upgrade**:
real icons, a real type system, sticky header, subtle shadows, and a few
micro-interactions. heyclicky is a WIP and not a model; **Wispr Flow
is the north star** for editorial warmth + motion.

## 2. Design Principles to Adopt (each cited)
- **P1 — Editorial serif + sans pairing.** Wispr Flow pairs EB Garamond
  (120px hero) with Figtree. Aurum should load a display serif +
  geometric sans. (cite: design-systems/wisprflow.md typography)
- **P2 — Intentional iconography, never emoji.** Wispr Flow uses flat
  app icons with subtle float-shadow. (cite: design-systems/wisprflow.md
  iconography; contrast design-systems/aurum.md "Emoji / unicode")
- **P3 — Sticky, minimal header.** Wispr Flow's sticky nav with
  dropdowns + right-aligned CTA. (cite: wisprflow homepage DOM)
- **P4 — Subtle elevation + motion.** Cards lift/shadow on hover;
  carousels slide; photo bands use motion blur. (cite: wisprflow vision)
- **P5 — Generous, centered rhythm.** All three use centered heroes
  + big whitespace. (cite: all three homepages)

## 3. Design Token Spec (drop into :root / Tailwind)
```css
:root {
  /* Color — keep Aurum's dark identity, refine */
  --bg:            #0B0D12;   /* page bg (rgb 11,13,18) */
  --surface-1:      #10131A;   /* card */
  --surface-2:      #161E22;
  --surface-3:      #232833;
  --border:          #2F3644;
  --text:            #E8EBF0;
  --text-muted:      #9AA3B2;
  --gold:            #E9C46A;   /* brand */
  --gold-soft:       rgba(233,196,106,0.12);
  --mint:            #7FE7C4;   /* secondary gradient stop */
  --danger:          #FF6B6B;
  --success:          #5BD98C;

  /* Type — LOAD these, do not fall back to Times */
  --font-sans:  "Satoshi", "General Sans", system-ui, sans-serif;
  --font-serif: "Fraunces", "Playfair Display", Georgia, serif;
  --fs-hero:    clamp(40px, 7vw, 88px);
  --fs-h1:      56px;  --fw-h1: 600;  --ls-h1: -0.02em;
  --fs-h2:      32px;  --fw-h2: 600;
  --fs-h3:      20px;  --fw-h3: 600;
  --fs-body:    16px;  --lh-body: 1.55;
  --fs-small:   13px;

  /* Spacing scale (8px base) */
  --sp-1: 8px; --sp-2: 16px; --sp-3: 24px;
  --sp-4: 32px; --sp-5: 48px; --sp-6: 64px;
  --container: 1200px;

  /* Radius */
  --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-pill: 999px;

  /* Elevation */
  --shadow-1: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-2: 0 8px 24px rgba(0,0,0,0.45);
  --shadow-gold: 0 8px 24px rgba(233,196,106,0.18);

  /* Motion */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --t-fast: 140ms; --t-med: 220ms; --t-slow: 360ms;
}
```

## 4. Component Redesign (before -> after)
- **Button** (globals.css .btn-gold): before = flat gold, brightness
  hover only. After = gold fill, --r-pill or --r-md, --shadow-gold
  on hover, `transform: translateY(-1px) scale(1.01)` on hover,
  active `scale(0.98)`.
- **Card**: before = flat dark block, no shadow. After = --surface-1,
  --r-lg, --shadow-1, hover --shadow-2 + border brighten.
- **Icon**: before = emoji (Target/Check/Pencil). After = **Lucide**
  icons, 20-24px, currentColor, stroke 1.75.
- **NavBar**: before = scrolls away. After = **sticky**, backdrop-blur,
  border-bottom on scroll.
- **Input**: before = mint focus outline. After = keep, add
  `--r-md`, padding --sp-2, error state border --danger + message.
- **Progress bar**: keep gold fill; add `--t-med` width transition.
- **Empty state**: add illustrated empty state (icon + line + CTA), not
  blank.

## 5. Page-by-page notes (Aurum routes)
- `/` home: strong already. Swap emoji feature icons -> Lucide; load
  Fraunces for hero; add sticky header. (cite: screenshots/aurum/*/home_*)
- `/login` `/signup` `/forgot` `/reset`: add card elevation + focus
  ring; keep centered. (cite: screenshots/aurum/*/login_*, signup_*)
- `/discover`: add empty-state illustration; card hover lift.
- `/dashboard` *(gated, UNCONFIRMED capture)*: when captured, apply
  card + sticky-nav + motion tokens.
- `/masteries` `/masteries/new`: apply card + form tokens.
- `/masteries/[id]` builder: this is the CORE product surface —
  priorize elevation + icon + progress-motion here most.
- `/generate`: apply form + card tokens; add loading skeleton.
- `/404`: keep Next default; restyle to gold/mint.

## 6. Open Questions (human decision needed)
- **Q1**: Keep dark-only, or add a light theme (references are light)?
  Recommendation: keep dark as the Aurum identity, but borrow the
  *warmth* (cream/serif) into dark surfaces.
- **Q2**: Which icon library — Lucide (recommended, matches
  Vercel/Linear vibe) or Heroicons? 
- **Q3**: Display serif choice — Fraunces (warmer, Wispr-like) vs
  Playfair (more classic)? 
- **Q4**: Should the authenticated app get the same editorial treatment,
  or stay utilitarian? (Affects build effort significantly.)
- **Q5**: Motion budget — full Wispr-level, or restrained Linear-level?
