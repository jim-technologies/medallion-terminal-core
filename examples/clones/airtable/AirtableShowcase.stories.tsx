import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { AirtableShowcase } from './AirtableShowcase'

const meta = {
  title: 'Clones/Airtable',
  component: AirtableShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Airtable',
    cloneProduct: 'Airtable',
    cloneNamespace: 'airtable',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful operational workspace showing grid, board, '
          + 'record review, comments, filters, and reusable host-provided records.',
      },
    },
  },
  args: {
    initialView: 'grid',
    workspaceName: CLONE_DEMO_IDENTITY.company,
    baseName: 'Product launch',
  },
  argTypes: {
    records: { control: false },
    initialView: {
      control: 'inline-radio',
      options: ['grid', 'board', 'record'],
    },
    onSelectRecord: { action: 'select record' },
  },
} satisfies Meta<typeof AirtableShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const OperationalGrid: Story = {}

export const StatusBoard: Story = {
  args: {
    initialView: 'board',
  },
}

export const RecordReview: Story = {
  args: {
    initialView: 'record',
    initialSelectedId: 'launch-brief',
  },
}
