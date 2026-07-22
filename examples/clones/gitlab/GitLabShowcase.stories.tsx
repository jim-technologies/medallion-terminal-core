import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/GitLab',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'GitLab',
    cloneProduct: 'GitLab',
    cloneNamespace: 'gitlab',
    docs: { description: { component: 'A GitLab-style DevSecOps reference covering merge-request review, changed files, reviewer status, approval gates, and pipeline jobs.' } },
  },
  args: { product: 'gitlab', initialView: 'merge-request' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['merge-request', 'changes', 'pipeline'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MergeRequest: Story = {}
export const Changes: Story = { args: { initialView: 'changes' } }
export const Pipeline: Story = { args: { initialView: 'pipeline' } }
