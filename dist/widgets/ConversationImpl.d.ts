import type { WidgetProps } from '../types/template';
import { type CursorPaginationOptions } from './CursorPager';
export type ConversationMode = 'channel' | 'direct' | 'assistant';
export interface ConversationOptions extends CursorPaginationOptions {
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
export declare function ConversationImpl({ data, options, widgetId }: WidgetProps): import("react").JSX.Element;
