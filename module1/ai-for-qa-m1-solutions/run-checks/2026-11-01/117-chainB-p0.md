When a test fails on a third-party page, the usual cause is that something changed outside your codebase. That could be the page itself, how it treats your CI environment, or the timing. Here's the order I'd check things in.

## 1. Look at what the browser actually saw (start here)

Before you change any code, get the artifacts from the failed run:

- **Trace** (`trace: 'on-first-retry'` or `'retain-on-failure'` in `playwright.config`). Open it with `npx playwright show-trace trace.zip`. It shows the DOM snapshot, network calls and console for every step. This is the most useful thing you can have.
- **Screenshot / video** at the moment of failure.
- **The exact error message.** These mean different things:
  - *Timeout waiting for locator*: the element wasn't found or wasn't clickable.
  - *Click succeeded, but `waitForURL` / `toHaveURL` timed out*: the click happened and the navigation didn't.
  - *Navigation went somewhere unexpected*: a redirect happened, just not to the place you expected.

The screenshot often answers the question straight away. You might see a cookie banner over the button, a CAPTCHA, an "access denied" page, or a redesigned layout.

## 2. Did the third-party page change?

Open the page by hand and compare it with what your test expects:

- Is the element still there, with the same text, role or attributes your locator uses?
- Is it still a real link (`<a href>`)? Or is it now a button that navigates with JavaScript, maybe after an async call?
- Does it now open a **new tab** (`target="_blank"` or `window.open`)? This one comes up a lot. The redirect does happen, but in a popup, so `page.url()` never changes. Fix it like this:
  ```ts
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '...' }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  ```
- Does the redirect now go to a different domain or path that your URL assertion doesn't match?

## 3. Does it fail only in CI?

Run the same test locally, headed and headless. If it passes locally and fails in the pipeline, look at environment differences:

- **Bot detection / IP blocking.** CI runners use datacenter IPs, and many sites challenge or block them silently. The trace's network tab will show 403s or a challenge page.
- **Consent banners / geo differences.** A runner in another region may get a GDPR banner or a regional version of the site.
- **Headless vs headed** behaviour, user agent, or viewport size (the element can sit off-screen or behind a mobile menu).
- **Browser version.** A Playwright upgrade, or an unpinned Docker image, may have changed the browser.

## 4. Is it a timing problem?

- Was the click made before the page's JavaScript had attached its handler? Then the click "works" but nothing happens. This often looks flaky, so check whether it fails every time or only sometimes.
- Avoid `waitForTimeout`. Wait for the navigation together with the click instead:
  ```ts
  await Promise.all([
    page.waitForURL(/expected-path/),
    page.getByRole('link', { name: '...' }).click(),
  ]);
  ```

## 5. What changed on your side?

Check recent commits, dependency bumps (Playwright especially), config changes, and pipeline image updates since the last green run. If nothing changed on your side, the cause is almost certainly on the third-party side or in the environment.

---

**A longer-term point:** UI tests that depend on a live third-party page will keep breaking for reasons you can't control. If what you really need to know is "our app sends the user to the right place," you can assert on the link's `href`. You can also stub the third-party response with `page.route()`, and test the real integration separately in a smaller, non-blocking suite.

If you share the error output, the relevant test code and (if you can) a screenshot or trace from the failed run, I can help narrow it down.
