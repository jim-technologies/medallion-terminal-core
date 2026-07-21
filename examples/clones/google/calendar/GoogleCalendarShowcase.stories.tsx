import type { Meta, StoryObj } from '@storybook/react'
import { GoogleCalendarShowcase } from './GoogleCalendarShowcase'

const meta = {
  title: 'Clones/Google/Calendar',
  component: GoogleCalendarShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Google',
    cloneProduct: 'Google Calendar',
    cloneNamespace: 'google-calendar',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful Google Calendar shell over neutral calendar '
          + 'sources and event records. Month, week, day, schedule, details, and creation '
          + 'states stay in showcase code rather than expanding the published framework API.',
      },
    },
  },
  args: {
    initialDate: '2026-07-20',
    initialView: 'month',
    sidebarOpen: true,
    showRightRail: true,
    today: '2026-07-20',
  },
  argTypes: {
    calendars: { control: false },
    events: { control: false },
    onCreateEvent: { action: 'create event' },
    onSelectEvent: { action: 'select event' },
    initialView: {
      control: 'inline-radio',
      options: ['month', 'week', 'day', 'schedule'],
    },
  },
} satisfies Meta<typeof GoogleCalendarShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MonthView: Story = {}

export const WeekPlanning: Story = {
  args: {
    initialView: 'week',
  },
}

export const FocusedDay: Story = {
  args: {
    initialView: 'day',
  },
}

export const ScheduleAgenda: Story = {
  args: {
    initialView: 'schedule',
  },
}

export const EventDetails: Story = {
  args: {
    initialView: 'week',
    initialSelectedEventId: 'q3-finance-review',
  },
}

export const QuickCreate: Story = {
  args: {
    initialView: 'week',
    initialComposerOpen: true,
  },
}
