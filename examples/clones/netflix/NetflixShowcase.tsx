import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import './NetflixShowcase.css'

export type NetflixSection = 'home' | 'shows' | 'movies' | 'new' | 'my-list'
export type NetflixArtworkTone = 'crimson' | 'ocean' | 'amber' | 'forest' | 'violet' | 'slate'

export interface NetflixEpisode {
  id: string
  number: number
  title: string
  synopsis: string
  durationMinutes: number
  progress?: number
  artworkUrl?: string
}

// This namespaced showcase consumes a neutral streaming-catalog vocabulary.
// Recommendations, rights, playback, and product trade dress stay outside the core.
export interface NetflixTitle {
  id: string
  title: string
  kind: 'series' | 'movie'
  synopsis: string
  year: number
  maturity: string
  match: number
  genres: readonly string[]
  scene?: 'coast' | 'ridge' | 'city' | 'forest' | 'studio' | 'harbor'
  artworkUrl?: string
  backdropUrl?: string
  artworkTone?: NetflixArtworkTone
  tagline?: string
  durationMinutes?: number
  seasons?: number
  quality?: 'HD' | '4K' | '4K HDR'
  cast?: readonly string[]
  creators?: readonly string[]
  language?: string
  top10Rank?: number
  progress?: number
  myList?: boolean
  isNew?: boolean
  badge?: string
  episodes?: readonly NetflixEpisode[]
  playbackUrl?: string
}

export interface NetflixRail {
  id: string
  title: string
  titleIds: readonly string[]
  presentation?: 'standard' | 'top10' | 'continue'
}

export interface NetflixProfile {
  id: string
  name: string
  tone: NetflixArtworkTone
  kids?: boolean
}

export interface NetflixShowcaseProps {
  titles?: readonly NetflixTitle[]
  rails?: readonly NetflixRail[]
  profiles?: readonly NetflixProfile[]
  initialSection?: NetflixSection
  initialQuery?: string
  initialSelectedId?: string
  initialPlayerId?: string
  initialProfileGate?: boolean
  onPlay?: (title: NetflixTitle) => void
  onSelectTitle?: (title: NetflixTitle) => void
  onToggleMyList?: (title: NetflixTitle, included: boolean) => void
}

const SAMPLE_EPISODES: readonly NetflixEpisode[] = [
  {
    id: 'arrival',
    number: 1,
    title: 'The Arrival',
    synopsis: 'A forgotten radio signal pulls the field team toward an unmapped stretch of coast.',
    durationMinutes: 47,
    progress: 100,
    artworkUrl: '/examples/media-demo.svg#harbor',
  },
  {
    id: 'between-tides',
    number: 2,
    title: 'Between Tides',
    synopsis: 'The team follows a pattern hidden inside the harbor records while a storm closes in.',
    durationMinutes: 51,
    progress: 68,
    artworkUrl: '/examples/media-demo.svg#ridge',
  },
  {
    id: 'quiet-coast',
    number: 3,
    title: 'The Quiet Coast',
    synopsis: 'Jun finds the source of the transmission—and a decision that changes the expedition.',
    durationMinutes: 49,
    artworkUrl: '/examples/media-demo.svg#coast',
  },
]

export const NETFLIX_SAMPLE_TITLES: readonly NetflixTitle[] = [
  {
    id: 'field-notes',
    title: 'Field Notes',
    kind: 'series',
    synopsis: 'A small research team follows an impossible signal along the Pacific coast, where every discovery rewrites the map they brought with them.',
    year: 2026,
    maturity: 'TV-14',
    match: 98,
    genres: ['Mystery', 'Drama', 'Adventure'],
    scene: 'coast',
    artworkTone: 'ocean',
    tagline: 'Some places refuse to be mapped.',
    seasons: 1,
    quality: '4K HDR',
    cast: ['Maya Rivera', 'Jun Park', 'Sam Chen'],
    creators: ['Jim Studios'],
    language: 'English',
    progress: 68,
    myList: true,
    isNew: true,
    badge: 'New episode',
    episodes: SAMPLE_EPISODES,
  },
  {
    id: 'signal-coast',
    title: 'Signal Coast',
    kind: 'series',
    synopsis: 'Two engineers uncover a network of coastal beacons broadcasting messages from thirty years in the future.',
    year: 2026,
    maturity: 'TV-MA',
    match: 96,
    genres: ['Sci-Fi', 'Thriller', 'Coastal'],
    scene: 'harbor',
    artworkTone: 'crimson',
    seasons: 2,
    quality: '4K',
    cast: ['Lina Tran', 'Ari Kim'],
    top10Rank: 1,
    myList: true,
    isNew: true,
    badge: 'New season',
  },
  {
    id: 'night-shift',
    title: 'Night Shift',
    kind: 'series',
    synopsis: 'The overnight crew of a vertical city sees the systems—and the secrets—no one else does.',
    year: 2025,
    maturity: 'TV-14',
    match: 95,
    genres: ['Drama', 'Workplace', 'Mystery'],
    scene: 'city',
    artworkTone: 'violet',
    seasons: 3,
    quality: '4K',
    progress: 34,
    top10Rank: 3,
    myList: true,
  },
  {
    id: 'the-ridge',
    title: 'The Ridge',
    kind: 'movie',
    synopsis: 'A rescue pilot returns to the mountain that ended her career for one final impossible flight.',
    year: 2026,
    maturity: 'PG-13',
    match: 94,
    genres: ['Adventure', 'Drama'],
    scene: 'ridge',
    artworkTone: 'amber',
    durationMinutes: 118,
    quality: '4K HDR',
    top10Rank: 2,
    isNew: true,
  },
  {
    id: 'harborline',
    title: 'Harborline',
    kind: 'series',
    synopsis: 'Families, ferries, and old rivalries collide in a working harbor on the edge of reinvention.',
    year: 2025,
    maturity: 'TV-14',
    match: 93,
    genres: ['Drama', 'Ensemble'],
    scene: 'harbor',
    artworkTone: 'slate',
    seasons: 2,
    quality: 'HD',
    progress: 81,
  },
  {
    id: 'pattern-language',
    title: 'Pattern Language',
    kind: 'series',
    synopsis: 'Designers decode the invisible systems shaping the rooms, streets, and tools we use every day.',
    year: 2026,
    maturity: 'TV-PG',
    match: 91,
    genres: ['Documentary', 'Design'],
    scene: 'studio',
    artworkTone: 'amber',
    seasons: 1,
    quality: '4K',
    progress: 23,
    myList: true,
    isNew: true,
  },
  {
    id: 'wild-current',
    title: 'Wild Current',
    kind: 'movie',
    synopsis: 'A marine biologist races a changing current to save a remote coast and the community that depends on it.',
    year: 2025,
    maturity: 'PG',
    match: 90,
    genres: ['Documentary', 'Nature', 'Coastal'],
    scene: 'coast',
    artworkTone: 'ocean',
    durationMinutes: 96,
    quality: '4K HDR',
    top10Rank: 5,
  },
  {
    id: 'quiet-route',
    title: 'The Quiet Route',
    kind: 'movie',
    synopsis: 'A courier takes the long way through the forest and finds a town missing from every modern map.',
    year: 2024,
    maturity: 'PG-13',
    match: 89,
    genres: ['Mystery', 'Independent'],
    scene: 'forest',
    artworkTone: 'forest',
    durationMinutes: 104,
    quality: 'HD',
    myList: true,
  },
  {
    id: 'afterlight',
    title: 'Afterlight',
    kind: 'series',
    synopsis: 'At a high-altitude observatory, sunrise reveals evidence that the night crew cannot explain.',
    year: 2026,
    maturity: 'TV-14',
    match: 88,
    genres: ['Sci-Fi', 'Mystery'],
    scene: 'ridge',
    artworkTone: 'violet',
    seasons: 1,
    quality: '4K',
    top10Rank: 4,
    isNew: true,
    badge: 'Limited series',
  },
  {
    id: 'northbound',
    title: 'Northbound',
    kind: 'movie',
    synopsis: 'Three old friends follow a trail north, trying to return a letter before winter closes the road.',
    year: 2025,
    maturity: 'PG-13',
    match: 87,
    genres: ['Drama', 'Road Movie'],
    scene: 'forest',
    artworkTone: 'forest',
    durationMinutes: 111,
    quality: '4K',
    progress: 52,
  },
  {
    id: 'common-ground',
    title: 'Common Ground',
    kind: 'series',
    synopsis: 'Six founders build practical answers to ordinary problems in cities around the world.',
    year: 2026,
    maturity: 'TV-PG',
    match: 86,
    genres: ['Documentary', 'Business', 'Design'],
    scene: 'studio',
    artworkTone: 'crimson',
    seasons: 1,
    quality: '4K',
    myList: true,
    isNew: true,
  },
  {
    id: 'last-ferry',
    title: 'Last Ferry',
    kind: 'movie',
    synopsis: 'On the final crossing before a storm, every passenger appears to be running from the same event.',
    year: 2025,
    maturity: 'R',
    match: 85,
    genres: ['Thriller', 'Mystery'],
    scene: 'harbor',
    artworkTone: 'slate',
    durationMinutes: 102,
    quality: '4K',
    top10Rank: 7,
  },
  {
    id: 'long-weekend',
    title: 'Long Weekend',
    kind: 'series',
    synopsis: 'A spontaneous coastal trip becomes a funny, tender test of four lifelong friendships.',
    year: 2024,
    maturity: 'TV-14',
    match: 84,
    genres: ['Comedy', 'Drama', 'Coastal'],
    scene: 'coast',
    artworkTone: 'amber',
    seasons: 2,
    quality: 'HD',
    myList: true,
  },
  {
    id: 'the-archive',
    title: 'The Archive',
    kind: 'series',
    synopsis: 'An archivist discovers that erased records are returning with notes addressed directly to her.',
    year: 2026,
    maturity: 'TV-MA',
    match: 83,
    genres: ['Mystery', 'Thriller'],
    scene: 'studio',
    artworkTone: 'violet',
    seasons: 1,
    quality: '4K',
    top10Rank: 6,
    isNew: true,
  },
  {
    id: 'city-at-four',
    title: 'City at 4 AM',
    kind: 'movie',
    synopsis: 'A night photographer assembles one citywide story from strangers who never meet.',
    year: 2025,
    maturity: 'PG-13',
    match: 82,
    genres: ['Drama', 'Independent'],
    scene: 'city',
    artworkTone: 'ocean',
    durationMinutes: 99,
    quality: '4K',
    myList: true,
  },
  {
    id: 'driftline',
    title: 'Driftline',
    kind: 'series',
    synopsis: 'A competitive sailing crew rebuilds after a public loss and a private betrayal.',
    year: 2025,
    maturity: 'TV-14',
    match: 81,
    genres: ['Sports', 'Drama', 'Coastal'],
    scene: 'harbor',
    artworkTone: 'crimson',
    seasons: 2,
    quality: 'HD',
  },
]

export const NETFLIX_SAMPLE_RAILS: readonly NetflixRail[] = [
  {
    id: 'continue',
    title: `Continue Watching for ${CLONE_DEMO_IDENTITY.user}`,
    titleIds: ['field-notes', 'night-shift', 'harborline', 'pattern-language', 'northbound'],
    presentation: 'continue',
  },
  {
    id: 'trending',
    title: 'Top 10 in the U.S. Today',
    titleIds: ['signal-coast', 'the-ridge', 'night-shift', 'afterlight', 'wild-current', 'the-archive', 'last-ferry'],
    presentation: 'top10',
  },
  {
    id: 'because-field-notes',
    title: 'Because you watched Field Notes',
    titleIds: ['signal-coast', 'wild-current', 'quiet-route', 'afterlight', 'last-ferry', 'driftline'],
  },
  {
    id: 'new',
    title: 'New Releases',
    titleIds: ['common-ground', 'the-archive', 'signal-coast', 'the-ridge', 'field-notes', 'afterlight'],
  },
  {
    id: 'my-list',
    title: 'My List',
    titleIds: ['field-notes', 'signal-coast', 'night-shift', 'pattern-language', 'quiet-route', 'common-ground', 'long-weekend'],
  },
  {
    id: 'critically-acclaimed',
    title: 'Critically Acclaimed',
    titleIds: ['city-at-four', 'common-ground', 'the-ridge', 'harborline', 'northbound', 'pattern-language'],
  },
]

export const NETFLIX_SAMPLE_PROFILES: readonly NetflixProfile[] = [
  { id: 'jun', name: CLONE_DEMO_IDENTITY.user, tone: 'violet' },
  { id: 'maya', name: 'Maya', tone: 'ocean' },
  { id: 'guest', name: 'Guest', tone: 'slate' },
  { id: 'kids', name: 'Kids', tone: 'crimson', kids: true },
]

export function selectNetflixTitles(
  titles: readonly NetflixTitle[],
  section: NetflixSection,
  query = '',
  myListIds: readonly string[] = titles.filter(title => title.myList).map(title => title.id),
): NetflixTitle[] {
  const saved = new Set(myListIds)
  const normalizedQuery = query.trim().toLocaleLowerCase()

  return titles.filter(title => {
    if (section === 'shows' && title.kind !== 'series') return false
    if (section === 'movies' && title.kind !== 'movie') return false
    if (section === 'new' && !title.isNew && title.top10Rank === undefined) return false
    if (section === 'my-list' && !saved.has(title.id)) return false
    if (!normalizedQuery) return true
    return [
      title.title,
      title.synopsis,
      title.language,
      ...(title.genres ?? []),
      ...(title.cast ?? []),
      ...(title.creators ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery)
  })
}

export function resolveNetflixRails(
  rails: readonly NetflixRail[],
  availableTitleIds: readonly string[],
): NetflixRail[] {
  const available = new Set(availableTitleIds)
  return rails
    .map(rail => ({
      ...rail,
      titleIds: rail.titleIds.filter(id => available.has(id)),
    }))
    .filter(rail => rail.titleIds.length > 0)
}

type NetflixIconName =
  | 'search'
  | 'bell'
  | 'chevron-down'
  | 'chevron-right'
  | 'play'
  | 'plus'
  | 'check'
  | 'info'
  | 'close'
  | 'thumb'
  | 'volume'
  | 'subtitles'
  | 'settings'
  | 'fullscreen'
  | 'back'
  | 'pause'
  | 'episodes'

function NetflixIcon({ name, size = 22 }: { name: NetflixIconName; size?: number }) {
  const paths: Record<NetflixIconName, string> = {
    search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
    'chevron-down': 'm7 10 5 5 5-5',
    'chevron-right': 'm9 18 6-6-6-6',
    play: 'm7 4 13 8-13 8V4Z',
    plus: 'M12 5v14M5 12h14',
    check: 'm5 12 4 4L19 6',
    info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    close: 'M18 6 6 18M6 6l12 12',
    thumb: 'M7 10v11H3V10h4Zm0 9h10.2a2 2 0 0 0 2-1.7l1.2-7A2 2 0 0 0 18.4 8H14l.7-3.4A2.2 2.2 0 0 0 12.6 2L7 10',
    volume: 'M11 5 6 9H2v6h4l5 4V5Zm4 4a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12',
    subtitles: 'M3 5h18v14H3V5Zm3 8h5m2 0h5M6 16h8',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.32.75.6 1 .3.26.68.4 1.1.4h.09v4h-.09c-.42 0-.8.14-1.1.4-.28.25-.5.6-.6 1Z',
    fullscreen: 'M8 3H3v5M16 3h5v5M8 21H3v-5m13 5h5v-5',
    back: 'm15 18-6-6 6-6',
    pause: 'M8 5h3v14H8V5Zm5 0h3v14h-3V5Z',
    episodes: 'M4 6h16v12H4V6Zm4-3h8M8 21h8',
  }
  const filled = name === 'play' || name === 'pause'
  return (
    <svg aria-hidden="true" fill={filled ? 'currentColor' : 'none'} height={size} viewBox="0 0 24 24" width={size}>
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={filled ? 0 : 1.8}
      />
    </svg>
  )
}

function NetflixWordmark() {
  return <span aria-label="Netflix" className="nfx-wordmark">NETFLIX</span>
}

function artworkUrl(title: NetflixTitle): string {
  return title.artworkUrl ?? `/examples/media-demo.svg#${title.scene ?? 'city'}`
}

function backdropUrl(title: NetflixTitle): string {
  return title.backdropUrl ?? artworkUrl(title)
}

function NetflixArtwork({ title, hero = false }: { title: NetflixTitle; hero?: boolean }) {
  return (
    <div className={`nfx-artwork is-${title.artworkTone ?? 'slate'} ${hero ? 'is-hero' : ''}`}>
      <img alt="" src={hero ? backdropUrl(title) : artworkUrl(title)} />
      <span className="nfx-artwork__wash" />
      {!hero && (
        <span className="nfx-artwork__title">
          {title.title.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
        </span>
      )}
      {!hero && title.badge && <small>{title.badge}</small>}
    </div>
  )
}

function IconButton({
  icon,
  label,
  onClick,
  solid = false,
}: {
  icon: NetflixIconName
  label: string
  onClick?: () => void
  solid?: boolean
}) {
  return (
    <button
      aria-label={label}
      className={`nfx-icon-button ${solid ? 'is-solid' : ''}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <NetflixIcon name={icon} />
    </button>
  )
}

function NetflixHeader({
  profile,
  query,
  searchOpen,
  section,
  onQueryChange,
  onSearchToggle,
  onSectionChange,
}: {
  profile: NetflixProfile
  query: string
  searchOpen: boolean
  section: NetflixSection
  onQueryChange: (query: string) => void
  onSearchToggle: () => void
  onSectionChange: (section: NetflixSection) => void
}) {
  const links: readonly [NetflixSection, string][] = [
    ['home', 'Home'],
    ['shows', 'TV Shows'],
    ['movies', 'Movies'],
    ['new', 'New & Popular'],
    ['my-list', 'My List'],
  ]
  return (
    <header className="nfx-header">
      <div className="nfx-header__left">
        <NetflixWordmark />
        <nav aria-label="Netflix navigation">
          {links.map(([value, label]) => (
            <button
              aria-current={section === value ? 'page' : undefined}
              className={section === value ? 'is-active' : ''}
              key={value}
              onClick={() => onSectionChange(value)}
              type="button"
            >
              {label}
            </button>
          ))}
          <button type="button">Browse by Languages</button>
        </nav>
      </div>
      <div className="nfx-header__right">
        {searchOpen ? (
          <label className="nfx-search">
            <NetflixIcon name="search" size={18} />
            <input
              autoFocus
              onChange={event => onQueryChange(event.target.value)}
              placeholder="Titles, people, genres"
              value={query}
            />
            <button aria-label="Close search" onClick={onSearchToggle} type="button">
              <NetflixIcon name="close" size={17} />
            </button>
          </label>
        ) : (
          <IconButton icon="search" label="Search" onClick={onSearchToggle} />
        )}
        <button className="nfx-kids-link" type="button">Kids</button>
        <IconButton icon="bell" label="Notifications" />
        <button className="nfx-profile-menu" type="button">
          <span className={`nfx-profile-avatar is-${profile.tone}`}>J</span>
          <NetflixIcon name="chevron-down" size={14} />
        </button>
      </div>
    </header>
  )
}

function formatRuntime(title: NetflixTitle): string {
  if (title.kind === 'series') return `${title.seasons ?? 1} Season${title.seasons === 1 ? '' : 's'}`
  const minutes = title.durationMinutes ?? 100
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

function NetflixHero({
  title,
  inMyList,
  onInfo,
  onPlay,
  onToggleMyList,
}: {
  title: NetflixTitle
  inMyList: boolean
  onInfo: () => void
  onPlay: () => void
  onToggleMyList: () => void
}) {
  return (
    <section className="nfx-hero">
      <NetflixArtwork hero title={title} />
      <div className="nfx-hero__gradient" />
      <div className="nfx-hero__content">
        <span className="nfx-series-mark"><b>N</b> SERIES</span>
        <h1>{title.title}</h1>
        <p className="nfx-hero__tagline">{title.tagline}</p>
        <p>{title.synopsis}</p>
        <div className="nfx-hero__actions">
          <button className="nfx-play-button" onClick={onPlay} type="button">
            <NetflixIcon name="play" size={27} />
            Play
          </button>
          <button className="nfx-info-button" onClick={onInfo} type="button">
            <NetflixIcon name="info" size={27} />
            More Info
          </button>
          <IconButton
            icon={inMyList ? 'check' : 'plus'}
            label={inMyList ? 'Remove from My List' : 'Add to My List'}
            onClick={onToggleMyList}
          />
        </div>
      </div>
      <div className="nfx-hero__maturity">{title.maturity}</div>
    </section>
  )
}

function NetflixCard({
  title,
  rank,
  presentation = 'standard',
  onSelect,
}: {
  title: NetflixTitle
  rank?: number
  presentation?: NetflixRail['presentation']
  onSelect: (title: NetflixTitle) => void
}) {
  const isTop10 = presentation === 'top10'
  return (
    <article className={`nfx-card ${isTop10 ? 'is-top10' : ''}`}>
      {isTop10 && <span className="nfx-card__rank">{rank ?? title.top10Rank}</span>}
      <button aria-label={title.title} onClick={() => onSelect(title)} type="button">
        <NetflixArtwork title={title} />
        {title.top10Rank !== undefined && !isTop10 && <span className="nfx-top10-badge">TOP<br />10</span>}
        {presentation === 'continue' && title.progress !== undefined && (
          <span className="nfx-progress">
            <span style={{ width: `${title.progress}%` }} />
          </span>
        )}
        <span className="nfx-card__hover-meta">
          <span>
            <NetflixIcon name="play" size={15} />
          </span>
          <b>{title.match}% Match</b>
          <small>{title.maturity}</small>
          <small>{title.quality}</small>
        </span>
      </button>
    </article>
  )
}

function NetflixRailRow({
  rail,
  titlesById,
  onSelect,
}: {
  rail: NetflixRail
  titlesById: ReadonlyMap<string, NetflixTitle>
  onSelect: (title: NetflixTitle) => void
}) {
  const titles = rail.titleIds
    .map(id => titlesById.get(id))
    .filter((title): title is NetflixTitle => Boolean(title))
  return (
    <section className={`nfx-rail is-${rail.presentation ?? 'standard'}`}>
      <button className="nfx-rail__heading" type="button">
        <h2>{rail.title}</h2>
        <span>Explore All <NetflixIcon name="chevron-right" size={16} /></span>
      </button>
      <div className="nfx-rail__track">
        {titles.map((title, index) => (
          <NetflixCard
            key={title.id}
            onSelect={onSelect}
            presentation={rail.presentation}
            rank={title.top10Rank ?? index + 1}
            title={title}
          />
        ))}
      </div>
      <button aria-label={`Next titles in ${rail.title}`} className="nfx-rail__next" type="button">
        <NetflixIcon name="chevron-right" size={34} />
      </button>
    </section>
  )
}

function NetflixGrid({
  emptyMessage,
  heading,
  titles,
  onSelect,
}: {
  emptyMessage: string
  heading: string
  titles: readonly NetflixTitle[]
  onSelect: (title: NetflixTitle) => void
}) {
  return (
    <section className="nfx-grid-page">
      <h1>{heading}</h1>
      {titles.length === 0 ? (
        <div className="nfx-grid-page__empty">
          <NetflixIcon name="search" size={40} />
          <strong>{emptyMessage}</strong>
          <span>Try another title, person, genre, or language.</span>
        </div>
      ) : (
        <div className="nfx-title-grid">
          {titles.map(title => <NetflixCard key={title.id} onSelect={onSelect} title={title} />)}
        </div>
      )}
    </section>
  )
}

function BrowseSection({
  section,
  titles,
  onSelect,
}: {
  section: Exclude<NetflixSection, 'home' | 'my-list'>
  titles: readonly NetflixTitle[]
  onSelect: (title: NetflixTitle) => void
}) {
  const heading = section === 'shows' ? 'TV Shows' : section === 'movies' ? 'Movies' : 'New & Popular'
  const labels = section === 'shows'
    ? ['Bingeworthy TV Shows', 'Critically Acclaimed Series', 'Drama', 'Documentaries']
    : section === 'movies'
      ? ['Popular Movies', 'Award-Winning', 'Thrillers', 'Independent Films']
      : ['New on Netflix', 'Top 10 Today', 'Worth the Wait']
  return (
    <div className="nfx-browse-page">
      <div className="nfx-browse-page__heading">
        <h1>{heading}</h1>
        {section !== 'new' && (
          <button type="button">Genres <NetflixIcon name="chevron-down" size={14} /></button>
        )}
      </div>
      {labels.map((label, labelIndex) => (
        <section className="nfx-rail is-standard" key={label}>
          <button className="nfx-rail__heading" type="button"><h2>{label}</h2></button>
          <div className="nfx-rail__track">
            {[...titles.slice(labelIndex * 2), ...titles.slice(0, labelIndex * 2)]
              .slice(0, 7)
              .map(title => <NetflixCard key={`${label}-${title.id}`} onSelect={onSelect} title={title} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

function DetailModal({
  inMyList,
  title,
  onClose,
  onPlay,
  onToggleMyList,
}: {
  inMyList: boolean
  title: NetflixTitle
  onClose: () => void
  onPlay: () => void
  onToggleMyList: () => void
}) {
  const episodes = title.episodes ?? SAMPLE_EPISODES
  return (
    <div className="nfx-modal-layer" role="presentation">
      <article aria-label={`Details for ${title.title}`} className="nfx-detail-modal">
        <div className="nfx-detail-modal__hero">
          <NetflixArtwork hero title={title} />
          <span className="nfx-detail-modal__gradient" />
          <IconButton icon="close" label="Close title details" onClick={onClose} solid />
          <div className="nfx-detail-modal__title">
            <span className="nfx-series-mark"><b>N</b> SERIES</span>
            <h2>{title.title}</h2>
            <div>
              <button className="nfx-play-button" onClick={onPlay} type="button">
                <NetflixIcon name="play" /> Play
              </button>
              <IconButton
                icon={inMyList ? 'check' : 'plus'}
                label={inMyList ? 'Remove from My List' : 'Add to My List'}
                onClick={onToggleMyList}
              />
              <IconButton icon="thumb" label="I like this" />
            </div>
          </div>
        </div>
        <div className="nfx-detail-modal__body">
          <div className="nfx-detail-modal__primary">
            <div className="nfx-title-facts">
              <strong>{title.match}% Match</strong>
              <span>{title.year}</span>
              <span className="nfx-maturity">{title.maturity}</span>
              <span>{formatRuntime(title)}</span>
              <span className="nfx-quality">{title.quality}</span>
            </div>
            <p>{title.synopsis}</p>
          </div>
          <dl>
            <div><dt>Cast:</dt><dd>{title.cast?.join(', ') ?? 'Maya Rivera, Jun Park, Sam Chen'}</dd></div>
            <div><dt>Genres:</dt><dd>{title.genres.join(', ')}</dd></div>
            <div><dt>This show is:</dt><dd>{title.tagline ?? 'Emotional, atmospheric, understated'}</dd></div>
          </dl>
        </div>
        {title.kind === 'series' && (
          <section className="nfx-episodes">
            <div className="nfx-episodes__heading">
              <h3>Episodes</h3>
              <button type="button">Season 1 <NetflixIcon name="chevron-down" size={14} /></button>
            </div>
            {episodes.map(episode => (
              <article className="nfx-episode" key={episode.id}>
                <strong>{episode.number}</strong>
                <div className="nfx-episode__art">
                  <img alt="" src={episode.artworkUrl ?? artworkUrl(title)} />
                  <span><NetflixIcon name="play" size={20} /></span>
                  {episode.progress !== undefined && (
                    <small><span style={{ width: `${episode.progress}%` }} /></small>
                  )}
                </div>
                <div className="nfx-episode__copy">
                  <div><h4>{episode.title}</h4><time>{episode.durationMinutes}m</time></div>
                  <p>{episode.synopsis}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </article>
    </div>
  )
}

function NetflixPlayer({ title, onBack }: { title: NetflixTitle; onBack: () => void }) {
  const episode = title.episodes?.find(item => item.progress && item.progress < 100)
    ?? title.episodes?.[0]
  return (
    <section aria-label={`Playing ${title.title}`} className="nfx-player">
      <NetflixArtwork hero title={title} />
      <div className="nfx-player__cinema-bars" />
      <button aria-label="Back to browse" className="nfx-player__back" onClick={onBack} type="button">
        <NetflixIcon name="back" size={34} />
      </button>
      <div className="nfx-player__center-status">
        <span><NetflixIcon name="pause" size={34} /></span>
      </div>
      <div className="nfx-player__controls">
        <div className="nfx-player__timeline">
          <span className="nfx-player__elapsed"><span /></span>
          <time>32:41</time>
        </div>
        <div className="nfx-player__toolbar">
          <div>
            <IconButton icon="pause" label="Pause" />
            <button className="nfx-skip" type="button">↶ <small>10</small></button>
            <button className="nfx-skip" type="button">↷ <small>10</small></button>
            <IconButton icon="volume" label="Volume" />
            <span className="nfx-player__title">
              <strong>{title.title}</strong>
              {episode && <small>S1:E{episode.number} “{episode.title}”</small>}
            </span>
          </div>
          <div>
            <button className="nfx-next-episode" type="button">Next Episode</button>
            <IconButton icon="episodes" label="Episodes" />
            <IconButton icon="subtitles" label="Audio and subtitles" />
            <IconButton icon="settings" label="Playback speed" />
            <IconButton icon="fullscreen" label="Full screen" />
          </div>
        </div>
      </div>
      <button className="nfx-skip-intro" type="button">Skip Intro</button>
    </section>
  )
}

function ProfileGate({ profiles, onSelect }: { profiles: readonly NetflixProfile[]; onSelect: (profile: NetflixProfile) => void }) {
  return (
    <section className="nfx-profile-gate">
      <NetflixWordmark />
      <div>
        <h1>Who's watching?</h1>
        <div className="nfx-profile-grid">
          {profiles.map(profile => (
            <button key={profile.id} onClick={() => onSelect(profile)} type="button">
              <span className={`nfx-profile-tile is-${profile.tone}`}>
                <span className="nfx-profile-face">{profile.kids ? 'KIDS' : profile.name.slice(0, 1)}</span>
              </span>
              <strong>{profile.name}</strong>
            </button>
          ))}
        </div>
        <button className="nfx-manage-profiles" type="button">Manage Profiles</button>
      </div>
    </section>
  )
}

export function NetflixShowcase({
  titles = NETFLIX_SAMPLE_TITLES,
  rails = NETFLIX_SAMPLE_RAILS,
  profiles = NETFLIX_SAMPLE_PROFILES,
  initialSection = 'home',
  initialQuery = '',
  initialSelectedId,
  initialPlayerId,
  initialProfileGate = false,
  onPlay,
  onSelectTitle,
  onToggleMyList,
}: NetflixShowcaseProps) {
  const [section, setSection] = useState<NetflixSection>(initialSection)
  const [query, setQuery] = useState(initialQuery)
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery))
  const [selectedId, setSelectedId] = useState(initialSelectedId)
  const [playerId, setPlayerId] = useState(initialPlayerId)
  const [profileGate, setProfileGate] = useState(initialProfileGate)
  const [activeProfile, setActiveProfile] = useState(profiles[0] ?? NETFLIX_SAMPLE_PROFILES[0])
  const [myListIds, setMyListIds] = useState(
    () => titles.filter(title => title.myList).map(title => title.id),
  )

  useEffect(() => setSection(initialSection), [initialSection])
  useEffect(() => {
    setQuery(initialQuery)
    setSearchOpen(Boolean(initialQuery))
  }, [initialQuery])
  useEffect(() => setSelectedId(initialSelectedId), [initialSelectedId])
  useEffect(() => setPlayerId(initialPlayerId), [initialPlayerId])
  useEffect(() => setProfileGate(initialProfileGate), [initialProfileGate])
  useEffect(() => setMyListIds(titles.filter(title => title.myList).map(title => title.id)), [titles])

  const titlesById = useMemo(() => new Map(titles.map(title => [title.id, title])), [titles])
  const selectedTitle = selectedId ? titlesById.get(selectedId) : undefined
  const playerTitle = playerId ? titlesById.get(playerId) : undefined
  const heroTitle = titlesById.get('field-notes') ?? titles[0]
  const filteredTitles = useMemo(
    () => selectNetflixTitles(titles, section, query, myListIds),
    [myListIds, query, section, titles],
  )
  const visibleRails = useMemo(
    () => resolveNetflixRails(rails, filteredTitles.map(title => title.id)),
    [filteredTitles, rails],
  )

  function selectTitle(title: NetflixTitle) {
    setSelectedId(title.id)
    onSelectTitle?.(title)
  }

  function playTitle(title: NetflixTitle) {
    setPlayerId(title.id)
    setSelectedId(undefined)
    onPlay?.(title)
  }

  function toggleMyList(title: NetflixTitle) {
    const included = !myListIds.includes(title.id)
    setMyListIds(current => included ? [...current, title.id] : current.filter(id => id !== title.id))
    onToggleMyList?.(title, included)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape') return
    if (playerId) setPlayerId(undefined)
    else if (selectedId) setSelectedId(undefined)
    else if (searchOpen) {
      setSearchOpen(false)
      setQuery('')
    }
  }

  if (profileGate) {
    return (
      <ProfileGate
        onSelect={profile => {
          setActiveProfile(profile)
          setProfileGate(false)
        }}
        profiles={profiles}
      />
    )
  }

  if (playerTitle) return <NetflixPlayer onBack={() => setPlayerId(undefined)} title={playerTitle} />

  const searchHeading = query ? `Explore titles related to: “${query}”` : ''

  return (
    <div className="nfx-shell" onKeyDown={handleKeyDown}>
      <NetflixHeader
        onQueryChange={setQuery}
        onSearchToggle={() => {
          if (searchOpen) setQuery('')
          setSearchOpen(current => !current)
        }}
        onSectionChange={nextSection => {
          setSection(nextSection)
          setQuery('')
          setSearchOpen(false)
        }}
        profile={activeProfile}
        query={query}
        searchOpen={searchOpen}
        section={section}
      />

      <main>
        {query ? (
          <NetflixGrid
            emptyMessage="No matching titles"
            heading={searchHeading}
            onSelect={selectTitle}
            titles={filteredTitles}
          />
        ) : section === 'home' && heroTitle ? (
          <>
            <NetflixHero
              inMyList={myListIds.includes(heroTitle.id)}
              onInfo={() => selectTitle(heroTitle)}
              onPlay={() => playTitle(heroTitle)}
              onToggleMyList={() => toggleMyList(heroTitle)}
              title={heroTitle}
            />
            <div className="nfx-home-rails">
              {visibleRails.map(rail => (
                <NetflixRailRow
                  key={rail.id}
                  onSelect={selectTitle}
                  rail={rail}
                  titlesById={titlesById}
                />
              ))}
            </div>
          </>
        ) : section === 'my-list' ? (
          <NetflixGrid
            emptyMessage="Your list is empty"
            heading="My List"
            onSelect={selectTitle}
            titles={filteredTitles}
          />
        ) : (
          <BrowseSection
            onSelect={selectTitle}
            section={section as Exclude<NetflixSection, 'home' | 'my-list'>}
            titles={filteredTitles}
          />
        )}
      </main>

      {selectedTitle && (
        <DetailModal
          inMyList={myListIds.includes(selectedTitle.id)}
          onClose={() => setSelectedId(undefined)}
          onPlay={() => playTitle(selectedTitle)}
          onToggleMyList={() => toggleMyList(selectedTitle)}
          title={selectedTitle}
        />
      )}
    </div>
  )
}
