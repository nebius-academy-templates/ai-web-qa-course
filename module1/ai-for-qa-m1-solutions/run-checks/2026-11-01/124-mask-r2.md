## 1. Field classification and treatment

| Field | Classification | Treatment | Why |
|---|---|---|---|
| `customerId` | Indirect identifier | Anonymize (replace with a synthetic ID) | It's an internal key, so it can be joined back to the real customer in other tables. |
| `firstName` | Direct identifier | Mask (synthetic value) | Identifies the person. |
| `lastName` | Direct identifier | Mask (synthetic value) | Identifies the person. |
| `email` | Direct identifier | Mask (synthetic value on a reserved domain) | Unique to one person. Your test checks its format, so keep the `local@domain.tld` shape. |
| `phone` | Direct identifier | Mask (fictional 555-01xx number) | Unique to one person. |
| `address` | Direct identifier | Mask (synthetic street) | A street address plus a city points to one household. |
| `city` | Indirect identifier | Keep | Large city, low risk once the address and ZIP are masked. |
| `state` | Indirect identifier | Keep | Very coarse. |
| `postalCode` | Indirect identifier | Anonymize (generalize to the 3-digit prefix) | ZIP + date of birth (+ gender) is enough to re-identify most people. |
| `dateOfBirth` | Indirect identifier | Anonymize (generalize to year, set to Jan 1) | Very effective for re-identification when combined with ZIP. |
| `nationalId` | Sensitive attribute (also a direct identifier) | Delete. If the schema requires it, mask with a value that can't be valid | Highest-risk field and irrelevant to the test. |
| `accountNumber` | Sensitive attribute (financial) | Mask (synthetic, same length) | Financial account data. Never needed in a confirmation test. |
| `ipAddress` | Indirect identifier | Mask (RFC 5737 documentation range) | Counts as personal data under GDPR and similar laws, even when it's a private address. |
| `orderNumber` | Indirect identifier | Anonymize (synthetic value, same pattern) | Links to a real transaction in staging. The test only needs the `ORD-` + 6 digits pattern. |
| `purchaseAmount` | Clean | Keep | Not identifying on its own, and it's under test. |
| `orderDate` | Clean (weak quasi-identifier) | Keep | Low risk once the other fields are masked, and useful for realistic fixtures. |

## 2. Masked record (formats preserved)

```json
{
  "customerId": "CUST-00001",
  "firstName": "Alex",
  "lastName": "Sample",
  "email": "alex.sample@example.com",
  "phone": "+1-206-555-0100",
  "address": "100 Test Street",
  "city": "Seattle",
  "state": "WA",
  "postalCode": "98100",
  "dateOfBirth": "1992-01-01",
  "nationalId": "000-00-0000",
  "accountNumber": "0000000001",
  "ipAddress": "192.0.2.10",
  "orderNumber": "ORD-100001",
  "purchaseAmount": 249.99,
  "orderDate": "2025-02-18"
}
```

Why these replacement values:
- **`example.com`** is reserved for documentation (RFC 2606), so email from tests can never reach a real inbox.
- **555-0100 to 555-0199** are fictional numbers that are never assigned to real lines.
- **`000-00-0000`** has the right shape, but an SSN can never have area `000`, so it can't belong to anyone. If your schema allows it, remove the field instead.
- **`192.0.2.0/24`** (TEST-NET-1) is reserved for examples and documentation.
- **`98100`** keeps the 5-digit format but only reveals the 3-digit ZIP prefix.

One thing worth checking: if this record came from production rather than being seeded, real SSN-shaped values are sitting in staging. In that case, mask the whole staging dataset, not just this fixture.

## 3. Assertions for the order-confirmation test

This uses Jest/TypeScript. Change `sendOrderConfirmation` and the field names to match your code.

```ts
import customer from "./fixtures/customer.masked.json";
import { sendOrderConfirmation } from "../src/orders";

describe("order confirmation", () => {
  let confirmation: Awaited<ReturnType<typeof sendOrderConfirmation>>;

  beforeAll(async () => {
    confirmation = await sendOrderConfirmation(customer);
  });

  // --- Email format ---
  it("sends to a well-formed email address", () => {
    const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    expect(confirmation.to).toMatch(EMAIL_RE);
  });

  it("sends to the customer's address", () => {
    expect(confirmation.to).toBe(customer.email);
  });

  // --- Order number ---
  it("includes a correctly formatted order number", () => {
    expect(confirmation.orderNumber).toMatch(/^ORD-\d{6}$/);
  });

  it("uses the order number from the order", () => {
    expect(confirmation.orderNumber).toBe(customer.orderNumber);
    expect(confirmation.body).toContain(customer.orderNumber);
  });

  // --- Purchase amount ---
  it("reports a positive amount with at most two decimals", () => {
    const amount = confirmation.amount;
    expect(typeof amount).toBe("number");
    expect(Number.isFinite(amount)).toBe(true);
    expect(amount).toBeGreaterThan(0);
    // float-safe check that there are no fractional cents
    expect(Math.abs(amount * 100 - Math.round(amount * 100))).toBeLessThan(1e-9);
  });

  it("matches the purchase amount", () => {
    expect(confirmation.amount).toBeCloseTo(customer.purchaseAmount, 2);
  });

  it("shows the amount formatted as currency in the body", () => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(customer.purchaseAmount); // "$249.99"
    expect(confirmation.body).toContain(formatted);
  });

  // --- Guard against leaking sensitive data ---
  it("does not include sensitive fields in the email", () => {
    expect(confirmation.body).not.toContain(customer.nationalId);
    expect(confirmation.body).not.toContain(customer.accountNumber);
  });
});
```

Some notes on the assertions:
- **Each check has a format test and an exact-value test.** The format tests catch broken templates. The exact-value tests catch the wrong data being wired into the email.
- **The amount uses `toBeCloseTo`, not `toBe`,** so floating-point representation can't make the test flaky. If your system stores money as integer cents, compare `amountCents === 24999` instead. That's more robust.
- **The last test is optional, but cheap.** It fails if someone later adds the SSN or account number to the template.

If you're on a different framework (pytest, JUnit, Cypress), I can port these.
