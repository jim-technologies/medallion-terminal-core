import { useMemo, useState, type KeyboardEvent } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { localDate, safeUrl } from './textNormalize'
import { Empty } from './states'
import {
  CursorPager,
  cursorPageTokenKey,
  type CursorPaginationOptions,
} from './CursorPager'
import {
  conversationSelectionContext,
  normalizeConversation,
  type ConversationAttachmentData,
  type ConversationData,
  type ConversationMessageData,
  type ConversationParticipantData,
} from './conversationShape'

export type ConversationMode = 'channel' | 'direct' | 'assistant'

export interface ConversationOptions extends CursorPaginationOptions {
  mode?: ConversationMode
  search?: boolean
  show_header?: boolean
  show_participants?: boolean
  show_reactions?: boolean
  show_attachments?: boolean
  show_delivery_status?: boolean
  message_context?: {
    conversation_key?: string
    message_key?: string
    sender_key?: string
  }
}

export function ConversationImpl({ data, options, widgetId }: WidgetProps) {
  const { ctx } = useDashboard()
  const conversation = useMemo(() => normalizeConversation(data), [data])
  const opts = (options ?? {}) as ConversationOptions
  const mode = opts.mode ?? 'channel'
  const hasPagination = !!conversation.nextPageToken || !!ctx[cursorPageTokenKey(widgetId, opts)]
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return conversation.messages
    return conversation.messages.filter(message => [
      message.senderName,
      message.body,
      ...message.attachments.map(attachment => attachment.name),
      ...Object.values(message.metadata),
    ].filter(value => value != null).join(' ').toLowerCase().includes(normalized))
  }, [conversation.messages, query])

  return (
    <div className="h-full min-h-0 flex flex-col">
      {opts.show_header !== false && (
        conversation.title
        || conversation.subtitle
        || conversation.participants.length > 0
        || (conversation.unreadCount ?? 0) > 0
      ) && (
        <ConversationHeader
          conversation={conversation}
          showParticipants={opts.show_participants !== false}
        />
      )}
      {opts.search && (
        <label className="mx-1 mb-2 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500 focus-within:border-zinc-600">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">Search messages</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search messages…"
            className="min-w-0 flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 outline-none"
          />
        </label>
      )}
      <div
        className={`flex-1 min-h-0 overflow-auto px-1 ${
          mode === 'assistant' ? 'space-y-3' : 'space-y-0.5'
        }`}
        role="log"
        aria-label={conversation.title ? `${conversation.title} messages` : 'Conversation messages'}
      >
        {conversation.messages.length === 0 ? (
          <Empty>No messages</Empty>
        ) : visible.length === 0 ? (
          <Empty>No matching messages</Empty>
        ) : visible.map((message, index) => (
          <ConversationMessage
            key={message.id}
            conversation={conversation}
            message={message}
            previous={visible[index - 1]}
            mode={mode}
            options={opts}
          />
        ))}
      </div>
      {hasPagination && (
        <div className="border-t border-zinc-800 pt-1.5 flex items-center justify-between gap-2 text-[10px] text-zinc-600 shrink-0">
          <span>{conversation.nextPageToken ? 'Older history available' : ''}</span>
          <CursorPager
            nextPageToken={conversation.nextPageToken}
            widgetId={widgetId}
            options={{
              ...opts,
              previous_label: opts.previous_label ?? 'Newer',
              next_label: opts.next_label ?? 'Older',
            }}
            ariaLabel="Conversation history pages"
          />
        </div>
      )}
    </div>
  )
}

function ConversationHeader({
  conversation,
  showParticipants,
}: {
  conversation: ConversationData
  showParticipants: boolean
}) {
  const { setCtx } = useDashboard()
  const selectConversation = () => {
    for (const [key, value] of Object.entries(conversation.context)) setCtx(key, value)
    if (conversation.id && !('conversation_id' in conversation.context)) {
      setCtx('conversation_id', conversation.id)
    }
  }

  return (
    <button
      type="button"
      onClick={selectConversation}
      className="mb-2 flex w-full items-start justify-between gap-3 border-b border-zinc-800 px-1 pb-2 text-left"
    >
      <span className="min-w-0">
        {conversation.title && (
          <strong className="block truncate text-sm font-medium text-zinc-100">
            {conversation.title}
          </strong>
        )}
        {conversation.subtitle && (
          <span className="block truncate text-[11px] text-zinc-500">
            {conversation.subtitle}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {conversation.unreadCount != null && conversation.unreadCount > 0 && (
          <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-medium text-sky-300">
            {conversation.unreadCount} unread
          </span>
        )}
        {showParticipants && conversation.participants.length > 0 && (
          <span className="flex -space-x-1" aria-label={`${conversation.participants.length} participants`}>
            {conversation.participants.slice(0, 4).map(participant => (
              <Avatar key={participant.id} participant={participant} size="small" />
            ))}
          </span>
        )}
      </span>
    </button>
  )
}

function ConversationMessage({
  conversation,
  message,
  previous,
  mode,
  options,
}: {
  conversation: ConversationData
  message: ConversationMessageData
  previous?: ConversationMessageData
  mode: ConversationMode
  options: ConversationOptions
}) {
  const { ctx, setCtx } = useDashboard()
  const contextOptions = {
    conversationKey: options.message_context?.conversation_key,
    messageKey: options.message_context?.message_key,
    senderKey: options.message_context?.sender_key,
  }
  const messageKey = contextOptions.messageKey ?? 'message_id'
  const selected = ctx[messageKey] === message.id
  const participant = message.senderId
    ? conversation.participants.find(item => item.id === message.senderId)
    : undefined
  const own = !!conversation.viewerId && message.senderId === conversation.viewerId
  const grouped = mode === 'channel'
    && previous?.senderId != null
    && previous.senderId === message.senderId
    && previous.kind === message.kind
  const reply = message.replyToId
    ? conversation.messages.find(item => item.id === message.replyToId)
    : undefined

  const selectMessage = () => {
    for (const [key, value] of Object.entries(
      conversationSelectionContext(conversation, message, contextOptions),
    )) setCtx(key, value)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectMessage()
    }
  }

  if (message.kind === 'system' || message.kind === 'event') {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={selectMessage}
        onKeyDown={handleKeyDown}
        className={`mx-auto my-2 max-w-[92%] rounded border px-3 py-1.5 text-center text-[11px] ${
          selected
            ? 'border-sky-500/50 bg-sky-500/10 text-sky-200'
            : 'border-zinc-800 bg-zinc-900/70 text-zinc-500 hover:border-zinc-700'
        }`}
      >
        {message.body ?? message.senderName}
        {message.timestamp && <span className="ml-2 text-[9px] text-zinc-600">{formatMessageTime(message.timestamp)}</span>}
      </article>
    )
  }

  if (message.kind === 'tool') {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={selectMessage}
        onKeyDown={handleKeyDown}
        className={`mx-7 rounded border px-3 py-2 font-mono text-[11px] ${
          selected
            ? 'border-sky-500/50 bg-sky-500/10'
            : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-2 text-zinc-500">
          <span className="uppercase tracking-wider">Tool · {message.senderName}</span>
          {message.status && <span>{humanize(message.status)}</span>}
        </div>
        {message.body && <div className="whitespace-pre-wrap break-words text-zinc-300">{message.body}</div>}
        <Attachments attachments={message.attachments} />
      </article>
    )
  }

  const assistant = mode === 'assistant' && message.kind === 'assistant'
  const alignRight = mode !== 'channel' && own
  const bubble = mode === 'direct' || (mode === 'assistant' && !assistant)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={selectMessage}
      onKeyDown={handleKeyDown}
      className={`group flex gap-2 rounded border-l-2 px-2 transition-colors ${
        grouped ? 'py-1' : 'py-2'
      } ${alignRight ? 'flex-row-reverse' : ''} ${
        selected
          ? 'border-sky-500 bg-sky-500/10'
          : 'border-transparent hover:bg-zinc-800/30'
      }`}
    >
      <div className={`w-7 shrink-0 ${grouped ? 'invisible' : ''}`}>
        <Avatar
          participant={participant}
          fallbackName={message.senderName}
          fallbackUrl={message.senderAvatarUrl}
        />
      </div>
      <div className={`min-w-0 max-w-full flex-1 ${alignRight ? 'flex flex-col items-end' : ''}`}>
        {!grouped && (
          <div className={`mb-0.5 flex items-baseline gap-2 ${alignRight ? 'flex-row-reverse' : ''}`}>
            <strong className="truncate text-xs font-medium text-zinc-200">
              {message.senderName}
            </strong>
            {message.timestamp && (
              <time className="shrink-0 text-[9px] text-zinc-600" dateTime={message.timestamp}>
                {formatMessageTime(message.timestamp)}
              </time>
            )}
            {message.edited && <span className="text-[9px] text-zinc-600">edited</span>}
          </div>
        )}
        {reply && <ReplyPreview message={reply} />}
        {(message.body || message.attachments.length > 0) && (
          <div className={`max-w-full ${
            bubble
              ? alignRight
                ? 'rounded-lg rounded-tr-sm bg-sky-500/15 px-3 py-2'
                : 'rounded-lg rounded-tl-sm bg-zinc-800/80 px-3 py-2'
              : ''
          }`}>
            {message.body && (
              <div className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300">
                {message.body}
              </div>
            )}
            {options.show_attachments !== false && (
              <Attachments attachments={message.attachments} />
            )}
          </div>
        )}
        <div className={`mt-1 flex flex-wrap items-center gap-1.5 ${alignRight ? 'justify-end' : ''}`}>
          {options.show_reactions !== false && message.reactions.map(reaction => (
            <span
              key={reaction.key}
              className={`rounded-full border px-1.5 py-0.5 text-[10px] ${
                reaction.viewerReacted
                  ? 'border-sky-500/40 bg-sky-500/10 text-sky-200'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400'
              }`}
            >
              {reaction.label} {reaction.count}
            </span>
          ))}
          {message.threadReplyCount != null && message.threadReplyCount > 0 && (
            <span className="text-[10px] font-medium text-sky-400">
              {message.threadReplyCount} {message.threadReplyCount === 1 ? 'reply' : 'replies'}
            </span>
          )}
          {options.show_delivery_status !== false && message.status && (
            <span className={`text-[9px] ${statusTone(message.status)}`}>
              {humanize(message.status)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function ReplyPreview({ message }: { message: ConversationMessageData }) {
  return (
    <div className="mb-1.5 max-w-full border-l-2 border-zinc-700 pl-2 text-[10px] text-zinc-500">
      <strong className="mr-1 text-zinc-400">{message.senderName}</strong>
      <span className="line-clamp-1">{message.body ?? message.attachments[0]?.name ?? 'Message'}</span>
    </div>
  )
}

function Attachments({ attachments }: { attachments: ConversationAttachmentData[] }) {
  if (attachments.length === 0) return null
  return (
    <div className="mt-2 grid max-w-md gap-1.5">
      {attachments.map(attachment => {
        const url = safeUrl(attachment.url)
        const thumbnail = safeUrl(attachment.thumbnailUrl)
        const body = (
          <>
            {attachment.kind === 'image' && (thumbnail ?? url) ? (
              <img
                src={thumbnail ?? url}
                alt=""
                loading="lazy"
                className="h-14 w-20 shrink-0 rounded object-cover bg-zinc-800"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800 text-zinc-500">
                {attachmentGlyph(attachment.kind)}
              </span>
            )}
            <span className="min-w-0">
              <strong className="block truncate text-[11px] font-medium text-zinc-300">
                {attachment.name}
              </strong>
              <span className="block text-[9px] text-zinc-600">
                {[humanize(attachment.kind), formatBytes(attachment.sizeBytes)]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </span>
          </>
        )
        return url ? (
          <a
            key={attachment.id}
            href={url}
            onClick={event => event.stopPropagation()}
            {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5 hover:border-zinc-700"
          >
            {body}
          </a>
        ) : (
          <div
            key={attachment.id}
            className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5"
          >
            {body}
          </div>
        )
      })}
    </div>
  )
}

function Avatar({
  participant,
  fallbackName = 'Unknown',
  fallbackUrl,
  size = 'normal',
}: {
  participant?: ConversationParticipantData
  fallbackName?: string
  fallbackUrl?: string
  size?: 'small' | 'normal'
}) {
  const name = participant?.name ?? fallbackName
  const avatarUrl = safeUrl(participant?.avatarUrl ?? fallbackUrl)
  const sizeClass = size === 'small' ? 'h-5 w-5 text-[8px]' : 'h-7 w-7 text-[9px]'
  const common = `${sizeClass} rounded flex shrink-0 items-center justify-center border border-zinc-700 bg-zinc-800 font-medium text-zinc-300`
  return avatarUrl ? (
    <img src={avatarUrl} alt={name} loading="lazy" className={`${common} object-cover`} />
  ) : (
    <span className={common} title={name}>{initials(name)}</span>
  )
}

function formatMessageTime(timestamp: string): string {
  const formatted = localDate(timestamp)
  return typeof formatted === 'string' ? formatted : timestamp
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('')
}

function humanize(value: string): string {
  return value.replace(/^MESSAGE_/, '').replace(/_/g, ' ').toLowerCase()
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('fail') || normalized.includes('error')) return 'text-red-400'
  if (normalized.includes('read') || normalized.includes('deliver')) return 'text-sky-400'
  if (normalized.includes('send')) return 'text-amber-400'
  return 'text-zinc-600'
}

function attachmentGlyph(kind: string): string {
  if (kind.includes('video')) return '▶'
  if (kind.includes('audio')) return '♪'
  if (kind.includes('link')) return '↗'
  if (kind.includes('code')) return '</>'
  return '▧'
}

function formatBytes(value?: number): string | undefined {
  if (value == null) return undefined
  if (value < 1024) return `${value} B`
  if (value < 1024 ** 2) return `${Math.round(value / 1024)} KB`
  return `${(value / 1024 ** 2).toFixed(value >= 10 * 1024 ** 2 ? 0 : 1)} MB`
}
