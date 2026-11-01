## TechShop guest checkout: test cases

**Applies to every case:** the user is not logged in, has at least one item in the cart, and has chosen guest checkout. Each field not named in a case holds a valid value: email `guest@example.com`, card `4111 1111 1111 1111`, expiry a future month, CVV `123`, postcode `SW1A 1AA`.

### Happy path

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-01 | Guest completes checkout with all fields valid | 1. Fill in every field with the default valid values. 2. Submit the order. | Order is placed and a confirmation is shown. No validation errors. |

### Email

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-02 | Email left empty | 1. Leave email blank. 2. Submit. | Email shows a "required" error. Order is not placed. |
| GC-03 | Email has no @ | 1. Enter `guest.example.com`. 2. Submit. | Email shows an invalid-format error. Order is not placed. |
| GC-04 | Email has no domain | 1. Enter `guest@`. 2. Submit. | Email shows an invalid-format error. Order is not placed. |
| GC-05 | Email with a subdomain and a plus tag | 1. Enter `first.last+shop@mail.example.co.uk`. 2. Submit. | Email is accepted and the order is placed. |

### Card number

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-06 | 16 digits that pass Luhn | 1. Enter `4111111111111111`. 2. Submit. | Card number is accepted and the order is placed. |
| GC-07 | A second Luhn-valid 16-digit number | 1. Enter `5555555555554444`. 2. Submit. | Card number is accepted and the order is placed. |
| GC-08 | 16 digits that fail Luhn | 1. Enter `4111111111111112`. 2. Submit. | Card number shows an invalid-number error. Order is not placed. |
| GC-09 | Boundary: 15 digits | 1. Enter `411111111111111`. 2. Submit. | Card number shows an invalid-length error. Order is not placed. |
| GC-10 | Boundary: 17 digits | 1. Enter `41111111111111111`. 2. Submit. | Either the field stops input at 16 digits, or it shows an invalid-length error. Order is not placed with 17 digits. |
| GC-11 | Contains letters | 1. Enter `4111abcd11111111`. 2. Submit. | Letters are blocked or rejected with an error. Order is not placed. |
| GC-12 | Contains symbols | 1. Enter `4111-1111-1111-1111`. 2. Submit. | Rejected, or the hyphens are removed and the number is then validated as 16 digits. Confirm which behaviour is intended (see open questions). |
| GC-13 | Card number left empty | 1. Leave the card number blank. 2. Submit. | Card number shows a "required" error. Order is not placed. |
| GC-14 | All zeros (passes Luhn) | 1. Enter `0000000000000000`. 2. Submit. | This passes both the 16-digit and Luhn rules, so it passes client-side validation. The gateway should decline it (see GC-30). Use this case to check that the system doesn't assume Luhn-valid means a real card. |

### Expiry (MM/YY)

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-15 | Expiry in a future year | 1. Enter the current month with next year's YY. 2. Submit. | Expiry is accepted and the order is placed. |
| GC-16 | Boundary: current month and year | 1. Enter the current MM/YY. 2. Submit. | Expiry is accepted, because a card is valid until the end of its expiry month. |
| GC-17 | Boundary: last month | 1. Enter the previous month's MM/YY. 2. Submit. | Expiry shows an "in the past" error. Order is not placed. |
| GC-18 | Boundary: month 01 | 1. Enter `01` with next year's YY. 2. Submit. | Expiry is accepted. |
| GC-19 | Boundary: month 12 | 1. Enter `12` with next year's YY. 2. Submit. | Expiry is accepted. |
| GC-20 | Boundary: month 00 | 1. Enter `00/` with next year's YY. 2. Submit. | Expiry shows an invalid-month error. Order is not placed. |
| GC-21 | Boundary: month 13 | 1. Enter `13/` with next year's YY. 2. Submit. | Expiry shows an invalid-month error. Order is not placed. |
| GC-22 | Wrong format: four-digit year | 1. Enter `12/2030`. 2. Submit. | Rejected, or input stops after MM/YY. Order is not placed with this value. |
| GC-23 | Wrong format: single-digit month | 1. Enter `1/30`. 2. Submit. | Expiry shows a format error, unless auto-padding to `01/30` is the intended behaviour. |
| GC-24 | Expiry left empty | 1. Leave expiry blank. 2. Submit. | Expiry shows a "required" error. Order is not placed. |

### CVV

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-25 | Three digits | 1. Enter `123`. 2. Submit. | CVV is accepted and the order is placed. |
| GC-26 | Boundary: `000` | 1. Enter `000`. 2. Submit. | CVV is accepted, since it is 3 digits. |
| GC-27 | Boundary: 2 digits | 1. Enter `12`. 2. Submit. | CVV shows an invalid-length error. Order is not placed. |
| GC-28 | Boundary: 4 digits | 1. Enter `1234`. 2. Submit. | Either input stops at 3 digits, or CVV shows an invalid-length error. Order is not placed with 4 digits. |
| GC-29 | Non-numeric or empty | 1. Enter `12a`, then try again with the field blank. 2. Submit each time. | CVV shows an error both times. Order is not placed. |

### Declined card

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-30 | Valid card that the gateway declines | 1. Enter a card number set up to decline in the test gateway, with all other fields valid. 2. Submit. | "Your card was declined" is shown. No order is placed. The cart keeps the same items and quantities. |
| GC-31 | Retry after a decline | 1. Repeat GC-30. 2. Change to a valid approving card. 3. Submit. | Order is placed. Only one order is created, with no duplicate from the declined attempt. |

### Postcode (UK)

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| GC-32 | Format A9 9AA | 1. Enter `M1 1AE`. 2. Submit. | Postcode is accepted. |
| GC-33 | Format A99 9AA | 1. Enter `M60 1NW`. 2. Submit. | Postcode is accepted. |
| GC-34 | Format AA9 9AA | 1. Enter `CR2 6XH`. 2. Submit. | Postcode is accepted. |
| GC-35 | Format AA99 9AA | 1. Enter `DN55 1PT`. 2. Submit. | Postcode is accepted. |
| GC-36 | Format A9A 9AA | 1. Enter `W1A 0AX`. 2. Submit. | Postcode is accepted. |
| GC-37 | Format AA9A 9AA | 1. Enter `EC1A 1BB`. 2. Submit. | Postcode is accepted. |
| GC-38 | Lowercase input | 1. Enter `sw1a 1aa`. 2. Submit. | Accepted, and possibly converted to uppercase. Confirm the intended behaviour. |
| GC-39 | No space | 1. Enter `SW1A1AA`. 2. Submit. | Accepted, and possibly reformatted. Confirm the intended behaviour. |
| GC-40 | Boundary: too short (5 characters) | 1. Enter `M1 1A`. 2. Submit. | Postcode shows an invalid-format error. Order is not placed. |
| GC-41 | Boundary: too long (8 characters without the space) | 1. Enter `EC1A 1BBB`. 2. Submit. | Postcode shows an invalid-format error. Order is not placed. |
| GC-42 | US ZIP code | 1. Enter `90210`. 2. Submit. | Postcode shows an invalid-format error. Order is not placed. |
| GC-43 | Inward code in the wrong pattern | 1. Enter `SW1A AA1`. 2. Submit. | Postcode shows an invalid-format error. Order is not placed. |
| GC-44 | Special characters | 1. Enter `SW1A-1AA`. 2. Submit. | Postcode shows an invalid-format error. Order is not placed. |
| GC-45 | Postcode left empty | 1. Leave postcode blank. 2. Submit. | Postcode shows a "required" error. Order is not placed. |

### Open questions for the spec

The rules above don't decide these, so the expected results for the matching cases depend on the answers:

1. **Card number formatting (GC-12):** should spaces or hyphens be allowed and removed, or rejected?
2. **Postcode normalisation (GC-38, GC-39):** should lowercase input and input without a space be accepted?
3. **Postcode strictness:** is "valid UK format" a pattern check only, or does the postcode have to actually exist (for example, through an address lookup)? A strict pattern would also reject letters the UK doesn't use in certain positions, such as `QA1 1AA`.
4. **Over-length input (GC-10, GC-28):** should the field stop input at the maximum length, or accept it and then show an error?
5. **Email in the registered flow:** the email rules here apply to guests only. This set doesn't cover the registered flow.
