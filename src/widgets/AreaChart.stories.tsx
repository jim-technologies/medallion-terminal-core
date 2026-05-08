import type { Meta, StoryObj } from '@storybook/react'
import { AreaChart } from './AreaChart'

const meta: Meta<typeof AreaChart> = {
  title: 'Widgets/AreaChart',
  component: AreaChart,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 560, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof AreaChart>

export const PortfolioComposition: Story = {
  args: {
    data: [
      { date: '2026-04-01', BTC: 38000, ETH: 14000, SOL: 5000, Cash: 8000 },
      { date: '2026-04-08', BTC: 41000, ETH: 14800, SOL: 5400, Cash: 7800 },
      { date: '2026-04-15', BTC: 44000, ETH: 16200, SOL: 6100, Cash: 7400 },
      { date: '2026-04-22', BTC: 42000, ETH: 15400, SOL: 6800, Cash: 9200 },
      { date: '2026-04-29', BTC: 45200, ETH: 16800, SOL: 7600, Cash: 9100 },
    ],
  },
}

export const SingleSeries: Story = {
  args: {
    data: [
      { date: '2026-04-01', value: 100000 },
      { date: '2026-04-08', value: 103200 },
      { date: '2026-04-15', value: 108100 },
      { date: '2026-04-22', value: 112400 },
      { date: '2026-04-29', value: 118600 },
    ],
  },
}
