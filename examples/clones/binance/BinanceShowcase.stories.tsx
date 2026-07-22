import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Binance',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Binance',
    cloneProduct: 'Binance',
    cloneNamespace: 'binance',
    docs: { description: { component: 'A Binance-style spot terminal reference with linked watchlist, chart, live order book, order ticket, wallet context, and order history.' } },
  },
  args: { product: 'binance', initialView: 'spot' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['spot', 'open-orders', 'wallet'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const SpotTrading: Story = {}
export const OpenOrders: Story = { args: { initialView: 'open-orders' } }
export const SpotWallet: Story = { args: { initialView: 'wallet' } }
