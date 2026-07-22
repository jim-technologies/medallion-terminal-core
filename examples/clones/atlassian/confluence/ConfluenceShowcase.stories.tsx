import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Atlassian/Confluence',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Atlassian',
    cloneProduct: 'Atlassian Confluence',
    cloneNamespace: 'atlassian-confluence',
    docs: { description: { component: 'A Confluence-style space and page reference with content trees, collaborative documents, activity, comments, and permission-aware presentation.' } },
  },
  args: { product: 'atlassian-confluence', initialView: 'space' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['space', 'page', 'page-tree'] },
    onSelectItem: { action: 'select page' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const SpaceOverview: Story = {}
export const PageEditor: Story = { args: { initialView: 'page', initialSelectedId: 'customer-health' } }
export const ContentTreeAndActivity: Story = { args: { initialView: 'page-tree' } }
