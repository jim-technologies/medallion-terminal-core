import type { Preview } from '@storybook/react'
import { createElement } from 'react'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story) => createElement(
      'div',
      { className: 'mtc-root mtc-theme-dark', 'data-theme': 'dark' },
      createElement('div', { className: 'min-h-screen bg-zinc-950 text-zinc-100' }, createElement(Story)),
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'terminal',
      values: [
        { name: 'terminal', value: '#09090b' },
        { name: 'dark', value: '#18181b' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
}

export default preview
