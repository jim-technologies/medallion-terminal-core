export interface Template {
    title?: string;
    columns?: number;
    context?: Context;
    widgets: WidgetConfig[];
    shortcuts?: TemplateShortcut[];
    frozenAt?: string;
}
export interface TemplateShortcut {
    key: string;
    ctx: Record<string, string>;
    label?: string;
}
export interface Context {
    values: Record<string, string>;
}
export interface WidgetConfig {
    id?: string;
    component: string;
    span?: number;
    height?: number;
    title?: string;
    source?: DataSource;
    options?: Record<string, unknown>;
    alert?: WidgetAlert;
    refresh_policy?: 'global' | 'self' | 'manual';
}
export interface WidgetAlert {
    when: string;
    message: string;
    severity?: 'info' | 'ok' | 'warn' | 'error';
}
export interface DataSource {
    source_id?: string;
    url?: string;
    inline?: unknown;
    /** @deprecated use `inline` */
    data?: unknown;
    params?: Record<string, string>;
    stream?: boolean | 'connect';
    refreshIntervalMs?: number;
    /** @deprecated use `refreshIntervalMs` */
    refreshInterval?: number;
    throttleMs?: number;
    staleAfterMs?: number;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: unknown;
    transform?: string;
}
export interface WidgetProps {
    data: unknown;
    options?: Record<string, unknown>;
    widgetId?: string;
}
