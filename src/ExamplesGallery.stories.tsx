import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './core/Dashboard'
import type { Template, WidgetConfig } from './types/template'

import cryptoWatch from '../public/examples/crypto-watch.json'
import tradingFloor from '../public/examples/trading-floor.json'
import predictionMarket from '../public/examples/prediction-market.json'
import botOperator from '../public/examples/bot-operator.json'
import optionsDesk from '../public/examples/options-desk.json'
import binanceClone from '../public/examples/binance-clone.json'
import uniswapClone from '../public/examples/uniswap-clone.json'
import grafanaOps from '../public/examples/grafana-ops.json'
import workflowOrchestrator from '../public/examples/workflow-orchestrator.json'
import mlMonitoring from '../public/examples/ml-monitoring.json'
import logisticsOps from '../public/examples/logistics-ops.json'
import clinicalIcu from '../public/examples/clinical-icu.json'
import energyGrid from '../public/examples/energy-grid.json'
import sportsBetting from '../public/examples/sports-betting.json'
import referenceBackend from '../public/examples/reference-backend.json'

import '../examples/widgets/registry'

const meta: Meta<typeof Dashboard> = {
  title: 'Examples',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Dashboard>

const story = (template: unknown, backendUrl?: string): Story => ({
  args: { template: template as Template, backendUrl },
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
      return { ...w, source: { ...w.source, source_id: undefined, inline: samples[sid] } }
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
        timestamp: new Date(Date.now() - (30 - i) * 60_000).toISOString(),
        open: Math.round(base),
        high: Math.round(base + 60),
        low: Math.round(base - 50),
        close: Math.round(base + 20),
        volume: 2 + Math.random() * 3,
      }
    }),
  },
  btc_orderbook: {
    bids: Array.from({ length: 8 }, (_, i) => ({ price: 67_840 - i * 2, size: Math.random() * 2 + 0.5 })),
    asks: Array.from({ length: 8 }, (_, i) => ({ price: 67_844 + i * 2, size: Math.random() * 2 + 0.5 })),
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

export const CryptoWatch          = story(cryptoWatch)
export const TradingFloor         = story(tradingFloor)
export const PredictionMarket     = story(predictionMarket)
export const BotOperator          = story(botOperator)
export const OptionsDesk          = story(optionsDesk)
export const BinancePair          = story(binanceClone)
export const UniswapPool          = story(uniswapClone)
export const GrafanaOps           = story(grafanaOps)
export const WorkflowOrchestrator = story(workflowOrchestrator)
export const MLMonitoring         = story(mlMonitoring)
export const Logistics            = story(logisticsOps)
export const ClinicalICU          = story(clinicalIcu)
export const EnergyGrid           = story(energyGrid)
export const SportsBetting        = story(inlineFallback(sportsBetting as Template, sportsBettingSamples))
export const ReferenceBackend     = story(inlineFallback(referenceBackend as Template, referenceBackendSamples))
