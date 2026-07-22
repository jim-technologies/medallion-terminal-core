import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Polymarket',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Polymarket',
    cloneProduct: 'Polymarket',
    cloneNamespace: 'polymarket',
    docs: { description: { component: 'A Polymarket-style prediction-market reference with discovery cards, probabilities, history, resolution rules, CLOB depth, trade entry, and positions.' } },
  },
  args: { product: 'polymarket', initialView: 'discovery' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['discovery', 'market-detail', 'portfolio'] },
    onSelectItem: { action: 'select market' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MarketDiscovery: Story = {}
export const MarketDetail: Story = { args: { initialView: 'market-detail', initialSelectedId: 'rates' } }
export const Portfolio: Story = { args: { initialView: 'portfolio' } }
