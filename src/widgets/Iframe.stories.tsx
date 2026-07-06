import type { Meta, StoryObj } from '@storybook/react'
import { Iframe } from './Iframe'

const meta: Meta<typeof Iframe> = {
  title: 'Widgets/Iframe',
  component: Iframe,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Iframe>

// Storybook can't fetch arbitrary embeds — this serves as a smoke test
// only. Real external embeds work the same way.
export const PlainUrl: Story = {
  args: { data: { url: 'about:blank', title: 'Example embed' } },
}
