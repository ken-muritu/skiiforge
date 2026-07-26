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

