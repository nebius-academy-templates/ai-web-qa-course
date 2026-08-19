// design-review/playwright.config.js — standalone runner for design-conformance
// captures. Lives outside tests/ on purpose: these are one-off comparison
// screenshots for manual design review, not part of the graded test suite.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  // Capture scripts here are named capture-*.js, not *.test.js/*.spec.js,
  // so they don't match Playwright's default filename pattern.
  testMatch: 'capture-*.js',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4300',
    headless: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx serve . -p 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env.CI,
    timeout: 20000,
    cwd: __dirname + '/..',
  },
});
