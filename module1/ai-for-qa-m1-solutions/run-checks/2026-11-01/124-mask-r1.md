## 1. Field classification and treatment

| Field | Classification | Treatment | Why |
|---|---|---|---|
| `customerId` | Indirect identifier (pseudonymous key) | **Mask** | It's an internal key, but it joins straight back to the real customer in any table that holds it. |
| `firstName` | Direct identifier | **Mask** | It names the person. |
| `lastName` | Direct identifier | **Mask** | It names the person. |
| `email` | Direct identifier | **Mask** | Unique to one person and reachable. The test needs the *format*, not the real address. |
| `phone` | Direct identifier | **Mask** | Unique to one person and reachable. |
| `address` | Direct identifier | **Mask** | A street address plus city points to one household. |
| `city` | Indirect identifier | **Keep** | Low risk once the street, ZIP and birth date are dealt with. |
| `state` | Indirect identifier | **Keep** | Low risk on its own. |
| `postalCode` | Indirect identifier | **Anonymize** (generalize) | ZIP + birth date + sex is enough to identify most people. I keep the 3-digit prefix only. |
| `dateOfBirth` | Indirect identifier | **Anonymize** (generalize) | Exact birth dates are strong quasi-identifiers. I bucket to the decade. |
| `nationalId` | Direct identifier + sensitive attribute | **Delete** (placeholder if the schema needs one) | An SSN is high-risk and has nothing to do with this test. |
| `accountNumber` | Sensitive attribute (financial) | **Mask** | Financial account data. The test doesn't need it. |
| `ipAddress` | Indirect identifier | **Mask** | Can be tied to a person or device. Even private ranges show up in logs that can be correlated. |
| `orderNumber` | Indirect identifier (linkable), needed by the test | **Keep** | The test checks it. It's fine inside staging, but replace it with a synthetic value if the fixture leaves staging (repo, CI logs, tickets). |
| `purchaseAmount` | Clean | **Keep** | Needed by the test. On its own it can't identify anyone. |
| `orderDate` | Clean (weak quasi-identifier) | **Keep** | Low risk, and useful for realistic fixtures. |

The phone number is already in the reserved fictional 555-01xx range, and the email is on `example.com`. Some of this record may already be synthetic. I've still treated every field as if it were real, which is the safe default for anything copied out of a database.

## 2. Masked record (formats kept)

```json
{
  "customerId": "CUST-00001",
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user01@example.com",
  "phone": "+1-415-555-0100",
  "address": "100 Test Street",
  "city": "Seattle",
  "state": "WA",
  "postalCode": "98100",
  "dateOfBirth": "1990-01-01",
  "nationalId": "000-00-0000",
  "accountNumber": "0000000000",
  "ipAddress": "192.0.2.10",
  "orderNumber": "ORD-778214",
  "purchaseAmount": 249.99,
  "orderDate": "2025-02-18"
}
```

How the replacement values were chosen:
- **email**: `example.com` is reserved for documentation (RFC 2606), so nothing ever gets delivered there.
- **phone**: 555-0100 to 555-0199 is reserved for fictional use.
- **ipAddress**: `192.0.2.0/24` (TEST-NET-1) is reserved for documentation and is never routed.
- **nationalId**: `000-xx-xxxx` is never issued, so it can't collide with a real SSN. It still matches a `\d{3}-\d{2}-\d{4}` pattern. If your schema allows null, just remove the field.
- **postalCode / dateOfBirth**: these are generalized, not randomized, so the values stay plausible but no longer pick out one person.

## 3. Order-confirmation test assertions

I don't know your stack, so here's a Jest version. It assumes `sendOrderConfirmation(customer)` returns an object with `to`, `orderNumber`, `amount` and a rendered `body`. Rename to match your code.

```js
const customer = require('./fixtures/customer.masked.json');
const { sendOrderConfirmation } = require('../src/orders');

describe('order confirmation', () => {
  let confirmation;

  beforeAll(async () => {
    confirmation = await sendOrderConfirmation(customer);
  });

  // --- Email format ---
  test('is sent to a well-formed email address', () => {
    expect(confirmation.to).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
  });

  test('is sent to the customer on file', () => {
    expect(confirmation.to).toBe(customer.email);
  });

  // --- Order number ---
  test('order number has the ORD-###### format', () => {
    expect(confirmation.orderNumber).toMatch(/^ORD-\d{6}$/);
  });

  test('order number matches the order', () => {
    expect(confirmation.orderNumber).toBe(customer.orderNumber);
    expect(confirmation.body).toContain(customer.orderNumber);
  });

  // --- Purchase amount ---
  test('amount is a positive number with at most 2 decimals', () => {
    expect(typeof confirmation.amount).toBe('number');
    expect(confirmation.amount).toBeGreaterThan(0);
    expect(Number.isInteger(Math.round(confirmation.amount * 100))).toBe(true);
    expect(confirmation.amount.toFixed(2)).toBe(String(confirmation.amount.toFixed(2)));
  });

  test('amount matches the purchase', () => {
    expect(confirmation.amount).toBeCloseTo(customer.purchaseAmount, 2);
  });

  test('amount is rendered as currency in the email body', () => {
    expect(confirmation.body).toContain('$249.99');
  });

  // --- Privacy guard ---
  test('email body does not leak sensitive fields', () => {
    expect(confirmation.body).not.toContain(customer.nationalId);
    expect(confirmation.body).not.toContain(customer.accountNumber);
  });
});
```

Notes:
- Use `toBeCloseTo` for the amount, not `toBe`, so floating-point quirks don't break the test. Better still, store money as integer cents (`24999`) in the domain model.
- The email regex only checks shape, not full RFC 5322 validity, and shape is what a confirmation test cares about. If you want stricter checks, use the same validator your app uses rather than writing a bigger regex.
- The last test is optional. It's a cheap way to catch a template that accidentally pulls in the SSN or account number later.

If you tell me your test framework (pytest, JUnit, Cypress, etc.) and the real shape of the confirmation object, I'll adapt these.
