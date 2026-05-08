import type { Meta, StoryObj } from '@storybook/react'
import { Treemap } from './Treemap'

const meta: Meta<typeof Treemap> = {
  title: 'Widgets/Treemap',
  component: Treemap,
  decorators: [
    (Story) => (
      <div style={{ height: 380, width: 560, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Treemap>

export const Flat: Story = {
  args: {
    data: [
      { label: 'BTC',  value: 42.8, color: 'info' },
      { label: 'ETH',  value: 24.6, color: 'info' },
      { label: 'SOL',  value: 12.4, color: 'info' },
      { label: 'AVAX', value:  4.8, color: 'info' },
      { label: 'ARB',  value:  2.4, color: 'info' },
      { label: 'OP',   value:  1.6, color: 'info' },
      { label: 'Cash', value: 11.4, color: 'muted' },
    ],
  },
}

export const Hierarchical: Story = {
  args: {
    data: [
      {
        label: 'L1',
        children: [
          { label: 'BTC', value: 42.8 },
          { label: 'ETH', value: 24.6 },
          { label: 'SOL', value: 12.4 },
        ],
      },
      {
        label: 'L2',
        children: [
          { label: 'ARB', value: 2.4 },
          { label: 'OP',  value: 1.6 },
        ],
      },
      { label: 'Memes', value:  4.8, color: 'warn' },
      { label: 'Cash',  value: 11.4, color: 'muted' },
    ],
  },
}

export const Sentiment: Story = {
  args: {
    data: [
      { label: 'Bullish',  value: 62, color: 'ok' },
      { label: 'Neutral',  value: 18, color: 'muted' },
      { label: 'Bearish',  value: 20, color: 'danger' },
    ],
  },
}
