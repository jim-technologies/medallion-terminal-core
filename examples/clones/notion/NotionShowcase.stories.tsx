import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Notion',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Notion',
    cloneProduct: 'Notion',
    cloneNamespace: 'notion',
    docs: { description: { component: 'A Notion-style workspace covering nested pages, block-document anatomy, database views, properties, backlinks, and comments.' } },
  },
  args: { product: 'notion', initialView: 'document' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['document', 'database', 'comments'] },
    onSelectItem: { action: 'select page' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const ProjectDocument: Story = {}
export const ProjectDatabase: Story = { args: { initialView: 'database' } }
export const CommentReview: Story = { args: { initialView: 'comments', initialSelectedId: 'operating-plan' } }
