import type { Meta, StoryObj } from '@storybook/react'
import { NetflixShowcase } from './NetflixShowcase'

const meta = {
  title: 'Clones/Netflix',
  component: NetflixShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Netflix',
    cloneProduct: 'Netflix',
    cloneNamespace: 'netflix',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful streaming reference over neutral title, rail, '
          + 'episode, and profile records. Browse, discovery, detail, profile, and player '
          + 'presentation remain example code; delivery, entitlement, and DRM stay host-owned.',
      },
    },
  },
  args: {
    initialSection: 'home',
    initialQuery: '',
    initialProfileGate: false,
  },
  argTypes: {
    titles: { control: false },
    rails: { control: false },
    profiles: { control: false },
    onPlay: { action: 'play title' },
    onSelectTitle: { action: 'select title' },
    onToggleMyList: { action: 'toggle My List' },
    initialSection: {
      control: 'select',
      options: ['home', 'shows', 'movies', 'new', 'my-list'],
    },
  },
} satisfies Meta<typeof NetflixShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PersonalizedHome: Story = {}

export const TvShows: Story = {
  args: {
    initialSection: 'shows',
  },
}

export const SearchAndBrowse: Story = {
  args: {
    initialQuery: 'coast',
  },
}

export const MyList: Story = {
  args: {
    initialSection: 'my-list',
  },
}

export const TitleDetails: Story = {
  args: {
    initialSelectedId: 'field-notes',
  },
}

export const VideoPlayer: Story = {
  args: {
    initialPlayerId: 'field-notes',
  },
}

export const WhosWatching: Story = {
  args: {
    initialProfileGate: true,
  },
}
