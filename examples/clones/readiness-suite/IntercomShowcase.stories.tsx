import type { Meta, StoryObj } from '@storybook/react'
import { IntercomShowcase } from './IntercomShowcase'

const meta = {
  title: 'Clones/SME/Intercom',
  component: IntercomShowcase,
  parameters: {
    layout: 'fullscreen',
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
    workspaceName: 'Northstar',
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
