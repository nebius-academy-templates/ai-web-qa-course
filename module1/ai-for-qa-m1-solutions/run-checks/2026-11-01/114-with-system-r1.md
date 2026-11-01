## Root Cause

This is a race between the test's assertion timeout and a fixed delay in the page script. The test is the problem, not the product.

- When **Add to Cart** is clicked, the page script increments its counter. It then waits **150 ms** (`setTimeout(..., 150)`) before sending the `cart:updated` event that redraws the badge.
- The test checks the badge with `toHaveText('1', { timeout: 100 })`. That gives the badge only **100 ms** to change, which is less than the 150 ms the page always waits.

So the assertion is set up to lose most of the time. It passes only when enough time happens to pass between the in-page click and Playwright's last check. That gap includes the time for `click()` to return, the start of the `expect`, and the gaps between polls. It varies with load on the runner, and this run used 4 workers. That explains the intermittent pattern: it fails when the gap is short and passes on retry when it is long enough.

The files don't support a "slow product" explanation. The delay is a hard-coded constant in the client script, not a server or network wait. The ticket says the server is not involved in updating the badge.

What the evidence can't settle:
- **Why exactly one run in three passes rather than fails.** The log doesn't show timings between the click and the assertion. The attached `trace.zip` would confirm this, since it shows when the click fired, when `cart:updated` was sent, and when each poll ran.
- **Whether the 150 ms delay is intended.** The code comment says it waits for "the cart service", but the ticket says cart state is held in the browser and the server is not involved. Neither the ticket nor the snippet says what the delay is for. It may be leftover or placeholder code, and that is a question for the developer (Tom Whitfield). Either way, the acceptance criteria set no time limit for the badge update, so the product isn't breaking any stated requirement.
- **Whether the snippet matches the build CI tested.** The snippet is described as "trimmed" staging output, and I don't have the full `badge.spec.ts`.

## Evidence

The page delays the badge update by a fixed 150 ms after the click (dom-snippet.html):
```
addButton.addEventListener('click', function () {
  items += 1;
  // Header is notified once the cart service has settled.
  setTimeout(() => window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: items } })), 150);
});
```

The badge only changes when that event arrives:
```
window.addEventListener('cart:updated', function (event) {
  var count = event.detail.items;
  badge.textContent = count > 9 ? '9+' : String(count);
  badge.hidden = count === 0;
});
```

The test allows only 100 ms (ci-log.txt):
```
> 17 |   await expect(page.getByTestId('cart-link').locator('#cart-badge')).toHaveText('1', { timeout: 100 });
```
```
    Timeout: 100ms
```

Every poll saw the badge before the event fired. It still showed its initial value and was still hidden:
```
      -   locator resolved to <span hidden id="cart-badge" class="badge">0</span>
      -   unexpected value "0"
```

The same test passes on retry, and the pattern repeats across runs:
```
  ok  6 [chromium] > cart/badge.spec.ts:14:5 > badge increments after add to cart (1.2s) (retry #1)
```
```
Flaky tests do not fail the job. Previous 9 runs: 3 flaky, 6 clean.
```

The ticket says the badge update is client side only, so no server latency is involved (jira-ticket.md):
```
Cart state is held client side for this release. The product page script updates the
cart and then notifies the header, which re-renders the badge. The server is not
involved in the badge update.
```

The test "badge caps at 9+ after ten adds" also depends on the same delayed event, and it passes:
```
  ok  4 [chromium] > cart/badge.spec.ts:20:5 > badge caps at 9+ after ten adds (1.9s)
```
I can't see that test's code. It most likely passes because it doesn't use the 100 ms override, but I can't confirm that.

## Recommended Fix

1. **Remove the 100 ms override** in `tests/cart/badge.spec.ts:17` and let the assertion use the project's default `expect` timeout. This doesn't raise any global timeout. It drops a local limit that is shorter than the page's own fixed delay. A web-first assertion returns as soon as the text matches, so a pass still takes about 150 ms.
   ```ts
   await page.goto('/products/nova-x2');
   await page.getByTestId('add-to-cart').click();
   const badge = page.getByTestId('cart-link').locator('#cart-badge');
   await expect(badge).toBeVisible();
   await expect(badge).toHaveText('1');
   ```
   Adding `toBeVisible()` also covers acceptance criterion 2 ("makes the badge visible and show `1`"). The current test only checks the text, and the hidden span already holds a text node.

2. **Check other specs for tight timeouts.** Search `tests/cart` for `timeout:` values below about 1 s on assertions that follow a UI action, and remove them the same way.

3. **Don't add retries.** The job already runs with `--retries=1`, and that is what hides the problem: flaky tests "do not fail the job". Once the fix is in, consider running this spec with `--retries=0` or `--repeat-each=20` to confirm it is stable.

4. **Ask the developer about the 150 ms `setTimeout`.** The ticket describes a purely client-side update, so the delay looks unnecessary. If it's removed, the badge updates on the same tick as the click. Treat this as a separate product question and leave the test fix as above, because the test should not depend on how long the delay is.

5. **Open `trace.zip` from the failed attempt** if you want to confirm the timing, especially that the polls happen less than 150 ms after the click.

Side note, outside this flake: the snippet hardcodes `aria-label="Cart"` on the link, and the script never updates it with the count. That suggests acceptance criterion 6 ("Cart, 1 item") is not implemented in the markup shown.
