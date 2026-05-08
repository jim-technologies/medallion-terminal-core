import type { Meta, StoryObj } from '@storybook/react'
import { Trade } from './Trade'
import { DashboardContext } from '../core/DashboardContext'

const meta: Meta<typeof Trade> = {
  title: 'Widgets/Trade',
  component: Trade,
  decorators: [
    (Story) => (
      <DashboardContext.Provider
        value={{ dispatch: () => {}, ctx: { symbol: 'BTCUSDT' }, setCtx: () => {}, widgets: [], toast: () => {}, compact: false, fullscreenId: null, setFullscreenId: () => {} }}
      >
        <div style={{ height: 300, width: 280, background: '#18181b', padding: 16, borderRadius: 8 }}>
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
