import type { DataSource, WidgetConfig } from '../types/template';
export declare function buildGenerateUrl(backendUrl: string): string;
export declare function buildGenerateRequest(prompt: string, ctx: Record<string, string>, currentWidgets: WidgetConfig[]): {
    prompt: string;
    context: {
        values: Record<string, string>;
    };
    current_widgets: WidgetConfig[];
};
export declare function buildSubmitActionUrl(backendUrl: string): string;
export declare function buildWatchActionUrl(backendUrl: string): string;
export declare function buildActionRequest(opts: {
    actionId: string;
    params: Record<string, unknown>;
    clientRequestId: string;
}): {
    action_id: string;
    params: Record<string, unknown>;
    client_request_id: string;
};
export declare function buildActionWatchRequest(opts: {
    clientRequestId?: string;
    id?: string;
    actionId?: string;
}): {
    action_id: string;
    id: string;
    client_request_id: string;
};
export declare function newClientRequestId(): string;
export declare class InterpolationError extends Error {
    readonly key: string;
    constructor(key: string);
}
export declare function interpolate(s: string, ctx: Record<string, string>, opts?: {
    strict?: boolean;
}): string;
export declare function resolveSource(source: DataSource, ctx: Record<string, string>, backendUrl?: string, backendHeaders?: Record<string, string>): DataSource;
export declare function _resetWarnings(): void;
