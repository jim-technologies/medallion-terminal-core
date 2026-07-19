import { describe, expect, it } from 'vitest'
import businessOperations from '../../public/examples/business-operations.json'
import cryptoWatch from '../../public/examples/crypto-watch.json'
import fileBrowser from '../../public/examples/file-browser.json'
import logisticsOps from '../../public/examples/logistics-ops.json'
import medallionTerminal from '../../public/examples/medallion-terminal.json'
import optionsDesk from '../../public/examples/options-desk.json'
import platformFoundation from '../../public/examples/platform-foundation.json'
import predictionMarket from '../../public/examples/prediction-market.json'
import spotMarket from '../../public/examples/spot-market.json'
import tradingFloor from '../../public/examples/trading-floor.json'
import workManagement from '../../public/examples/work-management.json'
import mediaLibrary from '../../public/examples/media-library.json'
import { BUILTIN_KEYS } from '../core/WidgetRegistry'

interface ExampleTemplate {
  widgets: Array<{ component: string }>
}

function components(...templates: ExampleTemplate[]): Set<string> {
  return new Set(
    templates.flatMap(template => template.widgets.map(widget => widget.component)),
  )
}

// Regression contract for the requested product archetypes. These are
// capability-level compositions, not vendor layouts or trade dress. A missing
// component here means an example no longer proves the presentation layer it
// is supposed to cover.
const SURFACES: Array<{
  name: string
  components: Set<string>
  required: string[]
}> = [
  {
    name: 'governed data and ontology platform',
    components: components(platformFoundation, businessOperations, workManagement),
    required: [
      'asset_catalog',
      'object_view',
      'dag',
      'geo_map',
      'action_form',
      'code_browser',
      'record_grid',
      'record_board',
      'record_calendar',
      'record_form',
    ],
  },
  {
    name: 'cloud file workspace',
    components: components(fileBrowser),
    required: ['file_browser', 'metric', 'text', 'action_log'],
  },
  {
    name: 'personal and business media library',
    components: components(mediaLibrary, fileBrowser),
    required: ['media_gallery', 'file_browser', 'stat_strip', 'distribution', 'text'],
  },
  {
    name: 'SME business and productivity workspace',
    components: components(
      businessOperations,
      workManagement,
      fileBrowser,
      mediaLibrary,
    ),
    required: [
      'stat_strip',
      'timeseries',
      'gauge',
      'table',
      'heatmap',
      'events',
      'text',
      'record_grid',
      'record_board',
      'record_calendar',
      'record_form',
      'file_browser',
      'media_gallery',
      'action_log',
    ],
  },
  {
    name: 'location-aware operations and timeline',
    components: components(logisticsOps, mediaLibrary),
    required: ['geo_map', 'stat_strip', 'heatmap', 'treemap', 'area_chart', 'events', 'table', 'media_gallery'],
  },
  {
    name: 'spot exchange',
    components: components(spotMarket),
    required: ['stat_strip', 'candlestick', 'orderbook', 'depth_chart', 'trade', 'events', 'table'],
  },
  {
    name: 'market intelligence portal',
    components: components(cryptoWatch),
    required: ['metric', 'candlestick', 'gauge', 'table', 'text'],
  },
  {
    name: 'prediction market',
    components: components(predictionMarket),
    required: ['stat_strip', 'gauge', 'distribution', 'timeseries', 'depth_chart', 'trade', 'events'],
  },
  {
    name: 'multi-asset brokerage workstation',
    components: components(medallionTerminal, tradingFloor, optionsDesk, spotMarket),
    required: [
      'stat_strip',
      'table',
      'candlestick',
      'orderbook',
      'depth_chart',
      'paired_grid',
      'trade',
      'action_log',
      'tape',
      'heatmap',
      'treemap',
      'volume_profile',
      'text',
    ],
  },
]

describe('product-surface readiness', () => {
  for (const surface of SURFACES) {
    it(`${surface.name} has a complete reference composition`, () => {
      for (const component of surface.required) {
        expect(
          surface.components.has(component),
          `${surface.name} example composition is missing ${component}`,
        ).toBe(true)
        expect(
          BUILTIN_KEYS.has(component),
          `${component} is not registered as a built-in`,
        ).toBe(true)
      }
    })
  }

  it('keeps built-in names vendor-neutral', () => {
    const vendorNames = ['palantir', 'google', 'binance', 'coingecko', 'polymarket', 'ibkr']
    for (const component of BUILTIN_KEYS) {
      expect(vendorNames.some(vendor => component.includes(vendor))).toBe(false)
    }
  })
})
