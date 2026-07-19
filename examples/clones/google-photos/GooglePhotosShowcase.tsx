import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from 'react'
import {
  formatMediaDuration,
  groupMediaItems,
  sortMediaItems,
  type MediaCollectionData,
  type MediaItemData,
} from '../../../src/widgets/mediaShape'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import './GooglePhotosShowcase.css'

export type GooglePhotosSection =
  | 'photos'
  | 'updates'
  | 'collections'
  | 'albums'
  | 'favorites'
  | 'people'
  | 'places'
  | 'videos'
  | 'recent'
  | 'archive'
  | 'locked'
  | 'trash'

export interface GooglePhotosItem extends MediaItemData {
  archived?: boolean
  trashed?: boolean
  shared?: boolean
  people?: string[]
  location?: string
  layout?: 'square' | 'wide' | 'portrait' | 'hero'
}

export interface GooglePhotosShowcaseProps {
  items?: readonly GooglePhotosItem[]
  collections?: readonly MediaCollectionData[]
  initialSection?: GooglePhotosSection
  initialQuery?: string
  initialSelectedId?: string
  initialDetailsOpen?: boolean
  showMemories?: boolean
  showAskPhotos?: boolean
}

type SampleScene = 'coast' | 'ridge' | 'city' | 'forest' | 'studio' | 'harbor'
type SelectionEvent = MouseEvent | ReactKeyboardEvent

function sampleItem({
  id,
  title,
  scene,
  capturedAt,
  kind = 'image',
  favorite = false,
  collectionIds = [],
  tags = [],
  people = [],
  location,
  layout = 'square',
  durationSeconds,
  archived = false,
  trashed = false,
  shared = false,
}: {
  id: string
  title: string
  scene: SampleScene
  capturedAt: string
  kind?: 'image' | 'video'
  favorite?: boolean
  collectionIds?: string[]
  tags?: string[]
  people?: string[]
  location?: string
  layout?: GooglePhotosItem['layout']
  durationSeconds?: number
  archived?: boolean
  trashed?: boolean
  shared?: boolean
}): GooglePhotosItem {
  const thumbnailUrl = `/examples/media-demo.svg#${scene}`
  return {
    id,
    title,
    kind,
    url: kind === 'video'
      ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      : thumbnailUrl,
    thumbnailUrl,
    capturedAt,
    createdAt: capturedAt,
    contentType: kind === 'video' ? 'video/mp4' : 'image/jpeg',
    width: layout === 'portrait' ? 3024 : layout === 'wide' || layout === 'hero' ? 4032 : 3024,
    height: layout === 'portrait' ? 4032 : layout === 'wide' || layout === 'hero' ? 2268 : 3024,
    durationSeconds,
    favorite,
    tags,
    collectionIds,
    metadata: {
      location: location ?? '',
      camera: kind === 'video' ? 'Pixel 10 Pro' : 'Mirrorless',
    },
    context: { media_id: id },
    archived,
    trashed,
    shared,
    people,
    location,
    layout,
  }
}

export const GOOGLE_PHOTOS_SAMPLE_ITEMS: readonly GooglePhotosItem[] = [
  sampleItem({
    id: 'golden-coast',
    title: 'Golden coast',
    scene: 'coast',
    capturedAt: '2026-07-17T18:42:00Z',
    favorite: true,
    collectionIds: ['california-weekend'],
    tags: ['coast', 'ocean', 'summer'],
    people: [CLONE_DEMO_IDENTITY.user, 'Maya'],
    location: 'Half Moon Bay, California',
    layout: 'hero',
    shared: true,
  }),
  sampleItem({
    id: 'harbor-walk',
    title: 'Harbor walk',
    scene: 'harbor',
    capturedAt: '2026-07-17T18:16:00Z',
    collectionIds: ['california-weekend'],
    tags: ['harbor', 'boat'],
    people: ['Maya'],
    location: 'Half Moon Bay, California',
    layout: 'portrait',
  }),
  sampleItem({
    id: 'coastal-clip',
    title: 'Coastal approach',
    scene: 'coast',
    capturedAt: '2026-07-17T17:58:00Z',
    kind: 'video',
    durationSeconds: 24,
    collectionIds: ['california-weekend'],
    tags: ['coast', 'drive'],
    location: 'California',
    layout: 'wide',
  }),
  sampleItem({
    id: 'ridge-light',
    title: 'Ridge light',
    scene: 'ridge',
    capturedAt: '2026-07-17T17:31:00Z',
    favorite: true,
    collectionIds: ['california-weekend'],
    tags: ['ridge', 'sunset'],
    people: [CLONE_DEMO_IDENTITY.user],
    location: 'Montara, California',
    layout: 'wide',
  }),
  sampleItem({
    id: 'forest-path',
    title: 'Forest path',
    scene: 'forest',
    capturedAt: '2026-07-17T16:54:00Z',
    collectionIds: ['california-weekend'],
    tags: ['trail', 'forest'],
    location: 'Purissima Creek, California',
    layout: 'portrait',
  }),
  sampleItem({
    id: 'evening-city',
    title: 'Evening in the city',
    scene: 'city',
    capturedAt: '2026-07-14T04:22:00Z',
    favorite: true,
    collectionIds: ['city-notes'],
    tags: ['city', 'night'],
    people: ['Lina'],
    location: 'San Francisco, California',
    layout: 'wide',
    shared: true,
  }),
  sampleItem({
    id: 'studio-board',
    title: 'Studio board',
    scene: 'studio',
    capturedAt: '2026-07-14T03:48:00Z',
    collectionIds: ['team-retreat'],
    tags: ['studio', 'workshop'],
    people: ['Lina', 'Maya', 'Sam'],
    location: 'San Francisco, California',
    layout: 'square',
  }),
  sampleItem({
    id: 'night-drive',
    title: 'Night drive',
    scene: 'city',
    capturedAt: '2026-07-14T02:20:00Z',
    kind: 'video',
    durationSeconds: 48,
    collectionIds: ['city-notes'],
    tags: ['city', 'drive'],
    location: 'San Francisco, California',
    layout: 'portrait',
  }),
  sampleItem({
    id: 'team-harbor',
    title: 'Team at the harbor',
    scene: 'harbor',
    capturedAt: '2026-07-12T19:12:00Z',
    collectionIds: ['team-retreat'],
    tags: ['team', 'harbor'],
    people: [CLONE_DEMO_IDENTITY.user, 'Lina', 'Maya', 'Sam'],
    location: 'Oakland, California',
    layout: 'hero',
    shared: true,
  }),
  sampleItem({
    id: 'retreat-ridge',
    title: 'Retreat overlook',
    scene: 'ridge',
    capturedAt: '2026-07-12T18:44:00Z',
    favorite: true,
    collectionIds: ['team-retreat'],
    tags: ['team', 'ridge'],
    people: [CLONE_DEMO_IDENTITY.user, 'Sam'],
    location: 'Oakland, California',
    layout: 'wide',
  }),
  sampleItem({
    id: 'workshop-wall',
    title: 'Workshop wall',
    scene: 'studio',
    capturedAt: '2026-07-12T17:03:00Z',
    collectionIds: ['team-retreat'],
    tags: ['workshop', 'ideas'],
    people: ['Maya'],
    location: 'Oakland, California',
    layout: 'portrait',
  }),
  sampleItem({
    id: 'quiet-water',
    title: 'Quiet water',
    scene: 'coast',
    capturedAt: '2026-06-28T20:14:00Z',
    collectionIds: ['summer-journal'],
    tags: ['ocean', 'quiet'],
    location: 'Pacific Grove, California',
    layout: 'wide',
  }),
  sampleItem({
    id: 'pine-study',
    title: 'Pine study',
    scene: 'forest',
    capturedAt: '2026-06-28T19:45:00Z',
    favorite: true,
    collectionIds: ['summer-journal'],
    tags: ['forest', 'green'],
    location: 'Big Sur, California',
    layout: 'portrait',
  }),
  sampleItem({
    id: 'sunset-pass',
    title: 'Sunset pass',
    scene: 'ridge',
    capturedAt: '2026-06-28T19:05:00Z',
    kind: 'video',
    durationSeconds: 72,
    collectionIds: ['summer-journal'],
    tags: ['sunset', 'mountains'],
    location: 'Big Sur, California',
    layout: 'wide',
  }),
  sampleItem({
    id: 'archive-scan',
    title: 'Family album scan',
    scene: 'studio',
    capturedAt: '2024-12-24T17:05:00Z',
    collectionIds: ['family'],
    tags: ['family', 'scan'],
    people: [CLONE_DEMO_IDENTITY.user, 'Maya'],
    layout: 'square',
    archived: true,
  }),
  sampleItem({
    id: 'discarded-frame',
    title: 'Discarded frame',
    scene: 'city',
    capturedAt: '2026-05-03T02:11:00Z',
    tags: ['duplicate'],
    layout: 'square',
    trashed: true,
  }),
]

export const GOOGLE_PHOTOS_SAMPLE_COLLECTIONS: readonly MediaCollectionData[] = [
  {
    id: 'california-weekend',
    name: 'California weekend',
    coverUrl: '/examples/media-demo.svg#coast',
    itemCount: 5,
    context: {},
  },
  {
    id: 'team-retreat',
    name: 'Team retreat',
    coverUrl: '/examples/media-demo.svg#harbor',
    itemCount: 4,
    context: {},
  },
  {
    id: 'city-notes',
    name: 'City notes',
    coverUrl: '/examples/media-demo.svg#city',
    itemCount: 2,
    context: {},
  },
  {
    id: 'summer-journal',
    name: 'Summer journal',
    coverUrl: '/examples/media-demo.svg#forest',
    itemCount: 3,
    context: {},
  },
  {
    id: 'family',
    name: 'Family',
    coverUrl: '/examples/media-demo.svg#studio',
    itemCount: 1,
    context: {},
  },
]

const SECTION_LABELS: Record<GooglePhotosSection, string> = {
  photos: 'Photos',
  updates: 'Updates',
  collections: 'Collections',
  albums: 'Albums',
  favorites: 'Favorites',
  people: 'People & pets',
  places: 'Places',
  videos: 'Videos',
  recent: 'Recently added',
  archive: 'Archive',
  locked: 'Locked Folder',
  trash: 'Trash',
}

export function selectGooglePhotosItems(
  items: readonly GooglePhotosItem[],
  section: GooglePhotosSection,
  query = '',
): GooglePhotosItem[] {
  let selected = items.filter(item => !item.archived && !item.trashed)

  if (section === 'favorites') selected = selected.filter(item => item.favorite)
  if (section === 'videos') selected = selected.filter(item => item.kind === 'video')
  if (section === 'archive') selected = items.filter(item => item.archived && !item.trashed)
  if (section === 'trash') selected = items.filter(item => item.trashed)
  if (section === 'locked') selected = []

  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (normalizedQuery) {
    selected = selected.filter(item => [
      item.title,
      item.description,
      item.location,
      ...item.people ?? [],
      ...item.tags,
      ...Object.values(item.metadata),
    ]
      .filter(value => value != null)
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery))
  }

  return sortMediaItems(selected) as GooglePhotosItem[]
}

export function GooglePhotosShowcase({
  items = GOOGLE_PHOTOS_SAMPLE_ITEMS,
  collections = GOOGLE_PHOTOS_SAMPLE_COLLECTIONS,
  initialSection = 'photos',
  initialQuery = '',
  initialSelectedId,
  initialDetailsOpen = false,
  showMemories = true,
  showAskPhotos = true,
}: GooglePhotosShowcaseProps) {
  const [section, setSection] = useState<GooglePhotosSection>(initialSection)
  const [query, setQuery] = useState(initialQuery)
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [detailsOpen, setDetailsOpen] = useState(initialDetailsOpen)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => setSection(initialSection), [initialSection])
  useEffect(() => setQuery(initialQuery), [initialQuery])
  useEffect(() => setSelectedId(initialSelectedId ?? null), [initialSelectedId])
  useEffect(() => setDetailsOpen(initialDetailsOpen), [initialDetailsOpen])

  const visibleItems = useMemo(
    () => selectGooglePhotosItems(items, section, query),
    [items, query, section],
  )
  const groups = useMemo(() => groupMediaItems(visibleItems, 'day'), [visibleItems])
  const selectedIndex = selectedId == null
    ? -1
    : visibleItems.findIndex(item => item.id === selectedId)
  const selectedItem = selectedIndex >= 0 ? visibleItems[selectedIndex] : undefined

  useEffect(() => {
    if (!selectedItem) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null)
      if (event.key === 'ArrowLeft') {
        setSelectedId(visibleItems[(selectedIndex - 1 + visibleItems.length) % visibleItems.length]?.id ?? null)
      }
      if (event.key === 'ArrowRight') {
        setSelectedId(visibleItems[(selectedIndex + 1) % visibleItems.length]?.id ?? null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex, selectedItem, visibleItems])

  const navigate = (nextSection: GooglePhotosSection) => {
    setSection(nextSection)
    setQuery('')
    setSelectedId(null)
    setSelectedIds(new Set())
  }

  const toggleSelection = (event: SelectionEvent, itemId: string) => {
    event.stopPropagation()
    setSelectedIds(current => {
      const next = new Set(current)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const closeCreateMenu = () => setCreateOpen(false)
  const isTimeline = !['updates', 'collections', 'albums', 'people', 'places'].includes(section)

  return (
    <div className="google-photos-showcase" onClick={closeCreateMenu}>
      <header className="gphotos-topbar">
        <div className="gphotos-brand">
          <button type="button" className="gphotos-icon-button gphotos-menu-button" aria-label="Main menu">
            <PhotosIcon name="menu" />
          </button>
          <GooglePhotosMark />
          <span>Photos</span>
        </div>

        <label className="gphotos-search">
          <PhotosIcon name={showAskPhotos ? 'sparkles' : 'search'} />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onFocus={() => {
              if (section !== 'photos') setSection('photos')
            }}
            placeholder={showAskPhotos ? 'Ask Photos or search your library' : 'Search your photos'}
            aria-label="Search your photos"
          />
          {query ? (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <PhotosIcon name="close" />
            </button>
          ) : (
            <button type="button" aria-label="Search options">
              <PhotosIcon name="tune" />
            </button>
          )}
        </label>

        <div className="gphotos-top-actions">
          <button type="button" className="gphotos-upload-button">
            <PhotosIcon name="upload" />
            <span>Upload</span>
          </button>
          <button type="button" className="gphotos-icon-button" aria-label="Help">
            <PhotosIcon name="help" />
          </button>
          <button type="button" className="gphotos-icon-button" aria-label="Settings">
            <PhotosIcon name="settings" />
          </button>
          <button type="button" className="gphotos-icon-button" aria-label="Google apps">
            <PhotosIcon name="apps" />
          </button>
          <button
            type="button"
            className="gphotos-avatar"
            aria-label={`Account: ${CLONE_DEMO_IDENTITY.user}`}
          >
            {CLONE_DEMO_IDENTITY.user.charAt(0)}
          </button>
        </div>
      </header>

      <div className="gphotos-shell">
        <aside className="gphotos-sidebar" aria-label="Google Photos navigation">
          <div className="gphotos-create-wrap">
            <button
              type="button"
              className="gphotos-create"
              aria-expanded={createOpen}
              onClick={event => {
                event.stopPropagation()
                setCreateOpen(open => !open)
              }}
            >
              <PhotosIcon name="plus" />
              <span>Create</span>
            </button>
            {createOpen && (
              <div className="gphotos-create-menu">
                <CreateMenuItem icon="album" label="Album" />
                <CreateMenuItem icon="collage" label="Collage" />
                <CreateMenuItem icon="play" label="Highlight video" />
                <CreateMenuItem icon="wand" label="Animation" />
              </div>
            )}
          </div>

          <nav className="gphotos-nav">
            <NavItem section="photos" icon="photos" active={section === 'photos'} onSelect={navigate} />
            <NavItem section="updates" icon="notifications" active={section === 'updates'} onSelect={navigate} />
            <div className="gphotos-nav-heading">Collections</div>
            <NavItem section="collections" icon="collections" active={section === 'collections'} onSelect={navigate} />
            <NavItem section="albums" icon="album" active={section === 'albums'} onSelect={navigate} nested />
            <NavItem section="favorites" icon="favorite" active={section === 'favorites'} onSelect={navigate} nested />
            <NavItem section="people" icon="people" active={section === 'people'} onSelect={navigate} nested />
            <NavItem section="places" icon="location" active={section === 'places'} onSelect={navigate} nested />
            <NavItem section="videos" icon="video" active={section === 'videos'} onSelect={navigate} nested />
            <NavItem section="recent" icon="schedule" active={section === 'recent'} onSelect={navigate} nested />
            <NavItem section="archive" icon="archive" active={section === 'archive'} onSelect={navigate} nested />
            <NavItem section="locked" icon="lock" active={section === 'locked'} onSelect={navigate} nested />
            <NavItem section="trash" icon="trash" active={section === 'trash'} onSelect={navigate} nested />
          </nav>

          <div className="gphotos-storage">
            <PhotosIcon name="cloud" />
            <div>
              <strong>Storage</strong>
              <span>8.4 GB of 15 GB used</span>
              <div className="gphotos-storage-track"><span /></div>
            </div>
          </div>
        </aside>

        <main className="gphotos-main">
          {selectedIds.size > 0 && (
            <SelectionBar
              count={selectedIds.size}
              onClose={() => setSelectedIds(new Set())}
            />
          )}

          {query.trim() ? (
            <SearchResults
              query={query}
              items={visibleItems}
              selectedIds={selectedIds}
              onOpen={item => setSelectedId(item.id)}
              onToggleSelection={toggleSelection}
            />
          ) : section === 'updates' ? (
            <UpdatesView items={items} />
          ) : section === 'collections' ? (
            <CollectionsView
              items={items}
              collections={collections}
              onNavigate={navigate}
            />
          ) : section === 'albums' ? (
            <AlbumsView collections={collections} />
          ) : section === 'people' ? (
            <PeopleView items={items} />
          ) : section === 'places' ? (
            <PlacesView items={items} />
          ) : isTimeline ? (
            <TimelineView
              section={section}
              groups={groups}
              selectedIds={selectedIds}
              showMemories={showMemories && section === 'photos'}
              onOpen={item => setSelectedId(item.id)}
              onToggleSelection={toggleSelection}
            />
          ) : null}
        </main>
      </div>

      {selectedItem && (
        <PhotoViewer
          item={selectedItem}
          index={selectedIndex}
          count={visibleItems.length}
          detailsOpen={detailsOpen}
          onDetailsToggle={() => setDetailsOpen(open => !open)}
          onClose={() => setSelectedId(null)}
          onPrevious={() => {
            setSelectedId(visibleItems[(selectedIndex - 1 + visibleItems.length) % visibleItems.length]?.id ?? null)
          }}
          onNext={() => {
            setSelectedId(visibleItems[(selectedIndex + 1) % visibleItems.length]?.id ?? null)
          }}
        />
      )}
    </div>
  )
}

function NavItem({
  section,
  icon,
  active,
  nested = false,
  onSelect,
}: {
  section: GooglePhotosSection
  icon: PhotosIconName
  active: boolean
  nested?: boolean
  onSelect: (section: GooglePhotosSection) => void
}) {
  return (
    <button
      type="button"
      className={`gphotos-nav-item ${active ? 'is-active' : ''} ${nested ? 'is-nested' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(section)}
    >
      <PhotosIcon name={icon} />
      <span>{SECTION_LABELS[section]}</span>
    </button>
  )
}

function CreateMenuItem({ icon, label }: { icon: PhotosIconName; label: string }) {
  return (
    <button type="button">
      <PhotosIcon name={icon} />
      <span>{label}</span>
    </button>
  )
}

function SelectionBar({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div className="gphotos-selection-bar">
      <button type="button" className="gphotos-icon-button" aria-label="Clear selection" onClick={onClose}>
        <PhotosIcon name="close" />
      </button>
      <strong>{count} selected</strong>
      <span />
      <button type="button" className="gphotos-icon-button" aria-label="Share selected">
        <PhotosIcon name="share" />
      </button>
      <button type="button" className="gphotos-icon-button" aria-label="Add selected to album">
        <PhotosIcon name="addAlbum" />
      </button>
      <button type="button" className="gphotos-icon-button" aria-label="Delete selected">
        <PhotosIcon name="trash" />
      </button>
      <button type="button" className="gphotos-icon-button" aria-label="More actions">
        <PhotosIcon name="more" />
      </button>
    </div>
  )
}

function TimelineView({
  section,
  groups,
  selectedIds,
  showMemories,
  onOpen,
  onToggleSelection,
}: {
  section: GooglePhotosSection
  groups: ReturnType<typeof groupMediaItems>
  selectedIds: Set<string>
  showMemories: boolean
  onOpen: (item: GooglePhotosItem) => void
  onToggleSelection: (event: SelectionEvent, itemId: string) => void
}) {
  return (
    <div className="gphotos-content">
      <div className="gphotos-page-heading">
        <div>
          <h1>{SECTION_LABELS[section]}</h1>
          {section === 'photos' && <p>Your memories, backed up and organized</p>}
        </div>
        <div className="gphotos-density-switch" aria-label="Photo density">
          <button type="button" className="is-active">Day</button>
          <button type="button">Month</button>
          <button type="button"><PhotosIcon name="more" /></button>
        </div>
      </div>

      {showMemories && <MemoriesShelf />}

      {groups.length === 0 ? (
        <EmptyView section={section} />
      ) : (
        <div className="gphotos-timeline">
          {groups.map(group => (
            <section className="gphotos-day" key={group.key} aria-labelledby={`gphotos-${group.key}`}>
              <header>
                <button type="button" aria-label={`Select ${group.label}`}>
                  <PhotosIcon name="check" />
                </button>
                <h2 id={`gphotos-${group.key}`}>{friendlyGroupLabel(group.key, group.label)}</h2>
                <span>{group.items.length} {group.items.length === 1 ? 'item' : 'items'}</span>
              </header>
              <div className="gphotos-grid">
                {(group.items as GooglePhotosItem[]).map(item => (
                  <PhotoTile
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onOpen={() => onOpen(item)}
                    onToggleSelection={event => onToggleSelection(event, item.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function MemoriesShelf() {
  const memories = [
    { title: 'Best of spring', subtitle: 'Highlights', scene: 'forest' },
    { title: '2 years ago', subtitle: 'Jul 17, 2024', scene: 'coast' },
    { title: 'California coast', subtitle: 'Recent trip', scene: 'harbor' },
    { title: 'City evenings', subtitle: 'A look back', scene: 'city' },
    { title: 'Together', subtitle: `Maya and ${CLONE_DEMO_IDENTITY.user}`, scene: 'ridge' },
  ] as const

  return (
    <section className="gphotos-memories" aria-labelledby="gphotos-memories-title">
      <div className="gphotos-section-heading">
        <h2 id="gphotos-memories-title">Memories</h2>
        <button type="button">View all <PhotosIcon name="chevronRight" /></button>
      </div>
      <div className="gphotos-memory-row">
        {memories.map(memory => (
          <button type="button" className="gphotos-memory-card" key={memory.title}>
            <img src={`/examples/media-demo.svg#${memory.scene}`} alt="" />
            <span className="gphotos-memory-shade" />
            <span className="gphotos-memory-copy">
              <strong>{memory.title}</strong>
              <small>{memory.subtitle}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function PhotoTile({
  item,
  selected,
  onOpen,
  onToggleSelection,
}: {
  item: GooglePhotosItem
  selected: boolean
  onOpen: () => void
  onToggleSelection: (event: SelectionEvent) => void
}) {
  const [failed, setFailed] = useState(false)
  const duration = formatMediaDuration(item.durationSeconds)
  return (
    <button
      type="button"
      className={`gphotos-tile gphotos-tile-${item.layout ?? 'square'} ${selected ? 'is-selected' : ''}`}
      onClick={onOpen}
      onKeyDown={(event: ReactKeyboardEvent) => {
        if (event.key === ' ') {
          event.preventDefault()
          onToggleSelection(event)
        }
      }}
      aria-label={`Open ${item.kind === 'video' ? 'video' : 'photo'} ${item.title}`}
    >
      {!failed ? (
        <img
          src={item.thumbnailUrl ?? item.url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="gphotos-tile-fallback"><PhotosIcon name={item.kind === 'video' ? 'play' : 'photos'} /></span>
      )}
      <span className="gphotos-tile-overlay" />
      <span
        role="checkbox"
        aria-checked={selected}
        className="gphotos-select-control"
        onClick={onToggleSelection}
      >
        {selected ? <PhotosIcon name="check" /> : null}
      </span>
      {item.favorite && <span className="gphotos-favorite-badge"><PhotosIcon name="favoriteFilled" /></span>}
      {item.kind === 'video' && (
        <span className="gphotos-video-badge"><PhotosIcon name="play" /> {duration}</span>
      )}
      <span className="gphotos-tile-title">{item.title}</span>
    </button>
  )
}

function SearchResults({
  query,
  items,
  selectedIds,
  onOpen,
  onToggleSelection,
}: {
  query: string
  items: GooglePhotosItem[]
  selectedIds: Set<string>
  onOpen: (item: GooglePhotosItem) => void
  onToggleSelection: (event: SelectionEvent, itemId: string) => void
}) {
  return (
    <div className="gphotos-content gphotos-search-results">
      <div className="gphotos-ask-summary">
        <span className="gphotos-ask-orb"><PhotosIcon name="sparkles" /></span>
        <div>
          <small>Ask Photos</small>
          <strong>{items.length > 0
            ? `Here are the moments I found for “${query}”`
            : `I couldn't find photos matching “${query}”`}
          </strong>
          {items.length > 0 && <p>Results include titles, places, people, and visual tags in your library.</p>}
        </div>
        <button type="button" className="gphotos-icon-button" aria-label="Ask Photos information">
          <PhotosIcon name="info" />
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyView section="photos" search />
      ) : (
        <>
          <div className="gphotos-page-heading">
            <div><h1>Search results</h1><p>{items.length} matching items</p></div>
          </div>
          <div className="gphotos-search-grid">
            {items.map(item => (
              <PhotoTile
                key={item.id}
                item={{ ...item, layout: 'square' }}
                selected={selectedIds.has(item.id)}
                onOpen={() => onOpen(item)}
                onToggleSelection={event => onToggleSelection(event, item.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CollectionsView({
  items,
  collections,
  onNavigate,
}: {
  items: readonly GooglePhotosItem[]
  collections: readonly MediaCollectionData[]
  onNavigate: (section: GooglePhotosSection) => void
}) {
  const favorites = items.filter(item => item.favorite && !item.trashed).length
  return (
    <div className="gphotos-content">
      <div className="gphotos-page-heading">
        <div><h1>Collections</h1><p>Albums and groups from across your library</p></div>
      </div>

      <div className="gphotos-shortcut-grid">
        <CollectionShortcut
          icon="favoriteFilled"
          label="Favorites"
          detail={`${favorites} items`}
          tone="rose"
          onClick={() => onNavigate('favorites')}
        />
        <CollectionShortcut icon="archive" label="Archive" detail="Hidden from Photos" tone="blue" onClick={() => onNavigate('archive')} />
        <CollectionShortcut icon="trash" label="Trash" detail="Deleted items" tone="gray" onClick={() => onNavigate('trash')} />
        <CollectionShortcut icon="lock" label="Locked Folder" detail="Private" tone="slate" onClick={() => onNavigate('locked')} />
      </div>

      <section className="gphotos-collection-destinations" aria-labelledby="gphotos-library-heading">
        <div className="gphotos-section-heading">
          <h2 id="gphotos-library-heading">Your library</h2>
        </div>
        <div className="gphotos-destination-grid">
          <DestinationCard scene="studio" icon="album" label="Albums" onClick={() => onNavigate('albums')} />
          <DestinationCard scene="ridge" icon="people" label="People & pets" onClick={() => onNavigate('people')} />
          <DestinationCard scene="coast" icon="location" label="Places" onClick={() => onNavigate('places')} />
          <DestinationCard scene="city" icon="document" label="Documents" />
          <DestinationCard scene="harbor" icon="video" label="Videos" onClick={() => onNavigate('videos')} />
          <DestinationCard scene="forest" icon="schedule" label="Recently added" onClick={() => onNavigate('recent')} />
        </div>
      </section>

      <AlbumShelf collections={collections} />
    </div>
  )
}

function CollectionShortcut({
  icon,
  label,
  detail,
  tone,
  onClick,
}: {
  icon: PhotosIconName
  label: string
  detail: string
  tone: string
  onClick: () => void
}) {
  return (
    <button type="button" className={`gphotos-shortcut gphotos-tone-${tone}`} onClick={onClick}>
      <span><PhotosIcon name={icon} /></span>
      <div><strong>{label}</strong><small>{detail}</small></div>
      <PhotosIcon name="chevronRight" />
    </button>
  )
}

function DestinationCard({
  scene,
  icon,
  label,
  onClick,
}: {
  scene: SampleScene
  icon: PhotosIconName
  label: string
  onClick?: () => void
}) {
  return (
    <button type="button" className="gphotos-destination" onClick={onClick}>
      <img src={`/examples/media-demo.svg#${scene}`} alt="" />
      <span />
      <strong><PhotosIcon name={icon} /> {label}</strong>
    </button>
  )
}

function AlbumsView({ collections }: { collections: readonly MediaCollectionData[] }) {
  return (
    <div className="gphotos-content">
      <div className="gphotos-page-heading gphotos-albums-heading">
        <div><h1>Albums</h1><p>All of your albums, together</p></div>
        <button type="button" className="gphotos-primary-action"><PhotosIcon name="plus" /> Create album</button>
      </div>
      <div className="gphotos-tabs">
        <button type="button" className="is-active">All</button>
        <button type="button">My albums</button>
        <button type="button">Shared with me</button>
        <span />
        <button type="button"><PhotosIcon name="sort" /> Most recent photo</button>
      </div>
      <AlbumShelf collections={collections} standalone />
    </div>
  )
}

function AlbumShelf({
  collections,
  standalone = false,
}: {
  collections: readonly MediaCollectionData[]
  standalone?: boolean
}) {
  return (
    <section className={`gphotos-album-shelf ${standalone ? 'is-standalone' : ''}`} aria-labelledby="gphotos-albums-title">
      {!standalone && (
        <div className="gphotos-section-heading">
          <h2 id="gphotos-albums-title">Albums</h2>
          <button type="button">View all <PhotosIcon name="chevronRight" /></button>
        </div>
      )}
      <div className="gphotos-album-grid">
        {collections.map((collection, index) => (
          <button type="button" className="gphotos-album-card" key={collection.id}>
            <span className="gphotos-album-cover">
              <img src={collection.coverUrl} alt="" />
              {index < 2 && <span className="gphotos-shared-chip"><PhotosIcon name="people" /></span>}
            </span>
            <strong>{collection.name}</strong>
            <small>{collection.itemCount ?? 0} items{index < 2 ? ' · Shared' : ''}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function PeopleView({ items }: { items: readonly GooglePhotosItem[] }) {
  const people = [...new Set(items.flatMap(item => item.people ?? []))]
  const scenes: SampleScene[] = ['studio', 'coast', 'ridge', 'harbor']
  return (
    <div className="gphotos-content">
      <div className="gphotos-page-heading"><div><h1>People & pets</h1><p>Faces grouped from your library</p></div></div>
      <div className="gphotos-people-grid">
        {people.map((person, index) => (
          <button type="button" key={person}>
            <span><img src={`/examples/media-demo.svg#${scenes[index % scenes.length]}`} alt="" /></span>
            <strong>{person}</strong>
          </button>
        ))}
      </div>
    </div>
  )
}

function PlacesView({ items }: { items: readonly GooglePhotosItem[] }) {
  const places = [...new Set(items.map(item => item.location).filter((place): place is string => Boolean(place)))]
  const scenes: SampleScene[] = ['coast', 'city', 'forest', 'harbor']
  return (
    <div className="gphotos-content">
      <div className="gphotos-page-heading"><div><h1>Places</h1><p>Explore photos by where they were taken</p></div></div>
      <button type="button" className="gphotos-map-preview">
        <span className="gphotos-map-water" />
        <span className="gphotos-map-road road-one" />
        <span className="gphotos-map-road road-two" />
        <span className="gphotos-map-pin pin-one"><PhotosIcon name="photos" /></span>
        <span className="gphotos-map-pin pin-two"><PhotosIcon name="photos" /></span>
        <strong><PhotosIcon name="location" /> Explore your map</strong>
      </button>
      <div className="gphotos-place-grid">
        {places.slice(0, 4).map((place, index) => (
          <button type="button" key={place}>
            <img src={`/examples/media-demo.svg#${scenes[index]}`} alt="" />
            <strong>{place}</strong>
            <small>{items.filter(item => item.location === place).length} items</small>
          </button>
        ))}
      </div>
    </div>
  )
}

function UpdatesView({ items }: { items: readonly GooglePhotosItem[] }) {
  const sharedItems = items.filter(item => item.shared).slice(0, 3)
  return (
    <div className="gphotos-content gphotos-updates">
      <div className="gphotos-page-heading"><div><h1>Updates</h1><p>Sharing activity and suggestions</p></div></div>
      <section>
        <h2>New</h2>
        {sharedItems.map((item, index) => (
          <button type="button" className="gphotos-update-row" key={item.id}>
            <span className="gphotos-update-avatar">{['MR', 'LT', 'SC'][index]}</span>
            <div>
              <strong>{['Maya Rivera', 'Lina Tran', 'Sam Chen'][index]} shared a photo with you</strong>
              <small>{index === 0 ? '12 minutes ago' : index === 1 ? 'Yesterday' : 'Jul 12'}</small>
            </div>
            <img src={item.thumbnailUrl ?? item.url} alt="" />
          </button>
        ))}
      </section>
      <section>
        <h2>Suggestions</h2>
        <button type="button" className="gphotos-update-row">
          <span className="gphotos-update-avatar is-google"><GooglePhotosMark /></span>
          <div><strong>A new memory is ready: Best of spring</strong><small>Yesterday</small></div>
          <img src="/examples/media-demo.svg#forest" alt="" />
        </button>
      </section>
    </div>
  )
}

function EmptyView({ section, search = false }: { section: GooglePhotosSection; search?: boolean }) {
  return (
    <div className="gphotos-empty">
      <span><PhotosIcon name={search ? 'search' : section === 'locked' ? 'lock' : 'photos'} /></span>
      <h2>{search ? 'No results found' : `Nothing in ${SECTION_LABELS[section]}`}</h2>
      <p>{search
        ? 'Try another person, place, date, or description.'
        : section === 'locked'
          ? 'Move sensitive photos and videos here to keep them private.'
          : 'Photos and videos added here will appear in this view.'
      }</p>
    </div>
  )
}

function PhotoViewer({
  item,
  index,
  count,
  detailsOpen,
  onDetailsToggle,
  onClose,
  onPrevious,
  onNext,
}: {
  item: GooglePhotosItem
  index: number
  count: number
  detailsOpen: boolean
  onDetailsToggle: () => void
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div className="gphotos-viewer" role="dialog" aria-modal="true" aria-label={`Viewing ${item.title}`}>
      <header>
        <button type="button" className="gphotos-viewer-button" aria-label="Back to photos" onClick={onClose}>
          <PhotosIcon name="arrowBack" />
        </button>
        <div className="gphotos-viewer-title">
          <strong>{item.title}</strong>
          <small>{formatFullDate(item.capturedAt)}</small>
        </div>
        <span />
        <button type="button" className="gphotos-viewer-button" aria-label="Ask about this photo">
          <PhotosIcon name="sparkles" />
        </button>
        <button type="button" className="gphotos-viewer-button" aria-label="Share">
          <PhotosIcon name="share" />
        </button>
        <button type="button" className="gphotos-viewer-button" aria-label="Edit">
          <PhotosIcon name="edit" />
        </button>
        <button type="button" className={`gphotos-viewer-button ${item.favorite ? 'is-favorite' : ''}`} aria-label="Favorite">
          <PhotosIcon name={item.favorite ? 'favoriteFilled' : 'favorite'} />
        </button>
        <button
          type="button"
          className={`gphotos-viewer-button ${detailsOpen ? 'is-active' : ''}`}
          aria-label="Information"
          onClick={onDetailsToggle}
        >
          <PhotosIcon name="info" />
        </button>
        <button type="button" className="gphotos-viewer-button" aria-label="Delete">
          <PhotosIcon name="trash" />
        </button>
        <button type="button" className="gphotos-viewer-button" aria-label="More">
          <PhotosIcon name="more" />
        </button>
      </header>

      <div className={`gphotos-viewer-stage ${detailsOpen ? 'with-details' : ''}`}>
        {count > 1 && (
          <button type="button" className="gphotos-viewer-arrow is-left" aria-label="Previous photo" onClick={onPrevious}>
            <PhotosIcon name="chevronLeft" />
          </button>
        )}
        <div className="gphotos-viewer-media">
          <img src={item.thumbnailUrl ?? item.url} alt={item.title} />
          {item.kind === 'video' && <button type="button" className="gphotos-play-large" aria-label="Play video"><PhotosIcon name="play" /></button>}
          <span className="gphotos-viewer-count">{index + 1} of {count}</span>
        </div>
        {count > 1 && (
          <button type="button" className="gphotos-viewer-arrow is-right" aria-label="Next photo" onClick={onNext}>
            <PhotosIcon name="chevronRight" />
          </button>
        )}
        {detailsOpen && <PhotoDetails item={item} onClose={onDetailsToggle} />}
      </div>
    </div>
  )
}

function PhotoDetails({ item, onClose }: { item: GooglePhotosItem; onClose: () => void }) {
  return (
    <aside className="gphotos-details">
      <div className="gphotos-details-heading">
        <h2>Info</h2>
        <button type="button" aria-label="Close information" onClick={onClose}>
          <PhotosIcon name="close" />
        </button>
      </div>
      <section>
        <h3>Details</h3>
        <div><PhotosIcon name="schedule" /><span><strong>{formatFullDate(item.capturedAt)}</strong><small>{formatTime(item.capturedAt)}</small></span></div>
        <div><PhotosIcon name="info" /><span><strong>{item.title}</strong><small>{item.width} × {item.height} · {item.contentType}</small></span></div>
        {item.location && <div><PhotosIcon name="location" /><span><strong>{item.location}</strong><small>Estimated location</small></span></div>}
        <div><PhotosIcon name="camera" /><span><strong>{String(item.metadata.camera ?? 'Camera')}</strong><small>ƒ/1.8 · 1/420 · ISO 50</small></span></div>
      </section>
      <section>
        <h3>People</h3>
        <div className="gphotos-detail-people">
          {(item.people ?? []).map(person => <span key={person}>{person.slice(0, 1)}<small>{person}</small></span>)}
          {(item.people?.length ?? 0) === 0 && <p>No people recognized</p>}
        </div>
      </section>
      <section>
        <h3>Albums</h3>
        <div className="gphotos-detail-chips">
          {item.collectionIds.map(id => <span key={id}>{humanize(id)}</span>)}
          {item.collectionIds.length === 0 && <button type="button"><PhotosIcon name="plus" /> Add to album</button>}
        </div>
      </section>
    </aside>
  )
}

function friendlyGroupLabel(key: string, fallback: string): string {
  if (key === '2026-07-17') return 'Today'
  return fallback
}

function formatFullDate(value?: string): string {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function formatTime(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}

function humanize(value: string): string {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

function GooglePhotosMark() {
  return (
    <svg className="gphotos-logo" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#4285f4" d="M16 2a8 8 0 0 1 8 8v6h-8a8 8 0 0 1-8-8 6 6 0 0 1 8-6Z" />
      <path fill="#34a853" d="M30 16a8 8 0 0 1-8 8h-6v-8a8 8 0 0 1 8-8 6 6 0 0 1 6 8Z" />
      <path fill="#fbbc04" d="M16 30a8 8 0 0 1-8-8v-6h8a8 8 0 0 1 8 8 6 6 0 0 1-8 6Z" />
      <path fill="#ea4335" d="M2 16a8 8 0 0 1 8-8h6v8a8 8 0 0 1-8 8 6 6 0 0 1-6-8Z" />
    </svg>
  )
}

type PhotosIconName =
  | 'addAlbum'
  | 'album'
  | 'apps'
  | 'archive'
  | 'arrowBack'
  | 'camera'
  | 'check'
  | 'chevronLeft'
  | 'chevronRight'
  | 'close'
  | 'cloud'
  | 'collage'
  | 'collections'
  | 'document'
  | 'edit'
  | 'favorite'
  | 'favoriteFilled'
  | 'help'
  | 'info'
  | 'location'
  | 'lock'
  | 'menu'
  | 'more'
  | 'notifications'
  | 'people'
  | 'photos'
  | 'play'
  | 'plus'
  | 'schedule'
  | 'search'
  | 'settings'
  | 'share'
  | 'sort'
  | 'sparkles'
  | 'trash'
  | 'tune'
  | 'upload'
  | 'video'
  | 'wand'

function PhotosIcon({ name }: { name: PhotosIconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<PhotosIconName, React.ReactNode> = {
    addAlbum: <><rect x="3" y="5" width="14" height="14" rx="2" {...common} /><path d="M7 15l3-3 3 3 2-2 2 2M19 3v6M16 6h6" {...common} /></>,
    album: <><rect x="4" y="4" width="16" height="16" rx="2" {...common} /><path d="M8 4v16M11 8h6M11 12h6M11 16h4" {...common} /></>,
    apps: <>{[6, 12, 18].flatMap(y => [6, 12, 18].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" fill="currentColor" />))}</>,
    archive: <><path d="M4 7h16v13H4zM3 4h18v4H3zM9 12h6" {...common} /></>,
    arrowBack: <><path d="M19 12H5M11 6l-6 6 6 6" {...common} /></>,
    camera: <><path d="M4 8h4l2-3h4l2 3h4v11H4z" {...common} /><circle cx="12" cy="13" r="3.5" {...common} /></>,
    check: <path d="m5 12 4 4L19 6" {...common} />,
    chevronLeft: <path d="m15 5-7 7 7 7" {...common} />,
    chevronRight: <path d="m9 5 7 7-7 7" {...common} />,
    close: <path d="M6 6l12 12M18 6 6 18" {...common} />,
    cloud: <path d="M6 18h12a4 4 0 0 0 .7-7.9A7 7 0 0 0 5.3 9 4.5 4.5 0 0 0 6 18Z" {...common} />,
    collage: <><rect x="3" y="4" width="8" height="7" rx="1" {...common} /><rect x="13" y="4" width="8" height="12" rx="1" {...common} /><rect x="3" y="13" width="8" height="7" rx="1" {...common} /><rect x="13" y="18" width="8" height="2" rx="1" {...common} /></>,
    collections: <><rect x="5" y="3" width="14" height="14" rx="2" {...common} /><path d="M3 7v12a2 2 0 0 0 2 2h12M8 13l3-3 4 4 2-2 2 2" {...common} /></>,
    document: <><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" {...common} /></>,
    edit: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20ZM13.5 7l3.5 3.5" {...common} /></>,
    favorite: <path d="M12 20s-8-4.7-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.3-8 10-8 10Z" {...common} />,
    favoriteFilled: <path fill="currentColor" d="M12 21s-9-5.2-9-11.2A5 5 0 0 1 12 6.7a5 5 0 0 1 9 3.1C21 15.8 12 21 12 21Z" />,
    help: <><circle cx="12" cy="12" r="9" {...common} /><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1 .7-1.5 1.2-1.5 2.4M12 17h.01" {...common} /></>,
    info: <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 11v6M12 7h.01" {...common} /></>,
    location: <><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12Z" {...common} /><circle cx="12" cy="9" r="2.3" {...common} /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" {...common} /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" {...common} /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" {...common} />,
    more: <><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></>,
    notifications: <><path d="M6 17h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v5L6 17Z" {...common} /><path d="M10 20h4" {...common} /></>,
    people: <><circle cx="9" cy="9" r="3" {...common} /><circle cx="17" cy="10" r="2.5" {...common} /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14 16a4.5 4.5 0 0 1 6.5 4" {...common} /></>,
    photos: <><rect x="4" y="4" width="16" height="16" rx="2" {...common} /><circle cx="9" cy="9" r="1.5" {...common} /><path d="m5 17 5-5 3 3 2-2 4 4" {...common} /></>,
    play: <path d="m9 6 10 6-10 6V6Z" fill="currentColor" />,
    plus: <path d="M12 4v16M4 12h16" {...common} />,
    schedule: <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 7v5l3 2" {...common} /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" {...common} /><path d="m16 16 4 4" {...common} /></>,
    settings: <><circle cx="12" cy="12" r="3" {...common} /><path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7L10.5 2h-3l-.7 2-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7L0 10.5v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2.3h3l.7-2 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7 1.6-1Z" transform="translate(2)" {...common} /></>,
    share: <><circle cx="18" cy="5" r="2.5" {...common} /><circle cx="6" cy="12" r="2.5" {...common} /><circle cx="18" cy="19" r="2.5" {...common} /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" {...common} /></>,
    sort: <path d="M7 5v14M4 16l3 3 3-3M13 7h7M13 12h5M13 17h3" {...common} />,
    sparkles: <><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" {...common} /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" {...common} /></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" {...common} /></>,
    tune: <path d="M4 7h8M16 7h4M4 17h4M12 17h8M12 4v6M8 14v6" {...common} />,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M5 20h14" {...common} /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" {...common} /><path d="m17 10 4-2v8l-4-2" {...common} /></>,
    wand: <><path d="m5 19 11-11 3 3L8 22 5 19ZM14 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM5 7l.7-1.5L7 5l-1.3-.5L5 3l-.7 1.5L3 5l1.3.5L5 7Z" {...common} /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}
