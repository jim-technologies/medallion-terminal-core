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
