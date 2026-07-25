# Search Experience — Extracted Observations (verified live DOM, 2026-07-25)

## Mechanism
- Header search box ("Search for Medication & Products.") + homepage search module
  ("What Are You Looking For?" with trending chips).
- Query param drives results: /products?search=<term> (e.g. ?search=paracetamol).
- There is NO dedicated search-results template — search reuses the Product Listing
  Page (PLP) with the filter sidebar + grid pre-filtered by the query.

## Search results (paracetamol)
- Renders PLP shell with Category/Brand/Price/Discounts filters + SORT/SHOW controls.
- Grid shows matching products (truncated in snapshot; product cards appear below fold).
- Same 4-col card pattern as catalogue.

## No-results state (zzzqxynonexistentterm)
- Renders the SAME PLP shell (filters + controls) with an empty/zero grid.
- No dedicated "no results" illustration template observed; the empty grid is the state.

## Sorted / filtered search
- SORT dropdown (Recommended, Popularity, Price Low→High, Price High→Low, Offers, New
  Products) = sorted search.
- Filter sidebar (Category/Brand/Price/Discounts) = filtered search.
- Autocomplete: the homepage search shows trending chips but live type-ahead was not
  captured (pending; see cap.py run on a capable browser).

## Note
- Live autocomplete/type-ahead and the exact no-results message text are PENDING a
  capable-browser capture (Option C). The auth-gated cart/checkout is the harder gap.
