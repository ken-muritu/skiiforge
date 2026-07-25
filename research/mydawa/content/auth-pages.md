# Authentication Pages — Extracted Content (verified live DOM, 2026-07-25)

## Login  (/login)  Title: "Sign in | MYDAWA"
- H1 "Sign in to MYDAWA".
- Copy: "Enter your mobile number — we'll send a verification code by SMS."
- Country selector (default Kenya +254) + mobile number field (placeholder "712 345 678").
- Button "Send code" -> triggers SMS OTP.
- "New here? Create an account" link.
- Legal: "By continuing you agree to our Terms and Privacy Policy."
- NO password field, NO visible CAPTCHA. Auth = phone + SMS OTP only.

## Register (/register)  Title: "Create your account | MYDAWA"
- H1 "Create your MYDAWA account".
- Copy: "Enter your mobile number to get started — we'll send a verification code by SMS."
- Same country+mobile+Send code form. "Already have an account? Sign in" link.
- Effectively identical OTP entry to login (no separate credential capture).

## Cart/Checkout gate (CRITICAL finding)
- Direct visit to /mycart REDIRECTS to /login?ReturnUrl=%2Fmycart.
- => The entire cart + checkout journey is AUTH-GATED behind OTP login.
- To capture a populated cart / checkout steps, the agent must log in as the user
  (kenhopkins001@gmail.com) via the OTP flow, with the user supplying the SMS code.
- No real order may be placed. Boundary respected in this archive.
