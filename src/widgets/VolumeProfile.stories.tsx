import type { Meta, StoryObj } from '@storybook/react'
import { VolumeProfile } from './VolumeProfile'

const meta: Meta<typeof VolumeProfile> = {
  title: 'Widgets/VolumeProfile',
  component: VolumeProfile,
  decorators: [
    (Story) => (
      <div style={{ height: 380, width: 240, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof VolumeProfile>

export const BTC: Story = {
  args: {
    data: [
      { price: 68400, volume:  840 },
      { price: 68200, volume: 1240 },
      { price: 68000, volume: 2680 },
      { price: 67800, volume: 4120 },
      { price: 67600, volume: 5840 },
      { price: 67400, volume: 7820 },
      { price: 67200, volume: 6440 },
      { price: 67000, volume: 4980 },
      { price: 66800, volume: 3220 },
      { price: 66600, volume: 1840 },
      { price: 66400, volume:  920 },
    ],
  },
}
