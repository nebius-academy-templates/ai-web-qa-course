// design-review/capture-noise-diff.js
// Generates the baseline/actual/diff triple for lesson 3.3.6's "rendering
// noise" case: no content change at all, just a sub-pixel letter-spacing
// nudge that shifts glyph antialiasing across every text element. Compares
// against the REAL homepage.png baseline from tests/module3.spec.js-snapshots
// (test 3.2.4) — see design-review/playwright.noise-diff.config.js's
// snapshotPathTemplate.
//
// This test is EXPECTED TO FAIL. The mismatch is the point: Playwright
// writes expected/actual/diff into test-results/ on a toHaveScreenshot
// failure, and those three files are the lesson's diff triple.

const { test, expect } = require('@playwright/test');

test('sub-pixel letter-spacing diverges from homepage baseline', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('cart'));
  await page.reload();
  await page.waitForLoadState('networkidle');
  // Shifts glyph positions by a fraction of a pixel across every text
  // element — nothing moves visibly, nothing is added or removed, but
  // antialiasing on text edges changes throughout the page.
  await page.addStyleTag({ content: 'body { letter-spacing: 0.012px !important; }' });
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    mask: [page.getByTestId('bug-panel-toggle')],
  });
});
