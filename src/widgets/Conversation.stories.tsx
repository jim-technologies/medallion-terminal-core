import type { Meta, StoryObj } from '@storybook/react'
import { Conversation } from './Conversation'

const teamChannel = {
  id: 'channel-launch',
  title: '# launch-room',
  subtitle: 'Launch coordination · 8 members',
  viewer_id: 'jun',
  unread_count: 3,
  participants: [
    { id: 'jun', name: 'Jun', status: 'online' },
    { id: 'maya', name: 'Maya Chen', status: 'online' },
    { id: 'lina', name: 'Lina Torres', status: 'away' },
  ],
  messages: [
    {
      id: 'team-1',
      timestamp: '2026-07-18T16:02:00Z',
      sender_id: 'maya',
      body: 'Final launch review starts at 10:00. I linked the operating brief and open decisions.',
      attachments: [{
        id: 'brief',
        name: 'Launch operating brief.pdf',
        kind: 'file',
        url: '/files/launch-operating-brief.pdf',
        content_type: 'application/pdf',
        size_bytes: 2_480_000,
      }],
      reactions: [
        { key: 'eyes', label: '👀', count: 4, viewer_reacted: true },
        { key: 'check', label: '✅', count: 2 },
      ],
      thread_reply_count: 5,
    },
    {
      id: 'team-2',
      timestamp: '2026-07-18T16:08:00Z',
      sender_id: 'jun',
      body: 'I reviewed the rollout gates. Support staffing is the only item still marked at risk.',
      status: 'read',
    },
    {
      id: 'team-3',
      timestamp: '2026-07-18T16:10:00Z',
      sender_id: 'jun',
      body: 'I’ll resolve the owner and update the decision log before the review.',
      reactions: [{ key: 'raised-hands', label: '🙌', count: 3 }],
    },
    {
      id: 'team-4',
      timestamp: '2026-07-18T16:14:00Z',
      sender_id: 'lina',
      reply_to_id: 'team-2',
      body: 'Perfect. The customer communication is approved and ready to schedule.',
      context: { workstream: 'customer-communications' },
    },
  ],
}

const customerMessaging = {
  id: 'customer-northwind',
  title: 'Northwind delivery',
  subtitle: 'Customer conversation · last active now',
  viewer_id: 'jun',
  participants: [
    { id: 'jun', name: 'Jun', role: 'owner', status: 'online' },
    { id: 'maya', name: 'Maya Chen', role: 'customer', status: 'online' },
  ],
  messages: [
    {
      id: 'direct-1',
      timestamp: '2026-07-18T15:42:00Z',
      sender_id: 'maya',
      body: 'Could we move tomorrow’s delivery window to after 2 PM?',
      status: 'delivered',
    },
    {
      id: 'direct-2',
      timestamp: '2026-07-18T15:45:00Z',
      sender_id: 'jun',
      body: 'Yes — I’ve moved it to 2–4 PM and notified the field team.',
      status: 'read',
    },
    {
      id: 'direct-3',
      timestamp: '2026-07-18T15:46:00Z',
      sender_id: 'maya',
      body: 'Thank you! That works perfectly.',
      reactions: [{ key: 'heart', label: '❤', count: 1, viewer_reacted: true }],
      status: 'read',
    },
  ],
}

const aiConversation = {
  id: 'assistant-business-review',
  title: 'Business review assistant',
  subtitle: 'Grounded in approved operating data',
  viewer_id: 'jun',
  participants: [
    { id: 'jun', name: 'Jun', role: 'user' },
    { id: 'assistant', name: 'Operations assistant', role: 'assistant', status: 'ready' },
  ],
  messages: [
    {
      id: 'ai-system',
      kind: 'system',
      timestamp: '2026-07-18T16:20:00Z',
      body: 'Connected to revenue, cash, pipeline, fulfillment, and support sources.',
    },
    {
      id: 'ai-user',
      timestamp: '2026-07-18T16:21:00Z',
      sender_id: 'jun',
      body: 'What needs my attention before Monday?',
    },
    {
      id: 'ai-tool',
      kind: 'tool',
      timestamp: '2026-07-18T16:21:01Z',
      sender_name: 'query_business_health',
      body: '{ "range": "7d", "severity": ["warning", "critical"] }',
      status: 'complete',
    },
    {
      id: 'ai-assistant',
      kind: 'assistant',
      timestamp: '2026-07-18T16:21:04Z',
      sender_id: 'assistant',
      body:
        'Three items need attention:\n\n'
        + '1. Assign an owner for the support staffing gap.\n'
        + '2. Review two invoices now more than 30 days overdue.\n'
        + '3. Approve the replenishment order for the West warehouse.',
      attachments: [{
        id: 'source',
        name: 'Open decision register',
        kind: 'link',
        url: '/decisions?status=open',
      }],
      reactions: [{ key: 'useful', label: 'Useful', count: 1, viewer_reacted: true }],
    },
  ],
}

const meta = {
  title: 'Widgets/Conversation',
  component: Conversation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One vendor-neutral conversation renderer with product-named proof cases: '
          + 'Slack channels, WhatsApp direct messaging, and ChatGPT assistant/tool turns.',
      },
    },
  },
  decorators: [
    Story => <div className="h-[34rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
  args: {
    data: teamChannel,
    options: {
      mode: 'channel',
      search: true,
      show_participants: true,
    },
  },
} satisfies Meta<typeof Conversation>

export default meta
type Story = StoryObj<typeof meta>

export const SlackChannel: Story = {
  name: 'Slack · channel and thread',
}

export const WhatsAppConversation: Story = {
  name: 'WhatsApp · direct conversation',
  args: {
    data: customerMessaging,
    options: {
      mode: 'direct',
      show_participants: true,
      show_delivery_status: true,
    },
  },
}

export const ChatGPTConversation: Story = {
  name: 'ChatGPT · assistant and tools',
  args: {
    data: aiConversation,
    options: {
      mode: 'assistant',
      show_participants: false,
    },
  },
}

export const Empty: Story = {
  args: { data: { messages: [] } },
}
