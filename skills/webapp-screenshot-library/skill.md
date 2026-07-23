# Web App Screenshot Library (Theme x Device x State) Capture Skill

## Purpose

Enable an AI agent to produce a **complete, organized screenshot library** of a live
web application — spanning marketing, authentication, consumer, and operator/back-office
surfaces — across **light + dark themes**, **desktop / tablet / mobile viewports**, and
**key UI states** (empty, error, 404, component popovers). The library is intended as a
visual reference / design-audit artifact and is delivered with a written index that
documents methodology, coverage, and any deviations between the brief and the live app.

This skill captures the *method*, not a single app. Another agent should be able to point
it at any Next.js (or similarly structured) web app and reproduce a clean, named,
idempotent screenshot library without re-deriving the hard-won details below.

---

## When to Use

Invoke this skill when a request asks for any of:

- A "moodboard", "screenshot library", "UI reference set", or "visual inventory" of a web app.
- Capturing an app across themes (light/dark), devices (responsive), or states (empty/error/loading).
- A design-consistency audit that needs ground-truth images of the current live product.
- Documentation of "what the app actually looks like right now" for designers/PMs/new engineers.

Do NOT use this skill to:
- Modify application source code (this is a read-only capture task).
- Run automated visual-regression *diffing* (that is a different toolchain).
- Capture behind auth when you cannot obtain a valid session (see Discovery).

---

## Required Inputs

| Input | How to obtain | Why it matters |
|-------|--------------|----------------|
| **Live app base URL** | From the repo README/`vercel.json` or `vercel project ls` | Every capture navigates here. |
| **Local repo clone** | `git clone` of the app | Source-of-truth for real routes, theme mechanism, and auth model. Never guess URLs. |
| **Which surface is deployed** | Inspect the repo for `app/` vs `src/app/` | A stale `app/` dir will mislead route discovery (this burned a prior run). |
| **Auth model** | Read `auth.ts` / NextAuth config / middleware | Determines whether you can fake login with localStorage or MUST log in via UI and persist cookies. |
| **Theme mechanism** | Grep for `next-themes`, `ThemeProvider`, `data-theme`, `classList`, `localStorage` theme key, `tailwind.config` `darkMode` | Determines how to force light/dark per context. |
| **(If protected) Session cookie** | Log in through the UI; save Playwright `storage_state` | JWT httpOnly cookies cannot be forged with localStorage. |
| **Target route list** | Derived from the real route tree + in-app nav | Drives the capture matrix. |
| **Spec/brief route list** | From the user request | Compared against reality to document deviations. |
| **Playwright + Chromium** | `pip install playwright && playwright install chromium` (or reuse a present binary) | The capture engine. |

Environment notes:
- Run inside a sandbox/terminal with network egress to the app host.
- Have `gh` authenticated if the deliverable must be committed/pushed.

---

## Outputs

A directory (conventionally `docs/moodboard/`) containing:

```
docs/moodboard/
├── <surface>/<page>-<theme>-<device>[-<state>].png   (the shots)
└── README.md                                          (the index + methodology + deviations)
```

Where:
- `<surface>` ∈ {marketing, auth, consumer, dashboard, states, components}
- `<theme>` ∈ {light, dark}
- `<device>` ∈ {desktop, tablet, mobile} (omitted-from-name only when desktop is the sole variant AND the convention says so; otherwise always explicit)
- File count is deterministic for a given route matrix.

Plus a git commit (and optional push) containing **only** the new `docs/moodboard/` tree — no application source changes.

The README documents: capture methodology, the naming convention, the full file index,
a theme/device coverage matrix, and a "live app differs from brief" deviations section.

---

## Core Principles

These principles were consistently demonstrated and should be preserved:

1. **Discover reality from code, never assume from the brief.** The live app routinely
   diverges from the spec (404 routes, renamed pages, missing features). Every route and
   mechanism is verified against the repo before a single screenshot is taken.
2. **Routes come from the deployed tree, not guesses.** The real `src/app/` (or `app/`)
   route directory + the app's own navigation menu is the authoritative URL list.
3. **Theme is a context-level concern.** Inject the theme seed via `add_init_script` at
   browser-context creation, not after page load — otherwise the first paint flashes the
   wrong theme and the captured frame may be inconsistent.
4. **Auth is a cookie concern, not a localStorage concern.** When the app uses NextAuth
   JWT httpOnly cookies, you must log in through the UI and reuse the saved
   `storage_state`; you cannot spoof a session with `localStorage`.
5. **Captures are idempotent and resumable.** A `shoot()` helper that skips files already
   on disk lets you chunk long runs and re-run safely without duplicates or re-capturing.
6. **Document deviations, don't hide them.** When the live app lacks a briefed section,
   record it explicitly so reviewers don't hunt for missing files.
7. **Name files for humans.** Ugly URL-encoded routes (`/customers/+254...|KDA 001A`) get
   a clean, stable basename (`customer-details`). Follow the brief's exact naming
   convention (hyphens vs underscores) even if it means renaming 112 files.
8. **Verify the artifact, not just the exit code.** Count files per folder, check for
   zero-byte PNGs, confirm no leftover encoded filenames, before declaring done.
9. **Chunk long work to survive timeouts.** Split the matrix into areas and run each as a
   bounded foreground command with a generous timeout; rely on skip-existing for resumes.
10. **Read-only discipline.** The only repo changes are the screenshot tree + its README.
    No application code, config, or dependencies are modified.

---

## Workflow

### 1. Initial analysis
- Confirm the goal is a *reference library*, not a code change.
- Identify the app, its repo, and its deployment target.
- Decide the surface/theme/device/state matrix implied by the brief.
- Note: the deliverable is `docs/moodboard/` + README, committed/pushed.

### 2. Discovery (the most important step)
- Clone the repo locally. Determine which `app/` directory is actually deployed
  (check `next.config`, `vercel.json`, build output). If both `app/` and `src/app/` exist,
  pick the one the build actually uses — the other is often stale.
- **Theme mechanism:** grep for `next-themes|ThemeProvider|data-theme|classList|localStorage.*theme|setTheme|darkMode`. Read `tailwind.config` to confirm `darkMode: 'class'` vs `'media'`. Find the exact `localStorage` key and value shape (e.g. `localStorage["caspahub-theme"] = {state:{theme:"dark"}}`) and the DOM effect (`dark` class on `<html>`).
- **Auth model:** read `auth.ts` / NextAuth config. Determine session strategy
  (`jwt` vs `database`) and whether cookies are `httpOnly`. Read `middleware.ts` to learn
  which routes are protected and where unauthenticated users are redirected.
- **Real routes:** enumerate `page.tsx` files under the deployed app dir; also read the
  app's navigation component to learn operator route names and any marketing/consumer URLs.
- **Login flow:** open the login page source; find field selectors (`#email`, `#password`,
  submit `button[type=submit]` or a "Sign in" button).

### 3. Planning
- Build the capture matrix as lists:
  - `MARKETING`, `AUTH_PUBLIC`, `CONSUMER`, `APP_PAGES` (arrays of path strings).
  - `DEVICES = {desktop:(1920,1080), tablet:(834,1112), mobile:(390,844)}`.
  - `THEMES = ["light","dark"]`.
- Map each surface to its device set (marketing gets all 3; auth/consumer get desktop+mobile;
  dashboard gets desktop+mobile; states/components desktop-only).
- Decide clean basenames for any URL-encoded routes.
- Decide the chunking (one `AREA` per run) so no single command exceeds ~3 min.

### 4. Implementation (the capture script)
- Write a single parametric `cap.py` taking `AREA` as argv.
- Implement `shoot(page, folder, name)` that **skips if the file exists** and writes
  `full_page=True` screenshots.
- Implement `ctx_for(browser, area, theme, device)` that:
  - sets viewport from `DEVICES`;
  - picks `LIGHT`/`DARK` seed;
  - for protected areas, loads `storage_state=STATE`;
  - calls `context.add_init_script(seed)` **before** any page is created.
- Implement per-area functions that loop themes × devices × routes, navigate, wait
  (~1.4–2.6s for fonts/animations), and `shoot`.
- For `login-error`: use a **fresh context WITHOUT storage_state** so the validation
  message renders (an active session cookie otherwise shows an "existing session" panel).
- For component shots: navigate to a representative page, then trigger popovers
  (command palette `Control+K`, notification bell, user menu, breadcrumbs) before shooting;
  press `Escape` between them.

### 5. Validation (per chunk, before moving on)
- Print `saved ...` / `skip (exists): ...` lines and watch for `ERR` / `goto err`.
- After each chunk, count files per folder and sanity-check against the expected matrix.

### 6. Testing
- Re-run any chunk that errored; because `shoot()` skips existing files, only the missing
  shots regenerate. This both tests resumability and completes partial runs.
- Spot-check a few PNGs are non-empty (e.g. `wc -c` or `file`).

### 7. Documentation
- Write `docs/moodboard/README.md` containing: purpose, capture methodology table,
  deviations-from-brief, folder structure, complete index, coverage matrix, and a
  "reproducing/extending" section with the invariants (theme seed at context level,
  auth cookie required, login-error needs no-auth context, idempotent re-runs).

### 8. Final verification
- Recount every folder; assert zero zero-byte files; assert zero URL-encoded filenames.
- Confirm `git status` shows **only** `docs/moodboard/` as new.
- Commit and push (see Git Tasks).

---

## Decision Rules

```
IF repo has both app/ and src/app/
THEN determine the deployed one from next.config/vercel.json; treat the other as stale.

IF tailwind darkMode == 'class' AND a localStorage theme key exists
THEN seed theme via add_init_script setting that key (+ the dark class) at context creation.

IF auth session strategy == 'jwt' AND cookies are httpOnly
THEN log in via UI, save storage_state, and reuse it for all protected captures;
     never attempt to fake the session with localStorage.

IF a briefed route returns 404 in the live app
THEN capture nothing for it and DOCUMENT the deviation in the README.

IF a route's basename is URL-encoded (contains +, |, %, spaces)
THEN assign a clean stable basename (e.g. customer-details) in the capture script.

IF the brief's naming uses hyphens
THEN use hyphens throughout (page-theme-device-state.png), even if it requires renaming
     previously captured underscore files.

IF capturing a login-error / validation state
THEN use a context WITHOUT the saved auth cookie, or the form renders the wrong panel.

IF a UI control has no matchable selector (aria-label/role/data-testid)
THEN attempt a few strategies, and if still unmatched, OMIT that shot and note it
     (do not ship a wrong/empty capture).

IF a page shows an empty state because there is no seed data
THEN capture it as-is and note "intentionally empty" in the README.

IF a single capture command would exceed the terminal timeout budget (~3 min)
THEN split into AREA chunks and rely on skip-existing for safe resumption.

IF a file already exists at the target path
THEN skip it (idempotent re-run).
```

---

## Best Practices

- **Always grep the theme key + tailwind darkMode before writing any seed code.** The exact
  key/value shape varies per app; guessing it wastes a whole run.
- **Save the logged-in `storage_state` once** to a JSON file and reuse it; re-login only if
  it expires.
- **Wait after navigation** (1.4–2.8s) to let webfonts, charts, and entry animations settle
  before screenshotting.
- **Use `full_page=True`** so tall pages (marketing, settings) are captured completely.
- **Keep one script, many areas.** A single `cap.py` with an `AREA` arg is easier to patch
  and re-run than many scripts.
- **Print a short log line per shot** (`saved` / `skip`) so you can watch progress and catch
  `ERR`/`goto err` in the command output.
- **Rename in bulk with a script, not by hand**, and verify counts before/after.
- **Document the *why* of every deviation** in the README — future readers will otherwise
  assume missing files are bugs.
- **Verify artifact integrity** (counts, zero-byte, encoded names) as a hard gate before commit.
- **Respect read-only scope**: add only the screenshot tree + README; nothing else.

---

## Common Pitfalls

1. **Stale `app/` directory.** Using the wrong app dir yields phantom routes. Always confirm
   the deployed tree.
2. **Theme seeded after load.** Setting localStorage after `goto` captures a flashed wrong
   theme. Seed at context creation via `add_init_script`.
3. **`browser.stop()` / `context.stop()` do not exist.** Use `context.close()`,
   `browser.close()`, `playwright.stop()`.
4. **`grant_permissions` is a *context* method, not a page method.** Calling it on `page`
   raises AttributeError.
5. **Forged auth via localStorage.** NextAuth JWT httpOnly cookies can't be set from JS; you
   must log in through the UI and persist `storage_state`.
6. **login-error captured with an active session.** The saved cookie makes `/login` render an
   "existing session" panel instead of the validation error. Use a fresh no-auth context.
7. **Raw URL-encoded basenames.** `/customers/+254...|KDA 001A` becomes
   `%2B254...%7CKDA%20001A-light-desktop.png` — ugly and brittle. Map to a clean name.
8. **Underscore vs hyphen drift.** Writing `dashboard_light_desktop.png` when the brief says
   `dashboard-light-desktop.png` forces a bulk rename later. Match the convention up front.
9. **Long captures killed by terminal timeout.** A 28-page × 2-theme mobile run exceeds a
   120s foreground budget. Chunk it; skip-existing makes re-runs safe.
10. **Zero-byte PNGs from interrupted runs.** Always count and size-check before declaring done.
11. **Selector guessing for components.** Sidebar-collapse and user-menu controls often lack
    matchable aria-labels; prefer `aria-label`/`role`/`data-testid` checks and omit if unmatched
    rather than shipping a wrong frame.
12. **Sandbox file-write quirks.** `write_file` can silently produce a 0-byte file and the
    terminal may reject heredocs containing `&`. Writing the deliverable via an in-process
    Python `open(...).write(...)` (e.g. via an execute/code tool) is the reliable fallback.

---

## Patterns

### Parametric chunked capture script
A single script driven by an `AREA` argument, with a skip-if-exists `shoot()` helper and a
`ctx_for()` that injects the theme seed at context creation.

```python
import sys, time, os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE  = "https://yourapp.example.com"
STATE = "/root/app_state.json"          # saved logged-in storage_state
ROOT  = Path("/root/app/docs/moodboard")

DARK  = 'localStorage.setItem("app-theme", JSON.stringify({state:{theme:"dark"}}));'
LIGHT = 'localStorage.setItem("app-theme", JSON.stringify({state:{theme:"light"}}));'

APP_PAGES = ["/dashboard", "/bookings", "/customers",
             "/customers/PHONE-BASED-SLUG"]   # will be renamed to customer-details
DEVICES = {"desktop": (1920,1080), "tablet": (834,1112), "mobile": (390,844)}
THEMES  = ["light", "dark"]

def log(*a): print(*a, flush=True)
def j(*parts): return "-".join(str(p) for p in parts if p is not None)

def shoot(page, folder, name, full=True, wait=1.4):
    p = ROOT/folder/(name+".png")
    if p.exists():
        log("  skip (exists):", p.name); return
    p.parent.mkdir(parents=True, exist_ok=True)
    try:
        page.screenshot(path=str(p), full_page=full); log(f"  saved {folder}/{name}.png")
    except Exception as e:
        log("  ERR", name, repr(e))

def ctx_for(b, area, theme, dname):
    w,h = DEVICES[dname]
    seed = DARK if theme=="dark" else LIGHT
    if area in ("app","states","components"):
        c = b.new_context(viewport={"width":w,"height":h}, storage_state=STATE)
    else:
        c = b.new_context(viewport={"width":w,"height":h}, is_mobile=(dname=="mobile"))
    c.add_init_script(seed)          # theme seed at CONTEXT level, before any page
    return c

def capture_app(area):
    for theme in THEMES:
        pw = sync_playwright().start(); b = pw.chromium.launch()
        c = ctx_for(b, "app", theme, "desktop"); pg = c.new_page()
        for r in APP_PAGES:
            try: pg.goto(BASE+r, timeout=30000); time.sleep(2.4)
            except Exception as e: log("  goto err", r, repr(e)); continue
            base = "customer-details" if "PHONE-BASED-SLUG" in r else (os.path.basename(r.rstrip("/")) or "dashboard")
            shoot(pg, "dashboard", j(base, theme, "desktop"))
        c.close(); b.close(); pw.stop()
    log("DONE: app")

AREA = sys.argv[1] if len(sys.argv)>1 else "app"
if AREA=="app": capture_app("app")
# ...elif AREA in ("market","auth","consumer","app_mobile","states","components"): ...
```

### No-auth context for error states
```python
# login-error MUST run without the saved cookie:
c2 = ctx_for(b, "auth", theme, "desktop")   # note: uses no storage_state branch
pg2 = c2.new_page(); pg2.goto(BASE+"/login", timeout=30000); time.sleep(2.2)
pg2.fill("#email","bad@bad.com"); pg2.fill("#password","wrongpass")
pg2.click("button[type=submit]"); time.sleep(2.8)
shoot(pg2, "states", j("login-error", theme))
```

### Component popover capture
```python
pg.goto(BASE+"/dashboard"); time.sleep(3.0)
shoot(pg, "components", j("header", theme))
pg.keyboard.press("Control+k"); time.sleep(1.3)
shoot(pg, "components", j("command-palette", theme)); pg.keyboard.press("Escape")
# bell / user-menu similarly; Escape between each
```

### Idempotent resume
Because `shoot()` skips existing files, a re-run of any `AREA` only captures what is missing —
this is how partial/timeout-killed runs are completed safely.

---

## Examples

**Example 1 — Discover then capture.** You are asked for a moodboard of `caspahub`. You clone
the repo, find `src/app/` is deployed (root `app/` is stale), grep and learn the theme key is
`caspahub-theme` with shape `{state:{theme:"dark"}}` plus a `dark` class on `<html>`, read
`auth.ts` and see NextAuth JWT httpOnly cookies, and read `middleware.ts` showing `/dashboard`
is protected. You log in via UI, save `caspahub_state.json`, then run `python3 cap.py market`,
`auth`, `app`, `app_mobile`, `consumer`, `states`, `components` in turn. Discovery also reveals
`/reports`, `/services`, `/memberships`, `/ai` 404 in the live app and `/fleet` is labeled
"Vehicles" — you capture none of the 404s and rename fleet accordingly, documenting both in the
README.

**Example 2 — Fixing a naming drift.** Mid-run you notice files are `dashboard_light_desktop.png`
but the brief specifies hyphens. You change `j()` to join with `"-"` and map the encoded customer
route to `customer-details`, delete the underscore/encoded files, and re-run `app` + `app_mobile`;
`shoot()` skips the already-correct files and only regenerates the renamed ones.

**Example 3 — Surviving a timeout.** `app_mobile` (28 pages × 2 themes) is cut at 120s. You remove
the two URL-encoded mobile files, patch `capture_app_mobile` to use the clean name, and re-run;
only the 2 missing `customer-details-*-mobile.png` are produced. Final count: 170 PNGs, 0 zero-byte,
0 encoded names.

---

## Validation Checklist

Before considering the work complete, confirm ALL of the following:

- [ ] Deployed app directory confirmed (not the stale one).
- [ ] Theme mechanism identified (exact localStorage key + value shape + DOM effect).
- [ ] Auth model identified; session cookie persisted and reused for protected captures.
- [ ] Route list derived from the real tree + in-app nav (not guessed).
- [ ] Login-error captured in a **no-auth** context.
- [ ] Theme seed injected via `add_init_script` at context creation (not after load).
- [ ] All PNGs non-zero bytes (`find . -name '*.png' -size 0` returns nothing).
- [ ] No URL-encoded filenames remain (`find . -name '*%2B*' -o -name '*%7C*'` returns nothing).
- [ ] Naming convention matches the brief (hyphens vs underscores) exactly.
- [ ] Per-folder file counts match the planned matrix.
- [ ] Deviations from the brief documented in README (404 routes, renamed pages, empty states,
      non-collapsible sidebar, unmatchable controls).
- [ ] README.md written with methodology, index, coverage matrix, and reproduce section.
- [ ] `git status` shows ONLY `docs/moodboard/` as new (no app source changes).
- [ ] Commit created and pushed; remote confirms the new ref.

---

## Notes

- **App-specific facts are examples, not rules.** The `caspahub-theme` key, `autogleam-westlands`
  branch slug, and phone-based customer ID are CaspaHub specifics. The *transferable* knowledge is
  the discovery-and-capture method, not those literals.
- **The deliverable is intentionally a snapshot.** With no seed data, list pages show empty states;
  repeated captures will keep showing empties until the app is populated. State this in the README.
- **Tooling reliability in sandboxes:** prefer an in-process Python write for the final README to
  avoid `write_file` 0-byte and terminal heredoc `&` issues. Playwright's `import` may emit a benign
  attribute warning while still succeeding — verify with a real navigation, not the warning.
- **Reuse over rebuild:** a single parametric `cap.py` with `AREA` chunks and a skip-existing helper
  outperformed one-shot or many-file approaches because it is patchable and resumable.
- **Honesty over completeness:** when a briefed section does not exist in the live app, document the
  gap rather than fabricating a capture. A moodboard that silently omits real gaps is worse than one
  that names them.
