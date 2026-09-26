import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PREVIEW_LIMITS,
  contentRangeTotal,
  decodeText,
  extensionOf,
  hasPdfSignature,
  hasRasterSignature,
  parseDelimited,
  planPreview,
  readBounded,
} from '../files/previewPolicy'

const bytes = (...values: number[]) => Uint8Array.from(values)

describe('planPreview', () => {
  it('trusts the extension first and never renders markup', () => {
    expect(planPreview('chart.PNG')).toEqual({ kind: 'image', raster: 'png' })
    expect(planPreview('scan.pdf', 'text/html')).toEqual({ kind: 'pdf' })
    expect(planPreview('page.html')).toEqual({ kind: 'code', language: 'HTML' })
    expect(planPreview('logo.svg', 'image/svg+xml')).toEqual({ kind: 'code', language: 'SVG' })
    expect(planPreview('feed.xml')).toEqual({ kind: 'code', language: 'XML' })
    expect(planPreview('report.unknown', 'text/plain')).toEqual({ kind: 'unsupported' })
    expect(planPreview('installer.exe')).toEqual({ kind: 'unsupported' })
    expect(planPreview('orders.tsv')).toEqual({ kind: 'tsv' })
    expect(planPreview('README.md')).toEqual({ kind: 'markdown' })
    expect(planPreview('clip.webm')).toEqual({ kind: 'video' })
  })

  it('reads the declared type only for files without an extension', () => {
    expect(planPreview('Dockerfile')).toEqual({ kind: 'code', language: 'Dockerfile' })
    expect(planPreview('blob-1234', 'image/jpeg; charset=binary')).toEqual({ kind: 'image', raster: 'jpeg' })
    expect(planPreview('blob-1234', 'image/svg+xml')).toEqual({ kind: 'unsupported' })
    expect(planPreview('blob-1234')).toEqual({ kind: 'unsupported' })
    expect(extensionOf('dir/archive.tar.gz')).toBe('gz')
  })
})

describe('signatures', () => {
  it('admits real magic numbers only', () => {
    expect(hasRasterSignature('png', bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe(true)
    expect(hasRasterSignature('png', new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg">'))).toBe(false)
    expect(hasRasterSignature('jpeg', bytes(0xff, 0xd8, 0xff, 0xe0))).toBe(true)
    expect(hasRasterSignature('gif', new TextEncoder().encode('GIF89a'))).toBe(true)
    expect(hasRasterSignature('gif', new TextEncoder().encode('GIF88a'))).toBe(false)
    expect(hasRasterSignature('webp', new TextEncoder().encode('RIFF\0\0\0\0WEBP'))).toBe(true)
    expect(hasPdfSignature(new TextEncoder().encode('%PDF-1.7'))).toBe(true)
    expect(hasPdfSignature(new TextEncoder().encode('<html>'))).toBe(false)
  })
})

describe('readBounded', () => {
  it('stops reading and cancels the body at the limit', async () => {
    let pulled = 0
    let cancelled = false
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1
        controller.enqueue(new Uint8Array(1000).fill(65))
        if (pulled > 100) controller.close()
      },
      cancel() {
        cancelled = true
      },
    })
    const read = await readBounded(new Response(stream), 2500)
    expect(read.bytes.length).toBe(2500)
    expect(read.truncated).toBe(true)
    expect(cancelled).toBe(true)
    expect(pulled).toBeLessThan(10)
  })

  it('reads a small body whole', async () => {
    const read = await readBounded(new Response('hello'), 100)
    expect(decodeText(read.bytes, read.truncated)).toBe('hello')
    expect(read.truncated).toBe(false)
  })

  it('drops a character cut at the limit and a byte-order mark', () => {
    const encoded = new TextEncoder().encode('﻿café')
    expect(decodeText(encoded.slice(0, encoded.length - 1), true)).toBe('caf')
    expect(decodeText(encoded, false)).toBe('café')
    expect(contentRangeTotal('bytes 0-999/5000')).toBe(5000)
    expect(contentRangeTotal(null)).toBeUndefined()
  })
})

describe('parseDelimited', () => {
  it('parses quoted fields, escaped quotes and quoted line breaks', () => {
    const table = parseDelimited('name,note\n"Acme, Inc.","said ""hi""\nthen left"\n', ',')
    expect(table.rows).toEqual([['name', 'note'], ['Acme, Inc.', 'said "hi"\nthen left']])
    expect(table.truncatedRows).toBe(false)
  })

  it('bounds rows, columns and cells', () => {
    const wide = Array.from({ length: 5 }, (_, row) => Array.from({ length: 8 }, (__, column) => `${row}-${column}`).join('\t')).join('\n')
    const table = parseDelimited(wide, '\t', { rows: 3, columns: 4, cellCharacters: 2 })
    expect(table.rows).toHaveLength(3)
    expect(table.rows[0]).toHaveLength(4)
    expect(table.rows[0]![0]).toBe('0-')
    expect(table).toMatchObject({ sourceRowCount: 5, sourceColumnCount: 8, truncatedRows: true, truncatedColumns: true, truncatedCells: true })
  })

  it('rejects malformed quoting and keeps the default limits', () => {
    expect(() => parseDelimited('a,"b\n', ',')).toThrow('not closed')
    expect(() => parseDelimited('a,b"c\n', ',')).toThrow('unquoted field')
    expect(DEFAULT_PREVIEW_LIMITS).toMatchObject({ rows: 1000, columns: 100, textBytes: 1_000_000 })
  })
})
