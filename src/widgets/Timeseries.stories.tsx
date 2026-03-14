import type { Meta, StoryObj } from '@storybook/react'
import { Timeseries } from './Timeseries'

const meta: Meta<typeof Timeseries> = {
  title: 'Widgets/Timeseries',
  component: Timeseries,
  decorators: [
    (Story) => (
      <div style={{ height: 300, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Timeseries>

export const SingleSeries: Story = {
  args: {
    data: [
      { timestamp: '2024-01-01', value: 42000 },
      { timestamp: '2024-01-05', value: 43500 },
      { timestamp: '2024-01-10', value: 41800 },
      { timestamp: '2024-01-15', value: 44200 },
      { timestamp: '2024-01-20', value: 45100 },
      { timestamp: '2024-01-25', value: 43900 },
      { timestamp: '2024-01-30', value: 46500 },
    ],
  },
}

export const MultiKey: Story = {
  name: 'Multi-Key (Auto-Detected)',
  args: {
    data: [
      { timestamp: '2024-01-01', BTC: 42000, ETH: 2800, SOL: 95 },
      { timestamp: '2024-01-05', BTC: 43500, ETH: 2900, SOL: 102 },
      { timestamp: '2024-01-10', BTC: 41800, ETH: 2750, SOL: 88 },
      { timestamp: '2024-01-15', BTC: 44200, ETH: 3050, SOL: 110 },
      { timestamp: '2024-01-20', BTC: 45100, ETH: 3100, SOL: 115 },
      { timestamp: '2024-01-25', BTC: 43900, ETH: 2950, SOL: 108 },
      { timestamp: '2024-01-30', BTC: 46500, ETH: 3200, SOL: 120 },
    ],
  },
}

export const MultiSeries: Story = {
  name: 'Multi-Series (Explicit)',
  args: {
    data: {
      series: [
        {
          name: 'Revenue',
          data: [
            { timestamp: '2024-Q1', value: 1200000 },
            { timestamp: '2024-Q2', value: 1450000 },
            { timestamp: '2024-Q3', value: 1380000 },
            { timestamp: '2024-Q4', value: 1620000 },
          ],
        },
        {
          name: 'Expenses',
          data: [
            { timestamp: '2024-Q1', value: 980000 },
            { timestamp: '2024-Q2', value: 1050000 },
            { timestamp: '2024-Q3', value: 1100000 },
            { timestamp: '2024-Q4', value: 1150000 },
          ],
        },
      ],
    },
  },
}

export const Empty: Story = {
  args: { data: null },
}
