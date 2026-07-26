# QUICK_WINS — do these first (each LOW effort, high visible lift)

1. **Icons: emoji -> Lucide** [design-systems/aurum.md #9]
   - Remove Target/Check/Pencil unicode from feature cards + nav.
   - Add `lucide-react`; use `<Target/> <CheckCircle/> <Pencil/> <Sparkles/>`.
   - Effort: ~1hr. Affects: home, dashboard, mastery builder, every card.

2. **Load a real type system** [design-systems/aurum.md typography]
   - Add Fraunces (display serif) + Satoshi/General Sans (sans) via `next/font`.
   - Replace Times New Roman logo + system-ui stack.
   - Effort: ~1hr. Affects: logo + all headlines/body.

3. **Sticky header** [components.md #1]
   - `position: sticky; top:0; backdrop-blur` + border-on-scroll in NavBar.
   - Effort: ~30min. Affects: all pages.

4. **Card/button elevation + hover** [motion.md, DESIGN_GUIDE.md]
   - Add `--shadow-1/2`; hover lift (`translateY(-2px)`), button press-scale.
   - Effort: ~1hr. Affects: cards, buttons, app surfaces.

5. **Semantic color tokens** [design-systems/aurum.md colors]
   - Add `--danger/--success/--warning` + use in form errors/toasts.
   - Effort: ~30min.

6. **prefers-reduced-motion** [accessibility.md]
   - Wrap transitions; disable on reduced-motion.
   - Effort: ~15min.

7. **Capture gated app UI** [manifest]
   - Log in, screenshot /dashboard /masteries/[id] /generate with data.
   - Effort: ~30min (needs credentials). Unblocks the whole app audit.

Total quick-win effort: ~5-6 hrs. Lifts Aurum from "unshipped" to
"premium SaaS" on the SCORECARD (iconography 1->5, type 2->4, nav 1->4).
