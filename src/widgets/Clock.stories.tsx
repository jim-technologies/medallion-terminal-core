import type { Meta, StoryObj } from '@storybook/react'
import { Clock } from './Clock'

const meta: Meta<typeof Clock> = {
  title: 'Widgets/Clock',
  component: Clock,
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Clock>

export const Default: Story = { args: { options: {} } }
export const Crypto24x7: Story = {
  args: { options: { zones: ['UTC', 'America/New_York', 'Asia/Hong_Kong', 'Asia/Singapore'] } },
}
export const TwelveHour: Story = {
  args: { options: { format: '12h' } },
}
