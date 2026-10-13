// Deterministic generator for data/flaky-test-prompt/unrelated-suite.spec.ts.
// No randomness: output depends only on the tables below, so every run is byte-identical.
// The output is committed; learners never need to run this.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'data', 'flaky-test-prompt', 'unrelated-suite.spec.ts');

type Case = { title: string; path: string; locator: string; expected: string };

// 50 regression tests that never touch the cart or its badge.
const cases: Case[] = [
  { title: 'home page shows the hero banner', path: '/', locator: "getByRole('img', { name: 'Autumn sale' })", expected: 'toBeVisible()' },
  { title: 'home page lists three featured categories', path: '/', locator: "getByTestId('featured-category')", expected: 'toHaveCount(3)' },
  { title: 'main nav links to phones', path: '/', locator: "getByRole('link', { name: 'Phones' })", expected: "toHaveAttribute('href', '/phones')" },
  { title: 'main nav links to laptops', path: '/', locator: "getByRole('link', { name: 'Laptops' })", expected: "toHaveAttribute('href', '/laptops')" },
  { title: 'main nav links to accessories', path: '/', locator: "getByRole('link', { name: 'Accessories' })", expected: "toHaveAttribute('href', '/accessories')" },
  { title: 'footer shows the contact email', path: '/', locator: "getByTestId('footer-email')", expected: "toHaveText('support@techshop-demo.com')" },
  { title: 'footer shows the returns policy link', path: '/', locator: "getByRole('link', { name: 'Returns policy' })", expected: 'toBeVisible()' },
  { title: 'search box accepts input', path: '/', locator: "getByRole('searchbox')", expected: "toBeEditable()" },
  { title: 'search results page shows a result count', path: '/search?q=phone', locator: "getByTestId('result-count')", expected: 'toBeVisible()' },
  { title: 'search with no matches shows the empty state', path: '/search?q=zzzz', locator: "getByText('No products found')", expected: 'toBeVisible()' },
  { title: 'phones listing shows twelve products per page', path: '/phones', locator: "getByTestId('product-card')", expected: 'toHaveCount(12)' },
  { title: 'phones listing has a sort dropdown', path: '/phones', locator: "getByLabel('Sort by')", expected: 'toBeVisible()' },
  { title: 'laptops listing shows the filter panel', path: '/laptops', locator: "getByRole('complementary', { name: 'Filters' })", expected: 'toBeVisible()' },
  { title: 'laptops listing paginates', path: '/laptops', locator: "getByRole('navigation', { name: 'Pagination' })", expected: 'toBeVisible()' },
  { title: 'accessories listing shows the page heading', path: '/accessories', locator: "getByRole('heading', { level: 1 })", expected: "toHaveText('Accessories')" },
  { title: 'product page shows the product title', path: '/products/nova-x2', locator: "getByRole('heading', { level: 1 })", expected: "toHaveText('Nova X2 Smartphone')" },
  { title: 'product page shows the price', path: '/products/nova-x2', locator: "getByTestId('product-price')", expected: "toContainText('449.00')" },
  { title: 'product page shows the image gallery', path: '/products/nova-x2', locator: "getByTestId('gallery')", expected: 'toBeVisible()' },
  { title: 'product page shows the spec table', path: '/products/nova-x2', locator: "getByRole('table', { name: 'Specifications' })", expected: 'toBeVisible()' },
  { title: 'product page shows the reviews summary', path: '/products/nova-x2', locator: "getByTestId('reviews-summary')", expected: 'toBeVisible()' },
  { title: 'login page shows the email field', path: '/login', locator: "getByLabel('Email address')", expected: 'toBeVisible()' },
  { title: 'login page shows the password field', path: '/login', locator: "getByLabel('Password')", expected: 'toBeVisible()' },
  { title: 'login page has a forgot password link', path: '/login', locator: "getByRole('link', { name: 'Forgot password' })", expected: 'toBeVisible()' },
  { title: 'login rejects an empty form', path: '/login', locator: "getByRole('button', { name: 'Sign in' })", expected: 'toBeEnabled()' },
  { title: 'register page shows the create account button', path: '/register', locator: "getByRole('button', { name: 'Create account' })", expected: 'toBeVisible()' },
  { title: 'register page shows the terms checkbox', path: '/register', locator: "getByRole('checkbox', { name: 'I accept the terms' })", expected: 'toBeVisible()' },
  { title: 'forgot password page shows the email field', path: '/forgot-password', locator: "getByLabel('Email address')", expected: 'toBeVisible()' },
  { title: 'account page redirects guests to login', path: '/account', locator: "getByRole('heading', { name: 'Sign in' })", expected: 'toBeVisible()' },
  { title: 'orders page redirects guests to login', path: '/account/orders', locator: "getByRole('heading', { name: 'Sign in' })", expected: 'toBeVisible()' },
  { title: 'wishlist page shows the empty state for guests', path: '/wishlist', locator: "getByText('Your wishlist is empty')", expected: 'toBeVisible()' },
  { title: 'store locator shows the map container', path: '/stores', locator: "getByTestId('store-map')", expected: 'toBeVisible()' },
  { title: 'store locator lists stores', path: '/stores', locator: "getByTestId('store-row')", expected: 'toHaveCount(8)' },
  { title: 'help centre shows the search field', path: '/help', locator: "getByRole('searchbox', { name: 'Search help' })", expected: 'toBeVisible()' },
  { title: 'help centre lists popular articles', path: '/help', locator: "getByTestId('popular-article')", expected: 'toHaveCount(5)' },
  { title: 'delivery information page shows the heading', path: '/help/delivery', locator: "getByRole('heading', { level: 1 })", expected: "toHaveText('Delivery information')" },
  { title: 'returns page shows the returns form link', path: '/help/returns', locator: "getByRole('link', { name: 'Start a return' })", expected: 'toBeVisible()' },
  { title: 'contact page shows the message box', path: '/contact', locator: "getByLabel('Message')", expected: 'toBeEditable()' },
  { title: 'contact page shows the send button', path: '/contact', locator: "getByRole('button', { name: 'Send message' })", expected: 'toBeVisible()' },
  { title: 'cookie banner offers accept and reject', path: '/', locator: "getByRole('dialog', { name: 'Cookies' })", expected: 'toBeVisible()' },
  { title: 'language switcher lists English', path: '/', locator: "getByRole('combobox', { name: 'Language' })", expected: "toHaveValue('en-GB')" },
  { title: 'currency shows pound sterling', path: '/', locator: "getByTestId('currency')", expected: "toHaveText('GBP')" },
  { title: 'sitemap page lists the main sections', path: '/sitemap', locator: "getByRole('list', { name: 'Sections' })", expected: 'toBeVisible()' },
  { title: 'privacy page shows the last updated date', path: '/privacy', locator: "getByTestId('last-updated')", expected: 'toBeVisible()' },
  { title: 'terms page shows the heading', path: '/terms', locator: "getByRole('heading', { level: 1 })", expected: "toHaveText('Terms of use')" },
  { title: 'accessibility statement is reachable from the footer', path: '/', locator: "getByRole('link', { name: 'Accessibility' })", expected: "toHaveAttribute('href', '/accessibility')" },
  { title: '404 page shows a helpful message', path: '/no-such-page', locator: "getByRole('heading', { name: 'Page not found' })", expected: 'toBeVisible()' },
  { title: 'robots file is served', path: '/robots.txt', locator: "locator('body')", expected: "toContainText('User-agent')" },
  { title: 'newsletter form accepts an email', path: '/', locator: "getByLabel('Newsletter email')", expected: 'toBeEditable()' },
  { title: 'gift cards page shows the denominations', path: '/gift-cards', locator: "getByTestId('denomination')", expected: 'toHaveCount(4)' },
  { title: 'brand page shows the brand logo', path: '/brands/nova', locator: "getByRole('img', { name: 'Nova logo' })", expected: 'toBeVisible()' },
];

if (cases.length !== 50) throw new Error(`expected 50 cases, got ${cases.length}`);

const header = `import { test, expect } from '@playwright/test';

// Regression suite for TechShop storefront pages.
// Every test below passes in CI and none of them touches the cart.

test.describe('storefront regression', () => {
`;

const body = cases
  .map(
    (c, i) => `  test('${String(i + 1).padStart(2, '0')} ${c.title}', async ({ page }) => {
    await page.goto('${c.path}');
    await expect(page.${c.locator}).${c.expected};
  });
`,
  )
  .join('\n');

writeFileSync(out, `${header}${body}});\n`);
console.log(`wrote ${out}`);
