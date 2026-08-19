import type { Preview } from '@storybook/react'
import { createElement } from 'react'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story, context) => createElement(
      'div',
      {
        className: `mtc-root mtc-theme-${context.globals.theme}`,
        'data-theme': context.globals.theme,
        'data-density': context.globals.density,
      },
      createElement('div', { className: 'mtc-workspace min-h-screen text-zinc-100' }, createElement(Story)),
    ),
  ],
  initialGlobals: {
    theme: 'dark',
    density: 'comfortable',
  },
  globalTypes: {
    theme: {
      description: 'Scoped Terminal Core presentation',
      toolbar: {
        icon: 'paintbrush',
        items: ['dark', 'operator', 'light', 'high-contrast'],
      },
    },
    density: {
      description: 'Scoped Terminal Core density',
      toolbar: {
        icon: 'outline',
        items: ['comfortable', 'compact'],
      },
    },
  },
  parameters: {
    a11y: {
      // Keep the full audit visible in Storybook while the curated Playwright
      // gate blocks automated regressions on representative product
      // surfaces. Dense terminal contrast/target-size findings remain visible
      // in the addon panel while the curated browser gate owns enforcement.
      test: 'todo',
      options: {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      },
    },
    backgrounds: {
      default: 'graphite',
      values: [
        { name: 'graphite', value: '#0a0d10' },
        { name: 'operator', value: '#080a09' },
        { name: 'light', value: '#f3f5f6' },
        { name: 'high contrast', value: '#000000' },
      ],
    },
  },
}

export default preview
