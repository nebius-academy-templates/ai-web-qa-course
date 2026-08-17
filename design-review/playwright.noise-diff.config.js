// design-review/playwright.noise-diff.config.js — standalone runner for
// capture-noise-diff.js (lesson 3.3.6, rendering-noise case).
// snapshotPathTemplate is pointed at the REAL tests/module3.spec.js-snapshots
// directory so 'homepage.png' resolves to the actual 3.2.4 baseline.
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'capture-noise-diff.js',
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
    // maxDiffPixelRatio: 0 so this deliberately fails — the whole point is
    // a diff with no content change, just sub-pixel antialiasing noise.
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
