import type { Meta, StoryObj } from '@storybook/react'
import { GoogleMapsTimelineShowcase } from './GoogleMapsTimelineShowcase'

const meta = {
  title: 'Clones/Google Maps Timeline',
  component: GoogleMapsTimelineShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'google-maps-timeline',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A provider-agnostic Timeline surface connecting dated routes, travel modes, '
          + 'visited places, trip summaries, and related photo/video presentation.',
      },
    },
  },
  args: {
    initialSection: 'day',
    initialDayId: '2026-07-12',
    initialSelectedStopId: 'coit-tower',
    basemapLabel: 'OpenFreeMap · configurable',
  },
  argTypes: {
    days: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['day', 'trips', 'places'],
    },
    onSelectStop: { action: 'select stop' },
  },
} satisfies Meta<typeof GoogleMapsTimelineShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const DayHistory: Story = {}

export const TripLibrary: Story = {
  args: {
    initialSection: 'trips',
  },
}

export const VisitedPlaces: Story = {
  args: {
    initialSection: 'places',
  },
}
