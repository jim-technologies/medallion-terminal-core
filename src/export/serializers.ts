// serializers — turn a FlatTable into a BI-standard byte/string payload.
//
// Three of the four formats are pure and synchronous (CSV, JSON,
// NDJSON). Parquet requires a writer library; it is loaded lazily via
// dynamic import so the ~390 KB hyparquet-writer never enters the core
// bundle unless someone actually exports Parquet (mirrors the heic2any
// lazy-load pattern).
//
// All serializers operate on the FlatTable produced by flatten() — they
// never see a raw widget payload, keeping shape-knowledge in one place.

import type { Cell, FlatTable } from './flatten'

export type ExportFormat = 'csv' | 'json' | 'ndjson' | 'parquet'

// MIME type per format — used when building a Blob / setting a download
// Content-Type. Parquet's registered type is application/vnd.apache.parquet.
export const MIME: Record<ExportFormat, string> = {
  csv: 'text/csv;charset=utf-8',
  json: 'application/json;charset=utf-8',
  ndjson: 'application/x-ndjson;charset=utf-8',
  parquet: 'application/vnd.apache.parquet',
}

export const EXTENSION: Record<ExportFormat, string> = {
  csv: 'csv',
  json: 'json',
  ndjson: 'ndjson',
  parquet: 'parquet',
}

// --- CSV ---

// RFC-4180 escaping: wrap a field in quotes when it contains a comma,
// quote, CR or LF, and double any internal quotes. null → empty field.
export function csvEscape(v: Cell): string {
  if (v == null) return ''
  const s = String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function toCsv(table: FlatTable): string {
  const { columns, rows } = table
  const head = columns.map(csvEscape).join(',')
  const body = rows.map((row) => columns.map((c) => csvEscape(row[c])).join(','))
  return [head, ...body].join('\n')
}

// --- JSON (array of row objects) ---

export function toJson(table: FlatTable): string {
  return JSON.stringify(table.rows, null, 2)
}

// --- NDJSON (newline-delimited; one JSON object per line) ---
// The streaming-friendly form BigQuery / Superset / log pipelines ingest.

export function toNdjson(table: FlatTable): string {
  return table.rows.map((row) => JSON.stringify(row)).join('\n')
}

// --- Parquet ---

// Columnar layout the writer wants: one { name, data } per column.
// Booleans/strings/numbers pass straight through; nulls are preserved.
function toColumnData(table: FlatTable): { name: string; data: Cell[] }[] {
  return table.columns.map((name) => ({
    name,
    data: table.rows.map((row) => row[name] ?? null),
  }))
}

// Write Parquet bytes. Async because the writer is dynamically imported.
// Returns a Uint8Array (the raw .parquet file) — the caller wraps it in
// a Blob for download or hands it to a BI ingest pipeline.
export async function toParquet(table: FlatTable): Promise<Uint8Array> {
  // Dynamic import keeps hyparquet-writer out of the main chunk.
  const { parquetWriteBuffer } = await import('hyparquet-writer')
  // An empty table still needs a valid (schema-only) file. The writer
  // requires at least one column to infer a schema, so synthesize a
  // placeholder column when there are none.
  const columnData =
    table.columns.length > 0
      ? toColumnData(table)
      : [{ name: 'value', data: [] as Cell[] }]
  const buffer = parquetWriteBuffer({ columnData })
  return new Uint8Array(buffer)
}

// Synchronous serialization for the text formats. Parquet is excluded
// here because it is async; call toParquet directly for that.
export function serializeText(table: FlatTable, format: Exclude<ExportFormat, 'parquet'>): string {
  switch (format) {
    case 'csv':
      return toCsv(table)
    case 'json':
      return toJson(table)
    case 'ndjson':
      return toNdjson(table)
  }
}
