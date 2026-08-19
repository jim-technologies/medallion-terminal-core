import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const storyFiles = [
  '../foundations/DesignSystemProvider.stories.tsx',
  '../components/Controls.stories.tsx',
  '../components/Overlays.stories.tsx',
  '../components/Navigation.stories.tsx',
  '../workbench/Workbench.stories.tsx',
  '../workbench/Compositions.stories.tsx',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n')

const publicComponents = [
  'DesignSystemProvider',
  'Icon',
  'Button',
  'IconButton',
  'ButtonGroup',
  'Input',
  'TextArea',
  'FormField',
  'Checkbox',
  'Radio',
  'Switch',
  'Combobox',
  'Tag',
  'Badge',
  'Callout',
  'Tooltip',
  'Popover',
  'Menu',
  'ContextMenu',
  'Dialog',
  'Drawer',
  'Tabs',
  'Breadcrumbs',
  'AppSurface',
  'Toolbar',
  'Sidebar',
  'SplitPane',
  'Inspector',
  'PropertyList',
  'Tree',
  'EmptyState',
  'LoadingState',
  'ErrorState',
]

describe('application toolkit Storybook coverage', () => {
  for (const component of publicComponents) {
    it(`demonstrates ${component}`, () => {
      expect(storyFiles).toMatch(new RegExp(`<${component}(?:\\s|>)`))
    })
  }
})

