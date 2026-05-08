import type { Meta, StoryObj } from '@storybook/react'
import { Kelly } from './Kelly'

const meta: Meta<typeof Kelly> = {
  title: 'Domain/Kelly',
  component: Kelly,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 320, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Kelly>

export const ManualOdds: Story = {
  args: {
    options: { probability: 0.58, odds: 1.91, bankroll: 10_000, fraction: 'half' },
  },
}

export const NegativeEdge: Story = {
  args: {
    options: { probability: 0.4, odds: 2.0, bankroll: 10_000, fraction: 'full' },
  },
}

// Bound to a paired_grid payload — the widget reads odds from
// rows[4].left.values.odds (the at-the-line spread).
export const BoundToPairedGrid: Story = {
  args: {
    options: { probability: 0.58, bankroll: 10_000, fraction: 'half', odds_path: 'rows.4.left.values.odds' },
    data: {
      rows: [
        { key: -7.5, left: { values: { odds: 2.45 } }, right: { values: { odds: 1.62 } } },
        { key: -5.5, left: { values: { odds: 2.10 } }, right: { values: { odds: 1.78 } } },
        { key: -3.5, left: { values: { odds: 1.95 } }, right: { values: { odds: 1.91 } } },
        { key: -1.5, left: { values: { odds: 1.88 } }, right: { values: { odds: 2.00 } } },
        { key:  0,   left: { values: { odds: 1.83 } }, right: { values: { odds: 2.05 } } },
        { key:  1.5, left: { values: { odds: 1.78 } }, right: { values: { odds: 2.12 } } },
        { key:  3.5, left: { values: { odds: 1.65 } }, right: { values: { odds: 2.35 } } },
      ],
    },
  },
}
