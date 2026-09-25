import type { Meta, StoryObj } from '@storybook/react'
import { Iframe } from './Iframe'

const meta: Meta<typeof Iframe> = {
  title: 'Widgets/Iframe',
  component: Iframe,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 480, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 12, borderRadius: 'var(--mtc-radius-md)' }}>
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
