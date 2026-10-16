import type { StorybookConfig } from '@storybook/react-vite'

const performancePhase = process.env.STORYBOOK_PERFORMANCE_PHASE === '1'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../examples/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  features: {
    developmentModeForBuild: !performancePhase,
    highlight: !performancePhase,
  },
  viteFinal: config => performancePhase
    ? { ...config, build: { ...config.build, sourcemap: 'hidden' } }
    : config,
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
