"""
MYDAWA visual archive — parametric Playwright capture script (Option C).

WHY THIS FILE EXISTS
--------------------
The sandbox that produced the first passes cannot reach mydawa.com directly
(egress is allow-listed to GitHub/npm/Cloudflare only; mydawa.com TLS is blocked
from the sandbox). The managed browser tool used for the desktop shots renders a
FIXED ~1512px viewport with no device emulation, so genuine mobile/tablet shots
could not be produced there.

This script is the TEXTBOOK method (see skills/webapp-screenshot-library/skill.md):
run it on ANY machine with unrestricted egress to mydawa.com + Playwright/Chromium
installed. It captures the full matrix:

    area x device x (state)  ->  screenshots/<area>/<page>-<device>.png

Devices: desktop 1920x1080, tablet 834x1112, mobile 390x844.
Idempotent: shoot() skips files already on disk, so re-runs safely resume.

USAGE
-----
    pip install playwright && playwright install chromium
    # optional: export MYDAWA_STATE=/path/login_storage_state.json  (gated areas)
    python3 cap.py all          # every AREA
    python3 cap.py market       # one AREA
    python3 cap.py checkout     # needs MYDAWA_STATE (logged-in storage_state)

Routes derived from the live 2026-07-25 crawl (926-link homepage graph, /brands
index, /products tree, section nav).
"""

import sys, time, os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE  = "https://mydawa.com"
ROOT  = Path(__file__).resolve().parent            # research/mydawa/
SHOTS = ROOT / "screenshots"
STATE = os.environ.get("MYDAWA_STATE")             # logged-in storage_state JSON

DEVICES = {"desktop": (1920, 1080), "tablet": (834, 1112), "mobile": (390, 844)}
GATED = {"checkout", "account"}
MOBILE_UA = ("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
              "AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1")

MARKETING = ["/", "/offer", "/flash-sale", "/products", "/brands"]
HEALTHCARE = ["/telehealth", "/ivtherapy", "/patatiba", "/prep", "/pep",
    "/sexualwellness", "/familyplanning", "/diabetes", "/hypertension",
    "/sicklecell", "/lupus", "/arthritis", "/health-center", "/mzimaprogram",
    "/vitamin-quiz", "/submit-a-prescription"]
CATEGORIES = ["beauty-and-skin-care", "dermatological-skincare", "family-planning",
    "femvive", "health-conditions", "iv-therapy", "medical-devices", "mum-and-baby",
    "new-on-mydawa", "offers", "pata-tiba-na-thao", "personal-care",
    "reproductive-health-and-sexual", "snacks-and-drinks", "supplements-and-nutrition"]
CONDITIONS = ["allergies-allergic-reactions", "anti-inflammatory-conditions",
    "bladder-and-urinary-health", "blood-and-circulation-health",
    "bone-joint-and-muscle-health", "brain-and-nerve-conditions", "cancer-care",
    "cold-and-flu", "dependence", "diabetes", "diagnostic-tests", "emergency-care",
    "eye-and-ear-conditions", "foot-conditons", "gastrointestinal-conditions",
    "heart-conditions", "hemorrhoidsvaricose-veins", "hypertension",
    "immunosuppressants", "infections", "insomnia", "liver-and-kidney-conditions",
    "malaria", "mens-health", "mental-health", "motion-sickness", "oral-conditions",
    "pain-and-inflammation", "pregnancy", "respiratory-conditions", "sickle-cell-disease",
    "skin-conditions", "thyroid-conditions", "vaccines", "weight-management",
    "wellness-check-ups", "wound-and-burn-care"]
INFO = ["/who-we-are", "/quality-statement", "/careers", "/terms-conditions",
    "/privacy-cookies", "/disclaimer", "/copyright", "/help-center/faq",
    "/contact-us", "/return-policy", "/pharmacovigilance", "/upload-shopping-list"]
SEARCH_STATES = ["/products?search=paracetamol", "/products?search=vitamin c",
    "/products?search=zzzqxynonexistentterm"]
PRODUCTS = ["/products/la-roche-posay-anthelios-fluid-uvmune-400-spf50-50ml",
    "/products/pep-tablets-90s", "/products/mariprist", "/products/cerave-foam-cleanser-236ml",
    "/products/postinor-2-tablets-2s", "/products/now-magnesium-glycinate-tablets-180s"]
CHECKOUT = ["/mycart", "/checkout"]
ACCOUNT = ["/account", "/account/orders", "/account/prescriptions"]

AREAS = {
    "market":   ("marketing", MARKETING, ("desktop", "tablet", "mobile")),
    "category": ("category",  [f"/products/{c}" for c in CATEGORIES], ("desktop",)),
    "condition":("condition", [f"/products/{c}" for c in CONDITIONS], ("desktop",)),
    "health":   ("healthcare", HEALTHCARE, ("desktop",)),
    "products": ("products",   PRODUCTS, ("desktop",)),
    "search":   ("search",     SEARCH_STATES, ("desktop", "mobile")),
    "info":     ("info",       INFO, ("desktop",)),
    "checkout": ("checkout",   CHECKOUT, ("desktop", "mobile")),
    "account":  ("account",    ACCOUNT, ("desktop", "mobile")),
}

def log(*a): print(*a, flush=True)
def j(*parts): return "-".join(str(p) for p in parts if p is not None)

def shoot(page, folder, name, full=True, wait=2.0):
    p = SHOTS / folder / f"{name}.png"
    if p.exists():
        log("  skip (exists):", p.name); return
    p.parent.mkdir(parents=True, exist_ok=True)
    try:
        page.screenshot(path=str(p), full_page=full)
        log(f"  saved {folder}/{name}.png")
    except Exception as e:
        log("  ERR", name, repr(e))

def ctx_for(b, area, dname):
    w, h = DEVICES[dname]
    is_mobile = (dname == "mobile")
    ua = MOBILE_UA if is_mobile else None
    if area in GATED and STATE and os.path.exists(STATE):
        return b.new_context(viewport={"width": w, "height": h},
                             storage_state=STATE, is_mobile=is_mobile, user_agent=ua)
    return b.new_context(viewport={"width": w, "height": h},
                         is_mobile=is_mobile, user_agent=ua)

def capture(area):
    label, routes, devs = AREAS[area]
    log(f"=== AREA: {area} ({len(routes)} routes x {len(devs)} devices) ===")
    if area in GATED and not (STATE and os.path.exists(STATE)):
        log(f"  SKIP {area}: MYDAWA_STATE unset/missing. Log in via UI, save "
            "storage_state JSON, export MYDAWA_STATE=/path/state.json, re-run.")
        return
    for dname in devs:
        pw = sync_playwright().start(); b = pw.chromium.launch()
        c = ctx_for(b, area, dname); pg = c.new_page()
        for r in routes:
            try:
                pg.goto(BASE + r, timeout=30000); time.sleep(wait)
                base = os.path.basename(r.rstrip("/")) or "index"
                base = base.replace("?", "-").replace("=", "-")
                shoot(pg, label, j(base, dname))
            except Exception as e:
                log("  goto err", r, repr(e)); continue
        c.close(); b.close(); pw.stop()
    log(f"DONE: {area}")

if __name__ == "__main__":
    want = sys.argv[1] if len(sys.argv) > 1 else "all"
    targets = list(AREAS.keys()) if want == "all" else [want]
    for a in targets:
        if a not in AREAS:
            log("unknown area:", a, "| choices:", ", ".join(AREAS)); break
        capture(a)
    log("ALL DONE")
