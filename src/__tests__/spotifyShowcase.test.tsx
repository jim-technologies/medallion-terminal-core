import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  SPOTIFY_SAMPLE_COLLECTIONS,
  SPOTIFY_SAMPLE_TRACKS,
  SpotifyShowcase,
  formatSpotifyDuration,
  resolveSpotifyQueue,
  selectSpotifyContent,
  type SpotifyCollection,
  type SpotifyTrack,
} from '../../examples/clones/spotify/SpotifyShowcase'

describe('SpotifyShowcase', () => {
  it('formats playback durations without leaking invalid values', () => {
    expect(formatSpotifyDuration(222)).toBe('3:42')
    expect(formatSpotifyDuration(1934)).toBe('32:14')
    expect(formatSpotifyDuration(-2)).toBe('0:00')
  })

  it('searches neutral track and collection metadata', () => {
    const northline = selectSpotifyContent(
      SPOTIFY_SAMPLE_TRACKS,
      SPOTIFY_SAMPLE_COLLECTIONS,
      'northline',
    )
    const systems = selectSpotifyContent(
      SPOTIFY_SAMPLE_TRACKS,
      SPOTIFY_SAMPLE_COLLECTIONS,
      'systems',
    )

    expect(northline.tracks.map(track => track.id)).toContain('signal-bloom')
    expect(northline.collections.map(collection => collection.id)).toContain('northline')
    expect(systems.tracks.map(track => track.id)).toEqual(['systems-scale'])
  })

  it('projects a collection into the remaining playback queue', () => {
    const collection = SPOTIFY_SAMPLE_COLLECTIONS.find(candidate => candidate.id === 'deep-focus-jun')
    const queue = resolveSpotifyQueue(SPOTIFY_SAMPLE_TRACKS, collection, 'soft-circuit')

    expect(queue.slice(0, 3).map(track => track.id)).toEqual([
      'daylight-cache',
      'terminal-garden',
      'almost-static',
    ])
    expect(collection?.trackIds[0]).toBe('signal-bloom')
  })

  it('server-renders home, search, and library destinations', () => {
    const home = renderToStaticMarkup(<SpotifyShowcase />)
    const search = renderToStaticMarkup(
      <SpotifyShowcase initialQuery="systems" initialSidePanel={null} initialView="search" />,
    )
    const library = renderToStaticMarkup(
      <SpotifyShowcase initialSidePanel={null} initialView="library" />,
    )

    expect(home).toContain('Spotify')
    expect(home).toContain('Good afternoon')
    expect(home).toContain('Your Library')
    expect(home).toContain('Deep Focus for Jun')
    expect(search).toContain('Search results for “systems”')
    expect(search).toContain('Systems That Scale Down')
    expect(library).toContain('Playlists, albums, artists, and podcasts you saved.')
    expect(library).toContain('Jim Technologies Studio Mix')
  })

  it('renders playlist, now-playing, queue, and collaborative playback anatomy', () => {
    const playlist = renderToStaticMarkup(
      <SpotifyShowcase initialCollectionId="deep-focus-jun" initialSidePanel="now-playing" />,
    )
    const queue = renderToStaticMarkup(
      <SpotifyShowcase
        initialCollectionId="jim-studio-mix"
        initialSidePanel="queue"
        initialTrackId="soft-circuit"
      />,
    )

    expect(playlist).toContain('Low-distraction electronic and instrumental music')
    expect(playlist).toContain('Signal Bloom')
    expect(playlist).toContain('Now Playing view')
    expect(playlist).toContain('About the artist')
    expect(queue).toContain('Queue')
    expect(queue).toContain('Now playing')
    expect(queue).toContain('Next up')
    expect(queue).toContain('Start a Jam')
  })

  it('accepts host-provided catalog data without leaking sample content', () => {
    const track: SpotifyTrack = {
      id: 'host-track',
      title: 'Host Playback Item',
      artist: 'Host Artist',
      album: 'Host Album',
      durationSeconds: 125,
      artworkTone: 'blue',
    }
    const collection: SpotifyCollection = {
      id: 'host-collection',
      title: 'Host Collection',
      subtitle: 'A host-provided playlist',
      kind: 'playlist',
      trackIds: [track.id],
      owner: 'Host Owner',
    }
    const html = renderToStaticMarkup(
      <SpotifyShowcase
        collections={[collection]}
        initialCollectionId={collection.id}
        initialSidePanel={null}
        shelves={[{ id: 'host-shelf', title: 'Host Shelf', collectionIds: [collection.id] }]}
        tracks={[track]}
      />,
    )

    expect(html).toContain('Host Collection')
    expect(html).toContain('Host Playback Item')
    expect(html).not.toContain('Signal Bloom')
    expect(html).not.toContain('Northline')
  })
})
