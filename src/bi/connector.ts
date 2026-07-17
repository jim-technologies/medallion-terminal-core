// BI connector descriptor — the typed, client-side contract an external
// BI or reporting tool consumes to point at a terminal data endpoint.
//
// IMPORTANT SCOPE: the actual SQL/DuckDB gateway lives in a separate
// backend service (NOT this repo). This module defines and documents
// the CLIENT-SIDE contract:
//   1. the typed shape of a connection descriptor,
//   2. a builder that derives it from a ListSources catalog +
//      connection info, and
//   3. helpers to render the connection settings a BI tool needs.
//
// A "descriptor" is a single JSON document a BI connector can fetch (or
// be handed) that tells it: where the endpoint is, which protocol it
// speaks, what datasets/tables exist, and each table's column schema.
// It is intentionally serializable so it can be served as a static JSON
// manifest or generated on the fly from TerminalService.ListSources.

// Canonical payload shape, as the proto-JSON wire encodes it: the
// SHAPE_* string name. Kept as a string union (not the generated enum,
// which isn't a public export) so the descriptor stays plain-JSON.
export type BiShape =
  | 'SHAPE_UNSPECIFIED'
  | 'SHAPE_TIMESERIES'
  | 'SHAPE_CANDLES'
  | 'SHAPE_TABLE'
  | 'SHAPE_METRIC'
  | 'SHAPE_GAUGE'
  | 'SHAPE_HEATMAP'
  | 'SHAPE_EVENTS'
  | 'SHAPE_DISTRIBUTION'
  | 'SHAPE_TEXT'
  | 'SHAPE_ORDERBOOK'
  | 'SHAPE_PAIRED_GRID'
  | 'SHAPE_EMBED'
  | 'SHAPE_ASSET_CATALOG'
  | 'SHAPE_OBJECT'
  | 'SHAPE_GRAPH'
  | 'SHAPE_REPOSITORY'
  | 'SHAPE_RECORD_SET'

const BI_SHAPES: readonly BiShape[] = [
  'SHAPE_UNSPECIFIED',
  'SHAPE_TIMESERIES',
  'SHAPE_CANDLES',
  'SHAPE_TABLE',
  'SHAPE_METRIC',
  'SHAPE_GAUGE',
  'SHAPE_HEATMAP',
  'SHAPE_EVENTS',
  'SHAPE_DISTRIBUTION',
  'SHAPE_TEXT',
  'SHAPE_ORDERBOOK',
  'SHAPE_PAIRED_GRID',
  'SHAPE_EMBED',
  'SHAPE_ASSET_CATALOG',
  'SHAPE_OBJECT',
  'SHAPE_GRAPH',
  'SHAPE_REPOSITORY',
  'SHAPE_RECORD_SET',
]

function normalizeBiShape(shape: unknown): BiShape | undefined {
  if (typeof shape === 'number' && Number.isInteger(shape)) return BI_SHAPES[shape]
  if (typeof shape === 'string') {
    if (/^\d+$/.test(shape)) return BI_SHAPES[Number(shape)]
    if ((BI_SHAPES as readonly string[]).includes(shape)) return shape as BiShape
  }
  return undefined
}

// The transport a BI tool uses to reach the data. Two are documented:
//   - "connect": the ConnectRPC TerminalService (Get returns a payload
//     the BI connector flattens — same flatten() this library exports).
//   - "sql": a SQL/Arrow-Flight/DuckDB HTTP gateway (served by a
//     separate backend service) for generic SQL/ODBC connectors.
export type BiProtocol = 'connect' | 'sql'

// Column data type, normalized to the small set BI tools understand.
// Derived from the canonical Shape + per-column hints; a BI connector
// maps these onto its own type system.
export type BiColumnType = 'string' | 'number' | 'integer' | 'boolean' | 'timestamp' | 'json'

export interface BiColumn {
  // Column name as it appears in the flattened table.
  name: string
  type: BiColumnType
  // Human label (falls back to name in BI UIs).
  label?: string
  // True when the column is the table's time axis (reporting / time-series
  // BI panels need to know which column is time).
  isTime?: boolean
  description?: string
}

export interface BiTable {
  // Stable table id. For "connect" protocol this is the source_id; for
  // "sql" it is the SQL table/view name.
  id: string
  name: string
  description?: string
  // The canonical payload shape this table is derived from. Lets a BI
  // connector pick the right flatten() projection for "connect" mode.
  shape?: BiShape
  // Whether the underlying source streams (live). BI tools that support
  // live panels can enable streaming for these.
  streamable?: boolean
  // Column schema. May be empty when the backend can't pre-declare it
  // (the connector then infers from a sample row).
  columns: BiColumn[]
  // Parameters the table accepts (mirrors SourceParam). For "sql" mode
  // these become bound query parameters; for "connect" mode they are
  // DataRequest.params.
  params?: BiParam[]
  tags?: string[]
}

export interface BiParam {
  key: string
  required: boolean
  type: BiColumnType
  defaultValue?: string
  enumValues?: string[]
  description?: string
}

// The top-level descriptor. Serialize this to JSON and serve it (or
// generate it from ListSources) for a BI connector to consume.
export interface BiConnectorDescriptor {
  // Descriptor schema version — bump on breaking changes so connectors
  // can guard. Starts at 1.
  version: 1
  // Display name of this connection.
  name: string
  protocol: BiProtocol
  // Base endpoint URL. For "connect": the TerminalService base (the
  // library appends /medallion.terminal.v1.TerminalService/Get). For
  // "sql": the SQL/DuckDB gateway URL served by a separate backend service.
  endpoint: string
  // The ConnectRPC service name, present for protocol "connect" so a
  // connector knows the RPC path. Constant for this library.
  service?: string
  // The fully-qualified Get RPC URL, precomputed for convenience
  // (protocol "connect" only).
  getUrl?: string
  // Optional auth hint. The library never holds secrets; this only tells
  // a BI connector WHICH scheme to use. The actual token/header is
  // configured in the BI tool by the operator.
  auth?: {
    kind: 'none' | 'bearer' | 'header'
    // For kind "header": the header name the operator sets (e.g.
    // "X-Terminal-Key"). For "bearer": always "Authorization".
    headerName?: string
  }
  tables: BiTable[]
}

const TERMINAL_SERVICE = 'medallion.terminal.v1.TerminalService'

// Map a SourceParam-ish ParamType (proto enum number or string) to a
// normalized BiColumnType. The proto enum is mirrored here so callers
// can pass either the numeric enum or the string name.
function paramTypeToBi(type: unknown): BiColumnType {
  switch (type) {
    case 2:
    case 'PARAM_TYPE_NUMBER':
      return 'number'
    case 3:
    case 'PARAM_TYPE_BOOLEAN':
      return 'boolean'
    case 4:
    case 'PARAM_TYPE_TIMESTAMP':
      return 'timestamp'
    case 7:
    case 'PARAM_TYPE_INTEGER':
      return 'integer'
    case 8:
    case 'PARAM_TYPE_DATE':
      return 'timestamp'
    default:
      return 'string'
  }
}

// Map a canonical Shape (proto enum number or string name) to the
// column schema BI tools should expect after flatten(). These mirror
// the projections in flatten.ts so the descriptor and the runtime
// flattener stay in agreement.
function shapeColumns(shape: unknown): BiColumn[] {
  const t = (name: string, isTime = false): BiColumn => ({ name, type: 'string', isTime })
  const num = (name: string): BiColumn => ({ name, type: 'number' })
  switch (shape) {
    case 1:
    case 'SHAPE_TIMESERIES':
      return [t('timestamp', true), num('value')]
    case 2:
    case 'SHAPE_CANDLES':
      return [t('timestamp', true), num('open'), num('high'), num('low'), num('close'), num('volume')]
    case 4:
    case 'SHAPE_METRIC':
      return [num('value'), num('delta'), t('unit'), t('label')]
    case 5:
    case 'SHAPE_GAUGE':
      return [num('value'), num('min'), num('max')]
    case 6:
    case 'SHAPE_HEATMAP':
      return [t('row'), t('col'), num('value'), t('label')]
    case 7:
    case 'SHAPE_EVENTS':
      return [t('timestamp', true), t('label'), t('status')]
    case 8:
    case 'SHAPE_DISTRIBUTION':
      return [t('label'), num('value')]
    case 9:
    case 'SHAPE_TEXT':
      return [t('title'), t('body'), t('source'), t('date', true)]
    case 10:
    case 'SHAPE_ORDERBOOK':
      return [t('side'), num('price'), num('size')]
    case 13:
    case 'SHAPE_ASSET_CATALOG':
      return [
        t('id'),
        t('name'),
        t('kind'),
        t('description'),
        t('owner'),
        t('status'),
        t('updated_at', true),
        { name: 'tags', type: 'json' },
        t('url'),
        { name: 'metadata', type: 'json' },
        { name: 'context', type: 'json' },
      ]
    case 14:
    case 'SHAPE_OBJECT':
      return [
        t('object_type'),
        t('object_id'),
        t('title'),
        t('description'),
        t('status'),
        t('updated_at', true),
        { name: 'tags', type: 'json' },
      ]
    case 15:
    case 'SHAPE_GRAPH':
      return [
        t('record_type'),
        t('id'),
        t('from'),
        t('to'),
        t('label'),
        t('kind'),
        t('status'),
      ]
    case 16:
    case 'SHAPE_REPOSITORY':
      return [
        t('repository'),
        t('ref'),
        t('path'),
        t('name'),
        t('kind'),
        t('language'),
        { name: 'size_bytes', type: 'integer' },
        t('updated_at', true),
      ]
    // SHAPE_TABLE / SHAPE_PAIRED_GRID / unspecified: columns are
    // data-defined; leave empty so the connector infers from a sample.
    default:
      return []
  }
}

// A trimmed view of a ListSources Source — enough to build a descriptor
// table without importing the full generated proto message type. Accepts
// generated runtime enums or ProtoJSON enum names, plus both canonical
// lowerCamelCase and legacy/proto-name parameter aliases.
export interface SourceLike {
  id: string
  name?: string
  description?: string
  shape?: unknown
  streamable?: boolean
  tags?: string[]
  params?: {
    key: string
    description?: string
    required?: boolean
    defaultValue?: string
    default_value?: string
    enumValues?: string[]
    enum_values?: string[]
    type?: unknown
  }[]
}

export interface BuildDescriptorOptions {
  name: string
  endpoint: string
  protocol?: BiProtocol
  auth?: BiConnectorDescriptor['auth']
}

// Build a connector descriptor from a ListSources catalog. This is the
// primary client-side entry point: a connection-config UI calls
// ListSources, hands the sources here, and serves/exports the result as
// the BI manifest. For protocol "connect" the Get RPC URL is precomputed.
export function buildBiDescriptor(
  sources: SourceLike[],
  options: BuildDescriptorOptions,
): BiConnectorDescriptor {
  const protocol = options.protocol ?? 'connect'
  const base = options.endpoint.replace(/\/$/, '')

  const tables: BiTable[] = sources.map((s) => {
    const shape = normalizeBiShape(s.shape)
    return {
      id: s.id,
      name: s.name ?? s.id,
      description: s.description,
      shape,
      streamable: s.streamable,
      columns: shapeColumns(shape),
      params: (s.params ?? []).map((p) => ({
        key: p.key,
        required: p.required ?? false,
        type: paramTypeToBi(p.type),
        defaultValue: p.defaultValue ?? p.default_value,
        enumValues: p.enumValues ?? p.enum_values,
        description: p.description,
      })),
      tags: s.tags,
    }
  })

  const descriptor: BiConnectorDescriptor = {
    version: 1,
    name: options.name,
    protocol,
    endpoint: base,
    auth: options.auth ?? { kind: 'none' },
    tables,
  }

  if (protocol === 'connect') {
    descriptor.service = TERMINAL_SERVICE
    descriptor.getUrl = `${base}/${TERMINAL_SERVICE}/Get`
  }

  return descriptor
}

// Render the descriptor as a pretty JSON string — what a connection-
// config UI offers for download / copy as the BI manifest file.
export function descriptorToJson(descriptor: BiConnectorDescriptor): string {
  return JSON.stringify(descriptor, null, 2)
}

// Connection settings a human pastes into a BI tool, derived from the
// descriptor. Returns label/value pairs a config UI can render as a
// copy-list (e.g. "Endpoint: …", "Method: POST", "Body template: …").
export function connectionFields(descriptor: BiConnectorDescriptor): { label: string; value: string }[] {
  const fields: { label: string; value: string }[] = [
    { label: 'Protocol', value: descriptor.protocol === 'connect' ? 'ConnectRPC (HTTP/JSON)' : 'SQL gateway' },
    { label: 'Endpoint', value: descriptor.endpoint },
  ]
  if (descriptor.protocol === 'connect' && descriptor.getUrl) {
    fields.push({ label: 'Get RPC URL', value: descriptor.getUrl })
    fields.push({ label: 'Method', value: 'POST' })
    fields.push({ label: 'Content-Type', value: 'application/json' })
    fields.push({
      label: 'Request body',
      value: '{ "source_id": "<table id>", "params": { ... } }',
    })
  }
  if (descriptor.auth && descriptor.auth.kind !== 'none') {
    fields.push({
      label: 'Auth',
      value:
        descriptor.auth.kind === 'bearer'
          ? 'Authorization: Bearer <token>'
          : `${descriptor.auth.headerName ?? 'X-Api-Key'}: <token>`,
    })
  }
  fields.push({ label: 'Tables', value: String(descriptor.tables.length) })
  return fields
}
