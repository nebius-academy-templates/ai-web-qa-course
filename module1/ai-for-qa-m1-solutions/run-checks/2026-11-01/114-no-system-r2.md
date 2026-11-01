## Diagnosis

This is a timing race, and it's built into the test. The app is fine.

**The app updates the badge 150 ms after the click:**

```js
addButton.addEventListener('click', function () {
  items += 1;
  setTimeout(() => window.dispatchEvent(new CustomEvent('cart:updated', ...)), 150);
});
```

**The test gives the badge only 100 ms to change:**

```ts
await expect(page.getByTestId('cart-link').locator('#cart-badge')).toHaveText('1', { timeout: 100 });
```

So the assertion's whole retry window usually ends before the `cart:updated` event fires. The call log shows this directly: three polls, each one sees `<span hidden ...>0</span>`, and then the 100 ms runs out. The text was never going to be `1` yet.

### Why it passes sometimes

The timer starts when the click handler runs. The 100 ms assertion clock starts later, after `click()` resolves and the test sends the `expect` back to the browser. Playwright also does one last check when the timeout hits. Add up the round-trips and the polling gaps, and the last check sometimes lands just past the 150 ms mark. When that happens the test passes.

How often it lands there depends on how slow the machine is at that moment:

- **First attempt:** runs with `--workers=4`, alongside five other specs. The timing is close, so it fails some of the time. Your history shows about a third of runs (3 of the last 9 were flaky).
- **Retry:** runs alone after the other workers have finished. It may also run with tracing or other retry-only overhead, depending on your config. It took 1.2 s, against a few hundred ms for the comparable tests. The extra slowness pushes the final check past 150 ms, so it passes.

Put another way: the failures are the test behaving as written, and the passes are luck.

### Why the other badge tests don't flake

`badge caps at 9+ after ten adds` (1.9 s) and `badge is hidden while the cart is empty` don't have this problem. The empty test checks a state that is already true at page load. The 9+ test very likely uses the default expect timeout (5 s), which easily covers the 150 ms delay. Worth confirming in `badge.spec.ts`. If so, line 17 is the only place someone overrode the timeout.

## Fix

Remove the 100 ms override and let the web-first assertion retry with the default timeout:

```ts
test('badge increments after add to cart', async ({ page }) => {
  await page.goto('/products/nova-x2');
  await page.getByTestId('add-to-cart').click();

  const badge = page.getByTestId('cart-link').locator('#cart-badge');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveText('1');
});
```

- Don't replace it with `page.waitForTimeout(200)`. That just swaps one guess for another and slows the suite.
- Adding `toBeVisible()` also covers acceptance criterion 2 ("makes the badge visible"), which the current test doesn't check. Right now it would pass even if the badge said `1` while still `hidden`.
- If someone added the 100 ms on purpose, as a performance check that the badge updates "instantly", it doesn't work even for that, and the delay is 150 ms by design anyway. Agree on a real budget with Product and test it separately with a sensible margin. Don't put it in the functional test.

To confirm the diagnosis before changing anything, run the current test under load, e.g. `npx playwright test tests/cart/badge.spec.ts:14 --repeat-each=30 --workers=4`. You should see a large share of failures. Then run the fixed version the same way and it should be 30/30. The `trace.zip` from the failed run will also show the click, then the expect timing out, then the DOM mutation arriving a few tens of ms later.

## Worth raising with the developer (not the cause of the flake)

While reading the snippet I noticed a few things against TS-418:

1. **The 150 ms `setTimeout` has no clear reason.** The comment says "once the cart service has settled", but the ticket says cart state is client-side and the server isn't involved. It's a fixed delay with nothing to wait for. If it's a placeholder, it may be worth removing. The test fix above is still right either way.
2. **AC6 looks unmet.** The link has a static `aria-label="Cart"`, so the accessible name never includes the count ("Cart, 1 item"). The badge text is also hidden from the accessible name because `aria-label` overrides the link's content.
3. **AC7 looks unmet.** `items` is a local variable inside the page script, so the count goes back to 0 on every page load. That breaks "survives navigation between product pages within the same session". It would need `sessionStorage` or similar. Nothing in the current suite seems to test this.

Finally, the job exits 0 because flaky tests don't fail the build. That's why this has gone unnoticed for at least 9 runs. Consider making flaky results visible, for example by failing on `flaky` in a nightly job or reporting them to the channel, so the next one gets caught sooner.
