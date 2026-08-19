import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Unit tests deliberately stay in Node. Storybook stories form a separate
// project that renders every story in Chromium and executes any play function.
export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        extends: true,
        // Stories import the JSON fixtures from public/examples so the exact
        // deployed templates are tested. Disable Vite's public-dir import
        // warning in this in-memory suite; the normal Storybook build still
        // serves public/ for image and media assets.
        publicDir: false,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook --ci --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          isolate: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            // Story files share one non-isolated Storybook preview. Serial
            // files keep React act boundaries deterministic when lazy widgets
            // resolve under load, while individual play steps remain fast.
            fileParallelism: false,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}))
