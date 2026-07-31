# Reconstruction Manifest — directed.dev (DirectEd Development)

> **Forensic Web Engineering Report**
> Target: https://directed.dev/
> Captured: 2026-07-31
> Purpose: Pixel-perfect reconstruction kit. This file is the single source of truth.

---

## 1. OVERVIEW

### 1.1 Tech Stack (inferred from DOM, CSS, and Next.js payload)
| Layer | Technology | Evidence |
|-------|-----------|----------|
| Framework | **Next.js (App Router)** | `__next_f` streaming payload, `/_next/static/chunks`, `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">` |
| Bundler | **Turbopack** | chunk `turbopack-9fc3d87813208a21.js` |
| UI Library | **Material UI (MUI) v5/v6** | `MuiAppBar`, `MuiToolbar`, `MuiPaper`, `MuiButton`, `MuiDivider`, Emotion `<style data-emotion>` tags |
| Styling | **Tailwind CSS v4** | `@theme`/`--tw-*` custom props, arbitrary values like `gap-[28px]`, `text-[96px]`, `bg-[#395241]` |
| Fonts | **next/font** (self-hosted woff2) | `plus_jakarta_sans_…-variable`, `dm_sans_…-variable`, `inter_…-variable` classes on `<body>` |
| Animation | **Framer Motion (custom `motion` wrapper)** | `animation="fadeUp"` / `animation="fade"` props, initial `opacity:0; transform:translateY(60px)` on sections |

### 1.2 Design Philosophy
- Editorial, high-contrast marketing landing page. Calm, trustworthy, "education/impact" tone.
- Generous whitespace; large display headings; restrained accent color (olive green) used only for emphasis words and primary CTAs.
- Grid background motif (faint 75px lattice, masked top/bottom) behind the hero — a "blueprint/structured potential" metaphor.
- Content is a single long-scroll page (Home) with anchor `id="how-it-works"`. Secondary route `/about-us` exists (nav link) but not captured here.

### 1.3 Color System
| Token | HEX | Usage |
|-------|-----|-------|
| `--color-ink` / text default | `#1E1E1E` | Headings, body emphasis |
| Brand green (primary) | `#6B8065` | Eyebrow labels, list dots, borders on "Directed" card |
| Brand green (deep) | `#395241` | Stat numbers, CTA button bg, step labels, card top-borders |
| Muted slate (body secondary) | `#717887` | Paragraphs, sub-labels |
| Slate blue (alt) | `#5A6A7A` | Card descriptions ("Learn/Prove/Earn/Compete") |
| Light grey border | `#E1E1E1` | Logo grid borders, "Regular route" card border |
| Card grey border | `#D3D1D1` | Opportunity feature card borders |
| Step border | `#A09D9D` | "How it works" step card borders |
| Neutral card bg | `#F5F5F5` | Regular-route card, "Begin" card |
| Green-tint card bg | `#F1F4F0` | Directed program card, stats band `#F1F2F0`/`#F1F2F0` |
| Divider grey | `#949494` | Vertical dividers in stats band |
| Page bg | `#FFFFFF` | `<body>` / `<main class="bg-white">` |
| Grid line | `#E6E6E6` | Hero lattice (opacity 0.3) |

> Note: MUI primary was left near-default blue (`#1976d2`) in the inherited theme vars, but the actual brand buttons override `backgroundColor:#395241`. Reconstruct using `#395241` as the real primary.

### 1.4 Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Headings (h1, h2, h3) | **Plus Jakarta Sans** | 700 (bold), 600 (semibold) | `plus_jakarta_sans_…-variable` |
| Body text | **DM Sans** | 400/500 | `dm_sans_…-variable` |
| UI / Buttons (MUI) | **Inter** | 500 | `inter_…-variable` (MUI default Roboto overridden to Inter) |
| Mono | ui-monospace stack | – | fallback only |

Key sizes (from computed + classes):
- **h1 (hero):** `text-4xl` mobile → `sm:text-5xl` → `md:text-[96px]`, `font-bold`, `md:leading-[96px]`, `tracking-[0%]`. Spans: "For the ones who" `#1E1E1E`, "refuse average" `#6B8065`, "." black.
- **h2 section titles:** `text-2xl md:text-[48px]`, `font-bold`, `text-[#1E1E1E]`, `md:leading-[60px]`.
- **Eyebrow (h3/h4 labels):** `text-[14px]`, `font-semibold`, `text-[#6B8065]`, `tracking-[24%]` (≈0.24em), uppercase.
- **Body:** `text-base` (16px) mobile → `md:text-[18px]`, `leading-[26px]`, `color:#717887`.
- **Stat numbers:** `text-[18px] md:text-[28px]`, `font-semibold`, `text-[#395241]`.

### 1.5 Spacing & Layout Scale
- Section vertical padding: `py-[75px]` mobile → `md:py-[98px]` / `lg:px-[120px]`.
- Hero: `pt-[95px] md:pt-0` (offset for fixed header), `pb-[75px]`, `px-4 sm:px-6 md:px-[80px] lg:px-[120px]`.
- Container max implied by `lg:px-[120px]` + content `md:w-[75%]` for some blocks.
- Gap rhythm: `gap-[60px]` (feature grid), `gap-6` (cards), `gap-[28px]` (nav).
- Border radius: cards `rounded-[8px]`/`rounded-[16px]`; buttons `borderRadius:5px`; logo grid `rounded-lg`.

### 1.6 Breakpoints (Tailwind default + MUI)
- `sm` = 40rem (640px), `md` = 48rem (768px), `lg` = 64rem (1024px), `xl` = 80rem, `2xl` = 96rem.
- MUI AppBar padding: `0px` (<600px) → `40px` (≥600px) → `80px` (≥900px).

---

## 2. PAGE-BY-PAGE BLUEPRINT (Home `/`)

### 2.1 Document Structure (simplified)
```
<body class="plus_jakarta_sans... dm_sans... antialiased">
  <header MuiAppBar colorTransparent positionRelative elevation4>
    <div MuiToolbar>
      <a href="/"><img src="/directed-development.svg" w=157 h=40 alt="Directed development Logo"/></a>
      <div class="flex gap-[28px]">
        <a href="/about-us"><button MuiButton-text>About Us</button></a>
        <a href="https://tally.so/r/2Er8jD" target="_blank"><button MuiButton-text>Apply Now</button></a>
      </div>
    </div>
  </header>

  <main class="relative min-h-screen w-full overflow-hidden bg-white">
    <!-- HERO -->
    <div class="relative flex md:min-h-screen md:items-center justify-center overflow-hidden pt-[95px] md:pt-0 pb-[75px] px-4 sm:px-6 md:px-[80px] lg:px-[120px]">
      <div class="pointer-events-none absolute inset-0" style="background-image:linear-gradient(#E6E6E6 1px,transparent 1px),linear-gradient(90deg,#E6E6E6 1px,transparent 1px);background-size:75px 75px;mask-image:linear-gradient(to bottom,transparent 0,black 18%,black 82%,transparent 100%);opacity:0.3"/>
      <div class="relative z-10">
        <div class="w-full text-center">
          <h1 class="...text-4xl sm:text-5xl md:text-[96px] font-bold md:leading-[96px]">
            <span class="text-[#1E1E1E]">For the ones who</span><br/>
            <span style="color:#6B8065">refuse average</span><span class="text-black">.</span>
          </h1>
          <p class="text-balance text-base mt-[18px] md:text-[18px] leading-[26px]" style="color:#717887">
            Intensive program that transforms raw talent into globally competitive engineers,
            with stipend supported internships and real placement support.
          </p>
          <div class="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-center sm:gap-6">
            <a href="https://tally.so/r/2Er8jD" target="_blank">
              <button MuiButton-textPrimary style="background:#395241;borderRadius:5px;color:#FFF;fontSize:16px;padding:8px 32px">Apply Now</button>
            </a>
            <button MuiButton-outlinedPrimary style="border:1px solid #1E1E1E;borderRadius:5px;color:#1E1E1E;fontSize:16px;padding:8px 32px">How it works</button>
          </div>
        </div>
      </div>
    </div>

    <!-- THE REALITY -->
    <div class="flex px-4 sm:px-64 md:px-[120px] py-[75px] flex-col" animation="fadeUp">
      <div class="w-full">
        <h2 class="font-semibold text-[14px] text-[#6B8065]">THE REALITY</h2>
        <p class="plus_jakarta_sans text-[28px] font-semibold text-[#1E1E1E] mt-[24px] tracking-[-1.1%] leading-[42px] text-balance">
          You didn't study STEM to earn $250 a month. For most university graduates in Africa, this is the starting point.
        </p>
        <div class="mt-[90px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[60px]">
          <div class="flex items-center flex-col gap-3">
            <h2 class="text-[44px] text-[#1E1E1E] leading-[48px] font-medium tracking-[-1.1%]">30%</h2>
            <p class="text-[#717887] text-[16px] text-center">Graduates from top-3 universities in Kenya are unemployed</p>
          </div>
          <div class="flex items-center flex-col gap-3">
            <h2 class="text-[44px]...">2 years</h2>
            <p ...>average time to find a degree-relevant full-time job</p>
          </div>
          <div class="flex items-center flex-col gap-3">
            <h2 class="text-[44px]...">$600</h2>
            <p ...>average salary 2 years post-graduation (STEM)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- THE OPPORTUNITY -->
    <section class="flex px-4 sm:px-64 md:px-[120px] py-[75px] flex-col" animation="fadeUp">
      <h2 class="font-semibold text-[14px] text-[#6B8065]">THE OPPORTUNITY</h2>
      <div class="flex gap-[31px] mt-[34px]">
        <Divider vertical/>
        <h3 class="text-[28px] font-semibold text-[#1E1E1E]">Remote roles offer up to 5x more for honed skills. We prepare high-potential talent for the global market.</h3>
      </div>
      <div class="mt-[90px] grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-[16px]">
        <!-- 4 feature cards: learn / prove / earn / compete -->
        <div class="flex items-center flex-col px-[20px] pt-[19px] pb-[24px] border rounded-[8px] border-[#D3D1D1]">
          <img src="/learn.svg" w=44 h=44 alt="icon-logo"/>
          <p class="text-[#395241] font-semibold text-[18px] mt-[12px]">Learn</p>
          <p class="text-[16px] text-[#5A6A7A] mt-[12px] text-center">World-class training built for the global market.</p>
        </div>
        ... prove.svg "Prove" "Real work experience with international companies."
        ... earn-logo.svg "Earn" "A chance to triple your earning potential."
        ... compete.svg "Compete" "Build the confidence to stand out globally."
      </div>
    </section>

    <!-- THE ALTERNATIVE (two-column comparison) -->
    <div class="px-4 sm:px-6 py-[75px] md:px-[120px]" animation="fadeUp">
      <div class="w-full md:w-[75%]">
        <h3 class="font-semibold text-[14px] text-[#6B8065]">THE ALTERNATIVE</h3>
        <h2 class="mt-[24px] text-2xl md:text-[48px] font-bold text-[#1E1E1E] md:leading-[60px]">
          We give you an <span class="text-[#717887]">unfair advantage</span> for a remote job in tech.
        </h2>
      </div>
      <div class="mt-[30px] md:mt-[60px] grid gap-6 md:grid-cols-2">
        <MuiCard sx="{bg:#F5F5F5,border:1,borderColor:#E1E1E1,borderRadius:16px}" class="py-[32px] px-[33px]">
          <h4 class="capitalize text-[14px] font-semibold tracking-[24%] text-[#717887]">REGULAR UNIVERSITY ROUTE</h4>
          <ul class="mt-4 space-y-2 text-[16px] text-[#717887]">
            <li class="flex items-start gap-2"><span class="mt-[10px] h-[6px] w-[6px] rounded-full bg-[#BEC1C9]"/><span>Learning that focuses more on theory than application</span></li>
            ... (8 items, see §4.1)
          </ul>
        </MuiCard>
        <MuiCard sx="{bg:#F1F4F0,border:1,borderColor:#6B8065,borderRadius:16px}" class="py-[32px] px-[33px]">
          <h4 class="text-[14px] font-semibold tracking-[24%] text-[#395241]">THE DIRECTED TALENT PROGRAM</h4>
          <ul class="mt-4 space-y-2 text-[16px] text-[#1E1E1E]">
            <li class="flex items-start gap-2"><span class="mt-[10px] h-[6px] w-[6px] rounded-full bg-[#6B8065]"/><span>Remote internships with US, European and African companies</span></li>
            ... (9 items, see §4.1)
          </ul>
        </MuiCard>
      </div>
    </div>

    <!-- STATS BAND -->
    <div class="mt-[55px] bg-[#F1F2F0] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-4 px-8 md:px-[60px] lg:px-[100px] py-[40px] md:py-[57px]" animation="fade">
      <Stat number="$2,000" label="Average monthly earnings of our graduates"/>
      <Stat number="70+" label="Students placed in remote internships"/>
      <Stat number="5+" label="Projects you can showcase in your portfolio"/>
      <Stat number="1:1" label="Mentorship from global professionals"/>
      (vertical dividers between, hidden on xs/sm)
    </div>

    <!-- HOW IT WORKS -->
    <section id="how-it-works" class="py-[75px] px-4 md:px-[60px] lg:px-[120px]" animation="fadeUp">
      <h2 class="text-[32px] md:text-[48px] leading-[40px] md:leading-[64px] font-bold text-[#1E1E1E]">Is it hard to join?</h2>
      <p class="mt-[10px] text-[16px] text-[#717887] max-w-[720px]">From ambitious beginners to rising experts, we build <span class="font-semibold text-[#395241]">Africa's top 0.1%</span></p>
      <p class="mt-[10px] text-[18px] font-semibold text-[#1E1E1E]">Just prove you can commit.</p>
      <div class="mt-[61px] grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div class="lg:col-span-9 flex flex-col gap-4">
          <div class="flex flex-col lg:flex-row gap-4 md:gap-0 items-stretch">
            <div class="lg:w-[160px] shrink-0 flex items-center"><h2 class="uppercase text-[20px] font-semibold text-[#395241] tracking-[15%]">0-2 years experience</h2></div>
            <div class="flex-1 grid grid-cols-1 gap-4 md:grid-cols-3">
              <StepCard n="STEP 01" title="Register" d="Sign up and tell us about yourself."/>
              <StepCard n="STEP 02" title="Learn" d="If selected, your bootcamp journey starts."/>
              <StepCard n="STEP 03" title="Assess" d="Take our assessment to prove your skills."/>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row gap-4 md:gap-0 items-stretch">
            <div class="lg:w-[160px] shrink-0 flex items-center"><h2 class="uppercase text-[20px] font-semibold text-[#395241] tracking-[15%]">2 years+ experience</h2></div>
            <div class="flex-1">
              <StepCard n="STEP 01" title="Assess" d="Think you're ready? Take our assessment and demonstrate your real-world ability. From Full-Stack Engineering and UI/UX Design to Machine Learning and GTM strategy."/>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3">
          <StepCard bg="#F5F5F5" title="Begin" d="Join our talent program and gain real-world experience with leading European and U.S. companies." sub="Learn on the job, receive expert mentorship, earn a learning stipend, and get dedicated job placement support."/>
        </div>
      </div>
    </section>

    <!-- WE ARE RECOGNIZED -->
    <div class="px-4 md:px-[60px] lg:px-[120px] py-[72px] md:py-[98px]" animation="fadeUp">
      <h3 class="text-[32px] md:text-[48px] font-bold text-[#1E1E1E]">We are <span class="text-[#717887]">recognized.</span></h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-[40px]">
        <div class="flex gap-[12px] flex-col min-h-[123px] py-[15px] border-t border-[#395241]">
          <p class="text-[#1E1E1E] text-[18px] font-medium">Preparing Future Unicorn Founders</p>
          <p class="text-[#717887] text-[14px] font-medium">Having received training from 50+ unicorn investor Tim Draper himself, we know what it takes.</p>
        </div>
        <div ...>World Class Mentorship — Our mentors include people from, companies like Google, Apple, Canva, Spotify, Goldman Sachs and more.</div>
        <div ...>Award-Winning Program — Our entrepreneurship training is a two-time winner at the African Startup Ecosystem Builder summit</div>
      </div>
    </div>

    <!-- COLLABORATORS LOGO GRID -->
    <div class="py-[60px] md:py-[75px] px-4 md:px-[60px] lg:px-[120px]" animation="fadeUp">
      <h4 class="text-center uppercase text-[#717887] font-semibold tracking-[24%] text-[14px]">collaborators and mentors from</h4>
      <div class="mt-[61px] grid grid-cols-2 md:grid-cols-4 gap-0 rounded-lg overflow-hidden border-l border-[#E1E1E1]">
        <!-- each cell: h-80px md:h-100px, border-r + border-t (mobile), flex center, img w-[105px] -->
        Tally, Lovable, Canva, Apple, Cardano, LidoNation, Google, Tison
        (logos from /assets/icons/*.svg)
      </div>
    </div>

    <!-- TESTIMONIAL -->
    <section class="py-[75px] md:px-[120px]" animation="fadeUp">
      <h1 class="text-[32px] md:text-[48px] font-bold text-[#1E1E1E]">What our students say</h1>
      <div class="mt-[40px] flex gap-[24px] items-center max-w-[900px]">
        <img src="/victoria-portrait.svg" class="w-[120px] h-[120px] rounded-full"/>
        <p class="text-[18px] text-[#1E1E1E] italic">"Working with DirectEd gave me the opportunity to collaborate with talented designers and engineers while contributing to real products for startups. The experience helped me grow quickly, both technically and professionally, and opened doors to international opportunities, including my current role as a software engineer."</p>
      </div>
      <p class="mt-[16px] ml-[144px] text-[#717887]">— Victoria Essien, Software Engineer · Abuja, Nigeria</p>
    </section>

    <!-- FINAL CTA -->
    <section class="py-[75px] md:px-[120px]" animation="fadeUp">
      <div class="flex flex-col justify-center items-center gap-[16px]">
        <h4 class="font-bold text-[28px] md:text-[48px] text-center text-[#1E1E1E] md:leading-[60px]">Ready to Rise to the top?</h4>
        <a href="https://tally.so/r/2Er8jD" target="_blank">
          <button class="dm_sans" sx="{textTransform:none,backgroundColor:#395241,px:32px,py:12px,color:#FFF,textAlign:center,borderRadius:5px,textWrap:nowrap}">Express Interest</button>
        </a>
      </div>
    </section>
  </main>

  <footer class="...">
    <p>Directed Development Ltd</p>
    <p>Address: 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
    <p>Company number: 14900281</p>
    <p>Contact Us</p>
    <p>Copyright ©2026 DirectEd Development. All rights reserved.</p>
    <div class="flex gap-4">
      <a href="..."><img src="/instagram-logo.svg"/></a>
      <a href="..."><img src="/x-logo.svg"/></a>
      <a href="..."><img src="/linkedin-logo.svg"/></a>
      <a href="..."><img src="/telegram-logo.svg"/></a>
    </div>
  </footer>
</body>
```

---

## 3. COMPONENT LIBRARY

### 3.1 Buttons (MUI `Button`)
| Variant | Classes | Styles | Hover |
|---------|---------|--------|-------|
| **Primary (Apply/Express)** | `MuiButton-textPrimary` overridden | `background:#395241; color:#FFF; borderRadius:5px; fontSize:16px; padding:8px 32px; textTransform:none` | MUI default hover sets `--variant-containedBg:#1565c0` (inherited blue) — but real site shows slight darken; replicate with `#2c3f2f` on hover |
| **Outlined (How it works)** | `MuiButton-outlinedPrimary` | `border:1px solid #1E1E1E; color:#1E1E1E; borderRadius:5px; fontSize:16px; padding:8px 32px; textTransform:none` | bg `rgba(0,0,0,0.04)` |
| **Nav text (About/Apply)** | `MuiButton-text` | `color:inherit; fontSize:14px; padding:6px 8px; textTransform:none; fontFamily:Inter` | bg `rgba(0,0,0,0.04)` |
| Transitions | all | `transition: background-color 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms …, border-color 250ms …, color 250ms …` | |

### 3.2 Cards
- **Feature (Learn/Prove/Earn/Compete):** `border:1px solid #D3D1D1; border-radius:8px; padding:19px 20px 24px; flex-col items-center text-center`. Icon 44×44, title `#395241` 18px semibold, desc `#5A6A7A` 16px.
- **Comparison cards (MUI Paper):** `boxShadow:none; border:1px solid; border-radius:16px; padding:32px 33px`. Left = `#F5F5F5`/`#E1E1E1`; Right = `#F1F4F0`/`#6B8065`.
- **Step cards:** `transparent bg; border:1px solid #A09D9D; border-radius:8px; padding:19px 12px`. "STEP 0X" 12px `#395241` semibold tracking-24%; title 16px `#1E1E1E`; desc 14px `#717887`.
- **Recognized cards:** `border-top:1px solid #395241; padding:15px 0; min-height:123px; flex-col gap-12px`.

### 3.3 Navigation (MUI AppBar)
- `position: relative` (NOT sticky), `elevation={4}`, `colorTransparent`, white bg (`#fff`), `box-shadow` set via `--Paper-shadow` (MUI default elevation4: `0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)`).
- Toolbar: `min-height:56px` (sm:64px), `justify-content:space-between`, padding `16px`→`24px` horiz; AppBar horiz padding `0`(<600)→`40px`(≥600)→`80px`(≥900).
- Logo `<img>` 157×40.

### 3.4 Logo Grid (collaborators)
- Wrapper `rounded-lg; overflow:hidden; border-l:1px #E1E1E1; grid-cols-2 md:grid-cols-4`.
- Cell: `h-80px md:h-100px; flex center; border-r:1px #E1E1E1; border-t:1px #E1E1E1 (mobile only); padding:32px 33px`. Img `w-[105px] h-auto`.

### 3.5 Stats Band
- `bg:#F1F2F0; grid-cols-2 sm:3 md:4; gap-6 md:gap-4; padding:40px 60px / 57px 100px`.
- Each stat: number `text-[#395241] text-[18px] md:text-[28px] font-semibold`, label `text-[#717887] text-[14px] font-medium`.
- Vertical `<Divider>` between (hidden xs/sm), `borderColor:#949494`.

---

## 4. LOGIC & BEHAVIOR

### 4.1 List Content (verbatim)
**REGULAR UNIVERSITY ROUTE (8):**
1. Learning that focuses more on theory than application
2. Entry level roles asking for years of experience
3. Breaking into a competitive market with a portfolio still in progress
4. Internship hunting without real guidance
5. Sending connection requests until LinkedIn thinks you are a bot
6. Career advice shared with 500 others
7. Costs that are fixed regardless of the outcome
8. Hope for the best

**THE DIRECTED TALENT PROGRAM (9):**
1. Remote internships with US, European and African companies
2. Personalised career strategy
3. Training to prepare you for cross-cultural work
4. Mentorship matching
5. Masterclass workshops
6. Ongoing job-success coaching
7. Personalised job placement support
8. Quarterly personal development sessions
9. Outcomes-based tuition: Pay only if you succeed

### 4.2 Animations
- Wrapper component (call it `<Reveal>`) applies Framer Motion:
  - `animation="fadeUp"` → `initial:{opacity:0, y:60}`, `whileInView:{opacity:1,y:0}`, `viewport:{once:true, margin:"-10%"}`, `transition:{duration:0.6, ease:[0.22,1,0.36,1]}`.
  - `animation="fade"` → `initial:{opacity:0}`, `whileInView:{opacity:1}`, `duration:0.8`.
- Hero content has `opacity:0` inline initially (revealed on mount, not scroll).
- No parallax, no hover-scale on images. Links have color hover only.

### 4.3 Interactions / Navigation Flow
- **Apply Now** (nav + hero): `target="_blank"` → `https://tally.so/r/2Er8jD` (Tally form).
- **Express Interest** (final CTA): same Tally URL, new tab.
- **How it works** (outlined button): scrolls to `#how-it-works` (anchor on same page). Implement as `<a href="#how-it-works">` or smooth-scroll.
- **About Us** (nav): `href="/about-us"` (internal route — not captured; stub it).
- **Social icons** (footer): external links (Instagram, X, LinkedIn, Telegram) — URLs not exposed in static HTML; wire to brand handles or leave `href="#"` placeholders.
- **Logo** (header): `href="/"` (home).

### 4.4 State Mapping
| State | Behavior |
|-------|----------|
| Default | As described; AppBar transparent→white (elevation4 shadow). |
| Hover (buttons) | background tint per §3.1; links underline removed, color shift. |
| Focus | MUI `:focus-visible` outline (browser default ring); `-webkit-tap-highlight-color:transparent`. |
| Active | button `:active` → slight press (MUI ripple disabled here, no ripple element). |
| Disabled | `.Mui-disabled{color:rgba(0,0,0,0.26); pointer-events:none}` (not used on live page). |
| Loading | `.MuiButton-loading{color:transparent}` (spinner not present live). |
| Error | No forms on page (Apply uses external Tally) → no inline error states. |

---

## 5. ASSET MAP

### 5.1 Icons & Logos (`/assets/icons/`)
| File | Used for | Dimensions (render) |
|------|----------|---------------------|
| `directed-development.svg` | Header logo | 157×40 |
| `icon.svg` | Favicon (SVG) | 1015×1015 (pattern of raster) |
| `icon-32.png` | Apple-touch icon | 32×32 |
| `learn.svg` | Opportunity card | 44×44 |
| `prove.svg` | Opportunity card | 44×44 |
| `earn-logo.svg` | Opportunity card | 44×44 |
| `compete.svg` | Opportunity card | 44×44 |
| `tally.svg` | Collaborator logo | 111×25 |
| `lovable.svg` | Collaborator logo | 109×19 |
| `canva.svg` | Collaborator logo | 85×27 |
| `apple.svg` | Collaborator logo | 109×55 |
| `cardano.svg` | Collaborator logo | 136×38 |
| `lido-nation.svg` | Collaborator logo | 98×60 |
| `google.svg` | Collaborator logo | 109×45 |
| `tison.svg` | Collaborator logo | 109×29 |
| `victoria-portrait.svg` | Testimonial avatar | 120×120 (circular crop) |
| `instagram-logo.svg` | Footer social | – |
| `x-logo.svg` | Footer social | – |
| `linkedin-logo.svg` | Footer social | – |
| `telegram-logo.svg` | Footer social | – |

### 5.2 Fonts (`/assets/fonts/`)
| File | Family | Note |
|------|--------|------|
| `5c285b27cdda1fe8-s.p.a62025f2.woff2` | Plus Jakarta Sans | headings |
| `83afe278b6a6bb3c-s.p.3a6ba036.woff2` | DM Sans | body |
| `fba5a26ea33df6a3-s.p.1bbdebe6.woff2` | Inter | MUI buttons |

### 5.3 Stylesheets (`/assets/css/`)
- `main.css` — primary bundle (Tailwind v4 theme + MUI emotion overrides).
- `secondary.css` — secondary bundle.

### 5.4 Screenshots (`/screenshots/`)
- `homepage/desktop/homepage_desktop.png` — full hero + first scroll (captured 1280px viewport).
- `homepage/desktop/homepage_desktop_2.png` — second capture.
- Mobile screenshots: tool could not resize viewport; reconstruct mobile via Tailwind `sm:`/`md:` rules in §1.6 + §2 blueprint. Recommended manual capture at 390px width.

---

## 6. RECONSTRUCTION STEPS (recommended)

1. `npx create-next-app@latest directed-dev --ts --tailwind --app`
2. `npm i @mui/material @emotion/react @emotion/styled framer-motion`
3. Drop fonts into `app/fonts/`; wire with `next/font/local` (PlusJakarta, DMSans, Inter) → CSS vars `--font-plus-jakarta-sans`, `--font-dm-sans`, `--font-inter`.
4. Copy `assets/css/*.css` OR re-author Tailwind config with tokens from §1.3–1.5.
5. Build `<Reveal>` (Framer Motion) per §4.2.
6. Compose `app/page.tsx` from §2.1 structure; components from §3.
7. Place SVGs in `public/` (exact filenames from §5.1).
8. Wire links per §4.3 (Tally form, `#how-it-works`, `/about-us` stub).
9. Verify: hero h1 96px on desktop, grids 75px masked lattice, green `#395241` CTAs, fadeUp on scroll.

---

## 7. KNOWN LIMITATIONS / CAVEATS
- Mobile screenshot not captured (browser tool lacked viewport resize). Use §1.6 breakpoints.
- `/about-us` route exists but not analyzed — stub it.
- Footer social URLs not in static payload — set to brand handles or `#`.
- Hero lattice is a CSS gradient mask, NOT an image — reproduce with the exact `background-image`/`mask-image` from §2.1.
- The MUI theme's inherited primary is blue (`#1976d2`); the brand overrides it to `#395241` inline. Use `#395241` as the real primary in your theme to avoid blue flashes.
