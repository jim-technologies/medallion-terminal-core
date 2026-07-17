import type { Meta, StoryObj } from '@storybook/react'
import { RecordBoard } from './RecordBoard'
import { RECORD_SET_STORY_DATA } from './recordStories.fixture'

const meta = {
  title: 'Widgets/Records/RecordBoard',
  component: RecordBoard,
  args: {
    data: RECORD_SET_STORY_DATA,
    options: {
      view_id: 'active_board',
      card_fields: ['customer', 'owner', 'value', 'due_date', 'priority'],
      search: true,
    },
    widgetId: 'records-board',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => <div className="h-[34rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
} satisfies Meta<typeof RecordBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
