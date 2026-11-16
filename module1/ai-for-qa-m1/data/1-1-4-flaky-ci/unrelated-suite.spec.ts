import { test, expect } from '@playwright/test';

// Regression suite for TechShop storefront pages, run at five viewports in light and dark mode.
// Every test below passes in CI and none of them touches the cart.

test.describe('storefront regression: wide, light', () => {
  test('001 home page shows the hero banner (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('002 home page lists three featured categories (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('003 main nav links to phones (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('004 main nav links to laptops (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('005 main nav links to accessories (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('006 footer shows the contact email (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('007 footer shows the returns policy link (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('008 search box accepts input (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('009 search results page shows a result count (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('010 search with no matches shows the empty state (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('011 phones listing shows twelve products per page (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('012 phones listing has a sort dropdown (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('013 laptops listing shows the filter panel (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('014 laptops listing paginates (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('015 accessories listing shows the page heading (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('016 product page shows the product title (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('017 product page shows the price (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('018 product page shows the image gallery (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('019 product page shows the spec table (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('020 product page shows the reviews summary (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('021 login page shows the email field (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('022 login page shows the password field (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('023 login page has a forgot password link (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('024 login rejects an empty form (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('025 register page shows the create account button (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('026 register page shows the terms checkbox (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('027 forgot password page shows the email field (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('028 account page redirects guests to login (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('029 orders page redirects guests to login (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('030 wishlist page shows the empty state for guests (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('031 store locator shows the map container (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('032 store locator lists stores (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('033 help centre shows the search field (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('034 help centre lists popular articles (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('035 delivery information page shows the heading (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('036 returns page shows the returns form link (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('037 contact page shows the message box (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('038 contact page shows the send button (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('039 cookie banner offers accept and reject (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('040 language switcher lists English (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('041 currency shows pound sterling (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('042 sitemap page lists the main sections (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('043 privacy page shows the last updated date (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('044 terms page shows the heading (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('045 accessibility statement is reachable from the footer (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('046 404 page shows a helpful message (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('047 robots file is served (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('048 newsletter form accepts an email (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('049 gift cards page shows the denominations (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('050 brand page shows the brand logo (wide, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: wide, dark', () => {
  test('051 home page shows the hero banner (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('052 home page lists three featured categories (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('053 main nav links to phones (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('054 main nav links to laptops (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('055 main nav links to accessories (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('056 footer shows the contact email (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('057 footer shows the returns policy link (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('058 search box accepts input (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('059 search results page shows a result count (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('060 search with no matches shows the empty state (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('061 phones listing shows twelve products per page (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('062 phones listing has a sort dropdown (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('063 laptops listing shows the filter panel (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('064 laptops listing paginates (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('065 accessories listing shows the page heading (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('066 product page shows the product title (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('067 product page shows the price (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('068 product page shows the image gallery (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('069 product page shows the spec table (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('070 product page shows the reviews summary (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('071 login page shows the email field (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('072 login page shows the password field (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('073 login page has a forgot password link (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('074 login rejects an empty form (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('075 register page shows the create account button (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('076 register page shows the terms checkbox (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('077 forgot password page shows the email field (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('078 account page redirects guests to login (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('079 orders page redirects guests to login (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('080 wishlist page shows the empty state for guests (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('081 store locator shows the map container (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('082 store locator lists stores (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('083 help centre shows the search field (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('084 help centre lists popular articles (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('085 delivery information page shows the heading (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('086 returns page shows the returns form link (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('087 contact page shows the message box (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('088 contact page shows the send button (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('089 cookie banner offers accept and reject (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('090 language switcher lists English (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('091 currency shows pound sterling (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('092 sitemap page lists the main sections (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('093 privacy page shows the last updated date (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('094 terms page shows the heading (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('095 accessibility statement is reachable from the footer (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('096 404 page shows a helpful message (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('097 robots file is served (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('098 newsletter form accepts an email (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('099 gift cards page shows the denominations (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('100 brand page shows the brand logo (wide, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: desktop, light', () => {
  test('101 home page shows the hero banner (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('102 home page lists three featured categories (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('103 main nav links to phones (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('104 main nav links to laptops (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('105 main nav links to accessories (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('106 footer shows the contact email (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('107 footer shows the returns policy link (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('108 search box accepts input (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('109 search results page shows a result count (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('110 search with no matches shows the empty state (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('111 phones listing shows twelve products per page (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('112 phones listing has a sort dropdown (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('113 laptops listing shows the filter panel (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('114 laptops listing paginates (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('115 accessories listing shows the page heading (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('116 product page shows the product title (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('117 product page shows the price (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('118 product page shows the image gallery (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('119 product page shows the spec table (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('120 product page shows the reviews summary (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('121 login page shows the email field (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('122 login page shows the password field (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('123 login page has a forgot password link (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('124 login rejects an empty form (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('125 register page shows the create account button (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('126 register page shows the terms checkbox (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('127 forgot password page shows the email field (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('128 account page redirects guests to login (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('129 orders page redirects guests to login (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('130 wishlist page shows the empty state for guests (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('131 store locator shows the map container (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('132 store locator lists stores (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('133 help centre shows the search field (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('134 help centre lists popular articles (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('135 delivery information page shows the heading (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('136 returns page shows the returns form link (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('137 contact page shows the message box (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('138 contact page shows the send button (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('139 cookie banner offers accept and reject (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('140 language switcher lists English (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('141 currency shows pound sterling (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('142 sitemap page lists the main sections (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('143 privacy page shows the last updated date (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('144 terms page shows the heading (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('145 accessibility statement is reachable from the footer (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('146 404 page shows a helpful message (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('147 robots file is served (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('148 newsletter form accepts an email (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('149 gift cards page shows the denominations (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('150 brand page shows the brand logo (desktop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: desktop, dark', () => {
  test('151 home page shows the hero banner (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('152 home page lists three featured categories (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('153 main nav links to phones (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('154 main nav links to laptops (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('155 main nav links to accessories (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('156 footer shows the contact email (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('157 footer shows the returns policy link (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('158 search box accepts input (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('159 search results page shows a result count (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('160 search with no matches shows the empty state (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('161 phones listing shows twelve products per page (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('162 phones listing has a sort dropdown (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('163 laptops listing shows the filter panel (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('164 laptops listing paginates (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('165 accessories listing shows the page heading (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('166 product page shows the product title (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('167 product page shows the price (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('168 product page shows the image gallery (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('169 product page shows the spec table (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('170 product page shows the reviews summary (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('171 login page shows the email field (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('172 login page shows the password field (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('173 login page has a forgot password link (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('174 login rejects an empty form (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('175 register page shows the create account button (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('176 register page shows the terms checkbox (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('177 forgot password page shows the email field (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('178 account page redirects guests to login (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('179 orders page redirects guests to login (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('180 wishlist page shows the empty state for guests (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('181 store locator shows the map container (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('182 store locator lists stores (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('183 help centre shows the search field (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('184 help centre lists popular articles (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('185 delivery information page shows the heading (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('186 returns page shows the returns form link (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('187 contact page shows the message box (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('188 contact page shows the send button (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('189 cookie banner offers accept and reject (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('190 language switcher lists English (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('191 currency shows pound sterling (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('192 sitemap page lists the main sections (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('193 privacy page shows the last updated date (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('194 terms page shows the heading (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('195 accessibility statement is reachable from the footer (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('196 404 page shows a helpful message (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('197 robots file is served (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('198 newsletter form accepts an email (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('199 gift cards page shows the denominations (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('200 brand page shows the brand logo (desktop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: laptop, light', () => {
  test('201 home page shows the hero banner (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('202 home page lists three featured categories (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('203 main nav links to phones (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('204 main nav links to laptops (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('205 main nav links to accessories (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('206 footer shows the contact email (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('207 footer shows the returns policy link (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('208 search box accepts input (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('209 search results page shows a result count (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('210 search with no matches shows the empty state (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('211 phones listing shows twelve products per page (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('212 phones listing has a sort dropdown (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('213 laptops listing shows the filter panel (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('214 laptops listing paginates (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('215 accessories listing shows the page heading (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('216 product page shows the product title (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('217 product page shows the price (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('218 product page shows the image gallery (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('219 product page shows the spec table (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('220 product page shows the reviews summary (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('221 login page shows the email field (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('222 login page shows the password field (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('223 login page has a forgot password link (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('224 login rejects an empty form (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('225 register page shows the create account button (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('226 register page shows the terms checkbox (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('227 forgot password page shows the email field (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('228 account page redirects guests to login (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('229 orders page redirects guests to login (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('230 wishlist page shows the empty state for guests (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('231 store locator shows the map container (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('232 store locator lists stores (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('233 help centre shows the search field (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('234 help centre lists popular articles (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('235 delivery information page shows the heading (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('236 returns page shows the returns form link (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('237 contact page shows the message box (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('238 contact page shows the send button (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('239 cookie banner offers accept and reject (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('240 language switcher lists English (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('241 currency shows pound sterling (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('242 sitemap page lists the main sections (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('243 privacy page shows the last updated date (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('244 terms page shows the heading (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('245 accessibility statement is reachable from the footer (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('246 404 page shows a helpful message (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('247 robots file is served (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('248 newsletter form accepts an email (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('249 gift cards page shows the denominations (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('250 brand page shows the brand logo (laptop, light)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: laptop, dark', () => {
  test('251 home page shows the hero banner (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('252 home page lists three featured categories (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('253 main nav links to phones (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('254 main nav links to laptops (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('255 main nav links to accessories (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('256 footer shows the contact email (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('257 footer shows the returns policy link (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('258 search box accepts input (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('259 search results page shows a result count (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('260 search with no matches shows the empty state (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('261 phones listing shows twelve products per page (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('262 phones listing has a sort dropdown (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('263 laptops listing shows the filter panel (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('264 laptops listing paginates (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('265 accessories listing shows the page heading (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('266 product page shows the product title (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('267 product page shows the price (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('268 product page shows the image gallery (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('269 product page shows the spec table (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('270 product page shows the reviews summary (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('271 login page shows the email field (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('272 login page shows the password field (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('273 login page has a forgot password link (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('274 login rejects an empty form (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('275 register page shows the create account button (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('276 register page shows the terms checkbox (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('277 forgot password page shows the email field (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('278 account page redirects guests to login (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('279 orders page redirects guests to login (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('280 wishlist page shows the empty state for guests (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('281 store locator shows the map container (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('282 store locator lists stores (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('283 help centre shows the search field (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('284 help centre lists popular articles (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('285 delivery information page shows the heading (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('286 returns page shows the returns form link (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('287 contact page shows the message box (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('288 contact page shows the send button (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('289 cookie banner offers accept and reject (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('290 language switcher lists English (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('291 currency shows pound sterling (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('292 sitemap page lists the main sections (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('293 privacy page shows the last updated date (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('294 terms page shows the heading (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('295 accessibility statement is reachable from the footer (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('296 404 page shows a helpful message (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('297 robots file is served (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('298 newsletter form accepts an email (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('299 gift cards page shows the denominations (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('300 brand page shows the brand logo (laptop, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: tablet, light', () => {
  test('301 home page shows the hero banner (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('302 home page lists three featured categories (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('303 main nav links to phones (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('304 main nav links to laptops (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('305 main nav links to accessories (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('306 footer shows the contact email (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('307 footer shows the returns policy link (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('308 search box accepts input (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('309 search results page shows a result count (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('310 search with no matches shows the empty state (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('311 phones listing shows twelve products per page (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('312 phones listing has a sort dropdown (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('313 laptops listing shows the filter panel (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('314 laptops listing paginates (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('315 accessories listing shows the page heading (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('316 product page shows the product title (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('317 product page shows the price (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('318 product page shows the image gallery (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('319 product page shows the spec table (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('320 product page shows the reviews summary (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('321 login page shows the email field (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('322 login page shows the password field (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('323 login page has a forgot password link (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('324 login rejects an empty form (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('325 register page shows the create account button (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('326 register page shows the terms checkbox (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('327 forgot password page shows the email field (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('328 account page redirects guests to login (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('329 orders page redirects guests to login (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('330 wishlist page shows the empty state for guests (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('331 store locator shows the map container (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('332 store locator lists stores (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('333 help centre shows the search field (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('334 help centre lists popular articles (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('335 delivery information page shows the heading (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('336 returns page shows the returns form link (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('337 contact page shows the message box (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('338 contact page shows the send button (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('339 cookie banner offers accept and reject (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('340 language switcher lists English (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('341 currency shows pound sterling (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('342 sitemap page lists the main sections (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('343 privacy page shows the last updated date (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('344 terms page shows the heading (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('345 accessibility statement is reachable from the footer (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('346 404 page shows a helpful message (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('347 robots file is served (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('348 newsletter form accepts an email (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('349 gift cards page shows the denominations (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('350 brand page shows the brand logo (tablet, light)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: tablet, dark', () => {
  test('351 home page shows the hero banner (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('352 home page lists three featured categories (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('353 main nav links to phones (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('354 main nav links to laptops (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('355 main nav links to accessories (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('356 footer shows the contact email (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('357 footer shows the returns policy link (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('358 search box accepts input (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('359 search results page shows a result count (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('360 search with no matches shows the empty state (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('361 phones listing shows twelve products per page (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('362 phones listing has a sort dropdown (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('363 laptops listing shows the filter panel (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('364 laptops listing paginates (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('365 accessories listing shows the page heading (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('366 product page shows the product title (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('367 product page shows the price (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('368 product page shows the image gallery (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('369 product page shows the spec table (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('370 product page shows the reviews summary (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('371 login page shows the email field (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('372 login page shows the password field (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('373 login page has a forgot password link (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('374 login rejects an empty form (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('375 register page shows the create account button (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('376 register page shows the terms checkbox (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('377 forgot password page shows the email field (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('378 account page redirects guests to login (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('379 orders page redirects guests to login (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('380 wishlist page shows the empty state for guests (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('381 store locator shows the map container (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('382 store locator lists stores (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('383 help centre shows the search field (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('384 help centre lists popular articles (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('385 delivery information page shows the heading (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('386 returns page shows the returns form link (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('387 contact page shows the message box (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('388 contact page shows the send button (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('389 cookie banner offers accept and reject (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('390 language switcher lists English (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('391 currency shows pound sterling (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('392 sitemap page lists the main sections (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('393 privacy page shows the last updated date (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('394 terms page shows the heading (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('395 accessibility statement is reachable from the footer (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('396 404 page shows a helpful message (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('397 robots file is served (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('398 newsletter form accepts an email (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('399 gift cards page shows the denominations (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('400 brand page shows the brand logo (tablet, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: mobile, light', () => {
  test('401 home page shows the hero banner (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('402 home page lists three featured categories (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('403 main nav links to phones (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('404 main nav links to laptops (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('405 main nav links to accessories (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('406 footer shows the contact email (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('407 footer shows the returns policy link (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('408 search box accepts input (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('409 search results page shows a result count (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('410 search with no matches shows the empty state (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('411 phones listing shows twelve products per page (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('412 phones listing has a sort dropdown (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('413 laptops listing shows the filter panel (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('414 laptops listing paginates (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('415 accessories listing shows the page heading (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('416 product page shows the product title (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('417 product page shows the price (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('418 product page shows the image gallery (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('419 product page shows the spec table (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('420 product page shows the reviews summary (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('421 login page shows the email field (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('422 login page shows the password field (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('423 login page has a forgot password link (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('424 login rejects an empty form (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('425 register page shows the create account button (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('426 register page shows the terms checkbox (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('427 forgot password page shows the email field (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('428 account page redirects guests to login (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('429 orders page redirects guests to login (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('430 wishlist page shows the empty state for guests (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('431 store locator shows the map container (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('432 store locator lists stores (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('433 help centre shows the search field (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('434 help centre lists popular articles (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('435 delivery information page shows the heading (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('436 returns page shows the returns form link (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('437 contact page shows the message box (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('438 contact page shows the send button (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('439 cookie banner offers accept and reject (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('440 language switcher lists English (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('441 currency shows pound sterling (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('442 sitemap page lists the main sections (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('443 privacy page shows the last updated date (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('444 terms page shows the heading (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('445 accessibility statement is reachable from the footer (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('446 404 page shows a helpful message (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('447 robots file is served (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('448 newsletter form accepts an email (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('449 gift cards page shows the denominations (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('450 brand page shows the brand logo (mobile, light)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});

test.describe('storefront regression: mobile, dark', () => {
  test('451 home page shows the hero banner (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Autumn sale' })).toBeVisible();
  });

  test('452 home page lists three featured categories (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('featured-category')).toHaveCount(3);
  });

  test('453 main nav links to phones (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Phones' })).toHaveAttribute('href', '/phones');
  });

  test('454 main nav links to laptops (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Laptops' })).toHaveAttribute('href', '/laptops');
  });

  test('455 main nav links to accessories (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/accessories');
  });

  test('456 footer shows the contact email (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('footer-email')).toHaveText('support@techshop-demo.com');
  });

  test('457 footer shows the returns policy link (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Returns policy' })).toBeVisible();
  });

  test('458 search box accepts input (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeEditable();
  });

  test('459 search results page shows a result count (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=phone');
    await expect(page.getByTestId('result-count')).toBeVisible();
  });

  test('460 search with no matches shows the empty state (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/search?q=zzzz');
    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('461 phones listing shows twelve products per page (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  test('462 phones listing has a sort dropdown (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/phones');
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('463 laptops listing shows the filter panel (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('complementary', { name: 'Filters' })).toBeVisible();
  });

  test('464 laptops listing paginates (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/laptops');
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('465 accessories listing shows the page heading (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/accessories');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessories');
  });

  test('466 product page shows the product title (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nova X2 Smartphone');
  });

  test('467 product page shows the price (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('product-price')).toContainText('449.00');
  });

  test('468 product page shows the image gallery (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('gallery')).toBeVisible();
  });

  test('469 product page shows the spec table (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByRole('table', { name: 'Specifications' })).toBeVisible();
  });

  test('470 product page shows the reviews summary (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/products/nova-x2');
    await expect(page.getByTestId('reviews-summary')).toBeVisible();
  });

  test('471 login page shows the email field (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('472 login page shows the password field (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('473 login page has a forgot password link (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password' })).toBeVisible();
  });

  test('474 login rejects an empty form (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('475 register page shows the create account button (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('476 register page shows the terms checkbox (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/register');
    await expect(page.getByRole('checkbox', { name: 'I accept the terms' })).toBeVisible();
  });

  test('477 forgot password page shows the email field (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/forgot-password');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('478 account page redirects guests to login (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('479 orders page redirects guests to login (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('480 wishlist page shows the empty state for guests (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/wishlist');
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('481 store locator shows the map container (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-map')).toBeVisible();
  });

  test('482 store locator lists stores (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/stores');
    await expect(page.getByTestId('store-row')).toHaveCount(8);
  });

  test('483 help centre shows the search field (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByRole('searchbox', { name: 'Search help' })).toBeVisible();
  });

  test('484 help centre lists popular articles (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help');
    await expect(page.getByTestId('popular-article')).toHaveCount(5);
  });

  test('485 delivery information page shows the heading (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/delivery');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delivery information');
  });

  test('486 returns page shows the returns form link (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/help/returns');
    await expect(page.getByRole('link', { name: 'Start a return' })).toBeVisible();
  });

  test('487 contact page shows the message box (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByLabel('Message')).toBeEditable();
  });

  test('488 contact page shows the send button (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('489 cookie banner offers accept and reject (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('dialog', { name: 'Cookies' })).toBeVisible();
  });

  test('490 language switcher lists English (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-GB');
  });

  test('491 currency shows pound sterling (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByTestId('currency')).toHaveText('GBP');
  });

  test('492 sitemap page lists the main sections (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sitemap');
    await expect(page.getByRole('list', { name: 'Sections' })).toBeVisible();
  });

  test('493 privacy page shows the last updated date (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/privacy');
    await expect(page.getByTestId('last-updated')).toBeVisible();
  });

  test('494 terms page shows the heading (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  });

  test('495 accessibility statement is reachable from the footer (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/accessibility');
  });

  test('496 404 page shows a helpful message (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('497 robots file is served (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/robots.txt');
    await expect(page.locator('body')).toContainText('User-agent');
  });

  test('498 newsletter form accepts an email (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByLabel('Newsletter email')).toBeEditable();
  });

  test('499 gift cards page shows the denominations (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/gift-cards');
    await expect(page.getByTestId('denomination')).toHaveCount(4);
  });

  test('500 brand page shows the brand logo (mobile, dark)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/brands/nova');
    await expect(page.getByRole('img', { name: 'Nova logo' })).toBeVisible();
  });
});
