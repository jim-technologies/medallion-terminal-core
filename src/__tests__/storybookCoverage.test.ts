import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Template } from '../types/template'
import { BUILTIN_KEYS } from '../core/WidgetRegistry'
import * as galleryExports from '../ExamplesGallery.stories'

interface ExampleStory {
  args: {
    template: Template
  }
  parameters: {
    exampleId: string
  }
}

function isExampleStory(value: unknown): value is ExampleStory {
  if (!value || typeof value !== 'object') return false
  const story = value as Partial<ExampleStory>
  return (
    typeof story.parameters?.exampleId === 'string'
    && Array.isArray(story.args?.template?.widgets)
  )
}

function widgetStoryModule(widget: string): string {
  if (widget === 'table') return 'DataTable'
  if (widget === 'orderbook') return 'OrderBook'
  return widget
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

describe('Storybook coverage', () => {
  it('displays every public example as one standalone dashboard story', () => {
    const publicExamples = readdirSync(new URL('../../public/examples/', import.meta.url))
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, ''))
      .sort()
    const stories = Object.values(galleryExports).filter(isExampleStory)
    const storyIds = stories.map(story => story.parameters.exampleId).sort()

    expect(storyIds).toEqual(publicExamples)
    expect(new Set(storyIds).size).toBe(storyIds.length)

    for (const story of stories) {
      const unresolved = story.args.template.widgets
        .filter(widget => widget.source?.source_id)
        .map(widget => `${widget.id ?? widget.component}:${widget.source?.source_id}`)

      expect(story.args.template.widgets.length, story.parameters.exampleId).toBeGreaterThan(0)
      expect(unresolved, `${story.parameters.exampleId} must render without a backend`).toEqual([])
    }
  })

  it('gives every built-in widget a discoverable, non-empty story module', () => {
    const widgetsDirectory = new URL('../widgets/', import.meta.url)

    for (const widget of BUILTIN_KEYS) {
      const moduleName = widgetStoryModule(widget)
      const storyUrl = new URL(`${moduleName}.stories.tsx`, widgetsDirectory)

      expect(existsSync(storyUrl), `${widget} is missing ${moduleName}.stories.tsx`).toBe(true)

      const source = readFileSync(storyUrl, 'utf8')
      const titlePattern = new RegExp(
        `title:\\s*['"]Widgets/(?:[^'"]*/)?${moduleName}['"]`,
      )
      expect(source, `${moduleName} must live under Widgets/ in the sidebar`).toMatch(titlePattern)
      expect(source, `${moduleName} must export at least one story`).toMatch(/^export const /m)
    }
  })
})
