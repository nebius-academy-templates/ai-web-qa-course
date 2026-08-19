// design-review/playwright.logo-diff.config.js — standalone runner for
// capture-logo-diff.js (lesson 3.3.6, case 1). snapshotPathTemplate is
// pointed at the REAL tests/module3.spec.js-snapshots directory so
// 'homepage.png' resolves to the actual 3.2.4 baseline. viewport and expect
// defaults match the root playwright.config.js unchanged — bug-hide-logo
// removes a high-contrast element, so the suite's default sensitivity is
// enough to catch it (unlike bug-hero-gradient, see capture-hero-diff.js).
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'capture-logo-diff.js',
  snapshotPathTemplate: path.join(
    __dirname, '..', 'tests', 'module3.spec.js-snapshots',
    '{arg}-{projectName}-{platform}{ext}'
  ),
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4300',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    // maxDiffPixelRatio tightened from the suite default (0.01): the logo
    // is a small fraction of the full-page screenshot area, so even fully
    // hiding it stays under a 1% ratio and the test passes despite the
    // element genuinely being gone. This config exists solely to produce a
    // failing diff triple, so 0 tolerance is appropriate here.
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx serve . -p 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env.CI,
    timeout: 20000,
    cwd: path.join(__dirname, '..'),
  },
});
