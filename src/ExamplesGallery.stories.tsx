import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './core/Dashboard'
import type { Template, WidgetConfig } from './types/template'

import medallionTerminal from '../public/examples/medallion-terminal.json'
import cryptoWatch from '../public/examples/crypto-watch.json'
import tradingFloor from '../public/examples/trading-floor.json'
import predictionMarket from '../public/examples/prediction-market.json'
import botOperator from '../public/examples/bot-operator.json'
import optionsDesk from '../public/examples/options-desk.json'
import spotMarket from '../public/examples/spot-market.json'
import liquidityPool from '../public/examples/liquidity-pool.json'
import serviceOps from '../public/examples/service-ops.json'
import auditTrail from '../public/examples/audit-trail.json'
import workflowOrchestrator from '../public/examples/workflow-orchestrator.json'
import mlMonitoring from '../public/examples/ml-monitoring.json'
import logisticsOps from '../public/examples/logistics-ops.json'
import clinicalIcu from '../public/examples/clinical-icu.json'
import energyGrid from '../public/examples/energy-grid.json'
import sportsBetting from '../public/examples/sports-betting.json'
import referenceBackend from '../public/examples/reference-backend.json'
import platformFoundation from '../public/examples/platform-foundation.json'
import businessOperations from '../public/examples/business-operations.json'
import workManagement from '../public/examples/work-management.json'
import mediaLibrary from '../public/examples/media-library.json'
import fileBrowser from '../public/examples/file-browser.json'
import communicationsHub from '../public/examples/communications-hub.json'
import { RECORD_SET_STORY_DATA } from './widgets/recordStories.fixture'

import '../examples/widgets/registry'

const meta: Meta<typeof Dashboard> = {
  title: 'Examples/Complete Dashboards',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component: 'Standalone, full-dashboard examples built from the JSON templates in public/examples.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Dashboard>

const story = (exampleId: string, template: unknown, backendUrl?: string): Story => ({
  args: { template: template as Template, backendUrl },
  parameters: { exampleId },
})

// For dashboards that drive widgets via `source_id`, the deployed
// Storybook can't reach a real TerminalService backend (HTTPS Pages
// → HTTP localhost is mixed-content blocked). Swap each `source_id`
// for an inline sample so the gallery renders standalone. Backend-
// driven versions are still served from public/examples/ for the
// `pnpm backend && pnpm dev` flow.
function inlineFallback(template: Template, samples: Record<string, unknown>): Template {
  return {
    ...template,
    widgets: template.widgets.map((w: WidgetConfig) => {
      const sid = w.source?.source_id
      if (!sid || !(sid in samples)) return w
      return { ...w, source: { inline: samples[sid] } }
    }),
  }
}

const sportsBettingSamples: Record<string, unknown> = {
  bankroll: { value: 10_000, unit: 'USD', label: 'available' },
  nba_spread: {
    paired_grid: {
      subject: 'Lakers vs Celtics',
      dimension: 'Spread (pts)',
      subject_value: -3.5,
      venue: 'reference',
      left_label: 'Lakers',
      right_label: 'Celtics',
      key_label: 'Line',
      measures: [{ key: 'odds', label: 'Odds', format: 'number' }],
      rows: [
        { key: -7.5, left: { values: { odds: 2.45 } }, right: { values: { odds: 1.62 } } },
        { key: -5.5, left: { values: { odds: 2.10 } }, right: { values: { odds: 1.78 } } },
        { key: -3.5, left: { values: { odds: 1.95 } }, right: { values: { odds: 1.91 } } },
        { key: -1.5, left: { values: { odds: 1.88 } }, right: { values: { odds: 2.00 } } },
        { key:  0,   left: { values: { odds: 1.83 } }, right: { values: { odds: 2.05 } } },
        { key:  1.5, left: { values: { odds: 1.78 } }, right: { values: { odds: 2.12 } } },
        { key:  3.5, left: { values: { odds: 1.65 } }, right: { values: { odds: 2.35 } } },
        { key:  5.5, left: { values: { odds: 1.55 } }, right: { values: { odds: 2.55 } } },
        { key:  7.5, left: { values: { odds: 1.42 } }, right: { values: { odds: 2.85 } } },
      ],
    },
  },
}

const referenceBackendSamples: Record<string, unknown> = {
  btc_spot: { value: 67_842, delta: 0.0036, unit: 'USD' },
  fills: {
    events: [
      { timestamp: '15:02:14', label: 'BUY  0.045 @ 67,842', status: 'EVENT_STATUS_OK', source: 'reference' },
      { timestamp: '15:02:11', label: 'SELL 0.120 @ 67,841', status: 'EVENT_STATUS_OK', source: 'reference' },
      { timestamp: '15:02:08', label: 'BUY  0.024 @ 67,842', status: 'EVENT_STATUS_OK', source: 'reference' },
    ],
  },
  btc_candles: {
    bars: Array.from({ length: 30 }, (_, i) => {
      const base = 67_500 + Math.sin(i / 4) * 200
      return {
        timestamp: new Date(Date.parse('2026-07-17T15:00:00Z') - (29 - i) * 60_000).toISOString(),
        open: Math.round(base),
        high: Math.round(base + 60),
        low: Math.round(base - 50),
        close: Math.round(base + 20),
        volume: 2 + (i % 6) * 0.45,
      }
    }),
  },
  btc_orderbook: {
    bids: Array.from({ length: 8 }, (_, i) => ({ price: 67_840 - i * 2, size: 0.65 + i * 0.18 })),
    asks: Array.from({ length: 8 }, (_, i) => ({ price: 67_844 + i * 2, size: 0.72 + i * 0.16 })),
    mid: 67_842, spread: 4, venue: 'reference',
  },
  btc_options: sportsBettingSamples.nba_spread, // shape-compatible filler
  news: {
    items: [
      { title: 'BTC pulls back from intraday high', body: 'Order flow data shows aggressive selling at the round number.', source: 'WireSim', date: 'just now' },
      { title: 'ETF inflows continue', body: 'Net inflows of $48M reported across the major spot ETFs.', source: 'WireSim', date: '5m ago' },
    ],
  },
}

const fileBrowserSamples: Record<string, unknown> = {
  files: {
    entries: [
      { kind: 'folder', name: 'finance' },
      { kind: 'folder', name: 'photos' },
      { kind: 'folder', name: 'projects' },
      {
        kind: 'file',
        name: 'company-handbook.pdf',
        size_bytes: 2_480_128,
        content_type: 'application/pdf',
        modified_at: '2026-07-16T18:32:00Z',
      },
      {
        kind: 'file',
        name: 'customer-export.csv',
        size_bytes: 864_320,
        content_type: 'text/csv',
        modified_at: '2026-07-16T16:08:00Z',
      },
      {
        kind: 'file',
        name: 'launch-notes.md',
        size_bytes: 12_904,
        content_type: 'text/markdown',
        modified_at: '2026-07-15T21:14:00Z',
      },
    ],
  },
}

const platformSamples: Record<string, unknown> = {
  platform_assets: {
    total: 4,
    items: [
      {
        id: 'dataset.customer_360',
        name: 'Customer 360',
        kind: 'dataset',
        owner: 'growth-data',
        status: 'healthy',
        description: 'Curated customer, account, product, and engagement facts.',
        tags: ['gold', 'pii'],
        metadata: { rows: '18.4M', quality: '99.7%' },
      },
      {
        id: 'object_type.Customer',
        name: 'Customer',
        kind: 'object_type',
        owner: 'ontology',
        status: 'published',
        description: 'Semantic customer type with governed properties, links, and actions.',
        tags: ['ontology'],
      },
      {
        id: 'pipeline.customer_features',
        name: 'Customer features',
        kind: 'pipeline',
        owner: 'ml-platform',
        status: 'warning',
        metadata: { schedule: 'hourly', freshness: '18m' },
      },
      {
        id: 'repository.analytics',
        name: 'analytics',
        kind: 'repository',
        owner: 'data-platform',
        status: 'active',
        context: { repository: 'analytics', repo_ref: 'main', repo_path: '' },
      },
    ],
  },
  platform_object: {
    object_type: 'dataset',
    object_id: 'dataset.customer_360',
    title: 'Customer 360',
    description: 'Curated customer, account, product, and engagement facts.',
    status: 'healthy',
    tags: ['gold', 'pii'],
    properties: [
      { key: 'owner', label: 'Owner', value: 'growth-data', group: 'Governance' },
      { key: 'classification', label: 'Classification', value: 'restricted', group: 'Governance' },
      { key: 'rows', label: 'Rows', value: 18400000, format: 'compact', group: 'Technical' },
      { key: 'quality', label: 'Quality', value: 0.997, format: 'percent', group: 'Technical' },
    ],
    links: [
      { relation: 'upstream', target_type: 'dataset', target_id: 'dataset.clean_orders', label: 'Clean orders' },
      { relation: 'used by', target_type: 'model', target_id: 'model.churn_v4', label: 'Churn risk v4' },
    ],
    actions: [
      { id: 'acknowledge_asset', label: 'Acknowledge', style: 'primary' },
      { id: 'request_asset_review', label: 'Request review', confirm: true },
    ],
  },
  platform_lineage: {
    nodes: [
      { id: 'dataset.raw_orders', label: 'raw_orders', kind: 'dataset', status: 'ok', subtitle: 'bronze' },
      { id: 'dataset.clean_orders', label: 'clean_orders', kind: 'dataset', status: 'ok', subtitle: 'silver' },
      { id: 'dataset.customer_360', label: 'customer_360', kind: 'dataset', status: 'info', subtitle: 'gold' },
      { id: 'pipeline.customer_features', label: 'customer_features', kind: 'pipeline', status: 'running', subtitle: 'hourly' },
      { id: 'model.churn_v4', label: 'churn_v4', kind: 'model', status: 'ok', subtitle: 'production' },
    ],
    edges: [
      { from: 'dataset.raw_orders', to: 'dataset.clean_orders', label: 'normalize' },
      { from: 'dataset.clean_orders', to: 'dataset.customer_360', label: 'join' },
      { from: 'dataset.customer_360', to: 'pipeline.customer_features', label: 'features' },
      { from: 'pipeline.customer_features', to: 'model.churn_v4', label: 'score' },
    ],
  },
  platform_repository: {
    repository: 'analytics',
    ref: 'main',
    path: 'src/customer.ts',
    refs: ['main', 'release/2026.07'],
    entries: [
      { path: 'src/customer.ts', name: 'customer.ts', kind: 'REPOSITORY_ENTRY_KIND_FILE', language: 'typescript', size_bytes: 278 },
      { path: 'src/index.ts', name: 'index.ts', kind: 'REPOSITORY_ENTRY_KIND_FILE', language: 'typescript', size_bytes: 52 },
      { path: 'src/types.ts', name: 'types.ts', kind: 'REPOSITORY_ENTRY_KIND_FILE', language: 'typescript', size_bytes: 96 },
    ],
    file: {
      path: 'src/customer.ts',
      language: 'typescript',
      content: [
        "import type { Customer } from './types.js'",
        '',
        'export function customerHealth(customer: Customer): number {',
        '  const usage = Math.min(customer.activeUsers / customer.seats, 1)',
        '  return Math.max(0, usage - customer.openCases * 0.05)',
        '}',
      ].join('\n'),
    },
  },
}

const workManagementStatic = inlineFallback(workManagement as Template, {
  business_records: RECORD_SET_STORY_DATA,
})

export const MedallionTerminal    = story('medallion-terminal', medallionTerminal)
export const BusinessOperations   = story('business-operations', businessOperations)
export const WorkManagement       = story('work-management', workManagementStatic)
export const MediaLibrary         = story('media-library', mediaLibrary)
export const CommunicationsHub    = story('communications-hub', communicationsHub)
export const FileBrowser          = story('file-browser', inlineFallback(fileBrowser as Template, fileBrowserSamples))
export const WorkManagementOperator: Story = {
  args: { template: workManagementStatic, theme: 'operator' },
}
export const WorkManagementLight: Story = {
  args: { template: workManagementStatic, theme: 'light' },
}
export const OperatorTheme: Story = {
  args: { template: businessOperations as Template, theme: 'operator' },
}
export const CryptoWatch          = story('crypto-watch', cryptoWatch)
export const TradingFloor         = story('trading-floor', tradingFloor)
export const PredictionMarket     = story('prediction-market', predictionMarket)
export const BotOperator          = story('bot-operator', botOperator)
export const OptionsDesk          = story('options-desk', optionsDesk)
export const SpotMarket           = story('spot-market', spotMarket)
export const LiquidityPool        = story('liquidity-pool', liquidityPool)
export const ServiceOps           = story('service-ops', serviceOps)
export const AuditTrail           = story('audit-trail', auditTrail)
export const WorkflowOrchestrator = story('workflow-orchestrator', workflowOrchestrator)
export const MLMonitoring         = story('ml-monitoring', mlMonitoring)
export const LogisticsOps         = story('logistics-ops', logisticsOps)
export const ClinicalICU          = story('clinical-icu', clinicalIcu)
export const EnergyGrid           = story('energy-grid', energyGrid)
export const SportsBetting        = story(
  'sports-betting',
  inlineFallback(sportsBetting as Template, sportsBettingSamples),
)
export const ReferenceBackend     = story(
  'reference-backend',
  inlineFallback(referenceBackend as Template, referenceBackendSamples),
)
export const PlatformFoundation   = story(
  'platform-foundation',
  inlineFallback(platformFoundation as Template, platformSamples),
)
