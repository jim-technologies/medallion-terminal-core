export type ConversationMessageKind = 'message' | 'assistant' | 'system' | 'tool' | 'event';
export interface ConversationParticipantData {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
    status?: string;
    context: Record<string, string>;
}
export interface ConversationAttachmentData {
    id: string;
    name: string;
    kind: string;
    url?: string;
    thumbnailUrl?: string;
    contentType?: string;
    sizeBytes?: number;
}
export interface ConversationReactionData {
    key: string;
    label: string;
    count: number;
    viewerReacted: boolean;
}
export interface ConversationMessageData {
    id: string;
    timestamp?: string;
    senderId?: string;
    senderName: string;
    senderAvatarUrl?: string;
    kind: ConversationMessageKind;
    body?: string;
    replyToId?: string;
    edited: boolean;
    status?: string;
    attachments: ConversationAttachmentData[];
    reactions: ConversationReactionData[];
    threadReplyCount?: number;
    metadata: Record<string, unknown>;
    context: Record<string, string>;
}
export interface ConversationData {
    id: string;
    title?: string;
    subtitle?: string;
    viewerId?: string;
    participants: ConversationParticipantData[];
    messages: ConversationMessageData[];
    unreadCount?: number;
    nextPageToken?: string;
    context: Record<string, string>;
}
export declare function normalizeConversation(data: unknown): ConversationData;
export declare function conversationSelectionContext(conversation: ConversationData, message: ConversationMessageData, options?: {
    conversationKey?: string;
    messageKey?: string;
    senderKey?: string;
}): Record<string, string>;
