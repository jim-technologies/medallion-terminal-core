import type { Meta, StoryObj } from '@storybook/react'
import { Heatmap } from './Heatmap'

const meta: Meta<typeof Heatmap> = {
  title: 'Widgets/Heatmap',
  component: Heatmap,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 480, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Heatmap>

export const Correlation: Story = {
  args: {
    data: {
      rows:    ['BTC', 'ETH', 'SOL', 'SPY', 'QQQ', 'GLD'],
      columns: ['BTC', 'ETH', 'SOL', 'SPY', 'QQQ', 'GLD'],
      scale: 'diverging',
      min: -1, max: 1,
      cells: (() => {
        const m = [
          [ 1.00,  0.84,  0.72,  0.31,  0.38,  0.12],
          [ 0.84,  1.00,  0.78,  0.34,  0.41,  0.08],
          [ 0.72,  0.78,  1.00,  0.28,  0.35,  0.05],
          [ 0.31,  0.34,  0.28,  1.00,  0.92, -0.18],
          [ 0.38,  0.41,  0.35,  0.92,  1.00, -0.21],
          [ 0.12,  0.08,  0.05, -0.18, -0.21,  1.00],
        ]
        return m.flatMap((row, r) => row.map((v, c) => ({ row: r, col: c, value: v })))
      })(),
    },
  },
}

export const SectorReturns: Story = {
  args: {
    data: {
      rows:    ['Tech', 'Energy', 'Finance', 'Health', 'Cons.'],
      columns: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      scale: 'diverging',
      cells: [
        { row: 0, col: 0, value:  1.2 }, { row: 0, col: 1, value: -0.8 }, { row: 0, col: 2, value:  2.1 }, { row: 0, col: 3, value:  0.4 }, { row: 0, col: 4, value:  1.5 },
        { row: 1, col: 0, value: -0.4 }, { row: 1, col: 1, value:  0.9 }, { row: 1, col: 2, value: -1.2 }, { row: 1, col: 3, value:  0.2 }, { row: 1, col: 4, value: -0.6 },
        { row: 2, col: 0, value:  0.6 }, { row: 2, col: 1, value:  0.3 }, { row: 2, col: 2, value:  0.8 }, { row: 2, col: 3, value: -0.1 }, { row: 2, col: 4, value:  0.5 },
        { row: 3, col: 0, value: -0.2 }, { row: 3, col: 1, value:  0.7 }, { row: 3, col: 2, value:  0.4 }, { row: 3, col: 3, value:  1.1 }, { row: 3, col: 4, value:  0.8 },
        { row: 4, col: 0, value:  0.3 }, { row: 4, col: 1, value: -0.2 }, { row: 4, col: 2, value:  0.6 }, { row: 4, col: 3, value:  0.4 }, { row: 4, col: 4, value:  0.2 },
      ],
    },
  },
}

export const Sequential: Story = {
  args: {
    data: {
      rows:    ['us-east-1', 'us-west-2', 'eu-west-1'],
      columns: ['00', '04', '08', '12', '16', '20'],
      scale: 'sequential',
      cells: [
        { row: 0, col: 0, value: 12 }, { row: 0, col: 1, value: 28 }, { row: 0, col: 2, value: 64 }, { row: 0, col: 3, value: 89 }, { row: 0, col: 4, value: 72 }, { row: 0, col: 5, value: 31 },
        { row: 1, col: 0, value:  8 }, { row: 1, col: 1, value: 14 }, { row: 1, col: 2, value: 38 }, { row: 1, col: 3, value: 56 }, { row: 1, col: 4, value: 48 }, { row: 1, col: 5, value: 22 },
        { row: 2, col: 0, value: 31 }, { row: 2, col: 1, value: 18 }, { row: 2, col: 2, value: 24 }, { row: 2, col: 3, value: 41 }, { row: 2, col: 4, value: 67 }, { row: 2, col: 5, value: 84 },
      ],
    },
  },
}
