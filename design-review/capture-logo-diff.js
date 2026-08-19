// design-review/capture-logo-diff.js
// Generates the baseline/actual/diff triple for lesson 3.3.6, case 1 (known
// real bug): injects bug-hide-logo and compares against the REAL
// homepage.png baseline from tests/module3.spec.js-snapshots (test 3.2.4) —
// see design-review/playwright.logo-diff.config.js's snapshotPathTemplate.
//
// This test is EXPECTED TO FAIL. The mismatch is the point: Playwright
// writes expected/actual/diff into test-results/ on a toHaveScreenshot
// failure, and those three files are the lesson's diff triple.

const { test, expect } = require('@playwright/test');

test('hide-logo bug diverges from homepage baseline', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('techshop-bugs', JSON.stringify(['bug-hide-logo']));
  });
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('cart'));
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    mask: [page.getByTestId('bug-panel-toggle')],
  });
});
