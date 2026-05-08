import type { Meta, StoryObj } from '@storybook/react'
import { Ticker } from './Ticker'

const meta: Meta<typeof Ticker> = {
  title: 'Widgets/Ticker',
  component: Ticker,
  decorators: [
    (Story) => (
      <div style={{ height: 56, width: 920, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Ticker>

export const Alerts: Story = {
  args: {
    data: {
      events: [
        { timestamp: '15:02', label: 'BTC -2.4% in 5m',           status: 'EVENT_STATUS_WARN' },
        { timestamp: '14:58', label: 'Stop-loss hit on ETH long', status: 'EVENT_STATUS_ERROR' },
        { timestamp: '14:51', label: 'Funding flipped negative',  status: 'EVENT_STATUS_INFO' },
        { timestamp: '14:42', label: 'Rebalance complete',        status: 'EVENT_STATUS_OK' },
        { timestamp: '14:11', label: 'Drawdown -3.2%',            status: 'EVENT_STATUS_WARN' },
        { timestamp: '13:48', label: 'Liquidity drained: ETH/USDC', status: 'EVENT_STATUS_ERROR' },
      ],
    },
  },
}

export const Tape: Story = {
  args: {
    data: {
      events: [
        { timestamp: '15:00:14', label: 'BUY  0.42 BTC @ 67,842', status: 'EVENT_STATUS_OK' },
        { timestamp: '15:00:13', label: 'SELL 1.20 ETH @ 3,456',  status: 'EVENT_STATUS_OK' },
        { timestamp: '15:00:11', label: 'BUY  6.00 SOL @ 168.20', status: 'EVENT_STATUS_OK' },
        { timestamp: '15:00:08', label: 'BUY  0.18 BTC @ 67,510', status: 'EVENT_STATUS_OK' },
      ],
    },
  },
}
