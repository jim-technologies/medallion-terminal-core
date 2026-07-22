import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Atlassian/Jira',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Atlassian',
    cloneProduct: 'Atlassian Jira',
    cloneNamespace: 'atlassian-jira',
    docs: { description: { component: 'A Jira-style software project reference with backlog planning, sprint progress, board lanes, work-item metadata, and detail activity.' } },
  },
  args: { product: 'atlassian-jira', initialView: 'backlog' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['backlog', 'board', 'issue-detail'] },
    onSelectItem: { action: 'select work item' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Backlog: Story = {}
export const Board: Story = { args: { initialView: 'board' } }
export const WorkItemDetail: Story = { args: { initialView: 'issue-detail', initialSelectedId: 'ENG-479' } }
