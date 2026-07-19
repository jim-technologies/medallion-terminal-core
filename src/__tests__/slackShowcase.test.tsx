import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  SLACK_SAMPLE_CHANNELS,
  SLACK_SAMPLE_MEMBERS,
  SlackShowcase,
  searchSlackMessages,
  slackChannelConversation,
  type SlackChannel,
  type SlackMember,
} from '../../examples/clones/slack/SlackShowcase'

describe('SlackShowcase', () => {
  it('projects channel data through the canonical conversation contract', () => {
    const conversation = slackChannelConversation(
      SLACK_SAMPLE_CHANNELS[0],
      SLACK_SAMPLE_MEMBERS,
      'jun',
    )

    expect(conversation).toMatchObject({
      id: 'launch-room',
      title: '# launch-room',
      viewerId: 'jun',
      unreadCount: 3,
      context: { channel_id: 'launch-room' },
    })
    expect(conversation.messages.find(message => message.id === 'launch-1'))
      .toMatchObject({
        senderName: 'Maya Chen',
        threadReplyCount: 5,
        context: { workstream: 'launch' },
      })
    expect(conversation.messages.filter(message => message.replyToId === 'launch-1'))
      .toHaveLength(5)
  })

  it('searches across senders, message copy, and attachments', () => {
    const conversation = slackChannelConversation(
      SLACK_SAMPLE_CHANNELS[0],
      SLACK_SAMPLE_MEMBERS,
      'jun',
    )

    expect(searchSlackMessages(conversation, 'finance sign-off').map(message => message.id))
      .toEqual(['launch-1-reply-1'])
    expect(searchSlackMessages(conversation, 'operating brief').map(message => message.id))
      .toEqual(['launch-1'])
    expect(searchSlackMessages(conversation, 'workflow builder').map(message => message.id))
      .toEqual(['launch-5'])
  })

  it('server-renders the complete Slack application anatomy', () => {
    const html = renderToStaticMarkup(<SlackShowcase />)

    expect(html).toContain('Search Jim Technologies')
    expect(html).toContain('Channels')
    expect(html).toContain('Direct messages')
    expect(html).toContain('# launch-room')
    expect(html).toContain('Launch operating brief.pdf')
    expect(html).toContain('Workflow Builder')
    expect(html).toContain('5 replies')
    expect(html).toContain('Reply to thread')
    expect(html).toContain('Message #launch-room')
    expect(html).toContain('All systems normal')
  })

  it('renders another product channel without forcing the thread pane', () => {
    const html = renderToStaticMarkup(
      <SlackShowcase
        initialChannelId="customer-signals"
        initialThreadMessageId=""
      />,
    )

    expect(html).toContain('# customer-signals')
    expect(html).toContain('Northwind expanded its pilot')
    expect(html).not.toContain('Reply to thread')
  })

  it('accepts host-provided members and channels', () => {
    const members: SlackMember[] = [{
      id: 'owner',
      name: 'Host Owner',
      status: 'online',
      avatarColor: '#315b76',
    }]
    const channels: SlackChannel[] = [{
      id: 'host-channel',
      name: 'host-channel',
      topic: 'Host-provided data',
      memberCount: 1,
      messages: [{
        id: 'host-message',
        senderId: 'owner',
        body: 'A host-provided conversation.',
      }],
    }]

    const html = renderToStaticMarkup(
      <SlackShowcase
        workspaceName="Host Workspace"
        currentUserId="owner"
        members={members}
        channels={channels}
        directMessages={[]}
        initialChannelId="host-channel"
        initialThreadMessageId=""
      />,
    )

    expect(html).toContain('Host Workspace')
    expect(html).toContain('# host-channel')
    expect(html).toContain('A host-provided conversation.')
    expect(html).not.toContain('Launch operating brief.pdf')
  })
})
