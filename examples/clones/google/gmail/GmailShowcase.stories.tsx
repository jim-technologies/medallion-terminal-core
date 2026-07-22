import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Google/Gmail',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Google',
    cloneProduct: 'Google Gmail',
    cloneNamespace: 'google-gmail',
    docs: { description: { component: 'A Gmail-style inbox, label, conversation, attachment, search, and compose reference built on the shared mail archetype.' } },
  },
  args: { product: 'google-gmail', initialView: 'inbox' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['inbox', 'thread', 'compose'] },
    onSelectItem: { action: 'select conversation' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Inbox: Story = {}
export const Conversation: Story = { args: { initialView: 'thread', initialSelectedId: 'renewal' } }
export const Compose: Story = { args: { initialView: 'compose' } }
