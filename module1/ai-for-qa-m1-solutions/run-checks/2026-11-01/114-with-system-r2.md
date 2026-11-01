## Root Cause

This is a timing race between the test and the page, and the test's own timeout causes it.

- The page does not update the badge as soon as **Add to Cart** is clicked. The click handler increments the count, then waits a fixed **150 ms** (`setTimeout`) before it dispatches `cart:updated`. The badge is only re-rendered when that event fires.
- The test allows the assertion only **100 ms** (`{ timeout: 100 }`), counted from when `click()` returns.

So the assertion stops polling before the update is due. It passes only when other overhead fills the remaining ~50 ms. That overhead includes the time between the click handler running and `click()` returning in the test process, Playwright's polling intervals, and contention on a CI runner shared by 4 workers. When that overhead is large enough, the badge reads `1` in time and the test passes. When it isn't, the badge still reads `0` and the test fails. That matches "fails about one run in three, passes on retry." A retry doesn't fix anything. It just rolls the timing dice again.

The product is not slow here. The 150 ms is a fixed delay written into the page script, and the ticket says the server is not involved. The defect is the 100 ms override in the test.

What the files don't let me decide:
- **Why the split is roughly 1 in 3 rather than some other rate.** That depends on runner timing I can't see. The trace (`trace.zip`) would show the exact gap between the click and the `cart:updated` dispatch on a failing run.
- **Whether the 150 ms delay is intended.** The code comment says the header is notified "once the cart service has settled". But the code doesn't wait on anything; it's a fixed timer. The ticket also says cart state is client side and the server is not involved. Product or dev should confirm whether the delay is deliberate. Either way, the test should not depend on it being shorter than 100 ms.
- **Why "badge caps at 9+ after ten adds" is stable.** I only have lines 15–17 of `badge.spec.ts`, so I can't see what that test waits on.

## Evidence

The page delays the badge update by a fixed 150 ms after the click:

> `setTimeout(() => window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: items } })), 150);`

> `// Header is notified once the cart service has settled.`

The badge only changes inside the `cart:updated` listener:

> `badge.textContent = count > 9 ? '9+' : String(count);`
> `badge.hidden = count === 0;`

Its initial state is hidden with text `0`:

> `<span hidden id="cart-badge" class="badge">0</span>`

The test asserts with a 100 ms timeout right after the click:

> `16 |   await page.getByTestId('add-to-cart').click();`
> `> 17 |   await expect(page.getByTestId('cart-link').locator('#cart-badge')).toHaveText('1', { timeout: 100 });`

The failure shows the assertion gave up at 100 ms while the badge was still in its initial state. It was still `hidden`, so the listener had not run yet:

> `Expected string: "1"`
> `Received string: "0"`
> `Timeout: 100ms`

> `-   locator resolved to <span hidden id="cart-badge" class="badge">0</span>`
> `-   unexpected value "0"`

The flake is intermittent and the retry passes:

> `ok  6 [chromium] > cart/badge.spec.ts:14:5 > badge increments after add to cart (1.2s) (retry #1)`

> `Previous 9 runs: 3 flaky, 6 clean.`

Runs use 4 parallel workers, which adds timing variance:

> `Run npx playwright test tests/cart --project=chromium --retries=1 --workers=4`

The ticket says the update is client side with no server involvement, so there is no slow backend to wait for:

> `Cart state is held client side for this release. The product page script updates the cart and then notifies the header, which re-renders the badge. The server is not involved in the badge update.`

## Recommended Fix

1. **Remove the 100 ms override on line 17** so the assertion uses the project's normal `expect` timeout. This doesn't raise any global timeout. It removes a local value set below the page's known 150 ms update delay. The web-first assertion already polls until the badge reads `1`, so a passing run won't wait any longer than needed.

   ```ts
   test('badge increments after add to cart', async ({ page }) => {
     await page.goto('/products/nova-x2');
     const badge = page.getByTestId('cart-link').locator('#cart-badge');

     await expect(badge).toBeHidden();                  // AC1: precondition
     await page.getByTestId('add-to-cart').click();

     await expect(badge).toBeVisible();                 // AC2: becomes visible
     await expect(badge).toHaveText('1');               // AC2: shows 1
   });
   ```

   The visibility checks also cover part of acceptance criterion 2 ("makes the badge visible") that the current test misses. `toHaveText` passes on a `hidden` element.

2. **If a responsiveness limit is a real requirement, make it explicit.** None of the acceptance criteria in TS-418 sets a time limit. If product wants one (for example "badge updates within 500 ms"), add it to the ticket and test it as its own assertion, with a value above the documented delay. Don't fold it into the functional check.

3. **Check the other badge tests** (`badge.spec.ts:20`, "caps at 9+") and any other spec that reads `#cart-badge` for short `timeout:` overrides or fixed `waitForTimeout` calls. Each one is exposed to the same 150 ms delay. I couldn't confirm this from the files provided.

4. **Raise the 150 ms delay with dev (optional, product-side).** The comment says the code waits for the cart service to settle, but it is a fixed timer that doesn't wait on anything. If it isn't needed, dispatching `cart:updated` immediately would make the badge update right away. The test fix in step 1 is still the right change either way.

Don't add retries or raise global timeouts. The job already runs with `--retries=1`, and that is what has been hiding this flake.
