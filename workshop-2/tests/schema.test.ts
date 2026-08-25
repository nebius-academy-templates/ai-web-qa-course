/**
 * SPRINT 2 — this file fails until src/gates/schema.ts is implemented.
 */
import { describe, expect, it } from 'vitest';
import { validateOutput } from '../src/gates/schema.js';

const GOOD = {
  pageObject: {
    path: 'pages/CheckoutPage.ts',
    contents: [
      "import type { Page } from '@playwright/test';",
      'export class CheckoutPage {',
      '  constructor(private page: Page) {}',
      "  get phone() { return this.page.getByTestId('input-phone'); }",
      "  get placeOrder() { return this.page.getByTestId('place-order-btn'); }",
      '}',
    ].join('\n'),
  },
  spec: {
    path: 'specs/checkout.spec.ts',
    contents: [
      "import { expect, test } from '@playwright/test';",
      "test('accepts an international phone number', async ({ page }) => {",
      "  await page.getByTestId('input-phone').fill('+40 721 555 019');",
      "  await page.getByTestId('place-order-btn').click();",
      "  await expect(page.getByTestId('order-success')).toBeVisible();",
      '});',
    ].join('\n'),
  },
  testIds: ['input-phone', 'place-order-btn', 'order-success'],
};

/** Deep clone so each case starts from a known-good payload. */
const clone = () => JSON.parse(JSON.stringify(GOOD));

describe('SPRINT 2 — schema gate', () => {
  it('accepts a well-formed payload and names what is wrong with a bad one', () => {
    // --- The happy path ----------------------------------------------------
    expect(validateOutput(GOOD)).toEqual({ valid: true, errors: [] });

    // --- Structure ---------------------------------------------------------
    const noSpec = clone();
    delete noSpec.spec;
    const missing = validateOutput(noSpec);
    expect(missing.valid).toBe(false);
    expect(missing.errors.join('\n')).toContain('spec');

    const noContents = clone();
    delete noContents.spec.contents;
    expect(validateOutput(noContents).errors.join('\n')).toContain('contents');

    const badPath = clone();
    badPath.pageObject.path = '../../etc/passwd';
    expect(validateOutput(badPath).valid).toBe(false);

    expect(validateOutput(null).valid).toBe(false);
    expect(validateOutput('not an object').valid).toBe(false);

    // --- Locator rules — the TechShop constraint ---------------------------
    // The target app is hand-written HTML. A hashed class cannot exist there.
    const hashed = clone();
    hashed.spec.contents = hashed.spec.contents.replace(
      "page.getByTestId('place-order-btn')",
      "page.locator('.css-1a2b3c4')",
    );
    const hashedResult = validateOutput(hashed);
    expect(hashedResult.valid).toBe(false);
    expect(hashedResult.errors.join('\n')).toContain('data-testid');

    const framework = clone();
    framework.pageObject.contents += "\n// page.locator('[data-reactid=\"7\"]')";
    expect(validateOutput(framework).valid).toBe(false);

    // --- Cross-check -------------------------------------------------------
    // An id listed but never used means the model forgot its own selector.
    const orphan = clone();
    orphan.testIds.push('checkout-express-lane');
    const orphanResult = validateOutput(orphan);
    expect(orphanResult.valid).toBe(false);
    expect(orphanResult.errors.join('\n')).toContain('checkout-express-lane');

    // --- It reports everything at once, not just the first thing -----------
    const twoProblems = clone();
    delete twoProblems.testIds;
    twoProblems.spec.contents = "page.locator('.css-9z8y7x')";
    expect(validateOutput(twoProblems).errors.length).toBeGreaterThanOrEqual(2);

    // --- It never throws ---------------------------------------------------
    expect(() => validateOutput({ pageObject: 42 })).not.toThrow();
  });
});
