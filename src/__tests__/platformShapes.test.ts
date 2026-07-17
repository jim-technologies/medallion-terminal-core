import { describe, expect, it } from 'vitest'
import {
  normalizeAssetCatalog,
  normalizeGraph,
  normalizeObject,
  normalizeRepository,
} from '../widgets/platformShapes'

describe('platform payload normalizers', () => {
  it('normalizes asset catalogs from proto JSON or hand-authored snake_case', () => {
    const catalog = normalizeAssetCatalog({
      total: 1,
      next_page_token: 'next',
      items: [{
        id: 'dataset.customers',
        name: 'Customers',
        kind: 'dataset',
        updated_at: '2026-07-16T00:00:00Z',
        tags: ['gold'],
        metadata: { rows: 12 },
        context: { asset_id: 'dataset.customers' },
      }],
    })

    expect(catalog.total).toBe(1)
    expect(catalog.nextPageToken).toBe('next')
    expect(catalog.items[0]).toMatchObject({
      id: 'dataset.customers',
      updatedAt: '2026-07-16T00:00:00Z',
      context: { asset_id: 'dataset.customers' },
    })
  })

  it('normalizes semantic object properties, links, and actions', () => {
    const object = normalizeObject({
      object_type: 'Customer',
      object_id: 'cust-1',
      title: 'Acme',
      properties: [{ key: 'arr', value: 1250000, group: 'Commercial' }],
      links: [{
        relation: 'owns',
        target_type: 'Account',
        target_id: 'acct-1',
        context: { asset_id: 'account.acct-1' },
      }],
      actions: [{ id: 'open_case', confirm: true, params: { priority: 'high' } }],
    })

    expect(object?.objectType).toBe('Customer')
    expect(object?.properties[0].label).toBe('arr')
    expect(object?.links[0]).toMatchObject({
      targetType: 'Account',
      targetId: 'acct-1',
      label: 'acct-1',
    })
    expect(object?.actions[0]).toMatchObject({
      id: 'open_case',
      label: 'open_case',
      confirm: true,
      disabled: false,
    })
  })

  it('drops invalid graph edges while retaining node context', () => {
    const graph = normalizeGraph({
      nodes: [
        { id: 'a', label: 'A', context: { asset_id: 'a' } },
        { id: 'b', label: 'B' },
      ],
      edges: [
        { from: 'a', to: 'b', label: 'feeds' },
        { from: '', to: 'b' },
      ],
    })

    expect(graph?.nodes[0].context).toEqual({ asset_id: 'a' })
    expect(graph?.edges).toEqual([{ from: 'a', to: 'b', label: 'feeds', kind: undefined, status: undefined }])
  })

  it('normalizes repository enum names and file metadata', () => {
    const repository = normalizeRepository({
      repository: 'analytics',
      ref: 'main',
      path: 'src/customer.ts',
      refs: ['main'],
      entries: [
        { path: 'src', name: 'src', kind: 'REPOSITORY_ENTRY_KIND_DIRECTORY' },
        { path: 'README.md', kind: 'REPOSITORY_ENTRY_KIND_FILE', size_bytes: '42' },
      ],
      file: {
        path: 'src/customer.ts',
        content: 'export const customer = true',
        size_bytes: 28,
        truncated: true,
      },
    })

    expect(repository?.entries).toEqual([
      expect.objectContaining({ path: 'src', kind: 'directory' }),
      expect.objectContaining({ path: 'README.md', name: 'README.md', kind: 'file', sizeBytes: 42 }),
    ])
    expect(repository?.file).toMatchObject({
      path: 'src/customer.ts',
      sizeBytes: 28,
      truncated: true,
    })
  })

  it('normalizes numeric repository enum values from protobuf runtimes', () => {
    const repository = normalizeRepository({
      repository: 'numeric-enums',
      entries: [
        { path: 'file.ts', kind: 1 },
        { path: 'src', kind: 2 },
        { path: 'current', kind: 3 },
      ],
    })
    expect(repository?.entries.map(entry => entry.kind)).toEqual([
      'file',
      'directory',
      'symlink',
    ])
  })
})
