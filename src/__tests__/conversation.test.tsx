import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ConversationImpl } from '../widgets/ConversationImpl'
import { unwrapDataResponse } from '../hooks/useDataSource'
import {
  conversationSelectionContext,
  normalizeConversation,
} from '../widgets/conversationShape'

describe('conversation shape', () => {
  it('unwraps the conversation oneof returned by TerminalService', () => {
    const payload = { id: 'room', messages: [{ id: 'one', body: 'Hello' }] }
    expect(unwrapDataResponse({ conversation: payload })).toEqual(payload)
  })

  it('normalizes canonical and convenient aliases into one stable transcript', () => {
    const conversation = normalizeConversation({
      conversation_id: 'launch-room',
      channel: 'launch-room',
      topic: 'Launch coordination',
      current_participant_id: 'jun',
      unread_count: '2',
      next_page_token: 'older-page',
      context: { workspace_id: 'jim-technologies' },
      participants: [
        {
          participant_id: 'maya',
          display_name: 'Maya Chen',
          avatar_url: 'javascript:alert(1)',
          presence: 'online',
        },
      ],
      transcript: [
        {
          message_id: 'message-1',
          created_at: '2026-07-18T16:02:00Z',
          author_id: 'maya',
          text: 'The launch brief is ready.',
          is_edited: true,
          delivery_status: 'read',
          attachments: [{
            filename: 'Launch brief.pdf',
            href: '/files/launch-brief.pdf',
            mime_type: 'application/pdf',
            size: '2048',
          }],
          reactions: [{
            emoji: '✅',
            count: '3',
            viewer_reacted: true,
          }],
          reply_count: '4',
          context: { workstream: 'launch' },
        },
      ],
    })

    expect(conversation).toMatchObject({
      id: 'launch-room',
      title: 'launch-room',
      subtitle: 'Launch coordination',
      viewerId: 'jun',
      unreadCount: 2,
      nextPageToken: 'older-page',
      context: { workspace_id: 'jim-technologies' },
    })
    expect(conversation.participants[0]).toMatchObject({
      id: 'maya',
      name: 'Maya Chen',
      avatarUrl: undefined,
      status: 'online',
    })
    expect(conversation.messages[0]).toMatchObject({
      id: 'message-1',
      senderId: 'maya',
      senderName: 'Maya Chen',
      body: 'The launch brief is ready.',
      edited: true,
      status: 'read',
      threadReplyCount: 4,
      context: { workstream: 'launch' },
    })
    expect(conversation.messages[0].attachments[0]).toMatchObject({
      name: 'Launch brief.pdf',
      kind: 'file',
      url: '/files/launch-brief.pdf',
      contentType: 'application/pdf',
      sizeBytes: 2048,
    })
    expect(conversation.messages[0].reactions[0]).toMatchObject({
      label: '✅',
      count: 3,
      viewerReacted: true,
    })
  })

  it('accepts array shorthand and keeps the latest duplicate representation', () => {
    const conversation = normalizeConversation([
      'First message',
      { id: 'duplicate', body: 'Old body' },
      { id: 'duplicate', body: 'Updated body', role: 'assistant' },
      null,
    ])

    expect(conversation.messages).toHaveLength(2)
    expect(conversation.messages.map(message => message.id)).toEqual([
      'message-1',
      'duplicate',
    ])
    expect(conversation.messages[1]).toMatchObject({
      body: 'Updated body',
      kind: 'assistant',
      senderName: 'Assistant',
    })
  })

  it('merges selection context with message values taking precedence', () => {
    const conversation = normalizeConversation({
      id: 'conversation-7',
      context: { account_id: 'account-1', scope: 'conversation' },
      messages: [{
        id: 'message-9',
        sender_id: 'maya',
        body: 'Ready',
        context: { scope: 'message', record_id: 'record-4' },
      }],
    })

    expect(conversationSelectionContext(
      conversation,
      conversation.messages[0],
      {
        conversationKey: 'thread',
        messageKey: 'selected_message',
        senderKey: 'participant',
      },
    )).toEqual({
      account_id: 'account-1',
      scope: 'message',
      record_id: 'record-4',
      thread: 'conversation-7',
      selected_message: 'message-9',
      participant: 'maya',
    })
  })
})

describe('Conversation widget', () => {
  const data = {
    id: 'room',
    title: '# launch-room',
    subtitle: 'Launch coordination',
    viewer_id: 'jun',
    unread_count: 3,
    next_page_token: 'older',
    participants: [
      { id: 'jun', name: 'Jun' },
      { id: 'maya', name: 'Maya Chen' },
      { id: 'assistant', name: 'Operations assistant' },
    ],
    messages: [
      {
        id: 'brief',
        sender_id: 'maya',
        timestamp: '2026-07-18T16:02:00Z',
        body: 'The operating brief is ready.',
        attachments: [{
          id: 'file',
          name: 'Operating brief.pdf',
          kind: 'file',
          url: '/files/brief.pdf',
          size_bytes: 2048,
        }],
        reactions: [{ key: 'check', label: '✅', count: 3 }],
        thread_reply_count: 5,
      },
      {
        id: 'reply',
        sender_id: 'jun',
        timestamp: '2026-07-18T16:05:00Z',
        body: 'Reviewed.',
        reply_to_id: 'brief',
        status: 'read',
      },
      {
        id: 'system',
        kind: 'system',
        body: 'Maya joined the channel.',
      },
      {
        id: 'tool',
        kind: 'tool',
        sender_name: 'query_launch_readiness',
        body: '{ "range": "7d" }',
        status: 'complete',
      },
      {
        id: 'assistant',
        kind: 'assistant',
        sender_id: 'assistant',
        body: 'One staffing decision remains open.',
      },
    ],
  }

  it('renders channel anatomy, threads, replies, reactions, and attachments', () => {
    const html = renderToStaticMarkup(
      <ConversationImpl
        data={data}
        options={{ mode: 'channel', search: true }}
      />,
    )

    expect(html).toContain('# launch-room')
    expect(html).toContain('3 unread')
    expect(html).toContain('Search messages')
    expect(html).toContain('Operating brief.pdf')
    expect(html).toContain('✅ 3')
    expect(html).toContain('5 replies')
    expect(html).toContain('Maya Chen')
    expect(html).toContain('Older history available')
  })

  it('renders direct-message delivery state and assistant tool turns', () => {
    const direct = renderToStaticMarkup(
      <ConversationImpl data={data} options={{ mode: 'direct' }} />,
    )
    const assistant = renderToStaticMarkup(
      <ConversationImpl data={data} options={{ mode: 'assistant' }} />,
    )

    expect(direct).toContain('read')
    expect(direct).toContain('Maya joined the channel.')
    expect(assistant).toContain('Tool · query_launch_readiness')
    expect(assistant).toContain('One staffing decision remains open.')
  })

  it('renders a stable empty state for malformed or empty payloads', () => {
    expect(renderToStaticMarkup(<ConversationImpl data={null} />))
      .toContain('No messages')
    expect(renderToStaticMarkup(<ConversationImpl data={{ messages: [null, {}] }} />))
      .toContain('No messages')
  })
})
