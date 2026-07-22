import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Linear',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Linear',
    cloneProduct: 'Linear',
    cloneNamespace: 'linear',
    docs: { description: { component: 'A Linear-style issue workspace with keyboard-oriented navigation, grouped views, cycle progress, project context, and issue detail.' } },
  },
  args: { product: 'linear', initialView: 'issues' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['issues', 'cycle', 'issue-detail'] },
    onSelectItem: { action: 'select issue' },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MyIssues: Story = {}
export const CurrentCycle: Story = { args: { initialView: 'cycle' } }
export const IssueDetail: Story = { args: { initialView: 'issue-detail', initialSelectedId: 'ENG-482' } }
