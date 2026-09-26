import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './browser-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Keep the local Storybook dev server below its transform/concurrency limit.
  // Unbounded local workers can turn transient Storybook error pages into
  // misleading accessibility and screenshot failures as the catalog grows.
  workers: process.env.CI ? 2 : 8,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'line',
  // Text snapshots: the exact accessibility tree of each visual baseline
  // story (see expectBaseline in the spec).
  snapshotPathTemplate: '{testDir}/__aria__/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      pathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
      animations: 'disabled',
      maxDiffPixelRatio: 0.003,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:6006',
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    // Toolkit transitions (opacity, colour) collapse to zero under reduced
    // motion, so axe never samples a control mid-transition after load.
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm storybook --ci --no-open',
    url: 'http://127.0.0.1:6006/index.json',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  // Keep the device descriptor in the shared `use` block so its default
  // viewport cannot silently override the explicit regression viewport.
  projects: [{ name: 'chromium' }],
})
