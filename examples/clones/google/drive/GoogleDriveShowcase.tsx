import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import './GoogleDriveShowcase.css'

export type GoogleDriveSection =
  | 'home'
  | 'my-drive'
  | 'computers'
  | 'shared'
  | 'recent'
  | 'starred'
  | 'spam'
  | 'trash'

export type GoogleDriveDocumentType =
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'image'
  | 'video'
  | 'archive'

// The clone shell intentionally consumes the same neutral file vocabulary as
// FileBrowser. Product-specific presentation metadata is optional and stays in
// this namespaced example instead of leaking into the framework contract.
export interface GoogleDriveItem {
  id: string
  kind: 'folder' | 'file'
  name: string
  parent_id?: string
  content_type?: string
  size_bytes?: number
  modified_at: string
  owner: string
  document_type?: GoogleDriveDocumentType
  shared?: boolean
  starred?: boolean
  trashed?: boolean
  suggested_reason?: string
  members?: string[]
}

export interface GoogleDriveShowcaseProps {
  items?: readonly GoogleDriveItem[]
  initialSection?: GoogleDriveSection
  initialView?: 'list' | 'grid'
  initialSelectedId?: string
  showAiShelf?: boolean
}

export const GOOGLE_DRIVE_SAMPLE_ITEMS: readonly GoogleDriveItem[] = [
  {
    id: 'product',
    kind: 'folder',
    name: 'Product',
    modified_at: '2026-07-17T16:20:00Z',
    owner: 'me',
    shared: true,
    members: ['AK', 'MR', 'JL'],
  },
  {
    id: 'finance',
    kind: 'folder',
    name: 'Finance & Legal',
    modified_at: '2026-07-16T22:05:00Z',
    owner: 'me',
    shared: true,
    starred: true,
    members: ['AK', 'LT'],
  },
  {
    id: 'brand',
    kind: 'folder',
    name: 'Brand studio',
    modified_at: '2026-07-16T18:44:00Z',
    owner: 'Maya Rivera',
    shared: true,
    members: ['MR', 'AK', 'SC'],
  },
  {
    id: 'people',
    kind: 'folder',
    name: 'People operations',
    modified_at: '2026-07-15T19:12:00Z',
    owner: 'me',
    members: ['AK'],
  },
  {
    id: 'operating-plan',
    kind: 'file',
    name: 'Q3 operating plan',
    content_type: 'application/vnd.google-apps.document',
    document_type: 'document',
    size_bytes: 184_320,
    modified_at: '2026-07-17T17:48:00Z',
    owner: 'me',
    shared: true,
    starred: true,
    suggested_reason: 'You opened this yesterday',
    members: ['AK', 'MR'],
  },
  {
    id: 'revenue-forecast',
    kind: 'file',
    name: 'Revenue forecast FY26',
    content_type: 'application/vnd.google-apps.spreadsheet',
    document_type: 'spreadsheet',
    size_bytes: 426_752,
    modified_at: '2026-07-17T16:32:00Z',
    owner: 'Lina Tran',
    shared: true,
    suggested_reason: 'Lina edited this today',
    members: ['LT', 'AK'],
  },
  {
    id: 'investor-update',
    kind: 'file',
    name: 'Investor update — July',
    content_type: 'application/vnd.google-apps.presentation',
    document_type: 'presentation',
    size_bytes: 3_804_160,
    modified_at: '2026-07-17T14:10:00Z',
    owner: 'me',
    shared: true,
    suggested_reason: 'You present this next week',
    members: ['AK', 'JL'],
  },
  {
    id: 'supplier-agreement',
    kind: 'file',
    name: 'Supplier agreement — Northwind.pdf',
    content_type: 'application/pdf',
    document_type: 'pdf',
    size_bytes: 1_724_416,
    modified_at: '2026-07-16T20:24:00Z',
    owner: CLONE_DEMO_IDENTITY.user,
    shared: true,
    suggested_reason: `${CLONE_DEMO_IDENTITY.user} mentioned you`,
    members: ['J', 'AK'],
  },
  {
    id: 'board-notes',
    kind: 'file',
    name: 'Board meeting notes',
    parent_id: 'finance',
    content_type: 'application/vnd.google-apps.document',
    document_type: 'document',
    size_bytes: 96_256,
    modified_at: '2026-07-17T13:05:00Z',
    owner: 'me',
    starred: true,
    members: ['AK', 'LT'],
  },
  {
    id: 'budget-model',
    kind: 'file',
    name: 'FY26 budget model',
    parent_id: 'finance',
    content_type: 'application/vnd.google-apps.spreadsheet',
    document_type: 'spreadsheet',
    size_bytes: 2_156_544,
    modified_at: '2026-07-16T17:30:00Z',
    owner: 'Lina Tran',
    shared: true,
    members: ['LT', 'AK'],
  },
  {
    id: 'product-roadmap',
    kind: 'file',
    name: 'Product roadmap H2',
    parent_id: 'product',
    content_type: 'application/vnd.google-apps.spreadsheet',
    document_type: 'spreadsheet',
    size_bytes: 752_640,
    modified_at: '2026-07-17T15:43:00Z',
    owner: 'me',
    shared: true,
    members: ['AK', 'MR', 'JL'],
  },
  {
    id: 'research-reel',
    kind: 'file',
    name: 'Customer research reel.mp4',
    parent_id: 'product',
    content_type: 'video/mp4',
    document_type: 'video',
    size_bytes: 248_512_512,
    modified_at: '2026-07-15T18:18:00Z',
    owner: 'Maya Rivera',
    shared: true,
    members: ['MR', 'AK'],
  },
  {
    id: 'desktop-sync',
    kind: 'folder',
    name: 'Avery’s MacBook',
    parent_id: '__computers__',
    modified_at: '2026-07-17T17:51:00Z',
    owner: 'me',
  },
  {
    id: 'old-export',
    kind: 'file',
    name: 'Legacy customer export.zip',
    content_type: 'application/zip',
    document_type: 'archive',
    size_bytes: 54_263_808,
    modified_at: '2026-06-02T09:14:00Z',
    owner: 'me',
    trashed: true,
  },
]

const SECTION_LABELS: Record<GoogleDriveSection, string> = {
  home: 'Home',
  'my-drive': 'My Drive',
  computers: 'Computers',
  shared: 'Shared with me',
  recent: 'Recent',
  starred: 'Starred',
  spam: 'Spam',
  trash: 'Trash',
}

export function selectGoogleDriveItems(
  items: readonly GoogleDriveItem[],
  section: GoogleDriveSection,
  folderId: string | null,
  query: string,
): GoogleDriveItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (normalizedQuery) {
    return items
      .filter(item => !item.trashed)
      .filter(item => `${item.name} ${item.owner} ${item.content_type ?? ''}`
        .toLocaleLowerCase()
        .includes(normalizedQuery))
      .sort(compareDriveItems)
  }

  let selected: GoogleDriveItem[]
  switch (section) {
    case 'computers':
      selected = items.filter(item => item.parent_id === '__computers__' && !item.trashed)
      break
    case 'shared':
      selected = items.filter(item => item.shared && !item.trashed)
      break
    case 'recent':
      selected = items.filter(item => !item.trashed)
      break
    case 'starred':
      selected = items.filter(item => item.starred && !item.trashed)
      break
    case 'trash':
      selected = items.filter(item => item.trashed)
      break
    case 'spam':
      selected = []
      break
    case 'home':
      selected = items.filter(item => !item.parent_id && !item.trashed)
      break
    case 'my-drive':
      selected = items.filter(item => (item.parent_id ?? null) === folderId && !item.trashed)
      break
  }

  return selected.sort(section === 'recent' ? compareModified : compareDriveItems)
}

export function formatGoogleDriveBytes(bytes?: number): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unit = units[0]
  for (let index = 1; index < units.length && value >= 1024; index++) {
    value /= 1024
    unit = units[index]
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${unit}`
}

function compareDriveItems(left: GoogleDriveItem, right: GoogleDriveItem): number {
  if (left.kind !== right.kind) return left.kind === 'folder' ? -1 : 1
  return left.name.localeCompare(right.name)
}

function compareModified(left: GoogleDriveItem, right: GoogleDriveItem): number {
  return right.modified_at.localeCompare(left.modified_at)
}

function formatModified(timestamp: string): string {
  const day = timestamp.slice(8, 10).replace(/^0/, '')
  const month = new Date(timestamp).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  return `${month} ${day}`
}

function itemLocation(item: GoogleDriveItem, items: readonly GoogleDriveItem[]): string {
  if (!item.parent_id) return 'My Drive'
  if (item.parent_id === '__computers__') return 'Computers'
  return items.find(candidate => candidate.id === item.parent_id)?.name ?? 'My Drive'
}

export function GoogleDriveShowcase({
  items = GOOGLE_DRIVE_SAMPLE_ITEMS,
  initialSection = 'my-drive',
  initialView = 'list',
  initialSelectedId,
  showAiShelf = true,
}: GoogleDriveShowcaseProps) {
  const [section, setSection] = useState<GoogleDriveSection>(initialSection)
  const [view, setView] = useState<'list' | 'grid'>(initialView)
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [detailsOpen, setDetailsOpen] = useState(Boolean(initialSelectedId))
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [newMenuOpen, setNewMenuOpen] = useState(false)
  const [aiShelfVisible, setAiShelfVisible] = useState(showAiShelf)

  useEffect(() => {
    setSection(initialSection)
    setCurrentFolderId(null)
  }, [initialSection])
  useEffect(() => setView(initialView), [initialView])
  useEffect(() => {
    setSelectedId(initialSelectedId ?? null)
    setDetailsOpen(Boolean(initialSelectedId))
  }, [initialSelectedId])
  useEffect(() => setAiShelfVisible(showAiShelf), [showAiShelf])

  const visibleItems = useMemo(
    () => selectGoogleDriveItems(items, section, currentFolderId, query),
    [items, section, currentFolderId, query],
  )
  const selectedItem = items.find(item => item.id === selectedId)
  const folders = visibleItems.filter(item => item.kind === 'folder')
  const files = visibleItems.filter(item => item.kind === 'file')
  const currentFolder = currentFolderId
    ? items.find(item => item.id === currentFolderId)
    : undefined
  const showSuggestions = (
    (section === 'home' || (section === 'my-drive' && currentFolderId === null))
    && query.trim() === ''
  )
  const suggested = items
    .filter(item => item.suggested_reason && !item.trashed)
    .slice(0, 4)

  const navigate = (nextSection: GoogleDriveSection) => {
    setSection(nextSection)
    setCurrentFolderId(null)
    setSelectedId(null)
    setQuery('')
  }

  const openItem = (item: GoogleDriveItem) => {
    if (item.kind !== 'folder') {
      setSelectedId(item.id)
      setDetailsOpen(true)
      return
    }
    if (item.parent_id === '__computers__') {
      setSelectedId(item.id)
      return
    }
    setSection('my-drive')
    setCurrentFolderId(item.id)
    setSelectedId(null)
  }

  const selectItem = (item: GoogleDriveItem) => setSelectedId(item.id)

  const handleItemKey = (event: KeyboardEvent, item: GoogleDriveItem) => {
    if (event.key === 'Enter') openItem(item)
    if (event.key === ' ') {
      event.preventDefault()
      selectItem(item)
    }
  }

  const closeNewMenu = () => setNewMenuOpen(false)

  return (
    <div className="google-drive-showcase" onClick={closeNewMenu}>
      <header className="gdrive-topbar">
        <div className="gdrive-brand">
          <button className="gdrive-icon-button" aria-label="Main menu">
            <GoogleDriveIcon name="menu" />
          </button>
          <GoogleDriveMark />
          <span>Drive</span>
        </div>

        <form className="gdrive-search" onSubmit={event => event.preventDefault()}>
          <GoogleDriveIcon name="search" />
          <input
            aria-label="Search in Drive"
            placeholder="Search in Drive"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <GoogleDriveIcon name="close" />
            </button>
          )}
          <button type="button" aria-label="Search options">
            <GoogleDriveIcon name="tune" />
          </button>
        </form>

        <div className="gdrive-top-actions">
          <button className="gdrive-icon-button" aria-label="Help">
            <GoogleDriveIcon name="help" />
          </button>
          <button className="gdrive-icon-button" aria-label="Settings">
            <GoogleDriveIcon name="settings" />
          </button>
          <button className="gdrive-icon-button gdrive-apps-button" aria-label="Apps">
            <GoogleDriveIcon name="apps" />
          </button>
          <button
            className="gdrive-avatar gdrive-avatar-large"
            aria-label={`Account: ${CLONE_DEMO_IDENTITY.user}`}
          >
            {CLONE_DEMO_IDENTITY.user.charAt(0)}
          </button>
        </div>
      </header>

      <aside className="gdrive-sidebar">
        <div className="gdrive-new-wrap">
          <button
            className="gdrive-new-button"
            aria-expanded={newMenuOpen}
            onClick={(event: MouseEvent) => {
              event.stopPropagation()
              setNewMenuOpen(open => !open)
            }}
          >
            <GoogleDriveIcon name="plus" size={24} />
            <span>New</span>
          </button>
          {newMenuOpen && (
            <div className="gdrive-new-menu" role="menu" onClick={event => event.stopPropagation()}>
              <button role="menuitem"><GoogleDriveIcon name="folder-plus" />New folder</button>
              <div />
              <button role="menuitem"><GoogleDriveIcon name="upload-file" />File upload</button>
              <button role="menuitem"><GoogleDriveIcon name="upload-folder" />Folder upload</button>
              <div />
              <button role="menuitem"><DocumentGlyph type="document" />Google Doc</button>
              <button role="menuitem"><DocumentGlyph type="spreadsheet" />Google Sheet</button>
              <button role="menuitem"><DocumentGlyph type="presentation" />Google Slides</button>
            </div>
          )}
        </div>

        <nav className="gdrive-nav" aria-label="Drive navigation">
          <NavigationButton section="home" active={section === 'home'} icon="home" onSelect={navigate} />
          <NavigationButton section="my-drive" active={section === 'my-drive'} icon="drive" onSelect={navigate} />
          <NavigationButton section="computers" active={section === 'computers'} icon="computer" onSelect={navigate} />
          <NavigationButton section="shared" active={section === 'shared'} icon="people" onSelect={navigate} />
          <NavigationButton section="recent" active={section === 'recent'} icon="clock" onSelect={navigate} />
          <NavigationButton section="starred" active={section === 'starred'} icon="star" onSelect={navigate} />
          <NavigationButton section="spam" active={section === 'spam'} icon="spam" onSelect={navigate} />
          <NavigationButton section="trash" active={section === 'trash'} icon="trash" onSelect={navigate} />
        </nav>

        <div className="gdrive-storage">
          <div className="gdrive-storage-label">
            <GoogleDriveIcon name="cloud" />
            <span>Storage</span>
          </div>
          <div className="gdrive-storage-track"><span /></div>
          <p>8.4 GB of 30 GB used</p>
          <button>Get more storage</button>
        </div>
      </aside>

      <main className="gdrive-main">
        <div className={`gdrive-work-area${detailsOpen ? ' gdrive-with-details' : ''}`}>
          <section className="gdrive-content">
            <div className="gdrive-content-header">
              <div className="gdrive-breadcrumbs">
                {currentFolder && (
                  <>
                    <button onClick={() => setCurrentFolderId(null)}>My Drive</button>
                    <GoogleDriveIcon name="chevron-right" size={18} />
                  </>
                )}
                <button className="gdrive-heading-button">
                  {query ? 'Search results' : currentFolder?.name ?? SECTION_LABELS[section]}
                  {!query && !currentFolder && <GoogleDriveIcon name="chevron-down" size={18} />}
                </button>
              </div>
              <div className="gdrive-view-actions">
                <div className="gdrive-view-toggle" aria-label="Layout">
                  <button
                    className={view === 'list' ? 'active' : ''}
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                  >
                    <GoogleDriveIcon name="list" />
                  </button>
                  <button
                    className={view === 'grid' ? 'active' : ''}
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                  >
                    <GoogleDriveIcon name="grid" />
                  </button>
                </div>
                <button
                  className={`gdrive-icon-button${detailsOpen ? ' active' : ''}`}
                  aria-label="View details"
                  aria-pressed={detailsOpen}
                  onClick={() => setDetailsOpen(open => !open)}
                >
                  <GoogleDriveIcon name="info" />
                </button>
              </div>
            </div>

            <div className="gdrive-filter-row">
              <FilterButton label="Type" />
              <FilterButton label="People" />
              <FilterButton label="Modified" />
            </div>

            {aiShelfVisible && showSuggestions && (
              <div className="gdrive-ai-shelf">
                <div className="gdrive-ai-mark"><GoogleDriveIcon name="sparkles" /></div>
                <div className="gdrive-ai-copy">
                  <strong>Ask Drive about your work</strong>
                  <span>Get answers grounded in your files</span>
                </div>
                <div className="gdrive-ai-prompts">
                  <button>Summarize the Q3 plan</button>
                  <button>What changed this week?</button>
                </div>
                <button
                  className="gdrive-icon-button"
                  aria-label="Dismiss"
                  onClick={() => setAiShelfVisible(false)}
                >
                  <GoogleDriveIcon name="close" size={18} />
                </button>
              </div>
            )}

            {showSuggestions && (
              <section className="gdrive-section">
                <div className="gdrive-section-title">
                  <h2>Suggested</h2>
                  <button>View all</button>
                </div>
                <div className="gdrive-suggested-grid">
                  {suggested.map(item => (
                    <div
                      key={item.id}
                      className={`gdrive-suggested-card${selectedId === item.id ? ' selected' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectItem(item)}
                      onDoubleClick={() => openItem(item)}
                      onKeyDown={event => handleItemKey(event, item)}
                    >
                      <div className="gdrive-suggested-meta">
                        <DocumentGlyph type={item.document_type} />
                        <span>{item.name}</span>
                        <GoogleDriveIcon name="more" />
                      </div>
                      <FilePreview item={item} />
                      <div className="gdrive-suggested-reason">
                        <AvatarStack members={item.members} />
                        <span>{item.suggested_reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {view === 'grid' ? (
              <DriveGrid
                folders={folders}
                files={files}
                selectedId={selectedId}
                onSelect={selectItem}
                onOpen={openItem}
                onKeyDown={handleItemKey}
              />
            ) : (
              <DriveList
                folders={folders}
                files={files}
                selectedId={selectedId}
                onSelect={selectItem}
                onOpen={openItem}
                onKeyDown={handleItemKey}
              />
            )}

            {visibleItems.length === 0 && (
              <div className="gdrive-empty">
                <GoogleDriveIcon name={section === 'trash' ? 'trash' : 'folder-open'} size={48} />
                <h2>{query ? 'No files match your search' : `Nothing in ${SECTION_LABELS[section]}`}</h2>
                <p>{query ? 'Try different words or remove a filter.' : 'Items added here will appear in this view.'}</p>
              </div>
            )}
          </section>

          {detailsOpen && (
            <DetailsPanel
              item={selectedItem}
              location={selectedItem ? itemLocation(selectedItem, items) : undefined}
              onClose={() => setDetailsOpen(false)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function NavigationButton({
  section,
  active,
  icon,
  onSelect,
}: {
  section: GoogleDriveSection
  active: boolean
  icon: GoogleDriveIconName
  onSelect: (section: GoogleDriveSection) => void
}) {
  return (
    <button
      className={active ? 'active' : ''}
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(section)}
    >
      <GoogleDriveIcon name={icon} />
      <span>{SECTION_LABELS[section]}</span>
      {section === 'my-drive' && <GoogleDriveIcon name="chevron-right" size={16} />}
    </button>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="gdrive-filter-button">
      {label}
      <GoogleDriveIcon name="chevron-down" size={16} />
    </button>
  )
}

interface DriveCollectionProps {
  folders: GoogleDriveItem[]
  files: GoogleDriveItem[]
  selectedId: string | null
  onSelect: (item: GoogleDriveItem) => void
  onOpen: (item: GoogleDriveItem) => void
  onKeyDown: (event: KeyboardEvent, item: GoogleDriveItem) => void
}

function DriveGrid({
  folders,
  files,
  selectedId,
  onSelect,
  onOpen,
  onKeyDown,
}: DriveCollectionProps) {
  return (
    <>
      {folders.length > 0 && (
        <section className="gdrive-section">
          <div className="gdrive-section-title"><h2>Folders</h2></div>
          <div className="gdrive-folder-grid">
            {folders.map(item => (
              <div
                key={item.id}
                className={`gdrive-folder-card${selectedId === item.id ? ' selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onOpen(item)}
                onKeyDown={event => onKeyDown(event, item)}
              >
                <GoogleDriveIcon name="folder" />
                <span>{item.name}</span>
                <AvatarStack members={item.members} />
                <button aria-label={`More actions for ${item.name}`} onClick={event => event.stopPropagation()}>
                  <GoogleDriveIcon name="more" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {files.length > 0 && (
        <section className="gdrive-section">
          <div className="gdrive-section-title"><h2>Files</h2></div>
          <div className="gdrive-file-grid">
            {files.map(item => (
              <div
                key={item.id}
                className={`gdrive-file-card${selectedId === item.id ? ' selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onOpen(item)}
                onKeyDown={event => onKeyDown(event, item)}
              >
                <div className="gdrive-file-card-title">
                  <DocumentGlyph type={item.document_type} />
                  <span>{item.name}</span>
                  <button aria-label={`More actions for ${item.name}`} onClick={event => event.stopPropagation()}>
                    <GoogleDriveIcon name="more" />
                  </button>
                </div>
                <FilePreview item={item} />
                <div className="gdrive-file-card-footer">
                  <span>{item.owner === 'me' ? 'Me' : item.owner}</span>
                  <span>{formatModified(item.modified_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function DriveList({
  folders,
  files,
  selectedId,
  onSelect,
  onOpen,
  onKeyDown,
}: DriveCollectionProps) {
  const items = [...folders, ...files]
  if (items.length === 0) return null

  return (
    <section className="gdrive-section gdrive-list-section">
      <div className="gdrive-section-title">
        <h2>{folders.length > 0 && files.length > 0 ? 'Folders and files' : folders.length > 0 ? 'Folders' : 'Files'}</h2>
      </div>
      <div className="gdrive-table-wrap">
        <table className="gdrive-table">
          <thead>
            <tr>
              <th>Name <GoogleDriveIcon name="arrow-up" size={16} /></th>
              <th>Owner</th>
              <th>Last modified</th>
              <th>File size</th>
              <th><span className="gdrive-visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                className={selectedId === item.id ? 'selected' : ''}
                tabIndex={0}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onOpen(item)}
                onKeyDown={event => onKeyDown(event, item)}
              >
                <td>
                  {item.kind === 'folder'
                    ? <GoogleDriveIcon name="folder" className="gdrive-folder-icon" />
                    : <DocumentGlyph type={item.document_type} />}
                  <span>{item.name}</span>
                  {item.shared && <GoogleDriveIcon name="people" size={15} className="gdrive-shared-icon" />}
                </td>
                <td>{item.owner === 'me' ? 'me' : item.owner}</td>
                <td>{formatModified(item.modified_at)} by {item.owner === 'me' ? 'me' : item.owner.split(' ')[0]}</td>
                <td>{item.kind === 'folder' ? '—' : formatGoogleDriveBytes(item.size_bytes)}</td>
                <td>
                  <button aria-label={`More actions for ${item.name}`} onClick={event => event.stopPropagation()}>
                    <GoogleDriveIcon name="more" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function DetailsPanel({
  item,
  location,
  onClose,
}: {
  item?: GoogleDriveItem
  location?: string
  onClose: () => void
}) {
  return (
    <aside className="gdrive-details">
      <div className="gdrive-details-header">
        <strong>{item?.name ?? 'Details'}</strong>
        <button className="gdrive-icon-button" aria-label="Close details" onClick={onClose}>
          <GoogleDriveIcon name="close" />
        </button>
      </div>
      {!item ? (
        <div className="gdrive-details-empty">
          <GoogleDriveIcon name="info" size={42} />
          <h2>Select an item to see details</h2>
          <p>Activity, sharing, and file metadata will appear here.</p>
        </div>
      ) : (
        <>
          <div className="gdrive-details-preview">
            {item.kind === 'folder'
              ? <GoogleDriveIcon name="folder" size={64} />
              : <FilePreview item={item} />}
          </div>
          <div className="gdrive-details-tabs">
            <button className="active">Details</button>
            <button>Activity</button>
          </div>
          <dl className="gdrive-details-list">
            <div><dt>Type</dt><dd>{item.kind === 'folder' ? 'Folder' : item.document_type ?? 'File'}</dd></div>
            <div>
              <dt>Owner</dt>
              <dd>{item.owner === 'me' ? `${CLONE_DEMO_IDENTITY.user} (me)` : item.owner}</dd>
            </div>
            <div><dt>Location</dt><dd>{location ?? 'My Drive'}</dd></div>
            <div><dt>Modified</dt><dd>{formatModified(item.modified_at)}, 2026</dd></div>
            {item.kind === 'file' && <div><dt>Size</dt><dd>{formatGoogleDriveBytes(item.size_bytes)}</dd></div>}
          </dl>
          <div className="gdrive-details-sharing">
            <h3>Who has access</h3>
            <div><AvatarStack members={item.members} /><span>{item.shared ? 'Shared with your team' : 'Only you'}</span></div>
            <button>Manage access</button>
          </div>
        </>
      )}
    </aside>
  )
}

function FilePreview({ item }: { item: GoogleDriveItem }) {
  const type = item.document_type ?? 'document'
  return (
    <div className="gdrive-preview" data-type={type}>
      {type === 'spreadsheet' ? (
        <div className="gdrive-preview-sheet">
          {Array.from({ length: 20 }, (_, index) => <span key={index} className={index % 6 === 0 ? 'accent' : ''} />)}
        </div>
      ) : type === 'presentation' ? (
        <div className="gdrive-preview-slide">
          <strong>JULY</strong>
          <span>Investor update</span>
          <i /><i /><i />
        </div>
      ) : type === 'pdf' ? (
        <div className="gdrive-preview-document">
          <strong>MASTER SERVICES AGREEMENT</strong>
          <span /><span /><span /><span /><span />
        </div>
      ) : type === 'video' ? (
        <div className="gdrive-preview-video">
          <div><GoogleDriveIcon name="play" size={28} /></div>
          <span>Customer conversations</span>
        </div>
      ) : (
        <div className="gdrive-preview-document">
          <strong>{item.name.toUpperCase()}</strong>
          <span /><span /><span /><span /><span />
          <div />
        </div>
      )}
    </div>
  )
}

function DocumentGlyph({ type = 'document' }: { type?: GoogleDriveDocumentType }) {
  return (
    <span className="gdrive-document-glyph" data-type={type}>
      <GoogleDriveIcon name={type === 'image' ? 'image' : type === 'video' ? 'play-box' : 'file'} size={18} />
    </span>
  )
}

function AvatarStack({ members }: { members?: string[] }) {
  if (!members?.length) return null
  return (
    <span className="gdrive-avatar-stack" aria-label={`Shared with ${members.length} people`}>
      {members.slice(0, 3).map((member, index) => (
        <span key={`${member}-${index}`} className="gdrive-avatar" data-index={index}>{member}</span>
      ))}
    </span>
  )
}

function GoogleDriveMark() {
  return (
    <span className="gdrive-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}

type GoogleDriveIconName =
  | 'apps'
  | 'arrow-up'
  | 'chevron-down'
  | 'chevron-right'
  | 'clock'
  | 'close'
  | 'cloud'
  | 'computer'
  | 'drive'
  | 'file'
  | 'folder'
  | 'folder-open'
  | 'folder-plus'
  | 'grid'
  | 'help'
  | 'home'
  | 'image'
  | 'info'
  | 'list'
  | 'menu'
  | 'more'
  | 'people'
  | 'play'
  | 'play-box'
  | 'plus'
  | 'search'
  | 'settings'
  | 'spam'
  | 'sparkles'
  | 'star'
  | 'trash'
  | 'tune'
  | 'upload-file'
  | 'upload-folder'

function GoogleDriveIcon({
  name,
  size = 20,
  className,
}: {
  name: GoogleDriveIconName
  size?: number
  className?: string
}) {
  let content
  switch (name) {
    case 'menu':
      content = <path d="M4 7h16M4 12h16M4 17h16" />
      break
    case 'search':
      content = <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>
      break
    case 'tune':
      content = <><path d="M4 7h10M18 7h2M4 17h2M10 17h10M8 4v6M16 14v6" /></>
      break
    case 'help':
      content = <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.8 2c-1 .7-1.6 1.2-1.6 2.5M12 17h.01" /></>
      break
    case 'settings':
      content = <><circle cx="12" cy="12" r="3" /><path d="M19 13.5v-3l-2-.7-.8-1.8.9-1.9-2.2-2.2-1.9.9-1.8-.8-.7-2h-3l-.7 2-1.8.8-1.9-.9L.9 6.1 1.8 8 1 9.8l-2 .7v3l2 .7.8 1.8-.9 1.9 2.2 2.2 1.9-.9 1.8.8.7 2h3l.7-2 1.8-.8 1.9.9 2.2-2.2-.9-1.9.8-1.8 2-.7Z" transform="translate(2)" /></>
      break
    case 'apps':
      content = <>{[6, 12, 18].flatMap(y => [6, 12, 18].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="currentColor" stroke="none" />))}</>
      break
    case 'plus':
      content = <path d="M12 4v16M4 12h16" />
      break
    case 'home':
      content = <><path d="m3 11 9-7 9 7" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>
      break
    case 'drive':
      content = <><path d="M5 4h5l2 3h7v13H5z" /><path d="M5 9h14" /></>
      break
    case 'computer':
      content = <><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M10 17l-1 4M14 17l1 4" /></>
      break
    case 'people':
      content = <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-4 2.6-6 6-6s6 2 6 6M15 14.5c3.3 0 5 1.8 5 4.5" /></>
      break
    case 'clock':
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>
      break
    case 'star':
      content = <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />
      break
    case 'spam':
      content = <><path d="m8 3-5 5v8l5 5h8l5-5V8l-5-5z" /><path d="M12 7v6M12 17h.01" /></>
      break
    case 'trash':
      content = <><path d="M4 7h16M9 3h6l1 4M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>
      break
    case 'cloud':
      content = <path d="M7 19h11a4 4 0 0 0 .5-8A6.5 6.5 0 0 0 6 9.5 4.8 4.8 0 0 0 7 19Z" />
      break
    case 'chevron-right':
      content = <path d="m9 5 7 7-7 7" />
      break
    case 'chevron-down':
      content = <path d="m5 9 7 7 7-7" />
      break
    case 'list':
      content = <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r=".8" fill="currentColor" /><circle cx="4" cy="12" r=".8" fill="currentColor" /><circle cx="4" cy="18" r=".8" fill="currentColor" /></>
      break
    case 'grid':
      content = <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>
      break
    case 'info':
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>
      break
    case 'sparkles':
      content = <><path d="m8 3 1.2 3.8L13 8l-3.8 1.2L8 13 6.8 9.2 3 8l3.8-1.2zM17 12l.9 2.6 2.6.9-2.6.9L17 19l-.9-2.6-2.6-.9 2.6-.9z" /></>
      break
    case 'close':
      content = <path d="m6 6 12 12M18 6 6 18" />
      break
    case 'more':
      content = <><circle cx="6" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" /></>
      break
    case 'folder':
    case 'folder-open':
      content = <path d="M3 6h7l2 2h9v11H3z" fill="currentColor" stroke="none" />
      break
    case 'file':
      content = <><path d="M6 3h8l4 4v14H6z" fill="currentColor" stroke="none" /><path d="M14 3v5h5" stroke="white" strokeOpacity=".75" /></>
      break
    case 'image':
      content = <><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" stroke="none" /><circle cx="9" cy="9" r="2" stroke="white" /><path d="m6 18 4-4 2.5 2.5 2-2L19 18" stroke="white" /></>
      break
    case 'play':
      content = <path d="m9 7 8 5-8 5z" fill="currentColor" stroke="none" />
      break
    case 'play-box':
      content = <><rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" stroke="none" /><path d="m10 9 6 3-6 3z" fill="white" stroke="none" /></>
      break
    case 'arrow-up':
      content = <path d="m8 10 4-4 4 4M12 6v12" />
      break
    case 'folder-plus':
      content = <><path d="M3 6h7l2 2h9v11H3z" /><path d="M12 11v5M9.5 13.5h5" /></>
      break
    case 'upload-file':
      content = <><path d="M6 3h8l4 4v14H6zM14 3v5h4" /><path d="M12 17V10m-3 3 3-3 3 3" /></>
      break
    case 'upload-folder':
      content = <><path d="M3 6h7l2 2h9v11H3z" /><path d="M12 17v-6m-3 3 3-3 3 3" /></>
      break
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  )
}
