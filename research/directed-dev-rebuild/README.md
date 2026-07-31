# directed-dev-rebuild

A **runnable reconstruction** of https://directed.dev (DirectEd Development),
built from the forensic analysis kit in `../site_reconstruction_directed.dev/`.
This is a working Next.js app that renders the same content, design tokens,
and interactions as the original.

## Stack
- Next.js 14 (App Router)
- Material UI (MUI) v5
- Framer Motion (`Reveal` scroll animations: `fadeUp` / `fade`)
- Local woff2 fonts (Plus Jakarta Sans, DM Sans, Inter) — no network dependency
- Brand tokens in `tokens.ts` (colors, fonts) and `theme.ts` (MUI theme)

## Run
```bash
npm install
npm run dev      # http://localhost:3000
# or
npm run build && npm run start
```

## Structure
- `app/layout.tsx` — ThemeProvider + CssBaseline + font variables
- `app/page.tsx` — homepage (assembles all sections)
- `app/about-us/page.tsx` — stub (route exists on live site, not captured)
- `app/globals.css` — base + hero blueprint lattice
- `components/Header.tsx` — MUI AppBar (logo, About, Apply)
- `components/Reveal.tsx` — Framer Motion scroll-reveal wrapper
- `components/sections.tsx` — Hero, Reality, Opportunity, Alternative, Stats,
  HowItWorks, Recognized, Collaborators, Testimonial, FinalCTA, Footer
- `theme.ts` / `tokens.ts` — MUI theme + shared brand constants
- `fonts.ts` — next/font/local wiring for the 3 woff2 files
- `public/` — SVG icons/logos + icon.svg + icon-32.png + fonts/*.woff2

## Notes
- CTA buttons → `https://tally.so/r/2Er8jD` (external). "How it works" scrolls
  to `#how-it-works`.
- Footer social links are placeholders (`href="#"`).
- The original is a long-scroll single page; the `/about-us` route is a stub.
