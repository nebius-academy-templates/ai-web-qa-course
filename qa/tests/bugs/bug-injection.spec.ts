import { test, expect, type Page } from '@playwright/test';

/**
 * Bug-injection verification (QA training).
 *
 * The app ships a "🐛 Bug Injection Panel" (js/bugs.js) that toggles known defects.
 * Active bugs persist in localStorage under `techshop-bugs` and re-apply on every page
 * load via `applyActiveBugs()`. These tests prove the QA suite *catches* an injected
 * bug: assert the healthy state, inject the bug, assert the broken state appears.
 *
 * ── How the injection actually lands ─────────────────────────────────────────────
 * Product cards are rendered by an inline script that runs during parsing, i.e.
 * BEFORE `DOMContentLoaded`. `applyActiveBugs()` fires on `DOMContentLoaded`, so by
 * the time a bug runs, the cards exist and the card-level hooks are injectable.
 *
 * ⚠️ DOM-level bugs do NOT survive a grid re-render. `filterProducts()` rebuilds the
 * grid with `innerHTML`, which throws away every mutation the panel made. A test that
 * injects a content/locator bug and then touches the filter will go green on a broken
 * build. That behaviour is pinned explicitly at the bottom of this file.
 *
 * ── Known instrumentation gaps ───────────────────────────────────────────────────
 * Two panel entries are no-ops on specific pages (pinned in the last describe):
 *   • bug-hide-checkout-btn on cart.html — the checkout link carries `id="checkout-btn"`
 *     but no `data-testid`, so the bug falls through to its `place-order-btn` fallback
 *     and only fires on checkout.html.
 *   • bug-duplicate-card on index.html — the home grid is `featured-grid`, the bug
 *     targets `product-grid`.
 */

/** Pre-seed active bugs so they apply during the page's own DOMContentLoaded handler. */
async function withBugs(page: Page, bugIds: string[]) {
  // addInitScript re-runs on every navigation, reloads included — seed once per
  // tab so a test that resets and reloads isn't re-infected by its own setup.
  await page.addInitScript((ids) => {
    if (sessionStorage.getItem('techshop-bugs-seeded')) return;
    sessionStorage.setItem('techshop-bugs-seeded', '1');
    localStorage.setItem('techshop-bugs', JSON.stringify(ids));
  }, bugIds);
}

// ====================================================================
// Visual bugs
// ====================================================================
test.describe('Visual bugs', () => {
  test('healthy: logo visible, brand primary, hero gradient intact', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.getByTestId('logo')).toBeVisible();

    const primary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );
    expect(primary).not.toBe('#ff4444');

    const heroImage = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-testid="hero"]')!).backgroundImage
    );
    expect(heroImage).toContain('linear-gradient');
  });

  test('bug-hide-logo is caught: the navbar logo disappears', async ({ page }) => {
    await withBugs(page, ['bug-hide-logo']);
    await page.goto('/index.html');

    // A visibility check that passes on a healthy build now fails — bug caught.
    await expect(page.getByTestId('logo')).toBeHidden();
  });

  test('bug-primary-color is caught: --primary flips to red', async ({ page }) => {
    await withBugs(page, ['bug-primary-color']);
    await page.goto('/index.html');

    const primary = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--primary').trim()
    );
    expect(primary).toBe('#ff4444');
  });

  test('bug-hero-gradient is caught: the gradient is replaced by a flat fill', async ({ page }) => {
    await withBugs(page, ['bug-hero-gradient']);
    await page.goto('/index.html');

    // The inline `background` shorthand wipes the stylesheet's gradient, so the
    // regression shows up on BOTH properties. Asserting the colour alone would
    // miss a future bug that only drops the gradient.
    const hero = await page.evaluate(() => {
      const s = getComputedStyle(document.querySelector('[data-testid="hero"]')!);
      return { image: s.backgroundImage, color: s.backgroundColor };
    });
    expect(hero.image).toBe('none');
    expect(hero.color).toBe('rgb(15, 15, 19)');
  });
});

// ====================================================================
// Content bugs — products.html
// ====================================================================
test.describe('Content bugs', () => {
  test('healthy: 8 cards, real prices, real names', async ({ page }) => {
    await page.goto('/products.html');
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(8);
    await expect(page.getByTestId('product-price-p001')).toHaveText('$149.99');
    await expect(page.getByTestId('product-name-p001')).toHaveText('Pro Wireless Headphones');
  });

  test('bug-wrong-prices is caught: prices are inflated ×10', async ({ page }) => {
    await withBugs(page, ['bug-wrong-prices']);
    await page.goto('/products.html');

    await expect(page.getByTestId('product-price-p001')).toHaveText('$1499.90');
    // Not a one-off: every card is affected, so a spot-check on one product is
    // not enough evidence for the bug report.
    await expect(page.getByTestId('product-price-p004')).toHaveText('$2999.90');
  });

  test('bug-empty-names is caught: every product name is blank', async ({ page }) => {
    await withBugs(page, ['bug-empty-names']);
    await page.goto('/products.html');

    await expect(page.getByTestId('product-name-p001')).toHaveText('');
    const nonEmpty = await page.locator('[data-testid^="product-name-"]')
      .evaluateAll((els) => els.filter((el) => el.textContent!.trim() !== '').length);
    expect(nonEmpty).toBe(0);
  });

  test('bug-duplicate-card is caught: a ninth card appears at the top of the grid', async ({ page }) => {
    await withBugs(page, ['bug-duplicate-card']);
    await page.goto('/products.html');

    await expect(page.locator('[data-testid="product-grid"] .product-card')).toHaveCount(9);
    await expect(page.locator('[data-bug-clone="true"]')).toHaveCount(1);

    // The lesson 2.2.1 point, made assertable: a positional locator survives this
    // and keeps passing while pointing at a different element than it did before.
    // Count-based and identity-based assertions catch it; `.nth(0)` does not.
    await expect(page.locator('.product-card').nth(0)).toHaveAttribute('data-bug-clone', 'true');
  });
});

// ====================================================================
// Locator bugs
// ====================================================================
test.describe('Locator bugs', () => {
  test('bug-rename-add-to-cart is caught: the testid hook moves, the button stays', async ({ page }) => {
    await withBugs(page, ['bug-rename-add-to-cart']);
    await page.goto('/products.html');

    // This is the stale-locator failure from lessons 2.1.4 / 2.1.5, reproduced
    // from the panel instead of a hand-edited spec.
    await expect(page.getByTestId('add-to-cart-p001')).toHaveCount(0);
    await expect(page.getByTestId('add-btn-p001')).toHaveCount(1);
    await expect(page.locator('[data-testid^="add-btn-"]')).toHaveCount(8);

    // The element itself was never removed — only its hook. That distinction is
    // what separates a locator bug from a missing-element bug.
    await expect(page.locator('.product-card[data-product-id="p001"] button')).toBeVisible();
  });

  test('bug-remove-cart-count is caught: the testid is renamed, the id survives', async ({ page }) => {
    await withBugs(page, ['bug-remove-cart-count']);
    await page.goto('/products.html');

    await expect(page.getByTestId('cart-count')).toHaveCount(0);
    await expect(page.locator('[data-testid="cart-count-broken"]')).toHaveCount(1);
    // `#cart-count` still resolves, so a test written against the id keeps passing
    // while a test written against the testid fails. Two locators, same element,
    // opposite verdicts — the auto-fix target in 2.3.x.
    await expect(page.locator('#cart-count')).toBeVisible();
  });

  test('bug-break-filter is caught: selecting a category changes nothing', async ({ page }) => {
    await page.goto('/products.html');
    await page.getByTestId('category-filter').selectOption('audio');
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(2);

    await withBugs(page, ['bug-break-filter']);
    await page.goto('/products.html');
    await page.getByTestId('category-filter').selectOption('audio');

    // The control still accepts the value; only the handler is gone. A test that
    // asserts the dropdown's value instead of the grid's contents goes green here.
    await expect(page.getByTestId('category-filter')).toHaveValue('audio');
    await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(8);
  });

  test('bug-hide-checkout-btn is caught on checkout.html', async ({ page }) => {
    await withBugs(page, ['bug-hide-checkout-btn']);
    await page.goto('/checkout.html');
    await expect(page.getByTestId('place-order-btn')).toBeHidden();
  });
});

// ====================================================================
// Panel mechanics
// ====================================================================
test.describe('Panel mechanics', () => {
  test('toggling a bug through the panel UI persists across a reload', async ({ page }) => {
    await page.goto('/index.html');

    await page.getByTestId('bug-panel-toggle').click();
    await page.getByTestId('bug-toggle-bug-hide-logo').click();
    await expect(page.getByTestId('logo')).toBeHidden();

    await page.reload();
    await expect(page.getByTestId('logo')).toBeHidden();
  });

  test('Reset All Bugs reverts every active bug and clears storage', async ({ page }) => {
    await withBugs(page, ['bug-hide-logo', 'bug-primary-color']);
    await page.goto('/index.html');
    await expect(page.getByTestId('logo')).toBeHidden();

    await page.getByTestId('bug-panel-toggle').click();
    await page.getByTestId('bug-reset').click();

    await expect(page.getByTestId('logo')).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem('techshop-bugs'));
    expect(stored).toBe('[]');

    // Revert has to outlive the reload too — otherwise "reset" only looks clean.
    await page.reload();
    await expect(page.getByTestId('logo')).toBeVisible();
  });
});

// ====================================================================
// Pinned behaviour: bugs are wiped by a grid re-render
// ====================================================================
test.describe('Injected bugs do not survive a grid re-render', () => {
  test('filtering rebuilds the grid and erases the injected defect', async ({ page }) => {
    await withBugs(page, ['bug-wrong-prices', 'bug-rename-add-to-cart']);
    await page.goto('/products.html');

    await expect(page.getByTestId('product-price-p001')).toHaveText('$1499.90');
    await expect(page.locator('[data-testid^="add-btn-"]')).toHaveCount(8);

    // `filterProducts()` rebuilds the grid from the source data via innerHTML.
    // p001 is in the `audio` category, so the card stays — but it comes back clean.
    await page.getByTestId('category-filter').selectOption('audio');

    await expect(page.getByTestId('product-price-p001')).toHaveText('$149.99');
    await expect(page.locator('[data-testid^="add-btn-"]')).toHaveCount(0);
    await expect(page.locator('[data-testid^="add-to-cart-"]')).toHaveCount(2);
  });
});

// ====================================================================
// Pinned instrumentation gaps — remove a test here when the gap is closed
// ====================================================================
test.describe('Known instrumentation gaps', () => {
  test('bug-hide-checkout-btn is a no-op on cart.html: the link has an id, not a testid', async ({ page }) => {
    await withBugs(page, ['bug-hide-checkout-btn']);
    await page.goto('/cart.html');

    await expect(page.locator('[data-testid="checkout-btn"]')).toHaveCount(0);
    // To close the gap: add data-testid="checkout-btn" to the link in cart.html,
    // then replace this test with a toBeHidden() assertion.
    await expect(page.locator('#checkout-btn')).toBeVisible();
  });

  test('bug-duplicate-card is a no-op on index.html: the home grid is featured-grid', async ({ page }) => {
    await withBugs(page, ['bug-duplicate-card']);
    await page.goto('/index.html');

    await expect(page.locator('#featured-grid .product-card')).toHaveCount(4);
    await expect(page.locator('[data-bug-clone="true"]')).toHaveCount(0);
  });
});
