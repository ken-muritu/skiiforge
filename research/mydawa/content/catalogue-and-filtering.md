# Catalogue & Filtering — Extracted Observations (verified, 2026-07-25)

## Catalogue scale
- /products reports "Showing 20 of 13,213 products" (full catalogue).
- /brands index exposes 6,500+ brand entries (A–Z).

## Catalogue root (/products)
- Left filter sidebar (collapsible): Category (expanded, 150+ checkboxes), Brand, Price, Discounts.
- Top controls: SORT (Recommended, Popularity, Price Low→High, Price High→Low, Offers, New Products); SHOW per page (20/40/80/100); grid/list view toggle.
- 4-column product grid, 20 cards/page. Card: image + name + KES price + "Add To Cart" + wishlist heart.

## Shop by Category / Condition behavior
- Clicking the nav item navigates to a filtered listing page (NOT a hover dropdown). The category checkboxes filter the grid live.
- Same filter sidebar appears on condition/brand pages.

## Shop by Brand (/brands, /brand/<slug>)
- A–Z brand index with live "Search brands..." filter and letter rail; 5-column grid.
- Individual brand pages list that brand's products (same PLP pattern).

## Offers & Flash Sales
- /offer, /flash-sale, /products/offers host promo pages.
- Homepage "BLOOM FLASH SALES" carousel with live countdown + "View All".
- Brand-day promos: cerave, garnier, loreal, maybelline, nice-lovely (from URL inventory).
- "400 KES OFF" shopping-list voucher promo on homepage.

## Sort / Filtered / Sorted search (spec Part 4 mapping)
- SORT dropdown = "sorted search".
- Filter sidebar (Category/Brand/Price/Discounts) = "filtered search".
- Dedicated search box + homepage search module = query search (autocomplete / no-results states pending capture).
