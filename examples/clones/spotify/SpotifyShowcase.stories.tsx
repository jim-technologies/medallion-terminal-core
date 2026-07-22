import type { Meta, StoryObj } from '@storybook/react'
import { SpotifyShowcase } from './SpotifyShowcase'

const meta = {
  title: 'Clones/Spotify',
  component: SpotifyShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Spotify',
    cloneProduct: 'Spotify',
    cloneNamespace: 'spotify',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, host-data-driven music product reference covering discovery, '
          + 'search, Your Library, playlist detail, queue, and Now Playing presentation. '
          + 'Audio delivery, recommendations, rights, and persistence stay host-owned.',
      },
    },
  },
  args: {
    initialView: 'home',
    initialQuery: '',
    initialSidePanel: 'now-playing',
  },
  argTypes: {
    tracks: { control: false },
    collections: { control: false },
    shelves: { control: false },
    onPlay: { action: 'play track' },
    onSelectCollection: { action: 'select collection' },
    onToggleLike: { action: 'toggle like' },
    initialView: {
      control: 'select',
      options: ['home', 'search', 'library', 'playlist'],
    },
    initialSidePanel: {
      control: 'select',
      options: ['now-playing', 'queue', null],
    },
  },
} satisfies Meta<typeof SpotifyShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PersonalizedHome: Story = {}

export const SearchAndBrowse: Story = {
  args: {
    initialView: 'search',
    initialQuery: 'systems',
    initialSidePanel: null,
  },
}

export const YourLibrary: Story = {
  args: {
    initialView: 'library',
    initialSidePanel: null,
  },
}

export const PlaylistDetail: Story = {
  args: {
    initialCollectionId: 'deep-focus-jun',
    initialSidePanel: 'now-playing',
  },
}

export const QueueAndJam: Story = {
  args: {
    initialCollectionId: 'jim-studio-mix',
    initialTrackId: 'soft-circuit',
    initialSidePanel: 'queue',
  },
}
