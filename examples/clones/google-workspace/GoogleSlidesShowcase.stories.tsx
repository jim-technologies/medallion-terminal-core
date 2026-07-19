import type { Meta, StoryObj } from '@storybook/react'
import { GoogleWorkspaceEditor } from './GoogleWorkspaceEditor'

const meta = {
  title: 'Clones/Google Slides',
  component: GoogleWorkspaceEditor,
  parameters: {
    layout: 'fullscreen',
    cloneProduct: 'Google Slides',
    cloneNamespace: 'google-slides',
    docs: {
      description: {
        component:
          'A product-faithful Slides surface with a filmstrip, responsive presentation canvas, '
          + 'speaker notes, collaboration, and Gemini-assisted presentation workflows.',
      },
    },
  },
  args: {
    product: 'slides',
    initialSlide: 0,
    initialGeminiOpen: false,
  },
  argTypes: {
    product: { control: false },
    content: { control: false },
  },
} satisfies Meta<typeof GoogleWorkspaceEditor>

export default meta
type Story = StoryObj<typeof meta>

export const BusinessReview: Story = {}

export const GeminiPresentationDesign: Story = {
  args: {
    initialSlide: 2,
    initialGeminiOpen: true,
  },
}
