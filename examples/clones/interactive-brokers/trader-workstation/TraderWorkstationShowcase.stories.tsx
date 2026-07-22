import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Interactive Brokers/Trader Workstation',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Interactive Brokers',
    cloneProduct: 'Interactive Brokers Trader Workstation',
    cloneNamespace: 'interactive-brokers-trader-workstation',
    docs: { description: { component: 'A Trader Workstation Mosaic-style reference with linked watchlists, charting, portfolio context, Level II, advanced order entry, and order monitoring.' } },
  },
  args: { product: 'interactive-brokers-trader-workstation', initialView: 'mosaic' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['mosaic', 'portfolio', 'order-entry'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MosaicWorkspace: Story = {}
export const Portfolio: Story = { args: { initialView: 'portfolio' } }
export const AdvancedOrderEntry: Story = { args: { initialView: 'order-entry' } }
