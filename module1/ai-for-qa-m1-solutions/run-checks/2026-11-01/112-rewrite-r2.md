These test cases cover the TechShop guest checkout flow. Every case starts from the same precondition: a guest user (not logged in) with at least one item in the cart, on the checkout page. Unless a case says otherwise, all other fields hold valid data. For example: email `guest@example.com`, card `4111 1111 1111 1111`, a future expiry, CVV `123`, postcode `SW1A 1AA`.

### Happy path

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-01 | Guest completes checkout with all valid data | 1. Enter a valid email. 2. Enter card `4111111111111111`, a future expiry, CVV `123`. 3. Enter postcode `SW1A 1AA`. 4. Submit. | Payment succeeds and the order confirmation is shown. No validation errors. |
| GC-02 | Guest checks out with a different valid card number | Same as GC-01, using card `5555555555554444`. | Payment succeeds and the order confirmation is shown. |

### Email

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-03 | Email left blank | Leave email empty and submit. | Validation error saying email is required. The order is not submitted. |
| GC-04 | Email missing "@" | Enter `guest.example.com` and submit. | Invalid email format error. The order is not submitted. |
| GC-05 | Email missing domain | Enter `guest@` and submit. | Invalid email format error. The order is not submitted. |
| GC-06 | Email missing local part | Enter `@example.com` and submit. | Invalid email format error. The order is not submitted. |
| GC-07 | Email with spaces | Enter `guest @example.com` and submit. | Invalid email format error. The order is not submitted. |

### Card number

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-08 | Positive: 16 digits that pass Luhn | Enter `4111111111111111` and submit. | Card number is accepted. |
| GC-09 | Negative: 16 digits that fail Luhn | Enter `4111111111111112` and submit. | Invalid card number error. The order is not submitted. |
| GC-10 | Boundary: 15 digits (one below the limit) | Enter `411111111111111` and submit. | Invalid card number error. The order is not submitted. |
| GC-11 | Boundary: 17 digits (one above the limit) | Try to enter `41111111111111111` and submit. | Either the field blocks the 17th digit or an invalid card number error appears. A 17-digit value is never accepted. |
| GC-12 | Negative: card number left blank | Leave card number empty and submit. | Required-field error. The order is not submitted. |
| GC-13 | Negative: letters in card number | Enter `4111ABCD11111111` and submit. | Invalid card number error, or the letters are blocked as you type. The order is not submitted. |
| GC-14 | Negative: special characters in card number | Enter `4111-1111-1111-111!` and submit. | Invalid card number error. The order is not submitted. |
| GC-15 | Negative: valid card that gets declined | Enter a card that the test payment environment is set up to decline, with all other fields valid, and submit. | The message "Your card was declined" is shown. The cart contents and quantities are unchanged and no order is created. |
| GC-16 | Declined card, then retry with a valid card | Do GC-15, then change the card to `4111111111111111` and submit. | Payment succeeds and the order contains the original cart items. |

### Expiry date

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-17 | Positive: expiry in a future year | Enter a date one year ahead, e.g. `11/27`, and submit. | Expiry is accepted. |
| GC-18 | Boundary: current month and year | Enter this month's MM/YY and submit. | Expiry is accepted, because it is not in the past. |
| GC-19 | Boundary: previous month | Enter last month's MM/YY and submit. | Expired card error. The order is not submitted. |
| GC-20 | Boundary: month `01` | Enter `01` with a future year and submit. | Expiry is accepted. |
| GC-21 | Boundary: month `12` | Enter `12` with a future year and submit. | Expiry is accepted. |
| GC-22 | Boundary: month `00` | Enter `00/28` and submit. | Invalid expiry error. The order is not submitted. |
| GC-23 | Boundary: month `13` | Enter `13/28` and submit. | Invalid expiry error. The order is not submitted. |
| GC-24 | Negative: wrong format (4-digit year) | Enter `11/2027` and submit. | Invalid format error, or the input is limited to MM/YY. A 4-digit year is not accepted as typed. |
| GC-25 | Negative: wrong format (single-digit month) | Enter `1/28` and submit. | Invalid format error. The order is not submitted. |
| GC-26 | Negative: expiry left blank | Leave expiry empty and submit. | Required-field error. The order is not submitted. |

### CVV

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-27 | Positive: 3 digits | Enter `123` and submit. | CVV is accepted. |
| GC-28 | Boundary: 2 digits | Enter `12` and submit. | Invalid CVV error. The order is not submitted. |
| GC-29 | Boundary: 4 digits | Try to enter `1234` and submit. | Either the field blocks the 4th digit or an invalid CVV error appears. A 4-digit value is never accepted. |
| GC-30 | Negative: letters in CVV | Enter `12A` and submit. | Invalid CVV error. The order is not submitted. |
| GC-31 | Negative: CVV left blank | Leave CVV empty and submit. | Required-field error. The order is not submitted. |

### Postcode

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-32 | Positive: format A9 9AA | Enter `M1 1AE` and submit. | Postcode is accepted. |
| GC-33 | Positive: format A99 9AA | Enter `M60 1NW` and submit. | Postcode is accepted. |
| GC-34 | Positive: format A9A 9AA | Enter `W1A 0AX` and submit. | Postcode is accepted. |
| GC-35 | Positive: format AA9 9AA | Enter `CR2 6XH` and submit. | Postcode is accepted. |
| GC-36 | Positive: format AA99 9AA | Enter `DN55 1PT` and submit. | Postcode is accepted. |
| GC-37 | Positive: format AA9A 9AA | Enter `EC1A 1BB` and submit. | Postcode is accepted. |
| GC-38 | Boundary: shortest valid length (5 characters without the space) | Enter `M1 1AE`. | Postcode is accepted. |
| GC-39 | Boundary: longest valid length (7 characters without the space) | Enter `EC1A 1BB`. | Postcode is accepted. |
| GC-40 | Boundary: too short | Enter `M1 1A` and submit. | Invalid postcode error. The order is not submitted. |
| GC-41 | Boundary: too long | Enter `EC1A 1BBB` and submit. | Invalid postcode error. The order is not submitted. |
| GC-42 | Negative: wrong structure | Enter `1AA A11` and submit. | Invalid postcode error. The order is not submitted. |
| GC-43 | Negative: non-UK postal code | Enter `90210` and submit. | Invalid postcode error. The order is not submitted. |
| GC-44 | Negative: special characters | Enter `SW1A-1AA` and submit. | Invalid postcode error. The order is not submitted. |
| GC-45 | Negative: postcode left blank | Leave postcode empty and submit. | Required-field error. The order is not submitted. |

### Questions to confirm with the product owner

The validation rules don't say what should happen in these cases. Please confirm the expected behaviour before running the related tests:

- **Spaces in the card number** (`4111 1111 1111 1111`): should they be accepted and stripped, or rejected?
- **Lowercase or missing space in the postcode** (`sw1a1aa`): should the system accept and normalise these, or require the standard form?
- **Card types:** the rules only allow 16-digit cards. That means 15-digit cards such as Amex will be rejected (see GC-10). Check that this is intended.
- **Error message wording:** the exact text is only specified for a declined card. For the other errors, these cases check that an error appears, not its wording.
