import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

// Flox's Nix ldd disagrees with the host ELF loader; real browser launches remain the gate.
if (process.platform === 'linux' && process.env.FLOX_ENV) process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= '1'

const storybookPort = Number(process.env.STORYBOOK_PORT ?? 6006)
if (!Number.isInteger(storybookPort) || storybookPort < 1 || storybookPort > 65535) {
  throw new Error('STORYBOOK_PORT must be a valid port number')
}
const storybookUrl = `http://127.0.0.1:${storybookPort}`
const workers = Number(process.env.PLAYWRIGHT_WORKERS ?? (process.env.CI ? 1 : 8))
if (!Number.isInteger(workers) || workers < 1 || workers > 32) {
  throw new Error('PLAYWRIGHT_WORKERS must be an integer from 1 to 32')
}
const shardInput = process.env.PLAYWRIGHT_SHARD
let shard: { current: number; total: number } | undefined
if (shardInput !== undefined) {
  const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(shardInput)
  const current = Number(match?.[1])
  const total = Number(match?.[2])
  if (!match || !Number.isSafeInteger(current) || !Number.isSafeInteger(total) || current > total) {
    throw new Error('PLAYWRIGHT_SHARD must be current/total with integers 1 <= current <= total')
  }
  shard = { current, total }
}
// Unset or `all` runs every project; public CI names the projects it runs.
const projectNames = ['chromium', 'firefox', 'webkit']
const projectInput = process.env.PLAYWRIGHT_PROJECTS
const selectedProjects = projectInput === undefined || projectInput === 'all' ? projectNames : projectInput.split(',')
if (selectedProjects.some(name => !projectNames.includes(name)) || new Set(selectedProjects).size !== selectedProjects.length) {
  throw new Error(`PLAYWRIGHT_PROJECTS must be all or distinct comma-separated names from ${projectNames.join(', ')}`)
}
const performancePhase = process.env.STORYBOOK_PERFORMANCE_PHASE === '1'
const historyFixturePort = Number(process.env.HISTORY_FIXTURE_PORT ?? 6216)
if (!Number.isInteger(historyFixturePort) || historyFixturePort < 1 || historyFixturePort > 65535 || historyFixturePort === storybookPort) throw new Error('HISTORY_FIXTURE_PORT must be a distinct valid port')
const audioFixturePort = Number(process.env.AUDIO_FIXTURE_PORT ?? 6217)
if (!Number.isInteger(audioFixturePort) || audioFixturePort < 1 || audioFixturePort > 65535 || audioFixturePort === storybookPort || audioFixturePort === historyFixturePort) throw new Error('AUDIO_FIXTURE_PORT must be a distinct valid port')

// Flox activation sets LD_AUDIT to its loader-audit library, and every browser
// process would inherit it. With it, Firefox content processes intermittently
// die on SIGSEGV during page creation ("browserContext.newPage: Target
// crashed"), and a stock browser looking for a library the host lacks would
// be handed this environment's Nix build, linked against a newer glibc than
// the host's. No browser needs it; global-setup.ts and the Vitest Storybook
// project launch Chromium without it too.
const browserEnv = { ...process.env, LD_AUDIT: undefined }

// On Linux x86-64, Firefox is nixpkgs' copy of Playwright's own build for this
// release, from the Flox environment (see .flox/env/manifest.toml). Firefox
// plays sound only through PulseAudio, and hosted CI runners have neither
// libpulse nor a sound server, so audio-only media failed there with
// MediaError 3 (OnMediaSinkAudioError). The stock build cannot load nixpkgs'
// libpulse, which needs a newer glibc than the host's; this build shares
// nixpkgs' loader with PulseAudio and FFmpeg (its H.264 and AAC decoders) from
// the same revision. As nixpkgs' own Firefox wrapper does, only Firefox gets
// their library directories, and it plays into the private null sink that
// scripts/browser-audio serves.
let firefoxLaunch: { executablePath?: string, env: NodeJS.ProcessEnv } = { env: browserEnv }
const audioServers = []
if (process.platform === 'linux' && process.arch === 'x64' && selectedProjects.includes('firefox')) {
  const root = process.env.FLOX_ENV ?? ''
  const executablePath = join(root, 'firefox/firefox')
  const libraries = ['lib/libpulse.so.0', 'lib/libavcodec.so.63'].map(library => join(root, library))
  if (!root || ![executablePath, ...libraries].every(path => existsSync(path))) {
    throw new Error('Linux x86-64 Firefox and its PulseAudio and FFmpeg libraries come from the Flox environment: run inside flox activate')
  }
  const requireFrom = createRequire(createRequire(createRequire(import.meta.url).resolve('@playwright/test/package.json')).resolve('playwright/package.json'))
  const browsers = JSON.parse(readFileSync(join(dirname(requireFrom.resolve('playwright-core/package.json')), 'browsers.json'), 'utf8')) as { browsers: { name: string, browserVersion?: string }[] }
  const expected = browsers.browsers.find(browser => browser.name === 'firefox')?.browserVersion
  const actual = /^Version=(.+)$/m.exec(readFileSync(join(root, 'firefox/application.ini'), 'utf8'))?.[1]
  if (!expected || actual !== expected) {
    throw new Error(`The Flox environment's Firefox ${actual} does not match Playwright's ${expected}: move its nixpkgs revision with @playwright/test`)
  }
  firefoxLaunch = {
    executablePath,
    env: {
      ...browserEnv,
      LD_LIBRARY_PATH: libraries.map(library => dirname(realpathSync(library))).join(':'),
      PULSE_SERVER: `tcp:127.0.0.1:${audioFixturePort}`,
      PULSE_CLIENTCONFIG: '/dev/null',
      // Otherwise libpulse reads, or creates, the user's ~/.config/pulse/cookie.
      // The sink takes anonymous clients, so any cookie will do.
      PULSE_COOKIE: fileURLToPath(new URL('test-results/browser-audio.cookie', import.meta.url)),
    },
  }
  audioServers.push({
    command: `scripts/browser-audio ${audioFixturePort}`,
    port: audioFixturePort,
    reuseExistingServer: false,
    timeout: 30_000,
    gracefulShutdown: { signal: 'SIGTERM' as const, timeout: 5_000 },
  })
}

export default defineConfig({
  testDir: './browser-tests',
  // Runs after the web servers are up and before any worker starts.
  globalSetup: './browser-tests/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Playwright recommends one CI worker for stability; local concurrency stays bounded.
  workers,
  shard,
  reporter: process.env.GITHUB_ACTIONS
    ? [['line'], ['html', { open: 'never' }], ['github']]
    : process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'line',
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
    screen: undefined,
    baseURL: storybookUrl,
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    // Toolkit transitions (opacity, colour) collapse to zero under reduced
    // motion, so axe never samples a control mid-transition after load.
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    launchOptions: { env: browserEnv },
  },
  webServer: [{
    command: performancePhase
      ? `rm -rf storybook-performance && pnpm exec storybook build --output-dir storybook-performance && pnpm exec vite preview --outDir storybook-performance --host 127.0.0.1 --port ${storybookPort} --strictPort`
      : `rm -rf storybook-static && pnpm build:storybook && pnpm exec vite preview --outDir storybook-static --host 127.0.0.1 --port ${storybookPort} --strictPort`,
    url: `${storybookUrl}/index.json`,
    reuseExistingServer: false,
    timeout: 120_000,
  }, {
    command: `pnpm exec vite --host 127.0.0.1 --port ${historyFixturePort} --strictPort`,
    url: `http://127.0.0.1:${historyFixturePort}/browser-tests/fixtures/history.html`,
    reuseExistingServer: false,
    timeout: 120_000,
  }, ...audioServers],
  // Keep the device descriptor in the shared `use` block so its default
  // viewport cannot silently override the explicit regression viewport.
  projects: [
    { name: 'chromium' },
    {
      name: 'firefox',
      testMatch: /(?:data-grid-behaviour|data-grid-pagination|keyboard-behaviour|scroll-restoration|grid-preferences|stat-tile-behaviour|product-fetch|media-preview)\.spec\.ts/,
      use: { browserName: 'firefox', launchOptions: firefoxLaunch },
    },
    { name: 'webkit', testMatch: /(?:data-grid-behaviour|data-grid-pagination|keyboard-behaviour|scroll-restoration|grid-preferences|stat-tile-behaviour|product-fetch|media-preview)\.spec\.ts/, use: { browserName: 'webkit' } },
  ].filter(project => selectedProjects.includes(project.name)),
})
