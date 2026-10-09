# 1.1.2 Evaluate four QA prompts: reference answers

Grader gold standard for the four verdicts, the named gaps and one full rewrite per prompt.
All rewrites use TechShop and put the context in the prompt text, not in the engineer's head.
Placeholders in square brackets (`[spec]`, `[rules]`) are context slots the learner would fill with real material;
the grader accepts a placeholder as a valid slot (it is in the grader prompt already).

The rewrites are what an expert would actually send. They are deliberately short: role, scope, context, format, nothing decorative.

---

## Prompt 1: "Create an automated API test suite for all endpoints"

**Verdict:** not suitable.

**Named gaps**

- One-shot request for everything. "All endpoints" gives no boundary and invites excess tests, and every generated test is maintenance cost.
- Nobody has asked whether every endpoint needs tests. Risk-based scope is the engineer's decision, not the model's.
- No application context: no spec, no business rules, no auth model, so the model has to invent endpoints and behaviour (the "hallucinated or excessive API tests" failure mode from the lesson).
- No stack or output format ("test suite" could be Postman, REST Assured, Playwright request tests, anything).

**Reference rewrite**

```
You are a QA automation engineer for TechShop, an online electronics store.

Here is the OpenAPI definition for POST /orders and GET /orders/{id}:
[paste only these two operations]

Business rules:
1. An order needs at least one line item and a valid customer ID.
2. A guest order must include an email address; a registered order must not.
3. The order total must equal the sum of the line items.

Generate API test cases for POST /orders only, using Playwright's request fixture in TypeScript.
Cover the three business rules, one missing-required-field case and one authentication failure.
Do not invent endpoints, fields or status codes that are not in the definition above.
Return a table first (ID, scenario, input, expected status and result), then the code for the five highest-priority cases only.
```

---

## Prompt 2: "Explain the difference between implicit waits and explicit waits in Selenium with examples."

**Ruling: [SME CHECK] this prompt is judged by a different frame from the other three and should be flagged as such.**

- Prompts 1, 3 and 4 ask the model to produce a QA artefact (tests, a framework). Prompt 2 asks the model to explain a concept. For an explanation request the usual artefact gaps (application context, business rules) do not apply.
- It references Selenium, which this course does not use (the course stack is Playwright). The course should not train a Selenium habit.

**Verdict:** suitable as-is, or suitable with one improvement. The one real gap is that the programming language is not stated, so the examples could come back in Java, Python or JavaScript. A learner who marks it "not suitable" and names only that gap meets the element (this matches the existing grader key).

**Recommended content fix (for LXD):** replace this prompt in the practice with a Playwright equivalent so all four prompts are on-stack and the same frame applies. Suggested replacement: "Explain the difference between Playwright's auto-waiting and an explicit `waitFor` with examples." If it stays, keep the ruling above in the grader.

**Reference rewrite (if kept as written, Selenium)**

```
You are a senior test automation engineer explaining to a junior colleague who knows basic Selenium WebDriver.
Explain the difference between implicit waits and explicit waits in Selenium 4.
Use Java for every code example, and use a login page where a "Sign in" button appears after a spinner disappears.
Cover: how each wait works, why mixing them is discouraged, and which to use by default.
Keep it under 300 words plus two short code examples.
```

**Reference rewrite (recommended Playwright replacement)**

```
You are a senior test automation engineer explaining to a junior colleague who knows basic Playwright.
Explain how Playwright's auto-waiting differs from an explicit wait such as locator.waitFor or expect(...).toBeVisible().
Use TypeScript and a TechShop login page where the "Sign in" button appears after a spinner disappears.
Say when auto-waiting is enough and when an explicit wait is justified.
Keep it under 300 words plus two short code examples.
```

---

## Prompt 3: "Design a Playwright test automation framework"

**Verdict:** not suitable.

**Named gaps**

- No application context: what is being tested, which flows, which environments.
- No framework conventions or design pattern (Page Object Model, fixtures, test data strategy), so the model picks one.
- No language or stack beyond "Playwright" (TypeScript or JavaScript or Python), no runner or CI target.
- No constraints (team size, existing tooling, reporting, what must not be included) and no output format ("design" could be prose, a folder tree or code).

**Reference rewrite**

```
You are a senior test automation architect.
Application: TechShop, a React storefront with guest and registered checkout, card payment only, deployed to a staging environment.
Team: two QA engineers, GitHub Actions for CI, no existing automation.
Stack: Playwright Test with TypeScript.

Design the folder structure and conventions for a framework that uses the Page Object Model, Playwright fixtures for login and test data, and role-based locators (never XPath).
Constraints: tests must run in parallel with no shared state; secrets come from environment variables; no more than three dependencies beyond Playwright.

Return: (1) a folder tree, (2) one paragraph per top-level folder explaining its purpose, (3) a sample page object and one test for the login page.
Do not write any other tests.
```

---

## Prompt 4: "Generate test cases for the checkout page."

**Verdict:** not suitable. This is the prompt the learner runs in Claude, so it is also the one the comparison is built on.

**Named gaps**

- No business rules. Claude does not know the checkout rules, so it applies generic e-commerce ones.
- No flow variant: guest or registered (TechShop supports both).
- No payment methods: TechShop takes card payment only, so anything else Claude writes is an invention.
- No validation rules and no error scenarios, so field validation cases are guesses.
- No output format, so Claude picks its own.

**Reference rewrite**

The validation rules below are illustrative TechShop rules for the reference answer. [SME CHECK] confirm or replace them.

```
You are a QA engineer for TechShop, an online electronics store.
Checkout supports a guest flow and a registered-user flow. Payment is by card only: no wallets, no PayPal, no buy-now-pay-later.

Validation rules:
- Email: required for guests, valid format.
- Card number: 16 digits, passes the Luhn check.
- Expiry: MM/YY, not in the past.
- CVV: 3 digits.
- Postcode: valid UK format.
- A declined card shows "Your card was declined" and keeps the cart.

Generate test cases for the guest checkout flow only, as a table with columns: ID, scenario, steps, expected result.
Include positive, negative and boundary cases for the card and postcode fields. Do not invent payment methods or fields that are not listed above.
```

**What the original prompt typically makes Claude invent [RUN CHECK]:** the grader prompt expects "a payment method, a coupon field, a shipping option, a login step, a test-case format Claude chose on its own". I could not run Claude in this build, so these are the expected inventions from the grader prompt, not observed ones. Capture a real run before go-live.

**What a good rewrite reliably fixes [RUN CHECK]:** payment-method cases disappear (only card cases remain) and the format follows the requested table. The rewrite does not, by itself, give Claude the real error messages, which is why "what is still missing" in the comparison is usually a missing error message text.
