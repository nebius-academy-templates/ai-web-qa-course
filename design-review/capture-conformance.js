// design-review/capture-conformance.js
// Captures TechShop's checkout page at two viewport widths for a manual
// design-conformance comparison against the Figma frame (Module 3).
// 1440 matches the Figma frame; 1280 is a deliberate mismatch for practice.

const { test } = require('@playwright/test');

async function captureCheckout(page, width, height, path) {
  await page.setViewportSize({ width, height });
  await page.goto('/checkout.html');
  // Deterministic empty-cart state before capturing.
  await page.evaluate(() => localStorage.removeItem('cart'));
  await page.reload();
  await page.waitForLoadState('networkidle');
  // Dev artifact, not in the design — would be reported as an extra element.
  await page.addStyleTag({
    content: '[data-testid="bug-panel-toggle"]{display:none!important}',
  });
  await page.screenshot({ path, fullPage: false, animations: 'disabled' });
}

test('capture at 1440 (matched)', async ({ page }) => {
  await captureCheckout(page, 1440, 1174, 'design-review/checkout-live-1440.png');
});

test('capture at 1280 (deliberate mismatch)', async ({ page }) => {
  await captureCheckout(page, 1280, 1174, 'design-review/checkout-live-1280.png');
});
