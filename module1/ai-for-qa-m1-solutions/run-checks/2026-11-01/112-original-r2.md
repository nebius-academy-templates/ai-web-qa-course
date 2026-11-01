I don't know the details of your checkout page yet, so these test cases are for a typical e-commerce checkout: cart review, shipping, payment, and order confirmation. If you share your page's fields, payment providers, or business rules, I can tailor them, or write them as Gherkin, a test-management CSV, or automated tests (Playwright, Cypress, Selenium).

---

## 1. Cart Summary

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| CS-01 | Cart items display correctly | Add 2+ items, go to checkout | Each item shows name, image, variant (size/color), quantity, unit price, and line total |
| CS-02 | Update quantity | Change an item's quantity from 1 to 3 | Line total and order total update right away |
| CS-03 | Remove item | Remove one item | Item disappears and totals recalculate |
| CS-04 | Remove last item | Remove every item | User sees an empty-cart message or is sent back to the cart, and checkout is blocked |
| CS-05 | Quantity above stock | Enter more than the available stock | Validation message appears and the quantity is capped or rejected |
| CS-06 | Invalid quantity | Enter 0, a negative number, a decimal, or letters | Input is rejected with a clear message |
| CS-07 | Item goes out of stock during checkout | Another session buys the last unit before you place the order | User is told before payment and can't buy the unavailable item |
| CS-08 | Price change during checkout | Admin changes the price while the user is in checkout | User is told about the new price before confirming |

## 2. Discounts and Promo Codes

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| PC-01 | Valid code | Apply a valid code | Discount is applied and shown as its own line |
| PC-02 | Invalid code | Enter a code that doesn't exist | Error says "Invalid code" and totals don't change |
| PC-03 | Expired code | Apply an expired code | Error says the code has expired |
| PC-04 | Minimum spend not met | Apply a code below its spend threshold | Error explains the minimum |
| PC-05 | Code case and spacing | Enter " save10 " for a code stored as "SAVE10" | Code is accepted, or rejected consistently with the business rules |
| PC-06 | Stacking codes | Apply a second code | Codes stack or are blocked, following the rules |
| PC-07 | Remove code | Remove an applied code | Discount is removed and totals go back |
| PC-08 | Single-use code reused | Use a one-time code on a second order | Code is rejected |
| PC-09 | Cart drops below threshold | Apply a code, then remove items so the cart falls under its minimum | Discount is removed or the user is warned |

## 3. Shipping Information

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| SH-01 | Valid address | Fill in all required fields correctly | User can continue to the next step |
| SH-02 | Required fields empty | Submit with required fields blank | Each missing field shows an inline error |
| SH-03 | Invalid ZIP or postal code | Enter "ABCDE" or "123" for a US ZIP | Format error appears |
| SH-04 | Invalid phone | Enter letters or too few digits | Validation error appears |
| SH-05 | Invalid email | Enter "user@" or "user.com" | Validation error appears |
| SH-06 | Unsupported country or region | Choose a destination you don't ship to | User sees that shipping isn't available there |
| SH-07 | Address autocomplete | Start typing an address | Suggestions appear and fill the fields correctly |
| SH-08 | Saved address (logged-in user) | Pick a saved address | Fields fill in automatically |
| SH-09 | Billing same as shipping | Tick "Same as shipping" | Billing fields are hidden or filled with the shipping address |
| SH-10 | Separate billing address | Untick it and enter a different address | Both addresses are saved and validated |
| SH-11 | Long and special-character input | Enter accented letters (José, Zürich), apostrophes (O'Brien), and the maximum field length | Input is accepted and displayed correctly |
| SH-12 | PO box or military address | Enter a PO box or APO/FPO address | Accepted or rejected per policy, with a clear message |

## 4. Shipping Method

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| SM-01 | Options shown | Enter a valid address | Available methods appear with cost and estimated delivery date |
| SM-02 | Change method | Switch from Standard to Express | Shipping cost and order total update |
| SM-03 | Free shipping threshold | Cart is above the free-shipping minimum | Free option is shown and applied |
| SM-04 | Just under the threshold | Cart is $0.01 below the minimum | Free shipping isn't offered, and a nudge like "Add $X more" may show |
| SM-05 | Options depend on address | Change to a remote or international address | Options and prices refresh |

## 5. Payment

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| PM-01 | Valid credit card | Enter a valid test card (e.g. Visa 4242 4242 4242 4242 in Stripe test mode) | Payment succeeds and the order is created |
| PM-02 | Declined card | Use your gateway's decline test card | Clear decline message, no order created, user can retry |
| PM-03 | Invalid card number | Enter a number that fails the Luhn check | Inline validation error |
| PM-04 | Expired card | Enter a past expiry date | Error appears |
| PM-05 | Invalid CVV | Enter a 2-digit CVV, or 3 digits for Amex | Validation error |
| PM-06 | Card type detection | Type the first digits of Visa, Mastercard, and Amex numbers | The matching card logo shows and the input format adjusts |
| PM-07 | 3D Secure / SCA | Use a 3DS test card | Authentication challenge appears, and success or failure is handled correctly |
| PM-08 | Insufficient funds | Use the insufficient-funds test card | Specific error, no order created |
| PM-09 | Alternative payment methods | Pay with PayPal, Apple Pay, Google Pay, etc. | Redirect or popup works and the order completes on return |
| PM-10 | Cancel external payment | Cancel inside the PayPal or wallet popup | User returns to checkout with the cart intact |
| PM-11 | Gift card or store credit | Apply a gift card, including partial balance plus card | Balance is deducted correctly |
| PM-12 | Saved card | A logged-in user selects a saved card | Payment works without re-entering details |
| PM-13 | Card data handling | Inspect the network traffic and page source | Card data goes only to the payment provider (tokenized), never to your server or logs |

## 6. Order Totals and Calculations

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| OT-01 | Total is correct | Mix items, a discount, shipping, and tax | Total = subtotal - discount + shipping + tax, correct to the cent |
| OT-02 | Tax by location | Change to addresses in different tax regions | Tax recalculates correctly |
| OT-03 | Tax-exempt items | Add exempt and taxable items together | Tax applies only to the taxable items |
| OT-04 | Rounding | Use prices that create fractional cents | Rounding is consistent and matches the amount charged |
| OT-05 | Currency display | Switch currency or locale, if supported | Symbol, decimal separator, and conversion are correct |
| OT-06 | Charged amount matches display | Place an order and check the gateway dashboard | Charged amount equals the total shown |

## 7. Order Placement and Confirmation

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| OC-01 | Successful order | Complete checkout | Confirmation page shows the order number, items, totals, and addresses |
| OC-02 | Confirmation email | Complete checkout | Email arrives with correct details |
| OC-03 | Double submission | Click "Place Order" quickly several times | Only one order and one charge |
| OC-04 | Refresh confirmation page | Refresh after the order is placed | No duplicate order, and the confirmation still shows or redirects safely |
| OC-05 | Browser back after order | Press Back from the confirmation page | No resubmission, and the cart is empty |
| OC-06 | Cart cleared | Finish an order, then open the cart | Cart is empty |
| OC-07 | Stock updated | Finish an order | Inventory goes down by the quantities bought |
| OC-08 | Order history | A logged-in user checks their account | The new order is listed |

## 8. User and Session

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| US-01 | Guest checkout | Check out without an account | Order completes, with an optional prompt to create an account |
| US-02 | Login during checkout | Log in partway through | Cart is kept and merged with any saved cart |
| US-03 | Session timeout | Stay idle past the session limit, then submit | User is warned or asked to log in again, without silent data loss or a double charge |
| US-04 | Multiple tabs | Change the cart in one tab while checking out in another | Checkout shows the current cart state |
| US-05 | Data survives navigation | Fill in shipping, leave the page, come back | Entered data is kept, or the behavior is acceptable per your requirements |

## 9. Error Handling and Resilience

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| ER-01 | Network drops on submit | Cut the connection when clicking "Place Order" | Clear error, no duplicate charge, safe to retry |
| ER-02 | Payment gateway timeout | Simulate a slow or failed gateway response | Friendly error, and the order and payment states stay consistent |
| ER-03 | Server error | Force a 500 from the order API | Generic error with no stack traces or sensitive data |
| ER-04 | Charged but order failed | Payment succeeds but order creation fails | System reconciles: the order is created later or the charge is refunded/voided automatically |

## 10. Security

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| SE-01 | HTTPS enforced | Open checkout over HTTP | Redirects to HTTPS |
| SE-02 | Price tampering | Change the price or total in the request with dev tools or a proxy | Server recalculates and ignores client-side prices |
| SE-03 | XSS in input fields | Enter `<script>alert(1)</script>` in the name or address fields | Input is escaped and nothing runs, including on the confirmation page and in emails |
| SE-04 | SQL injection | Enter `' OR 1=1--` in fields and the promo code | No errors or data leaks |
| SE-05 | Access to other orders | Change the order ID in the confirmation URL | Access denied for orders that aren't yours |
| SE-06 | CSRF protection | Submit the order from a different origin | Request is rejected |
| SE-07 | Promo code brute force | Submit many codes quickly | Rate limiting kicks in |

## 11. UI, Accessibility, and Compatibility

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| UI-01 | Responsive layout | Test on mobile, tablet, and desktop sizes | Layout works, nothing is cut off, buttons are easy to tap |
| UI-02 | Browsers | Test on Chrome, Firefox, Safari, and Edge | Behavior is the same everywhere |
| UI-03 | Keyboard only | Finish checkout with Tab, Enter, and Space only | Every field and button is reachable, with a visible focus indicator |
| UI-04 | Screen reader | Use NVDA, JAWS, or VoiceOver | Fields have labels and errors are announced |
| UI-05 | Error visibility | Trigger validation errors | Errors appear next to their fields, aren't shown by color alone, and focus moves to the first error |
| UI-06 | Mobile keyboards | Tap the phone, ZIP, and card fields on mobile | Numeric keypad appears where it should |
| UI-07 | Browser autofill | Use the browser's saved address and card autofill | Fields fill correctly |
| UI-08 | Loading states | Submit the order | Spinner or disabled button shows while processing |

## 12. Performance

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| PF-01 | Page load time | Load checkout on a typical connection | Loads within your target (e.g. under 3 seconds) |
| PF-02 | Concurrent checkouts | Load-test with many users at once | No errors, overselling, or slowdown beyond your limits |
| PF-03 | Large cart | Check out with 50+ items | Page stays responsive and totals are correct |

---

**Where to start:** If you're short on time, run these first, since they protect revenue and customer trust: PM-01, PM-02, OT-01, OT-06, OC-01, OC-03, SE-02, and ER-04.

Want me to change these for your setup? It would help to know:
- Your payment provider (Stripe, Braintree, Adyen, etc.)
- Single-page or multi-step checkout
- Whether guest checkout, subscriptions, or international shipping are in scope
- The format you need (spreadsheet, Jira/TestRail import, Gherkin, or automated test code)
