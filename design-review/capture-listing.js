// design-review/capture-listing.js
// Captures TechShop's product listing page for a design-conformance practice
// exercise: one clean capture, one with planted deviations.
//
// TEST 2 is the practice asset — the deviations (R1/R2/R3) are injected via
// CSS at capture time rather than hand-edited into the app, so the "wrong"
// state is reproducible and revertible, not a lingering code change. The
// deviation manifest (what each Rn is, and its correct value) lives on the
// Figma file's deviations page, not in this script.

const { test } = require('@playwright/test');

async function captureListing(page, path, extraCss) {
  await page.setViewportSize({ width: 1440, height: 482 });
  await page.goto('/products.html');
  // Deterministic empty-cart state before capturing.
  await page.evaluate(() => localStorage.removeItem('cart'));
  await page.reload();
  await page.waitForLoadState('networkidle');
  // Dev artifact, not in the design — would be reported as an extra element.
  await page.addStyleTag({
    content: '[data-testid="bug-panel-toggle"]{display:none!important}',
  });
  if (extraCss) {
    await page.addStyleTag({ content: extraCss });
  }
  await page.screenshot({ path, fullPage: false, animations: 'disabled' });
}

test('clean capture', async ({ page }) => {
  await captureListing(page, 'design-review/listing-live-clean.png');
});

test('capture with planted deviations', async ({ page }) => {
  await captureListing(page, 'design-review/listing-live-deviated.png', `
    :root { --primary: #ff4444 !important; }        /* R1 brand colour */
    .product-card { padding: 16px !important; }      /* R2 was 24px */
    .product-name { font-size: 13px !important; }    /* R3 was 16px */
  `);
});
