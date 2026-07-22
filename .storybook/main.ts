import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../examples/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  features: {
    developmentModeForBuild: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
