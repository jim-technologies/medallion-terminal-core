import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  PRODUCT_ARCHETYPE_CATALOG,
  PRODUCT_SHOWCASE_IDS,
  ProductArchetypeShowcase,
  productShowcaseViews,
  resolveProductShowcaseView,
  type ProductShowcaseId,
} from '../../examples/clones/shared/archetypes/ProductArchetypeShowcase'

const EXPECTED_PRODUCTS: readonly ProductShowcaseId[] = [
  'google-gmail',
  'microsoft-outlook',
  'notion',
  'atlassian-confluence',
  'linear',
  'atlassian-jira',
  'github',
  'gitlab',
  'binance',
  'coingecko',
  'polymarket',
  'interactive-brokers-trader-workstation',
  'grafana-labs-grafana',
  'apache-superset',
  'meta-whatsapp',
  'openai-chatgpt',
]

describe('shared product archetype showcases', () => {
  it('catalogs every remaining named product exactly once', () => {
    expect(PRODUCT_SHOWCASE_IDS).toEqual(EXPECTED_PRODUCTS)
    expect(Object.keys(PRODUCT_ARCHETYPE_CATALOG)).toEqual(EXPECTED_PRODUCTS)
    expect(new Set(PRODUCT_SHOWCASE_IDS).size).toBe(PRODUCT_SHOWCASE_IDS.length)

    for (const id of PRODUCT_SHOWCASE_IDS) {
      const definition = PRODUCT_ARCHETYPE_CATALOG[id]
      expect(definition.id).toBe(id)
      expect(definition.views).toContain(definition.defaultView)
      expect(definition.product === definition.vendor || definition.product.startsWith(`${definition.vendor} `))
        .toBe(true)
    }
  })

  it('resolves supported views and safely falls back to each product default', () => {
    for (const id of PRODUCT_SHOWCASE_IDS) {
      const views = productShowcaseViews(id)
      const lastView = views[views.length - 1]
      expect(views.length).toBeGreaterThanOrEqual(3)
      expect(resolveProductShowcaseView(id, lastView)).toBe(lastView)
      expect(resolveProductShowcaseView(id, 'not-a-view')).toBe(PRODUCT_ARCHETYPE_CATALOG[id].defaultView)
      expect(resolveProductShowcaseView(id)).toBe(PRODUCT_ARCHETYPE_CATALOG[id].defaultView)
    }
  })

  it('server-renders every product and every documented state', () => {
    for (const id of PRODUCT_SHOWCASE_IDS) {
      for (const view of productShowcaseViews(id)) {
        const html = renderToStaticMarkup(
          <ProductArchetypeShowcase product={id} initialView={view} />,
        )
        expect(html, `${id}/${view}`).toContain(`data-product="${id}"`)
        expect(html, `${id}/${view}`).toContain(`data-view="${view}"`)
        expect(html, `${id}/${view}`).toContain(PRODUCT_ARCHETYPE_CATALOG[id].shortName)
        expect(html, `${id}/${view}`).toContain('Jun')
      }
    }
  })

  it('keeps each archetype recognizable while using original fixture content', () => {
    const expectedCopy: Record<ProductShowcaseId, string> = {
      'google-gmail': 'Search mail',
      'microsoft-outlook': 'Focused',
      notion: '2026 Operating plan',
      'atlassian-confluence': 'knowledge hub',
      linear: 'My issues',
      'atlassian-jira': 'Platform delivery',
      github: 'Pull requests 4',
      gitlab: 'Merge requests 4',
      binance: 'Order book',
      coingecko: 'Cryptocurrency prices by market cap',
      polymarket: 'What will happen next?',
      'interactive-brokers-trader-workstation': 'Order entry',
      'grafana-labs-grafana': 'Service throughput',
      'apache-superset': 'Net revenue',
      'meta-whatsapp': 'Operations team',
      'openai-chatgpt': 'Recommended sequence',
    }

    for (const id of PRODUCT_SHOWCASE_IDS) {
      const html = renderToStaticMarkup(<ProductArchetypeShowcase product={id} />)
      expect(html, id).toContain(expectedCopy[id])
      expect(html, id).toContain('Jim Technologies')
    }
  })
})
