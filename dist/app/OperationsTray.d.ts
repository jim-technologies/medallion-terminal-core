import { type ReactNode } from 'react';
/** Where a long-running operation stands. */
export type OperationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
/** One long-running operation: an upload, an ingest, a transaction, a workflow run. */
export interface Operation {
    id: string;
    label: string;
    /** Secondary line, such as a size, a target folder or an error. */
    detail?: ReactNode;
    status: OperationStatus;
    /** Progress from 0 to 1 while running; omit when unknown. */
    progress?: number;
    /** Offers Cancel while queued or running. */
    cancellable?: boolean;
    /** Offers Retry after a failure. */
    retryable?: boolean;
}
/** Props for the operations tray. */
export interface OperationsTrayProps {
    operations: readonly Operation[];
    /** Tray title; defaults to "Operations". */
    title?: string;
    onCancel?: (id: string) => void;
    onRetry?: (id: string) => void;
    /** Removes one finished operation. */
    onDismiss?: (id: string) => void;
    /** Removes every finished operation. */
    onClearFinished?: () => void;
    /** Controlled expansion. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * `floating` (default) pins the tray to the bottom end of the screen;
     * `inline` renders it in the page, such as an Activity page.
     */
    placement?: 'floating' | 'inline';
}
/**
 * Long-running operations in a tray at the bottom end of the screen (a
 * bottom sheet on phones): a summary header that expands to the list, with
 * progress, Cancel and Retry. Status changes are announced politely. The
 * tray only renders while there are operations, and it never polls: the
 * host feeds it.
 */
export declare function OperationsTray({ operations, title, onCancel, onRetry, onDismiss, onClearFinished, open: controlledOpen, defaultOpen, onOpenChange, placement, }: OperationsTrayProps): import("react").JSX.Element | null;
