# Authenticated State & Account — Observations (verified live, 2026-07-25)

## Login achieved (with user consent + SMS OTP)
- Logged in as account "Kennedy" (email kenhopkins001@gmail.com, mobile +254 115594826)
  via the OTP flow (no password). Session is cookie-based.
- Authenticated header shows: "K Hello, Kennedy" and "Delivery to Kennedy Muritu"
  (a SAVED delivery address — a personalized element absent when logged out).

## Authenticated homepage differences vs logged-out
- Header replace "Sign In" with "K Hello, Kennedy" + saved delivery location.
- "Upload Prescription" remains active; personalized "Offers For You" module appears.
- Screenshot: account/authenticated-homepage.png.

## Cart (authenticated) — /mycart
- Title "Your Cart", breadcrumb Home > Cart.
- Checkout progress indicator: 3 steps — (1) Cart Summary [active], (2) Delivery
  Details, (3) Payment.
- Empty state: "Your Cart Is Empty" + "Start Shopping !" CTA + empty-bag illustration.
- Screenshot: checkout/cart-empty.png.
- NOTE: an "Add To Cart" click on a PDP did NOT persist into /mycart during the
  capture session (cart still showed empty). Populated-cart + Delivery/Payment steps
  are PENDING a re-run (add item, then capture cart + proceed to checkout, stopping
  before payment/order). See capture-status.md.

## Account area
- Account/menu entry: "K Hello, Kennedy" (header). The account dashboard, orders,
  and prescriptions pages were NOT captured (backend 502 outage during the authed
  session). Routes to attempt on resume: /account, /account/orders,
  /account/prescriptions, /my-health-centre/*.
