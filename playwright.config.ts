import { defineConfig, devices } from '@playwright/test'

// Flox's Nix ldd disagrees with the host ELF loader; real browser launches remain the gate.
if (process.platform === 'linux' && process.env.FLOX_ENV) process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= '1'

const storybookPort = Number(process.env.STORYBOOK_PORT ?? 6006)
if (!Number.isInteger(storybookPort) || storybookPort < 1 || storybookPort > 65535) {
  throw new Error('STORYBOOK_PORT must be a valid port number')
}
const storybookUrl = `http://127.0.0.1:${storybookPort}`
const historyFixturePort = Number(process.env.HISTORY_FIXTURE_PORT ?? 6216)
if (!Number.isInteger(historyFixturePort) || historyFixturePort < 1 || historyFixturePort > 65535 || historyFixturePort === storybookPort) throw new Error('HISTORY_FIXTURE_PORT must be a distinct valid port')

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
    baseURL: storybookUrl,
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    // Toolkit transitions (opacity, colour) collapse to zero under reduced
    // motion, so axe never samples a control mid-transition after load.
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: [{
    command: `pnpm exec storybook dev -p ${storybookPort} --ci --no-open --exact-port`,
    url: `${storybookUrl}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  }, {
    command: `pnpm exec vite --host 127.0.0.1 --port ${historyFixturePort} --strictPort`,
    url: `http://127.0.0.1:${historyFixturePort}/browser-tests/fixtures/history.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  }],
  // Keep the device descriptor in the shared `use` block so its default
  // viewport cannot silently override the explicit regression viewport.
  projects: [
    { name: 'chromium' },
    { name: 'firefox', testMatch: /(?:data-grid-behaviour|data-grid-pagination|keyboard-behaviour|scroll-restoration|grid-preferences)\.spec\.ts/, use: { browserName: 'firefox' } },
    { name: 'webkit', testMatch: /(?:data-grid-behaviour|data-grid-pagination|keyboard-behaviour|scroll-restoration|grid-preferences)\.spec\.ts/, use: { browserName: 'webkit' } },
  ],
})
