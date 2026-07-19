import type { WidgetProps } from '../types/template';
export type ConversationMode = 'channel' | 'direct' | 'assistant';
export interface ConversationOptions {
    mode?: ConversationMode;
    search?: boolean;
    show_header?: boolean;
    show_participants?: boolean;
    show_reactions?: boolean;
    show_attachments?: boolean;
    show_delivery_status?: boolean;
    message_context?: {
        conversation_key?: string;
        message_key?: string;
        sender_key?: string;
    };
}
export declare function ConversationImpl({ data, options }: WidgetProps): import("react").JSX.Element;
