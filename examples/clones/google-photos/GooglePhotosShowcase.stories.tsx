import type { Meta, StoryObj } from '@storybook/react'
import { GooglePhotosShowcase } from './GooglePhotosShowcase'

const meta = {
  title: 'Clones/Google Photos',
  component: GooglePhotosShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneProduct: 'Google Photos',
    cloneNamespace: 'google-photos',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful Photos shell powered by the framework’s neutral '
          + 'image/video, collection, timestamp, favorite, metadata, and context contracts.',
      },
    },
  },
  args: {
    initialSection: 'photos',
    initialQuery: '',
    showMemories: true,
    showAskPhotos: true,
  },
  argTypes: {
    items: { control: false },
    collections: { control: false },
    initialSection: {
      control: 'select',
      options: [
        'photos',
        'updates',
        'collections',
        'albums',
        'favorites',
        'people',
        'places',
        'videos',
        'recent',
        'archive',
        'locked',
        'trash',
      ],
    },
  },
} satisfies Meta<typeof GooglePhotosShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PhotoTimeline: Story = {}

export const Collections: Story = {
  args: {
    initialSection: 'collections',
  },
}

export const Albums: Story = {
  args: {
    initialSection: 'albums',
    showMemories: false,
  },
}

export const AskPhotosSearch: Story = {
  args: {
    initialQuery: 'coast',
    showMemories: false,
  },
}

export const ImmersiveViewer: Story = {
  args: {
    initialSelectedId: 'golden-coast',
    initialDetailsOpen: true,
  },
}
