Third-party pages are a common cause of flaky or suddenly broken tests, because you don't control when they change. Start by working out **which side changed: the third-party page, or your test environment.** Here's the order I'd work in.

## 1. Look at the failure artifacts first

Before you change anything, get the evidence from the failed CI run:

- **Playwright trace** (`trace: 'on-first-retry'` or `'retain-on-failure'` in your config). Open it with `npx playwright show-trace trace.zip`. This is the most useful thing you can have. It shows the DOM snapshot at each step, the network requests, console errors, and exactly what the click landed on.
- **Screenshot / video** at the moment of failure.
- **The exact error message.** "Timeout waiting for URL" means something different from "element not found" or "element intercepts pointer events".

The trace usually answers the next question right away.

## 2. Did the click happen, and on the right element?

In the trace, check:

- **Did the locator match anything?** If the third party renamed a class, changed text, or restructured the DOM, your selector might match nothing, or match a *different* element that doesn't navigate.
- **Was something covering it?** Cookie/consent banners, newsletter popups and chat widgets are the classic cause. They often show up only in certain regions, so your CI runner's location may get a banner you never see locally.
- **Did Playwright report the click as successful but nothing happened?** That points to the redirect logic, not the selector (see step 3).

## 3. Did the navigation start, and where did it go?

Look at the network tab in the trace after the click:

- **No request at all:** the redirect is probably JavaScript-driven and the script didn't run or didn't load. Check the console for errors, blocked scripts, or CSP violations.
- **It opened a new tab/window:** if the link changed to `target="_blank"` or now uses `window.open`, your `page` stays where it was. You'd need `const popup = await page.waitForEvent('popup')` around the click.
- **It redirected somewhere unexpected:** a bot-check / CAPTCHA page, a regional variant, a login wall, or an A/B test variant.
- **It redirected, but your assertion was too strict or too early:** for example, `expect(page).toHaveURL()` with an exact URL when the target now adds query params, or a check that runs before navigation finishes. `await page.waitForURL(/pattern/)` is more robust.

## 4. Check what changed on your side

If the trace doesn't make it obvious, compare the last passing run with the first failing one:

- **Playwright or browser version bumps** in your lockfile or Docker image
- **Config changes:** headless mode, user agent, viewport, locale, timezone
- **CI infrastructure:** new runner image, a different region or IP range (datacenter IPs are more likely to hit bot detection)
- **Your own app changes**, if your app links out to the third party

## 5. Reproduce locally under CI conditions

Run the single test locally in headless mode with the same browser, and then headed with `--debug` to step through it. Then visit the third-party page by hand. If it fails locally too, the third party changed. If it passes locally but fails in CI, look at environment differences: region, IP, headless detection, consent banners.

---

## A longer-term point

Once you've found the cause, consider whether the test should depend on a live third-party page at all. Common options:

- **Assert the link instead of following it:** check the `href` or the request that gets fired, rather than the destination page loading.
- **Mock the third party** with `page.route()` so you test *your* integration, not their uptime and markup.
- **Keep one small, separate smoke test** that hits the real third party, and allow it to be flaky or non-blocking.

---

If you can share the error message, the relevant test code (locator, click, and assertion), and what the trace shows after the click, I can help narrow it down further.
