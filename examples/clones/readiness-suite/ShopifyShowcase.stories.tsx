import type { Meta, StoryObj } from '@storybook/react'
import { ShopifyShowcase } from './ShopifyShowcase'

const meta = {
  title: 'Clones/SME/Shopify',
  component: ShopifyShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'shopify',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A host-data-injectable commerce operations surface covering store health, '
          + 'order lifecycle, fulfillment, returns, products, and inventory risk.',
      },
    },
  },
  args: {
    initialSection: 'home',
    storeName: 'Northstar Supply',
  },
  argTypes: {
    orders: { control: false },
    inventory: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['home', 'orders', 'inventory'],
    },
    onSelectOrder: { action: 'select order' },
  },
} satisfies Meta<typeof ShopifyShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const StoreOverview: Story = {}

export const OrderManagement: Story = {
  args: {
    initialSection: 'orders',
    initialSelectedOrderId: '',
  },
}

export const OrderDetail: Story = {
  args: {
    initialSection: 'orders',
    initialSelectedOrderId: 'order-1057',
  },
}

export const InventoryOperations: Story = {
  args: {
    initialSection: 'inventory',
  },
}
