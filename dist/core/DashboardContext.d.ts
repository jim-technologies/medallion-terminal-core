import type { Template, WidgetConfig } from '../types/template';
import type { TerminalIntent } from './TerminalIntent';
export type Severity = 'ok' | 'warn' | 'error' | 'info';
export type DashboardEvent = {
    type: 'alert';
    widgetId?: string;
    severity: Severity;
    message: string;
    predicate: string;
} | {
    type: 'widget_error';
    widgetId?: string;
    component: string;
    message: string;
    source: 'data' | 'render' | 'resolve';
} | {
    type: 'action';
    actionId: string;
    clientRequestId: string;
    status: string;
    message?: string;
    terminal: boolean;
};
export type EmitEvent = (event: DashboardEvent) => void;
export interface ActionLogEntry {
    receivedAt: number;
    actionId: string;
    clientRequestId: string;
    status: string;
    message?: string;
    terminal: boolean;
}
export interface AlertLogEntry {
    receivedAt: number;
    widgetId?: string;
    severity: Severity;
    message: string;
    predicate: string;
}
export interface WidgetAction {
    targetId: string;
    remove?: boolean;
    component?: string;
    title?: string;
    span?: number;
    height?: number;
    source?: WidgetConfig['source'];
    options?: WidgetConfig['options'];
}
export interface DispatchOptions {
    replaceAll?: boolean;
}
export interface DashboardContextValue {
    dispatch: (actions: WidgetAction[], options?: DispatchOptions) => void;
    ctx: Record<string, string>;
    setCtx: (key: string, value: string) => void;
    widgets: WidgetConfig[];
    backendUrl?: string;
    backendHeaders: Record<string, string>;
    refreshIntervalMs?: number;
    toast: (message: string, severity?: Severity) => void;
    compact: boolean;
    fullscreenId: string | null;
    setFullscreenId: (id: string | null) => void;
    focusedId: string | null;
    setFocusedId: (id: string | null) => void;
    refreshPulse: {
        id: string;
        n: number;
    } | null;
    requestRefresh: (id: string) => void;
    emit: EmitEvent;
    emitIntent?: (intent: TerminalIntent) => void;
    recentActions: ActionLogEntry[];
    clearRecentActions: () => void;
    recentAlerts: AlertLogEntry[];
    clearRecentAlerts: () => void;
    soundEnabled: boolean;
    widgetHealth: Record<string, WidgetHealth>;
    reportWidgetHealth: (id: string, state: WidgetHealth | null) => void;
    registerWidgetData: (key: string, getData: () => unknown) => () => void;
    snapshot: () => Template;
}
export interface WidgetHealth {
    title: string;
    streaming: boolean;
    connected: boolean;
    error: string | null;
    stale: boolean;
}
export declare const DEFAULT_DASHBOARD_CONTEXT: DashboardContextValue;
export declare const DashboardContext: import("react").Context<DashboardContextValue>;
export declare function useDashboard(): DashboardContextValue;
