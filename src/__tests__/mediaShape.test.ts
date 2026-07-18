import { describe, expect, it } from 'vitest'
import {
  filterMediaItems,
  formatMediaDuration,
  groupMediaItems,
  normalizeMediaLibrary,
  safeMediaUrl,
} from '../widgets/mediaShape'

describe('media-library shape', () => {
  const library = normalizeMediaLibrary({
    total: '3',
    collections: [{ id: 'travel', name: 'Travel', item_count: '2' }],
    items: [
      {
        id: 'video-1',
        title: 'Walkthrough',
        kind: 'MEDIA_KIND_VIDEO',
        url: '/media/walkthrough.mp4',
        thumbnail_url: '/media/walkthrough.jpg',
        captured_at: '2026-07-16T18:00:00Z',
        duration_seconds: 65.4,
        favorite: true,
        collection_ids: ['travel'],
        tags: ['inspection'],
        context: { media_id: 'video-1' },
      },
      {
        id: 'photo-1',
        name: 'Coast',
        content_type: 'image/jpeg',
        url: 'https://cdn.example.com/coast.jpg',
        taken_at: '2026-07-16T12:00:00Z',
        collection_ids: ['travel'],
      },
      {
        id: 'photo-2',
        title: 'Campaign',
        type: 'photo',
        src: '/media/campaign.webp',
        created_at: '2026-06-02T09:00:00Z',
        album_ids: ['work'],
        metadata: { owner: 'Creative' },
      },
    ],
  })

  it('normalizes canonical and convenient aliases in newest-first order', () => {
    expect(library.total).toBe(3)
    expect(library.items.map(item => [item.id, item.kind])).toEqual([
      ['video-1', 'video'],
      ['photo-1', 'image'],
      ['photo-2', 'image'],
    ])
    expect(library.items[0]).toMatchObject({
      thumbnailUrl: '/media/walkthrough.jpg',
      durationSeconds: 65.4,
      favorite: true,
      context: { media_id: 'video-1' },
    })
    expect(library.collections).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'travel', name: 'Travel', itemCount: 2 }),
      expect.objectContaining({ id: 'work', name: 'Work', itemCount: 1 }),
    ]))
  })

  it('filters by kind, favorites, collection, and text metadata', () => {
    expect(filterMediaItems(library.items, { kind: 'video' }).map(item => item.id))
      .toEqual(['video-1'])
    expect(filterMediaItems(library.items, { kind: 'favorite' }).map(item => item.id))
      .toEqual(['video-1'])
    expect(filterMediaItems(library.items, { collectionId: 'work' }).map(item => item.id))
      .toEqual(['photo-2'])
    expect(filterMediaItems(library.items, { query: 'creative' }).map(item => item.id))
      .toEqual(['photo-2'])
  })

  it('groups by capture day or month and preserves undated media', () => {
    const dayGroups = groupMediaItems([
      ...library.items,
      {
        ...library.items[1],
        id: 'undated',
        capturedAt: undefined,
        createdAt: undefined,
      },
    ], 'day')
    expect(dayGroups.map(group => group.key)).toEqual([
      '2026-07-16',
      '2026-06-02',
      'undated',
    ])
    expect(groupMediaItems(library.items, 'month').map(group => group.key))
      .toEqual(['2026-07', '2026-06'])
    expect(groupMediaItems(library.items, 'none')).toHaveLength(1)
  })

  it('formats durations and rejects unsafe media URLs', () => {
    expect(formatMediaDuration(65.4)).toBe('1:05')
    expect(formatMediaDuration(3661)).toBe('1:01:01')
    expect(safeMediaUrl('/media/photo.jpg')).toBe('/media/photo.jpg')
    expect(safeMediaUrl('https://cdn.example.com/photo.jpg')).toBe('https://cdn.example.com/photo.jpg')
    expect(safeMediaUrl('//tracker.example.com/pixel')).toBeUndefined()
    expect(safeMediaUrl('javascript:alert(1)')).toBeUndefined()
  })
})
