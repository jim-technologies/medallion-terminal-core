import type { Meta, StoryObj } from '@storybook/react'
import { Trade } from './Trade'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof Trade> = {
  title: 'Widgets/Trade',
  component: Trade,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={{ ...DEFAULT_DASHBOARD_CONTEXT, ctx: { symbol: 'BTCUSDT' } }}>
        <div style={{ height: 300, width: 280, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 16, borderRadius: 'var(--mtc-radius-md)' }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Trade>

export const SpotTrade: Story = {
  args: { options: { url: '/api/orders', quote_unit: 'BTC', available: 0.842 } },
}

export const NoSymbol: Story = {
  args: { options: { url: '/api/orders' } },
}

export const NoUrl: Story = { args: { options: {} } }
