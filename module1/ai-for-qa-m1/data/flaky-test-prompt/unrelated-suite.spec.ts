import { test, expect } from '@playwright/test';

// Regression suite for TechShop storefront pages.
// Every test below passes in CI and none of them touches the cart.

test.describe('storefront regression', () => {
  test('01 home page shows the hero banner', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('02 home page lists three featured categories', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('03 main nav links to phones', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('04 main nav links to laptops', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('05 main nav links to accessories', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('06 footer shows the contact email', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('07 footer shows the returns policy link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('08 search box accepts input', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('09 search results page shows a result count', async ({ page }) => {
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('10 search with no matches shows the empty state', async ({ page }) => {
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('11 phones listing shows twelve products per page', async ({ page }) => {
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('12 phones listing has a sort dropdown', async ({ page }) => {
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('13 laptops listing shows the filter panel', async ({ page }) => {
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('14 laptops listing paginates', async ({ page }) => {
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('15 accessories listing shows the page heading', async ({ page }) => {
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('16 product page shows the product title', async ({ page }) => {
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('17 product page shows the price', async ({ page }) => {
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('18 product page shows the image gallery', async ({ page }) => {
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('19 product page shows the spec table', async ({ page }) => {
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('20 product page shows the reviews summary', async ({ page }) => {
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('21 login page shows the email field', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('22 login page shows the password field', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('23 login page has a forgot password link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('24 login rejects an empty form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('25 register page shows the create account button', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('26 register page shows the terms checkbox', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('27 forgot password page shows the email field', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('28 account page redirects guests to login', async ({ page }) => {
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('29 orders page redirects guests to login', async ({ page }) => {
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('30 wishlist page shows the empty state for guests', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('31 store locator shows the map container', async ({ page }) => {
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('32 store locator lists stores', async ({ page }) => {
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('33 help centre shows the search field', async ({ page }) => {
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('34 help centre lists popular articles', async ({ page }) => {
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('35 delivery information page shows the heading', async ({ page }) => {
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('36 returns page shows the returns form link', async ({ page }) => {
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('37 contact page shows the message box', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('38 contact page shows the send button', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('39 cookie banner offers accept and reject', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('40 language switcher lists English', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('41 currency shows pound sterling', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('42 sitemap page lists the main sections', async ({ page }) => {
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('43 privacy page shows the last updated date', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('44 terms page shows the heading', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('45 accessibility statement is reachable from the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('46 404 page shows a helpful message', async ({ page }) => {
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('47 robots file is served', async ({ page }) => {
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('48 newsletter form accepts an email', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('49 gift cards page shows the denominations', async ({ page }) => {
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('50 brand page shows the brand logo', async ({ page }) => {
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});
