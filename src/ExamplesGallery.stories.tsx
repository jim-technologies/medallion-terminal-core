import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './core/Dashboard'
import type { Template } from './types/template'

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

// Side-effect: registers the Kelly widget so the sports-betting story
// renders the kelly component instead of falling back to Placeholder.
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

// These two need a running TerminalService backend. Pass backendUrl
// via the story controls (or run `pnpm backend` and override).
// Without a backend, source_id widgets will show error states; the
// layout and any inline widgets still render.
export const SportsBetting    = story(sportsBetting,    'http://localhost:3001')
export const ReferenceBackend = story(referenceBackend, 'http://localhost:3001')
