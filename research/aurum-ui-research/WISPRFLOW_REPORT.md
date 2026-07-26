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

