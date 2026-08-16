// tests/module3.spec.js
// ============================================================
// MODULE 3 — Visual Regression Baselines
// ============================================================

const { test, expect } = require('@playwright/test');

test.describe('3.2 - Visual baselines', () => {

  test('3.2.1 - products page matches baseline', async ({ page }) => {
    await page.goto('/products.html');
    // Deterministic empty-cart state: clear any seeded/leftover cart, reload.
    await page.evaluate(() => localStorage.removeItem('cart'));
    await page.reload();
    await expect(page).toHaveScreenshot('products-page.png', { fullPage: true });
  });

  test('3.2.3 - cart page with a seeded cart', async ({ page }) => {
    // Seed BEFORE first paint so the cart renders fully populated on load.
    await page.addInitScript(() => {
      localStorage.setItem('cart', JSON.stringify([
        { id: 'p001', qty: 2 }, { id: 'p003', qty: 1 },
      ]));
    });
    await page.goto('/cart.html');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('cart-seeded.png', {
      fullPage: true,
      // Bug Injection Panel toggle is a dev artifact, not product UI — masked
      // so it can't cause a diff. Cart totals are deliberately NOT masked:
      // they're deterministic from the seeded cart above and are the most
      // valuable thing on this page to catch regressions in.
      mask: [page.getByTestId('bug-panel-toggle')],
    });
  });

});
