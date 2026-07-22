import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Meta/WhatsApp',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Meta',
    cloneProduct: 'Meta WhatsApp',
    cloneNamespace: 'meta-whatsapp',
    docs: { description: { component: 'A WhatsApp-style desktop conversation reference with chat search, direct/group history, communities, attachments, media, calls, and delivery presentation.' } },
  },
  args: { product: 'meta-whatsapp', initialView: 'chat' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['chat', 'communities', 'media'] },
    onSelectItem: { action: 'select chat' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const GroupConversation: Story = {}
export const Communities: Story = { args: { initialView: 'communities' } }
export const SharedMedia: Story = { args: { initialView: 'media', initialSelectedId: 'customer' } }
