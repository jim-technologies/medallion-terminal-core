import { useEffect, useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import './SpotifyShowcase.css'

export type SpotifyView = 'home' | 'search' | 'library' | 'playlist'
export type SpotifySidePanel = 'now-playing' | 'queue' | null
export type SpotifyArtworkTone =
  | 'emerald'
  | 'violet'
  | 'coral'
  | 'cyan'
  | 'amber'
  | 'blue'
  | 'rose'
  | 'slate'

// This product showcase consumes a neutral music-catalog vocabulary. Audio
// delivery, rights, recommendations, and persistence remain host concerns.
export interface SpotifyTrack {
  id: string
  title: string
  artist: string
  album: string
  durationSeconds: number
  artworkTone?: SpotifyArtworkTone
  artworkUrl?: string
  liked?: boolean
  explicit?: boolean
  addedAt?: string
  plays?: string
}

export interface SpotifyCollection {
  id: string
  title: string
  subtitle: string
  kind: 'playlist' | 'album' | 'artist' | 'podcast'
  trackIds: readonly string[]
  artworkTone?: SpotifyArtworkTone
  artworkUrl?: string
  owner?: string
  description?: string
  followers?: string
  pinned?: boolean
}

export interface SpotifyShelf {
  id: string
  title: string
  collectionIds: readonly string[]
}

export interface SpotifyShowcaseProps {
  tracks?: readonly SpotifyTrack[]
  collections?: readonly SpotifyCollection[]
  shelves?: readonly SpotifyShelf[]
  initialView?: SpotifyView
  initialQuery?: string
  initialCollectionId?: string
  initialTrackId?: string
  initialSidePanel?: SpotifySidePanel
  onPlay?: (track: SpotifyTrack) => void
  onSelectCollection?: (collection: SpotifyCollection) => void
  onToggleLike?: (track: SpotifyTrack, liked: boolean) => void
}

export const SPOTIFY_SAMPLE_TRACKS: readonly SpotifyTrack[] = [
  {
    id: 'signal-bloom',
    title: 'Signal Bloom',
    artist: 'Northline',
    album: 'Quiet Machinery',
    durationSeconds: 222,
    artworkTone: 'emerald',
    liked: true,
    addedAt: '2 days ago',
    plays: '18,402,119',
  },
  {
    id: 'relay-stations',
    title: 'Relay Stations',
    artist: 'Aster Vale',
    album: 'Night Geometry',
    durationSeconds: 248,
    artworkTone: 'violet',
    addedAt: '4 days ago',
    plays: '7,813,205',
  },
  {
    id: 'soft-circuit',
    title: 'Soft Circuit',
    artist: 'Mori & June',
    album: 'Soft Circuit',
    durationSeconds: 198,
    artworkTone: 'cyan',
    liked: true,
    addedAt: '1 week ago',
    plays: '12,923,410',
  },
  {
    id: 'daylight-cache',
    title: 'Daylight Cache',
    artist: 'Harbors',
    album: 'Open Windows',
    durationSeconds: 177,
    artworkTone: 'amber',
    addedAt: '1 week ago',
    plays: '4,205,811',
  },
  {
    id: 'terminal-garden',
    title: 'Terminal Garden',
    artist: 'Channel North',
    album: 'Field Recordings',
    durationSeconds: 312,
    artworkTone: 'blue',
    addedAt: '2 weeks ago',
    plays: '9,542,808',
  },
  {
    id: 'almost-static',
    title: 'Almost Static',
    artist: 'Low Meridian',
    album: 'Peripheral Light',
    durationSeconds: 211,
    artworkTone: 'slate',
    addedAt: '2 weeks ago',
    plays: '2,991,145',
  },
  {
    id: 'warm-start',
    title: 'Warm Start',
    artist: 'Juniper Field',
    album: 'Useful Weather',
    durationSeconds: 264,
    artworkTone: 'coral',
    liked: true,
    addedAt: '3 weeks ago',
    plays: '6,440,321',
  },
  {
    id: 'long-form',
    title: 'Long Form',
    artist: 'Riverline',
    album: 'Ways of Working',
    durationSeconds: 362,
    artworkTone: 'rose',
    addedAt: '1 month ago',
    plays: '3,108,771',
  },
  {
    id: 'atlas-small-things',
    title: 'Atlas of Small Things',
    artist: 'Common Hours',
    album: 'Local Time',
    durationSeconds: 230,
    artworkTone: 'amber',
    liked: true,
    addedAt: '1 month ago',
    plays: '11,240,094',
  },
  {
    id: 'late-deploy',
    title: 'Late Deploy',
    artist: 'The Operators',
    album: 'After Hours',
    durationSeconds: 280,
    artworkTone: 'violet',
    addedAt: '1 month ago',
    plays: '1,801,311',
  },
  {
    id: 'makers-notes',
    title: 'Makers, Notes, and Useful Constraints',
    artist: 'Builders at Work',
    album: 'Builders at Work',
    durationSeconds: 1934,
    artworkTone: 'emerald',
    addedAt: 'Yesterday',
  },
  {
    id: 'systems-scale',
    title: 'Systems That Scale Down',
    artist: 'Builders at Work',
    album: 'Builders at Work',
    durationSeconds: 2462,
    artworkTone: 'blue',
    addedAt: '1 week ago',
  },
]

export const SPOTIFY_SAMPLE_COLLECTIONS: readonly SpotifyCollection[] = [
  {
    id: 'deep-focus-jun',
    title: `Deep Focus for ${CLONE_DEMO_IDENTITY.user}`,
    subtitle: 'Instrumental focus selected around your listening',
    kind: 'playlist',
    trackIds: ['signal-bloom', 'relay-stations', 'soft-circuit', 'daylight-cache', 'terminal-garden', 'almost-static', 'warm-start', 'long-form'],
    artworkTone: 'emerald',
    owner: 'Spotify',
    description: 'Low-distraction electronic and instrumental music for long stretches of focused work.',
    followers: '2,184,320 saves',
    pinned: true,
  },
  {
    id: 'jim-studio-mix',
    title: `${CLONE_DEMO_IDENTITY.company} Studio Mix`,
    subtitle: 'Northline, Aster Vale, Mori & June and more',
    kind: 'playlist',
    trackIds: ['soft-circuit', 'signal-bloom', 'warm-start', 'atlas-small-things', 'relay-stations', 'late-deploy'],
    artworkTone: 'violet',
    owner: CLONE_DEMO_IDENTITY.user,
    description: 'A shared studio rotation for design reviews, late prototypes, and calm launches.',
    followers: '18 saves',
    pinned: true,
  },
  {
    id: 'discover-current',
    title: 'Discovery Current',
    subtitle: `Your weekly mix of fresh music, made for ${CLONE_DEMO_IDENTITY.user}`,
    kind: 'playlist',
    trackIds: ['daylight-cache', 'terminal-garden', 'late-deploy', 'long-form', 'almost-static', 'atlas-small-things'],
    artworkTone: 'blue',
    owner: 'Spotify',
    description: 'A rotating selection based on the music you return to.',
  },
  {
    id: 'morning-systems',
    title: 'Morning Systems',
    subtitle: 'A clear start with warm electronics and soft rhythm',
    kind: 'playlist',
    trackIds: ['daylight-cache', 'soft-circuit', 'atlas-small-things', 'warm-start'],
    artworkTone: 'amber',
    owner: 'Spotify',
  },
  {
    id: 'quiet-machinery',
    title: 'Quiet Machinery',
    subtitle: 'Northline · 2026',
    kind: 'album',
    trackIds: ['signal-bloom', 'almost-static', 'terminal-garden', 'long-form'],
    artworkTone: 'slate',
    owner: 'Northline',
    description: 'An album about motion you can hear only after everything else gets quiet.',
  },
  {
    id: 'northline',
    title: 'Northline',
    subtitle: 'Artist',
    kind: 'artist',
    trackIds: ['signal-bloom', 'almost-static', 'terminal-garden'],
    artworkTone: 'cyan',
    owner: 'Northline',
  },
  {
    id: 'after-hours',
    title: 'After Hours',
    subtitle: 'Low light, steady tempo, no rush',
    kind: 'playlist',
    trackIds: ['late-deploy', 'relay-stations', 'long-form', 'terminal-garden'],
    artworkTone: 'rose',
    owner: 'Spotify',
  },
  {
    id: 'useful-weather',
    title: 'Useful Weather',
    subtitle: 'Juniper Field · 2026',
    kind: 'album',
    trackIds: ['warm-start', 'daylight-cache', 'atlas-small-things'],
    artworkTone: 'coral',
    owner: 'Juniper Field',
  },
  {
    id: 'builders-at-work',
    title: 'Builders at Work',
    subtitle: 'Practical conversations with people making useful things',
    kind: 'podcast',
    trackIds: ['makers-notes', 'systems-scale'],
    artworkTone: 'emerald',
    owner: `${CLONE_DEMO_IDENTITY.company} Radio`,
    description: 'A weekly conversation about tools, teams, and durable businesses.',
    pinned: true,
  },
  {
    id: 'local-time',
    title: 'Local Time',
    subtitle: 'Common Hours · 2025',
    kind: 'album',
    trackIds: ['atlas-small-things', 'soft-circuit', 'daylight-cache'],
    artworkTone: 'amber',
    owner: 'Common Hours',
  },
]

export const SPOTIFY_SAMPLE_SHELVES: readonly SpotifyShelf[] = [
  {
    id: 'made-for-you',
    title: `Made for ${CLONE_DEMO_IDENTITY.user}`,
    collectionIds: ['deep-focus-jun', 'discover-current', 'jim-studio-mix', 'morning-systems', 'after-hours'],
  },
  {
    id: 'recently-played',
    title: 'Recently played',
    collectionIds: ['quiet-machinery', 'northline', 'useful-weather', 'builders-at-work', 'local-time'],
  },
  {
    id: 'episodes-for-you',
    title: 'Shows to try',
    collectionIds: ['builders-at-work', 'jim-studio-mix', 'deep-focus-jun', 'discover-current'],
  },
]

export function formatSpotifyDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`
}

export function selectSpotifyContent(
  tracks: readonly SpotifyTrack[],
  collections: readonly SpotifyCollection[],
  query: string,
): { tracks: SpotifyTrack[]; collections: SpotifyCollection[] } {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return { tracks: [...tracks], collections: [...collections] }

  return {
    tracks: tracks.filter(track => [track.title, track.artist, track.album]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalized)),
    collections: collections.filter(collection => [
      collection.title,
      collection.subtitle,
      collection.owner,
      collection.description,
      collection.kind,
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalized)),
  }
}

export function resolveSpotifyQueue(
  tracks: readonly SpotifyTrack[],
  collection: SpotifyCollection | undefined,
  currentTrackId: string,
): SpotifyTrack[] {
  if (!collection) return tracks.filter(track => track.id !== currentTrackId)
  const byId = new Map(tracks.map(track => [track.id, track]))
  const ordered = collection.trackIds
    .map(id => byId.get(id))
    .filter((track): track is SpotifyTrack => Boolean(track))
  const currentIndex = ordered.findIndex(track => track.id === currentTrackId)
  return currentIndex < 0 ? ordered : ordered.slice(currentIndex + 1)
}

type SpotifyIconName =
  | 'home'
  | 'search'
  | 'library'
  | 'plus'
  | 'arrow-left'
  | 'arrow-right'
  | 'play'
  | 'pause'
  | 'heart'
  | 'more'
  | 'download'
  | 'clock'
  | 'list'
  | 'grid'
  | 'queue'
  | 'device'
  | 'volume'
  | 'expand'
  | 'shuffle'
  | 'previous'
  | 'next'
  | 'repeat'
  | 'close'
  | 'pin'
  | 'check'

const SPOTIFY_ICON_PATHS: Record<SpotifyIconName, string> = {
  home: 'M3 10.7 12 3l9 7.7V21h-6v-6H9v6H3V10.7Z',
  search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  library: 'M4 4v16M9 4v16m4-15 7 14M14 5l3-1 7 14-3 1-7-14Z',
  plus: 'M12 5v14M5 12h14',
  'arrow-left': 'm15 18-6-6 6-6',
  'arrow-right': 'm9 18 6-6-6-6',
  play: 'm8 5 11 7-11 7V5Z',
  pause: 'M8 5h3v14H8V5Zm5 0h3v14h-3V5Z',
  heart: 'M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  download: 'M12 3v12m-5-5 5 5 5-5M5 21h14',
  clock: 'M12 7v5l3 2m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  list: 'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  queue: 'M4 6h12M4 11h12M4 16h8m5-2v7l5-3.5-5-3.5Z',
  device: 'M4 5h16v11H4V5Zm5 16h6m-3-5v5',
  volume: 'M11 5 6 9H2v6h4l5 4V5Zm4 4a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12',
  expand: 'M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5',
  shuffle: 'M3 7h3c5 0 5 10 10 10h5m-4-4 4 4-4 4M3 17h3c2.4 0 3.7-2.3 5-4.7M16 7h5m-4-4 4 4-4 4',
  previous: 'M6 5v14m13-14-10 7 10 7V5Z',
  next: 'M18 5v14M5 5l10 7-10 7V5Z',
  repeat: 'm17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15m-14 16-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3',
  close: 'M18 6 6 18M6 6l12 12',
  pin: 'm14 4 6 6-3 1-4 4-1 5-2-2-2-2-4-2 5-1 4-4 1-3Z',
  check: 'm5 12 4 4L19 6',
}

function SpotifyIcon({ name, size = 22 }: { name: SpotifyIconName; size?: number }) {
  const filled = ['home', 'play', 'pause', 'previous', 'next', 'grid'].includes(name)
  return (
    <svg aria-hidden="true" fill={filled ? 'currentColor' : 'none'} height={size} viewBox="0 0 24 24" width={size}>
      <path
        d={SPOTIFY_ICON_PATHS[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={filled ? 0 : 1.8}
      />
    </svg>
  )
}

function SpotifyBrand() {
  return (
    <span aria-label="Spotify" className="spt-brand">
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="currentColor" r="15" />
        <path d="M8 12.5c5.6-1.7 11.7-1.3 16.5 1.2M9.2 17c4.8-1.3 9.8-.9 14 1.1M10.2 21c3.9-1 8-.7 11.5.9" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="2" />
      </svg>
      <b>Spotify</b>
    </span>
  )
}

function IconButton({
  active = false,
  icon,
  label,
  onClick,
  small = false,
}: {
  active?: boolean
  icon: SpotifyIconName
  label: string
  onClick?: () => void
  small?: boolean
}) {
  return (
    <button
      aria-label={label}
      className={`spt-icon-button ${active ? 'is-active' : ''} ${small ? 'is-small' : ''}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <SpotifyIcon name={icon} size={small ? 18 : 22} />
    </button>
  )
}

function collectionKindLabel(collection: SpotifyCollection): string {
  return collection.kind === 'podcast'
    ? 'Podcast'
    : collection.kind.charAt(0).toUpperCase() + collection.kind.slice(1)
}

function SpotifyArtwork({
  collection,
  size = 'card',
  track,
}: {
  collection?: SpotifyCollection
  size?: 'small' | 'card' | 'hero' | 'panel'
  track?: SpotifyTrack
}) {
  const tone = collection?.artworkTone ?? track?.artworkTone ?? 'slate'
  const imageUrl = collection?.artworkUrl ?? track?.artworkUrl
  const label = collection?.title ?? track?.album ?? 'Music'
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
  return (
    <span
      aria-hidden="true"
      className={`spt-artwork is-${tone} is-${size}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {!imageUrl && <span className="spt-artwork__shape" />}
      {!imageUrl && <b>{initials}</b>}
    </span>
  )
}

function SpotifySidebar({
  collections,
  view,
  onSelectCollection,
  onViewChange,
}: {
  collections: readonly SpotifyCollection[]
  view: SpotifyView
  onSelectCollection: (collection: SpotifyCollection) => void
  onViewChange: (view: SpotifyView) => void
}) {
  return (
    <aside className="spt-sidebar">
      <section className="spt-sidebar__primary">
        <SpotifyBrand />
        <nav aria-label="Spotify primary navigation">
          <button className={view === 'home' ? 'is-active' : ''} onClick={() => onViewChange('home')} type="button">
            <SpotifyIcon name="home" /> <span>Home</span>
          </button>
          <button className={view === 'search' ? 'is-active' : ''} onClick={() => onViewChange('search')} type="button">
            <SpotifyIcon name="search" /> <span>Search</span>
          </button>
        </nav>
      </section>
      <section className="spt-library-panel">
        <header>
          <button className={view === 'library' ? 'is-active' : ''} onClick={() => onViewChange('library')} type="button">
            <SpotifyIcon name="library" />
            <span>Your Library</span>
          </button>
          <IconButton icon="plus" label="Create playlist or folder" small />
          <IconButton icon="arrow-right" label="Show more of Your Library" small />
        </header>
        <div className="spt-library-panel__filters">
          <button type="button">Playlists</button>
          <button type="button">Artists</button>
          <button type="button">Podcasts</button>
        </div>
        <div className="spt-library-panel__tools">
          <IconButton icon="search" label="Search in Your Library" small />
          <button type="button">Recents <SpotifyIcon name="list" size={16} /></button>
        </div>
        <div className="spt-library-list">
          {collections.slice(0, 8).map(collection => (
            <button key={collection.id} onClick={() => onSelectCollection(collection)} type="button">
              <SpotifyArtwork collection={collection} size="small" />
              <span>
                <strong>{collection.title}</strong>
                <small>
                  {collection.pinned && <SpotifyIcon name="pin" size={12} />}
                  {collectionKindLabel(collection)}
                  {collection.owner ? ` · ${collection.owner}` : ''}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

function SpotifyTopbar({
  query,
  view,
  onQueryChange,
  onViewChange,
}: {
  query: string
  view: SpotifyView
  onQueryChange: (query: string) => void
  onViewChange: (view: SpotifyView) => void
}) {
  return (
    <header className="spt-topbar">
      <div className="spt-history">
        <IconButton icon="arrow-left" label="Go back" small />
        <IconButton icon="arrow-right" label="Go forward" small />
      </div>
      {view !== 'search' && (
        <div className="spt-topbar__mobile-context">
          {view === 'home' ? <SpotifyBrand /> : <strong>{view === 'library' ? 'Your Library' : 'Playlist'}</strong>}
        </div>
      )}
      <label className={`spt-global-search ${view === 'search' ? 'is-visible' : ''}`}>
        <SpotifyIcon name="search" size={20} />
        <input
          aria-label="What do you want to play?"
          onChange={event => {
            onQueryChange(event.target.value)
            onViewChange('search')
          }}
          placeholder="What do you want to play?"
          value={query}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => onQueryChange('')} type="button">
            <SpotifyIcon name="close" size={18} />
          </button>
        )}
      </label>
      <div className="spt-topbar__account">
        <button className="spt-install" type="button"><SpotifyIcon name="download" size={16} /> Install App</button>
        <button aria-label={`${CLONE_DEMO_IDENTITY.user} account`} className="spt-avatar" type="button">J</button>
      </div>
    </header>
  )
}

function CollectionCard({
  collection,
  onPlay,
  onSelect,
}: {
  collection: SpotifyCollection
  onPlay: (collection: SpotifyCollection) => void
  onSelect: (collection: SpotifyCollection) => void
}) {
  return (
    <article className="spt-card">
      <button className="spt-card__select" onClick={() => onSelect(collection)} type="button">
        <SpotifyArtwork collection={collection} />
        <strong>{collection.title}</strong>
        <span>{collection.subtitle}</span>
      </button>
      <button aria-label={`Play ${collection.title}`} className="spt-play-fab" onClick={() => onPlay(collection)} type="button">
        <SpotifyIcon name="play" size={24} />
      </button>
    </article>
  )
}

function SpotifyHome({
  collections,
  shelves,
  onPlayCollection,
  onSelectCollection,
}: {
  collections: readonly SpotifyCollection[]
  shelves: readonly SpotifyShelf[]
  onPlayCollection: (collection: SpotifyCollection) => void
  onSelectCollection: (collection: SpotifyCollection) => void
}) {
  const byId = new Map(collections.map(collection => [collection.id, collection]))
  const quickAccess = collections.slice(0, 6)
  return (
    <div className="spt-home">
      <div className="spt-home__wash" />
      <div className="spt-home__content">
        <div className="spt-filter-chips" aria-label="Content filters">
          <button className="is-active" type="button">All</button>
          <button type="button">Music</button>
          <button type="button">Podcasts</button>
          <button type="button">Audiobooks</button>
        </div>
        <h1>Good afternoon</h1>
        <section className="spt-quick-grid" aria-label="Quick access">
          {quickAccess.map(collection => (
            <article key={collection.id}>
              <button onClick={() => onSelectCollection(collection)} type="button">
                <SpotifyArtwork collection={collection} size="small" />
                <strong>{collection.title}</strong>
              </button>
              <button aria-label={`Play ${collection.title}`} onClick={() => onPlayCollection(collection)} type="button">
                <SpotifyIcon name="play" size={21} />
              </button>
            </article>
          ))}
        </section>
        {shelves.map(shelf => {
          const shelfCollections = shelf.collectionIds
            .map(id => byId.get(id))
            .filter((collection): collection is SpotifyCollection => Boolean(collection))
          if (shelfCollections.length === 0) return null
          return (
            <section className="spt-shelf" key={shelf.id}>
              <header>
                <button type="button"><h2>{shelf.title}</h2></button>
                <button type="button">Show all</button>
              </header>
              <div className="spt-card-grid">
                {shelfCollections.map(collection => (
                  <CollectionCard
                    collection={collection}
                    key={collection.id}
                    onPlay={onPlayCollection}
                    onSelect={onSelectCollection}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

const BROWSE_CATEGORIES: readonly { label: string; tone: SpotifyArtworkTone }[] = [
  { label: 'Made For You', tone: 'violet' },
  { label: 'New Releases', tone: 'emerald' },
  { label: 'Productivity', tone: 'blue' },
  { label: 'Podcasts', tone: 'coral' },
  { label: 'Live Events', tone: 'rose' },
  { label: 'Indie', tone: 'amber' },
  { label: 'Electronic', tone: 'cyan' },
  { label: 'Wellness', tone: 'slate' },
]

function CompactTrackRow({
  liked,
  track,
  onPlay,
  onToggleLike,
}: {
  liked: boolean
  track: SpotifyTrack
  onPlay: (track: SpotifyTrack) => void
  onToggleLike: (track: SpotifyTrack) => void
}) {
  return (
    <div className="spt-compact-track">
      <button aria-label={`Play ${track.title}`} onClick={() => onPlay(track)} type="button">
        <SpotifyArtwork size="small" track={track} />
        <span><strong>{track.title}</strong><small>{track.artist}</small></span>
      </button>
      <span>{track.album}</span>
      <IconButton active={liked} icon="heart" label={liked ? `Remove ${track.title} from Liked Songs` : `Save ${track.title}`} onClick={() => onToggleLike(track)} small />
      <time>{formatSpotifyDuration(track.durationSeconds)}</time>
      <IconButton icon="more" label={`More options for ${track.title}`} small />
    </div>
  )
}

function SpotifySearch({
  collections,
  likedIds,
  query,
  tracks,
  onPlay,
  onSelectCollection,
  onToggleLike,
}: {
  collections: readonly SpotifyCollection[]
  likedIds: ReadonlySet<string>
  query: string
  tracks: readonly SpotifyTrack[]
  onPlay: (track: SpotifyTrack) => void
  onSelectCollection: (collection: SpotifyCollection) => void
  onToggleLike: (track: SpotifyTrack) => void
}) {
  const results = selectSpotifyContent(tracks, collections, query)
  if (!query.trim()) {
    return (
      <div className="spt-search-page">
        <h1>Browse all</h1>
        <div className="spt-browse-grid">
          {BROWSE_CATEGORIES.map(category => (
            <button className={`is-${category.tone}`} key={category.label} type="button">
              <strong>{category.label}</strong>
              <span>{category.label.slice(0, 2).toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const topTrack = results.tracks[0]
  const topCollection = results.collections[0]
  return (
    <div className="spt-search-page">
      <h1>Search results for “{query.trim()}”</h1>
      {(topTrack || topCollection) ? (
        <>
          <section className="spt-search-top">
            <div>
              <h2>Top result</h2>
              <button onClick={() => topTrack ? onPlay(topTrack) : topCollection && onSelectCollection(topCollection)} type="button">
                {topTrack
                  ? <SpotifyArtwork size="hero" track={topTrack} />
                  : <SpotifyArtwork collection={topCollection} size="hero" />}
                <strong>{topTrack?.title ?? topCollection?.title}</strong>
                <span>{topTrack ? `Song · ${topTrack.artist}` : `${collectionKindLabel(topCollection as SpotifyCollection)} · ${topCollection?.owner ?? ''}`}</span>
                <i><SpotifyIcon name="play" size={24} /></i>
              </button>
            </div>
            <div>
              <h2>Songs</h2>
              <div className="spt-search-tracks">
                {results.tracks.slice(0, 4).map(track => (
                  <CompactTrackRow
                    key={track.id}
                    liked={likedIds.has(track.id)}
                    onPlay={onPlay}
                    onToggleLike={onToggleLike}
                    track={track}
                  />
                ))}
              </div>
            </div>
          </section>
          {results.collections.length > 0 && (
            <section className="spt-shelf spt-search-shelf">
              <header><h2>Artists, albums, and playlists</h2></header>
              <div className="spt-card-grid">
                {results.collections.slice(0, 5).map(collection => (
                  <CollectionCard collection={collection} key={collection.id} onPlay={() => {
                    const track = tracks.find(candidate => collection.trackIds.includes(candidate.id))
                    if (track) onPlay(track)
                  }} onSelect={onSelectCollection} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="spt-no-results">
          <SpotifyIcon name="search" size={42} />
          <strong>No results found for “{query.trim()}”</strong>
          <span>Check the spelling or try fewer words.</span>
        </div>
      )}
    </div>
  )
}

function SpotifyLibrary({
  collections,
  onSelectCollection,
}: {
  collections: readonly SpotifyCollection[]
  onSelectCollection: (collection: SpotifyCollection) => void
}) {
  return (
    <div className="spt-library-page">
      <header>
        <div>
          <h1>Your Library</h1>
          <p>Playlists, albums, artists, and podcasts you saved.</p>
        </div>
        <div><IconButton icon="search" label="Search Your Library" /><IconButton icon="grid" label="Grid view" /></div>
      </header>
      <div className="spt-filter-chips">
        <button className="is-active" type="button">All</button>
        <button type="button">Playlists</button>
        <button type="button">Albums</button>
        <button type="button">Artists</button>
        <button type="button">Podcasts</button>
      </div>
      <div className="spt-library-table__header">
        <span>Title</span><span>Added</span><span>Played</span><span>Downloaded</span>
      </div>
      <div className="spt-library-table">
        {collections.map((collection, index) => (
          <button key={collection.id} onClick={() => onSelectCollection(collection)} type="button">
            <span className="spt-library-table__title">
              <SpotifyArtwork collection={collection} size="small" />
              <span><strong>{collection.title}</strong><small>{collectionKindLabel(collection)} · {collection.owner ?? collection.subtitle}</small></span>
            </span>
            <span>{index < 3 ? 'This month' : 'Earlier'}</span>
            <span>{index % 2 === 0 ? 'Recently' : 'This year'}</span>
            <span>{index < 2 ? <SpotifyIcon name="check" size={16} /> : '—'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SpotifyPlaylist({
  collection,
  likedIds,
  tracks,
  onPlay,
  onToggleLike,
}: {
  collection: SpotifyCollection
  likedIds: ReadonlySet<string>
  tracks: readonly SpotifyTrack[]
  onPlay: (track: SpotifyTrack) => void
  onToggleLike: (track: SpotifyTrack) => void
}) {
  const byId = new Map(tracks.map(track => [track.id, track]))
  const collectionTracks = collection.trackIds
    .map(id => byId.get(id))
    .filter((track): track is SpotifyTrack => Boolean(track))
  const totalSeconds = collectionTracks.reduce((total, track) => total + track.durationSeconds, 0)
  return (
    <div className={`spt-playlist is-${collection.artworkTone ?? 'slate'}`}>
      <header className="spt-playlist__hero">
        <SpotifyArtwork collection={collection} size="hero" />
        <div>
          <small>{collectionKindLabel(collection)}</small>
          <h1>{collection.title}</h1>
          <p>{collection.description ?? collection.subtitle}</p>
          <span><b>{collection.owner ?? CLONE_DEMO_IDENTITY.user}</b> · {collectionTracks.length} songs, {Math.max(1, Math.round(totalSeconds / 60))} min</span>
        </div>
      </header>
      <section className="spt-playlist__body">
        <div className="spt-playlist__actions">
          <button aria-label={`Play ${collection.title}`} className="spt-play-fab is-large" onClick={() => collectionTracks[0] && onPlay(collectionTracks[0])} type="button">
            <SpotifyIcon name="play" size={30} />
          </button>
          <IconButton icon="download" label={`Download ${collection.title}`} />
          <IconButton icon="more" label={`More options for ${collection.title}`} />
          <button className="spt-playlist__list-mode" type="button">List <SpotifyIcon name="list" size={17} /></button>
        </div>
        <div className="spt-track-table__header">
          <span>#</span><span>Title</span><span>Album</span><span>Date added</span><SpotifyIcon name="clock" size={17} />
        </div>
        <div className="spt-track-table">
          {collectionTracks.map((track, index) => (
            <div className="spt-track-row" key={track.id}>
              <button aria-label={`Play ${track.title}`} className="spt-track-row__number" onClick={() => onPlay(track)} type="button">
                <span>{index + 1}</span><SpotifyIcon name="play" size={15} />
              </button>
              <button className="spt-track-row__title" onClick={() => onPlay(track)} type="button">
                <SpotifyArtwork size="small" track={track} />
                <span><strong>{track.title}</strong><small>{track.explicit && <i>E</i>}{track.artist}</small></span>
              </button>
              <span className="spt-track-row__album">{track.album}</span>
              <span className="spt-track-row__added">{track.addedAt ?? 'Recently'}</span>
              <IconButton active={likedIds.has(track.id)} icon="heart" label={likedIds.has(track.id) ? `Remove ${track.title} from Liked Songs` : `Save ${track.title}`} onClick={() => onToggleLike(track)} small />
              <time>{formatSpotifyDuration(track.durationSeconds)}</time>
              <IconButton icon="more" label={`More options for ${track.title}`} small />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SpotifySidePanelView({
  collection,
  currentTrack,
  liked,
  mode,
  queue,
  onClose,
  onPlay,
  onToggleLike,
}: {
  collection?: SpotifyCollection
  currentTrack: SpotifyTrack
  liked: boolean
  mode: Exclude<SpotifySidePanel, null>
  queue: readonly SpotifyTrack[]
  onClose: () => void
  onPlay: (track: SpotifyTrack) => void
  onToggleLike: (track: SpotifyTrack) => void
}) {
  if (mode === 'queue') {
    return (
      <aside className="spt-side-panel spt-queue-panel">
        <header><h2>Queue</h2><IconButton icon="close" label="Close queue" small onClick={onClose} /></header>
        <section>
          <h3>Now playing</h3>
          <CompactTrackRow liked={liked} onPlay={onPlay} onToggleLike={onToggleLike} track={currentTrack} />
        </section>
        <section>
          <div className="spt-queue-panel__next"><h3>Next up</h3><button type="button">Clear queue</button></div>
          <p className="spt-jam-note"><span>J</span><b>Start a Jam</b><small>Invite people to add to this queue.</small></p>
          {queue.slice(0, 8).map((track, index) => (
            <button className="spt-queue-row" key={track.id} onClick={() => onPlay(track)} type="button">
              <span className="spt-queue-row__handle">{index + 1}</span>
              <SpotifyArtwork size="small" track={track} />
              <span><strong>{track.title}</strong><small>{track.artist}</small></span>
              <SpotifyIcon name="more" size={18} />
            </button>
          ))}
        </section>
      </aside>
    )
  }

  return (
    <aside className="spt-side-panel spt-now-playing">
      <header><h2>{collection?.title ?? 'Now playing'}</h2><IconButton icon="close" label="Close Now Playing view" small onClick={onClose} /></header>
      <SpotifyArtwork size="panel" track={currentTrack} />
      <div className="spt-now-playing__title">
        <span><strong>{currentTrack.title}</strong><small>{currentTrack.artist}</small></span>
        <IconButton active={liked} icon="heart" label={liked ? `Remove ${currentTrack.title} from Liked Songs` : `Save ${currentTrack.title}`} onClick={() => onToggleLike(currentTrack)} />
      </div>
      <article className="spt-artist-card">
        <span className={`is-${currentTrack.artworkTone ?? 'slate'}`}><b>{currentTrack.artist.charAt(0)}</b></span>
        <div><strong>About the artist</strong><h3>{currentTrack.artist}</h3><p>Independent music for quiet systems, open roads, and the work between milestones.</p></div>
        <button type="button">Follow</button>
      </article>
      {queue[0] && (
        <article className="spt-next-card">
          <header><strong>Next in queue</strong><button type="button">Open queue</button></header>
          <button onClick={() => onPlay(queue[0])} type="button">
            <SpotifyArtwork size="small" track={queue[0]} />
            <span><strong>{queue[0].title}</strong><small>{queue[0].artist}</small></span>
            <SpotifyIcon name="more" size={18} />
          </button>
        </article>
      )}
    </aside>
  )
}

function SpotifyPlayer({
  currentTrack,
  isPlaying,
  liked,
  sidePanel,
  onToggleLike,
  onTogglePlay,
  onToggleQueue,
  onToggleNowPlaying,
}: {
  currentTrack: SpotifyTrack
  isPlaying: boolean
  liked: boolean
  sidePanel: SpotifySidePanel
  onToggleLike: () => void
  onTogglePlay: () => void
  onToggleQueue: () => void
  onToggleNowPlaying: () => void
}) {
  return (
    <footer className="spt-player">
      <button className="spt-player__track" onClick={onToggleNowPlaying} type="button">
        <SpotifyArtwork size="small" track={currentTrack} />
        <span><strong>{currentTrack.title}</strong><small>{currentTrack.artist}</small></span>
      </button>
      <IconButton active={liked} icon="heart" label={liked ? `Remove ${currentTrack.title} from Liked Songs` : `Save ${currentTrack.title}`} onClick={onToggleLike} small />
      <div className="spt-player__center">
        <div className="spt-player__controls">
          <IconButton icon="shuffle" label="Enable shuffle" small />
          <IconButton icon="previous" label="Previous" small />
          <button aria-label={isPlaying ? 'Pause' : 'Play'} className="spt-player__play" onClick={onTogglePlay} type="button">
            <SpotifyIcon name={isPlaying ? 'pause' : 'play'} size={20} />
          </button>
          <IconButton icon="next" label="Next" small />
          <IconButton icon="repeat" label="Enable repeat" small />
        </div>
        <div className="spt-player__progress"><time>1:24</time><span><i style={{ width: '38%' }} /></span><time>{formatSpotifyDuration(currentTrack.durationSeconds)}</time></div>
      </div>
      <div className="spt-player__right">
        <IconButton active={sidePanel === 'now-playing'} icon="grid" label="Now Playing view" onClick={onToggleNowPlaying} small />
        <IconButton active={sidePanel === 'queue'} icon="queue" label="Queue" onClick={onToggleQueue} small />
        <IconButton icon="device" label="Connect to a device" small />
        <SpotifyIcon name="volume" size={18} />
        <span className="spt-volume"><i style={{ width: '72%' }} /></span>
        <IconButton icon="expand" label="Full screen" small />
      </div>
    </footer>
  )
}

function SpotifyMobileNav({ view, onViewChange }: { view: SpotifyView; onViewChange: (view: SpotifyView) => void }) {
  const items: readonly [SpotifyView, SpotifyIconName, string][] = [
    ['home', 'home', 'Home'],
    ['search', 'search', 'Search'],
    ['library', 'library', 'Your Library'],
  ]
  return (
    <nav aria-label="Spotify mobile navigation" className="spt-mobile-nav">
      {items.map(([target, icon, label]) => (
        <button className={view === target ? 'is-active' : ''} key={target} onClick={() => onViewChange(target)} type="button">
          <SpotifyIcon name={icon} size={21} /><span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export function SpotifyShowcase({
  tracks: tracksProp,
  collections: collectionsProp,
  shelves: shelvesProp,
  initialView = 'home',
  initialQuery = '',
  initialCollectionId,
  initialTrackId,
  initialSidePanel = 'now-playing',
  onPlay,
  onSelectCollection,
  onToggleLike,
}: SpotifyShowcaseProps) {
  const tracks = tracksProp ?? SPOTIFY_SAMPLE_TRACKS
  const collections = collectionsProp ?? SPOTIFY_SAMPLE_COLLECTIONS
  const shelves = shelvesProp ?? SPOTIFY_SAMPLE_SHELVES
  const defaultCollectionId = initialCollectionId ?? collections[0]?.id ?? ''
  const defaultTrackId = initialTrackId ?? tracks[0]?.id ?? ''
  const [view, setView] = useState<SpotifyView>(initialCollectionId ? 'playlist' : initialView)
  const [query, setQuery] = useState(initialQuery)
  const [selectedCollectionId, setSelectedCollectionId] = useState(defaultCollectionId)
  const [currentTrackId, setCurrentTrackId] = useState(defaultTrackId)
  const [sidePanel, setSidePanel] = useState<SpotifySidePanel>(initialSidePanel)
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedIds, setLikedIds] = useState(() => new Set(tracks.filter(track => track.liked).map(track => track.id)))

  useEffect(() => setView(initialCollectionId ? 'playlist' : initialView), [initialCollectionId, initialView])
  useEffect(() => setQuery(initialQuery), [initialQuery])
  useEffect(() => setSelectedCollectionId(defaultCollectionId), [defaultCollectionId])
  useEffect(() => setCurrentTrackId(defaultTrackId), [defaultTrackId])
  useEffect(() => setSidePanel(initialSidePanel), [initialSidePanel])
  useEffect(() => setLikedIds(new Set(tracks.filter(track => track.liked).map(track => track.id))), [tracks])

  const collectionsById = useMemo(() => new Map(collections.map(collection => [collection.id, collection])), [collections])
  const selectedCollection = collectionsById.get(selectedCollectionId) ?? collections[0]
  const currentTrack = tracks.find(track => track.id === currentTrackId) ?? tracks[0]
  const playbackCollection = selectedCollection?.trackIds.includes(currentTrack?.id ?? '')
    ? selectedCollection
    : collections.find(collection => collection.trackIds.includes(currentTrack?.id ?? ''))
  const queue = currentTrack ? resolveSpotifyQueue(tracks, playbackCollection, currentTrack.id) : []

  if (!currentTrack) {
    return <div className="spt-empty-catalog"><SpotifyBrand /><strong>No playable content</strong><span>Provide at least one host track to render this showcase.</span></div>
  }

  const playTrack = (track: SpotifyTrack) => {
    setCurrentTrackId(track.id)
    setIsPlaying(true)
    onPlay?.(track)
  }
  const playCollection = (collection: SpotifyCollection) => {
    const track = tracks.find(candidate => collection.trackIds.includes(candidate.id))
    if (track) playTrack(track)
  }
  const selectCollection = (collection: SpotifyCollection) => {
    setSelectedCollectionId(collection.id)
    setView('playlist')
    onSelectCollection?.(collection)
  }
  const toggleLike = (track: SpotifyTrack) => {
    const nextLiked = !likedIds.has(track.id)
    setLikedIds(current => {
      const next = new Set(current)
      if (nextLiked) next.add(track.id)
      else next.delete(track.id)
      return next
    })
    onToggleLike?.(track, nextLiked)
  }

  return (
    <div className="spt-shell">
      <div className={`spt-workspace ${sidePanel ? `has-side-panel has-${sidePanel}-panel` : ''}`}>
        <SpotifySidebar collections={collections} onSelectCollection={selectCollection} onViewChange={setView} view={view} />
        <main className="spt-main">
          <SpotifyTopbar query={query} onQueryChange={setQuery} onViewChange={setView} view={view} />
          <div className="spt-main__scroll">
            {view === 'home' && (
              <SpotifyHome collections={collections} shelves={shelves} onPlayCollection={playCollection} onSelectCollection={selectCollection} />
            )}
            {view === 'search' && (
              <SpotifySearch
                collections={collections}
                likedIds={likedIds}
                onPlay={playTrack}
                onSelectCollection={selectCollection}
                onToggleLike={toggleLike}
                query={query}
                tracks={tracks}
              />
            )}
            {view === 'library' && <SpotifyLibrary collections={collections} onSelectCollection={selectCollection} />}
            {view === 'playlist' && selectedCollection && (
              <SpotifyPlaylist collection={selectedCollection} likedIds={likedIds} onPlay={playTrack} onToggleLike={toggleLike} tracks={tracks} />
            )}
          </div>
        </main>
        {sidePanel && (
          <SpotifySidePanelView
            collection={playbackCollection}
            currentTrack={currentTrack}
            liked={likedIds.has(currentTrack.id)}
            mode={sidePanel}
            onClose={() => setSidePanel(null)}
            onPlay={playTrack}
            onToggleLike={toggleLike}
            queue={queue}
          />
        )}
      </div>
      <SpotifyPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        liked={likedIds.has(currentTrack.id)}
        onToggleLike={() => toggleLike(currentTrack)}
        onToggleNowPlaying={() => setSidePanel(current => current === 'now-playing' ? null : 'now-playing')}
        onTogglePlay={() => {
          setIsPlaying(current => !current)
          if (!isPlaying) onPlay?.(currentTrack)
        }}
        onToggleQueue={() => setSidePanel(current => current === 'queue' ? null : 'queue')}
        sidePanel={sidePanel}
      />
      <SpotifyMobileNav onViewChange={setView} view={view} />
    </div>
  )
}
