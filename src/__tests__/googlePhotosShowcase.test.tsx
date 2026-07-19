import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  GOOGLE_PHOTOS_SAMPLE_COLLECTIONS,
  GOOGLE_PHOTOS_SAMPLE_ITEMS,
  GooglePhotosShowcase,
  selectGooglePhotosItems,
  type GooglePhotosItem,
} from '../../examples/clones/google/photos/GooglePhotosShowcase'

describe('GooglePhotosShowcase', () => {
  it('projects the neutral media records into Photos destinations', () => {
    const favorites = selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'favorites')
    const videos = selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'videos')
    const archive = selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'archive')
    const trash = selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'trash')

    expect(favorites.length).toBeGreaterThan(3)
    expect(favorites.every(item => item.favorite && !item.trashed)).toBe(true)
    expect(videos.every(item => item.kind === 'video')).toBe(true)
    expect(archive.map(item => item.id)).toEqual(['archive-scan'])
    expect(trash.map(item => item.id)).toEqual(['discarded-frame'])
  })

  it('searches across titles, tags, people, and places', () => {
    expect(
      selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'photos', 'coast')
        .map(item => item.id),
    ).toEqual(['golden-coast', 'coastal-clip'])
    expect(
      selectGooglePhotosItems(GOOGLE_PHOTOS_SAMPLE_ITEMS, 'photos', 'Lina')
        .map(item => item.id),
    ).toEqual(['evening-city', 'studio-board', 'team-harbor'])
  })

  it('server-renders the complete Photos application anatomy', () => {
    const html = renderToStaticMarkup(<GooglePhotosShowcase />)

    expect(html).toContain('Ask Photos or search your library')
    expect(html).toContain('Memories')
    expect(html).toContain('Golden coast')
    expect(html).toContain('Collections')
    expect(html).toContain('8.4 GB of 15 GB used')
    expect(html).toContain('Account: Jun')
  })

  it('renders collection and immersive viewer states', () => {
    const collections = renderToStaticMarkup(
      <GooglePhotosShowcase initialSection="collections" />,
    )
    const viewer = renderToStaticMarkup(
      <GooglePhotosShowcase initialSelectedId="golden-coast" initialDetailsOpen />,
    )

    expect(collections).toContain('Your library')
    expect(collections).toContain(GOOGLE_PHOTOS_SAMPLE_COLLECTIONS[0].name)
    expect(viewer).toContain('Viewing Golden coast')
    expect(viewer).toContain('Half Moon Bay, California')
  })

  it('accepts host-provided neutral media without changing the product shell', () => {
    const item: GooglePhotosItem = {
      id: 'customer-photo',
      title: 'Customer site visit',
      kind: 'image',
      url: '/examples/media-demo.svg#studio',
      capturedAt: '2026-07-17T18:00:00Z',
      favorite: false,
      tags: ['customer'],
      collectionIds: [],
      metadata: {},
      context: {},
    }
    const html = renderToStaticMarkup(
      <GooglePhotosShowcase items={[item]} collections={[]} showMemories={false} />,
    )

    expect(html).toContain('Customer site visit')
    expect(html).not.toContain('Golden coast')
  })
})
