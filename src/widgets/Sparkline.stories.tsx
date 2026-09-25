import type { Meta, StoryObj } from '@storybook/react'
import { Sparkline } from './Sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Widgets/Sparkline',
  component: Sparkline,
  decorators: [
    (Story) => (
      <div style={{ height: 40, width: 160, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 4, borderRadius: 'var(--mtc-radius-md)' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Sparkline>

export const Up: Story = { args: { data: [100, 102, 101, 104, 107, 105, 109, 112] } }
export const Down: Story = { args: { data: [100, 98, 99, 96, 92, 95, 91, 88] } }
export const Override: Story = { args: { data: [50, 52, 49, 53, 51], options: { color: '#a78bfa' } } }
