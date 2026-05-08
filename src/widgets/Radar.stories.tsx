import type { Meta, StoryObj } from '@storybook/react'
import { Radar } from './Radar'

const meta: Meta<typeof Radar> = {
  title: 'Widgets/Radar',
  component: Radar,
  decorators: [
    (Story) => (
      <div style={{ height: 380, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Radar>

export const StrategyComparison: Story = {
  args: {
    data: [
      { metric: 'Sharpe',   Mom: 1.8, MeanRev: 2.1, Arb: 3.4, Vol: 0.6 },
      { metric: 'Win Rate', Mom: 0.58, MeanRev: 0.61, Arb: 0.84, Vol: 0.48 },
      { metric: 'Sortino',  Mom: 2.2, MeanRev: 2.6, Arb: 4.1, Vol: 0.7 },
      { metric: 'IC',       Mom: 0.42, MeanRev: 0.38, Arb: 0.18, Vol: 0.22 },
      { metric: 'Capacity', Mom: 0.7, MeanRev: 0.5, Arb: 0.2, Vol: 0.9 },
      { metric: 'Stability',Mom: 0.6, MeanRev: 0.7, Arb: 0.95, Vol: 0.3 },
    ],
  },
}

export const SingleSeries: Story = {
  args: {
    data: [
      { metric: 'Accuracy',  Model: 0.84 },
      { metric: 'Precision', Model: 0.78 },
      { metric: 'Recall',    Model: 0.82 },
      { metric: 'F1',        Model: 0.80 },
      { metric: 'AUC',       Model: 0.88 },
      { metric: 'Calibration', Model: 0.71 },
    ],
  },
}

export const LongForm: Story = {
  args: {
    data: {
      metrics: ['Sharpe', 'DD', 'Vol', 'IC', 'Hit'],
      series: [
        { name: 'A', values: [1.8, 0.92, 0.78, 0.42, 0.58] },
        { name: 'B', values: [2.4, 0.98, 0.62, 0.31, 0.65] },
      ],
    },
  },
}
