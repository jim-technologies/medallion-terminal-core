import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/GitHub',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'GitHub',
    cloneProduct: 'GitHub',
    cloneNamespace: 'github',
    docs: { description: { component: 'A GitHub-style repository collaboration reference covering pull-request conversation, file-tree diff review, reviewers, checks, and merge readiness.' } },
  },
  args: { product: 'github', initialView: 'pull-request' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['pull-request', 'files-changed', 'actions'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PullRequest: Story = {}
export const FilesChanged: Story = { args: { initialView: 'files-changed' } }
export const Checks: Story = { args: { initialView: 'actions' } }
