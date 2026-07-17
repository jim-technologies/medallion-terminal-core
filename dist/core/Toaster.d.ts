import type { Severity } from './DashboardContext';
export interface Toast {
    id: number;
    message: string;
    severity: Severity;
}
export declare function Toaster({ toasts, dismiss }: {
    toasts: Toast[];
    dismiss: (id: number) => void;
}): import("react").JSX.Element | null;
