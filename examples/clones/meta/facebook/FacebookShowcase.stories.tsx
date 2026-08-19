import type { Meta, StoryObj } from '@storybook/react'
import { MetaSocialShowcase } from '../shared/MetaSocialShowcase'

const meta = {
  title: 'Clones/Meta/Facebook',
  component: MetaSocialShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Meta',
    cloneProduct: 'Meta Facebook',
    cloneNamespace: 'meta-facebook',
    docs: {
      description: {
        component: 'A Facebook-style social workspace reference with stories, a rich feed, groups, a business page, contacts, search, and host-observable engagement actions.',
      },
    },
  },
  args: {
    product: 'facebook',
    initialView: 'feed',
  },
  argTypes: {
    product: { control: false },
    posts: { control: false },
    stories: { control: false },
    suggestions: { control: false },
    initialView: {
      control: 'inline-radio',
      options: ['feed', 'groups', 'business-page'],
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
export const Groups: Story = { args: { initialView: 'groups' } }
export const BusinessPage: Story = { args: { initialView: 'business-page' } }
