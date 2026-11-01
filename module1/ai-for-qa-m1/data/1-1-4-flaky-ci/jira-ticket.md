# TS-418: Show live item count badge on the cart icon

**Type:** Story  **Priority:** Medium  **Component:** Storefront / Header
**Reporter:** Priya Nair (Product)  **Assignee:** Tom Whitfield  **Sprint:** TechShop 24.7
**Environment:** Chromium (latest) on Ubuntu CI runners; staging `https://staging.techshop-demo.com`

## Summary

Shoppers cannot tell at a glance whether an item was added to their cart. Add a small
badge to the cart icon in the site header that shows the current number of items and
updates when a product is added.

## Description

When a shopper clicks **Add to Cart** on a product page, the header cart icon should
reflect the new total without a page reload. The badge is hidden while the cart is
empty and becomes visible with the count as soon as the first item is added. The count
is the total quantity of items, not the number of distinct products.

Cart state is held client side for this release. The product page script updates the
cart and then notifies the header, which re-renders the badge. The server is not
involved in the badge update.

## Acceptance criteria

1. With an empty cart the badge is not visible.
2. Clicking **Add to Cart** once on a product page makes the badge visible and show `1`.
3. Clicking it again for the same product changes the badge to `2`.
4. Adding a different product increases the badge by one.
5. The badge shows `9+` when the cart holds more than nine items.
6. The badge has an accessible name that includes the count (for example "Cart, 1 item").
7. The count survives navigation between product pages within the same session.

## Out of scope

- Removing items from the cart (TS-421).
- Persisting the cart across sessions (TS-433).

## Test notes

Automated coverage lives in `tests/cart/badge.spec.ts`. Test accounts and products are
synthetic and defined in the staging seed data.
