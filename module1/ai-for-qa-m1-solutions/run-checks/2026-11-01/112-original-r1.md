I don't know the details of your checkout yet, so these test cases are for a typical e-commerce checkout: cart summary, shipping, payment, promo codes and order confirmation. Remove anything that doesn't apply to you, and tell me about your setup if you want them tailored (see the end).

## 1. Cart and order summary

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| CS-01 | Items show correctly | Add 2 different products, go to checkout | Each item shows its name, variant (size/color), quantity, unit price and line total |
| CS-02 | Change quantity | Raise one item's quantity from 1 to 3 | Line total, subtotal, tax and grand total all update right away |
| CS-03 | Remove item | Remove one of two items | Item disappears and totals recalculate |
| CS-04 | Remove last item | Remove every item | Empty-cart message appears and checkout is blocked or you're sent back to the cart |
| CS-05 | Quantity limits | Enter 0, a negative number, a decimal, or more than the stock on hand | Input is rejected or corrected, with a clear message |
| CS-06 | Out of stock during checkout | Another session buys the last unit before you place your order | You get a clear stock error and no charge happens |
| CS-07 | Price changes mid-session | Change the product price in the admin while the shopper is in checkout | The shopper is told about the new price before paying |

## 2. Shipping address

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SA-01 | Valid address | Fill in every required field with valid data | Form is accepted and shipping options load |
| SA-02 | Required fields left empty | Submit with each required field blank, one at a time | An error message appears next to each empty field |
| SA-03 | Postal code format | Enter postal codes in the wrong format for the selected country | Validation error appears |
| SA-04 | Change country | Switch the country | State/province and postal code fields, and the shipping options, update to match |
| SA-05 | Special characters | Enter names like O'Brien, José or Zoë, and an apartment number like "#4B" | Accepted and stored correctly |
| SA-06 | Maximum length | Enter text longer than each field's limit | Text is cut off or rejected without breaking the page |
| SA-07 | Saved addresses | As a logged-in user with saved addresses, select one | Fields fill in correctly and the address can be edited |
| SA-08 | Undeliverable region | Enter a country or region you don't ship to | A clear "we don't ship here" message appears and checkout is blocked |
| SA-09 | Billing same as shipping | Tick the box, then untick it | The billing form hides and shows correctly, and the right address is submitted |

## 3. Shipping method

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SM-01 | Options appear | Enter a valid address | Available methods show with their prices and delivery estimates |
| SM-02 | Change method | Switch from standard to express | Shipping cost and grand total update |
| SM-03 | Free-shipping threshold | Put the subtotal just under the threshold, then just over it | Free shipping applies only once the threshold is reached |
| SM-04 | Pickup option | Choose in-store pickup (if offered) | Address fields become optional or hide, and shipping cost is 0 |

## 4. Promo codes and gift cards

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PC-01 | Valid code | Apply a working code | Discount shows as its own line and the total drops |
| PC-02 | Invalid code | Apply a code that doesn't exist | "Invalid code" message appears and the total stays the same |
| PC-03 | Expired code | Apply an expired code | A message says the code has expired |
| PC-04 | Minimum spend not met | Apply a code that needs a minimum spend while under it | The message explains the requirement |
| PC-05 | Case and spaces | Enter "save10 " for the code SAVE10 | The code applies (if your policy allows this) |
| PC-06 | Stacking | Apply two codes | Stacking follows your rules: either both apply or the second is rejected with a message |
| PC-07 | Remove code | Remove a code you applied | The discount comes off and the total goes back up |
| PC-08 | Discount larger than order | Apply a discount bigger than the subtotal | The total doesn't go below 0 |
| PC-09 | Gift card partial balance | Pay with a gift card that covers only part of the order | The remaining amount is charged to a second payment method |

## 5. Payment

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PY-01 | Successful card payment | Use a valid test card | Payment goes through and you reach the confirmation page |
| PY-02 | Declined card | Use your gateway's test card for a decline | A friendly decline message appears, no order is created, and you can try again |
| PY-03 | Insufficient funds | Use the test card for insufficient funds | A specific error appears and no order is created |
| PY-04 | Expired card | Enter a past expiry date | Validation error appears before submitting |
| PY-05 | Invalid card number | Enter a number that fails the Luhn check | An inline error appears |
| PY-06 | Wrong CVV | Use the test card for a CVV failure | The payment is declined with a clear message |
| PY-07 | 3-D Secure, passed | Use a 3DS test card and complete the challenge | The order completes |
| PY-08 | 3-D Secure, failed or cancelled | Fail or close the 3DS challenge | You go back to payment, no order is created, and no charge happens |
| PY-09 | Other payment methods | Pay with PayPal, Apple Pay, Google Pay, etc. | Each one completes and returns you to confirmation |
| PY-10 | Cancel on an external provider | Start a PayPal payment, then cancel it | You return to checkout with your cart unchanged |
| PY-11 | Card type detection | Enter Visa, Mastercard and Amex numbers | The right card logo and CVV length (3 or 4 digits) appear |

## 6. Placing the order

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| PO-01 | Double-click Place Order | Click the button twice quickly | Only one order and one charge happen, and the button disables after the first click |
| PO-02 | Refresh during processing | Refresh the page while payment is processing | No duplicate order or charge happens |
| PO-03 | Browser back after ordering | Press Back from the confirmation page | You can't resubmit, and the cart is empty |
| PO-04 | Network loss | Cut the connection while the order is submitting | A clear error appears, and the final state (ordered or not) is consistent and shown to the shopper |
| PO-05 | Session timeout | Stay idle past the session timeout, then submit | You're asked to log in again or refresh, and the cart is kept |
| PO-06 | Terms checkbox | Submit without accepting the terms (if required) | Order is blocked and the checkbox is highlighted |

## 7. Confirmation

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| CF-01 | Confirmation page | Place an order successfully | Page shows the order number, items, totals, address and delivery estimate |
| CF-02 | Confirmation email | Place an order | The email arrives promptly and its details match the order |
| CF-03 | Order in account | Log in and open order history | The new order appears with the right status |
| CF-04 | Stock decreases | Check stock levels after ordering | Stock goes down by the quantity ordered |

## 8. Totals and tax

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| TX-01 | Tax by location | Use addresses in places with different tax rates | Tax is calculated correctly for each |
| TX-02 | Rounding | Use prices like $0.333 x 3, or mixed tax rates | Totals round correctly and every displayed line adds up to the grand total |
| TX-03 | Currency | Switch currency or region (if supported) | Symbols, decimals and conversion are correct, and the amount charged matches the amount shown |
| TX-04 | Displayed total matches charge | Compare the final total with the amount the gateway records | They match exactly |

## 9. Guest vs. logged-in users

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| GU-01 | Guest checkout | Check out without an account | The order completes and a confirmation email is sent |
| GU-02 | Log in during checkout | Start as a guest, then log in partway through | The cart merges and nothing is lost or duplicated |
| GU-03 | Create account after ordering | Choose to create an account on the confirmation page | The account is created and the order is linked to it |
| GU-04 | Invalid guest email | Enter "user@", "user.com", etc. | Validation error appears |

## 10. Security

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| SE-01 | HTTPS | Load the checkout | The whole page is served over HTTPS with no mixed-content warnings |
| SE-02 | Card data handling | Inspect network requests, logs and storage | No full card number or CVV is stored or logged (tokenized or hosted fields only) |
| SE-03 | Price tampering | Edit the price or total in the request with dev tools or a proxy | The server recalculates and ignores values sent from the client |
| SE-04 | XSS | Enter `<script>alert(1)</script>` in the name and address fields | The input is escaped wherever it's shown (page, email, admin) |
| SE-05 | SQL injection | Enter `' OR 1=1--` in the fields and the promo code box | The input is handled safely with no errors or data leaks |
| SE-06 | Another user's order | Change the order ID in the confirmation URL | Access is denied |
| SE-07 | Promo code brute force | Submit many promo codes quickly | Rate limiting or CAPTCHA kicks in |

## 11. Usability, accessibility and compatibility

| ID | Test case | Steps | Expected result |
|---|---|---|---|
| UX-01 | Mobile layout | Check out on a small phone screen | No horizontal scrolling, tap targets are big enough, and the right keyboards appear (numeric for card fields) |
| UX-02 | Browsers | Run the full flow in Chrome, Safari, Firefox and Edge | Works the same in every browser |
| UX-03 | Keyboard only | Complete checkout using only the keyboard | Every control can be reached, tab order is logical, and focus is visible |
| UX-04 | Screen reader | Use VoiceOver or NVDA | Fields have labels and errors are announced |
| UX-05 | Autofill | Use the browser's address and card autofill | Fields fill in correctly (`autocomplete` attributes are set) |
| UX-06 | Error recovery | Trigger a validation error | Data already entered stays in place, and focus moves to the first error |
| UX-07 | Load time | Load checkout on a throttled 3G connection | The page is usable within an acceptable time, and loading states are shown |

---

**Where to start:** If time is short, run these first: CS-01, SA-01, SM-01, PY-01, PY-02, PO-01, CF-01, TX-04 and SE-03. They cover the main path, failed payments, duplicate charges and price tampering.

To tailor these, tell me:
- Your payment gateway (Stripe, Adyen, Braintree, etc.), so I can list its exact test card numbers
- Whether it's a one-page or multi-step checkout
- Any features like subscriptions, digital goods, or multiple shipping addresses
- The format you need: Gherkin (Given/When/Then), a CSV for TestRail or Jira, or automated tests (Playwright, Cypress, Selenium)
