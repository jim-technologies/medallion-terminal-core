import type { Meta, StoryObj } from '@storybook/react'
import { AlertLog } from './AlertLog'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT, type AlertLogEntry } from '../core/DashboardContext'

const now = Date.now()
const sample: AlertLogEntry[] = [
  { receivedAt: now -  3_000, widgetId: 'btc-price',  severity: 'error', message: 'BTC crossed 70k on heavy volume', predicate: 'value > 70000 && volume > 1e8' },
  { receivedAt: now - 28_000, widgetId: 'eth-spot',   severity: 'warn',  message: 'ETH approaching 3500',             predicate: 'value > 3400' },
  { receivedAt: now - 64_000, widgetId: 'fills',      severity: 'warn',  message: 'Slippage exceeded 30 bps',         predicate: 'rows.0.slippage_bps > 30' },
  { receivedAt: now -180_000, widgetId: 'sentiment',  severity: 'info',  message: 'Sentiment flipped bullish',        predicate: 'value > 0.6' },
  { receivedAt: now -380_000, widgetId: 'stop',       severity: 'ok',    message: 'Stop-loss tightened',              predicate: 'value > 67500' },
]

const meta: Meta<typeof AlertLog> = {
  title: 'Widgets/AlertLog',
  component: AlertLog,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={{ ...DEFAULT_DASHBOARD_CONTEXT, recentAlerts: sample }}>
        <div style={{ height: 320, width: 520, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof AlertLog>

export const Populated: Story = { args: {} }
export const Empty_: Story = {
  name: 'Empty',
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <div style={{ height: 320, width: 520, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
  args: {},
}
