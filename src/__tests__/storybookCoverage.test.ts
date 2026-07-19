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

function storyFilesUnder(directory: URL): URL[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
    if (entry.isDirectory()) return storyFilesUnder(url)
    return entry.name.endsWith('.stories.tsx') ? [url] : []
  })
}

function storyMetaValue(source: string, key: string): string | undefined {
  return source.match(new RegExp(`${key}:\\s*['"]([^'"]+)['"]`))?.[1]
}

function cloneSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function cloneTitleBase(vendor: string, product: string): string | undefined {
  if (product === vendor) return `Clones/${vendor}`
  if (!product.startsWith(`${vendor} `)) return undefined
  return `Clones/${vendor}/${product.slice(vendor.length + 1)}`
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

  it('keeps product-faithful clone stories outside the core in vendor-first groups', () => {
    const cloneStories = storyFilesUnder(new URL('../../examples/clones/', import.meta.url))
    const titles: string[] = []
    const namespaces: string[] = []
    const vendors: string[] = []
    const products: string[] = []

    expect(cloneStories.length).toBeGreaterThan(0)
    for (const storyUrl of cloneStories) {
      const source = readFileSync(storyUrl, 'utf8')
      const title = storyMetaValue(source, 'title')
      const vendor = storyMetaValue(source, 'cloneVendor')
      const product = storyMetaValue(source, 'cloneProduct')
      const namespace = storyMetaValue(source, 'cloneNamespace')

      expect(title, `${storyUrl.pathname} must declare a story title`).toBeDefined()
      expect(
        vendor,
        `${storyUrl.pathname} must declare parameters.cloneVendor`,
      ).toMatch(/^[A-Za-z0-9][A-Za-z0-9 .&+-]*$/)
      expect(
        product,
        `${storyUrl.pathname} must declare parameters.cloneProduct`,
      ).toMatch(/^[A-Za-z0-9][A-Za-z0-9 .&+-]*$/)
      const titleBase = cloneTitleBase(vendor!, product!)
      expect(
        title === titleBase || title?.startsWith(`${titleBase}/`),
        `${storyUrl.pathname} must be grouped under its vendor and product`,
      ).toBe(true)
      expect(
        storyUrl.pathname,
        `${storyUrl.pathname} must live in the ${vendor} vendor directory`,
      ).toContain(`/examples/clones/${cloneSlug(vendor!)}/`)
      expect(
        namespace,
        `${storyUrl.pathname} must declare parameters.cloneNamespace`,
      ).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(source, `${storyUrl.pathname} must export at least one story`).toMatch(/^export const /m)

      titles.push(title!)
      namespaces.push(namespace!)
      vendors.push(vendor!)
      products.push(product!)
    }

    expect(new Set(titles).size, 'clone story titles must be unique').toBe(titles.length)
    expect(new Set(namespaces).size, 'clone namespaces must be unique').toBe(namespaces.length)
    expect(new Set(products).size, 'the catalog must cover several distinct products')
      .toBeGreaterThan(5)
    expect(vendors.filter(vendor => vendor === 'Google').length).toBe(6)
    expect(vendors.filter(vendor => vendor === 'Palantir').length).toBe(2)
  })
})
