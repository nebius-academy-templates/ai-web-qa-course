Here's a set of test cases for a typical e-commerce checkout page. I've assumed a standard flow: cart review, shipping, delivery method, payment, then order confirmation. If you share your actual page, requirements, or tech stack, I can tailor these and drop the ones that don't apply.

## 1. Cart Summary

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| CS-01 | Cart items display correctly | Add 2+ items, go to checkout | Each item shows name, image, variant (size/color), quantity, unit price, line total |
| CS-02 | Quantity update recalculates totals | Change an item's quantity on checkout | Line total, subtotal, tax, and grand total update right away |
| CS-03 | Remove item | Remove one item | Item disappears, totals update; removing the last item redirects to the empty-cart state |
| CS-04 | Quantity above stock | Set quantity higher than available inventory | Clear error message; quantity is capped or blocked |
| CS-05 | Empty cart checkout | Go to the checkout URL with an empty cart | Redirect to cart with an "Your cart is empty" message |
| CS-06 | Price changed since add-to-cart | Change the product price in admin, then load checkout | User sees a notice and the updated price before paying |

## 2. Shipping Address

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SA-01 | Valid address submission | Fill in all required fields with valid data | Form accepts the address and moves on |
| SA-02 | Required fields left empty | Submit with each required field blank in turn | Inline error on each missing field; submission blocked |
| SA-03 | Invalid postal/ZIP code | Enter "ABCDE" or the wrong length for the country | Validation error shown |
| SA-04 | Invalid phone number | Enter letters or too few digits | Validation error shown |
| SA-05 | Country changes field rules | Switch the country (e.g., US to UK) | State/province and postal code fields and formats update |
| SA-06 | Saved address (logged-in user) | Log in with saved addresses | Saved addresses appear and can be picked; the default is preselected |
| SA-07 | Max length and special characters | Enter 255+ characters, accents (é, ñ), apostrophes (O'Brien) | Valid characters accepted; length limits enforced politely |
| SA-08 | Unsupported shipping region | Enter an address in a region you don't ship to | Clear message that shipping isn't available |
| SA-09 | Billing same as shipping | Tick "Billing same as shipping" | Billing fields hide or autofill; unticking shows empty billing fields |

## 3. Shipping / Delivery Method

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SM-01 | Options load for address | Enter a valid address | Available methods show with cost and estimated delivery date |
| SM-02 | Selecting a method updates total | Switch between Standard and Express | Shipping cost and grand total update |
| SM-03 | Free shipping threshold | Cart subtotal at, just below, and above the threshold | Free shipping applies only at or above the threshold |
| SM-04 | Address change refreshes options | Change the address after choosing a method | Methods and prices recalculate; an invalid choice is reset |

## 4. Promo Codes / Gift Cards

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PC-01 | Valid promo code | Apply a valid code | Discount line appears; total goes down by the right amount |
| PC-02 | Invalid code | Apply "FAKECODE" | "Invalid code" error; total unchanged |
| PC-03 | Expired code | Apply an expired code | "This code has expired" message |
| PC-04 | Minimum spend not met | Apply a code that needs a $50 minimum to a $30 cart | Message explains the requirement |
| PC-05 | Code stacking rules | Apply two codes | Behaves per business rules (second one replaces the first, or is rejected) |
| PC-06 | Remove applied code | Remove the code | Discount removed; total goes back up |
| PC-07 | Case and whitespace | Enter " save10 " for code SAVE10 | Code accepted (if case-insensitive and trimmed by design) |
| PC-08 | Gift card covers full total | Apply a gift card with a balance at or above the total | Total is $0; payment step is skipped or not required |
| PC-09 | Gift card partial balance | Apply a gift card with a balance below the total | Remaining balance due shown; second payment method required |

## 5. Payment

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PY-01 | Successful card payment | Use a valid test card | Payment is approved; user goes to confirmation |
| PY-02 | Declined card | Use a test card set to decline | Friendly decline message; user stays on the page with their data kept |
| PY-03 | Invalid card number | Enter a number that fails the Luhn check | Inline validation error |
| PY-04 | Expired card | Enter a past expiry date | Validation error |
| PY-05 | Invalid CVV | Enter 2 digits, or 3 for Amex | Validation error |
| PY-06 | Card type detection | Enter Visa, Mastercard, and Amex numbers | Correct card brand icon shows; CVV length adjusts |
| PY-07 | 3D Secure / SCA | Use a 3DS test card | Challenge appears; pass leads to success, fail leads to a clear error |
| PY-08 | Alternative payment methods | Pay with PayPal, Apple Pay, Google Pay, etc. | Redirect or modal works; order completes; cancelling returns to checkout |
| PY-09 | Payment gateway timeout | Simulate a gateway timeout or 500 error | Error shown; no order created; user isn't charged |
| PY-10 | Saved card (logged-in) | Use a saved payment method | Card is masked (•••• 4242); payment succeeds |

## 6. Order Placement and Confirmation

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| OC-01 | Order summary before placing | Review the final step | Items, address, shipping, discounts, tax, and total all match what was entered |
| OC-02 | Place order | Click "Place Order" | Confirmation page shows an order number and summary |
| OC-03 | Double-click prevention | Click "Place Order" quickly several times | Only one order and one charge; button disables while processing |
| OC-04 | Confirmation email | Complete an order | Email arrives with correct order details |
| OC-05 | Inventory decremented | Complete an order | Stock goes down by the quantity ordered |
| OC-06 | Cart cleared | Complete an order, then go back to the cart | Cart is empty |
| OC-07 | Refresh/back after order | Refresh the confirmation page or press Back | No duplicate order; no resubmission prompt that would charge again |
| OC-08 | Terms acceptance (if required) | Try to place an order without ticking T&C | Order blocked with a message |

## 7. Guest vs. Logged-in Users

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| GU-01 | Guest checkout | Check out without an account | Order completes; email is required |
| GU-02 | Login during checkout | Log in partway through | Cart is kept and merged with any saved cart; entered data isn't lost |
| GU-03 | Create account after order | Pick "Create account" on the confirmation page | Account is created and the order is linked to it |
| GU-04 | Session expiry | Leave checkout idle past the session timeout, then continue | Graceful handling: user is asked to log in again or the session is restored, with the cart kept |

## 8. Tax and Totals

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| TX-01 | Tax by location | Use addresses in different tax jurisdictions | Correct tax rate applied for each |
| TX-02 | Rounding | Use items priced to give fractional cents | Totals round correctly and consistently (line vs. order level) |
| TX-03 | Currency display | Switch currency or locale (if supported) | Symbols, decimal separators, and conversions are correct |
| TX-04 | Grand total accuracy | Combine items, discount, shipping, and tax | Grand total = subtotal − discounts + shipping + tax |

## 9. Security

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SE-01 | HTTPS enforced | Load checkout over HTTP | Redirects to HTTPS |
| SE-02 | Card data handling | Inspect network requests, logs, and storage | Full card number and CVV are never stored or logged; tokenized through the payment provider |
| SE-03 | Price tampering | Change the price or total in the request payload | Server recalculates and rejects or ignores the tampered values |
| SE-04 | XSS in input fields | Enter `<script>alert(1)</script>` in name/address | Input is escaped; no script runs anywhere (including admin and email) |
| SE-05 | Promo code brute force | Submit many invalid codes quickly | Rate limiting or CAPTCHA kicks in |
| SE-06 | Access another user's order | Change the order ID in the confirmation URL | Access denied |

## 10. Usability, Accessibility, and Compatibility

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| UX-01 | Mobile responsiveness | Check out on phone and tablet sizes | Layout works; no horizontal scroll; tap targets are big enough |
| UX-02 | Browser compatibility | Test on Chrome, Safari, Firefox, Edge | Works the same in each |
| UX-03 | Keyboard navigation | Complete checkout using only the keyboard | All fields and buttons are reachable in a logical tab order with visible focus |
| UX-04 | Screen reader | Use VoiceOver or NVDA | Fields have labels; errors are announced |
| UX-05 | Browser autofill | Use the browser's saved address and card autofill | Fields fill correctly |
| UX-06 | Data persistence on error | Trigger a validation error after filling the form | Entered data is kept (except sensitive fields like CVV) |
| UX-07 | Loading states | Throttle the network to slow 3G | Spinners or disabled states show; no frozen-looking UI |

## 11. Performance and Edge Cases

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PE-01 | Page load time | Measure checkout load | Meets your target (e.g., under 2–3 seconds) |
| PE-02 | Large cart | Check out with 50+ line items | Page stays responsive; totals are correct |
| PE-03 | Concurrent last-item purchase | Two users buy the last unit at the same moment | Only one order succeeds; the other gets an out-of-stock message and no charge |
| PE-04 | Multiple tabs | Change the cart in one tab while checking out in another | Checkout picks up the change or flags the mismatch before payment |
| PE-05 | Network drop at submit | Cut the connection right after clicking "Place Order" | No duplicate charge; order status can be recovered (idempotent submission) |

---

**Priority tip:** if time is short, start with the happy path (PY-01, OC-02), payment failures (PY-02, PY-09), double-submit (OC-03), totals accuracy (TX-04), and price tampering (SE-03). Those are the ones most likely to cost money or customers.

Would you like any of these turned into another format, like Gherkin (Given/When/Then), a spreadsheet layout, or automated test code (Cypress, Playwright, Selenium)? I can also adjust them if your checkout has specific features such as subscriptions, international shipping, or B2B invoicing.
