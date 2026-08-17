// design-review/playwright.hero-diff.config.js — standalone runner for
// capture-hero-diff.js (lesson 3.3.5). snapshotPathTemplate is pointed at the
// REAL tests/module3.spec.js-snapshots directory so 'homepage.png' resolves
// to the actual 3.2.4 baseline, not a snapshot dir of its own. viewport and
// expect defaults mirror the root playwright.config.js so the only source of
// diff is the injected bug, not an incidental size/animation mismatch.
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'capture-hero-diff.js',
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
    // threshold (pixelmatch's per-pixel perceptual sensitivity) is tightened
    // from the suite default (0.2) to 0.05: the injected bug swaps a dark
    // navy gradient for a similarly-dark solid navy, and the default
    // threshold treats that as imperceptible, letting the test pass despite
    // the DOM/CSS genuinely differing. This config exists solely to produce
    // a failing diff triple, so a tighter threshold is appropriate here even
    // though it isn't used by the real suite in tests/module3.spec.js.
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0, threshold: 0.05 },
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
