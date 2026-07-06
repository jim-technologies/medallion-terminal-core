import type { Meta, StoryObj } from '@storybook/react'
import { OrderBook } from './OrderBook'

const meta: Meta<typeof OrderBook> = {
  title: 'Widgets/OrderBook',
  component: OrderBook,
  decorators: [
    (Story) => (
      <div style={{ height: 380, width: 320, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof OrderBook>

export const Crypto: Story = {
  args: {
    data: {
      venue: 'deribit',
      mid: 67843, spread: 6,
      asks: [
        { price: 67862, size: 1.20 }, { price: 67860, size: 0.80 }, { price: 67855, size: 2.40 },
        { price: 67850, size: 0.95 }, { price: 67848, size: 0.40 }, { price: 67846, size: 0.30 },
      ],
      bids: [
        { price: 67840, size: 0.42 }, { price: 67838, size: 0.85 }, { price: 67836, size: 1.10 },
        { price: 67834, size: 1.80 }, { price: 67830, size: 2.85 }, { price: 67826, size: 3.40 },
      ],
    },
  },
}

export const PredictionMarket: Story = {
  args: {
    data: {
      venue: 'reference',
      mid: 0.42, spread: 0.004,
      asks: [
        { price: 0.422, size: 3100 }, { price: 0.424, size: 5900 }, { price: 0.428, size: 9100 },
      ],
      bids: [
        { price: 0.418, size: 4200 }, { price: 0.416, size: 6800 }, { price: 0.412, size: 12400 },
      ],
    },
  },
}

export const Empty: Story = { args: { data: { bids: [], asks: [] } } }
