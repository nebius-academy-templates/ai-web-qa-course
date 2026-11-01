## Diagnosis

This is a race between a 150 ms delay in the page and a 100 ms timeout in the test. Which one finishes first depends on how fast the CI runner happens to be at that moment.

### The two numbers that collide

**The page waits 150 ms before it updates the badge** (`dom-snippet.html`):

```js
addButton.addEventListener('click', function () {
  items += 1;
  // Header is notified once the cart service has settled.
  setTimeout(() => window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: items } })), 150);
});
```

The badge's text and `hidden` attribute only change inside the `cart:updated` listener, and that event fires at least 150 ms after the click.

**The test gives the badge only 100 ms to change** (`badge.spec.ts:17`):

```ts
await page.getByTestId('add-to-cart').click();
await expect(page.getByTestId('cart-link').locator('#cart-badge')).toHaveText('1', { timeout: 100 });
```

The 100 ms override replaces Playwright's default 5 s expect timeout, so the assertion gives up before the page has even scheduled its update.

### Why it fails only sometimes

The 100 ms timeout starts when `expect` starts, not when the click event fires in the browser. Between the click in the page and the assertion's last poll, time also goes on:

- the rest of `click()`: Playwright's round trip to the browser and its post-action checks
- the protocol round trip for each `toHaveText` poll
- timer jitter in a Chromium tab sharing a CI runner with 3 other workers (`--workers=4`)

That overhead plus 100 ms ends up on either side of 150 ms:

- **Overhead over ~50 ms:** the timer has fired by the final poll, and the test passes.
- **Overhead under ~50 ms:** every poll sees the original markup, and the test fails.

The call log confirms the second case. All three polls saw the untouched initial element, `<span hidden id="cart-badge" class="badge">0</span>`. It still has `hidden` and `0`, so the listener had not run yet. The page didn't render the wrong count. It just hadn't rendered anything yet.

The retry passes because it is a fresh attempt with different timing: a new worker and a different mix of tests running alongside it. That matches the history of 3 flaky runs out of 9, about one in three.

The other badge tests pass because they don't use this tight timeout. "Caps at 9+ after ten adds" takes 1.9 s, so it has far more than 150 ms of slack.

### Fix

Fix the test, not the timing. Remove the timeout override and let Playwright's auto-waiting do its job:

```ts
test('badge increments after add to cart', async ({ page }) => {
  await page.goto('/products/nova-x2');
  await page.getByTestId('add-to-cart').click();

  const badge = page.getByTestId('cart-link').locator('#cart-badge');
  await expect(badge).toBeVisible();   // AC2: becomes visible
  await expect(badge).toHaveText('1'); // AC2: shows 1
});
```

The test still finishes as soon as the badge updates, about 150 ms after the click, so leaving out the timeout costs nothing when the test passes. If you want a stricter bound, use something with real margin, such as `{ timeout: 2000 }`. Never set a bound close to the app's own delay.

Some other things to check:

- **Search for other short timeouts.** `grep -rn "timeout: [0-9]\{1,3\}\b" tests/` will find any other assertion set to a few hundred ms or less. Each one is the same bug waiting to happen.
- **Look at the trace** at `test-results/.../trace.zip`. The timeline should show the click, then three failed polls, all within about 150 ms. The DOM change shows up only after the test has already failed.
- **Prove the diagnosis.** If you temporarily set the `setTimeout` to 0, the test should pass every time. If you set it to 300, it should fail every time.
- **Stop hiding flakes.** CI exits 0 with "Flaky tests do not fail the job", which is how this got through 9 runs. Consider reporting flaky tests prominently or failing on them in the cart suite.

### Unrelated problems in the same snippet

These are separate from the flake, but they break TS-418 acceptance criteria that don't have tests yet:

1. **AC6 (accessible name):** The link has a fixed `aria-label="Cart"`. `aria-label` overrides the link's content, so the badge count never becomes part of the accessible name. The label needs to be updated in the `cart:updated` listener, for example to `Cart, 1 item` or `Cart, 2 items`.
2. **AC7 (count survives navigation):** `items` is a local variable inside an IIFE, so it resets to 0 on every page load. The badge goes back to hidden when you move to another product page. The count needs to live in `sessionStorage` or a shared cart module, and the header needs to read it on load.
3. **Badge state after a rapid double click:** Each click schedules its own event with the value of `items` at the moment the timer fires, so the result is correct today. Still, a test of AC3 ("click again, shows 2") should assert on the final text with auto-waiting, not on an intermediate value.
