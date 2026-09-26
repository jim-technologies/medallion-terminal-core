import type { Meta, StoryObj } from '@storybook/react'
import { GoogleWorkspaceEditor } from './GoogleWorkspaceEditor'

const meta = {
  title: 'Clones/Google/Docs',
  component: GoogleWorkspaceEditor,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Google',
    cloneProduct: 'Google Docs',
    cloneNamespace: 'google-docs',
    docs: {
      description: {
        component:
          'A product-faithful Docs editing surface built on the shared, namespaced Workspace shell.',
      },
    },
  },
  args: {
    product: 'docs',
    initialAssistantOpen: false,
    initialCommentsOpen: false,
  },
  argTypes: {
    product: { control: false },
    content: { control: false },
  },
} satisfies Meta<typeof GoogleWorkspaceEditor>

export default meta
type Story = StoryObj<typeof meta>

export const OperatingPlan: Story = {}

export const AssistedWriting: Story = {
  args: {
    initialAssistantOpen: true,
  },
}

export const CommentReview: Story = {
  args: {
    initialCommentsOpen: true,
  },
}
