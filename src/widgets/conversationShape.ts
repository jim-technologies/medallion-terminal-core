import { safeUrl } from './textNormalize'

export type ConversationMessageKind =
  | 'message'
  | 'assistant'
  | 'system'
  | 'tool'
  | 'event'

export interface ConversationParticipantData {
  id: string
  name: string
  avatarUrl?: string
  role?: string
  status?: string
  context: Record<string, string>
}

export interface ConversationAttachmentData {
  id: string
  name: string
  kind: string
  url?: string
  thumbnailUrl?: string
  contentType?: string
  sizeBytes?: number
}

export interface ConversationReactionData {
  key: string
  label: string
  count: number
  viewerReacted: boolean
}

export interface ConversationMessageData {
  id: string
  timestamp?: string
  senderId?: string
  senderName: string
  senderAvatarUrl?: string
  kind: ConversationMessageKind
  body?: string
  replyToId?: string
  edited: boolean
  status?: string
  attachments: ConversationAttachmentData[]
  reactions: ConversationReactionData[]
  threadReplyCount?: number
  metadata: Record<string, unknown>
  context: Record<string, string>
}

export interface ConversationData {
  id: string
  title?: string
  subtitle?: string
  viewerId?: string
  participants: ConversationParticipantData[]
  messages: ConversationMessageData[]
  unreadCount?: number
  nextPageToken?: string
  context: Record<string, string>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function record(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined
  const text = String(value).trim()
  return text || undefined
}

function stringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry != null)
      .map(([key, entry]) => [key, String(entry)]),
  )
}

function nonNegativeInteger(value: unknown): number | undefined {
  const number = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value)
      : Number.NaN
  if (!Number.isFinite(number) || number < 0) return undefined
  return Math.floor(number)
}

function normalizeMessageKind(value: unknown): ConversationMessageKind {
  const kind = String(value ?? '').toLowerCase()
  if (kind.includes('assistant') || kind === 'ai' || kind === 'bot') return 'assistant'
  if (kind.includes('system')) return 'system'
  if (kind.includes('tool') || kind.includes('function')) return 'tool'
  if (kind.includes('event') || kind.includes('notice')) return 'event'
  return 'message'
}

function normalizeParticipant(value: unknown): ConversationParticipantData | null {
  if (!isRecord(value)) return null
  const id = optionalString(value.id ?? value.participantId ?? value.participant_id)
  const name = optionalString(value.name ?? value.displayName ?? value.display_name)
  if (!id || !name) return null
  return {
    id,
    name,
    avatarUrl: safeUrl(value.avatarUrl ?? value.avatar_url ?? value.imageUrl ?? value.image_url),
    role: optionalString(value.role),
    status: optionalString(value.status ?? value.presence),
    context: stringMap(value.context),
  }
}

function normalizeAttachment(
  value: unknown,
  fallbackId: string,
): ConversationAttachmentData | null {
  if (!isRecord(value)) return null
  const url = safeUrl(value.url ?? value.href)
  const thumbnailUrl = safeUrl(
    value.thumbnailUrl ?? value.thumbnail_url ?? value.previewUrl ?? value.preview_url,
  )
  const name = optionalString(value.name ?? value.title ?? value.filename)
    ?? url?.split('/').pop()
    ?? 'Attachment'
  return {
    id: optionalString(value.id ?? value.attachmentId ?? value.attachment_id) ?? fallbackId,
    name,
    kind: optionalString(value.kind ?? value.type) ?? attachmentKind(value, url),
    url,
    thumbnailUrl,
    contentType: optionalString(value.contentType ?? value.content_type ?? value.mimeType ?? value.mime_type),
    sizeBytes: nonNegativeInteger(value.sizeBytes ?? value.size_bytes ?? value.size),
  }
}

function attachmentKind(value: Record<string, unknown>, url?: string): string {
  const contentType = optionalString(
    value.contentType ?? value.content_type ?? value.mimeType ?? value.mime_type,
  )?.toLowerCase()
  if (contentType?.startsWith('image/')) return 'image'
  if (contentType?.startsWith('video/')) return 'video'
  if (contentType?.startsWith('audio/')) return 'audio'
  if (url && /\.(png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(url)) return 'image'
  return 'file'
}

function normalizeReaction(
  value: unknown,
  fallbackKey: string,
): ConversationReactionData | null {
  if (!isRecord(value)) return null
  const label = optionalString(value.label ?? value.emoji ?? value.name)
  if (!label) return null
  return {
    key: optionalString(value.key ?? value.id) ?? fallbackKey,
    label,
    count: nonNegativeInteger(value.count) ?? 0,
    viewerReacted: value.viewerReacted === true
      || value.viewer_reacted === true
      || value.reacted === true,
  }
}

function normalizeMessage(
  value: unknown,
  index: number,
  participants: Map<string, ConversationParticipantData>,
): ConversationMessageData | null {
  const raw = typeof value === 'string' ? { body: value } : record(value)
  if (Object.keys(raw).length === 0) return null
  const id = optionalString(raw.id ?? raw.messageId ?? raw.message_id) ?? `message-${index + 1}`
  const senderId = optionalString(raw.senderId ?? raw.sender_id ?? raw.authorId ?? raw.author_id)
  const participant = senderId ? participants.get(senderId) : undefined
  const body = optionalString(raw.body ?? raw.text ?? raw.content)
  const rawAttachments = Array.isArray(raw.attachments) ? raw.attachments : []
  const attachments = rawAttachments
    .map((attachment, attachmentIndex) =>
      normalizeAttachment(attachment, `${id}-attachment-${attachmentIndex + 1}`),
    )
    .filter((attachment): attachment is ConversationAttachmentData => attachment !== null)
  if (!body && attachments.length === 0 && raw.kind == null && raw.type == null) return null

  const rawReactions = Array.isArray(raw.reactions) ? raw.reactions : []
  return {
    id,
    timestamp: optionalString(raw.timestamp ?? raw.createdAt ?? raw.created_at ?? raw.date),
    senderId,
    senderName: optionalString(raw.senderName ?? raw.sender_name ?? raw.author ?? raw.name)
      ?? participant?.name
      ?? (normalizeMessageKind(raw.kind ?? raw.type ?? raw.role) === 'assistant'
        ? 'Assistant'
        : 'Unknown'),
    senderAvatarUrl: safeUrl(
      raw.senderAvatarUrl ?? raw.sender_avatar_url ?? raw.avatarUrl ?? raw.avatar_url,
    ) ?? participant?.avatarUrl,
    kind: normalizeMessageKind(raw.kind ?? raw.type ?? raw.role),
    body,
    replyToId: optionalString(raw.replyToId ?? raw.reply_to_id),
    edited: raw.edited === true || raw.isEdited === true || raw.is_edited === true,
    status: optionalString(raw.status ?? raw.deliveryStatus ?? raw.delivery_status),
    attachments,
    reactions: rawReactions
      .map((reaction, reactionIndex) =>
        normalizeReaction(reaction, `${id}-reaction-${reactionIndex + 1}`),
      )
      .filter((reaction): reaction is ConversationReactionData => reaction !== null),
    threadReplyCount: nonNegativeInteger(
      raw.threadReplyCount ?? raw.thread_reply_count ?? raw.replyCount ?? raw.reply_count,
    ),
    metadata: record(raw.metadata),
    context: stringMap(raw.context),
  }
}

export function normalizeConversation(data: unknown): ConversationData {
  const root = Array.isArray(data) ? { messages: data } : record(data)
  const participants = (Array.isArray(root.participants) ? root.participants : [])
    .map(normalizeParticipant)
    .filter((participant): participant is ConversationParticipantData => participant !== null)
  const participantMap = new Map(participants.map(participant => [participant.id, participant]))
  const rawMessages = Array.isArray(root.messages)
    ? root.messages
    : Array.isArray(root.items)
      ? root.items
      : Array.isArray(root.transcript)
        ? root.transcript
        : []

  // A malformed source can repeat a message id. Keep the most recent
  // representation while preserving its original position in the window.
  const byId = new Map<string, ConversationMessageData>()
  for (const [index, raw] of rawMessages.entries()) {
    const message = normalizeMessage(raw, index, participantMap)
    if (message) byId.set(message.id, message)
  }

  return {
    id: optionalString(root.id ?? root.conversationId ?? root.conversation_id) ?? '',
    title: optionalString(root.title ?? root.name ?? root.channel),
    subtitle: optionalString(root.subtitle ?? root.description ?? root.topic),
    viewerId: optionalString(root.viewerId ?? root.viewer_id ?? root.currentParticipantId ?? root.current_participant_id),
    participants,
    messages: [...byId.values()],
    unreadCount: nonNegativeInteger(root.unreadCount ?? root.unread_count),
    nextPageToken: optionalString(root.nextPageToken ?? root.next_page_token),
    context: stringMap(root.context),
  }
}

export function conversationSelectionContext(
  conversation: ConversationData,
  message: ConversationMessageData,
  options: {
    conversationKey?: string
    messageKey?: string
    senderKey?: string
  } = {},
): Record<string, string> {
  const context = { ...conversation.context, ...message.context }
  const conversationKey = options.conversationKey ?? 'conversation_id'
  const messageKey = options.messageKey ?? 'message_id'
  const senderKey = options.senderKey ?? 'sender_id'
  if (conversation.id && !(conversationKey in context)) context[conversationKey] = conversation.id
  if (!(messageKey in context)) context[messageKey] = message.id
  if (message.senderId && !(senderKey in context)) context[senderKey] = message.senderId
  return context
}
