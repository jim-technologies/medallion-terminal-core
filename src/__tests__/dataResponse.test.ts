import { describe, expect, it } from 'vitest'
import { unwrapDataResponse } from '../hooks/useDataSource'
import type { DataResponseJson, SourceJson } from '../proto'

describe('DataResponse json case', () => {
  it('unwraps any JSON document for the json widget', () => {
    const document: DataResponseJson = {
      json: { run: { id: 'run-7', attempts: [1, 2] }, retried: true, cost: null },
    }
    expect(unwrapDataResponse(document)).toEqual({ run: { id: 'run-7', attempts: [1, 2] }, retried: true, cost: null })
    expect(unwrapDataResponse({ json: [1, 'two', false] })).toEqual([1, 'two', false])
    expect(unwrapDataResponse({ json: 'plain text' })).toBe('plain text')
    expect(unwrapDataResponse({ json: null })).toBeNull()
  })

  it('declares the matching source shape', () => {
    // Type-checked: SHAPE_JSON is a member of the generated Shape enum.
    const source: SourceJson = { id: 'platform_manifest', shape: 'SHAPE_JSON' }
    expect(source.shape).toBe('SHAPE_JSON')
  })
})
