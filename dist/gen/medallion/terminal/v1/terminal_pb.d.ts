import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { StructJson } from "@bufbuild/protobuf/wkt";
import type { AssetCatalogPayload, AssetCatalogPayloadJson, CandlePayload, CandlePayloadJson, DistributionPayload, DistributionPayloadJson, EmbedPayload, EmbedPayloadJson, EventPayload, EventPayloadJson, GaugePayload, GaugePayloadJson, GeoPayload, GeoPayloadJson, GraphPayload, GraphPayloadJson, HeatmapPayload, HeatmapPayloadJson, MediaPayload, MediaPayloadJson, MetricPayload, MetricPayloadJson, ObjectPayload, ObjectPayloadJson, OrderBookPayload, OrderBookPayloadJson, PairedGridPayload, PairedGridPayloadJson, RecordSetPayload, RecordSetPayloadJson, RepositoryPayload, RepositoryPayloadJson, TablePayload, TablePayloadJson, TextPayload, TextPayloadJson, TimeseriesPayload, TimeseriesPayloadJson } from "./shapes_pb.js";
import type { Context, ContextJson, Widget, WidgetAction, WidgetActionJson, WidgetJson } from "./template_pb.js";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/terminal/v1/terminal.proto.
 */
export declare const file_medallion_terminal_v1_terminal: GenFile;
/**
 * @generated from message medallion.terminal.v1.DataRequest
 */
export type DataRequest = Message<"medallion.terminal.v1.DataRequest"> & {
    /**
     * Catalog id (matches Source.id from ListSources).
     *
     * @generated from field: string source_id = 1;
     */
    sourceId: string;
    /**
     * Source-specific params (e.g. "symbol", "range", "window").
     * The frontend substitutes "${ctx.<key>}" tokens before sending.
     *
     * @generated from field: map<string, string> params = 2;
     */
    params: {
        [key: string]: string;
    };
};
/**
 * @generated from message medallion.terminal.v1.DataRequest
 */
export type DataRequestJson = {
    /**
     * Catalog id (matches Source.id from ListSources).
     *
     * @generated from field: string source_id = 1;
     */
    sourceId?: string;
    /**
     * Source-specific params (e.g. "symbol", "range", "window").
     * The frontend substitutes "${ctx.<key>}" tokens before sending.
     *
     * @generated from field: map<string, string> params = 2;
     */
    params?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.DataRequest.
 * Use `create(DataRequestSchema)` to create a new message.
 */
export declare const DataRequestSchema: GenMessage<DataRequest, {
    jsonType: DataRequestJson;
}>;
/**
 * DataResponse always carries exactly one payload. Which case is
 * set is determined by the source's declared Shape (see Source).
 *
 * @generated from message medallion.terminal.v1.DataResponse
 */
export type DataResponse = Message<"medallion.terminal.v1.DataResponse"> & {
    /**
     * @generated from oneof medallion.terminal.v1.DataResponse.payload
     */
    payload: {
        /**
         * @generated from field: medallion.terminal.v1.TimeseriesPayload timeseries = 1;
         */
        value: TimeseriesPayload;
        case: "timeseries";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.CandlePayload candles = 2;
         */
        value: CandlePayload;
        case: "candles";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.TablePayload table = 3;
         */
        value: TablePayload;
        case: "table";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.MetricPayload metric = 4;
         */
        value: MetricPayload;
        case: "metric";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.GaugePayload gauge = 5;
         */
        value: GaugePayload;
        case: "gauge";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.HeatmapPayload heatmap = 6;
         */
        value: HeatmapPayload;
        case: "heatmap";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.EventPayload events = 7;
         */
        value: EventPayload;
        case: "events";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.DistributionPayload distribution = 8;
         */
        value: DistributionPayload;
        case: "distribution";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.TextPayload text = 9;
         */
        value: TextPayload;
        case: "text";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.OrderBookPayload orderbook = 10;
         */
        value: OrderBookPayload;
        case: "orderbook";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.PairedGridPayload paired_grid = 11;
         */
        value: PairedGridPayload;
        case: "pairedGrid";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.EmbedPayload embed = 12;
         */
        value: EmbedPayload;
        case: "embed";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.AssetCatalogPayload assets = 13;
         */
        value: AssetCatalogPayload;
        case: "assets";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.ObjectPayload object = 14;
         */
        value: ObjectPayload;
        case: "object";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.GraphPayload graph = 15;
         */
        value: GraphPayload;
        case: "graph";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.RepositoryPayload repository = 16;
         */
        value: RepositoryPayload;
        case: "repository";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.RecordSetPayload records = 17;
         */
        value: RecordSetPayload;
        case: "records";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.GeoPayload geo = 18;
         */
        value: GeoPayload;
        case: "geo";
    } | {
        /**
         * @generated from field: medallion.terminal.v1.MediaPayload media = 19;
         */
        value: MediaPayload;
        case: "media";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * DataResponse always carries exactly one payload. Which case is
 * set is determined by the source's declared Shape (see Source).
 *
 * @generated from message medallion.terminal.v1.DataResponse
 */
export type DataResponseJson = {
    /**
     * @generated from field: medallion.terminal.v1.TimeseriesPayload timeseries = 1;
     */
    timeseries?: TimeseriesPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.CandlePayload candles = 2;
     */
    candles?: CandlePayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.TablePayload table = 3;
     */
    table?: TablePayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.MetricPayload metric = 4;
     */
    metric?: MetricPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.GaugePayload gauge = 5;
     */
    gauge?: GaugePayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.HeatmapPayload heatmap = 6;
     */
    heatmap?: HeatmapPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.EventPayload events = 7;
     */
    events?: EventPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.DistributionPayload distribution = 8;
     */
    distribution?: DistributionPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.TextPayload text = 9;
     */
    text?: TextPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.OrderBookPayload orderbook = 10;
     */
    orderbook?: OrderBookPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.PairedGridPayload paired_grid = 11;
     */
    pairedGrid?: PairedGridPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.EmbedPayload embed = 12;
     */
    embed?: EmbedPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.AssetCatalogPayload assets = 13;
     */
    assets?: AssetCatalogPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.ObjectPayload object = 14;
     */
    object?: ObjectPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.GraphPayload graph = 15;
     */
    graph?: GraphPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.RepositoryPayload repository = 16;
     */
    repository?: RepositoryPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.RecordSetPayload records = 17;
     */
    records?: RecordSetPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.GeoPayload geo = 18;
     */
    geo?: GeoPayloadJson;
    /**
     * @generated from field: medallion.terminal.v1.MediaPayload media = 19;
     */
    media?: MediaPayloadJson;
};
/**
 * Describes the message medallion.terminal.v1.DataResponse.
 * Use `create(DataResponseSchema)` to create a new message.
 */
export declare const DataResponseSchema: GenMessage<DataResponse, {
    jsonType: DataResponseJson;
}>;
/**
 * Reserved for future filtering (by tag, by shape, by query).
 *
 * @generated from message medallion.terminal.v1.ListSourcesRequest
 */
export type ListSourcesRequest = Message<"medallion.terminal.v1.ListSourcesRequest"> & {};
/**
 * Reserved for future filtering (by tag, by shape, by query).
 *
 * @generated from message medallion.terminal.v1.ListSourcesRequest
 */
export type ListSourcesRequestJson = {};
/**
 * Describes the message medallion.terminal.v1.ListSourcesRequest.
 * Use `create(ListSourcesRequestSchema)` to create a new message.
 */
export declare const ListSourcesRequestSchema: GenMessage<ListSourcesRequest, {
    jsonType: ListSourcesRequestJson;
}>;
/**
 * @generated from message medallion.terminal.v1.ListSourcesResponse
 */
export type ListSourcesResponse = Message<"medallion.terminal.v1.ListSourcesResponse"> & {
    /**
     * @generated from field: repeated medallion.terminal.v1.Source sources = 1;
     */
    sources: Source[];
};
/**
 * @generated from message medallion.terminal.v1.ListSourcesResponse
 */
export type ListSourcesResponseJson = {
    /**
     * @generated from field: repeated medallion.terminal.v1.Source sources = 1;
     */
    sources?: SourceJson[];
};
/**
 * Describes the message medallion.terminal.v1.ListSourcesResponse.
 * Use `create(ListSourcesResponseSchema)` to create a new message.
 */
export declare const ListSourcesResponseSchema: GenMessage<ListSourcesResponse, {
    jsonType: ListSourcesResponseJson;
}>;
/**
 * Source describes one registered data provider on the backend.
 *
 * A backend's source catalog is its public surface: every entry
 * here is something a dashboard widget (or the AI) can ask for.
 *
 * @generated from message medallion.terminal.v1.Source
 */
export type Source = Message<"medallion.terminal.v1.Source"> & {
    /**
     * Stable id used by DataRequest.source_id and DataSource.source_id.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Human-readable display name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * What this source returns, in plain language. Read by the AI
     * when deciding which sources to wire into a generated dashboard.
     *
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * Which payload variant Get/Stream returns for this source.
     *
     * @generated from field: medallion.terminal.v1.Shape shape = 4;
     */
    shape: Shape;
    /**
     * Declared parameters this source accepts.
     *
     * @generated from field: repeated medallion.terminal.v1.SourceParam params = 5;
     */
    params: SourceParam[];
    /**
     * True if the source supports the Stream RPC. Get is always
     * assumed available.
     *
     * @generated from field: bool streamable = 6;
     */
    streamable: boolean;
    /**
     * Free-form tags for grouping in catalog UIs and search
     * (e.g. "crypto", "sentiment", "ops", "prediction").
     *
     * @generated from field: repeated string tags = 7;
     */
    tags: string[];
};
/**
 * Source describes one registered data provider on the backend.
 *
 * A backend's source catalog is its public surface: every entry
 * here is something a dashboard widget (or the AI) can ask for.
 *
 * @generated from message medallion.terminal.v1.Source
 */
export type SourceJson = {
    /**
     * Stable id used by DataRequest.source_id and DataSource.source_id.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Human-readable display name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * What this source returns, in plain language. Read by the AI
     * when deciding which sources to wire into a generated dashboard.
     *
     * @generated from field: string description = 3;
     */
    description?: string;
    /**
     * Which payload variant Get/Stream returns for this source.
     *
     * @generated from field: medallion.terminal.v1.Shape shape = 4;
     */
    shape?: ShapeJson;
    /**
     * Declared parameters this source accepts.
     *
     * @generated from field: repeated medallion.terminal.v1.SourceParam params = 5;
     */
    params?: SourceParamJson[];
    /**
     * True if the source supports the Stream RPC. Get is always
     * assumed available.
     *
     * @generated from field: bool streamable = 6;
     */
    streamable?: boolean;
    /**
     * Free-form tags for grouping in catalog UIs and search
     * (e.g. "crypto", "sentiment", "ops", "prediction").
     *
     * @generated from field: repeated string tags = 7;
     */
    tags?: string[];
};
/**
 * Describes the message medallion.terminal.v1.Source.
 * Use `create(SourceSchema)` to create a new message.
 */
export declare const SourceSchema: GenMessage<Source, {
    jsonType: SourceJson;
}>;
/**
 * @generated from message medallion.terminal.v1.SourceParam
 */
export type SourceParam = Message<"medallion.terminal.v1.SourceParam"> & {
    /**
     * Param key (matches DataRequest.params keys).
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Human description, read by AI and shown in catalog UIs.
     *
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * True if the source rejects requests missing this param.
     *
     * @generated from field: bool required = 3;
     */
    required: boolean;
    /**
     * Default value if omitted by the caller. Always serialized as
     * a string regardless of `type`; the backend parses per `type`.
     *
     * @generated from field: string default_value = 4;
     */
    defaultValue: string;
    /**
     * If non-empty, the param is constrained to these values. Only
     * meaningful when type is unspecified or PARAM_TYPE_ENUM.
     *
     * @generated from field: repeated string enum_values = 5;
     */
    enumValues: string[];
    /**
     * Value type. Drives input rendering in catalog/authoring UIs and
     * tells the AI how to format substitutions. Values still travel
     * over the wire as strings (params is map<string,string>); the
     * backend parses based on this type.
     *
     * @generated from field: medallion.terminal.v1.ParamType type = 6;
     */
    type: ParamType;
    /**
     * Multi-value param. When true, the wire value is comma-separated
     * (e.g. params["symbols"] = "BTC,ETH,SOL") and the backend splits
     * before parsing. Combine with type to constrain element types and
     * with enum_values to constrain element membership.
     *
     * @generated from field: bool repeated = 7;
     */
    repeated: boolean;
};
/**
 * @generated from message medallion.terminal.v1.SourceParam
 */
export type SourceParamJson = {
    /**
     * Param key (matches DataRequest.params keys).
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Human description, read by AI and shown in catalog UIs.
     *
     * @generated from field: string description = 2;
     */
    description?: string;
    /**
     * True if the source rejects requests missing this param.
     *
     * @generated from field: bool required = 3;
     */
    required?: boolean;
    /**
     * Default value if omitted by the caller. Always serialized as
     * a string regardless of `type`; the backend parses per `type`.
     *
     * @generated from field: string default_value = 4;
     */
    defaultValue?: string;
    /**
     * If non-empty, the param is constrained to these values. Only
     * meaningful when type is unspecified or PARAM_TYPE_ENUM.
     *
     * @generated from field: repeated string enum_values = 5;
     */
    enumValues?: string[];
    /**
     * Value type. Drives input rendering in catalog/authoring UIs and
     * tells the AI how to format substitutions. Values still travel
     * over the wire as strings (params is map<string,string>); the
     * backend parses based on this type.
     *
     * @generated from field: medallion.terminal.v1.ParamType type = 6;
     */
    type?: ParamTypeJson;
    /**
     * Multi-value param. When true, the wire value is comma-separated
     * (e.g. params["symbols"] = "BTC,ETH,SOL") and the backend splits
     * before parsing. Combine with type to constrain element types and
     * with enum_values to constrain element membership.
     *
     * @generated from field: bool repeated = 7;
     */
    repeated?: boolean;
};
/**
 * Describes the message medallion.terminal.v1.SourceParam.
 * Use `create(SourceParamSchema)` to create a new message.
 */
export declare const SourceParamSchema: GenMessage<SourceParam, {
    jsonType: SourceParamJson;
}>;
/**
 * @generated from message medallion.terminal.v1.GenerateRequest
 */
export type GenerateRequest = Message<"medallion.terminal.v1.GenerateRequest"> & {
    /**
     * The user's natural-language prompt
     * (e.g. "how's bitcoin today?", "show me bot pnl this week").
     *
     * @generated from field: string prompt = 1;
     */
    prompt: string;
    /**
     * The dashboard's current context. The model can reference these
     * values when emitting widgets (e.g. keep the existing symbol).
     *
     * @generated from field: medallion.terminal.v1.Context context = 2;
     */
    context?: Context | undefined;
    /**
     * The widgets currently on screen, so the model can choose
     * between surgical edits and a full rebuild. Optional.
     *
     * @generated from field: repeated medallion.terminal.v1.Widget current_widgets = 3;
     */
    currentWidgets: Widget[];
};
/**
 * @generated from message medallion.terminal.v1.GenerateRequest
 */
export type GenerateRequestJson = {
    /**
     * The user's natural-language prompt
     * (e.g. "how's bitcoin today?", "show me bot pnl this week").
     *
     * @generated from field: string prompt = 1;
     */
    prompt?: string;
    /**
     * The dashboard's current context. The model can reference these
     * values when emitting widgets (e.g. keep the existing symbol).
     *
     * @generated from field: medallion.terminal.v1.Context context = 2;
     */
    context?: ContextJson;
    /**
     * The widgets currently on screen, so the model can choose
     * between surgical edits and a full rebuild. Optional.
     *
     * @generated from field: repeated medallion.terminal.v1.Widget current_widgets = 3;
     */
    currentWidgets?: WidgetJson[];
};
/**
 * Describes the message medallion.terminal.v1.GenerateRequest.
 * Use `create(GenerateRequestSchema)` to create a new message.
 */
export declare const GenerateRequestSchema: GenMessage<GenerateRequest, {
    jsonType: GenerateRequestJson;
}>;
/**
 * @generated from message medallion.terminal.v1.GenerateResponse
 */
export type GenerateResponse = Message<"medallion.terminal.v1.GenerateResponse"> & {
    /**
     * Assistant reply shown to the user (a one-sentence summary or
     * explanation of what was wired up).
     *
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * Mutations to apply to the dashboard. Each action targets a
     * widget by id; absent ids cause creation
     * (see template.proto WidgetAction semantics).
     *
     * @generated from field: repeated medallion.terminal.v1.WidgetAction actions = 2;
     */
    actions: WidgetAction[];
    /**
     * If true, drop all existing widgets before applying actions —
     * signals a full dashboard rebuild rather than a surgical edit.
     * The AI decides this based on the prompt.
     *
     * @generated from field: bool replace_all = 3;
     */
    replaceAll: boolean;
    /**
     * Optional context updates emitted by the AI (e.g. user said
     * "switch to ETH" — model returns context update {symbol:"ETH"}
     * alongside any widget tweaks).
     *
     * @generated from field: medallion.terminal.v1.Context context = 4;
     */
    context?: Context | undefined;
};
/**
 * @generated from message medallion.terminal.v1.GenerateResponse
 */
export type GenerateResponseJson = {
    /**
     * Assistant reply shown to the user (a one-sentence summary or
     * explanation of what was wired up).
     *
     * @generated from field: string text = 1;
     */
    text?: string;
    /**
     * Mutations to apply to the dashboard. Each action targets a
     * widget by id; absent ids cause creation
     * (see template.proto WidgetAction semantics).
     *
     * @generated from field: repeated medallion.terminal.v1.WidgetAction actions = 2;
     */
    actions?: WidgetActionJson[];
    /**
     * If true, drop all existing widgets before applying actions —
     * signals a full dashboard rebuild rather than a surgical edit.
     * The AI decides this based on the prompt.
     *
     * @generated from field: bool replace_all = 3;
     */
    replaceAll?: boolean;
    /**
     * Optional context updates emitted by the AI (e.g. user said
     * "switch to ETH" — model returns context update {symbol:"ETH"}
     * alongside any widget tweaks).
     *
     * @generated from field: medallion.terminal.v1.Context context = 4;
     */
    context?: ContextJson;
};
/**
 * Describes the message medallion.terminal.v1.GenerateResponse.
 * Use `create(GenerateResponseSchema)` to create a new message.
 */
export declare const GenerateResponseSchema: GenMessage<GenerateResponse, {
    jsonType: GenerateResponseJson;
}>;
/**
 * Generic write-side dispatch. The framework's read RPCs (Get / Stream
 * / ListSources / Generate) cover query and AI flows; SubmitAction
 * covers everything that mutates state on the backend — placing an
 * order, executing a swap, casting a vote, sending a message.
 *
 * The `action_id` selects the handler. Common ids by convention:
 *   "place_order"   — params: {symbol, side, amount, price?, type}
 *   "swap"          — params: {from_token, to_token, amount, ...}
 *   "send_message"  — params: {to, body}
 *
 * `params` is intentionally a generic Struct to keep the dispatch
 * surface domain-agnostic. Each action defines its own param schema
 * in the backend's documentation; widgets that submit actions know
 * the shape by convention.
 *
 * @generated from message medallion.terminal.v1.ActionRequest
 */
export type ActionRequest = Message<"medallion.terminal.v1.ActionRequest"> & {
    /**
     * @generated from field: string action_id = 1;
     */
    actionId: string;
    /**
     * @generated from field: google.protobuf.Struct params = 2;
     */
    params?: JsonObject | undefined;
    /**
     * Client-generated idempotency key. The backend MUST treat repeated
     * requests with the same client_request_id as the same action and
     * return the original response — critical for retry loops, network
     * hiccups, and double-clicks on submit buttons. Recommended: a
     * UUIDv4 generated when the user clicks submit. Empty string =
     * no idempotency, treat each call as new.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId: string;
};
/**
 * Generic write-side dispatch. The framework's read RPCs (Get / Stream
 * / ListSources / Generate) cover query and AI flows; SubmitAction
 * covers everything that mutates state on the backend — placing an
 * order, executing a swap, casting a vote, sending a message.
 *
 * The `action_id` selects the handler. Common ids by convention:
 *   "place_order"   — params: {symbol, side, amount, price?, type}
 *   "swap"          — params: {from_token, to_token, amount, ...}
 *   "send_message"  — params: {to, body}
 *
 * `params` is intentionally a generic Struct to keep the dispatch
 * surface domain-agnostic. Each action defines its own param schema
 * in the backend's documentation; widgets that submit actions know
 * the shape by convention.
 *
 * @generated from message medallion.terminal.v1.ActionRequest
 */
export type ActionRequestJson = {
    /**
     * @generated from field: string action_id = 1;
     */
    actionId?: string;
    /**
     * @generated from field: google.protobuf.Struct params = 2;
     */
    params?: StructJson;
    /**
     * Client-generated idempotency key. The backend MUST treat repeated
     * requests with the same client_request_id as the same action and
     * return the original response — critical for retry loops, network
     * hiccups, and double-clicks on submit buttons. Recommended: a
     * UUIDv4 generated when the user clicks submit. Empty string =
     * no idempotency, treat each call as new.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId?: string;
};
/**
 * Describes the message medallion.terminal.v1.ActionRequest.
 * Use `create(ActionRequestSchema)` to create a new message.
 */
export declare const ActionRequestSchema: GenMessage<ActionRequest, {
    jsonType: ActionRequestJson;
}>;
/**
 * Backend acknowledgement of a submitted action.
 *
 * `status` is the coarse lifecycle state. Action-specific finer
 * states (an order's "filled" vs "partial", a workflow's "stage 2 of 4")
 * go in `status_detail` so dashboards can render them without
 * inventing per-action enums.
 *
 * @generated from message medallion.terminal.v1.ActionResponse
 */
export type ActionResponse = Message<"medallion.terminal.v1.ActionResponse"> & {
    /**
     * Backend-assigned id (order id, message id, etc.). Useful for
     * client-side reconciliation against later Stream / Events updates.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Coarse lifecycle state. See ActionStatus for semantics.
     *
     * @generated from field: medallion.terminal.v1.ActionStatus status = 2;
     */
    status: ActionStatus;
    /**
     * Human-readable message — shown to the user as a toast on the
     * submitting widget.
     *
     * @generated from field: optional string message = 3;
     */
    message?: string | undefined;
    /**
     * Optional structured payload (e.g. filled price, gas cost, tx hash).
     *
     * @generated from field: optional google.protobuf.Struct data = 4;
     */
    data?: JsonObject | undefined;
    /**
     * Action-specific sub-state when ActionStatus alone is too coarse
     * (e.g. "partial", "filled", "stage_2_of_4"). Free-form by
     * convention — widgets that care interpret it; others ignore.
     *
     * @generated from field: optional string status_detail = 5;
     */
    statusDetail?: string | undefined;
};
/**
 * Backend acknowledgement of a submitted action.
 *
 * `status` is the coarse lifecycle state. Action-specific finer
 * states (an order's "filled" vs "partial", a workflow's "stage 2 of 4")
 * go in `status_detail` so dashboards can render them without
 * inventing per-action enums.
 *
 * @generated from message medallion.terminal.v1.ActionResponse
 */
export type ActionResponseJson = {
    /**
     * Backend-assigned id (order id, message id, etc.). Useful for
     * client-side reconciliation against later Stream / Events updates.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Coarse lifecycle state. See ActionStatus for semantics.
     *
     * @generated from field: medallion.terminal.v1.ActionStatus status = 2;
     */
    status?: ActionStatusJson;
    /**
     * Human-readable message — shown to the user as a toast on the
     * submitting widget.
     *
     * @generated from field: optional string message = 3;
     */
    message?: string;
    /**
     * Optional structured payload (e.g. filled price, gas cost, tx hash).
     *
     * @generated from field: optional google.protobuf.Struct data = 4;
     */
    data?: StructJson;
    /**
     * Action-specific sub-state when ActionStatus alone is too coarse
     * (e.g. "partial", "filled", "stage_2_of_4"). Free-form by
     * convention — widgets that care interpret it; others ignore.
     *
     * @generated from field: optional string status_detail = 5;
     */
    statusDetail?: string;
};
/**
 * Describes the message medallion.terminal.v1.ActionResponse.
 * Use `create(ActionResponseSchema)` to create a new message.
 */
export declare const ActionResponseSchema: GenMessage<ActionResponse, {
    jsonType: ActionResponseJson;
}>;
/**
 * ActionWatchRequest — subscribe to lifecycle updates for one action.
 * Identify the action by any of the three keys; at least one must be
 * set. client_request_id is the most useful for client-side retry
 * reconciliation, since the client knows it before the backend
 * responds.
 *
 * @generated from message medallion.terminal.v1.ActionWatchRequest
 */
export type ActionWatchRequest = Message<"medallion.terminal.v1.ActionWatchRequest"> & {
    /**
     * The action_id originally passed to SubmitAction (e.g. "place_order").
     *
     * @generated from field: string action_id = 1;
     */
    actionId: string;
    /**
     * The backend-assigned id from ActionResponse.id.
     *
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * The client-generated idempotency key from ActionRequest.client_request_id.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId: string;
};
/**
 * ActionWatchRequest — subscribe to lifecycle updates for one action.
 * Identify the action by any of the three keys; at least one must be
 * set. client_request_id is the most useful for client-side retry
 * reconciliation, since the client knows it before the backend
 * responds.
 *
 * @generated from message medallion.terminal.v1.ActionWatchRequest
 */
export type ActionWatchRequestJson = {
    /**
     * The action_id originally passed to SubmitAction (e.g. "place_order").
     *
     * @generated from field: string action_id = 1;
     */
    actionId?: string;
    /**
     * The backend-assigned id from ActionResponse.id.
     *
     * @generated from field: string id = 2;
     */
    id?: string;
    /**
     * The client-generated idempotency key from ActionRequest.client_request_id.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId?: string;
};
/**
 * Describes the message medallion.terminal.v1.ActionWatchRequest.
 * Use `create(ActionWatchRequestSchema)` to create a new message.
 */
export declare const ActionWatchRequestSchema: GenMessage<ActionWatchRequest, {
    jsonType: ActionWatchRequestJson;
}>;
/**
 * ActionUpdate — one lifecycle event for a watched action. The
 * stream emits one of these every time the action's state advances
 * (queued → working → filled, etc.). The stream closes after the
 * first ActionUpdate with a terminal ActionStatus.
 *
 * @generated from message medallion.terminal.v1.ActionUpdate
 */
export type ActionUpdate = Message<"medallion.terminal.v1.ActionUpdate"> & {
    /**
     * Backend-assigned id (mirrors ActionResponse.id).
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * The action handler this update belongs to (mirrors ActionRequest.action_id).
     *
     * @generated from field: string action_id = 2;
     */
    actionId: string;
    /**
     * Mirrors ActionRequest.client_request_id, so clients can
     * reconcile updates with their in-flight submit calls.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId: string;
    /**
     * Current lifecycle state. The stream closes after the first
     * update with a terminal status.
     *
     * @generated from field: medallion.terminal.v1.ActionStatus status = 4;
     */
    status: ActionStatus;
    /**
     * Action-specific sub-state ("partial", "filled", "stage_2_of_4").
     *
     * @generated from field: optional string status_detail = 5;
     */
    statusDetail?: string | undefined;
    /**
     * Human-readable message — surfaced to the user as a toast.
     *
     * @generated from field: optional string message = 6;
     */
    message?: string | undefined;
    /**
     * Optional structured payload (filled price, gas cost, tx hash,
     * confirmations).
     *
     * @generated from field: optional google.protobuf.Struct data = 7;
     */
    data?: JsonObject | undefined;
    /**
     * ISO 8601 timestamp the backend emitted this update.
     *
     * @generated from field: string timestamp = 8;
     */
    timestamp: string;
    /**
     * Monotonic per-action counter starting at 0. Lets clients
     * detect dropped messages and reorder if a transport reorders.
     *
     * @generated from field: uint64 sequence = 9;
     */
    sequence: bigint;
};
/**
 * ActionUpdate — one lifecycle event for a watched action. The
 * stream emits one of these every time the action's state advances
 * (queued → working → filled, etc.). The stream closes after the
 * first ActionUpdate with a terminal ActionStatus.
 *
 * @generated from message medallion.terminal.v1.ActionUpdate
 */
export type ActionUpdateJson = {
    /**
     * Backend-assigned id (mirrors ActionResponse.id).
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * The action handler this update belongs to (mirrors ActionRequest.action_id).
     *
     * @generated from field: string action_id = 2;
     */
    actionId?: string;
    /**
     * Mirrors ActionRequest.client_request_id, so clients can
     * reconcile updates with their in-flight submit calls.
     *
     * @generated from field: string client_request_id = 3;
     */
    clientRequestId?: string;
    /**
     * Current lifecycle state. The stream closes after the first
     * update with a terminal status.
     *
     * @generated from field: medallion.terminal.v1.ActionStatus status = 4;
     */
    status?: ActionStatusJson;
    /**
     * Action-specific sub-state ("partial", "filled", "stage_2_of_4").
     *
     * @generated from field: optional string status_detail = 5;
     */
    statusDetail?: string;
    /**
     * Human-readable message — surfaced to the user as a toast.
     *
     * @generated from field: optional string message = 6;
     */
    message?: string;
    /**
     * Optional structured payload (filled price, gas cost, tx hash,
     * confirmations).
     *
     * @generated from field: optional google.protobuf.Struct data = 7;
     */
    data?: StructJson;
    /**
     * ISO 8601 timestamp the backend emitted this update.
     *
     * @generated from field: string timestamp = 8;
     */
    timestamp?: string;
    /**
     * Monotonic per-action counter starting at 0. Lets clients
     * detect dropped messages and reorder if a transport reorders.
     *
     * @generated from field: uint64 sequence = 9;
     */
    sequence?: string;
};
/**
 * Describes the message medallion.terminal.v1.ActionUpdate.
 * Use `create(ActionUpdateSchema)` to create a new message.
 */
export declare const ActionUpdateSchema: GenMessage<ActionUpdate, {
    jsonType: ActionUpdateJson;
}>;
/**
 * ParamType — the data type a SourceParam expects. Used by catalog
 * UIs to render the right input control and by the AI to format
 * substitutions correctly. Wire format is always a string in
 * DataRequest.params; the backend converts based on this type.
 *
 * @generated from enum medallion.terminal.v1.ParamType
 */
export declare enum ParamType {
    /**
     * @generated from enum value: PARAM_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PARAM_TYPE_STRING = 1;
     */
    STRING = 1,
    /**
     * Floating-point number.
     *
     * @generated from enum value: PARAM_TYPE_NUMBER = 2;
     */
    NUMBER = 2,
    /**
     * @generated from enum value: PARAM_TYPE_BOOLEAN = 3;
     */
    BOOLEAN = 3,
    /**
     * ISO 8601 timestamp with time component (e.g. "2026-04-01T00:00:00Z").
     *
     * @generated from enum value: PARAM_TYPE_TIMESTAMP = 4;
     */
    TIMESTAMP = 4,
    /**
     * Duration (e.g. "1h", "7d", "30m"). Used for ranges/windows.
     *
     * @generated from enum value: PARAM_TYPE_DURATION = 5;
     */
    DURATION = 5,
    /**
     * Constrained to one of `enum_values`.
     *
     * @generated from enum value: PARAM_TYPE_ENUM = 6;
     */
    ENUM = 6,
    /**
     * Whole number (e.g. limit, page, depth).
     *
     * @generated from enum value: PARAM_TYPE_INTEGER = 7;
     */
    INTEGER = 7,
    /**
     * Date without time (e.g. "2026-04-01"). Use TIMESTAMP if the
     * time component matters.
     *
     * @generated from enum value: PARAM_TYPE_DATE = 8;
     */
    DATE = 8
}
/**
 * ParamType — the data type a SourceParam expects. Used by catalog
 * UIs to render the right input control and by the AI to format
 * substitutions correctly. Wire format is always a string in
 * DataRequest.params; the backend converts based on this type.
 *
 * @generated from enum medallion.terminal.v1.ParamType
 */
export type ParamTypeJson = "PARAM_TYPE_UNSPECIFIED" | "PARAM_TYPE_STRING" | "PARAM_TYPE_NUMBER" | "PARAM_TYPE_BOOLEAN" | "PARAM_TYPE_TIMESTAMP" | "PARAM_TYPE_DURATION" | "PARAM_TYPE_ENUM" | "PARAM_TYPE_INTEGER" | "PARAM_TYPE_DATE";
/**
 * Describes the enum medallion.terminal.v1.ParamType.
 */
export declare const ParamTypeSchema: GenEnum<ParamType, ParamTypeJson>;
/**
 * Shape names the payload variant a Source returns. The values
 * mirror the cases in DataResponse.payload — a backend should set
 * Source.shape to match what it actually emits.
 *
 * @generated from enum medallion.terminal.v1.Shape
 */
export declare enum Shape {
    /**
     * @generated from enum value: SHAPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: SHAPE_TIMESERIES = 1;
     */
    TIMESERIES = 1,
    /**
     * @generated from enum value: SHAPE_CANDLES = 2;
     */
    CANDLES = 2,
    /**
     * @generated from enum value: SHAPE_TABLE = 3;
     */
    TABLE = 3,
    /**
     * @generated from enum value: SHAPE_METRIC = 4;
     */
    METRIC = 4,
    /**
     * @generated from enum value: SHAPE_GAUGE = 5;
     */
    GAUGE = 5,
    /**
     * @generated from enum value: SHAPE_HEATMAP = 6;
     */
    HEATMAP = 6,
    /**
     * @generated from enum value: SHAPE_EVENTS = 7;
     */
    EVENTS = 7,
    /**
     * @generated from enum value: SHAPE_DISTRIBUTION = 8;
     */
    DISTRIBUTION = 8,
    /**
     * @generated from enum value: SHAPE_TEXT = 9;
     */
    TEXT = 9,
    /**
     * @generated from enum value: SHAPE_ORDERBOOK = 10;
     */
    ORDERBOOK = 10,
    /**
     * @generated from enum value: SHAPE_PAIRED_GRID = 11;
     */
    PAIRED_GRID = 11,
    /**
     * @generated from enum value: SHAPE_EMBED = 12;
     */
    EMBED = 12,
    /**
     * @generated from enum value: SHAPE_ASSET_CATALOG = 13;
     */
    ASSET_CATALOG = 13,
    /**
     * @generated from enum value: SHAPE_OBJECT = 14;
     */
    OBJECT = 14,
    /**
     * @generated from enum value: SHAPE_GRAPH = 15;
     */
    GRAPH = 15,
    /**
     * @generated from enum value: SHAPE_REPOSITORY = 16;
     */
    REPOSITORY = 16,
    /**
     * @generated from enum value: SHAPE_RECORD_SET = 17;
     */
    RECORD_SET = 17,
    /**
     * @generated from enum value: SHAPE_GEO = 18;
     */
    GEO = 18,
    /**
     * @generated from enum value: SHAPE_MEDIA = 19;
     */
    MEDIA = 19
}
/**
 * Shape names the payload variant a Source returns. The values
 * mirror the cases in DataResponse.payload — a backend should set
 * Source.shape to match what it actually emits.
 *
 * @generated from enum medallion.terminal.v1.Shape
 */
export type ShapeJson = "SHAPE_UNSPECIFIED" | "SHAPE_TIMESERIES" | "SHAPE_CANDLES" | "SHAPE_TABLE" | "SHAPE_METRIC" | "SHAPE_GAUGE" | "SHAPE_HEATMAP" | "SHAPE_EVENTS" | "SHAPE_DISTRIBUTION" | "SHAPE_TEXT" | "SHAPE_ORDERBOOK" | "SHAPE_PAIRED_GRID" | "SHAPE_EMBED" | "SHAPE_ASSET_CATALOG" | "SHAPE_OBJECT" | "SHAPE_GRAPH" | "SHAPE_REPOSITORY" | "SHAPE_RECORD_SET" | "SHAPE_GEO" | "SHAPE_MEDIA";
/**
 * Describes the enum medallion.terminal.v1.Shape.
 */
export declare const ShapeSchema: GenEnum<Shape, ShapeJson>;
/**
 * ActionStatus — coarse lifecycle state of a submitted action.
 * Maps cleanly onto common write semantics across domains:
 *
 *   place_order:  ACCEPTED → PENDING → OK | FAILED | CANCELLED
 *   send_message: OK | FAILED
 *   swap (web3):  ACCEPTED → PENDING → OK | FAILED
 *   vote:         OK | REJECTED
 *
 * Terminal status: OK, REJECTED, FAILED, CANCELLED — the action will
 * not change state again, no need to watch it.
 *
 * Non-terminal status: ACCEPTED, PENDING — the action will reach a
 * terminal state later. Subscribe via WatchAction for updates.
 *
 * @generated from enum medallion.terminal.v1.ActionStatus
 */
export declare enum ActionStatus {
    /**
     * @generated from enum value: ACTION_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Terminal: synchronous success. Action took effect.
     *
     * @generated from enum value: ACTION_STATUS_OK = 1;
     */
    OK = 1,
    /**
     * Non-terminal: acknowledged but not yet acted on (queued,
     * awaiting validation). Watch for a terminal update.
     *
     * @generated from enum value: ACTION_STATUS_ACCEPTED = 2;
     */
    ACCEPTED = 2,
    /**
     * Non-terminal: in-flight (RPC dispatched, on-chain pending,
     * exchange working). Watch for a terminal update.
     *
     * @generated from enum value: ACTION_STATUS_PENDING = 3;
     */
    PENDING = 3,
    /**
     * Terminal: refused before execution (validation, auth, business rule).
     *
     * @generated from enum value: ACTION_STATUS_REJECTED = 4;
     */
    REJECTED = 4,
    /**
     * Terminal: attempted and failed (downstream error, exception, revert).
     *
     * @generated from enum value: ACTION_STATUS_FAILED = 5;
     */
    FAILED = 5,
    /**
     * Terminal: cancelled before completion (by user, timeout, or backend).
     *
     * @generated from enum value: ACTION_STATUS_CANCELLED = 6;
     */
    CANCELLED = 6
}
/**
 * ActionStatus — coarse lifecycle state of a submitted action.
 * Maps cleanly onto common write semantics across domains:
 *
 *   place_order:  ACCEPTED → PENDING → OK | FAILED | CANCELLED
 *   send_message: OK | FAILED
 *   swap (web3):  ACCEPTED → PENDING → OK | FAILED
 *   vote:         OK | REJECTED
 *
 * Terminal status: OK, REJECTED, FAILED, CANCELLED — the action will
 * not change state again, no need to watch it.
 *
 * Non-terminal status: ACCEPTED, PENDING — the action will reach a
 * terminal state later. Subscribe via WatchAction for updates.
 *
 * @generated from enum medallion.terminal.v1.ActionStatus
 */
export type ActionStatusJson = "ACTION_STATUS_UNSPECIFIED" | "ACTION_STATUS_OK" | "ACTION_STATUS_ACCEPTED" | "ACTION_STATUS_PENDING" | "ACTION_STATUS_REJECTED" | "ACTION_STATUS_FAILED" | "ACTION_STATUS_CANCELLED";
/**
 * Describes the enum medallion.terminal.v1.ActionStatus.
 */
export declare const ActionStatusSchema: GenEnum<ActionStatus, ActionStatusJson>;
/**
 * @generated from service medallion.terminal.v1.TerminalService
 */
export declare const TerminalService: GenService<{
    /**
     * One-shot fetch for a registered source.
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.Get
     */
    get: {
        methodKind: "unary";
        input: typeof DataRequestSchema;
        output: typeof DataResponseSchema;
    };
    /**
     * Server-streaming fetch — backend pushes updated payloads.
     * Use for live data (prices, sentiment, status feeds).
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.Stream
     */
    stream: {
        methodKind: "server_streaming";
        input: typeof DataRequestSchema;
        output: typeof DataResponseSchema;
    };
    /**
     * Discover every source the backend can serve. The result feeds
     * both the AI prompt (so it knows what to wire up) and any
     * dashboard-authoring UI.
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.ListSources
     */
    listSources: {
        methodKind: "unary";
        input: typeof ListSourcesRequestSchema;
        output: typeof ListSourcesResponseSchema;
    };
    /**
     * Convert a natural-language prompt into widget mutations or a
     * full dashboard. The frontend applies the returned actions.
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.Generate
     */
    generate: {
        methodKind: "unary";
        input: typeof GenerateRequestSchema;
        output: typeof GenerateResponseSchema;
    };
    /**
     * Submit a write-side action. Generic dispatch for form-like widgets
     * (Trade, future swap/vote/message widgets). Backend dispatches on
     * `action_id` to a domain-specific handler. Keeps the framework
     * generic — only the dispatch envelope is in this proto; the
     * per-action parameter shape is by convention between widget and
     * backend.
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.SubmitAction
     */
    submitAction: {
        methodKind: "unary";
        input: typeof ActionRequestSchema;
        output: typeof ActionResponseSchema;
    };
    /**
     * Subscribe to lifecycle updates for a previously submitted action.
     * Required when SubmitAction returned a non-terminal status
     * (ACCEPTED or PENDING) and the caller needs the eventual outcome.
     * The backend MUST send updates monotonically by `sequence` and MUST
     * close the stream after a terminal status (OK, REJECTED, FAILED,
     * CANCELLED). Identify the action by ANY of action_id/id/
     * client_request_id — at least one must be set.
     *
     * @generated from rpc medallion.terminal.v1.TerminalService.WatchAction
     */
    watchAction: {
        methodKind: "server_streaming";
        input: typeof ActionWatchRequestSchema;
        output: typeof ActionUpdateSchema;
    };
}>;
