import type { Meta, StoryObj } from '@storybook/react'
import { Json } from './Json'

const meta: Meta<typeof Json> = {
  title: 'Widgets/Json',
  component: Json,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Json>

export const ApiResponse: Story = {
  args: {
    data: {
      symbol: 'BTC',
      price: 67842.5,
      orderbook: {
        bids: [{ price: 67840, size: 0.42 }, { price: 67838, size: 0.83 }],
        asks: [{ price: 67850, size: 0.30 }],
      },
      tags: ['crypto', 'spot'],
      live: true,
      stale: null,
    },
  },
}
