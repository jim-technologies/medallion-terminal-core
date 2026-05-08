import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta: Meta<typeof Image> = {
  title: 'Widgets/Image',
  component: Image,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Image>

export const ChartScreenshot: Story = {
  args: {
    data: {
      url: 'https://placehold.co/600x300/18181b/fafafa?text=AI-generated+chart',
      alt: 'AI-generated chart',
    },
  },
}

export const PlainUrl: Story = {
  args: { data: 'https://placehold.co/400x300/18181b/0ea5e9?text=Image' },
}
