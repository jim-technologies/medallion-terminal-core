import type { Meta, StoryObj } from '@storybook/react'
import { GoogleWorkspaceEditor } from './GoogleWorkspaceEditor'

const meta = {
  title: 'Clones/Google Sheets',
  component: GoogleWorkspaceEditor,
  parameters: {
    layout: 'fullscreen',
    cloneProduct: 'Google Sheets',
    cloneNamespace: 'google-sheets',
    docs: {
      description: {
        component:
          'A product-faithful Sheets surface with a selectable grid, formula bar, sheet tabs, '
          + 'collaboration controls, and contextual Gemini analysis.',
      },
    },
  },
  args: {
    product: 'sheets',
    initialCell: 'B4',
    initialGeminiOpen: false,
  },
  argTypes: {
    product: { control: false },
    content: { control: false },
  },
} satisfies Meta<typeof GoogleWorkspaceEditor>

export default meta
type Story = StoryObj<typeof meta>

export const RevenueModel: Story = {}

export const GeminiDataAnalysis: Story = {
  args: {
    initialCell: 'F7',
    initialGeminiOpen: true,
  },
}
