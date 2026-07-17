import type { Meta, StoryObj } from '@storybook/react'
import { RecordCalendar } from './RecordCalendar'
import { RECORD_SET_STORY_DATA } from './recordStories.fixture'

const meta = {
  title: 'Widgets/Records/RecordCalendar',
  component: RecordCalendar,
  args: {
    data: RECORD_SET_STORY_DATA,
    options: {
      view_id: 'delivery_calendar',
      color_field: 'stage',
      initial_month: '2026-07',
      week_starts_on: 1,
    },
    widgetId: 'records-calendar',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => <div className="h-[40rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
} satisfies Meta<typeof RecordCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
