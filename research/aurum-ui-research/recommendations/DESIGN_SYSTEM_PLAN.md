# DESIGN_SYSTEM_PLAN — the token spec to ship

> Mirror of AURUM_UI_GUIDE.md `:root`, expanded with rationale.

## Color (keep dark identity, refine)
```
--bg:#0B0D12; --surface-1:#10131A; --surface-2:#161E22; --surface-3:#232833;
--border:#2F3644; --text:#E8EBF0; --text-muted:#9AA3B2;
--gold:#E9C46A; --gold-soft:rgba(233,196,106,.12); --mint:#7FE7C4;
--danger:#FF6B6B; --success:#5BD98C; --warning:#FFB454;
```
Rationale: keep Aurum's gold/mint brand; ADD danger/success (missing).

## Type (load, don't fallback)
```
--font-sans:"Satoshi","General Sans",system-ui,sans-serif;
--font-serif:"Fraunces","Playfair Display",Georgia,serif;
--fs-hero:clamp(40px,7vw,88px); --fs-h1:56px/600/-0.02em;
--fs-h2:32px/600; --fs-h3:20px/600; --fs-body:16px/1.55; --fs-small:13px;
```
Rationale: Fraunces (warm editorial, Wispr-like) for display; Satoshi
for UI. Replaces Times New Roman + system stack.

## Spacing (8px base)
```
--sp-1:8; --sp-2:16; --sp-3:24; --sp-4:32; --sp-5:48; --sp-6:64; --container:1200px;
```

## Radius
```
--r-sm:8; --r-md:12; --r-lg:16; --r-pill:999;
```

## Elevation
```
--shadow-1:0 1px 2px rgba(0,0,0,.4);
--shadow-2:0 8px 24px rgba(0,0,0,.45);
--shadow-gold:0 8px 24px rgba(233,196,106,.18);
```

## Motion
```
--ease:cubic-bezier(.4,0,.2,1); --t-fast:140ms; --t-med:220ms; --t-slow:360ms;
@media (prefers-reduced-motion:reduce){ *{transition:none!important} }
```

## Component rules
- Button: --r-pill, --shadow-gold on hover, `translateY(-1px) scale(1.01)`,
  active `scale(.98)`.
- Card: --surface-1, --r-lg, --shadow-1, hover --shadow-2 + border brighten.
- Icon: Lucide, 20-24px, currentColor, stroke 1.75.
- Input: --r-md, padding --sp-2, error border --danger + message.
- NavBar: sticky, backdrop-blur, border-bottom on scroll.
