import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Microsoft/Outlook',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Microsoft',
    cloneProduct: 'Microsoft Outlook',
    cloneNamespace: 'microsoft-outlook',
    docs: { description: { component: 'An Outlook-style Focused Inbox, message list, configurable reading pane, folders, search, and compose reference.' } },
  },
  args: { product: 'microsoft-outlook', initialView: 'focused' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['focused', 'reading-pane', 'compose'] },
    onSelectItem: { action: 'select message' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const FocusedInbox: Story = {}
export const ReadingPane: Story = { args: { initialView: 'reading-pane', initialSelectedId: 'forecast' } }
export const Compose: Story = { args: { initialView: 'compose' } }
