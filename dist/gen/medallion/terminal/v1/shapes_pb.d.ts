import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { StructJson, Value, ValueJson } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/terminal/v1/shapes.proto.
 */
export declare const file_medallion_terminal_v1_shapes: GenFile;
/**
 * --- Timeseries ---
 * Use for: line charts of any timestamped numeric data.
 * Examples: price history, sentiment over time, metric over time,
 * a bot's PnL curve, request latency, election polling spread.
 *
 * JSON examples:
 *
 * Single series:
 *   { "points": [
 *       { "timestamp": "2026-04-01T00:00:00Z", "value": 67400 },
 *       { "timestamp": "2026-04-02T00:00:00Z", "value": 68200 }
 *   ]}
 *
 * Multi-series (overlay):
 *   { "series": [
 *       { "name": "Yes", "points": [...] },
 *       { "name": "No",  "points": [...] }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.TimeseriesPayload
 */
export type TimeseriesPayload = Message<"medallion.terminal.v1.TimeseriesPayload"> & {
    /**
     * Single-series shorthand. Mutually exclusive with `series`.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesPoint points = 1;
     */
    points: TimeseriesPoint[];
    /**
     * Multi-series form. Each series renders as one line.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesSeries series = 2;
     */
    series: TimeseriesSeries[];
    /**
     * Optional markers overlaid on the chart. Use for buy/sell signals,
     * events, alerts, AI-flagged regions, etc.
     *
     * @generated from field: repeated medallion.terminal.v1.Annotation annotations = 3;
     */
    annotations: Annotation[];
};
/**
 * --- Timeseries ---
 * Use for: line charts of any timestamped numeric data.
 * Examples: price history, sentiment over time, metric over time,
 * a bot's PnL curve, request latency, election polling spread.
 *
 * JSON examples:
 *
 * Single series:
 *   { "points": [
 *       { "timestamp": "2026-04-01T00:00:00Z", "value": 67400 },
 *       { "timestamp": "2026-04-02T00:00:00Z", "value": 68200 }
 *   ]}
 *
 * Multi-series (overlay):
 *   { "series": [
 *       { "name": "Yes", "points": [...] },
 *       { "name": "No",  "points": [...] }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.TimeseriesPayload
 */
export type TimeseriesPayloadJson = {
    /**
     * Single-series shorthand. Mutually exclusive with `series`.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesPoint points = 1;
     */
    points?: TimeseriesPointJson[];
    /**
     * Multi-series form. Each series renders as one line.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesSeries series = 2;
     */
    series?: TimeseriesSeriesJson[];
    /**
     * Optional markers overlaid on the chart. Use for buy/sell signals,
     * events, alerts, AI-flagged regions, etc.
     *
     * @generated from field: repeated medallion.terminal.v1.Annotation annotations = 3;
     */
    annotations?: AnnotationJson[];
};
/**
 * Describes the message medallion.terminal.v1.TimeseriesPayload.
 * Use `create(TimeseriesPayloadSchema)` to create a new message.
 */
export declare const TimeseriesPayloadSchema: GenMessage<TimeseriesPayload, {
    jsonType: TimeseriesPayloadJson;
}>;
/**
 * One timestamped value in a timeseries.
 *
 * @generated from message medallion.terminal.v1.TimeseriesPoint
 */
export type TimeseriesPoint = Message<"medallion.terminal.v1.TimeseriesPoint"> & {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp: string;
    /**
     * The numeric value at this timestamp.
     *
     * @generated from field: double value = 2;
     */
    value: number;
};
/**
 * One timestamped value in a timeseries.
 *
 * @generated from message medallion.terminal.v1.TimeseriesPoint
 */
export type TimeseriesPointJson = {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp?: string;
    /**
     * The numeric value at this timestamp.
     *
     * @generated from field: double value = 2;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
};
/**
 * Describes the message medallion.terminal.v1.TimeseriesPoint.
 * Use `create(TimeseriesPointSchema)` to create a new message.
 */
export declare const TimeseriesPointSchema: GenMessage<TimeseriesPoint, {
    jsonType: TimeseriesPointJson;
}>;
/**
 * One named line in a multi-series chart.
 *
 * @generated from message medallion.terminal.v1.TimeseriesSeries
 */
export type TimeseriesSeries = Message<"medallion.terminal.v1.TimeseriesSeries"> & {
    /**
     * Display name (used in legend/tooltip).
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * The ordered points of this series.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesPoint points = 2;
     */
    points: TimeseriesPoint[];
};
/**
 * One named line in a multi-series chart.
 *
 * @generated from message medallion.terminal.v1.TimeseriesSeries
 */
export type TimeseriesSeriesJson = {
    /**
     * Display name (used in legend/tooltip).
     *
     * @generated from field: string name = 1;
     */
    name?: string;
    /**
     * The ordered points of this series.
     *
     * @generated from field: repeated medallion.terminal.v1.TimeseriesPoint points = 2;
     */
    points?: TimeseriesPointJson[];
};
/**
 * Describes the message medallion.terminal.v1.TimeseriesSeries.
 * Use `create(TimeseriesSeriesSchema)` to create a new message.
 */
export declare const TimeseriesSeriesSchema: GenMessage<TimeseriesSeries, {
    jsonType: TimeseriesSeriesJson;
}>;
/**
 * --- Candles (OHLCV) ---
 * Use for: any open/high/low/close timeseries, with optional volume.
 * Examples: equity/crypto price bars, prediction market bid/ask bars.
 *
 * JSON example:
 *   { "bars": [
 *       { "timestamp": "2026-04-01", "open": 67100, "high": 68400,
 *         "low": 66800, "close": 68200, "volume": 28500 }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.CandlePayload
 */
export type CandlePayload = Message<"medallion.terminal.v1.CandlePayload"> & {
    /**
     * Ordered OHLCV bars.
     *
     * @generated from field: repeated medallion.terminal.v1.Candle bars = 1;
     */
    bars: Candle[];
    /**
     * Markers overlaid on the chart (trades, signals, events). Same
     * shape as TimeseriesPayload.annotations — the renderer maps the
     * `kind` to a built-in marker style (arrowUp for buy, arrowDown
     * for sell, etc.).
     *
     * @generated from field: repeated medallion.terminal.v1.Annotation annotations = 2;
     */
    annotations: Annotation[];
};
/**
 * --- Candles (OHLCV) ---
 * Use for: any open/high/low/close timeseries, with optional volume.
 * Examples: equity/crypto price bars, prediction market bid/ask bars.
 *
 * JSON example:
 *   { "bars": [
 *       { "timestamp": "2026-04-01", "open": 67100, "high": 68400,
 *         "low": 66800, "close": 68200, "volume": 28500 }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.CandlePayload
 */
export type CandlePayloadJson = {
    /**
     * Ordered OHLCV bars.
     *
     * @generated from field: repeated medallion.terminal.v1.Candle bars = 1;
     */
    bars?: CandleJson[];
    /**
     * Markers overlaid on the chart (trades, signals, events). Same
     * shape as TimeseriesPayload.annotations — the renderer maps the
     * `kind` to a built-in marker style (arrowUp for buy, arrowDown
     * for sell, etc.).
     *
     * @generated from field: repeated medallion.terminal.v1.Annotation annotations = 2;
     */
    annotations?: AnnotationJson[];
};
/**
 * Describes the message medallion.terminal.v1.CandlePayload.
 * Use `create(CandlePayloadSchema)` to create a new message.
 */
export declare const CandlePayloadSchema: GenMessage<CandlePayload, {
    jsonType: CandlePayloadJson;
}>;
/**
 * One OHLCV bar.
 *
 * @generated from message medallion.terminal.v1.Candle
 */
export type Candle = Message<"medallion.terminal.v1.Candle"> & {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp: string;
    /**
     * Opening price of the bar.
     *
     * @generated from field: double open = 2;
     */
    open: number;
    /**
     * Highest price of the bar.
     *
     * @generated from field: double high = 3;
     */
    high: number;
    /**
     * Lowest price of the bar.
     *
     * @generated from field: double low = 4;
     */
    low: number;
    /**
     * Closing price of the bar.
     *
     * @generated from field: double close = 5;
     */
    close: number;
    /**
     * If set, rendered as a volume histogram beneath the chart.
     *
     * @generated from field: optional double volume = 6;
     */
    volume?: number | undefined;
};
/**
 * One OHLCV bar.
 *
 * @generated from message medallion.terminal.v1.Candle
 */
export type CandleJson = {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp?: string;
    /**
     * Opening price of the bar.
     *
     * @generated from field: double open = 2;
     */
    open?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Highest price of the bar.
     *
     * @generated from field: double high = 3;
     */
    high?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Lowest price of the bar.
     *
     * @generated from field: double low = 4;
     */
    low?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Closing price of the bar.
     *
     * @generated from field: double close = 5;
     */
    close?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * If set, rendered as a volume histogram beneath the chart.
     *
     * @generated from field: optional double volume = 6;
     */
    volume?: number | "NaN" | "Infinity" | "-Infinity";
};
/**
 * Describes the message medallion.terminal.v1.Candle.
 * Use `create(CandleSchema)` to create a new message.
 */
export declare const CandleSchema: GenMessage<Candle, {
    jsonType: CandleJson;
}>;
/**
 * Annotation — a single marker overlay on a chart (timeseries or
 * candles). Used for buy/sell signals, alerts, news markers, etc.
 *
 * JSON example (on a candlestick):
 *   { "timestamp": "2026-04-08", "label": "BUY", "kind": "buy" }
 *   { "timestamp": "2026-04-12", "label": "SELL 0.5",
 *     "kind": "sell", "value": 71200 }
 *
 * Recognized `kind` values map to default colors and shapes:
 *   buy   → up-arrow / green
 *   sell  → down-arrow / red
 *   info  → circle / sky-blue
 *   warn  → circle / amber
 * Other values render as a neutral gray dot.
 *
 * @generated from message medallion.terminal.v1.Annotation
 */
export type Annotation = Message<"medallion.terminal.v1.Annotation"> & {
    /**
     * Where on the x-axis the marker sits (ISO 8601 or Unix epoch).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp: string;
    /**
     * Y-axis position. Optional for candlestick (the renderer pins
     * above/below the bar based on `kind`); recommended for timeseries.
     *
     * @generated from field: optional double value = 2;
     */
    value?: number | undefined;
    /**
     * Short text shown next to the marker (and as hover tooltip).
     *
     * @generated from field: string label = 3;
     */
    label: string;
    /**
     * Marker semantic. Free-form — unrecognized values render as
     * neutral. Recognized: "buy", "sell", "info", "warn".
     *
     * @generated from field: string kind = 4;
     */
    kind: string;
    /**
     * Optional color override (CSS hex). Use only when the default
     * kind color is wrong for the dashboard's palette.
     *
     * @generated from field: optional string color = 5;
     */
    color?: string | undefined;
    /**
     * If present, the annotation is a band spanning [timestamp,
     * end_timestamp] — the renderer fills the region instead of
     * drawing a point marker. Use for in-sample / out-of-sample
     * backtest splits, stress periods (COVID, FTX), FOMC windows,
     * blackout zones, regime detector outputs, etc.
     *
     * @generated from field: optional string end_timestamp = 6;
     */
    endTimestamp?: string | undefined;
};
/**
 * Annotation — a single marker overlay on a chart (timeseries or
 * candles). Used for buy/sell signals, alerts, news markers, etc.
 *
 * JSON example (on a candlestick):
 *   { "timestamp": "2026-04-08", "label": "BUY", "kind": "buy" }
 *   { "timestamp": "2026-04-12", "label": "SELL 0.5",
 *     "kind": "sell", "value": 71200 }
 *
 * Recognized `kind` values map to default colors and shapes:
 *   buy   → up-arrow / green
 *   sell  → down-arrow / red
 *   info  → circle / sky-blue
 *   warn  → circle / amber
 * Other values render as a neutral gray dot.
 *
 * @generated from message medallion.terminal.v1.Annotation
 */
export type AnnotationJson = {
    /**
     * Where on the x-axis the marker sits (ISO 8601 or Unix epoch).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp?: string;
    /**
     * Y-axis position. Optional for candlestick (the renderer pins
     * above/below the bar based on `kind`); recommended for timeseries.
     *
     * @generated from field: optional double value = 2;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Short text shown next to the marker (and as hover tooltip).
     *
     * @generated from field: string label = 3;
     */
    label?: string;
    /**
     * Marker semantic. Free-form — unrecognized values render as
     * neutral. Recognized: "buy", "sell", "info", "warn".
     *
     * @generated from field: string kind = 4;
     */
    kind?: string;
    /**
     * Optional color override (CSS hex). Use only when the default
     * kind color is wrong for the dashboard's palette.
     *
     * @generated from field: optional string color = 5;
     */
    color?: string;
    /**
     * If present, the annotation is a band spanning [timestamp,
     * end_timestamp] — the renderer fills the region instead of
     * drawing a point marker. Use for in-sample / out-of-sample
     * backtest splits, stress periods (COVID, FTX), FOMC windows,
     * blackout zones, regime detector outputs, etc.
     *
     * @generated from field: optional string end_timestamp = 6;
     */
    endTimestamp?: string;
};
/**
 * Describes the message medallion.terminal.v1.Annotation.
 * Use `create(AnnotationSchema)` to create a new message.
 */
export declare const AnnotationSchema: GenMessage<Annotation, {
    jsonType: AnnotationJson;
}>;
/**
 * --- Table ---
 * Use for: any tabular data.
 * Examples: holdings, leaderboards, peer comparison, order book,
 * list of open positions, cron job registry.
 *
 * JSON examples:
 *
 * Implicit (columns auto-detected from row keys):
 *   { "rows": [
 *       { "asset": "BTC", "qty": 1.5, "price": 67500 },
 *       { "asset": "ETH", "qty": 12,  "price": 3450 }
 *   ]}
 *
 * Explicit (column types and formatting hints):
 *   { "columns": [
 *       { "key": "asset", "label": "Asset", "type": "COLUMN_TYPE_STRING" },
 *       { "key": "price", "label": "Price", "type": "COLUMN_TYPE_NUMBER",
 *         "format": "currency:USD" }
 *     ],
 *     "rows": [...] }
 *
 * @generated from message medallion.terminal.v1.TablePayload
 */
export type TablePayload = Message<"medallion.terminal.v1.TablePayload"> & {
    /**
     * Optional schema. If omitted, columns auto-detect from the first row.
     *
     * @generated from field: repeated medallion.terminal.v1.TableColumn columns = 1;
     */
    columns: TableColumn[];
    /**
     * Row data as objects (keys must match column.key when columns are set).
     *
     * @generated from field: repeated google.protobuf.Struct rows = 2;
     */
    rows: JsonObject[];
};
/**
 * --- Table ---
 * Use for: any tabular data.
 * Examples: holdings, leaderboards, peer comparison, order book,
 * list of open positions, cron job registry.
 *
 * JSON examples:
 *
 * Implicit (columns auto-detected from row keys):
 *   { "rows": [
 *       { "asset": "BTC", "qty": 1.5, "price": 67500 },
 *       { "asset": "ETH", "qty": 12,  "price": 3450 }
 *   ]}
 *
 * Explicit (column types and formatting hints):
 *   { "columns": [
 *       { "key": "asset", "label": "Asset", "type": "COLUMN_TYPE_STRING" },
 *       { "key": "price", "label": "Price", "type": "COLUMN_TYPE_NUMBER",
 *         "format": "currency:USD" }
 *     ],
 *     "rows": [...] }
 *
 * @generated from message medallion.terminal.v1.TablePayload
 */
export type TablePayloadJson = {
    /**
     * Optional schema. If omitted, columns auto-detect from the first row.
     *
     * @generated from field: repeated medallion.terminal.v1.TableColumn columns = 1;
     */
    columns?: TableColumnJson[];
    /**
     * Row data as objects (keys must match column.key when columns are set).
     *
     * @generated from field: repeated google.protobuf.Struct rows = 2;
     */
    rows?: StructJson[];
};
/**
 * Describes the message medallion.terminal.v1.TablePayload.
 * Use `create(TablePayloadSchema)` to create a new message.
 */
export declare const TablePayloadSchema: GenMessage<TablePayload, {
    jsonType: TablePayloadJson;
}>;
/**
 * TableColumn declares one column's key, label, type, and format.
 *
 * @generated from message medallion.terminal.v1.TableColumn
 */
export type TableColumn = Message<"medallion.terminal.v1.TableColumn"> & {
    /**
     * Field key matching row object keys.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Display label. Defaults to `key` if omitted.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Type hint for sorting and default formatting.
     *
     * @generated from field: medallion.terminal.v1.ColumnType type = 3;
     */
    type: ColumnType;
    /**
     * Optional formatting directive. Examples:
     *   "currency:USD", "currency:EUR", "percent", "percent:2",
     *   "datetime", "date", "compact" (1.2M, 3.4B), "delta"
     *
     * @generated from field: optional string format = 4;
     */
    format?: string | undefined;
};
/**
 * TableColumn declares one column's key, label, type, and format.
 *
 * @generated from message medallion.terminal.v1.TableColumn
 */
export type TableColumnJson = {
    /**
     * Field key matching row object keys.
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Display label. Defaults to `key` if omitted.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Type hint for sorting and default formatting.
     *
     * @generated from field: medallion.terminal.v1.ColumnType type = 3;
     */
    type?: ColumnTypeJson;
    /**
     * Optional formatting directive. Examples:
     *   "currency:USD", "currency:EUR", "percent", "percent:2",
     *   "datetime", "date", "compact" (1.2M, 3.4B), "delta"
     *
     * @generated from field: optional string format = 4;
     */
    format?: string;
};
/**
 * Describes the message medallion.terminal.v1.TableColumn.
 * Use `create(TableColumnSchema)` to create a new message.
 */
export declare const TableColumnSchema: GenMessage<TableColumn, {
    jsonType: TableColumnJson;
}>;
/**
 * --- Metric ---
 * Use for: a single headline number with optional context.
 * Examples: spot price, total PnL, today's volume, model accuracy,
 * open positions count, win rate.
 *
 * JSON examples:
 *
 * Full:
 *   { "value": 67842.50, "delta": 2.18, "unit": "USD",
 *     "label": "Spot", "trend": [67100, 67300, 67500, 67800, 67842] }
 *
 * Minimal:
 *   { "value": 67842.50 }
 *
 * @generated from message medallion.terminal.v1.MetricPayload
 */
export type MetricPayload = Message<"medallion.terminal.v1.MetricPayload"> & {
    /**
     * The headline number.
     *
     * @generated from field: double value = 1;
     */
    value: number;
    /**
     * Change since some baseline; shown as a colored delta indicator.
     * Convention: a fraction (0.0218 = +2.18%). Sign drives color.
     *
     * @generated from field: optional double delta = 2;
     */
    delta?: number | undefined;
    /**
     * Unit displayed after the value ("USD", "%", "req/s").
     *
     * @generated from field: optional string unit = 3;
     */
    unit?: string | undefined;
    /**
     * Subtitle below the value.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string | undefined;
    /**
     * Optional sparkline — tiny inline trend chart. Just the values,
     * evenly spaced. For a full chart, use TimeseriesPayload instead.
     *
     * @generated from field: repeated double trend = 5;
     */
    trend: number[];
};
/**
 * --- Metric ---
 * Use for: a single headline number with optional context.
 * Examples: spot price, total PnL, today's volume, model accuracy,
 * open positions count, win rate.
 *
 * JSON examples:
 *
 * Full:
 *   { "value": 67842.50, "delta": 2.18, "unit": "USD",
 *     "label": "Spot", "trend": [67100, 67300, 67500, 67800, 67842] }
 *
 * Minimal:
 *   { "value": 67842.50 }
 *
 * @generated from message medallion.terminal.v1.MetricPayload
 */
export type MetricPayloadJson = {
    /**
     * The headline number.
     *
     * @generated from field: double value = 1;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Change since some baseline; shown as a colored delta indicator.
     * Convention: a fraction (0.0218 = +2.18%). Sign drives color.
     *
     * @generated from field: optional double delta = 2;
     */
    delta?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Unit displayed after the value ("USD", "%", "req/s").
     *
     * @generated from field: optional string unit = 3;
     */
    unit?: string;
    /**
     * Subtitle below the value.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string;
    /**
     * Optional sparkline — tiny inline trend chart. Just the values,
     * evenly spaced. For a full chart, use TimeseriesPayload instead.
     *
     * @generated from field: repeated double trend = 5;
     */
    trend?: (number | "NaN" | "Infinity" | "-Infinity")[];
};
/**
 * Describes the message medallion.terminal.v1.MetricPayload.
 * Use `create(MetricPayloadSchema)` to create a new message.
 */
export declare const MetricPayloadSchema: GenMessage<MetricPayload, {
    jsonType: MetricPayloadJson;
}>;
/**
 * --- Gauge ---
 * Use for: bounded scalars where position within a range is meaningful.
 * Examples: prediction market probability (0..1), sentiment (-1..1),
 * model confidence, cron-fleet health (% green), workflow progress.
 *
 * JSON examples:
 *
 * Probability:
 *   { "value": 0.67, "min": 0, "max": 1, "label": "Yes" }
 *
 * Sentiment with color bands:
 *   { "value": 0.32, "min": -1, "max": 1, "label": "Net sentiment",
 *     "bands": [
 *       { "from": -1,  "to": -0.3, "color": "danger", "label": "Bearish" },
 *       { "from": -0.3,"to":  0.3, "color": "warn",   "label": "Neutral" },
 *       { "from":  0.3,"to":  1,   "color": "ok",     "label": "Bullish" }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.GaugePayload
 */
export type GaugePayload = Message<"medallion.terminal.v1.GaugePayload"> & {
    /**
     * Current position within [min, max].
     *
     * @generated from field: double value = 1;
     */
    value: number;
    /**
     * Range bounds. Default min=0, max=1.
     *
     * @generated from field: optional double min = 2;
     */
    min?: number | undefined;
    /**
     * Upper bound of the range. Default 1.
     *
     * @generated from field: optional double max = 3;
     */
    max?: number | undefined;
    /**
     * Caption below the gauge.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string | undefined;
    /**
     * Optional colored zones along the range.
     *
     * @generated from field: repeated medallion.terminal.v1.GaugeBand bands = 5;
     */
    bands: GaugeBand[];
};
/**
 * --- Gauge ---
 * Use for: bounded scalars where position within a range is meaningful.
 * Examples: prediction market probability (0..1), sentiment (-1..1),
 * model confidence, cron-fleet health (% green), workflow progress.
 *
 * JSON examples:
 *
 * Probability:
 *   { "value": 0.67, "min": 0, "max": 1, "label": "Yes" }
 *
 * Sentiment with color bands:
 *   { "value": 0.32, "min": -1, "max": 1, "label": "Net sentiment",
 *     "bands": [
 *       { "from": -1,  "to": -0.3, "color": "danger", "label": "Bearish" },
 *       { "from": -0.3,"to":  0.3, "color": "warn",   "label": "Neutral" },
 *       { "from":  0.3,"to":  1,   "color": "ok",     "label": "Bullish" }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.GaugePayload
 */
export type GaugePayloadJson = {
    /**
     * Current position within [min, max].
     *
     * @generated from field: double value = 1;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Range bounds. Default min=0, max=1.
     *
     * @generated from field: optional double min = 2;
     */
    min?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Upper bound of the range. Default 1.
     *
     * @generated from field: optional double max = 3;
     */
    max?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Caption below the gauge.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string;
    /**
     * Optional colored zones along the range.
     *
     * @generated from field: repeated medallion.terminal.v1.GaugeBand bands = 5;
     */
    bands?: GaugeBandJson[];
};
/**
 * Describes the message medallion.terminal.v1.GaugePayload.
 * Use `create(GaugePayloadSchema)` to create a new message.
 */
export declare const GaugePayloadSchema: GenMessage<GaugePayload, {
    jsonType: GaugePayloadJson;
}>;
/**
 * One colored zone along the gauge range.
 *
 * @generated from message medallion.terminal.v1.GaugeBand
 */
export type GaugeBand = Message<"medallion.terminal.v1.GaugeBand"> & {
    /**
     * Band start (inclusive).
     *
     * @generated from field: double from = 1;
     */
    from: number;
    /**
     * Band end (inclusive).
     *
     * @generated from field: double to = 2;
     */
    to: number;
    /**
     * Semantic color name. The frontend maps this to a theme color.
     * Recognized: "ok", "warn", "danger", "info", "muted".
     *
     * @generated from field: string color = 3;
     */
    color: string;
    /**
     * Optional band caption.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string | undefined;
};
/**
 * One colored zone along the gauge range.
 *
 * @generated from message medallion.terminal.v1.GaugeBand
 */
export type GaugeBandJson = {
    /**
     * Band start (inclusive).
     *
     * @generated from field: double from = 1;
     */
    from?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Band end (inclusive).
     *
     * @generated from field: double to = 2;
     */
    to?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Semantic color name. The frontend maps this to a theme color.
     * Recognized: "ok", "warn", "danger", "info", "muted".
     *
     * @generated from field: string color = 3;
     */
    color?: string;
    /**
     * Optional band caption.
     *
     * @generated from field: optional string label = 4;
     */
    label?: string;
};
/**
 * Describes the message medallion.terminal.v1.GaugeBand.
 * Use `create(GaugeBandSchema)` to create a new message.
 */
export declare const GaugeBandSchema: GenMessage<GaugeBand, {
    jsonType: GaugeBandJson;
}>;
/**
 * --- Heatmap ---
 * Use for: 2D matrices colored by value.
 * Examples: sector returns matrix, correlation matrix, cron fleet
 * health (job × hour), sentiment grid (entity × source), calendar
 * heatmap (day × hour activity).
 *
 * JSON example:
 *   { "rows": ["Tech", "Energy", "Finance"],
 *     "columns": ["Mon", "Tue", "Wed"],
 *     "cells": [
 *       { "row": 0, "col": 0, "value": 1.2 },
 *       { "row": 0, "col": 1, "value": -0.8 }
 *     ],
 *     "scale": "diverging" }
 *
 * @generated from message medallion.terminal.v1.HeatmapPayload
 */
export type HeatmapPayload = Message<"medallion.terminal.v1.HeatmapPayload"> & {
    /**
     * Row labels (ordered). Cell.row indexes into this list.
     *
     * @generated from field: repeated string rows = 1;
     */
    rows: string[];
    /**
     * Column labels (ordered). Cell.col indexes into this list.
     *
     * @generated from field: repeated string columns = 2;
     */
    columns: string[];
    /**
     * The matrix cells. Sparse — missing cells render empty.
     *
     * @generated from field: repeated medallion.terminal.v1.HeatmapCell cells = 3;
     */
    cells: HeatmapCell[];
    /**
     * Color scale bounds. Auto-detected from data if unset.
     *
     * @generated from field: optional double min = 4;
     */
    min?: number | undefined;
    /**
     * Upper color scale bound. Auto-detected if unset.
     *
     * @generated from field: optional double max = 5;
     */
    max?: number | undefined;
    /**
     * Color scale type: "diverging" (centered at 0) or "sequential".
     * Default: sequential.
     *
     * @generated from field: optional string scale = 6;
     */
    scale?: string | undefined;
};
/**
 * --- Heatmap ---
 * Use for: 2D matrices colored by value.
 * Examples: sector returns matrix, correlation matrix, cron fleet
 * health (job × hour), sentiment grid (entity × source), calendar
 * heatmap (day × hour activity).
 *
 * JSON example:
 *   { "rows": ["Tech", "Energy", "Finance"],
 *     "columns": ["Mon", "Tue", "Wed"],
 *     "cells": [
 *       { "row": 0, "col": 0, "value": 1.2 },
 *       { "row": 0, "col": 1, "value": -0.8 }
 *     ],
 *     "scale": "diverging" }
 *
 * @generated from message medallion.terminal.v1.HeatmapPayload
 */
export type HeatmapPayloadJson = {
    /**
     * Row labels (ordered). Cell.row indexes into this list.
     *
     * @generated from field: repeated string rows = 1;
     */
    rows?: string[];
    /**
     * Column labels (ordered). Cell.col indexes into this list.
     *
     * @generated from field: repeated string columns = 2;
     */
    columns?: string[];
    /**
     * The matrix cells. Sparse — missing cells render empty.
     *
     * @generated from field: repeated medallion.terminal.v1.HeatmapCell cells = 3;
     */
    cells?: HeatmapCellJson[];
    /**
     * Color scale bounds. Auto-detected from data if unset.
     *
     * @generated from field: optional double min = 4;
     */
    min?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Upper color scale bound. Auto-detected if unset.
     *
     * @generated from field: optional double max = 5;
     */
    max?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Color scale type: "diverging" (centered at 0) or "sequential".
     * Default: sequential.
     *
     * @generated from field: optional string scale = 6;
     */
    scale?: string;
};
/**
 * Describes the message medallion.terminal.v1.HeatmapPayload.
 * Use `create(HeatmapPayloadSchema)` to create a new message.
 */
export declare const HeatmapPayloadSchema: GenMessage<HeatmapPayload, {
    jsonType: HeatmapPayloadJson;
}>;
/**
 * One cell in the heatmap matrix.
 *
 * @generated from message medallion.terminal.v1.HeatmapCell
 */
export type HeatmapCell = Message<"medallion.terminal.v1.HeatmapCell"> & {
    /**
     * Index into HeatmapPayload.rows.
     *
     * @generated from field: int32 row = 1;
     */
    row: number;
    /**
     * Index into HeatmapPayload.columns.
     *
     * @generated from field: int32 col = 2;
     */
    col: number;
    /**
     * The cell's numeric value; drives the color.
     *
     * @generated from field: double value = 3;
     */
    value: number;
    /**
     * Optional text override (otherwise the formatted value is shown).
     *
     * @generated from field: optional string label = 4;
     */
    label?: string | undefined;
};
/**
 * One cell in the heatmap matrix.
 *
 * @generated from message medallion.terminal.v1.HeatmapCell
 */
export type HeatmapCellJson = {
    /**
     * Index into HeatmapPayload.rows.
     *
     * @generated from field: int32 row = 1;
     */
    row?: number;
    /**
     * Index into HeatmapPayload.columns.
     *
     * @generated from field: int32 col = 2;
     */
    col?: number;
    /**
     * The cell's numeric value; drives the color.
     *
     * @generated from field: double value = 3;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Optional text override (otherwise the formatted value is shown).
     *
     * @generated from field: optional string label = 4;
     */
    label?: string;
};
/**
 * Describes the message medallion.terminal.v1.HeatmapCell.
 * Use `create(HeatmapCellSchema)` to create a new message.
 */
export declare const HeatmapCellSchema: GenMessage<HeatmapCell, {
    jsonType: HeatmapCellJson;
}>;
/**
 * --- Events (timeline) ---
 * Use for: chronological streams where status is first-class.
 * Examples: cron run history, workflow stage progress, trade fills,
 * alerts, deployment timeline, bet settlement log.
 *
 * JSON example:
 *   { "events": [
 *       { "timestamp": "2026-04-01T09:00:00Z",
 *         "label": "Daily ingest",
 *         "status": "EVENT_STATUS_OK",
 *         "body": "Processed 1.2M rows in 38s" },
 *       { "timestamp": "2026-04-01T09:15:00Z",
 *         "label": "Sentiment refresh",
 *         "status": "EVENT_STATUS_WARN",
 *         "body": "3 sources timed out, used cached values" }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.EventPayload
 */
export type EventPayload = Message<"medallion.terminal.v1.EventPayload"> & {
    /**
     * The events to render, in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.Event events = 1;
     */
    events: Event[];
};
/**
 * --- Events (timeline) ---
 * Use for: chronological streams where status is first-class.
 * Examples: cron run history, workflow stage progress, trade fills,
 * alerts, deployment timeline, bet settlement log.
 *
 * JSON example:
 *   { "events": [
 *       { "timestamp": "2026-04-01T09:00:00Z",
 *         "label": "Daily ingest",
 *         "status": "EVENT_STATUS_OK",
 *         "body": "Processed 1.2M rows in 38s" },
 *       { "timestamp": "2026-04-01T09:15:00Z",
 *         "label": "Sentiment refresh",
 *         "status": "EVENT_STATUS_WARN",
 *         "body": "3 sources timed out, used cached values" }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.EventPayload
 */
export type EventPayloadJson = {
    /**
     * The events to render, in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.Event events = 1;
     */
    events?: EventJson[];
};
/**
 * Describes the message medallion.terminal.v1.EventPayload.
 * Use `create(EventPayloadSchema)` to create a new message.
 */
export declare const EventPayloadSchema: GenMessage<EventPayload, {
    jsonType: EventPayloadJson;
}>;
/**
 * One entry in an event timeline.
 *
 * @generated from message medallion.terminal.v1.Event
 */
export type Event = Message<"medallion.terminal.v1.Event"> & {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp: string;
    /**
     * Primary one-line description.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Coarse status; drives the color of the entry.
     *
     * @generated from field: medallion.terminal.v1.EventStatus status = 3;
     */
    status: EventStatus;
    /**
     * Detail or longer description.
     *
     * @generated from field: optional string body = 4;
     */
    body?: string | undefined;
    /**
     * Attribution (e.g. "scheduler", "user@x", "ingest-worker-3").
     *
     * @generated from field: optional string source = 5;
     */
    source?: string | undefined;
    /**
     * Free-form tags for filtering and grouping.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags: string[];
};
/**
 * One entry in an event timeline.
 *
 * @generated from message medallion.terminal.v1.Event
 */
export type EventJson = {
    /**
     * ISO 8601 timestamp or Unix epoch (seconds or ms).
     *
     * @generated from field: string timestamp = 1;
     */
    timestamp?: string;
    /**
     * Primary one-line description.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Coarse status; drives the color of the entry.
     *
     * @generated from field: medallion.terminal.v1.EventStatus status = 3;
     */
    status?: EventStatusJson;
    /**
     * Detail or longer description.
     *
     * @generated from field: optional string body = 4;
     */
    body?: string;
    /**
     * Attribution (e.g. "scheduler", "user@x", "ingest-worker-3").
     *
     * @generated from field: optional string source = 5;
     */
    source?: string;
    /**
     * Free-form tags for filtering and grouping.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags?: string[];
};
/**
 * Describes the message medallion.terminal.v1.Event.
 * Use `create(EventSchema)` to create a new message.
 */
export declare const EventSchema: GenMessage<Event, {
    jsonType: EventJson;
}>;
/**
 * --- Distribution ---
 * Use for: labeled categorical proportions (pie/donut/stacked bar).
 * Examples: bull/bear sentiment split, asset allocation, win/loss
 * breakdown, vote share, topic distribution.
 *
 * JSON example:
 *   { "slices": [
 *       { "label": "Bull", "value": 0.62, "color": "ok" },
 *       { "label": "Bear", "value": 0.38, "color": "danger" }
 *   ]}
 *
 * Values are normalized for rendering — pass raw counts or
 * fractions, the widget computes percentages.
 *
 * @generated from message medallion.terminal.v1.DistributionPayload
 */
export type DistributionPayload = Message<"medallion.terminal.v1.DistributionPayload"> & {
    /**
     * The labeled slices. Values may be raw counts or fractions.
     *
     * @generated from field: repeated medallion.terminal.v1.DistributionSlice slices = 1;
     */
    slices: DistributionSlice[];
    /**
     * Optional total to normalize against. Default: sum of slice values.
     * Use this when slices represent a subset (e.g. "top 5 of N").
     *
     * @generated from field: optional double total = 2;
     */
    total?: number | undefined;
};
/**
 * --- Distribution ---
 * Use for: labeled categorical proportions (pie/donut/stacked bar).
 * Examples: bull/bear sentiment split, asset allocation, win/loss
 * breakdown, vote share, topic distribution.
 *
 * JSON example:
 *   { "slices": [
 *       { "label": "Bull", "value": 0.62, "color": "ok" },
 *       { "label": "Bear", "value": 0.38, "color": "danger" }
 *   ]}
 *
 * Values are normalized for rendering — pass raw counts or
 * fractions, the widget computes percentages.
 *
 * @generated from message medallion.terminal.v1.DistributionPayload
 */
export type DistributionPayloadJson = {
    /**
     * The labeled slices. Values may be raw counts or fractions.
     *
     * @generated from field: repeated medallion.terminal.v1.DistributionSlice slices = 1;
     */
    slices?: DistributionSliceJson[];
    /**
     * Optional total to normalize against. Default: sum of slice values.
     * Use this when slices represent a subset (e.g. "top 5 of N").
     *
     * @generated from field: optional double total = 2;
     */
    total?: number | "NaN" | "Infinity" | "-Infinity";
};
/**
 * Describes the message medallion.terminal.v1.DistributionPayload.
 * Use `create(DistributionPayloadSchema)` to create a new message.
 */
export declare const DistributionPayloadSchema: GenMessage<DistributionPayload, {
    jsonType: DistributionPayloadJson;
}>;
/**
 * One labeled slice of a distribution.
 *
 * @generated from message medallion.terminal.v1.DistributionSlice
 */
export type DistributionSlice = Message<"medallion.terminal.v1.DistributionSlice"> & {
    /**
     * Slice name shown in the legend.
     *
     * @generated from field: string label = 1;
     */
    label: string;
    /**
     * Raw count or fraction; normalized by the widget.
     *
     * @generated from field: double value = 2;
     */
    value: number;
    /**
     * Semantic color hint. Recognized: "ok", "warn", "danger", "info",
     * "muted". Free-form names map to the dashboard's palette.
     *
     * @generated from field: optional string color = 3;
     */
    color?: string | undefined;
};
/**
 * One labeled slice of a distribution.
 *
 * @generated from message medallion.terminal.v1.DistributionSlice
 */
export type DistributionSliceJson = {
    /**
     * Slice name shown in the legend.
     *
     * @generated from field: string label = 1;
     */
    label?: string;
    /**
     * Raw count or fraction; normalized by the widget.
     *
     * @generated from field: double value = 2;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Semantic color hint. Recognized: "ok", "warn", "danger", "info",
     * "muted". Free-form names map to the dashboard's palette.
     *
     * @generated from field: optional string color = 3;
     */
    color?: string;
};
/**
 * Describes the message medallion.terminal.v1.DistributionSlice.
 * Use `create(DistributionSliceSchema)` to create a new message.
 */
export declare const DistributionSliceSchema: GenMessage<DistributionSlice, {
    jsonType: DistributionSliceJson;
}>;
/**
 * --- Order Book ---
 * Use for: bid/ask depth at multiple price levels.
 * Examples: crypto exchange order books, prediction market yes/no
 * books, options bid/ask ladders, NBBO views.
 *
 * JSON example:
 *   { "bids": [
 *       { "price": 67840, "size": 0.42 },
 *       { "price": 67830, "size": 1.10 },
 *       { "price": 67820, "size": 2.85 }
 *     ],
 *     "asks": [
 *       { "price": 67850, "size": 0.30 },
 *       { "price": 67860, "size": 0.95 },
 *       { "price": 67870, "size": 2.40 }
 *     ],
 *     "mid": 67845, "spread": 10 }
 *
 * Convention: bids sorted high→low, asks sorted low→high.
 *
 * @generated from message medallion.terminal.v1.OrderBookPayload
 */
export type OrderBookPayload = Message<"medallion.terminal.v1.OrderBookPayload"> & {
    /**
     * Buy side, sorted high to low.
     *
     * @generated from field: repeated medallion.terminal.v1.OrderLevel bids = 1;
     */
    bids: OrderLevel[];
    /**
     * Sell side, sorted low to high.
     *
     * @generated from field: repeated medallion.terminal.v1.OrderLevel asks = 2;
     */
    asks: OrderLevel[];
    /**
     * Mid price (auto-computed if absent).
     *
     * @generated from field: optional double mid = 3;
     */
    mid?: number | undefined;
    /**
     * Bid/ask spread (auto-computed if absent).
     *
     * @generated from field: optional double spread = 4;
     */
    spread?: number | undefined;
    /**
     * Optional venue name when comparing across exchanges.
     *
     * @generated from field: optional string venue = 5;
     */
    venue?: string | undefined;
};
/**
 * --- Order Book ---
 * Use for: bid/ask depth at multiple price levels.
 * Examples: crypto exchange order books, prediction market yes/no
 * books, options bid/ask ladders, NBBO views.
 *
 * JSON example:
 *   { "bids": [
 *       { "price": 67840, "size": 0.42 },
 *       { "price": 67830, "size": 1.10 },
 *       { "price": 67820, "size": 2.85 }
 *     ],
 *     "asks": [
 *       { "price": 67850, "size": 0.30 },
 *       { "price": 67860, "size": 0.95 },
 *       { "price": 67870, "size": 2.40 }
 *     ],
 *     "mid": 67845, "spread": 10 }
 *
 * Convention: bids sorted high→low, asks sorted low→high.
 *
 * @generated from message medallion.terminal.v1.OrderBookPayload
 */
export type OrderBookPayloadJson = {
    /**
     * Buy side, sorted high to low.
     *
     * @generated from field: repeated medallion.terminal.v1.OrderLevel bids = 1;
     */
    bids?: OrderLevelJson[];
    /**
     * Sell side, sorted low to high.
     *
     * @generated from field: repeated medallion.terminal.v1.OrderLevel asks = 2;
     */
    asks?: OrderLevelJson[];
    /**
     * Mid price (auto-computed if absent).
     *
     * @generated from field: optional double mid = 3;
     */
    mid?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Bid/ask spread (auto-computed if absent).
     *
     * @generated from field: optional double spread = 4;
     */
    spread?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Optional venue name when comparing across exchanges.
     *
     * @generated from field: optional string venue = 5;
     */
    venue?: string;
};
/**
 * Describes the message medallion.terminal.v1.OrderBookPayload.
 * Use `create(OrderBookPayloadSchema)` to create a new message.
 */
export declare const OrderBookPayloadSchema: GenMessage<OrderBookPayload, {
    jsonType: OrderBookPayloadJson;
}>;
/**
 * One price level on either side of the book.
 *
 * @generated from message medallion.terminal.v1.OrderLevel
 */
export type OrderLevel = Message<"medallion.terminal.v1.OrderLevel"> & {
    /**
     * Price of this level.
     *
     * @generated from field: double price = 1;
     */
    price: number;
    /**
     * Total quantity resting at this price.
     *
     * @generated from field: double size = 2;
     */
    size: number;
    /**
     * Optional total at this level (sum of orders).
     *
     * @generated from field: optional int32 orders = 3;
     */
    orders?: number | undefined;
};
/**
 * One price level on either side of the book.
 *
 * @generated from message medallion.terminal.v1.OrderLevel
 */
export type OrderLevelJson = {
    /**
     * Price of this level.
     *
     * @generated from field: double price = 1;
     */
    price?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Total quantity resting at this price.
     *
     * @generated from field: double size = 2;
     */
    size?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Optional total at this level (sum of orders).
     *
     * @generated from field: optional int32 orders = 3;
     */
    orders?: number;
};
/**
 * Describes the message medallion.terminal.v1.OrderLevel.
 * Use `create(OrderLevelSchema)` to create a new message.
 */
export declare const OrderLevelSchema: GenMessage<OrderLevel, {
    jsonType: OrderLevelJson;
}>;
/**
 * --- Paired Grid ---
 * Use for: side-by-side comparison of two columns at every numeric
 * row key. Pure "left vs right at key" lattice — the payload
 * declares which numeric measures it carries; the widget renders
 * whatever the backend declared.
 *
 * Examples:
 *   * Options chain: rows keyed by strike, measures bid/ask/iv/delta,
 *     left=calls, right=puts.
 *   * Sportsbook ladder: rows keyed by line, measures odds/hold,
 *     left=home, right=away.
 *   * Prediction market: rows keyed by threshold, measures yes/no_price,
 *     left=YES, right=NO.
 *   * A/B test by percentile: rows keyed by percentile, measures
 *     mean/p_value, left=A, right=B.
 *
 * JSON example (options chain):
 *   { "subject": "BTC", "dimension": "2026-06-27", "subject_value": 67842,
 *     "left_label": "Calls", "right_label": "Puts", "key_label": "Strike",
 *     "measures": [
 *       { "key": "iv",    "label": "IV",  "format": "percent" },
 *       { "key": "delta", "label": "Δ" },
 *       { "key": "bid",   "label": "Bid", "format": "compact" },
 *       { "key": "ask",   "label": "Ask", "format": "compact" }
 *     ],
 *     "rows": [
 *       { "key": 65000,
 *         "left":  { "values": { "iv": 0.62, "delta":  0.74, "bid": 4200, "ask": 4250 } },
 *         "right": { "values": { "iv": 0.58, "delta": -0.26, "bid":  280, "ask":  310 } } }
 *   ]}
 *
 * JSON example (sportsbook spread ladder):
 *   { "subject": "Lakers vs Celtics", "dimension": "Spread",
 *     "left_label": "Lakers", "right_label": "Celtics", "key_label": "Line",
 *     "measures": [{ "key": "odds", "label": "Odds" }],
 *     "rows": [
 *       { "key": -3.5, "left": { "values": { "odds": 1.91 } }, "right": { "values": { "odds": 1.95 } } },
 *       { "key":  3.5, "left": { "values": { "odds": 2.05 } }, "right": { "values": { "odds": 1.81 } } }
 *   ]}
 *
 * Cross-venue comparison: emit one PairedGridPayload per venue and
 * arrange them side-by-side via the dashboard grid; or use a Table
 * widget with explicit venue columns for direct best-quote comparison.
 *
 * @generated from message medallion.terminal.v1.PairedGridPayload
 */
export type PairedGridPayload = Message<"medallion.terminal.v1.PairedGridPayload"> & {
    /**
     * What this grid is about. Free-form (ticker, match name, A/B test
     * label). Surfaced in the header.
     *
     * @generated from field: string subject = 1;
     */
    subject: string;
    /**
     * Free-form qualifier (option expiry "2026-06-27", market line type
     * "spread", test variant axis "p50/p95/p99"). Surfaced as a subtitle.
     *
     * @generated from field: string dimension = 2;
     */
    dimension: string;
    /**
     * Headline number for the subject (option underlying spot price,
     * current score, baseline metric). Used to highlight the closest
     * row in the grid (ATM, current line, etc.).
     *
     * @generated from field: optional double subject_value = 3;
     */
    subjectValue?: number | undefined;
    /**
     * Optional venue name (e.g. "deribit", "draftkings"). Useful when
     * the dashboard shows multiple grids side-by-side.
     *
     * @generated from field: optional string venue = 4;
     */
    venue?: string | undefined;
    /**
     * The lattice rows, one per key.
     *
     * @generated from field: repeated medallion.terminal.v1.PairedRow rows = 5;
     */
    rows: PairedRow[];
    /**
     * Header labels for the two columns. Default: "Left" / "Right".
     * Use to surface domain meaning (e.g. "Calls" / "Puts", "Home" /
     * "Away", "YES" / "NO") without forcing the proto to know the domain.
     *
     * @generated from field: optional string left_label = 6;
     */
    leftLabel?: string | undefined;
    /**
     * Header label for the right column. Default: "Right".
     *
     * @generated from field: optional string right_label = 7;
     */
    rightLabel?: string | undefined;
    /**
     * Header label for the row key column. Default: "Key".
     * Use to label the lattice (e.g. "Strike", "Line", "Percentile").
     *
     * @generated from field: optional string key_label = 8;
     */
    keyLabel?: string | undefined;
    /**
     * Declared measures — the numeric columns the backend carries on
     * each side. Order is render order. If empty, the widget unions the
     * keys it sees on row sides (best-effort, formats default to number).
     *
     * @generated from field: repeated medallion.terminal.v1.PairedMeasure measures = 9;
     */
    measures: PairedMeasure[];
};
/**
 * --- Paired Grid ---
 * Use for: side-by-side comparison of two columns at every numeric
 * row key. Pure "left vs right at key" lattice — the payload
 * declares which numeric measures it carries; the widget renders
 * whatever the backend declared.
 *
 * Examples:
 *   * Options chain: rows keyed by strike, measures bid/ask/iv/delta,
 *     left=calls, right=puts.
 *   * Sportsbook ladder: rows keyed by line, measures odds/hold,
 *     left=home, right=away.
 *   * Prediction market: rows keyed by threshold, measures yes/no_price,
 *     left=YES, right=NO.
 *   * A/B test by percentile: rows keyed by percentile, measures
 *     mean/p_value, left=A, right=B.
 *
 * JSON example (options chain):
 *   { "subject": "BTC", "dimension": "2026-06-27", "subject_value": 67842,
 *     "left_label": "Calls", "right_label": "Puts", "key_label": "Strike",
 *     "measures": [
 *       { "key": "iv",    "label": "IV",  "format": "percent" },
 *       { "key": "delta", "label": "Δ" },
 *       { "key": "bid",   "label": "Bid", "format": "compact" },
 *       { "key": "ask",   "label": "Ask", "format": "compact" }
 *     ],
 *     "rows": [
 *       { "key": 65000,
 *         "left":  { "values": { "iv": 0.62, "delta":  0.74, "bid": 4200, "ask": 4250 } },
 *         "right": { "values": { "iv": 0.58, "delta": -0.26, "bid":  280, "ask":  310 } } }
 *   ]}
 *
 * JSON example (sportsbook spread ladder):
 *   { "subject": "Lakers vs Celtics", "dimension": "Spread",
 *     "left_label": "Lakers", "right_label": "Celtics", "key_label": "Line",
 *     "measures": [{ "key": "odds", "label": "Odds" }],
 *     "rows": [
 *       { "key": -3.5, "left": { "values": { "odds": 1.91 } }, "right": { "values": { "odds": 1.95 } } },
 *       { "key":  3.5, "left": { "values": { "odds": 2.05 } }, "right": { "values": { "odds": 1.81 } } }
 *   ]}
 *
 * Cross-venue comparison: emit one PairedGridPayload per venue and
 * arrange them side-by-side via the dashboard grid; or use a Table
 * widget with explicit venue columns for direct best-quote comparison.
 *
 * @generated from message medallion.terminal.v1.PairedGridPayload
 */
export type PairedGridPayloadJson = {
    /**
     * What this grid is about. Free-form (ticker, match name, A/B test
     * label). Surfaced in the header.
     *
     * @generated from field: string subject = 1;
     */
    subject?: string;
    /**
     * Free-form qualifier (option expiry "2026-06-27", market line type
     * "spread", test variant axis "p50/p95/p99"). Surfaced as a subtitle.
     *
     * @generated from field: string dimension = 2;
     */
    dimension?: string;
    /**
     * Headline number for the subject (option underlying spot price,
     * current score, baseline metric). Used to highlight the closest
     * row in the grid (ATM, current line, etc.).
     *
     * @generated from field: optional double subject_value = 3;
     */
    subjectValue?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Optional venue name (e.g. "deribit", "draftkings"). Useful when
     * the dashboard shows multiple grids side-by-side.
     *
     * @generated from field: optional string venue = 4;
     */
    venue?: string;
    /**
     * The lattice rows, one per key.
     *
     * @generated from field: repeated medallion.terminal.v1.PairedRow rows = 5;
     */
    rows?: PairedRowJson[];
    /**
     * Header labels for the two columns. Default: "Left" / "Right".
     * Use to surface domain meaning (e.g. "Calls" / "Puts", "Home" /
     * "Away", "YES" / "NO") without forcing the proto to know the domain.
     *
     * @generated from field: optional string left_label = 6;
     */
    leftLabel?: string;
    /**
     * Header label for the right column. Default: "Right".
     *
     * @generated from field: optional string right_label = 7;
     */
    rightLabel?: string;
    /**
     * Header label for the row key column. Default: "Key".
     * Use to label the lattice (e.g. "Strike", "Line", "Percentile").
     *
     * @generated from field: optional string key_label = 8;
     */
    keyLabel?: string;
    /**
     * Declared measures — the numeric columns the backend carries on
     * each side. Order is render order. If empty, the widget unions the
     * keys it sees on row sides (best-effort, formats default to number).
     *
     * @generated from field: repeated medallion.terminal.v1.PairedMeasure measures = 9;
     */
    measures?: PairedMeasureJson[];
};
/**
 * Describes the message medallion.terminal.v1.PairedGridPayload.
 * Use `create(PairedGridPayloadSchema)` to create a new message.
 */
export declare const PairedGridPayloadSchema: GenMessage<PairedGridPayload, {
    jsonType: PairedGridPayloadJson;
}>;
/**
 * One row of the paired grid, keyed by a numeric lattice value.
 *
 * @generated from message medallion.terminal.v1.PairedRow
 */
export type PairedRow = Message<"medallion.terminal.v1.PairedRow"> & {
    /**
     * Row identifier — strike, line, percentile, threshold. Numeric so
     * the renderer can sort and compute proximity to subject_value.
     *
     * @generated from field: double key = 1;
     */
    key: number;
    /**
     * Left-side values. Absent = no data on this side at this key.
     *
     * @generated from field: optional medallion.terminal.v1.PairedSide left = 2;
     */
    left?: PairedSide | undefined;
    /**
     * Right-side values. Absent = no data on this side at this key.
     *
     * @generated from field: optional medallion.terminal.v1.PairedSide right = 3;
     */
    right?: PairedSide | undefined;
};
/**
 * One row of the paired grid, keyed by a numeric lattice value.
 *
 * @generated from message medallion.terminal.v1.PairedRow
 */
export type PairedRowJson = {
    /**
     * Row identifier — strike, line, percentile, threshold. Numeric so
     * the renderer can sort and compute proximity to subject_value.
     *
     * @generated from field: double key = 1;
     */
    key?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Left-side values. Absent = no data on this side at this key.
     *
     * @generated from field: optional medallion.terminal.v1.PairedSide left = 2;
     */
    left?: PairedSideJson;
    /**
     * Right-side values. Absent = no data on this side at this key.
     *
     * @generated from field: optional medallion.terminal.v1.PairedSide right = 3;
     */
    right?: PairedSideJson;
};
/**
 * Describes the message medallion.terminal.v1.PairedRow.
 * Use `create(PairedRowSchema)` to create a new message.
 */
export declare const PairedRowSchema: GenMessage<PairedRow, {
    jsonType: PairedRowJson;
}>;
/**
 * PairedSide — one side of a paired row. Pure value bag, keyed by
 * PairedMeasure.key. No typed fields — everything domain-specific
 * (bid/ask/iv/odds/p_value) is declared via `measures`.
 *
 * @generated from message medallion.terminal.v1.PairedSide
 */
export type PairedSide = Message<"medallion.terminal.v1.PairedSide"> & {
    /**
     * Measure values keyed by PairedMeasure.key.
     *
     * @generated from field: map<string, double> values = 1;
     */
    values: {
        [key: string]: number;
    };
};
/**
 * PairedSide — one side of a paired row. Pure value bag, keyed by
 * PairedMeasure.key. No typed fields — everything domain-specific
 * (bid/ask/iv/odds/p_value) is declared via `measures`.
 *
 * @generated from message medallion.terminal.v1.PairedSide
 */
export type PairedSideJson = {
    /**
     * Measure values keyed by PairedMeasure.key.
     *
     * @generated from field: map<string, double> values = 1;
     */
    values?: {
        [key: string]: number | "NaN" | "Infinity" | "-Infinity";
    };
};
/**
 * Describes the message medallion.terminal.v1.PairedSide.
 * Use `create(PairedSideSchema)` to create a new message.
 */
export declare const PairedSideSchema: GenMessage<PairedSide, {
    jsonType: PairedSideJson;
}>;
/**
 * PairedMeasure — declares one numeric column that appears on both
 * sides of the grid. The widget renders measures in declared order.
 *
 * @generated from message medallion.terminal.v1.PairedMeasure
 */
export type PairedMeasure = Message<"medallion.terminal.v1.PairedMeasure"> & {
    /**
     * Field key — matches PairedSide.values map keys.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Display label (header text). Defaults to `key` if omitted.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Optional format hint. Recognized: "number" (default), "percent",
     * "compact" (1.2K, 3.4M), "currency", "currency:USD", "delta".
     *
     * @generated from field: optional string format = 3;
     */
    format?: string | undefined;
};
/**
 * PairedMeasure — declares one numeric column that appears on both
 * sides of the grid. The widget renders measures in declared order.
 *
 * @generated from message medallion.terminal.v1.PairedMeasure
 */
export type PairedMeasureJson = {
    /**
     * Field key — matches PairedSide.values map keys.
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Display label (header text). Defaults to `key` if omitted.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Optional format hint. Recognized: "number" (default), "percent",
     * "compact" (1.2K, 3.4M), "currency", "currency:USD", "delta".
     *
     * @generated from field: optional string format = 3;
     */
    format?: string;
};
/**
 * Describes the message medallion.terminal.v1.PairedMeasure.
 * Use `create(PairedMeasureSchema)` to create a new message.
 */
export declare const PairedMeasureSchema: GenMessage<PairedMeasure, {
    jsonType: PairedMeasureJson;
}>;
/**
 * --- Geospatial ---
 * Use for: operational sites, vehicles, routes, service territories,
 * facilities, incidents, and any other point/line/polygon projection.
 *
 * `geometry` follows the GeoJSON Geometry object contract:
 *   { "type": "Point", "coordinates": [-122.4, 37.8] }
 *   { "type": "LineString", "coordinates": [[...], [...]] }
 *   { "type": "Polygon", "coordinates": [[[...], ...]] }
 *
 * Keeping geometry as Struct preserves the standard GeoJSON vocabulary
 * without rebuilding every geometry union in protobuf. The frontend also
 * accepts a raw GeoJSON FeatureCollection as an inline/url convenience.
 *
 * @generated from message medallion.terminal.v1.GeoPayload
 */
export type GeoPayload = Message<"medallion.terminal.v1.GeoPayload"> & {
    /**
     * The features to render on the map.
     *
     * @generated from field: repeated medallion.terminal.v1.GeoFeature features = 1;
     */
    features: GeoFeature[];
};
/**
 * --- Geospatial ---
 * Use for: operational sites, vehicles, routes, service territories,
 * facilities, incidents, and any other point/line/polygon projection.
 *
 * `geometry` follows the GeoJSON Geometry object contract:
 *   { "type": "Point", "coordinates": [-122.4, 37.8] }
 *   { "type": "LineString", "coordinates": [[...], [...]] }
 *   { "type": "Polygon", "coordinates": [[[...], ...]] }
 *
 * Keeping geometry as Struct preserves the standard GeoJSON vocabulary
 * without rebuilding every geometry union in protobuf. The frontend also
 * accepts a raw GeoJSON FeatureCollection as an inline/url convenience.
 *
 * @generated from message medallion.terminal.v1.GeoPayload
 */
export type GeoPayloadJson = {
    /**
     * The features to render on the map.
     *
     * @generated from field: repeated medallion.terminal.v1.GeoFeature features = 1;
     */
    features?: GeoFeatureJson[];
};
/**
 * Describes the message medallion.terminal.v1.GeoPayload.
 * Use `create(GeoPayloadSchema)` to create a new message.
 */
export declare const GeoPayloadSchema: GenMessage<GeoPayload, {
    jsonType: GeoPayloadJson;
}>;
/**
 * One point/line/polygon feature on the map.
 *
 * @generated from message medallion.terminal.v1.GeoFeature
 */
export type GeoFeature = Message<"medallion.terminal.v1.GeoFeature"> & {
    /**
     * Stable feature identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display name shown on hover/selection.
     *
     * @generated from field: optional string label = 2;
     */
    label?: string | undefined;
    /**
     * GeoJSON Geometry object (Point, LineString, Polygon, ...).
     *
     * @generated from field: google.protobuf.Struct geometry = 3;
     */
    geometry?: JsonObject | undefined;
    /**
     * Optional scalar used to scale point markers.
     *
     * @generated from field: optional double value = 4;
     */
    value?: number | undefined;
    /**
     * Free-form lifecycle/health value mapped to semantic theme colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string | undefined;
    /**
     * Additional structured metadata shown in the detail panel.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 6;
     */
    metadata?: JsonObject | undefined;
    /**
     * Applied when the feature is selected.
     *
     * @generated from field: map<string, string> context = 7;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One point/line/polygon feature on the map.
 *
 * @generated from message medallion.terminal.v1.GeoFeature
 */
export type GeoFeatureJson = {
    /**
     * Stable feature identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display name shown on hover/selection.
     *
     * @generated from field: optional string label = 2;
     */
    label?: string;
    /**
     * GeoJSON Geometry object (Point, LineString, Polygon, ...).
     *
     * @generated from field: google.protobuf.Struct geometry = 3;
     */
    geometry?: StructJson;
    /**
     * Optional scalar used to scale point markers.
     *
     * @generated from field: optional double value = 4;
     */
    value?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * Free-form lifecycle/health value mapped to semantic theme colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string;
    /**
     * Additional structured metadata shown in the detail panel.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 6;
     */
    metadata?: StructJson;
    /**
     * Applied when the feature is selected.
     *
     * @generated from field: map<string, string> context = 7;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.GeoFeature.
 * Use `create(GeoFeatureSchema)` to create a new message.
 */
export declare const GeoFeatureSchema: GenMessage<GeoFeature, {
    jsonType: GeoFeatureJson;
}>;
/**
 * --- Media Library ---
 * Use for: authorized photo/video timelines, albums, campaign assets,
 * inspection footage, creative libraries, and other visual archives.
 *
 * The payload carries presentation metadata and durable URLs only. Binary
 * storage, upload, transcoding, search/indexing, sharing, retention, and
 * authorization remain backend responsibilities. Video URLs should support
 * HTTP Range requests so native players can seek efficiently.
 *
 * JSON example:
 *   {
 *     "items": [
 *       {
 *         "id": "media-104",
 *         "title": "Warehouse walkthrough",
 *         "kind": "MEDIA_KIND_VIDEO",
 *         "url": "/media/warehouse-walkthrough.mp4",
 *         "thumbnail_url": "/media/warehouse-walkthrough.jpg",
 *         "captured_at": "2026-07-12T18:42:00Z",
 *         "duration_seconds": 82,
 *         "collection_ids": ["operations"],
 *         "context": { "media_id": "media-104" }
 *       }
 *     ],
 *     "collections": [
 *       { "id": "operations", "name": "Operations" }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.MediaPayload
 */
export type MediaPayload = Message<"medallion.terminal.v1.MediaPayload"> & {
    /**
     * The media items in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.MediaItem items = 1;
     */
    items: MediaItem[];
    /**
     * Collection catalog referenced by MediaItem.collection_ids.
     *
     * @generated from field: repeated medallion.terminal.v1.MediaCollection collections = 2;
     */
    collections: MediaCollection[];
    /**
     * Total matches before pagination/filtering, when known.
     *
     * @generated from field: optional int64 total = 3;
     */
    total?: bigint | undefined;
    /**
     * Opaque cursor for a subsequent page.
     *
     * @generated from field: optional string next_page_token = 4;
     */
    nextPageToken?: string | undefined;
};
/**
 * --- Media Library ---
 * Use for: authorized photo/video timelines, albums, campaign assets,
 * inspection footage, creative libraries, and other visual archives.
 *
 * The payload carries presentation metadata and durable URLs only. Binary
 * storage, upload, transcoding, search/indexing, sharing, retention, and
 * authorization remain backend responsibilities. Video URLs should support
 * HTTP Range requests so native players can seek efficiently.
 *
 * JSON example:
 *   {
 *     "items": [
 *       {
 *         "id": "media-104",
 *         "title": "Warehouse walkthrough",
 *         "kind": "MEDIA_KIND_VIDEO",
 *         "url": "/media/warehouse-walkthrough.mp4",
 *         "thumbnail_url": "/media/warehouse-walkthrough.jpg",
 *         "captured_at": "2026-07-12T18:42:00Z",
 *         "duration_seconds": 82,
 *         "collection_ids": ["operations"],
 *         "context": { "media_id": "media-104" }
 *       }
 *     ],
 *     "collections": [
 *       { "id": "operations", "name": "Operations" }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.MediaPayload
 */
export type MediaPayloadJson = {
    /**
     * The media items in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.MediaItem items = 1;
     */
    items?: MediaItemJson[];
    /**
     * Collection catalog referenced by MediaItem.collection_ids.
     *
     * @generated from field: repeated medallion.terminal.v1.MediaCollection collections = 2;
     */
    collections?: MediaCollectionJson[];
    /**
     * Total matches before pagination/filtering, when known.
     *
     * @generated from field: optional int64 total = 3;
     */
    total?: string;
    /**
     * Opaque cursor for a subsequent page.
     *
     * @generated from field: optional string next_page_token = 4;
     */
    nextPageToken?: string;
};
/**
 * Describes the message medallion.terminal.v1.MediaPayload.
 * Use `create(MediaPayloadSchema)` to create a new message.
 */
export declare const MediaPayloadSchema: GenMessage<MediaPayload, {
    jsonType: MediaPayloadJson;
}>;
/**
 * One image or video in the library.
 *
 * @generated from message medallion.terminal.v1.MediaItem
 */
export type MediaItem = Message<"medallion.terminal.v1.MediaItem"> & {
    /**
     * Stable item identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display title.
     *
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * Image or video.
     *
     * @generated from field: medallion.terminal.v1.MediaKind kind = 3;
     */
    kind: MediaKind;
    /**
     * Authorized original/playback URL.
     *
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * Small preview/poster URL. Recommended for videos and large originals.
     *
     * @generated from field: optional string thumbnail_url = 5;
     */
    thumbnailUrl?: string | undefined;
    /**
     * Optional longer description.
     *
     * @generated from field: optional string description = 6;
     */
    description?: string | undefined;
    /**
     * ISO 8601 capture and ingest timestamps.
     *
     * @generated from field: optional string captured_at = 7;
     */
    capturedAt?: string | undefined;
    /**
     * ISO 8601 ingest timestamp.
     *
     * @generated from field: optional string created_at = 8;
     */
    createdAt?: string | undefined;
    /**
     * MIME type (e.g. "image/jpeg", "video/mp4").
     *
     * @generated from field: optional string content_type = 9;
     */
    contentType?: string | undefined;
    /**
     * Pixel width of the original, when known.
     *
     * @generated from field: optional uint32 width = 10;
     */
    width?: number | undefined;
    /**
     * Pixel height of the original, when known.
     *
     * @generated from field: optional uint32 height = 11;
     */
    height?: number | undefined;
    /**
     * Video duration in seconds.
     *
     * @generated from field: optional double duration_seconds = 12;
     */
    durationSeconds?: number | undefined;
    /**
     * True if the viewer favorited this item.
     *
     * @generated from field: bool favorite = 13;
     */
    favorite: boolean;
    /**
     * Free-form tags for filtering and search.
     *
     * @generated from field: repeated string tags = 14;
     */
    tags: string[];
    /**
     * Collections this item belongs to (MediaCollection.id).
     *
     * @generated from field: repeated string collection_ids = 15;
     */
    collectionIds: string[];
    /**
     * Additional structured metadata (camera, location, etc.).
     *
     * @generated from field: optional google.protobuf.Struct metadata = 16;
     */
    metadata?: JsonObject | undefined;
    /**
     * Applied when the item is selected.
     *
     * @generated from field: map<string, string> context = 17;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One image or video in the library.
 *
 * @generated from message medallion.terminal.v1.MediaItem
 */
export type MediaItemJson = {
    /**
     * Stable item identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display title.
     *
     * @generated from field: string title = 2;
     */
    title?: string;
    /**
     * Image or video.
     *
     * @generated from field: medallion.terminal.v1.MediaKind kind = 3;
     */
    kind?: MediaKindJson;
    /**
     * Authorized original/playback URL.
     *
     * @generated from field: string url = 4;
     */
    url?: string;
    /**
     * Small preview/poster URL. Recommended for videos and large originals.
     *
     * @generated from field: optional string thumbnail_url = 5;
     */
    thumbnailUrl?: string;
    /**
     * Optional longer description.
     *
     * @generated from field: optional string description = 6;
     */
    description?: string;
    /**
     * ISO 8601 capture and ingest timestamps.
     *
     * @generated from field: optional string captured_at = 7;
     */
    capturedAt?: string;
    /**
     * ISO 8601 ingest timestamp.
     *
     * @generated from field: optional string created_at = 8;
     */
    createdAt?: string;
    /**
     * MIME type (e.g. "image/jpeg", "video/mp4").
     *
     * @generated from field: optional string content_type = 9;
     */
    contentType?: string;
    /**
     * Pixel width of the original, when known.
     *
     * @generated from field: optional uint32 width = 10;
     */
    width?: number;
    /**
     * Pixel height of the original, when known.
     *
     * @generated from field: optional uint32 height = 11;
     */
    height?: number;
    /**
     * Video duration in seconds.
     *
     * @generated from field: optional double duration_seconds = 12;
     */
    durationSeconds?: number | "NaN" | "Infinity" | "-Infinity";
    /**
     * True if the viewer favorited this item.
     *
     * @generated from field: bool favorite = 13;
     */
    favorite?: boolean;
    /**
     * Free-form tags for filtering and search.
     *
     * @generated from field: repeated string tags = 14;
     */
    tags?: string[];
    /**
     * Collections this item belongs to (MediaCollection.id).
     *
     * @generated from field: repeated string collection_ids = 15;
     */
    collectionIds?: string[];
    /**
     * Additional structured metadata (camera, location, etc.).
     *
     * @generated from field: optional google.protobuf.Struct metadata = 16;
     */
    metadata?: StructJson;
    /**
     * Applied when the item is selected.
     *
     * @generated from field: map<string, string> context = 17;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.MediaItem.
 * Use `create(MediaItemSchema)` to create a new message.
 */
export declare const MediaItemSchema: GenMessage<MediaItem, {
    jsonType: MediaItemJson;
}>;
/**
 * A named collection/album of media items.
 *
 * @generated from message medallion.terminal.v1.MediaCollection
 */
export type MediaCollection = Message<"medallion.terminal.v1.MediaCollection"> & {
    /**
     * Stable collection identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * Optional cover image URL.
     *
     * @generated from field: optional string cover_url = 3;
     */
    coverUrl?: string | undefined;
    /**
     * Number of items, when known.
     *
     * @generated from field: optional int64 item_count = 4;
     */
    itemCount?: bigint | undefined;
    /**
     * Applied when the collection is selected.
     *
     * @generated from field: map<string, string> context = 5;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * A named collection/album of media items.
 *
 * @generated from message medallion.terminal.v1.MediaCollection
 */
export type MediaCollectionJson = {
    /**
     * Stable collection identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * Optional cover image URL.
     *
     * @generated from field: optional string cover_url = 3;
     */
    coverUrl?: string;
    /**
     * Number of items, when known.
     *
     * @generated from field: optional int64 item_count = 4;
     */
    itemCount?: string;
    /**
     * Applied when the collection is selected.
     *
     * @generated from field: map<string, string> context = 5;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.MediaCollection.
 * Use `create(MediaCollectionSchema)` to create a new message.
 */
export declare const MediaCollectionSchema: GenMessage<MediaCollection, {
    jsonType: MediaCollectionJson;
}>;
/**
 * --- Embed ---
 * Use for: pointing the `image` or `iframe` widget at a URL that
 * changes with context. Lets a Connect backend swap an AI-generated
 * chart, a per-symbol screenshot, or an embedded third-party widget
 * without forcing the dashboard to use the `url` escape hatch.
 *
 * JSON example (image):
 *   { "url": "https://charts.example.com/btc.png", "label": "BTC, 1h" }
 *
 * JSON example (iframe with sandbox override):
 *   { "url": "https://charts.example.com/embed",
 *     "label": "Candlestick BTC",
 *     "sandbox": "allow-scripts" }
 *
 * @generated from message medallion.terminal.v1.EmbedPayload
 */
export type EmbedPayload = Message<"medallion.terminal.v1.EmbedPayload"> & {
    /**
     * The URL the widget renders. For `image`, src; for `iframe`, src.
     *
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * Display label. Image: alt text. Iframe: title.
     *
     * @generated from field: optional string label = 2;
     */
    label?: string | undefined;
    /**
     * Iframe-only override of the sandbox attribute. Ignored by image.
     *
     * @generated from field: optional string sandbox = 3;
     */
    sandbox?: string | undefined;
};
/**
 * --- Embed ---
 * Use for: pointing the `image` or `iframe` widget at a URL that
 * changes with context. Lets a Connect backend swap an AI-generated
 * chart, a per-symbol screenshot, or an embedded third-party widget
 * without forcing the dashboard to use the `url` escape hatch.
 *
 * JSON example (image):
 *   { "url": "https://charts.example.com/btc.png", "label": "BTC, 1h" }
 *
 * JSON example (iframe with sandbox override):
 *   { "url": "https://charts.example.com/embed",
 *     "label": "Candlestick BTC",
 *     "sandbox": "allow-scripts" }
 *
 * @generated from message medallion.terminal.v1.EmbedPayload
 */
export type EmbedPayloadJson = {
    /**
     * The URL the widget renders. For `image`, src; for `iframe`, src.
     *
     * @generated from field: string url = 1;
     */
    url?: string;
    /**
     * Display label. Image: alt text. Iframe: title.
     *
     * @generated from field: optional string label = 2;
     */
    label?: string;
    /**
     * Iframe-only override of the sandbox attribute. Ignored by image.
     *
     * @generated from field: optional string sandbox = 3;
     */
    sandbox?: string;
};
/**
 * Describes the message medallion.terminal.v1.EmbedPayload.
 * Use `create(EmbedPayloadSchema)` to create a new message.
 */
export declare const EmbedPayloadSchema: GenMessage<EmbedPayload, {
    jsonType: EmbedPayloadJson;
}>;
/**
 * --- Text ---
 * Use for: news feeds, AI summaries, articles, alerts.
 *
 * JSON example:
 *   { "items": [
 *       { "title": "Bitcoin breaks $73K", "body": "...",
 *         "source": "Market Wire", "date": "2026-04-14",
 *         "tags": ["BTC", "ETF"], "sentiment": 0.6 },
 *       { "title": "Daily summary", "body": "Markets rallied..." }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.TextPayload
 */
export type TextPayload = Message<"medallion.terminal.v1.TextPayload"> & {
    /**
     * The text items in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.TextItem items = 1;
     */
    items: TextItem[];
};
/**
 * --- Text ---
 * Use for: news feeds, AI summaries, articles, alerts.
 *
 * JSON example:
 *   { "items": [
 *       { "title": "Bitcoin breaks $73K", "body": "...",
 *         "source": "Market Wire", "date": "2026-04-14",
 *         "tags": ["BTC", "ETF"], "sentiment": 0.6 },
 *       { "title": "Daily summary", "body": "Markets rallied..." }
 *   ]}
 *
 * @generated from message medallion.terminal.v1.TextPayload
 */
export type TextPayloadJson = {
    /**
     * The text items in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.TextItem items = 1;
     */
    items?: TextItemJson[];
};
/**
 * Describes the message medallion.terminal.v1.TextPayload.
 * Use `create(TextPayloadSchema)` to create a new message.
 */
export declare const TextPayloadSchema: GenMessage<TextPayload, {
    jsonType: TextPayloadJson;
}>;
/**
 * One article, headline, summary, or alert.
 *
 * @generated from message medallion.terminal.v1.TextItem
 */
export type TextItem = Message<"medallion.terminal.v1.TextItem"> & {
    /**
     * Headline.
     *
     * @generated from field: optional string title = 1;
     */
    title?: string | undefined;
    /**
     * Body text.
     *
     * @generated from field: optional string body = 2;
     */
    body?: string | undefined;
    /**
     * Attribution (publication, author handle, model name, etc.).
     *
     * @generated from field: optional string source = 3;
     */
    source?: string | undefined;
    /**
     * Display date string. Free-form (e.g. "Mar 14", "2 hours ago").
     *
     * @generated from field: optional string date = 4;
     */
    date?: string | undefined;
    /**
     * Author name or handle.
     *
     * @generated from field: optional string author = 5;
     */
    author?: string | undefined;
    /**
     * Free-form tags shown as chips.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags: string[];
    /**
     * Optional link the item references.
     *
     * @generated from field: optional string url = 7;
     */
    url?: string | undefined;
    /**
     * Optional sentiment score in [-1, 1]. Used to color the item.
     *
     * @generated from field: optional double sentiment = 8;
     */
    sentiment?: number | undefined;
};
/**
 * One article, headline, summary, or alert.
 *
 * @generated from message medallion.terminal.v1.TextItem
 */
export type TextItemJson = {
    /**
     * Headline.
     *
     * @generated from field: optional string title = 1;
     */
    title?: string;
    /**
     * Body text.
     *
     * @generated from field: optional string body = 2;
     */
    body?: string;
    /**
     * Attribution (publication, author handle, model name, etc.).
     *
     * @generated from field: optional string source = 3;
     */
    source?: string;
    /**
     * Display date string. Free-form (e.g. "Mar 14", "2 hours ago").
     *
     * @generated from field: optional string date = 4;
     */
    date?: string;
    /**
     * Author name or handle.
     *
     * @generated from field: optional string author = 5;
     */
    author?: string;
    /**
     * Free-form tags shown as chips.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags?: string[];
    /**
     * Optional link the item references.
     *
     * @generated from field: optional string url = 7;
     */
    url?: string;
    /**
     * Optional sentiment score in [-1, 1]. Used to color the item.
     *
     * @generated from field: optional double sentiment = 8;
     */
    sentiment?: number | "NaN" | "Infinity" | "-Infinity";
};
/**
 * Describes the message medallion.terminal.v1.TextItem.
 * Use `create(TextItemSchema)` to create a new message.
 */
export declare const TextItemSchema: GenMessage<TextItem, {
    jsonType: TextItemJson;
}>;
/**
 * --- Conversation ---
 * Use for: channel history, direct messaging, customer support threads,
 * human/AI conversations, and other chronological message transcripts.
 *
 * Messages stay product-neutral. `kind` and `status` are intentionally
 * free-form strings so a backend can represent ordinary messages, assistant
 * responses, system notices, tool calls, delivery receipts, or domain-specific
 * states without extending the wire contract.
 *
 * JSON example:
 *   {
 *     "id": "channel-operations",
 *     "title": "operations",
 *     "viewer_id": "user-jun",
 *     "participants": [
 *       { "id": "user-jun", "name": "Jun", "status": "online" },
 *       { "id": "user-maya", "name": "Maya Chen", "status": "away" }
 *     ],
 *     "messages": [
 *       {
 *         "id": "message-104",
 *         "timestamp": "2026-07-18T16:42:00Z",
 *         "sender_id": "user-maya",
 *         "body": "The launch checklist is ready for review.",
 *         "reactions": [{ "key": "check", "label": "✓", "count": 3 }],
 *         "context": { "message_id": "message-104" }
 *       }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.ConversationPayload
 */
export type ConversationPayload = Message<"medallion.terminal.v1.ConversationPayload"> & {
    /**
     * Stable conversation identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Conversation title (channel name, counterparty, subject).
     *
     * @generated from field: optional string title = 2;
     */
    title?: string | undefined;
    /**
     * Secondary line under the title.
     *
     * @generated from field: optional string subtitle = 3;
     */
    subtitle?: string | undefined;
    /**
     * Participant representing the current viewer. Renderers can use this to
     * align the viewer's messages without product-specific "me" conventions.
     *
     * @generated from field: optional string viewer_id = 4;
     */
    viewerId?: string | undefined;
    /**
     * Participant catalog referenced by ConversationMessage.sender_id.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationParticipant participants = 5;
     */
    participants: ConversationParticipant[];
    /**
     * Ordered oldest to newest. Backends should return the visible window in
     * presentation order and use next_page_token for older history.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationMessage messages = 6;
     */
    messages: ConversationMessage[];
    /**
     * Unread messages for the viewer, when known.
     *
     * @generated from field: optional uint32 unread_count = 7;
     */
    unreadCount?: number | undefined;
    /**
     * Opaque cursor for older history.
     *
     * @generated from field: optional string next_page_token = 8;
     */
    nextPageToken?: string | undefined;
    /**
     * Applied when the conversation header is selected.
     *
     * @generated from field: map<string, string> context = 9;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * --- Conversation ---
 * Use for: channel history, direct messaging, customer support threads,
 * human/AI conversations, and other chronological message transcripts.
 *
 * Messages stay product-neutral. `kind` and `status` are intentionally
 * free-form strings so a backend can represent ordinary messages, assistant
 * responses, system notices, tool calls, delivery receipts, or domain-specific
 * states without extending the wire contract.
 *
 * JSON example:
 *   {
 *     "id": "channel-operations",
 *     "title": "operations",
 *     "viewer_id": "user-jun",
 *     "participants": [
 *       { "id": "user-jun", "name": "Jun", "status": "online" },
 *       { "id": "user-maya", "name": "Maya Chen", "status": "away" }
 *     ],
 *     "messages": [
 *       {
 *         "id": "message-104",
 *         "timestamp": "2026-07-18T16:42:00Z",
 *         "sender_id": "user-maya",
 *         "body": "The launch checklist is ready for review.",
 *         "reactions": [{ "key": "check", "label": "✓", "count": 3 }],
 *         "context": { "message_id": "message-104" }
 *       }
 *     ]
 *   }
 *
 * @generated from message medallion.terminal.v1.ConversationPayload
 */
export type ConversationPayloadJson = {
    /**
     * Stable conversation identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Conversation title (channel name, counterparty, subject).
     *
     * @generated from field: optional string title = 2;
     */
    title?: string;
    /**
     * Secondary line under the title.
     *
     * @generated from field: optional string subtitle = 3;
     */
    subtitle?: string;
    /**
     * Participant representing the current viewer. Renderers can use this to
     * align the viewer's messages without product-specific "me" conventions.
     *
     * @generated from field: optional string viewer_id = 4;
     */
    viewerId?: string;
    /**
     * Participant catalog referenced by ConversationMessage.sender_id.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationParticipant participants = 5;
     */
    participants?: ConversationParticipantJson[];
    /**
     * Ordered oldest to newest. Backends should return the visible window in
     * presentation order and use next_page_token for older history.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationMessage messages = 6;
     */
    messages?: ConversationMessageJson[];
    /**
     * Unread messages for the viewer, when known.
     *
     * @generated from field: optional uint32 unread_count = 7;
     */
    unreadCount?: number;
    /**
     * Opaque cursor for older history.
     *
     * @generated from field: optional string next_page_token = 8;
     */
    nextPageToken?: string;
    /**
     * Applied when the conversation header is selected.
     *
     * @generated from field: map<string, string> context = 9;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.ConversationPayload.
 * Use `create(ConversationPayloadSchema)` to create a new message.
 */
export declare const ConversationPayloadSchema: GenMessage<ConversationPayload, {
    jsonType: ConversationPayloadJson;
}>;
/**
 * One member of a conversation.
 *
 * @generated from message medallion.terminal.v1.ConversationParticipant
 */
export type ConversationParticipant = Message<"medallion.terminal.v1.ConversationParticipant"> & {
    /**
     * Stable participant identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * Optional avatar image URL.
     *
     * @generated from field: optional string avatar_url = 3;
     */
    avatarUrl?: string | undefined;
    /**
     * Free-form membership or business role: "owner", "member", "customer",
     * "agent", "assistant", etc.
     *
     * @generated from field: optional string role = 4;
     */
    role?: string | undefined;
    /**
     * Free-form presence/availability value.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string | undefined;
    /**
     * Applied when the participant is selected.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One member of a conversation.
 *
 * @generated from message medallion.terminal.v1.ConversationParticipant
 */
export type ConversationParticipantJson = {
    /**
     * Stable participant identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * Optional avatar image URL.
     *
     * @generated from field: optional string avatar_url = 3;
     */
    avatarUrl?: string;
    /**
     * Free-form membership or business role: "owner", "member", "customer",
     * "agent", "assistant", etc.
     *
     * @generated from field: optional string role = 4;
     */
    role?: string;
    /**
     * Free-form presence/availability value.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string;
    /**
     * Applied when the participant is selected.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.ConversationParticipant.
 * Use `create(ConversationParticipantSchema)` to create a new message.
 */
export declare const ConversationParticipantSchema: GenMessage<ConversationParticipant, {
    jsonType: ConversationParticipantJson;
}>;
/**
 * One message in a conversation transcript.
 *
 * @generated from message medallion.terminal.v1.ConversationMessage
 */
export type ConversationMessage = Message<"medallion.terminal.v1.ConversationMessage"> & {
    /**
     * Stable message identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * ISO 8601 send time.
     *
     * @generated from field: optional string timestamp = 2;
     */
    timestamp?: string | undefined;
    /**
     * Sender (ConversationParticipant.id).
     *
     * @generated from field: optional string sender_id = 3;
     */
    senderId?: string | undefined;
    /**
     * Denormalized fallbacks for transcripts where a participant catalog is
     * unavailable or historical sender records were removed.
     *
     * @generated from field: optional string sender_name = 4;
     */
    senderName?: string | undefined;
    /**
     * Fallback avatar URL when the sender is not in participants.
     *
     * @generated from field: optional string sender_avatar_url = 5;
     */
    senderAvatarUrl?: string | undefined;
    /**
     * Recognized renderer hints include "message", "assistant", "system",
     * "tool", and "event"; unknown values render as ordinary messages.
     *
     * @generated from field: optional string kind = 6;
     */
    kind?: string | undefined;
    /**
     * Message text.
     *
     * @generated from field: optional string body = 7;
     */
    body?: string | undefined;
    /**
     * Message this one replies to (ConversationMessage.id).
     *
     * @generated from field: optional string reply_to_id = 8;
     */
    replyToId?: string | undefined;
    /**
     * True if the message was edited after sending.
     *
     * @generated from field: bool edited = 9;
     */
    edited: boolean;
    /**
     * Free-form delivery/lifecycle state such as "sending", "sent",
     * "delivered", "read", or "failed".
     *
     * @generated from field: optional string status = 10;
     */
    status?: string | undefined;
    /**
     * Files/media attached to the message.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationAttachment attachments = 11;
     */
    attachments: ConversationAttachment[];
    /**
     * Aggregated reactions.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationReaction reactions = 12;
     */
    reactions: ConversationReaction[];
    /**
     * Number of thread replies, when threading is supported.
     *
     * @generated from field: optional uint32 thread_reply_count = 13;
     */
    threadReplyCount?: number | undefined;
    /**
     * Additional structured metadata.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 14;
     */
    metadata?: JsonObject | undefined;
    /**
     * Applied when the message is selected.
     *
     * @generated from field: map<string, string> context = 15;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One message in a conversation transcript.
 *
 * @generated from message medallion.terminal.v1.ConversationMessage
 */
export type ConversationMessageJson = {
    /**
     * Stable message identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * ISO 8601 send time.
     *
     * @generated from field: optional string timestamp = 2;
     */
    timestamp?: string;
    /**
     * Sender (ConversationParticipant.id).
     *
     * @generated from field: optional string sender_id = 3;
     */
    senderId?: string;
    /**
     * Denormalized fallbacks for transcripts where a participant catalog is
     * unavailable or historical sender records were removed.
     *
     * @generated from field: optional string sender_name = 4;
     */
    senderName?: string;
    /**
     * Fallback avatar URL when the sender is not in participants.
     *
     * @generated from field: optional string sender_avatar_url = 5;
     */
    senderAvatarUrl?: string;
    /**
     * Recognized renderer hints include "message", "assistant", "system",
     * "tool", and "event"; unknown values render as ordinary messages.
     *
     * @generated from field: optional string kind = 6;
     */
    kind?: string;
    /**
     * Message text.
     *
     * @generated from field: optional string body = 7;
     */
    body?: string;
    /**
     * Message this one replies to (ConversationMessage.id).
     *
     * @generated from field: optional string reply_to_id = 8;
     */
    replyToId?: string;
    /**
     * True if the message was edited after sending.
     *
     * @generated from field: bool edited = 9;
     */
    edited?: boolean;
    /**
     * Free-form delivery/lifecycle state such as "sending", "sent",
     * "delivered", "read", or "failed".
     *
     * @generated from field: optional string status = 10;
     */
    status?: string;
    /**
     * Files/media attached to the message.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationAttachment attachments = 11;
     */
    attachments?: ConversationAttachmentJson[];
    /**
     * Aggregated reactions.
     *
     * @generated from field: repeated medallion.terminal.v1.ConversationReaction reactions = 12;
     */
    reactions?: ConversationReactionJson[];
    /**
     * Number of thread replies, when threading is supported.
     *
     * @generated from field: optional uint32 thread_reply_count = 13;
     */
    threadReplyCount?: number;
    /**
     * Additional structured metadata.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 14;
     */
    metadata?: StructJson;
    /**
     * Applied when the message is selected.
     *
     * @generated from field: map<string, string> context = 15;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.ConversationMessage.
 * Use `create(ConversationMessageSchema)` to create a new message.
 */
export declare const ConversationMessageSchema: GenMessage<ConversationMessage, {
    jsonType: ConversationMessageJson;
}>;
/**
 * One file/media attachment on a message.
 *
 * @generated from message medallion.terminal.v1.ConversationAttachment
 */
export type ConversationAttachment = Message<"medallion.terminal.v1.ConversationAttachment"> & {
    /**
     * Stable attachment identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display file name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * Free-form renderer hint: "file", "image", "video", "audio", "link",
     * "code", etc.
     *
     * @generated from field: optional string kind = 3;
     */
    kind?: string | undefined;
    /**
     * Authorized download/view URL.
     *
     * @generated from field: optional string url = 4;
     */
    url?: string | undefined;
    /**
     * Small preview URL.
     *
     * @generated from field: optional string thumbnail_url = 5;
     */
    thumbnailUrl?: string | undefined;
    /**
     * MIME type.
     *
     * @generated from field: optional string content_type = 6;
     */
    contentType?: string | undefined;
    /**
     * File size in bytes, when known.
     *
     * @generated from field: optional uint64 size_bytes = 7;
     */
    sizeBytes?: bigint | undefined;
};
/**
 * One file/media attachment on a message.
 *
 * @generated from message medallion.terminal.v1.ConversationAttachment
 */
export type ConversationAttachmentJson = {
    /**
     * Stable attachment identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display file name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * Free-form renderer hint: "file", "image", "video", "audio", "link",
     * "code", etc.
     *
     * @generated from field: optional string kind = 3;
     */
    kind?: string;
    /**
     * Authorized download/view URL.
     *
     * @generated from field: optional string url = 4;
     */
    url?: string;
    /**
     * Small preview URL.
     *
     * @generated from field: optional string thumbnail_url = 5;
     */
    thumbnailUrl?: string;
    /**
     * MIME type.
     *
     * @generated from field: optional string content_type = 6;
     */
    contentType?: string;
    /**
     * File size in bytes, when known.
     *
     * @generated from field: optional uint64 size_bytes = 7;
     */
    sizeBytes?: string;
};
/**
 * Describes the message medallion.terminal.v1.ConversationAttachment.
 * Use `create(ConversationAttachmentSchema)` to create a new message.
 */
export declare const ConversationAttachmentSchema: GenMessage<ConversationAttachment, {
    jsonType: ConversationAttachmentJson;
}>;
/**
 * Aggregated reaction counts for one reaction key.
 *
 * @generated from message medallion.terminal.v1.ConversationReaction
 */
export type ConversationReaction = Message<"medallion.terminal.v1.ConversationReaction"> & {
    /**
     * Stable backend key, independent of display glyph/localization.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Display glyph or short label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * How many participants reacted.
     *
     * @generated from field: uint32 count = 3;
     */
    count: number;
    /**
     * True if the viewer is among the reactors.
     *
     * @generated from field: bool viewer_reacted = 4;
     */
    viewerReacted: boolean;
};
/**
 * Aggregated reaction counts for one reaction key.
 *
 * @generated from message medallion.terminal.v1.ConversationReaction
 */
export type ConversationReactionJson = {
    /**
     * Stable backend key, independent of display glyph/localization.
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Display glyph or short label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * How many participants reacted.
     *
     * @generated from field: uint32 count = 3;
     */
    count?: number;
    /**
     * True if the viewer is among the reactors.
     *
     * @generated from field: bool viewer_reacted = 4;
     */
    viewerReacted?: boolean;
};
/**
 * Describes the message medallion.terminal.v1.ConversationReaction.
 * Use `create(ConversationReactionSchema)` to create a new message.
 */
export declare const ConversationReactionSchema: GenMessage<ConversationReaction, {
    jsonType: ConversationReactionJson;
}>;
/**
 * --- Asset Catalog ---
 * Use for: governed discovery surfaces that list datasets, object
 * types, pipelines, models, repositories, dashboards, documents, and
 * other platform resources.
 *
 * JSON example:
 *   { "items": [
 *       { "id": "dataset.orders",
 *         "name": "Orders",
 *         "kind": "dataset",
 *         "owner": "commerce-data",
 *         "status": "healthy",
 *         "tags": ["gold", "pii"],
 *         "context": {
 *           "asset_id": "dataset.orders",
 *           "asset_kind": "dataset"
 *         } }
 *     ],
 *     "total": "1" }
 *
 * @generated from message medallion.terminal.v1.AssetCatalogPayload
 */
export type AssetCatalogPayload = Message<"medallion.terminal.v1.AssetCatalogPayload"> & {
    /**
     * The catalog entries in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.AssetCatalogItem items = 1;
     */
    items: AssetCatalogItem[];
    /**
     * Total matches before pagination/filtering, when known.
     *
     * @generated from field: optional int64 total = 2;
     */
    total?: bigint | undefined;
    /**
     * Opaque cursor for a subsequent page. Empty/absent means no cursor
     * was supplied. Pagination remains backend-defined via source params.
     *
     * @generated from field: optional string next_page_token = 3;
     */
    nextPageToken?: string | undefined;
};
/**
 * --- Asset Catalog ---
 * Use for: governed discovery surfaces that list datasets, object
 * types, pipelines, models, repositories, dashboards, documents, and
 * other platform resources.
 *
 * JSON example:
 *   { "items": [
 *       { "id": "dataset.orders",
 *         "name": "Orders",
 *         "kind": "dataset",
 *         "owner": "commerce-data",
 *         "status": "healthy",
 *         "tags": ["gold", "pii"],
 *         "context": {
 *           "asset_id": "dataset.orders",
 *           "asset_kind": "dataset"
 *         } }
 *     ],
 *     "total": "1" }
 *
 * @generated from message medallion.terminal.v1.AssetCatalogPayload
 */
export type AssetCatalogPayloadJson = {
    /**
     * The catalog entries in display order.
     *
     * @generated from field: repeated medallion.terminal.v1.AssetCatalogItem items = 1;
     */
    items?: AssetCatalogItemJson[];
    /**
     * Total matches before pagination/filtering, when known.
     *
     * @generated from field: optional int64 total = 2;
     */
    total?: string;
    /**
     * Opaque cursor for a subsequent page. Empty/absent means no cursor
     * was supplied. Pagination remains backend-defined via source params.
     *
     * @generated from field: optional string next_page_token = 3;
     */
    nextPageToken?: string;
};
/**
 * Describes the message medallion.terminal.v1.AssetCatalogPayload.
 * Use `create(AssetCatalogPayloadSchema)` to create a new message.
 */
export declare const AssetCatalogPayloadSchema: GenMessage<AssetCatalogPayload, {
    jsonType: AssetCatalogPayloadJson;
}>;
/**
 * One discoverable platform asset.
 *
 * @generated from message medallion.terminal.v1.AssetCatalogItem
 */
export type AssetCatalogItem = Message<"medallion.terminal.v1.AssetCatalogItem"> & {
    /**
     * Stable identifier used by detail/lineage sources.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * Free-form platform kind: "dataset", "object_type", "pipeline",
     * "model", "repository", "dashboard", "document", etc.
     *
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * What the asset is, in plain language.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string | undefined;
    /**
     * Owning team or user.
     *
     * @generated from field: optional string owner = 5;
     */
    owner?: string | undefined;
    /**
     * Free-form health/lifecycle state. Common values: "healthy",
     * "warning", "error", "draft", "deprecated", "archived".
     *
     * @generated from field: optional string status = 6;
     */
    status?: string | undefined;
    /**
     * ISO 8601 when available; widgets render other display strings too.
     *
     * @generated from field: optional string updated_at = 7;
     */
    updatedAt?: string | undefined;
    /**
     * Free-form tags for filtering and search.
     *
     * @generated from field: repeated string tags = 8;
     */
    tags: string[];
    /**
     * Optional deep link to a host-owned detail page.
     *
     * @generated from field: optional string url = 9;
     */
    url?: string | undefined;
    /**
     * Additional structured metadata (row count, classification,
     * retention policy, branch, language, quality score, etc.).
     *
     * @generated from field: optional google.protobuf.Struct metadata = 10;
     */
    metadata?: JsonObject | undefined;
    /**
     * Context values applied when the item is selected. This is the
     * generic cross-widget bridge: selecting a repository can set
     * {repository, ref}, while selecting a dataset can set
     * {asset_id, asset_kind}.
     *
     * @generated from field: map<string, string> context = 11;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One discoverable platform asset.
 *
 * @generated from message medallion.terminal.v1.AssetCatalogItem
 */
export type AssetCatalogItemJson = {
    /**
     * Stable identifier used by detail/lineage sources.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * Free-form platform kind: "dataset", "object_type", "pipeline",
     * "model", "repository", "dashboard", "document", etc.
     *
     * @generated from field: string kind = 3;
     */
    kind?: string;
    /**
     * What the asset is, in plain language.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string;
    /**
     * Owning team or user.
     *
     * @generated from field: optional string owner = 5;
     */
    owner?: string;
    /**
     * Free-form health/lifecycle state. Common values: "healthy",
     * "warning", "error", "draft", "deprecated", "archived".
     *
     * @generated from field: optional string status = 6;
     */
    status?: string;
    /**
     * ISO 8601 when available; widgets render other display strings too.
     *
     * @generated from field: optional string updated_at = 7;
     */
    updatedAt?: string;
    /**
     * Free-form tags for filtering and search.
     *
     * @generated from field: repeated string tags = 8;
     */
    tags?: string[];
    /**
     * Optional deep link to a host-owned detail page.
     *
     * @generated from field: optional string url = 9;
     */
    url?: string;
    /**
     * Additional structured metadata (row count, classification,
     * retention policy, branch, language, quality score, etc.).
     *
     * @generated from field: optional google.protobuf.Struct metadata = 10;
     */
    metadata?: StructJson;
    /**
     * Context values applied when the item is selected. This is the
     * generic cross-widget bridge: selecting a repository can set
     * {repository, ref}, while selecting a dataset can set
     * {asset_id, asset_kind}.
     *
     * @generated from field: map<string, string> context = 11;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.AssetCatalogItem.
 * Use `create(AssetCatalogItemSchema)` to create a new message.
 */
export declare const AssetCatalogItemSchema: GenMessage<AssetCatalogItem, {
    jsonType: AssetCatalogItemJson;
}>;
/**
 * --- Record Set / Work Management ---
 * Use for: mutable business records with a declared field schema and
 * multiple saved views over the same underlying table. This is the
 * domain-neutral foundation for CRM lists, project trackers, inventory,
 * approvals, content calendars, hiring pipelines, and similar workflows.
 *
 * Get/Stream returns the records and schema. All writes still flow through
 * TerminalService.SubmitAction; capabilities declare the backend action ids.
 * Formula, lookup, and rollup values are computed by the backend and exposed
 * as read-only fields. The frontend never evaluates formulas.
 *
 * Linked values convention:
 *   single link: { "id": "customer-42", "label": "Acme" }
 *   multi link:  [{ "id": "customer-42", "label": "Acme" }]
 *
 * JSON example:
 *   {
 *     "workspace_id": "operations",
 *     "table_id": "projects",
 *     "table_name": "Projects",
 *     "primary_field": "name",
 *     "fields": [
 *       { "key": "name", "label": "Project",
 *         "type": "RECORD_FIELD_TYPE_TEXT", "required": true },
 *       { "key": "stage", "label": "Stage",
 *         "type": "RECORD_FIELD_TYPE_SINGLE_SELECT",
 *         "choices": [
 *           { "value": "planned", "label": "Planned" },
 *           { "value": "active", "label": "Active", "color": "info" }
 *         ] }
 *     ],
 *     "records": [
 *       { "id": "project-1", "values": {
 *           "name": "Warehouse launch", "stage": "active"
 *         }, "revision": "7" }
 *     ],
 *     "capabilities": {
 *       "create": true, "update": true, "delete": true,
 *       "create_action_id": "record_create",
 *       "update_action_id": "record_update",
 *       "delete_action_id": "record_delete"
 *     }
 *   }
 *
 * @generated from message medallion.terminal.v1.RecordSetPayload
 */
export type RecordSetPayload = Message<"medallion.terminal.v1.RecordSetPayload"> & {
    /**
     * Workspace the table lives in.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Stable table identifier. Echoed in record mutations.
     *
     * @generated from field: string table_id = 2;
     */
    tableId: string;
    /**
     * Display name of the table.
     *
     * @generated from field: string table_name = 3;
     */
    tableName: string;
    /**
     * Field used as the human-readable record title.
     *
     * @generated from field: string primary_field = 4;
     */
    primaryField: string;
    /**
     * Declared field schema.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordField fields = 5;
     */
    fields: RecordField[];
    /**
     * The records in the current page/view.
     *
     * @generated from field: repeated medallion.terminal.v1.WorkRecord records = 6;
     */
    records: WorkRecord[];
    /**
     * Saved views over the same records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordView views = 7;
     */
    views: RecordView[];
    /**
     * View selected by the backend, when applicable.
     *
     * @generated from field: optional string active_view_id = 8;
     */
    activeViewId?: string | undefined;
    /**
     * Total records before pagination, when known.
     *
     * @generated from field: optional int64 total = 9;
     */
    total?: bigint | undefined;
    /**
     * Opaque cursor for a subsequent page.
     *
     * @generated from field: optional string next_page_token = 10;
     */
    nextPageToken?: string | undefined;
    /**
     * Which mutations the backend supports, and their action ids.
     *
     * @generated from field: medallion.terminal.v1.RecordCapabilities capabilities = 11;
     */
    capabilities?: RecordCapabilities | undefined;
};
/**
 * --- Record Set / Work Management ---
 * Use for: mutable business records with a declared field schema and
 * multiple saved views over the same underlying table. This is the
 * domain-neutral foundation for CRM lists, project trackers, inventory,
 * approvals, content calendars, hiring pipelines, and similar workflows.
 *
 * Get/Stream returns the records and schema. All writes still flow through
 * TerminalService.SubmitAction; capabilities declare the backend action ids.
 * Formula, lookup, and rollup values are computed by the backend and exposed
 * as read-only fields. The frontend never evaluates formulas.
 *
 * Linked values convention:
 *   single link: { "id": "customer-42", "label": "Acme" }
 *   multi link:  [{ "id": "customer-42", "label": "Acme" }]
 *
 * JSON example:
 *   {
 *     "workspace_id": "operations",
 *     "table_id": "projects",
 *     "table_name": "Projects",
 *     "primary_field": "name",
 *     "fields": [
 *       { "key": "name", "label": "Project",
 *         "type": "RECORD_FIELD_TYPE_TEXT", "required": true },
 *       { "key": "stage", "label": "Stage",
 *         "type": "RECORD_FIELD_TYPE_SINGLE_SELECT",
 *         "choices": [
 *           { "value": "planned", "label": "Planned" },
 *           { "value": "active", "label": "Active", "color": "info" }
 *         ] }
 *     ],
 *     "records": [
 *       { "id": "project-1", "values": {
 *           "name": "Warehouse launch", "stage": "active"
 *         }, "revision": "7" }
 *     ],
 *     "capabilities": {
 *       "create": true, "update": true, "delete": true,
 *       "create_action_id": "record_create",
 *       "update_action_id": "record_update",
 *       "delete_action_id": "record_delete"
 *     }
 *   }
 *
 * @generated from message medallion.terminal.v1.RecordSetPayload
 */
export type RecordSetPayloadJson = {
    /**
     * Workspace the table lives in.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId?: string;
    /**
     * Stable table identifier. Echoed in record mutations.
     *
     * @generated from field: string table_id = 2;
     */
    tableId?: string;
    /**
     * Display name of the table.
     *
     * @generated from field: string table_name = 3;
     */
    tableName?: string;
    /**
     * Field used as the human-readable record title.
     *
     * @generated from field: string primary_field = 4;
     */
    primaryField?: string;
    /**
     * Declared field schema.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordField fields = 5;
     */
    fields?: RecordFieldJson[];
    /**
     * The records in the current page/view.
     *
     * @generated from field: repeated medallion.terminal.v1.WorkRecord records = 6;
     */
    records?: WorkRecordJson[];
    /**
     * Saved views over the same records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordView views = 7;
     */
    views?: RecordViewJson[];
    /**
     * View selected by the backend, when applicable.
     *
     * @generated from field: optional string active_view_id = 8;
     */
    activeViewId?: string;
    /**
     * Total records before pagination, when known.
     *
     * @generated from field: optional int64 total = 9;
     */
    total?: string;
    /**
     * Opaque cursor for a subsequent page.
     *
     * @generated from field: optional string next_page_token = 10;
     */
    nextPageToken?: string;
    /**
     * Which mutations the backend supports, and their action ids.
     *
     * @generated from field: medallion.terminal.v1.RecordCapabilities capabilities = 11;
     */
    capabilities?: RecordCapabilitiesJson;
};
/**
 * Describes the message medallion.terminal.v1.RecordSetPayload.
 * Use `create(RecordSetPayloadSchema)` to create a new message.
 */
export declare const RecordSetPayloadSchema: GenMessage<RecordSetPayload, {
    jsonType: RecordSetPayloadJson;
}>;
/**
 * One mutable record in a record set.
 *
 * @generated from message medallion.terminal.v1.WorkRecord
 */
export type WorkRecord = Message<"medallion.terminal.v1.WorkRecord"> & {
    /**
     * Stable record identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Field values keyed by RecordField.key.
     *
     * @generated from field: google.protobuf.Struct values = 2;
     */
    values?: JsonObject | undefined;
    /**
     * ISO 8601 creation time.
     *
     * @generated from field: optional string created_at = 3;
     */
    createdAt?: string | undefined;
    /**
     * ISO 8601 last-update time.
     *
     * @generated from field: optional string updated_at = 4;
     */
    updatedAt?: string | undefined;
    /**
     * Opaque optimistic-concurrency token. Mutation handlers SHOULD reject
     * a stale revision rather than silently overwriting a newer record.
     *
     * @generated from field: optional string revision = 5;
     */
    revision?: string | undefined;
    /**
     * Context applied when the record is selected. The widget also emits
     * table_id and record_id defaults when no explicit context is supplied.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One mutable record in a record set.
 *
 * @generated from message medallion.terminal.v1.WorkRecord
 */
export type WorkRecordJson = {
    /**
     * Stable record identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Field values keyed by RecordField.key.
     *
     * @generated from field: google.protobuf.Struct values = 2;
     */
    values?: StructJson;
    /**
     * ISO 8601 creation time.
     *
     * @generated from field: optional string created_at = 3;
     */
    createdAt?: string;
    /**
     * ISO 8601 last-update time.
     *
     * @generated from field: optional string updated_at = 4;
     */
    updatedAt?: string;
    /**
     * Opaque optimistic-concurrency token. Mutation handlers SHOULD reject
     * a stale revision rather than silently overwriting a newer record.
     *
     * @generated from field: optional string revision = 5;
     */
    revision?: string;
    /**
     * Context applied when the record is selected. The widget also emits
     * table_id and record_id defaults when no explicit context is supplied.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.WorkRecord.
 * Use `create(WorkRecordSchema)` to create a new message.
 */
export declare const WorkRecordSchema: GenMessage<WorkRecord, {
    jsonType: WorkRecordJson;
}>;
/**
 * One column in a record set's declared schema.
 *
 * @generated from message medallion.terminal.v1.RecordField
 */
export type RecordField = Message<"medallion.terminal.v1.RecordField"> & {
    /**
     * Field key matching WorkRecord.values keys.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Value type; drives the input control and formatting.
     *
     * @generated from field: medallion.terminal.v1.RecordFieldType type = 3;
     */
    type: RecordFieldType;
    /**
     * Help text shown in editors.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string | undefined;
    /**
     * True if records must carry a value.
     *
     * @generated from field: bool required = 5;
     */
    required: boolean;
    /**
     * True if the frontend must not edit the field.
     *
     * @generated from field: bool read_only = 6;
     */
    readOnly: boolean;
    /**
     * Options for single/multi select fields.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordChoice choices = 7;
     */
    choices: RecordChoice[];
    /**
     * Set for linked-record fields. Hosts resolve the linked table and enforce
     * visibility; record payloads should include only labels the caller may see.
     *
     * @generated from field: optional string linked_table_id = 8;
     */
    linkedTableId?: string | undefined;
    /**
     * Linked fields: true if multiple links are allowed.
     *
     * @generated from field: bool allow_multiple = 9;
     */
    allowMultiple: boolean;
    /**
     * Display directive compatible with TableColumn.format where possible.
     *
     * @generated from field: optional string format = 10;
     */
    format?: string | undefined;
    /**
     * Default applied to new records.
     *
     * @generated from field: optional google.protobuf.Value default_value = 11;
     */
    defaultValue?: Value | undefined;
};
/**
 * One column in a record set's declared schema.
 *
 * @generated from message medallion.terminal.v1.RecordField
 */
export type RecordFieldJson = {
    /**
     * Field key matching WorkRecord.values keys.
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Value type; drives the input control and formatting.
     *
     * @generated from field: medallion.terminal.v1.RecordFieldType type = 3;
     */
    type?: RecordFieldTypeJson;
    /**
     * Help text shown in editors.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string;
    /**
     * True if records must carry a value.
     *
     * @generated from field: bool required = 5;
     */
    required?: boolean;
    /**
     * True if the frontend must not edit the field.
     *
     * @generated from field: bool read_only = 6;
     */
    readOnly?: boolean;
    /**
     * Options for single/multi select fields.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordChoice choices = 7;
     */
    choices?: RecordChoiceJson[];
    /**
     * Set for linked-record fields. Hosts resolve the linked table and enforce
     * visibility; record payloads should include only labels the caller may see.
     *
     * @generated from field: optional string linked_table_id = 8;
     */
    linkedTableId?: string;
    /**
     * Linked fields: true if multiple links are allowed.
     *
     * @generated from field: bool allow_multiple = 9;
     */
    allowMultiple?: boolean;
    /**
     * Display directive compatible with TableColumn.format where possible.
     *
     * @generated from field: optional string format = 10;
     */
    format?: string;
    /**
     * Default applied to new records.
     *
     * @generated from field: optional google.protobuf.Value default_value = 11;
     */
    defaultValue?: ValueJson;
};
/**
 * Describes the message medallion.terminal.v1.RecordField.
 * Use `create(RecordFieldSchema)` to create a new message.
 */
export declare const RecordFieldSchema: GenMessage<RecordField, {
    jsonType: RecordFieldJson;
}>;
/**
 * One selectable option for a select field.
 *
 * @generated from message medallion.terminal.v1.RecordChoice
 */
export type RecordChoice = Message<"medallion.terminal.v1.RecordChoice"> & {
    /**
     * Stored value.
     *
     * @generated from field: string value = 1;
     */
    value: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Semantic tone only: "info", "ok", "warn", "danger", or "neutral".
     *
     * @generated from field: optional string color = 3;
     */
    color?: string | undefined;
};
/**
 * One selectable option for a select field.
 *
 * @generated from message medallion.terminal.v1.RecordChoice
 */
export type RecordChoiceJson = {
    /**
     * Stored value.
     *
     * @generated from field: string value = 1;
     */
    value?: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Semantic tone only: "info", "ok", "warn", "danger", or "neutral".
     *
     * @generated from field: optional string color = 3;
     */
    color?: string;
};
/**
 * Describes the message medallion.terminal.v1.RecordChoice.
 * Use `create(RecordChoiceSchema)` to create a new message.
 */
export declare const RecordChoiceSchema: GenMessage<RecordChoice, {
    jsonType: RecordChoiceJson;
}>;
/**
 * One saved view over a record set.
 *
 * @generated from message medallion.terminal.v1.RecordView
 */
export type RecordView = Message<"medallion.terminal.v1.RecordView"> & {
    /**
     * Stable view identifier.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * How the view renders (grid, board, calendar, ...).
     *
     * @generated from field: medallion.terminal.v1.RecordViewType type = 3;
     */
    type: RecordViewType;
    /**
     * Field keys shown, in order. Empty = all fields.
     *
     * @generated from field: repeated string visible_fields = 4;
     */
    visibleFields: string[];
    /**
     * BOARD: lane field. CALENDAR/TIMELINE: temporal field.
     *
     * @generated from field: optional string group_by = 5;
     */
    groupBy?: string | undefined;
    /**
     * CALENDAR/TIMELINE: the field records are placed by.
     *
     * @generated from field: optional string date_field = 6;
     */
    dateField?: string | undefined;
    /**
     * GALLERY/BOARD: the field used as the card title.
     *
     * @generated from field: optional string title_field = 7;
     */
    titleField?: string | undefined;
    /**
     * Sort order applied to the records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordSort sorts = 8;
     */
    sorts: RecordSort[];
    /**
     * Filters applied to the records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordFilter filters = 9;
     */
    filters: RecordFilter[];
};
/**
 * One saved view over a record set.
 *
 * @generated from message medallion.terminal.v1.RecordView
 */
export type RecordViewJson = {
    /**
     * Stable view identifier.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display name.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * How the view renders (grid, board, calendar, ...).
     *
     * @generated from field: medallion.terminal.v1.RecordViewType type = 3;
     */
    type?: RecordViewTypeJson;
    /**
     * Field keys shown, in order. Empty = all fields.
     *
     * @generated from field: repeated string visible_fields = 4;
     */
    visibleFields?: string[];
    /**
     * BOARD: lane field. CALENDAR/TIMELINE: temporal field.
     *
     * @generated from field: optional string group_by = 5;
     */
    groupBy?: string;
    /**
     * CALENDAR/TIMELINE: the field records are placed by.
     *
     * @generated from field: optional string date_field = 6;
     */
    dateField?: string;
    /**
     * GALLERY/BOARD: the field used as the card title.
     *
     * @generated from field: optional string title_field = 7;
     */
    titleField?: string;
    /**
     * Sort order applied to the records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordSort sorts = 8;
     */
    sorts?: RecordSortJson[];
    /**
     * Filters applied to the records.
     *
     * @generated from field: repeated medallion.terminal.v1.RecordFilter filters = 9;
     */
    filters?: RecordFilterJson[];
};
/**
 * Describes the message medallion.terminal.v1.RecordView.
 * Use `create(RecordViewSchema)` to create a new message.
 */
export declare const RecordViewSchema: GenMessage<RecordView, {
    jsonType: RecordViewJson;
}>;
/**
 * One sort key in a view.
 *
 * @generated from message medallion.terminal.v1.RecordSort
 */
export type RecordSort = Message<"medallion.terminal.v1.RecordSort"> & {
    /**
     * Field key to sort by.
     *
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * True for descending order.
     *
     * @generated from field: bool descending = 2;
     */
    descending: boolean;
};
/**
 * One sort key in a view.
 *
 * @generated from message medallion.terminal.v1.RecordSort
 */
export type RecordSortJson = {
    /**
     * Field key to sort by.
     *
     * @generated from field: string field = 1;
     */
    field?: string;
    /**
     * True for descending order.
     *
     * @generated from field: bool descending = 2;
     */
    descending?: boolean;
};
/**
 * Describes the message medallion.terminal.v1.RecordSort.
 * Use `create(RecordSortSchema)` to create a new message.
 */
export declare const RecordSortSchema: GenMessage<RecordSort, {
    jsonType: RecordSortJson;
}>;
/**
 * One filter predicate in a view.
 *
 * @generated from message medallion.terminal.v1.RecordFilter
 */
export type RecordFilter = Message<"medallion.terminal.v1.RecordFilter"> & {
    /**
     * Field key to filter on.
     *
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * Backend-defined operator. Recommended portable values:
     * eq, neq, contains, in, gt, gte, lt, lte, empty, not_empty.
     *
     * @generated from field: string operator = 2;
     */
    operator: string;
    /**
     * Comparison operand.
     *
     * @generated from field: google.protobuf.Value value = 3;
     */
    value?: Value | undefined;
};
/**
 * One filter predicate in a view.
 *
 * @generated from message medallion.terminal.v1.RecordFilter
 */
export type RecordFilterJson = {
    /**
     * Field key to filter on.
     *
     * @generated from field: string field = 1;
     */
    field?: string;
    /**
     * Backend-defined operator. Recommended portable values:
     * eq, neq, contains, in, gt, gte, lt, lte, empty, not_empty.
     *
     * @generated from field: string operator = 2;
     */
    operator?: string;
    /**
     * Comparison operand.
     *
     * @generated from field: google.protobuf.Value value = 3;
     */
    value?: ValueJson;
};
/**
 * Describes the message medallion.terminal.v1.RecordFilter.
 * Use `create(RecordFilterSchema)` to create a new message.
 */
export declare const RecordFilterSchema: GenMessage<RecordFilter, {
    jsonType: RecordFilterJson;
}>;
/**
 * Which record mutations the backend supports, and the
 * SubmitAction action ids that perform them.
 *
 * @generated from message medallion.terminal.v1.RecordCapabilities
 */
export type RecordCapabilities = Message<"medallion.terminal.v1.RecordCapabilities"> & {
    /**
     * True if records can be created.
     *
     * @generated from field: bool create = 1;
     */
    create: boolean;
    /**
     * True if records can be updated.
     *
     * @generated from field: bool update = 2;
     */
    update: boolean;
    /**
     * True if records can be deleted.
     *
     * @generated from field: bool delete = 3;
     */
    delete: boolean;
    /**
     * ActionRequest.action_id for creating a record.
     *
     * @generated from field: string create_action_id = 4;
     */
    createActionId: string;
    /**
     * ActionRequest.action_id for updating a record.
     *
     * @generated from field: string update_action_id = 5;
     */
    updateActionId: string;
    /**
     * ActionRequest.action_id for deleting a record.
     *
     * @generated from field: string delete_action_id = 6;
     */
    deleteActionId: string;
};
/**
 * Which record mutations the backend supports, and the
 * SubmitAction action ids that perform them.
 *
 * @generated from message medallion.terminal.v1.RecordCapabilities
 */
export type RecordCapabilitiesJson = {
    /**
     * True if records can be created.
     *
     * @generated from field: bool create = 1;
     */
    create?: boolean;
    /**
     * True if records can be updated.
     *
     * @generated from field: bool update = 2;
     */
    update?: boolean;
    /**
     * True if records can be deleted.
     *
     * @generated from field: bool delete = 3;
     */
    delete?: boolean;
    /**
     * ActionRequest.action_id for creating a record.
     *
     * @generated from field: string create_action_id = 4;
     */
    createActionId?: string;
    /**
     * ActionRequest.action_id for updating a record.
     *
     * @generated from field: string update_action_id = 5;
     */
    updateActionId?: string;
    /**
     * ActionRequest.action_id for deleting a record.
     *
     * @generated from field: string delete_action_id = 6;
     */
    deleteActionId?: string;
};
/**
 * Describes the message medallion.terminal.v1.RecordCapabilities.
 * Use `create(RecordCapabilitiesSchema)` to create a new message.
 */
export declare const RecordCapabilitiesSchema: GenMessage<RecordCapabilities, {
    jsonType: RecordCapabilitiesJson;
}>;
/**
 * --- Semantic Object ---
 * Use for: ontology-backed object instances or type definitions. The
 * payload exposes typed identity, human-readable properties, links to
 * related objects, and optional no-input actions.
 *
 * JSON example:
 *   { "object_type": "Customer",
 *     "object_id": "cust-1042",
 *     "title": "Acme Corp",
 *     "properties": [
 *       { "key": "tier", "label": "Tier", "value": "Enterprise" },
 *       { "key": "arr", "label": "ARR", "value": 1250000,
 *         "format": "currency:USD", "group": "Commercial" }
 *     ],
 *     "links": [
 *       { "relation": "owns", "target_type": "Account",
 *         "target_id": "acct-9", "label": "Primary account" }
 *     ] }
 *
 * @generated from message medallion.terminal.v1.ObjectPayload
 */
export type ObjectPayload = Message<"medallion.terminal.v1.ObjectPayload"> & {
    /**
     * Ontology type name (e.g. "Customer").
     *
     * @generated from field: string object_type = 1;
     */
    objectType: string;
    /**
     * Stable instance identifier.
     *
     * @generated from field: string object_id = 2;
     */
    objectId: string;
    /**
     * Display title of the object.
     *
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * Longer description.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string | undefined;
    /**
     * Free-form health/lifecycle state mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string | undefined;
    /**
     * ISO 8601 last-update time, when known.
     *
     * @generated from field: optional string updated_at = 6;
     */
    updatedAt?: string | undefined;
    /**
     * Free-form tags shown as chips.
     *
     * @generated from field: repeated string tags = 7;
     */
    tags: string[];
    /**
     * Typed display properties, grouped by ObjectProperty.group.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectProperty properties = 8;
     */
    properties: ObjectProperty[];
    /**
     * Related objects.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectLink links = 9;
     */
    links: ObjectLink[];
    /**
     * No-input actions offered on the object.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectAction actions = 10;
     */
    actions: ObjectAction[];
};
/**
 * --- Semantic Object ---
 * Use for: ontology-backed object instances or type definitions. The
 * payload exposes typed identity, human-readable properties, links to
 * related objects, and optional no-input actions.
 *
 * JSON example:
 *   { "object_type": "Customer",
 *     "object_id": "cust-1042",
 *     "title": "Acme Corp",
 *     "properties": [
 *       { "key": "tier", "label": "Tier", "value": "Enterprise" },
 *       { "key": "arr", "label": "ARR", "value": 1250000,
 *         "format": "currency:USD", "group": "Commercial" }
 *     ],
 *     "links": [
 *       { "relation": "owns", "target_type": "Account",
 *         "target_id": "acct-9", "label": "Primary account" }
 *     ] }
 *
 * @generated from message medallion.terminal.v1.ObjectPayload
 */
export type ObjectPayloadJson = {
    /**
     * Ontology type name (e.g. "Customer").
     *
     * @generated from field: string object_type = 1;
     */
    objectType?: string;
    /**
     * Stable instance identifier.
     *
     * @generated from field: string object_id = 2;
     */
    objectId?: string;
    /**
     * Display title of the object.
     *
     * @generated from field: string title = 3;
     */
    title?: string;
    /**
     * Longer description.
     *
     * @generated from field: optional string description = 4;
     */
    description?: string;
    /**
     * Free-form health/lifecycle state mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string;
    /**
     * ISO 8601 last-update time, when known.
     *
     * @generated from field: optional string updated_at = 6;
     */
    updatedAt?: string;
    /**
     * Free-form tags shown as chips.
     *
     * @generated from field: repeated string tags = 7;
     */
    tags?: string[];
    /**
     * Typed display properties, grouped by ObjectProperty.group.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectProperty properties = 8;
     */
    properties?: ObjectPropertyJson[];
    /**
     * Related objects.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectLink links = 9;
     */
    links?: ObjectLinkJson[];
    /**
     * No-input actions offered on the object.
     *
     * @generated from field: repeated medallion.terminal.v1.ObjectAction actions = 10;
     */
    actions?: ObjectActionJson[];
};
/**
 * Describes the message medallion.terminal.v1.ObjectPayload.
 * Use `create(ObjectPayloadSchema)` to create a new message.
 */
export declare const ObjectPayloadSchema: GenMessage<ObjectPayload, {
    jsonType: ObjectPayloadJson;
}>;
/**
 * One displayed property of an object.
 *
 * @generated from message medallion.terminal.v1.ObjectProperty
 */
export type ObjectProperty = Message<"medallion.terminal.v1.ObjectProperty"> & {
    /**
     * Stable property key.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Arbitrary JSON-compatible scalar/array/object.
     *
     * @generated from field: google.protobuf.Value value = 3;
     */
    value?: Value | undefined;
    /**
     * Same display vocabulary as table columns where applicable:
     * currency:USD, percent, datetime, date, compact, link, json.
     *
     * @generated from field: optional string format = 4;
     */
    format?: string | undefined;
    /**
     * Help text shown on hover.
     *
     * @generated from field: optional string description = 5;
     */
    description?: string | undefined;
    /**
     * Properties with the same group render together. Empty = General.
     *
     * @generated from field: optional string group = 6;
     */
    group?: string | undefined;
};
/**
 * One displayed property of an object.
 *
 * @generated from message medallion.terminal.v1.ObjectProperty
 */
export type ObjectPropertyJson = {
    /**
     * Stable property key.
     *
     * @generated from field: string key = 1;
     */
    key?: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Arbitrary JSON-compatible scalar/array/object.
     *
     * @generated from field: google.protobuf.Value value = 3;
     */
    value?: ValueJson;
    /**
     * Same display vocabulary as table columns where applicable:
     * currency:USD, percent, datetime, date, compact, link, json.
     *
     * @generated from field: optional string format = 4;
     */
    format?: string;
    /**
     * Help text shown on hover.
     *
     * @generated from field: optional string description = 5;
     */
    description?: string;
    /**
     * Properties with the same group render together. Empty = General.
     *
     * @generated from field: optional string group = 6;
     */
    group?: string;
};
/**
 * Describes the message medallion.terminal.v1.ObjectProperty.
 * Use `create(ObjectPropertySchema)` to create a new message.
 */
export declare const ObjectPropertySchema: GenMessage<ObjectProperty, {
    jsonType: ObjectPropertyJson;
}>;
/**
 * One relation from this object to another.
 *
 * @generated from message medallion.terminal.v1.ObjectLink
 */
export type ObjectLink = Message<"medallion.terminal.v1.ObjectLink"> & {
    /**
     * Relation name (e.g. "owns", "depends_on").
     *
     * @generated from field: string relation = 1;
     */
    relation: string;
    /**
     * Ontology type of the target object.
     *
     * @generated from field: string target_type = 2;
     */
    targetType: string;
    /**
     * Stable identifier of the target object.
     *
     * @generated from field: string target_id = 3;
     */
    targetId: string;
    /**
     * Display label for the link.
     *
     * @generated from field: string label = 4;
     */
    label: string;
    /**
     * Free-form state of the target, mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string | undefined;
    /**
     * Context applied when the related object is selected. If omitted,
     * the widget falls back to object_type/object_id.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One relation from this object to another.
 *
 * @generated from message medallion.terminal.v1.ObjectLink
 */
export type ObjectLinkJson = {
    /**
     * Relation name (e.g. "owns", "depends_on").
     *
     * @generated from field: string relation = 1;
     */
    relation?: string;
    /**
     * Ontology type of the target object.
     *
     * @generated from field: string target_type = 2;
     */
    targetType?: string;
    /**
     * Stable identifier of the target object.
     *
     * @generated from field: string target_id = 3;
     */
    targetId?: string;
    /**
     * Display label for the link.
     *
     * @generated from field: string label = 4;
     */
    label?: string;
    /**
     * Free-form state of the target, mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string;
    /**
     * Context applied when the related object is selected. If omitted,
     * the widget falls back to object_type/object_id.
     *
     * @generated from field: map<string, string> context = 6;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.ObjectLink.
 * Use `create(ObjectLinkSchema)` to create a new message.
 */
export declare const ObjectLinkSchema: GenMessage<ObjectLink, {
    jsonType: ObjectLinkJson;
}>;
/**
 * One no-input action offered on an object.
 *
 * @generated from message medallion.terminal.v1.ObjectAction
 */
export type ObjectAction = Message<"medallion.terminal.v1.ObjectAction"> & {
    /**
     * Sent as ActionRequest.action_id through TerminalService.SubmitAction.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Button label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Help text shown on hover.
     *
     * @generated from field: optional string description = 3;
     */
    description?: string | undefined;
    /**
     * Visual semantic: "primary", "danger", or "neutral".
     *
     * @generated from field: optional string style = 4;
     */
    style?: string | undefined;
    /**
     * Require a second click before dispatch.
     *
     * @generated from field: bool confirm = 5;
     */
    confirm: boolean;
    /**
     * Static action params. The widget also includes object_type/object_id.
     *
     * @generated from field: optional google.protobuf.Struct params = 6;
     */
    params?: JsonObject | undefined;
    /**
     * True renders the action greyed out and unclickable.
     *
     * @generated from field: bool disabled = 7;
     */
    disabled: boolean;
};
/**
 * One no-input action offered on an object.
 *
 * @generated from message medallion.terminal.v1.ObjectAction
 */
export type ObjectActionJson = {
    /**
     * Sent as ActionRequest.action_id through TerminalService.SubmitAction.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Button label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Help text shown on hover.
     *
     * @generated from field: optional string description = 3;
     */
    description?: string;
    /**
     * Visual semantic: "primary", "danger", or "neutral".
     *
     * @generated from field: optional string style = 4;
     */
    style?: string;
    /**
     * Require a second click before dispatch.
     *
     * @generated from field: bool confirm = 5;
     */
    confirm?: boolean;
    /**
     * Static action params. The widget also includes object_type/object_id.
     *
     * @generated from field: optional google.protobuf.Struct params = 6;
     */
    params?: StructJson;
    /**
     * True renders the action greyed out and unclickable.
     *
     * @generated from field: bool disabled = 7;
     */
    disabled?: boolean;
};
/**
 * Describes the message medallion.terminal.v1.ObjectAction.
 * Use `create(ObjectActionSchema)` to create a new message.
 */
export declare const ObjectActionSchema: GenMessage<ObjectAction, {
    jsonType: ObjectActionJson;
}>;
/**
 * --- Directed Graph ---
 * Use for: dataset lineage, pipeline dependencies, build graphs, and
 * ontology type relationships that can be represented as a directed
 * graph. The built-in `dag` renderer expects an acyclic graph for the
 * cleanest layering, but tolerates cycles by placing cyclic nodes in a
 * final layer.
 *
 * @generated from message medallion.terminal.v1.GraphPayload
 */
export type GraphPayload = Message<"medallion.terminal.v1.GraphPayload"> & {
    /**
     * The graph nodes.
     *
     * @generated from field: repeated medallion.terminal.v1.GraphNode nodes = 1;
     */
    nodes: GraphNode[];
    /**
     * Directed edges between nodes.
     *
     * @generated from field: repeated medallion.terminal.v1.GraphEdge edges = 2;
     */
    edges: GraphEdge[];
};
/**
 * --- Directed Graph ---
 * Use for: dataset lineage, pipeline dependencies, build graphs, and
 * ontology type relationships that can be represented as a directed
 * graph. The built-in `dag` renderer expects an acyclic graph for the
 * cleanest layering, but tolerates cycles by placing cyclic nodes in a
 * final layer.
 *
 * @generated from message medallion.terminal.v1.GraphPayload
 */
export type GraphPayloadJson = {
    /**
     * The graph nodes.
     *
     * @generated from field: repeated medallion.terminal.v1.GraphNode nodes = 1;
     */
    nodes?: GraphNodeJson[];
    /**
     * Directed edges between nodes.
     *
     * @generated from field: repeated medallion.terminal.v1.GraphEdge edges = 2;
     */
    edges?: GraphEdgeJson[];
};
/**
 * Describes the message medallion.terminal.v1.GraphPayload.
 * Use `create(GraphPayloadSchema)` to create a new message.
 */
export declare const GraphPayloadSchema: GenMessage<GraphPayload, {
    jsonType: GraphPayloadJson;
}>;
/**
 * One node in a directed graph.
 *
 * @generated from message medallion.terminal.v1.GraphNode
 */
export type GraphNode = Message<"medallion.terminal.v1.GraphNode"> & {
    /**
     * Stable node identifier referenced by edges.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Free-form node kind (e.g. "dataset", "job") shown as a badge.
     *
     * @generated from field: optional string kind = 3;
     */
    kind?: string | undefined;
    /**
     * Free-form health state mapped to semantic colors.
     *
     * @generated from field: optional string status = 4;
     */
    status?: string | undefined;
    /**
     * Secondary line under the label.
     *
     * @generated from field: optional string subtitle = 5;
     */
    subtitle?: string | undefined;
    /**
     * Free-form tags.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags: string[];
    /**
     * Additional structured metadata shown on selection.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 7;
     */
    metadata?: JsonObject | undefined;
    /**
     * Applied when the node is selected.
     *
     * @generated from field: map<string, string> context = 8;
     */
    context: {
        [key: string]: string;
    };
};
/**
 * One node in a directed graph.
 *
 * @generated from message medallion.terminal.v1.GraphNode
 */
export type GraphNodeJson = {
    /**
     * Stable node identifier referenced by edges.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Display label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Free-form node kind (e.g. "dataset", "job") shown as a badge.
     *
     * @generated from field: optional string kind = 3;
     */
    kind?: string;
    /**
     * Free-form health state mapped to semantic colors.
     *
     * @generated from field: optional string status = 4;
     */
    status?: string;
    /**
     * Secondary line under the label.
     *
     * @generated from field: optional string subtitle = 5;
     */
    subtitle?: string;
    /**
     * Free-form tags.
     *
     * @generated from field: repeated string tags = 6;
     */
    tags?: string[];
    /**
     * Additional structured metadata shown on selection.
     *
     * @generated from field: optional google.protobuf.Struct metadata = 7;
     */
    metadata?: StructJson;
    /**
     * Applied when the node is selected.
     *
     * @generated from field: map<string, string> context = 8;
     */
    context?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.terminal.v1.GraphNode.
 * Use `create(GraphNodeSchema)` to create a new message.
 */
export declare const GraphNodeSchema: GenMessage<GraphNode, {
    jsonType: GraphNodeJson;
}>;
/**
 * One directed edge between two graph nodes.
 *
 * @generated from message medallion.terminal.v1.GraphEdge
 */
export type GraphEdge = Message<"medallion.terminal.v1.GraphEdge"> & {
    /**
     * Source node id.
     *
     * @generated from field: string from = 1;
     */
    from: string;
    /**
     * Target node id.
     *
     * @generated from field: string to = 2;
     */
    to: string;
    /**
     * Optional edge label.
     *
     * @generated from field: optional string label = 3;
     */
    label?: string | undefined;
    /**
     * Free-form edge kind.
     *
     * @generated from field: optional string kind = 4;
     */
    kind?: string | undefined;
    /**
     * Free-form state mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string | undefined;
};
/**
 * One directed edge between two graph nodes.
 *
 * @generated from message medallion.terminal.v1.GraphEdge
 */
export type GraphEdgeJson = {
    /**
     * Source node id.
     *
     * @generated from field: string from = 1;
     */
    from?: string;
    /**
     * Target node id.
     *
     * @generated from field: string to = 2;
     */
    to?: string;
    /**
     * Optional edge label.
     *
     * @generated from field: optional string label = 3;
     */
    label?: string;
    /**
     * Free-form edge kind.
     *
     * @generated from field: optional string kind = 4;
     */
    kind?: string;
    /**
     * Free-form state mapped to semantic colors.
     *
     * @generated from field: optional string status = 5;
     */
    status?: string;
};
/**
 * Describes the message medallion.terminal.v1.GraphEdge.
 * Use `create(GraphEdgeSchema)` to create a new message.
 */
export declare const GraphEdgeSchema: GenMessage<GraphEdge, {
    jsonType: GraphEdgeJson;
}>;
/**
 * --- Code Repository ---
 * Use for: branch/ref-aware source browsing. A response contains the
 * entries at `path` and, when `path` points at a file, its text content.
 * Backends should omit `file.content` for binary files and may mark
 * large text files as truncated.
 *
 * @generated from message medallion.terminal.v1.RepositoryPayload
 */
export type RepositoryPayload = Message<"medallion.terminal.v1.RepositoryPayload"> & {
    /**
     * Repository name/slug being browsed.
     *
     * @generated from field: string repository = 1;
     */
    repository: string;
    /**
     * The branch, tag, or commit this response reflects.
     *
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * Path this response describes ("" = repository root).
     *
     * @generated from field: string path = 3;
     */
    path: string;
    /**
     * Branches/tags available for switching.
     *
     * @generated from field: repeated string refs = 4;
     */
    refs: string[];
    /**
     * Directory listing at `path`.
     *
     * @generated from field: repeated medallion.terminal.v1.RepositoryEntry entries = 5;
     */
    entries: RepositoryEntry[];
    /**
     * File content when `path` points at a file.
     *
     * @generated from field: optional medallion.terminal.v1.RepositoryFile file = 6;
     */
    file?: RepositoryFile | undefined;
    /**
     * Optional host-owned repository URL.
     *
     * @generated from field: optional string url = 7;
     */
    url?: string | undefined;
};
/**
 * --- Code Repository ---
 * Use for: branch/ref-aware source browsing. A response contains the
 * entries at `path` and, when `path` points at a file, its text content.
 * Backends should omit `file.content` for binary files and may mark
 * large text files as truncated.
 *
 * @generated from message medallion.terminal.v1.RepositoryPayload
 */
export type RepositoryPayloadJson = {
    /**
     * Repository name/slug being browsed.
     *
     * @generated from field: string repository = 1;
     */
    repository?: string;
    /**
     * The branch, tag, or commit this response reflects.
     *
     * @generated from field: string ref = 2;
     */
    ref?: string;
    /**
     * Path this response describes ("" = repository root).
     *
     * @generated from field: string path = 3;
     */
    path?: string;
    /**
     * Branches/tags available for switching.
     *
     * @generated from field: repeated string refs = 4;
     */
    refs?: string[];
    /**
     * Directory listing at `path`.
     *
     * @generated from field: repeated medallion.terminal.v1.RepositoryEntry entries = 5;
     */
    entries?: RepositoryEntryJson[];
    /**
     * File content when `path` points at a file.
     *
     * @generated from field: optional medallion.terminal.v1.RepositoryFile file = 6;
     */
    file?: RepositoryFileJson;
    /**
     * Optional host-owned repository URL.
     *
     * @generated from field: optional string url = 7;
     */
    url?: string;
};
/**
 * Describes the message medallion.terminal.v1.RepositoryPayload.
 * Use `create(RepositoryPayloadSchema)` to create a new message.
 */
export declare const RepositoryPayloadSchema: GenMessage<RepositoryPayload, {
    jsonType: RepositoryPayloadJson;
}>;
/**
 * One file/directory in a repository listing.
 *
 * @generated from message medallion.terminal.v1.RepositoryEntry
 */
export type RepositoryEntry = Message<"medallion.terminal.v1.RepositoryEntry"> & {
    /**
     * Full path from the repository root.
     *
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * Base name of the entry.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * File, directory, or symlink.
     *
     * @generated from field: medallion.terminal.v1.RepositoryEntryKind kind = 3;
     */
    kind: RepositoryEntryKind;
    /**
     * Detected language for files, when known.
     *
     * @generated from field: optional string language = 4;
     */
    language?: string | undefined;
    /**
     * File size in bytes, when known.
     *
     * @generated from field: optional int64 size_bytes = 5;
     */
    sizeBytes?: bigint | undefined;
    /**
     * ISO 8601 last-modified time, when known.
     *
     * @generated from field: optional string updated_at = 6;
     */
    updatedAt?: string | undefined;
};
/**
 * One file/directory in a repository listing.
 *
 * @generated from message medallion.terminal.v1.RepositoryEntry
 */
export type RepositoryEntryJson = {
    /**
     * Full path from the repository root.
     *
     * @generated from field: string path = 1;
     */
    path?: string;
    /**
     * Base name of the entry.
     *
     * @generated from field: string name = 2;
     */
    name?: string;
    /**
     * File, directory, or symlink.
     *
     * @generated from field: medallion.terminal.v1.RepositoryEntryKind kind = 3;
     */
    kind?: RepositoryEntryKindJson;
    /**
     * Detected language for files, when known.
     *
     * @generated from field: optional string language = 4;
     */
    language?: string;
    /**
     * File size in bytes, when known.
     *
     * @generated from field: optional int64 size_bytes = 5;
     */
    sizeBytes?: string;
    /**
     * ISO 8601 last-modified time, when known.
     *
     * @generated from field: optional string updated_at = 6;
     */
    updatedAt?: string;
};
/**
 * Describes the message medallion.terminal.v1.RepositoryEntry.
 * Use `create(RepositoryEntrySchema)` to create a new message.
 */
export declare const RepositoryEntrySchema: GenMessage<RepositoryEntry, {
    jsonType: RepositoryEntryJson;
}>;
/**
 * Text content of one file in the repository.
 *
 * @generated from message medallion.terminal.v1.RepositoryFile
 */
export type RepositoryFile = Message<"medallion.terminal.v1.RepositoryFile"> & {
    /**
     * Full path from the repository root.
     *
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * UTF-8 text content. Omitted for binary files.
     *
     * @generated from field: string content = 2;
     */
    content: string;
    /**
     * Detected language for syntax highlighting, when known.
     *
     * @generated from field: optional string language = 3;
     */
    language?: string | undefined;
    /**
     * Full file size in bytes, when known.
     *
     * @generated from field: optional int64 size_bytes = 4;
     */
    sizeBytes?: bigint | undefined;
    /**
     * True if `content` was cut short for size.
     *
     * @generated from field: bool truncated = 5;
     */
    truncated: boolean;
    /**
     * Optional raw/download URL owned by the host.
     *
     * @generated from field: optional string url = 6;
     */
    url?: string | undefined;
};
/**
 * Text content of one file in the repository.
 *
 * @generated from message medallion.terminal.v1.RepositoryFile
 */
export type RepositoryFileJson = {
    /**
     * Full path from the repository root.
     *
     * @generated from field: string path = 1;
     */
    path?: string;
    /**
     * UTF-8 text content. Omitted for binary files.
     *
     * @generated from field: string content = 2;
     */
    content?: string;
    /**
     * Detected language for syntax highlighting, when known.
     *
     * @generated from field: optional string language = 3;
     */
    language?: string;
    /**
     * Full file size in bytes, when known.
     *
     * @generated from field: optional int64 size_bytes = 4;
     */
    sizeBytes?: string;
    /**
     * True if `content` was cut short for size.
     *
     * @generated from field: bool truncated = 5;
     */
    truncated?: boolean;
    /**
     * Optional raw/download URL owned by the host.
     *
     * @generated from field: optional string url = 6;
     */
    url?: string;
};
/**
 * Describes the message medallion.terminal.v1.RepositoryFile.
 * Use `create(RepositoryFileSchema)` to create a new message.
 */
export declare const RepositoryFileSchema: GenMessage<RepositoryFile, {
    jsonType: RepositoryFileJson;
}>;
/**
 * ColumnType is the type hint for a table column.
 *
 * @generated from enum medallion.terminal.v1.ColumnType
 */
export declare enum ColumnType {
    /**
     * No type declared; rendered as text.
     *
     * @generated from enum value: COLUMN_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Free-form text.
     *
     * @generated from enum value: COLUMN_TYPE_STRING = 1;
     */
    STRING = 1,
    /**
     * Numeric; right-aligned and number-formatted.
     *
     * @generated from enum value: COLUMN_TYPE_NUMBER = 2;
     */
    NUMBER = 2,
    /**
     * True/false.
     *
     * @generated from enum value: COLUMN_TYPE_BOOLEAN = 3;
     */
    BOOLEAN = 3,
    /**
     * ISO 8601 timestamp or Unix epoch.
     *
     * @generated from enum value: COLUMN_TYPE_TIMESTAMP = 4;
     */
    TIMESTAMP = 4
}
/**
 * ColumnType is the type hint for a table column.
 *
 * @generated from enum medallion.terminal.v1.ColumnType
 */
export type ColumnTypeJson = "COLUMN_TYPE_UNSPECIFIED" | "COLUMN_TYPE_STRING" | "COLUMN_TYPE_NUMBER" | "COLUMN_TYPE_BOOLEAN" | "COLUMN_TYPE_TIMESTAMP";
/**
 * Describes the enum medallion.terminal.v1.ColumnType.
 */
export declare const ColumnTypeSchema: GenEnum<ColumnType, ColumnTypeJson>;
/**
 * EventStatus is the coarse severity/state of an event.
 *
 * @generated from enum medallion.terminal.v1.EventStatus
 */
export declare enum EventStatus {
    /**
     * No status declared; rendered neutral.
     *
     * @generated from enum value: EVENT_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Success / healthy.
     *
     * @generated from enum value: EVENT_STATUS_OK = 1;
     */
    OK = 1,
    /**
     * Degraded or partial success.
     *
     * @generated from enum value: EVENT_STATUS_WARN = 2;
     */
    WARN = 2,
    /**
     * Failure.
     *
     * @generated from enum value: EVENT_STATUS_ERROR = 3;
     */
    ERROR = 3,
    /**
     * Informational, no health signal.
     *
     * @generated from enum value: EVENT_STATUS_INFO = 4;
     */
    INFO = 4,
    /**
     * Started but not finished.
     *
     * @generated from enum value: EVENT_STATUS_PENDING = 5;
     */
    PENDING = 5
}
/**
 * EventStatus is the coarse severity/state of an event.
 *
 * @generated from enum medallion.terminal.v1.EventStatus
 */
export type EventStatusJson = "EVENT_STATUS_UNSPECIFIED" | "EVENT_STATUS_OK" | "EVENT_STATUS_WARN" | "EVENT_STATUS_ERROR" | "EVENT_STATUS_INFO" | "EVENT_STATUS_PENDING";
/**
 * Describes the enum medallion.terminal.v1.EventStatus.
 */
export declare const EventStatusSchema: GenEnum<EventStatus, EventStatusJson>;
/**
 * MediaKind distinguishes images from videos.
 *
 * @generated from enum medallion.terminal.v1.MediaKind
 */
export declare enum MediaKind {
    /**
     * No kind declared; treated as image.
     *
     * @generated from enum value: MEDIA_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Still image.
     *
     * @generated from enum value: MEDIA_KIND_IMAGE = 1;
     */
    IMAGE = 1,
    /**
     * Video with a playable URL.
     *
     * @generated from enum value: MEDIA_KIND_VIDEO = 2;
     */
    VIDEO = 2
}
/**
 * MediaKind distinguishes images from videos.
 *
 * @generated from enum medallion.terminal.v1.MediaKind
 */
export type MediaKindJson = "MEDIA_KIND_UNSPECIFIED" | "MEDIA_KIND_IMAGE" | "MEDIA_KIND_VIDEO";
/**
 * Describes the enum medallion.terminal.v1.MediaKind.
 */
export declare const MediaKindSchema: GenEnum<MediaKind, MediaKindJson>;
/**
 * RecordFieldType is the value type of a record field.
 *
 * @generated from enum medallion.terminal.v1.RecordFieldType
 */
export declare enum RecordFieldType {
    /**
     * No type declared; treated as text.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Single-line text.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_TEXT = 1;
     */
    TEXT = 1,
    /**
     * Multi-line text.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_LONG_TEXT = 2;
     */
    LONG_TEXT = 2,
    /**
     * Floating-point number.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_NUMBER = 3;
     */
    NUMBER = 3,
    /**
     * Monetary amount.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_CURRENCY = 4;
     */
    CURRENCY = 4,
    /**
     * Fraction rendered as a percentage.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_PERCENT = 5;
     */
    PERCENT = 5,
    /**
     * Checkbox.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_BOOLEAN = 6;
     */
    BOOLEAN = 6,
    /**
     * Date without time.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_DATE = 7;
     */
    DATE = 7,
    /**
     * Date and time.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_DATETIME = 8;
     */
    DATETIME = 8,
    /**
     * One choice from `choices`.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_SINGLE_SELECT = 9;
     */
    SINGLE_SELECT = 9,
    /**
     * Multiple choices from `choices`.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_MULTI_SELECT = 10;
     */
    MULTI_SELECT = 10,
    /**
     * A user reference.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_USER = 11;
     */
    USER = 11,
    /**
     * Link to records in another table (linked_table_id).
     *
     * @generated from enum value: RECORD_FIELD_TYPE_LINK = 12;
     */
    LINK = 12,
    /**
     * File attachment(s).
     *
     * @generated from enum value: RECORD_FIELD_TYPE_ATTACHMENT = 13;
     */
    ATTACHMENT = 13,
    /**
     * Web URL.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_URL = 14;
     */
    URL = 14,
    /**
     * Email address.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_EMAIL = 15;
     */
    EMAIL = 15,
    /**
     * Phone number.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_PHONE = 16;
     */
    PHONE = 16,
    /**
     * Backend-computed formula. Read-only.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_FORMULA = 17;
     */
    FORMULA = 17,
    /**
     * Backend-resolved lookup through a link. Read-only.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_LOOKUP = 18;
     */
    LOOKUP = 18,
    /**
     * Backend-computed aggregate over linked records. Read-only.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_ROLLUP = 19;
     */
    ROLLUP = 19,
    /**
     * System creation timestamp. Read-only.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_CREATED_AT = 20;
     */
    CREATED_AT = 20,
    /**
     * System last-update timestamp. Read-only.
     *
     * @generated from enum value: RECORD_FIELD_TYPE_UPDATED_AT = 21;
     */
    UPDATED_AT = 21
}
/**
 * RecordFieldType is the value type of a record field.
 *
 * @generated from enum medallion.terminal.v1.RecordFieldType
 */
export type RecordFieldTypeJson = "RECORD_FIELD_TYPE_UNSPECIFIED" | "RECORD_FIELD_TYPE_TEXT" | "RECORD_FIELD_TYPE_LONG_TEXT" | "RECORD_FIELD_TYPE_NUMBER" | "RECORD_FIELD_TYPE_CURRENCY" | "RECORD_FIELD_TYPE_PERCENT" | "RECORD_FIELD_TYPE_BOOLEAN" | "RECORD_FIELD_TYPE_DATE" | "RECORD_FIELD_TYPE_DATETIME" | "RECORD_FIELD_TYPE_SINGLE_SELECT" | "RECORD_FIELD_TYPE_MULTI_SELECT" | "RECORD_FIELD_TYPE_USER" | "RECORD_FIELD_TYPE_LINK" | "RECORD_FIELD_TYPE_ATTACHMENT" | "RECORD_FIELD_TYPE_URL" | "RECORD_FIELD_TYPE_EMAIL" | "RECORD_FIELD_TYPE_PHONE" | "RECORD_FIELD_TYPE_FORMULA" | "RECORD_FIELD_TYPE_LOOKUP" | "RECORD_FIELD_TYPE_ROLLUP" | "RECORD_FIELD_TYPE_CREATED_AT" | "RECORD_FIELD_TYPE_UPDATED_AT";
/**
 * Describes the enum medallion.terminal.v1.RecordFieldType.
 */
export declare const RecordFieldTypeSchema: GenEnum<RecordFieldType, RecordFieldTypeJson>;
/**
 * RecordViewType is how a saved view renders.
 *
 * @generated from enum medallion.terminal.v1.RecordViewType
 */
export declare enum RecordViewType {
    /**
     * No type declared; rendered as a grid.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Spreadsheet-style rows and columns.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_GRID = 1;
     */
    GRID = 1,
    /**
     * Kanban lanes grouped by group_by.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_BOARD = 2;
     */
    BOARD = 2,
    /**
     * Records placed on a calendar by date_field.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_CALENDAR = 3;
     */
    CALENDAR = 3,
    /**
     * Card gallery.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_GALLERY = 4;
     */
    GALLERY = 4,
    /**
     * Compact single-column list.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_LIST = 5;
     */
    LIST = 5,
    /**
     * Horizontal timeline by date_field.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_TIMELINE = 6;
     */
    TIMELINE = 6,
    /**
     * Data-entry form for creating records.
     *
     * @generated from enum value: RECORD_VIEW_TYPE_FORM = 7;
     */
    FORM = 7
}
/**
 * RecordViewType is how a saved view renders.
 *
 * @generated from enum medallion.terminal.v1.RecordViewType
 */
export type RecordViewTypeJson = "RECORD_VIEW_TYPE_UNSPECIFIED" | "RECORD_VIEW_TYPE_GRID" | "RECORD_VIEW_TYPE_BOARD" | "RECORD_VIEW_TYPE_CALENDAR" | "RECORD_VIEW_TYPE_GALLERY" | "RECORD_VIEW_TYPE_LIST" | "RECORD_VIEW_TYPE_TIMELINE" | "RECORD_VIEW_TYPE_FORM";
/**
 * Describes the enum medallion.terminal.v1.RecordViewType.
 */
export declare const RecordViewTypeSchema: GenEnum<RecordViewType, RecordViewTypeJson>;
/**
 * RepositoryEntryKind is the file-system type of an entry.
 *
 * @generated from enum medallion.terminal.v1.RepositoryEntryKind
 */
export declare enum RepositoryEntryKind {
    /**
     * No kind declared.
     *
     * @generated from enum value: REPOSITORY_ENTRY_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Regular file.
     *
     * @generated from enum value: REPOSITORY_ENTRY_KIND_FILE = 1;
     */
    FILE = 1,
    /**
     * Directory.
     *
     * @generated from enum value: REPOSITORY_ENTRY_KIND_DIRECTORY = 2;
     */
    DIRECTORY = 2,
    /**
     * Symbolic link.
     *
     * @generated from enum value: REPOSITORY_ENTRY_KIND_SYMLINK = 3;
     */
    SYMLINK = 3
}
/**
 * RepositoryEntryKind is the file-system type of an entry.
 *
 * @generated from enum medallion.terminal.v1.RepositoryEntryKind
 */
export type RepositoryEntryKindJson = "REPOSITORY_ENTRY_KIND_UNSPECIFIED" | "REPOSITORY_ENTRY_KIND_FILE" | "REPOSITORY_ENTRY_KIND_DIRECTORY" | "REPOSITORY_ENTRY_KIND_SYMLINK";
/**
 * Describes the enum medallion.terminal.v1.RepositoryEntryKind.
 */
export declare const RepositoryEntryKindSchema: GenEnum<RepositoryEntryKind, RepositoryEntryKindJson>;
