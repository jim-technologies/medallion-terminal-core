import type { Preview } from '@storybook/react'
import { createElement } from 'react'
import '../src/fonts/fonts.css'
import '../src/index.css'
import { DesignSystemProvider } from '../src/foundations'
import type { Density, PresentationTheme } from '../src/foundations'

const preview: Preview = {
  decorators: [
    // Every story renders inside the public provider, so the theme and
    // density toolbar globals reach toolkit components and Dashboards alike
    // (a Dashboard inherits the provider's theme). The canvas is the
    // workspace background token, never a hard-coded story colour.
    (Story, context) => createElement(
      DesignSystemProvider,
      {
        theme: context.globals.theme as PresentationTheme,
        density: context.globals.density as Density,
        children: createElement(
          'div',
          { className: 'mtc-workspace min-h-screen' },
          createElement(Story),
        ),
      },
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
    // Full-bleed canvas: the themed root owns the whole iframe, so no padded
    // white strip surrounds dark stories and screenshots are edge to edge.
    layout: 'fullscreen',
    // The themed root paints the canvas; the addon's fixed swatches would
    // only disagree with the active theme.
    backgrounds: { disable: true },
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
  },
}

export default preview
