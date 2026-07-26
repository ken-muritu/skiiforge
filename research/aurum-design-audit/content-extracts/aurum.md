# aurumio.vercel.app — Verbatim Content Extract

> Captured from live DOM 2026-07-26 (all public routes via Playwright; gated routes = login-redirect state).

## Meta / Home
- title: "Aurum — Mastery, Refined."
- H1 (home): "Turn scattered YouTube tutorials into real mastery."
- Hero sub: "You bookmark great videos and never finish them. Aurum turns a pile of good content into a structured path — modules, lessons, progress, and notes — so you actually cross the finish line."
- Badge: "Your Knowledge Operating System"
- CTA primary: "Build your first Mastery →"
- CTA ghost: "Explore public Masteries"
- Feature cards (H3 + desc):
  1. "Structure the chaos" — "Group videos into modules and lessons. One clear path from 'I want to learn X' to 'I can do X.'"
  2. "Track what sticks" — "Mark lessons complete, watch your progress bar fill, and always know the next thing to do."
  3. "Notes in context" — "Capture insights per lesson — timestamped to the moment they mattered."
  4. "Discover & remix" — "Browse public Masteries built by others and fork them into your own learning plan."
- Footer CTA: "Get started — it's free"

## Nav (header)
- Logo "Aurum" (serif, gold)
- "Discover" (link)
- "Log in" (link)
- "Get started" (gold button)

## /login
- H2: "Welcome back"
- sub: "Log in to continue your Masteries."
- labels: "Username", "Password"
- submit: "Log in"
- link: "Forgot your password?"
- "No account? Create one →"

## /signup
- H2: "Create your account"
- fields: Display name, Username, Email, Password
- submit: "Create account"
- "Already have an account? Log in"

## /forgot
- "Forgot your password?"
- field: identifier (email or username)
- submit: "Send reset link"

## /reset
- "Reset your password"
- fields: new password, confirm
- submit: "Reset password"

## /discover
- Public Masteries browser (search + grid). Empty state if none public.

## /dashboard (gated — captured as login redirect)
- Intended: continue-learning card, my-masteries grid, recent activity.
- Observed (no session): redirected to /login "Welcome back".

## /masteries (gated — login redirect)
- Intended: list of user's Masteries + "New Mastery" entry.
- Observed: /login.

## /masteries/new (gated)
- Form: title, goal, description, public/private toggle.
- Observed: /login.

## /generate (gated)
- Topic input -> YouTube-grounded proposal -> Save to my Masteries.
- Observed: /login.

## /404
- "404" / "This page could not be found." (Next.js default)
