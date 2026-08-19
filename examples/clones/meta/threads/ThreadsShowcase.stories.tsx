import type { Meta, StoryObj } from '@storybook/react'
import { MetaSocialShowcase } from '../shared/MetaSocialShowcase'

const meta = {
  title: 'Clones/Meta/Threads',
  component: MetaSocialShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Meta',
    cloneProduct: 'Meta Threads',
    cloneNamespace: 'meta-threads',
    docs: {
      description: {
        component: 'A Threads-style conversation reference with for-you and following feeds, compact media posts, discovery, profile presentation, and host-observable engagement actions.',
      },
    },
  },
  args: {
    product: 'threads',
    initialView: 'for-you',
  },
  argTypes: {
    product: { control: false },
    posts: { control: false },
    stories: { control: false },
    suggestions: { control: false },
    initialView: {
      control: 'inline-radio',
      options: ['for-you', 'following', 'profile'],
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

export const ForYou: Story = {}
export const Following: Story = { args: { initialView: 'following' } }
export const Profile: Story = { args: { initialView: 'profile' } }
