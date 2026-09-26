import { type ReactNode } from 'react';
import type { Intent } from '../foundations/types';
/** Intents a toast can carry. */
export type ToastIntent = Exclude<Intent, 'primary'>;
/** One notification. */
export interface ToastData {
    id: string | number;
    /** The message. */
    title: ReactNode;
    /** Optional second line. */
    description?: ReactNode;
    /** Tone; `danger` toasts are announced assertively. */
    intent?: ToastIntent;
    /** One follow-up action, such as "Undo" or "View". */
    action?: {
        label: string;
        onClick: () => void;
    };
    /** Milliseconds before it dismisses itself; 0 keeps it until dismissed. */
    duration?: number;
}
/** Props for the notification stack. */
export interface ToasterProps {
    toasts: readonly ToastData[];
    /** Called when a toast times out or is dismissed. */
    onDismiss: (id: ToastData['id']) => void;
    /** Corner of the viewport. */
    placement?: 'bottom-end' | 'top-end';
}
/**
 * The notification stack. Toasts dismiss themselves (pausing while hovered or
 * focused), announce politely (`danger` assertively), and render into the
 * scope's portal container so they keep the theme above any layout.
 */
export declare function Toaster({ toasts, onDismiss, placement }: ToasterProps): import("react").JSX.Element | null;
/** What `useToast` returns. */
export interface ToastApi {
    /** Shows a toast and returns its id. */
    toast: (toast: Omit<ToastData, 'id'> & {
        id?: ToastData['id'];
    }) => ToastData['id'];
    /** Dismisses a toast early. */
    dismiss: (id: ToastData['id']) => void;
}
/** Props for the toast state holder. */
export interface ToastProviderProps {
    children: ReactNode;
    /** Most toasts shown at once; older ones drop off. */
    limit?: number;
    placement?: ToasterProps['placement'];
}
/** Holds a toast queue for its subtree and renders its `Toaster`. */
export declare function ToastProvider({ children, limit, placement }: ToastProviderProps): import("react").JSX.Element;
/** The nearest `ToastProvider`'s API. */
export declare function useToast(): ToastApi;
