import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  normalizeConversation,
  type ConversationData,
  type ConversationMessageData,
} from '../../../src/widgets/conversationShape'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { OperationalShowcaseIcon } from '../shared/OperationalShowcasePrimitives'
import './SlackShowcase.css'

export interface SlackMember {
  id: string
  name: string
  title?: string
  status?: 'online' | 'away' | 'offline'
  avatarColor?: string
}

export interface SlackAttachment {
  id: string
  name: string
  kind?: string
  url?: string
  contentType?: string
  sizeBytes?: number
  description?: string
}

export interface SlackReaction {
  key: string
  label: string
  count: number
  viewerReacted?: boolean
}

export interface SlackMessage {
  id: string
  timestamp?: string
  senderId?: string
  senderName?: string
  kind?: 'message' | 'system' | 'event' | 'assistant' | 'tool'
  body?: string
  replyToId?: string
  edited?: boolean
  status?: string
  attachments?: SlackAttachment[]
  reactions?: SlackReaction[]
  threadReplyCount?: number
  context?: Record<string, string>
}

export interface SlackChannel {
  id: string
  name: string
  topic?: string
  description?: string
  private?: boolean
  unreadCount?: number
  memberCount?: number
  messages: SlackMessage[]
}

export interface SlackDirectMessage {
  memberId: string
  unreadCount?: number
}

export interface SlackShowcaseProps {
  workspaceName?: string
  currentUserId?: string
  members?: readonly SlackMember[]
  channels?: readonly SlackChannel[]
  directMessages?: readonly SlackDirectMessage[]
  initialChannelId?: string
  initialThreadMessageId?: string
  onSelectChannel?: (channel: SlackChannel) => void
  onSelectMessage?: (message: ConversationMessageData, channel: SlackChannel) => void
  onSendMessage?: (channel: SlackChannel, body: string) => void
}

export const SLACK_SAMPLE_MEMBERS: readonly SlackMember[] = [
  {
    id: 'jun',
    name: CLONE_DEMO_IDENTITY.user,
    title: 'Founder',
    status: 'online',
    avatarColor: '#2f6f9f',
  },
  {
    id: 'maya',
    name: 'Maya Chen',
    title: 'Operations',
    status: 'online',
    avatarColor: '#b45365',
  },
  {
    id: 'lina',
    name: 'Lina Torres',
    title: 'Customer success',
    status: 'away',
    avatarColor: '#98703d',
  },
  {
    id: 'theo',
    name: 'Theo Martin',
    title: 'Finance',
    status: 'online',
    avatarColor: '#4b7d65',
  },
  {
    id: 'avery',
    name: 'Avery Brooks',
    title: 'Product',
    status: 'offline',
    avatarColor: '#735da3',
  },
  {
    id: 'workflow',
    name: 'Workflow Builder',
    title: 'App',
    status: 'online',
    avatarColor: '#267d86',
  },
] as const

export const SLACK_SAMPLE_CHANNELS: readonly SlackChannel[] = [
  {
    id: 'launch-room',
    name: 'launch-room',
    topic: 'Q3 launch coordination',
    description: 'Decisions, blockers, customer readiness, and launch-day coordination.',
    unreadCount: 3,
    memberCount: 8,
    messages: [
      {
        id: 'launch-1',
        timestamp: '2026-07-18T16:02:00Z',
        senderId: 'maya',
        body: 'Good morning! Final launch review starts at 10:00. I linked the operating brief and the open-decision register below.',
        attachments: [{
          id: 'launch-brief',
          name: 'Launch operating brief.pdf',
          kind: 'file',
          url: '/files/launch-operating-brief.pdf',
          contentType: 'application/pdf',
          sizeBytes: 2_480_000,
          description: 'Updated 8 minutes ago · 14 pages',
        }],
        reactions: [
          { key: 'eyes', label: '👀', count: 4, viewerReacted: true },
          { key: 'check', label: '✅', count: 2 },
        ],
        threadReplyCount: 5,
        context: { workstream: 'launch' },
      },
      {
        id: 'launch-2',
        timestamp: '2026-07-18T16:08:00Z',
        senderId: 'jun',
        body: 'I reviewed the rollout gates. Support staffing is the only item still marked at risk.',
        reactions: [{ key: 'thumbs-up', label: '👍', count: 3 }],
      },
      {
        id: 'launch-3',
        timestamp: '2026-07-18T16:10:00Z',
        senderId: 'jun',
        body: 'I’ll resolve the owner and update the decision log before the review.',
        reactions: [{ key: 'raised-hands', label: '🙌', count: 3 }],
      },
      {
        id: 'launch-4',
        timestamp: '2026-07-18T16:14:00Z',
        senderId: 'lina',
        body: 'Customer communication is approved. The audience segments and translations are ready to schedule.',
        attachments: [{
          id: 'campaign-preview',
          name: 'Customer launch campaign',
          kind: 'link',
          url: '/campaigns/customer-launch',
          description: '12 messages · 4 audience segments',
        }],
        reactions: [{ key: 'rocket', label: '🚀', count: 6, viewerReacted: true }],
        threadReplyCount: 2,
      },
      {
        id: 'launch-5',
        timestamp: '2026-07-18T16:18:00Z',
        senderId: 'workflow',
        body: 'Launch readiness changed from At risk → On track. 17 of 18 gates are complete.',
        kind: 'assistant',
        attachments: [{
          id: 'readiness-report',
          name: 'Open launch readiness',
          kind: 'link',
          url: '/launch/readiness',
          description: 'Automated workflow · just now',
        }],
        reactions: [{ key: 'party', label: '🎉', count: 5 }],
      },
      {
        id: 'launch-1-reply-1',
        timestamp: '2026-07-18T16:03:00Z',
        senderId: 'theo',
        replyToId: 'launch-1',
        body: 'Finance sign-off is complete. I added the final margin sensitivity to page 11.',
        reactions: [{ key: 'check', label: '✅', count: 2 }],
      },
      {
        id: 'launch-1-reply-2',
        timestamp: '2026-07-18T16:04:00Z',
        senderId: 'avery',
        replyToId: 'launch-1',
        body: 'Product screenshots are updated too. No copy changes needed.',
      },
      {
        id: 'launch-1-reply-3',
        timestamp: '2026-07-18T16:06:00Z',
        senderId: 'jun',
        replyToId: 'launch-1',
        body: 'Great. Let’s use this as the source of truth in the review.',
        reactions: [{ key: 'thumbs-up', label: '👍', count: 3 }],
      },
      {
        id: 'launch-1-reply-4',
        timestamp: '2026-07-18T16:07:00Z',
        senderId: 'maya',
        replyToId: 'launch-1',
        body: 'Pinned it to the channel and linked it from the meeting agenda.',
      },
      {
        id: 'launch-1-reply-5',
        timestamp: '2026-07-18T16:09:00Z',
        senderId: 'lina',
        replyToId: 'launch-1',
        body: 'Support leads have acknowledged the updated escalation path.',
      },
      {
        id: 'launch-4-reply-1',
        timestamp: '2026-07-18T16:15:00Z',
        senderId: 'jun',
        replyToId: 'launch-4',
        body: 'Schedule the first wave after the launch review, please.',
      },
      {
        id: 'launch-4-reply-2',
        timestamp: '2026-07-18T16:16:00Z',
        senderId: 'lina',
        replyToId: 'launch-4',
        body: 'Will do. It is staged and waiting for approval.',
      },
    ],
  },
  {
    id: 'customer-signals',
    name: 'customer-signals',
    topic: 'Customer health and product feedback',
    description: 'Important customer feedback, renewal signals, and emerging themes.',
    unreadCount: 8,
    memberCount: 12,
    messages: [
      {
        id: 'signal-1',
        timestamp: '2026-07-18T15:32:00Z',
        senderId: 'lina',
        body: 'Northwind expanded its pilot to two more locations. Their operations lead called the new timeline view “the missing piece.”',
        reactions: [
          { key: 'heart', label: '💚', count: 5 },
          { key: 'chart', label: '📈', count: 2 },
        ],
      },
      {
        id: 'signal-2',
        timestamp: '2026-07-18T15:40:00Z',
        senderId: 'avery',
        body: 'That maps to the strongest theme in this week’s interviews: customers want one operational view across files, records, maps, and conversations.',
        threadReplyCount: 3,
      },
      {
        id: 'signal-3',
        timestamp: '2026-07-18T15:44:00Z',
        senderId: 'jun',
        body: 'Please add that theme to Monday’s product review with the supporting customer notes.',
        reactions: [{ key: 'check', label: '✅', count: 2 }],
      },
    ],
  },
  {
    id: 'ops-command',
    name: 'ops-command',
    topic: 'Live operating coordination',
    description: 'Incidents, fulfillment, staffing, and service-level coordination.',
    memberCount: 9,
    messages: [
      {
        id: 'ops-1',
        timestamp: '2026-07-18T14:22:00Z',
        senderId: 'maya',
        body: 'West warehouse replenishment is awaiting final approval. Stock cover remains above the safety threshold through Tuesday.',
        reactions: [{ key: 'eyes', label: '👀', count: 2 }],
      },
      {
        id: 'ops-2',
        timestamp: '2026-07-18T14:26:00Z',
        senderId: 'jun',
        body: 'Approved. Keep the expedited option on hold unless the Monday forecast changes.',
      },
    ],
  },
  {
    id: 'finance-forecast',
    name: 'finance-forecast',
    topic: 'Cash, planning, and financial decisions',
    private: true,
    memberCount: 4,
    messages: [
      {
        id: 'finance-1',
        timestamp: '2026-07-18T13:08:00Z',
        senderId: 'theo',
        body: 'Collections landed ahead of plan this week. Updated runway is 13.8 months after the hiring scenario.',
        attachments: [{
          id: 'forecast',
          name: 'Q3 operating forecast',
          kind: 'file',
          url: '/finance/q3-operating-forecast',
          description: 'Spreadsheet · updated today',
        }],
      },
    ],
  },
  {
    id: 'product',
    name: 'product',
    topic: 'Product decisions, research, and releases',
    memberCount: 7,
    messages: [
      {
        id: 'product-1',
        timestamp: '2026-07-18T12:18:00Z',
        senderId: 'avery',
        body: 'The unified conversation component now supports channel, direct-message, and assistant modes with one payload contract.',
        reactions: [{ key: 'sparkles', label: '✨', count: 4 }],
      },
    ],
  },
] as const

export const SLACK_SAMPLE_DIRECT_MESSAGES: readonly SlackDirectMessage[] = [
  { memberId: 'maya', unreadCount: 2 },
  { memberId: 'lina' },
  { memberId: 'theo' },
  { memberId: 'avery' },
] as const

export function slackChannelConversation(
  channel: SlackChannel,
  members: readonly SlackMember[],
  viewerId: string,
): ConversationData {
  return normalizeConversation({
    id: channel.id,
    title: `# ${channel.name}`,
    subtitle: channel.topic,
    viewer_id: viewerId,
    unread_count: channel.unreadCount,
    participants: members,
    messages: channel.messages,
    context: { channel_id: channel.id },
  })
}

export function searchSlackMessages(
  conversation: ConversationData,
  query: string,
): ConversationMessageData[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return conversation.messages
  return conversation.messages.filter(message => [
    message.senderName,
    message.body,
    ...message.attachments.map(attachment => attachment.name),
  ].filter(Boolean).join(' ').toLowerCase().includes(normalized))
}

export function SlackShowcase({
  workspaceName = CLONE_DEMO_IDENTITY.company,
  currentUserId = 'jun',
  members = SLACK_SAMPLE_MEMBERS,
  channels = SLACK_SAMPLE_CHANNELS,
  directMessages = SLACK_SAMPLE_DIRECT_MESSAGES,
  initialChannelId = 'launch-room',
  initialThreadMessageId = 'launch-1',
  onSelectChannel,
  onSelectMessage,
  onSendMessage,
}: SlackShowcaseProps) {
  const initialChannel = channels.find(channel => channel.id === initialChannelId)
    ?? channels[0]
  const [channelId, setChannelId] = useState(initialChannel?.id ?? '')
  const [threadMessageId, setThreadMessageId] = useState<string | null>(
    initialThreadMessageId || null,
  )
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const selectedChannel = channels.find(channel => channel.id === channelId)
    ?? channels[0]
  const conversation = useMemo(
    () => selectedChannel
      ? slackChannelConversation(selectedChannel, members, currentUserId)
      : normalizeConversation({ messages: [] }),
    [currentUserId, members, selectedChannel],
  )
  const visibleMessages = useMemo(
    () => searchSlackMessages(conversation, query),
    [conversation, query],
  )
  const roots = visibleMessages.filter(message => !message.replyToId)
  const threadParent = conversation.messages.find(message => message.id === threadMessageId)
  const threadReplies = threadParent
    ? conversation.messages.filter(message => message.replyToId === threadParent.id)
    : []
  const currentUser = members.find(member => member.id === currentUserId)
    ?? members[0]

  const chooseChannel = (channel: SlackChannel) => {
    setChannelId(channel.id)
    setThreadMessageId(null)
    setQuery('')
    onSelectChannel?.(channel)
  }

  const chooseMessage = (message: ConversationMessageData) => {
    if (!selectedChannel) return
    onSelectMessage?.(message, selectedChannel)
  }

  const openThread = (message: ConversationMessageData) => {
    chooseMessage(message)
    setThreadMessageId(message.id)
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body || !selectedChannel) return
    onSendMessage?.(selectedChannel, body)
    setDraft('')
  }

  return (
    <div className="slack-clone">
      <header className="slack-clone__topbar">
        <div className="slack-clone__history">
          <button type="button" aria-label="Go back">
            <OperationalShowcaseIcon name="chevron-left" size={17} />
          </button>
          <button type="button" aria-label="Go forward">
            <OperationalShowcaseIcon name="chevron-right" size={17} />
          </button>
          <button type="button" aria-label="History">
            <OperationalShowcaseIcon name="clock" size={16} />
          </button>
        </div>
        <label className="slack-clone__search">
          <OperationalShowcaseIcon name="search" size={15} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={`Search ${workspaceName}`}
            aria-label={`Search ${workspaceName}`}
          />
          <kbd>⌘ G</kbd>
        </label>
        <div className="slack-clone__top-actions">
          <button type="button" aria-label="Help">
            <OperationalShowcaseIcon name="help" size={17} />
          </button>
          <span className="slack-clone__status-pill">
            <i />
            All systems normal
          </span>
        </div>
      </header>

      <div className="slack-clone__workspace">
        <aside className="slack-clone__rail" aria-label="Workspaces">
          <SlackMark compact />
          <button type="button" className="slack-clone__workspace-tile active" aria-label={workspaceName}>
            JT
          </button>
          <button type="button" className="slack-clone__workspace-tile" aria-label="Customer workspace">
            CX
            <em>2</em>
          </button>
          <span className="slack-clone__rail-divider" />
          <button type="button" className="slack-clone__rail-action" aria-label="Add workspace">
            <OperationalShowcaseIcon name="plus" size={20} />
          </button>
          <button type="button" className="slack-clone__rail-action" aria-label="Workspace directory">
            <OperationalShowcaseIcon name="apps" size={18} />
          </button>
          <span className="slack-clone__rail-spacer" />
          {currentUser && (
            <SlackAvatar member={currentUser} size="small" />
          )}
        </aside>

        <aside className="slack-clone__sidebar">
          <div className="slack-clone__workspace-heading">
            <button type="button">
              <span>
                <strong>{workspaceName}</strong>
                <small>Business+</small>
              </span>
              <OperationalShowcaseIcon name="chevron-down" size={14} />
            </button>
            <button type="button" aria-label="New message">
              <OperationalShowcaseIcon name="document" size={17} />
            </button>
          </div>

          <nav className="slack-clone__primary-nav" aria-label="Slack navigation">
            <button type="button">
              <OperationalShowcaseIcon name="message" size={16} />
              Threads
              <span>4</span>
            </button>
            <button type="button">
              <OperationalShowcaseIcon name="activity" size={16} />
              Activity
              <span className="unread">9</span>
            </button>
            <button type="button">
              <OperationalShowcaseIcon name="clock" size={16} />
              Later
            </button>
            <button type="button">
              <OperationalShowcaseIcon name="more" size={16} />
              More
            </button>
          </nav>

          <SidebarSection title="Channels" actionLabel="Add channel">
            {channels.map(channel => (
              <button
                type="button"
                key={channel.id}
                className={`slack-clone__channel ${channel.id === selectedChannel?.id ? 'selected' : ''}`}
                onClick={() => chooseChannel(channel)}
              >
                <span aria-hidden="true">{channel.private ? '▣' : '#'}</span>
                <strong>{channel.name}</strong>
                {!!channel.unreadCount && <em>{channel.unreadCount}</em>}
              </button>
            ))}
          </SidebarSection>

          <SidebarSection title="Direct messages" actionLabel="Add teammates">
            {directMessages.map(direct => {
              const member = members.find(item => item.id === direct.memberId)
              if (!member) return null
              return (
                <button
                  type="button"
                  key={direct.memberId}
                  className="slack-clone__direct"
                >
                  <SlackAvatar member={member} size="tiny" />
                  <strong>{member.name}{member.id === currentUserId ? ' (you)' : ''}</strong>
                  {!!direct.unreadCount && <em>{direct.unreadCount}</em>}
                </button>
              )
            })}
          </SidebarSection>

          <button type="button" className="slack-clone__invite">
            <span><OperationalShowcaseIcon name="plus" size={14} /></span>
            Invite people
          </button>
        </aside>

        <main className="slack-clone__channel-view">
          {selectedChannel ? (
            <>
              <ChannelHeader
                channel={selectedChannel}
                members={members}
              />
              <div className="slack-clone__messages" role="log" aria-label={`${selectedChannel.name} messages`}>
                <div className="slack-clone__channel-intro">
                  <span>#</span>
                  <h1>{selectedChannel.name}</h1>
                  <p>
                    This is the very beginning of <strong>#{selectedChannel.name}</strong>.
                    {' '}{selectedChannel.description}
                  </p>
                  <button type="button">
                    <OperationalShowcaseIcon name="user" size={14} />
                    Add people
                  </button>
                </div>
                <div className="slack-clone__date-divider">
                  <span>Today</span>
                </div>
                {roots.length > 0 ? roots.map(message => (
                  <SlackMessageRow
                    key={message.id}
                    message={message}
                    members={members}
                    onSelect={() => chooseMessage(message)}
                    onOpenThread={() => openThread(message)}
                  />
                )) : (
                  <div className="slack-clone__no-results">
                    <OperationalShowcaseIcon name="search" size={22} />
                    <strong>No messages found</strong>
                    <span>Try a different name, phrase, or file.</span>
                  </div>
                )}
              </div>
              <SlackComposer
                channelName={selectedChannel.name}
                draft={draft}
                onDraftChange={setDraft}
                onSubmit={sendMessage}
              />
            </>
          ) : (
            <div className="slack-clone__no-results">No channel selected</div>
          )}
        </main>

        {threadParent && selectedChannel && (
          <aside className="slack-clone__thread" aria-label="Thread">
            <header>
              <span>
                <strong>Thread</strong>
                <small>#{selectedChannel.name}</small>
              </span>
              <button
                type="button"
                aria-label="Close thread"
                onClick={() => setThreadMessageId(null)}
              >
                <OperationalShowcaseIcon name="close" size={18} />
              </button>
            </header>
            <div className="slack-clone__thread-scroll">
              <SlackMessageRow
                message={threadParent}
                members={members}
                compact
                onSelect={() => chooseMessage(threadParent)}
                onOpenThread={() => undefined}
              />
              <div className="slack-clone__reply-divider">
                <span>{threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}</span>
                <i />
              </div>
              {threadReplies.map(message => (
                <SlackMessageRow
                  key={message.id}
                  message={message}
                  members={members}
                  compact
                  onSelect={() => chooseMessage(message)}
                  onOpenThread={() => undefined}
                />
              ))}
            </div>
            <div className="slack-clone__thread-composer">
              <textarea aria-label="Reply to thread" placeholder="Reply…" rows={2} />
              <div>
                <span>
                  <button type="button" aria-label="Add attachment">
                    <OperationalShowcaseIcon name="plus" size={16} />
                  </button>
                  <button type="button" aria-label="Add emoji">☺</button>
                </span>
                <button type="button" aria-label="Send reply">
                  <OperationalShowcaseIcon name="send" size={15} />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function SlackMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`slack-clone__mark ${compact ? 'compact' : ''}`} aria-label="Slack">
      <i className="cyan" />
      <i className="green" />
      <i className="yellow" />
      <i className="red" />
    </span>
  )
}

function SidebarSection({
  title,
  actionLabel,
  children,
}: {
  title: string
  actionLabel: string
  children: ReactNode
}) {
  return (
    <section className="slack-clone__sidebar-section">
      <header>
        <button type="button" aria-label={`Collapse ${title}`}>
          <OperationalShowcaseIcon name="chevron-down" size={12} />
          {title}
        </button>
        <button type="button" aria-label={actionLabel}>
          <OperationalShowcaseIcon name="plus" size={14} />
        </button>
      </header>
      {children}
    </section>
  )
}

function ChannelHeader({
  channel,
  members,
}: {
  channel: SlackChannel
  members: readonly SlackMember[]
}) {
  return (
    <header className="slack-clone__channel-header">
      <button type="button" className="slack-clone__channel-title">
        <strong>{channel.private ? '▣' : '#'} {channel.name}</strong>
        <OperationalShowcaseIcon name="chevron-down" size={13} />
        {channel.topic && <small>{channel.topic}</small>}
      </button>
      <div className="slack-clone__channel-actions">
        <button type="button" className="slack-clone__huddle">
          <OperationalShowcaseIcon name="phone" size={15} />
          <span>Huddle</span>
          <OperationalShowcaseIcon name="chevron-down" size={12} />
        </button>
        <button type="button" className="slack-clone__member-stack" aria-label={`${channel.memberCount ?? members.length} members`}>
          <span>
            {members.slice(0, 3).map(member => (
              <SlackAvatar key={member.id} member={member} size="micro" />
            ))}
          </span>
          <strong>{channel.memberCount ?? members.length}</strong>
        </button>
        <button type="button" aria-label="Channel details">
          <OperationalShowcaseIcon name="more" size={17} />
        </button>
      </div>
    </header>
  )
}

function SlackMessageRow({
  message,
  members,
  compact = false,
  onSelect,
  onOpenThread,
}: {
  message: ConversationMessageData
  members: readonly SlackMember[]
  compact?: boolean
  onSelect: () => void
  onOpenThread: () => void
}) {
  const member = members.find(item => item.id === message.senderId)
  const isApp = member?.title === 'App' || message.kind === 'assistant'
  const threadCount = message.threadReplyCount ?? 0

  return (
    <article
      className={`slack-clone__message ${compact ? 'compact' : ''}`}
      onClick={onSelect}
    >
      <SlackAvatar
        member={member ?? {
          id: message.senderId ?? message.id,
          name: message.senderName,
          avatarColor: '#65727d',
        }}
        size={compact ? 'small' : 'normal'}
      />
      <div className="slack-clone__message-copy">
        <header>
          <strong>{message.senderName}</strong>
          {isApp && <em>APP</em>}
          {message.timestamp && (
            <time dateTime={message.timestamp}>{formatSlackTime(message.timestamp)}</time>
          )}
          {message.edited && <small>(edited)</small>}
        </header>
        {message.body && <p>{message.body}</p>}
        {message.attachments.map(attachment => (
          <a
            href={attachment.url}
            key={attachment.id}
            className="slack-clone__attachment"
            onClick={event => event.stopPropagation()}
          >
            <span>
              <OperationalShowcaseIcon
                name={attachment.kind === 'link' ? 'link' : 'document'}
                size={19}
              />
            </span>
            <span>
              <strong>{attachment.name}</strong>
              <small>
                {[attachment.contentType?.replace('application/', '').toUpperCase(), formatBytes(attachment.sizeBytes)]
                  .filter(Boolean)
                  .join(' · ') || 'Open linked resource'}
              </small>
            </span>
            <OperationalShowcaseIcon name="chevron-right" size={15} />
          </a>
        ))}
        {(message.reactions.length > 0 || threadCount > 0) && (
          <div className="slack-clone__message-actions">
            {message.reactions.map(reaction => (
              <button
                type="button"
                key={reaction.key}
                className={reaction.viewerReacted ? 'reacted' : ''}
                onClick={event => event.stopPropagation()}
              >
                {reaction.label} <span>{reaction.count}</span>
              </button>
            ))}
            {threadCount > 0 && (
              <button
                type="button"
                className="slack-clone__thread-link"
                onClick={event => {
                  event.stopPropagation()
                  onOpenThread()
                }}
              >
                <span className="slack-clone__reply-faces" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <strong>{threadCount} replies</strong>
                <small>Last reply 9:09 AM</small>
                <OperationalShowcaseIcon name="chevron-right" size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="slack-clone__message-toolbar">
        <button type="button" aria-label="Add reaction">☺</button>
        <button type="button" aria-label="Reply in thread" onClick={onOpenThread}>
          <OperationalShowcaseIcon name="message" size={15} />
        </button>
        <button type="button" aria-label="Save for later">
          <OperationalShowcaseIcon name="clock" size={15} />
        </button>
        <button type="button" aria-label="More actions">
          <OperationalShowcaseIcon name="more" size={15} />
        </button>
      </div>
    </article>
  )
}

function SlackComposer({
  channelName,
  draft,
  onDraftChange,
  onSubmit,
}: {
  channelName: string
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className="slack-clone__composer" onSubmit={onSubmit}>
      <div className="slack-clone__formatting">
        <button type="button" aria-label="Bold"><strong>B</strong></button>
        <button type="button" aria-label="Italic"><em>I</em></button>
        <button type="button" aria-label="Strikethrough"><s>S</s></button>
        <span />
        <button type="button" aria-label="Insert link">
          <OperationalShowcaseIcon name="link" size={15} />
        </button>
        <button type="button" aria-label="Bulleted list">≡</button>
        <button type="button" aria-label="Code">{'</>'}</button>
      </div>
      <textarea
        rows={3}
        value={draft}
        onChange={event => onDraftChange(event.target.value)}
        placeholder={`Message #${channelName}`}
        aria-label={`Message ${channelName}`}
      />
      <footer>
        <span>
          <button type="button" className="add" aria-label="Add attachment">
            <OperationalShowcaseIcon name="plus" size={17} />
          </button>
          <button type="button" aria-label="Record clip">
            <OperationalShowcaseIcon name="video" size={16} />
          </button>
          <button type="button" aria-label="Add emoji">☺</button>
          <button type="button" aria-label="Mention someone">@</button>
        </span>
        <span>
          <small>Press Enter to send</small>
          <button type="submit" className="send" disabled={!draft.trim()} aria-label="Send message">
            <OperationalShowcaseIcon name="send" size={15} />
          </button>
          <button type="button" aria-label="Schedule message">
            <OperationalShowcaseIcon name="chevron-down" size={12} />
          </button>
        </span>
      </footer>
    </form>
  )
}

function SlackAvatar({
  member,
  size = 'normal',
}: {
  member: SlackMember
  size?: 'micro' | 'tiny' | 'small' | 'normal'
}) {
  return (
    <span
      className={`slack-clone__avatar ${size}`}
      style={{ background: member.avatarColor ?? '#596b78' }}
      title={`${member.name}${member.title ? ` · ${member.title}` : ''}`}
      aria-label={member.name}
    >
      {initials(member.name)}
      {member.status && <i className={member.status} />}
    </span>
  )
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatSlackTime(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatBytes(value?: number): string | undefined {
  if (value == null) return undefined
  if (value < 1024) return `${value} B`
  if (value < 1024 ** 2) return `${Math.round(value / 1024)} KB`
  return `${(value / 1024 ** 2).toFixed(1)} MB`
}
