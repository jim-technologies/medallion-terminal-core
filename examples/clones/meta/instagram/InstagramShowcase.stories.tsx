import type { Meta, StoryObj } from '@storybook/react'
import { MetaSocialShowcase } from '../shared/MetaSocialShowcase'

const meta = {
  title: 'Clones/Meta/Instagram',
  component: MetaSocialShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Meta',
    cloneProduct: 'Meta Instagram',
    cloneNamespace: 'meta-instagram',
    docs: {
      description: {
        component: 'An Instagram-style social media reference with stories, a media-first feed, search and discovery, profile presentation, and host-observable engagement actions.',
      },
    },
  },
  args: {
    product: 'instagram',
    initialView: 'feed',
  },
  argTypes: {
    product: { control: false },
    posts: { control: false },
    stories: { control: false },
    suggestions: { control: false },
    initialView: {
      control: 'inline-radio',
      options: ['feed', 'explore', 'profile'],
    },
    onViewChange: { action: 'change view' },
    onSelectPost: { action: 'select post' },
    onToggleLike: { action: 'toggle like' },
    onToggleSave: { action: 'toggle save' },
    onToggleFollow: { action: 'toggle follow' },
  },
} satisfies Meta<typeof MetaSocialShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const HomeFeed: Story = {}
export const Explore: Story = { args: { initialView: 'explore' } }
export const Profile: Story = { args: { initialView: 'profile' } }
