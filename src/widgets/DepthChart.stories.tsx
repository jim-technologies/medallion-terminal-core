import type { Meta, StoryObj } from '@storybook/react'
import { DepthChart } from './DepthChart'

const meta: Meta<typeof DepthChart> = {
  title: 'Widgets/DepthChart',
  component: DepthChart,
  decorators: [
    (Story) => (
      <div style={{ height: 340, width: 720, background: '#11151a', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DepthChart>

const data = {
  venue: 'reference',
  bids: [
    { price: 101.9, size: 18 },
    { price: 101.8, size: 32 },
    { price: 101.7, size: 44 },
    { price: 101.5, size: 86 },
    { price: 101.2, size: 121 },
    { price: 100.8, size: 184 },
  ],
  asks: [
    { price: 102.1, size: 14 },
    { price: 102.2, size: 29 },
    { price: 102.3, size: 51 },
    { price: 102.5, size: 72 },
    { price: 102.8, size: 118 },
    { price: 103.2, size: 176 },
  ],
  mid: 102,
  spread: 0.2,
}

export const CumulativeSize: Story = { args: { data } }

export const QuoteNotional: Story = {
  args: {
    data,
    options: { cumulative: 'notional', quote_unit: 'USD' },
  },
}
