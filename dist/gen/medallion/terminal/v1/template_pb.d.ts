import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { StructJson, Value, ValueJson } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/terminal/v1/template.proto.
 */
export declare const file_medallion_terminal_v1_template: GenFile;
/**
 * Top-level dashboard.
 *
 * Example:
 *   {
 *     "title": "Crypto Watch",
 *     "context": { "values": { "symbol": "BTC", "range": "1d" } },
 *     "widgets": [
 *       { "id": "px",  "component": "candlestick", "span": 8,
 *         "source": { "source_id": "ohlcv",
 *                     "params": { "symbol": "${ctx.symbol}",
 *                                 "range":  "${ctx.range}" },
 *                     "stream": true } },
 *       { "id": "spot", "component": "metric", "span": 4,
 *         "source": { "source_id": "spot_price",
 *                     "params": { "symbol": "${ctx.symbol}" },
 *                     "stream": true } }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.Template
 */
export type Template = Message<"medallion.terminal.v1.Template"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * Grid column count. Default: 12.
     *
     * @generated from field: int32 columns = 2;
     */
    columns: number;
    /**
     * Global context — propagated to every widget. Widget params
     * can reference values via "${ctx.<key>}" substitution.
     *
     * @generated from field: medallion.terminal.v1.Context context = 3;
     */
    context?: Context | undefined;
    /**
     * Ordered list of widgets in the grid.
     *
     * @generated from field: repeated medallion.terminal.v1.Widget widgets = 4;
     */
    widgets: Widget[];
};
/**
 * Top-level dashboard.
 *
 * Example:
 *   {
 *     "title": "Crypto Watch",
 *     "context": { "values": { "symbol": "BTC", "range": "1d" } },
 *     "widgets": [
 *       { "id": "px",  "component": "candlestick", "span": 8,
 *         "source": { "source_id": "ohlcv",
 *                     "params": { "symbol": "${ctx.symbol}",
 *                                 "range":  "${ctx.range}" },
 *                     "stream": true } },
 *       { "id": "spot", "component": "metric", "span": 4,
 *         "source": { "source_id": "spot_price",
 *                     "params": { "symbol": "${ctx.symbol}" },
 *                     "stream": true } }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.Template
 */
export type TemplateJson = {
    /**
     * @generated from field: string title = 1;
     */
    title?: string;
    /**
     * Grid column count. Default: 12.
     *
     * @generated from field: int32 columns = 2;
     */
    columns?: number;
    /**
     * Global context — propagated to every widget. Widget params
     * can reference values via "${ctx.<key>}" substitution.
     *
     * @generated from field: medallion.terminal.v1.Context context = 3;
     */
    context?: ContextJson;
    /**
     * Ordered list of widgets in the grid.
     *
     * @generated from field: repeated medallion.terminal.v1.Widget widgets = 4;
     */
    widgets?: WidgetJson[];
};
/**
 * Describes the message medallion.terminal.v1.Template.
 * Use `create(TemplateSchema)` to create a new message.
 */
export declare const TemplateSchema: GenMessage<Template, {
    jsonType: TemplateJson;
}>;
/**
 * Context is a generic key-value bag describing what the dashboard
 * is "about" right now. Changing context (user picks a different
 * entity, switches time range) re-fetches every widget that
 * references it.
 *
 * Keys are user-defined. Common conventions: "symbol", "entity",
 * "event", "range", "from", "to". The framework does not interpret
 * them — they are pure substitution tokens.
 *
 * @generated from message medallion.terminal.v1.Context
 */
export type Context = Message<"medallion.terminal.v1.Context"> & {
    /**
     * @generated from field: map<string, string> values = 1;
     */
    values: {
        [key: string]: string;
    };
};
/**
 * Context is a generic key-value bag describing what the dashboard
 * is "about" right now. Changing context (user picks a different
 * entity, switches time range) re-fetches every widget that
 * references it.
 *
 * Keys are user-defined. Common conventions: "symbol", "entity",
 * "event", "range", "from", "to". The framework does not interpret
 * them — they are pure substitution tokens.
 *
 * @generated from message medallion.terminal.v1.Context
 */
export type ContextJson = {
    /**
     * @generated from field: map<string, string> values = 1;
     */
    values?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.Context.
 * Use `create(ContextSchema)` to create a new message.
 */
export declare const ContextSchema: GenMessage<Context, {
    jsonType: ContextJson;
}>;
/**
 * @generated from message medallion.terminal.v1.Widget
 */
export type Widget = Message<"medallion.terminal.v1.Widget"> & {
    /**
     * Stable identifier; required if the widget is mutable via
     * WidgetAction. Auto-assigned if omitted.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Registered component name (e.g. "timeseries", "candlestick",
     * "table", "metric", "gauge", "heatmap", "geo_map", "events",
     * "text", "action_form", "prompt"). Maps to a renderer in the
     * frontend widget registry.
     *
     * @generated from field: string component = 2;
     */
    component: string;
    /**
     * Column span (1..columns). Default: 6.
     * Tablet clamps to columns/2; mobile collapses to full-width.
     *
     * @generated from field: int32 span = 3;
     */
    span: number;
    /**
     * Content height in pixels. Each component has a sensible default.
     *
     * @generated from field: int32 height = 4;
     */
    height: number;
    /**
     * Header label.
     *
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * Where this widget gets its data.
     *
     * @generated from field: medallion.terminal.v1.DataSource source = 6;
     */
    source?: DataSource | undefined;
    /**
     * Component-specific overrides (e.g. axis hints, formatting).
     * Convention is to need none of this — the payload shape drives
     * rendering. Use sparingly.
     *
     * @generated from field: google.protobuf.Struct options = 7;
     */
    options?: JsonObject | undefined;
};
/**
 * @generated from message medallion.terminal.v1.Widget
 */
export type WidgetJson = {
    /**
     * Stable identifier; required if the widget is mutable via
     * WidgetAction. Auto-assigned if omitted.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Registered component name (e.g. "timeseries", "candlestick",
     * "table", "metric", "gauge", "heatmap", "geo_map", "events",
     * "text", "action_form", "prompt"). Maps to a renderer in the
     * frontend widget registry.
     *
     * @generated from field: string component = 2;
     */
    component?: string;
    /**
     * Column span (1..columns). Default: 6.
     * Tablet clamps to columns/2; mobile collapses to full-width.
     *
     * @generated from field: int32 span = 3;
     */
    span?: number;
    /**
     * Content height in pixels. Each component has a sensible default.
     *
     * @generated from field: int32 height = 4;
     */
    height?: number;
    /**
     * Header label.
     *
     * @generated from field: string title = 5;
     */
    title?: string;
    /**
     * Where this widget gets its data.
     *
     * @generated from field: medallion.terminal.v1.DataSource source = 6;
     */
    source?: DataSourceJson;
    /**
     * Component-specific overrides (e.g. axis hints, formatting).
     * Convention is to need none of this — the payload shape drives
     * rendering. Use sparingly.
     *
     * @generated from field: google.protobuf.Struct options = 7;
     */
    options?: StructJson;
};
/**
 * Describes the message medallion.terminal.v1.Widget.
 * Use `create(WidgetSchema)` to create a new message.
 */
export declare const WidgetSchema: GenMessage<Widget, {
    jsonType: WidgetJson;
}>;
/**
 * DataSource has three mutually-exclusive modes. Set exactly one
 * of source_id / url / inline. Resolution order if multiple are
 * set: inline > source_id > url.
 *
 * MODE 1 — source_id (preferred, typed):
 *   Resolved via the dashboard's configured ConnectRPC backend.
 *   This is the "implement TerminalService and it works" path —
 *   the backend returns one of the canonical payload shapes.
 *
 * MODE 2 — url (federation / escape hatch, untyped):
 *   Arbitrary HTTP or SSE URL. Use when a widget pulls from a
 *   source that does not speak TerminalService — a public REST
 *   API, a third-party stream, a Connect backend at a different
 *   host. The frontend trusts the response shape and renders.
 *
 * MODE 3 — inline (static):
 *   Pre-baked payload embedded in the template. No fetch. Used by
 *   AI-generated dashboards that already have the data, by demos,
 *   and by tests.
 *
 * @generated from message medallion.terminal.v1.DataSource
 */
export type DataSource = Message<"medallion.terminal.v1.DataSource"> & {
    /**
     * Mode 1: catalog id on the dashboard's Connect backend.
     *
     * @generated from field: string source_id = 1;
     */
    sourceId: string;
    /**
     * Mode 2: arbitrary URL.
     *
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * Mode 3: inline payload matching the widget's expected shape.
     *
     * @generated from field: google.protobuf.Value inline = 3;
     */
    inline?: Value | undefined;
    /**
     * Params. For source_id mode, passed to TerminalService.params.
     * For url mode, appended as the query string. Values may contain
     * "${ctx.<key>}" tokens which the framework substitutes from
     * Template.context at fetch time.
     *
     * @generated from field: map<string, string> params = 4;
     */
    params: {
        [key: string]: string;
    };
    /**
     * Live updates. For source_id mode, calls TerminalService.Stream
     * and re-renders on each server-pushed message. For url mode,
     * opens an SSE connection.
     *
     * @generated from field: bool stream = 5;
     */
    stream: boolean;
    /**
     * Polling interval in milliseconds for non-streaming sources.
     * 0 = fetch once, no polling.
     *
     * @generated from field: int32 refresh_interval_ms = 6;
     */
    refreshIntervalMs: number;
    /**
     * url-mode only: HTTP method. Default "GET".
     *
     * @generated from field: string method = 7;
     */
    method: string;
    /**
     * url-mode only: request headers (e.g. {"Authorization": "..."}).
     *
     * @generated from field: map<string, string> headers = 8;
     */
    headers: {
        [key: string]: string;
    };
    /**
     * url-mode only: dot-path to extract from the response. Useful
     * when wrapping a third-party JSON API that nests the payload
     * (e.g. "data.items" extracts response.data.items).
     *
     * @generated from field: string transform = 9;
     */
    transform: string;
};
/**
 * DataSource has three mutually-exclusive modes. Set exactly one
 * of source_id / url / inline. Resolution order if multiple are
 * set: inline > source_id > url.
 *
 * MODE 1 — source_id (preferred, typed):
 *   Resolved via the dashboard's configured ConnectRPC backend.
 *   This is the "implement TerminalService and it works" path —
 *   the backend returns one of the canonical payload shapes.
 *
 * MODE 2 — url (federation / escape hatch, untyped):
 *   Arbitrary HTTP or SSE URL. Use when a widget pulls from a
 *   source that does not speak TerminalService — a public REST
 *   API, a third-party stream, a Connect backend at a different
 *   host. The frontend trusts the response shape and renders.
 *
 * MODE 3 — inline (static):
 *   Pre-baked payload embedded in the template. No fetch. Used by
 *   AI-generated dashboards that already have the data, by demos,
 *   and by tests.
 *
 * @generated from message medallion.terminal.v1.DataSource
 */
export type DataSourceJson = {
    /**
     * Mode 1: catalog id on the dashboard's Connect backend.
     *
     * @generated from field: string source_id = 1;
     */
    sourceId?: string;
    /**
     * Mode 2: arbitrary URL.
     *
     * @generated from field: string url = 2;
     */
    url?: string;
    /**
     * Mode 3: inline payload matching the widget's expected shape.
     *
     * @generated from field: google.protobuf.Value inline = 3;
     */
    inline?: ValueJson;
    /**
     * Params. For source_id mode, passed to TerminalService.params.
     * For url mode, appended as the query string. Values may contain
     * "${ctx.<key>}" tokens which the framework substitutes from
     * Template.context at fetch time.
     *
     * @generated from field: map<string, string> params = 4;
     */
    params?: {
        [key: string]: string;
    };
    /**
     * Live updates. For source_id mode, calls TerminalService.Stream
     * and re-renders on each server-pushed message. For url mode,
     * opens an SSE connection.
     *
     * @generated from field: bool stream = 5;
     */
    stream?: boolean;
    /**
     * Polling interval in milliseconds for non-streaming sources.
     * 0 = fetch once, no polling.
     *
     * @generated from field: int32 refresh_interval_ms = 6;
     */
    refreshIntervalMs?: number;
    /**
     * url-mode only: HTTP method. Default "GET".
     *
     * @generated from field: string method = 7;
     */
    method?: string;
    /**
     * url-mode only: request headers (e.g. {"Authorization": "..."}).
     *
     * @generated from field: map<string, string> headers = 8;
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * url-mode only: dot-path to extract from the response. Useful
     * when wrapping a third-party JSON API that nests the payload
     * (e.g. "data.items" extracts response.data.items).
     *
     * @generated from field: string transform = 9;
     */
    transform?: string;
};
/**
 * Describes the message medallion.terminal.v1.DataSource.
 * Use `create(DataSourceSchema)` to create a new message.
 */
export declare const DataSourceSchema: GenMessage<DataSource, {
    jsonType: DataSourceJson;
}>;
/**
 * WidgetAction mutates one widget. Returned by Generate (and any
 * other dispatch surface) to update an existing dashboard in place.
 *
 * Semantics:
 *   * If a widget with target_id exists, fields present in the
 *     action are merged in. Fields absent are preserved.
 *   * If no such widget exists, a new widget is created from the
 *     action.
 *   * If `remove` is true, the widget is deleted (other fields
 *     ignored).
 *
 * @generated from message medallion.terminal.v1.WidgetAction
 */
export type WidgetAction = Message<"medallion.terminal.v1.WidgetAction"> & {
    /**
     * The widget id to mutate or create.
     *
     * @generated from field: string target_id = 1;
     */
    targetId: string;
    /**
     * If true, remove the widget. Other fields are ignored.
     *
     * @generated from field: bool remove = 2;
     */
    remove: boolean;
    /**
     * @generated from field: optional string component = 3;
     */
    component?: string | undefined;
    /**
     * @generated from field: optional string title = 4;
     */
    title?: string | undefined;
    /**
     * @generated from field: optional int32 span = 5;
     */
    span?: number | undefined;
    /**
     * @generated from field: optional int32 height = 6;
     */
    height?: number | undefined;
    /**
     * @generated from field: optional medallion.terminal.v1.DataSource source = 7;
     */
    source?: DataSource | undefined;
    /**
     * @generated from field: optional google.protobuf.Struct options = 8;
     */
    options?: JsonObject | undefined;
};
/**
 * WidgetAction mutates one widget. Returned by Generate (and any
 * other dispatch surface) to update an existing dashboard in place.
 *
 * Semantics:
 *   * If a widget with target_id exists, fields present in the
 *     action are merged in. Fields absent are preserved.
 *   * If no such widget exists, a new widget is created from the
 *     action.
 *   * If `remove` is true, the widget is deleted (other fields
 *     ignored).
 *
 * @generated from message medallion.terminal.v1.WidgetAction
 */
export type WidgetActionJson = {
    /**
     * The widget id to mutate or create.
     *
     * @generated from field: string target_id = 1;
     */
    targetId?: string;
    /**
     * If true, remove the widget. Other fields are ignored.
     *
     * @generated from field: bool remove = 2;
     */
    remove?: boolean;
    /**
     * @generated from field: optional string component = 3;
     */
    component?: string;
    /**
     * @generated from field: optional string title = 4;
     */
    title?: string;
    /**
     * @generated from field: optional int32 span = 5;
     */
    span?: number;
    /**
     * @generated from field: optional int32 height = 6;
     */
    height?: number;
    /**
     * @generated from field: optional medallion.terminal.v1.DataSource source = 7;
     */
    source?: DataSourceJson;
    /**
     * @generated from field: optional google.protobuf.Struct options = 8;
     */
    options?: StructJson;
};
/**
 * Describes the message medallion.terminal.v1.WidgetAction.
 * Use `create(WidgetActionSchema)` to create a new message.
 */
export declare const WidgetActionSchema: GenMessage<WidgetAction, {
    jsonType: WidgetActionJson;
}>;
