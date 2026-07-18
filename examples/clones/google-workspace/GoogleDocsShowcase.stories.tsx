import type { Meta, StoryObj } from '@storybook/react'
import { GoogleWorkspaceEditor } from './GoogleWorkspaceEditor'

const meta = {
  title: 'Clones/Google Docs',
  component: GoogleWorkspaceEditor,
  parameters: {
    layout: 'fullscreen',
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
    initialGeminiOpen: false,
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

export const GeminiAssistedWriting: Story = {
  args: {
    initialGeminiOpen: true,
  },
}

export const CommentReview: Story = {
  args: {
    initialCommentsOpen: true,
  },
}
