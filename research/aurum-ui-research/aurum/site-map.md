# Aurum — Site Map

> Source: deployed aurumio.vercel.app (Playwright capture) + repo
> /root/aurum/frontend/app route tree. Gated = auth required.

## Routes (all confirmed)
| Route | Type | Auth | Notes |
|--------|------|------|-------|
| `/` | page | public | Landing/hero, 4 feature cards, badge, 2 CTAs |
| `/login` | page | public | "Welcome back", username+password, forgot link |
| `/signup` | page | public | display_name+username+email+password |
| `/forgot` | page | public | identifier -> Brevo email or MVP link |
| `/reset?uid=&token=` | page | public | new password set (Suspense) |
| `/discover` | page | public | public Masteries search + grid; works logged-out |
| `/dashboard` | page | **gated** | continue-learning, my-masteries, recent activity |
| `/masteries` | page | **gated** | list + "New Mastery" entry |
| `/masteries/new` | page | **gated** | title/goal/desc/public toggle |
| `/masteries/[id]` | page | **gated** | builder: modules->lessons->resources, progress, notes, fork |
| `/generate` | page | **gated** | topic -> YouTube-grounded proposal -> save |
| `/404` | page | public | Next.js default not-found |

## Navigation paths
- Public nav: logo (->/), Discover (->/discover), Log in (->/login), Get started (gold btn ->/signup)
- Post-login nav (UNCONFIRMED — gated capture only reached login-redirect):
  expected: Dashboard, Masteries, Discover, Log out
- Footer: "Get started — it's free" (CTА)

## Modals / overlays (in app, UNCONFIRMED capture)
- /masteries/[id] builder: YouTube search picker (modal/drawer), resource attach,
  quiz/project-prompt editor, fork confirm.
- /generate: proposal preview + "Save to my Masteries" confirm.

## Onboarding (UNCONFIRMED)
- Signup -> auto-login -> redirected to /dashboard. No multi-step wizard captured.

## CTA destinations
- "Build your first Mastery" -> /masteries/new
- "Explore public Masteries" -> /discover
- "Get started" -> /signup
- "Forgot your password?" -> /forgot

## Hidden / conditional
- /reset requires valid uid+token (Brevo-sent). Bad token -> 400.
- Auth-guarded pages without session -> 307/redirect to /login.

## Hash / query states
- /reset?uid=..&token=.. (query-param state, real)
- /masteries/[id]? (single dynamic param)
