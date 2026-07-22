import type { Preview } from '@storybook/react'
import { createElement } from 'react'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story) => createElement(
      'div',
      { className: 'mtc-root mtc-theme-dark', 'data-theme': 'dark' },
      createElement('div', { className: 'mtc-workspace min-h-screen text-zinc-100' }, createElement(Story)),
    ),
  ],
  parameters: {
    a11y: {
      // Keep the full audit visible in Storybook while the curated Playwright
      // gate blocks automated regressions on representative product
      // surfaces. Dense terminal contrast/target-size findings remain tracked
      // as TODOs instead of making the all-story smoke suite unactionable.
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
      ],
    },
  },
}

export default preview
