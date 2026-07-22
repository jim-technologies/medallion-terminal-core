import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/CoinGecko',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'CoinGecko',
    cloneProduct: 'CoinGecko',
    cloneNamespace: 'coingecko',
    docs: { description: { component: 'A CoinGecko-style market-data reference with ranked assets, trend sparklines, coin statistics, price history, search, watchlists, and portfolio presentation.' } },
  },
  args: { product: 'coingecko', initialView: 'markets' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['markets', 'coin-detail', 'portfolio'] },
    onSelectItem: { action: 'select coin' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MarketRankings: Story = {}
export const CoinDetail: Story = { args: { initialView: 'coin-detail', initialSelectedId: 'BTC' } }
export const Portfolio: Story = { args: { initialView: 'portfolio' } }
