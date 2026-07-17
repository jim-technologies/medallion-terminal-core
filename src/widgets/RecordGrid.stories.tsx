import type { Meta, StoryObj } from '@storybook/react'
import { RecordGrid } from './RecordGrid'
import { RECORD_SET_STORY_DATA } from './recordStories.fixture'

const meta = {
  title: 'Widgets/Records/RecordGrid',
  component: RecordGrid,
  args: {
    data: RECORD_SET_STORY_DATA,
    options: { view_id: 'all_work', search: true, inline_edit: true },
    widgetId: 'records-grid',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => <div className="h-[32rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
} satisfies Meta<typeof RecordGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
