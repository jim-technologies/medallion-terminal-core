import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { IntercomShowcase } from './IntercomShowcase'

const meta = {
  title: 'Clones/Intercom',
  component: IntercomShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneProduct: 'Intercom',
    cloneNamespace: 'intercom',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A three-pane shared inbox proving conversation threads, AI handoff, internal notes, '
          + 'ticket state, assignment, customer context, and support reporting.',
      },
    },
  },
  args: {
    initialSection: 'inbox',
    initialSelectedConversationId: 'conv-1042',
    workspaceName: CLONE_DEMO_IDENTITY.company,
  },
  argTypes: {
    conversations: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['inbox', 'tickets', 'reporting'],
    },
    onSelectConversation: { action: 'select conversation' },
    onSendMessage: { action: 'send message' },
  },
} satisfies Meta<typeof IntercomShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const SharedInbox: Story = {}

export const TicketQueue: Story = {
  args: {
    initialSection: 'tickets',
    initialSelectedConversationId: 'conv-1041',
  },
}

export const SupportReporting: Story = {
  args: {
    initialSection: 'reporting',
  },
}
