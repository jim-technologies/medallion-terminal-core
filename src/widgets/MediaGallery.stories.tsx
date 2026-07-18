import type { Meta, StoryObj } from '@storybook/react'
import { MediaGallery } from './MediaGallery'

const media = {
  total: 8,
  collections: [
    { id: 'travel', name: 'Travel', item_count: 5 },
    { id: 'work', name: 'Work', item_count: 3 },
  ],
  items: [
    {
      id: 'coast-01',
      title: 'Northern coast',
      kind: 'MEDIA_KIND_IMAGE',
      url: '/examples/media-demo.svg#coast',
      captured_at: '2026-07-16T18:42:00Z',
      width: 4032,
      height: 3024,
      favorite: true,
      tags: ['coast', 'summer'],
      collection_ids: ['travel'],
      metadata: { camera: 'Mirrorless', lens: '35mm' },
    },
    {
      id: 'ridge-01',
      title: 'Evening ridge',
      kind: 'MEDIA_KIND_IMAGE',
      url: '/examples/media-demo.svg#ridge',
      captured_at: '2026-07-16T17:18:00Z',
      width: 4032,
      height: 3024,
      tags: ['mountains', 'sunset'],
      collection_ids: ['travel'],
    },
    {
      id: 'coast-clip',
      title: 'Coastal approach',
      kind: 'MEDIA_KIND_VIDEO',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail_url: '/examples/media-demo.svg#harbor',
      captured_at: '2026-07-16T16:55:00Z',
      duration_seconds: 15,
      content_type: 'video/mp4',
      collection_ids: ['travel'],
    },
    {
      id: 'city-01',
      title: 'After hours',
      kind: 'MEDIA_KIND_IMAGE',
      url: '/examples/media-demo.svg#city',
      captured_at: '2026-07-12T04:22:00Z',
      width: 3840,
      height: 2560,
      favorite: true,
      tags: ['city', 'night'],
      collection_ids: ['travel'],
    },
    {
      id: 'forest-01',
      title: 'Trail study',
      kind: 'image',
      url: '/examples/media-demo.svg#forest',
      captured_at: '2026-07-12T00:14:00Z',
      width: 3024,
      height: 4032,
      collection_ids: ['travel'],
    },
    {
      id: 'studio-01',
      title: 'Campaign selects',
      kind: 'image',
      url: '/examples/media-demo.svg#studio',
      captured_at: '2026-06-28T19:05:00Z',
      width: 4096,
      height: 2731,
      tags: ['campaign', 'approved'],
      collection_ids: ['work'],
      metadata: { status: 'approved', owner: 'Creative' },
    },
    {
      id: 'harbor-01',
      title: 'Harbor inspection',
      kind: 'image',
      url: '/examples/media-demo.svg#harbor',
      captured_at: '2026-06-28T18:16:00Z',
      width: 4096,
      height: 2731,
      collection_ids: ['work'],
      metadata: { site: 'Pier 4', inspection: 'complete' },
    },
    {
      id: 'walkthrough-clip',
      title: 'Studio walkthrough',
      kind: 'video',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail_url: '/examples/media-demo.svg#studio',
      captured_at: '2026-06-28T17:44:00Z',
      duration_seconds: 15,
      content_type: 'video/mp4',
      collection_ids: ['work'],
      context: { media_id: 'walkthrough-clip', project_id: 'campaign-26' },
    },
  ],
}

const meta = {
  title: 'Widgets/MediaGallery',
  component: MediaGallery,
  args: {
    data: media,
    options: {
      group_by: 'day',
      search: true,
      kind_filter: true,
      collection_filter: true,
    },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => <div className="h-[42rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
} satisfies Meta<typeof MediaGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Timeline: Story = {}

export const CompactCollection: Story = {
  args: {
    options: {
      group_by: 'month',
      density: 'compact',
      show_details: false,
    },
  },
}
