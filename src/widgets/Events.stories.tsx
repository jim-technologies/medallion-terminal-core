import type { Meta, StoryObj } from '@storybook/react'
import { Events } from './Events'

const meta: Meta<typeof Events> = {
  title: 'Widgets/Events',
  component: Events,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 460, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Events>

export const TradeTape: Story = {
  args: {
    data: {
      events: [
        { timestamp: '15:00:14', label: 'BUY  0.42 BTC @ 67,842',  status: 'EVENT_STATUS_OK',    source: 'alpha-1', tags: ['BTC', 'entry'] },
        { timestamp: '14:58:02', label: 'SELL 1.20 ETH @ 3,456',   status: 'EVENT_STATUS_OK',    source: 'alpha-1', tags: ['ETH', 'exit'] },
        { timestamp: '14:51:33', label: 'BUY  6.00 SOL @ 168.20',  status: 'EVENT_STATUS_OK',    source: 'alpha-2', tags: ['SOL', 'entry'] },
        { timestamp: '14:42:17', label: 'Stop hit on ETH long',    status: 'EVENT_STATUS_WARN',  source: 'alpha-1', tags: ['ETH', 'stop'] },
        { timestamp: '14:11:08', label: 'BUY  0.18 BTC @ 67,510',  status: 'EVENT_STATUS_OK',    source: 'alpha-1', tags: ['BTC', 'entry'] },
        { timestamp: '13:48:41', label: 'Order rejected: balance', status: 'EVENT_STATUS_ERROR', source: 'alpha-3', tags: ['risk'] },
      ],
    },
  },
}

export const CronHistory: Story = {
  args: {
    data: {
      events: [
        { timestamp: '15:00:01', label: 'ingest-prices',    status: 'EVENT_STATUS_OK',      body: 'Processed 1.2M ticks in 38s' },
        { timestamp: '14:55:14', label: 'ingest-sentiment', status: 'EVENT_STATUS_OK',      body: 'Pulled 4,210 tweets, scored' },
        { timestamp: '14:30:01', label: 'rebalance',        status: 'EVENT_STATUS_WARN',    body: 'Skipped: spread > limit' },
        { timestamp: '14:00:01', label: 'ingest-news',      status: 'EVENT_STATUS_OK',      body: '12 sources OK, 0 failures' },
        { timestamp: '13:45:33', label: 'ingest-sentiment', status: 'EVENT_STATUS_PENDING', body: 'Running...' },
      ],
    },
  },
}

export const PlainList: Story = {
  args: {
    data: [
      { timestamp: '12:00:00', label: 'Daily report sent' },
      { timestamp: '09:01:14', label: 'Bot started', status: 'EVENT_STATUS_OK' },
    ],
  },
}
