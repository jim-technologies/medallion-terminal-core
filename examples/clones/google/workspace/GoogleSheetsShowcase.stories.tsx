import type { Meta, StoryObj } from '@storybook/react'
import { GoogleWorkspaceEditor } from './GoogleWorkspaceEditor'

const meta = {
  title: 'Clones/Google/Sheets',
  component: GoogleWorkspaceEditor,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Google',
    cloneProduct: 'Google Sheets',
    cloneNamespace: 'google-sheets',
    docs: {
      description: {
        component:
          'A product-faithful Sheets surface with a selectable grid, formula bar, sheet tabs, '
          + 'collaboration controls, and contextual AI analysis.',
      },
    },
  },
  args: {
    product: 'sheets',
    initialCell: 'B4',
    initialAssistantOpen: false,
  },
  argTypes: {
    product: { control: false },
    content: { control: false },
  },
} satisfies Meta<typeof GoogleWorkspaceEditor>

export default meta
type Story = StoryObj<typeof meta>

export const RevenueModel: Story = {}

export const AssistedDataAnalysis: Story = {
  args: {
    initialCell: 'F7',
    initialAssistantOpen: true,
  },
}
