import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { SlackShowcase } from './SlackShowcase'

const meta = {
  title: 'Clones/Slack',
  component: SlackShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneProduct: 'Slack',
    cloneNamespace: 'slack',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A product-faithful Slack workspace backed by the generic conversation contract. '
          + 'It proves channels, presence, search, reactions, attachments, threaded replies, '
          + 'direct-message navigation, app messages, and composition without adding Slack-specific '
          + 'concepts to the published framework.',
      },
    },
  },
  args: {
    workspaceName: CLONE_DEMO_IDENTITY.company,
    currentUserId: 'jun',
    initialChannelId: 'launch-room',
    initialThreadMessageId: 'launch-1',
  },
  argTypes: {
    members: { control: false },
    channels: { control: false },
    directMessages: { control: false },
    initialChannelId: {
      control: 'select',
      options: [
        'launch-room',
        'customer-signals',
        'ops-command',
        'finance-forecast',
        'product',
      ],
    },
    onSelectChannel: { action: 'select channel' },
    onSelectMessage: { action: 'select message' },
    onSendMessage: { action: 'send message' },
  },
} satisfies Meta<typeof SlackShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const LaunchChannel: Story = {}

export const CustomerSignals: Story = {
  args: {
    initialChannelId: 'customer-signals',
    initialThreadMessageId: '',
  },
}

export const OperationsChannel: Story = {
  args: {
    initialChannelId: 'ops-command',
    initialThreadMessageId: '',
  },
}

export const ChannelWithoutThread: Story = {
  args: {
    initialThreadMessageId: '',
  },
}
