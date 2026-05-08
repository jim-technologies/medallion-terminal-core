import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const meta: Meta<typeof BarChart> = {
  title: 'Widgets/BarChart',
  component: BarChart,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof BarChart>

export const PnLByStrategy: Story = {
  args: {
    data: [
      { label: 'Mom',    value:  4280 },
      { label: 'MeanRev', value:  1420 },
      { label: 'Arb',    value:   840 },
      { label: 'Vol',    value: -1280 },
      { label: 'Carry',  value:   620 },
    ],
  },
}

export const VolumeByVenue: Story = {
  args: {
    data: [
      { label: 'Binance', value: 28145 },
      { label: 'Coinbase', value: 8420 },
      { label: 'Kraken', value: 3120 },
      { label: 'OKX', value: 6480 },
      { label: 'Bybit', value: 4280 },
    ],
  },
}

export const Sentiment: Story = {
  args: {
    data: [
      { label: 'Bull',     value: 62, color: 'ok' },
      { label: 'Neutral',  value: 18, color: 'muted' },
      { label: 'Bear',     value: 20, color: 'danger' },
    ],
  },
}
