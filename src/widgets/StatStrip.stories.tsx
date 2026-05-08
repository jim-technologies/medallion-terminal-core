import type { Meta, StoryObj } from '@storybook/react'
import { StatStrip } from './StatStrip'

const meta: Meta<typeof StatStrip> = {
  title: 'Widgets/StatStrip',
  component: StatStrip,
  decorators: [
    (Story) => (
      <div style={{ height: 90, width: 920, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof StatStrip>

export const Watchlist: Story = {
  args: {
    data: [
      { label: 'BTC', value: 67842, delta:  0.0036, unit: 'USD', trend: [67100, 67500, 67800, 67400, 67900, 67600, 67842] },
      { label: 'ETH', value:  3456, delta:  0.0081, unit: 'USD', trend: [3380, 3410, 3445, 3420, 3460, 3450, 3456] },
      { label: 'SOL', value:   168, delta:  0.0192, unit: 'USD', trend: [162, 164, 166, 165, 167, 167, 168] },
      { label: 'BNB', value:   612, delta:  0.0004, unit: 'USD', trend: [610, 611, 614, 613, 612, 612, 612] },
      { label: 'XRP', value:  0.62, delta: -0.0048, unit: 'USD' },
      { label: 'GLD', value: 218.6, delta:  0.0046, unit: 'USD' },
    ],
  },
}

export const Risk: Story = {
  args: {
    data: [
      { label: 'PnL Today',   value: 4280, delta: 0.0312, unit: 'USD' },
      { label: 'Open Risk',   value: 12400, unit: 'USD' },
      { label: 'Drawdown',    value: -3.2, unit: '%' },
      { label: 'Sharpe',      value: 1.84 },
      { label: 'Win Rate',    value: 58.4, unit: '%' },
    ],
  },
}
