/**
 * Page templates: whole product pages composed only from the public toolkit
 * entry (`medallion-terminal-core/toolkit`), so products copy structure from
 * here. Layout glue is utility classes on tokens; every control, list, grid
 * and state is a toolkit component. A unit test keeps the imports honest.
 */
import { useMemo, useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import {
  ActivityFeed,
  Avatar,
  Button,
  ButtonGroup,
  Callout,
  CommandPalette,
  DataGrid,
  Drawer,
  EmptyState,
  FacetList,
  FilePreview,
  Icon,
  IconButton,
  Inspector,
  Kbd,
  LinkGraph,
  LinkPanel,
  NavRail,
  ObjectChip,
  ObjectHeader,
  ObjectPage,
  PageHeader,
  Panel,
  PropertyList,
  PropertyPanel,
  SchemaGraph,
  SearchField,
  SplitPane,
  StatTile,
  StatusBadge,
  Tabs,
  Tree,
  TypeGlyph,
  formatBytes,
  typeColorFor,
  type DataGridColumn,
  type FacetGroup,
  type NavRailSection,
} from '../toolkit'
import {
  BUCKETS,
  BUCKET_TONES,
  CHURN_TONES,
  CONNECTORS,
  CONNECTOR_CONFIG,
  CONNECTOR_TONES,
  CONNECTOR_TYPE,
  CUSTOMER,
  CUSTOMERS,
  CUSTOMER_ACTIVITY,
  CUSTOMER_HISTORY,
  CUSTOMER_LINKS,
  CUSTOMER_LINK_TYPES,
  CUSTOMER_PROPERTIES,
  CUSTOMER_SCHEMA,
  EXPLORE_FACETS,
  FILES,
  FILE_TYPE,
  FOLDERS,
  INCIDENTS,
  NOW,
  OBJECT_TYPE,
  RELEASES,
  RELEASE_TONES,
  SCHEMA_RELATIONS,
  SCHEMA_TYPES,
  SERVICES,
  SYNC_HISTORY,
  TYPES,
  TYPE_ROWS,
  TYPE_STATUS_TONES,
  customerProperties,
  fixtureFetch,
  searchGroups,
  type BucketRow,
  type ConnectorRow,
  type CustomerRow,
  type FileRow,
  type ReleaseRow,
  type SchemaPropertyRow,
  type TypeRow,
} from './pages.fixture'

const meta = {
  title: 'Templates/Pages',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

/** The workspace navigation, shared by every template. */
const NAV: NavRailSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home', href: '#/' },
      { id: 'explore', label: 'Explore', icon: 'explore', href: '#/explore' },
      { id: 'ontology', label: 'Ontology', icon: 'ontology', href: '#/ontology' },
      { id: 'files', label: 'Files', icon: 'folder', href: '#/files' },
      { id: 'activity', label: 'Activity', icon: 'activity', href: '#/activity' },
    ],
  },
  {
    id: 'types',
    label: 'Object types',
    items: [
      { id: 'customer', label: 'Customer', type: TYPES.customer, count: 71, href: '#/explore?type=customer' },
      { id: 'person', label: 'Person', type: TYPES.person, count: 212, href: '#/explore?type=person' },
      { id: 'order', label: 'Order', type: TYPES.order, count: '3.1K', href: '#/explore?type=order' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    items: [
      { id: 'storage', label: 'Storage', icon: 'bucket', href: '#/storage' },
      { id: 'connect', label: 'Connect', icon: 'plug', href: '#/connect' },
      { id: 'operations', label: 'Operations', icon: 'server', href: '#/operations' },
    ],
  },
]

// ---------------------------------------------------------------------------
// The workspace frame: top bar, navigation rail (a drawer on phones), page,
// optional inspector (wide screens) and status bar.

interface FrameProps {
  active: string
  children: ReactNode
  inspector?: ReactNode
  railCollapsed?: boolean
}

function WorkspaceFrame({ active, children, inspector, railCollapsed = false }: FrameProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(railCollapsed)
  const groups = useMemo(() => searchGroups(query), [query])
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[var(--mtc-bg)] text-[var(--mtc-fg)]">
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--mtc-border)] bg-[var(--mtc-surface)] px-3">
        <div className="md:hidden">
          <IconButton icon={<Icon name="menu" />} aria-label="Open navigation" variant="ghost" onClick={() => setDrawerOpen(true)} />
        </div>
        <a href="#/" className="flex items-center gap-2 font-semibold text-[var(--mtc-fg)]">
          <TypeGlyph icon="ontology" color="azure" size={20} />
          <span>Workspace</span>
        </a>
        <div className="hidden sm:block">
          <Button size="small" variant="ghost" endIcon={<Icon name="chevron-down" />}>Research</Button>
        </div>
        <div className="ml-auto hidden md:block md:w-96">
          <Button className="w-full" startIcon={<Icon name="search" />} endIcon={<Kbd>Ctrl K</Kbd>} onClick={() => setPaletteOpen(true)}>
            <span className="flex-1 text-left text-[var(--mtc-muted)]">Search objects, types, files</span>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <div className="md:hidden">
            <IconButton icon={<Icon name="search" />} aria-label="Search" variant="ghost" onClick={() => setPaletteOpen(true)} />
          </div>
          <IconButton icon={<Icon name="settings" />} aria-label="Settings" variant="ghost" />
          <Avatar name="Jamie Kim" size={24} />
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <NavRail label="Workspace" sections={NAV} activeId={active} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        </div>
        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
        {inspector && <div className="hidden xl:flex">{inspector}</div>}
      </div>
      <footer className="flex h-6 shrink-0 items-center gap-3 border-t border-[var(--mtc-border)] bg-[var(--mtc-surface)] px-3 text-[length:var(--mtc-font-size-xs)] text-[var(--mtc-muted)]">
        <StatusBadge tone="warning">Prototype data</StatusBadge>
        <span className="hidden sm:inline">Ontology fresh 2 min ago</span>
        <span className="ml-auto">en · UTC</span>
      </footer>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Navigation" side="left" width={280}>
        <NavRail label="Workspace" sections={NAV} activeId={active} onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        query={query}
        onQueryChange={setQuery}
        groups={groups}
        onSelect={() => setPaletteOpen(false)}
        placeholder="Search objects, types, files"
        hotkey
      />
    </div>
  )
}

function Section({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 px-4 pt-4 pb-6 md:px-6">{children}</div>
}

// ---------------------------------------------------------------------------
// Shared column sets.

const CUSTOMER_COLUMNS: DataGridColumn<CustomerRow>[] = [
  { id: 'name', header: 'Name', accessor: row => row.name, primary: true, pinned: true },
  { id: 'segment', header: 'Segment', accessor: row => row.segment, kind: 'enum' },
  { id: 'acv', header: 'Annual contract value', accessor: row => row.acv, format: 'currency:USD' },
  { id: 'churn', header: 'Churn risk', accessor: row => row.churnRisk, kind: 'enum', tones: CHURN_TONES },
  { id: 'renewal', header: 'Renewal', accessor: row => row.renewal, kind: 'date' },
  { id: 'owner', header: 'Owner', accessor: row => row.owner, kind: 'link' },
  { id: 'regions', header: 'Regions', accessor: row => row.regions, kind: 'list', grow: true },
]

// ---------------------------------------------------------------------------
// Object explorer: facets, a type-scoped search and grid, and a preview.

function ObjectExplorer() {
  const [facets, setFacets] = useState<FacetGroup[]>(EXPLORE_FACETS)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>(['res-customer-northstar'])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const chosen = (id: string) => facets.find(group => group.id === id)?.selected ?? []
  const rows = CUSTOMERS.filter(row => (
    (chosen('segment').length === 0 || chosen('segment').includes(row.segment))
    && (chosen('churn').length === 0 || chosen('churn').includes(row.churnRisk))
    && row.name.toLowerCase().includes(query.trim().toLowerCase())
  ))
  const current = CUSTOMERS.find(row => row.id === selected[0])
  const facetList = (
    <FacetList
      label="Filters"
      groups={facets}
      onChange={(groupId, values) => setFacets(current => current.map(group => (group.id === groupId ? { ...group, selected: values } : group)))}
      onClear={() => setFacets(EXPLORE_FACETS.map(group => ({ ...group, selected: group.id === 'type' ? ['customer'] : [] })))}
    />
  )
  const inspector = current && (
    <Inspector label="Selected customer" width={340} actions={<IconButton icon={<Icon name="close" />} aria-label="Close preview" variant="ghost" size="small" onClick={() => setSelected([])} />}>
      <div className="grid gap-4 p-3">
        <ObjectHeader compact headingLevel={2} type={TYPES.customer} title={current.name} objectId={current.id} status={{ label: current.churnRisk, tone: CHURN_TONES[current.churnRisk] ?? 'neutral' }} />
        <PropertyList items={customerProperties(current)} />
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="People" value={3} />
          <StatTile label="Orders" value={12} />
          <StatTile label="Tickets" value={2} />
        </div>
        <Button intent="primary" variant="solid" endIcon={<Icon name="arrow-right" />}>Open object</Button>
      </div>
    </Inspector>
  )
  return (
    <WorkspaceFrame active="explore" railCollapsed inspector={inspector}>
      <div className="flex min-h-full">
        <div className="hidden w-60 shrink-0 border-r border-[var(--mtc-border)] lg:block">{facetList}</div>
        <div className="min-w-0 flex-1">
          <PageHeader
            title="Explore"
            description="Search every object in the workspace, narrowed by type and property."
            actions={(
              <>
                <div className="lg:hidden">
                  <Button startIcon={<Icon name="filter" />} onClick={() => setFiltersOpen(true)}>Filters</Button>
                </div>
                <Button startIcon={<Icon name="download" />}>Export</Button>
              </>
            )}
          />
          <Section>
            <SearchField
              label="Search customers"
              placeholder="Search customers"
              value={query}
              onValueChange={setQuery}
              tokens={[{ id: 'type', label: 'Customer', icon: <TypeGlyph icon="building" color="teal" size={16} /> }]}
              onRemoveToken={() => {}}
              shortcut="/"
            />
            <p className="m-0 text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]" role="status">
              {rows.length} of {CUSTOMERS.length} customers · sorted by annual contract value
            </p>
            <DataGrid
              label="Customers"
              columns={CUSTOMER_COLUMNS}
              rows={rows}
              rowKey={row => row.id}
              rowHref={row => `#/objects/${row.id}`}
              selection="single"
              selectedKeys={selected}
              onSelectionChange={setSelected}
              defaultSort={{ columnId: 'acv', direction: 'descending' }}
              height="auto"
            />
          </Section>
        </div>
      </div>
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" side="left" width={300}>
        {facetList}
      </Drawer>
    </WorkspaceFrame>
  )
}

export const ObjectExplorerPage: Story = {
  name: 'Object explorer',
  render: () => <ObjectExplorer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Explore', level: 1 })).toBeInTheDocument()
    await expect(canvas.getByRole('grid', { name: 'Customers' })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Object view: the object page with its overview, links and history.

function ObjectView() {
  return (
    <WorkspaceFrame active="customer">
      <ObjectPage
        breadcrumbs={[
          { label: 'Ontology', href: '#/ontology' },
          { label: 'Customer', href: '#/ontology/types/customer' },
          { label: 'Northstar Labs' },
        ]}
        header={{
          type: TYPES.customer,
          typeHref: '#/ontology/types/customer',
          title: 'Northstar Labs',
          objectId: 'res-customer-northstar',
          status: { label: 'Active', tone: 'ok' },
          meta: ['Updated 18 min ago by Jamie Kim', 'Revision 14', 'Source gold.customer_360'],
          actions: (
            <>
              <Button endIcon={<Icon name="chevron-down" />}>Actions</Button>
              <Button intent="primary" variant="solid">Edit properties</Button>
              <IconButton icon={<Icon name="more" />} aria-label="More object actions" />
            </>
          ),
        }}
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            panel: (
              <div className="grid gap-4 lg:grid-cols-2">
                <PropertyPanel properties={CUSTOMER_PROPERTIES} now={NOW} headingLevel={2} />
                <LinkPanel groups={CUSTOMER_LINKS} />
                <Panel title="Link graph" subtitle="1 hop">
                  <LinkGraph center={CUSTOMER} groups={CUSTOMER_LINKS} label="Links of Northstar Labs" height={280} />
                </Panel>
                <Panel title="Activity" padded>
                  <ActivityFeed items={CUSTOMER_ACTIVITY} now={NOW} aria-label="Recent activity" />
                </Panel>
              </div>
            ),
          },
          { id: 'properties', label: 'Properties', count: CUSTOMER_PROPERTIES.length, panel: <PropertyPanel properties={CUSTOMER_PROPERTIES} now={NOW} /> },
          { id: 'links', label: 'Links', count: 18, panel: <LinkPanel groups={CUSTOMER_LINKS} maxItems={10} /> },
          {
            id: 'history',
            label: 'History',
            count: CUSTOMER_HISTORY.length,
            panel: (
              <Panel title="Revisions" padded>
                <ActivityFeed items={CUSTOMER_HISTORY} variant="timeline" aria-label="Revision history" />
              </Panel>
            ),
          },
        ]}
      />
    </WorkspaceFrame>
  )
}

export const ObjectViewPage: Story = {
  name: 'Object view',
  render: () => <ObjectView />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Northstar Labs', level: 1 })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Object type: schema, link types, a neighbourhood graph and sample objects.

const SCHEMA_COLUMNS: DataGridColumn<SchemaPropertyRow>[] = [
  { id: 'name', header: 'Property', accessor: row => row.name, grow: true },
  { id: 'apiName', header: 'API name', accessor: row => row.apiName, kind: 'code' },
  { id: 'kind', header: 'Kind', accessor: row => row.kind, kind: 'enum' },
  { id: 'required', header: 'Required', accessor: row => row.required, kind: 'boolean' },
  { id: 'format', header: 'Format', accessor: row => row.format },
]

// The type's direct neighbours: every link type that starts or ends here.
const NEIGHBOUR_RELATIONS = SCHEMA_RELATIONS.filter(relation => relation.from === 'customer' || relation.to === 'customer')
const NEIGHBOUR_IDS = new Set(NEIGHBOUR_RELATIONS.flatMap(relation => [relation.from, relation.to]))

function ObjectType() {
  const overview = (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="Properties" subtitle={`${CUSTOMER_SCHEMA.length} of 24`}>
          <DataGrid label="Customer properties" columns={SCHEMA_COLUMNS} rows={CUSTOMER_SCHEMA} rowKey={row => row.apiName} height="auto" />
        </Panel>
        <LinkPanel title="Link types" groups={CUSTOMER_LINK_TYPES} headingLevel={2} />
      </div>
      <Panel title="Neighbourhood" subtitle="Direct link types">
        <SchemaGraph
          label="Customer and the types it links to"
          types={SCHEMA_TYPES.filter(type => NEIGHBOUR_IDS.has(type.id))}
          relations={NEIGHBOUR_RELATIONS}
          selectedId="customer"
          height={260}
        />
      </Panel>
      <Panel title="Objects" subtitle="First 5 of 71">
        <DataGrid label="Customer objects" columns={CUSTOMER_COLUMNS} rows={CUSTOMERS} rowKey={row => row.id} rowHref={row => `#/objects/${row.id}`} height="auto" />
      </Panel>
    </div>
  )
  return (
    <WorkspaceFrame active="ontology">
      <ObjectPage
        breadcrumbs={[{ label: 'Ontology', href: '#/ontology' }, { label: 'Object types', href: '#/ontology' }, { label: 'Customer' }]}
        header={{
          type: OBJECT_TYPE,
          title: 'Customer',
          objectId: 'customer',
          status: { label: 'Active', tone: 'ok' },
          meta: ['Version 7', '24 properties', '4 link types', '71 objects', 'Updated Sep 24 by Ada Morgan'],
          actions: (
            <>
              <Button startIcon={<Icon name="edit" />}>Edit schema</Button>
              <Button intent="primary" variant="solid" startIcon={<Icon name="add" />}>New customer</Button>
            </>
          ),
        }}
        tabs={[
          { id: 'overview', label: 'Overview', panel: overview },
          { id: 'properties', label: 'Properties', count: 24, panel: <DataGrid label="All customer properties" columns={SCHEMA_COLUMNS} rows={CUSTOMER_SCHEMA} rowKey={row => row.apiName} height="auto" /> },
          { id: 'link-types', label: 'Link types', count: 4, panel: <LinkPanel groups={CUSTOMER_LINK_TYPES} /> },
          { id: 'objects', label: 'Objects', count: 71, panel: <DataGrid label="All customer objects" columns={CUSTOMER_COLUMNS} rows={CUSTOMERS} rowKey={row => row.id} height="auto" /> },
        ]}
        tabsLabel="Object type sections"
      />
    </WorkspaceFrame>
  )
}

export const ObjectTypePage: Story = {
  name: 'Object type',
  render: () => <ObjectType />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Customer', level: 1 })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Schema graph: the ontology's types and link types, with a type inspector.

const TYPE_COLUMNS: DataGridColumn<TypeRow>[] = [
  {
    id: 'name',
    header: 'Object type',
    accessor: row => row.type.label,
    cell: row => (
      <span className="flex min-w-0 items-center gap-2">
        <TypeGlyph icon={row.type.icon} color={row.type.color ?? typeColorFor(row.type.id)} size={16} />
        <span className="truncate">{row.type.label}</span>
      </span>
    ),
    primary: true,
  },
  { id: 'description', header: 'Description', accessor: row => row.description, grow: true },
  { id: 'properties', header: 'Properties', accessor: row => row.properties, kind: 'integer' },
  { id: 'links', header: 'Link types', accessor: row => row.linkTypes, kind: 'integer' },
  { id: 'objects', header: 'Objects', accessor: row => row.type.count, kind: 'integer' },
  { id: 'status', header: 'Status', accessor: row => row.status, kind: 'enum', tones: TYPE_STATUS_TONES },
  { id: 'updated', header: 'Updated', accessor: row => row.updated, kind: 'date' },
]

function SchemaGraphTemplate() {
  const [tab, setTab] = useState('graph')
  const [selected, setSelected] = useState('customer')
  const type = TYPE_ROWS.find(row => row.type.id === selected) ?? TYPE_ROWS[0]!
  const inspector = (
    <Inspector label="Selected object type" width={320}>
      <div className="grid gap-4 p-3">
        <ObjectHeader compact headingLevel={2} type={OBJECT_TYPE} title={type.type.label} objectId={type.type.id} status={{ label: type.status, tone: TYPE_STATUS_TONES[type.status] ?? 'neutral' }} />
        <p className="m-0 text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">{type.description}</p>
        <PropertyList
          items={[
            { id: 'objects', label: 'Objects', value: type.type.count, kind: 'integer' },
            { id: 'properties', label: 'Properties', value: type.properties, kind: 'integer' },
            { id: 'links', label: 'Link types', value: type.linkTypes, kind: 'integer' },
            { id: 'updated', label: 'Updated', value: type.updated, kind: 'date' },
          ]}
        />
        <Button endIcon={<Icon name="arrow-right" />}>Open object type</Button>
      </div>
    </Inspector>
  )
  return (
    <WorkspaceFrame active="ontology" inspector={inspector}>
      <PageHeader
        breadcrumbs={[{ label: 'Workspace', href: '#/' }, { label: 'Ontology' }]}
        title="Ontology"
        description="Object types, link types and how they connect."
        actions={<Button intent="primary" variant="solid" startIcon={<Icon name="add" />}>New object type</Button>}
        tabs={(
          <Tabs
            label="Ontology sections"
            value={tab}
            onValueChange={setTab}
            items={[
              { id: 'types', label: 'Object types', count: TYPE_ROWS.length, panel: null },
              { id: 'links', label: 'Link types', count: SCHEMA_RELATIONS.length, panel: null },
              { id: 'graph', label: 'Graph', panel: null },
            ]}
          />
        )}
      />
      <Section>
        {tab === 'graph' && (
          <SchemaGraph
            label="Ontology graph"
            types={SCHEMA_TYPES}
            relations={SCHEMA_RELATIONS}
            selectedId={selected}
            onSelect={(next, event) => {
              event.preventDefault()
              setSelected(next.id)
            }}
            height={560}
          />
        )}
        {tab === 'types' && (
          <DataGrid label="Object types" columns={TYPE_COLUMNS} rows={TYPE_ROWS} rowKey={row => row.type.id} rowHref={row => row.type.href} height="auto" />
        )}
        {tab === 'links' && (
          <DataGrid
            label="Link types"
            columns={[
              { id: 'from', header: 'From', accessor: row => row.from },
              { id: 'label', header: 'Relation', accessor: row => row.label, grow: true },
              { id: 'to', header: 'To', accessor: row => row.to },
            ]}
            rows={SCHEMA_RELATIONS}
            rowKey={row => `${row.from}-${row.label}-${row.to}`}
            height="auto"
          />
        )}
      </Section>
    </WorkspaceFrame>
  )
}

export const SchemaGraphPage: Story = {
  name: 'Schema graph',
  render: () => <SchemaGraphTemplate />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Ontology', level: 1 })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Files: a folder tree, a file grid and a bounded preview in the inspector.

const FILE_ICONS: Record<FileRow['kind'], Parameters<typeof Icon>[0]['name']> = {
  folder: 'folder',
  csv: 'table',
  pdf: 'document',
  markdown: 'document',
  image: 'image',
  json: 'file',
}

const FILE_KINDS: Record<FileRow['kind'], string> = {
  folder: 'Folder',
  csv: 'CSV',
  pdf: 'PDF',
  markdown: 'Markdown',
  image: 'PNG image',
  json: 'JSON',
}

const FILE_COLUMNS: DataGridColumn<FileRow>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: row => row.name,
    cell: row => (
      <span className="flex min-w-0 items-center gap-2">
        <Icon name={FILE_ICONS[row.kind]} />
        <span className="truncate">{row.name}</span>
      </span>
    ),
    primary: true,
    pinned: true,
  },
  { id: 'kind', header: 'Kind', accessor: row => FILE_KINDS[row.kind] },
  { id: 'semantic', header: 'Object', accessor: row => row.semanticType, kind: 'link' },
  { id: 'size', header: 'Size', accessor: row => row.size, kind: 'bytes' },
  { id: 'updated', header: 'Updated', accessor: row => row.updated, kind: 'datetime' },
  { id: 'owner', header: 'Owner', accessor: row => row.owner, grow: true },
]

function FilesTemplate() {
  const [folder, setFolder] = useState('shared/finance')
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(['shared', 'shared/finance']))
  const [selected, setSelected] = useState<string[]>(['f-forecast'])
  const [view, setView] = useState<'list' | 'grid'>('list')
  const file = FILES.find(row => row.id === selected[0])
  const inspector = file && (
    <Inspector label="Selected file" width={360}>
      <div className="grid gap-4 p-3">
        <ObjectHeader compact headingLevel={2} type={FILE_TYPE} title={file.name} objectId={`finance/${file.name}`} />
        <PropertyList
          items={[
            { id: 'kind', label: 'Kind', value: FILE_KINDS[file.kind] },
            { id: 'size', label: 'Size', value: file.size === undefined ? null : formatBytes(file.size) },
            { id: 'updated', label: 'Updated', value: file.updated, kind: 'datetime' },
            { id: 'owner', label: 'Owner', value: file.owner },
            { id: 'object', label: 'Object', value: file.semanticType ?? null },
          ]}
        />
        {file.kind === 'csv' && (
          <FilePreview file={{ name: file.name, url: '/files/finance/q3-forecast.csv' }} fetch={fixtureFetch} height={240} />
        )}
      </div>
    </Inspector>
  )
  return (
    <WorkspaceFrame active="files" inspector={inspector}>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          breadcrumbs={[{ label: 'Files', href: '#/files' }, { label: 'Shared', href: '#/files/shared' }, { label: 'finance' }]}
          title="finance"
          description="Shared with the finance team · 6 items"
          actions={(
            <>
              <ButtonGroup label="View">
                <IconButton icon={<Icon name="table" />} aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')} />
                <IconButton icon={<Icon name="columns" />} aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')} />
              </ButtonGroup>
              <Button intent="primary" variant="solid" startIcon={<Icon name="upload" />}>Upload</Button>
            </>
          )}
        />
        <div className="flex min-h-[24rem] flex-1 flex-col px-4 pt-4 pb-4 md:px-6">
          <SplitPane
            defaultSize={26}
            minSize={18}
            maxSize={40}
            stackOnNarrow
            separatorLabel="Resize folders"
            primary={(
              <Tree label="Folders" items={FOLDERS} selectedId={folder} onSelectionChange={setFolder} expandedIds={expanded} onExpandedChange={setExpanded} />
            )}
            secondary={(
              <DataGrid
                label="Files in finance"
                columns={FILE_COLUMNS}
                rows={FILES}
                rowKey={row => row.id}
                rowHref={row => `#/files/finance/${row.name}`}
                selection="single"
                selectedKeys={selected}
                onSelectionChange={setSelected}
              />
            )}
          />
        </div>
      </div>
    </WorkspaceFrame>
  )
}

export const FilesPage: Story = {
  name: 'Files',
  render: () => <FilesTemplate />,
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('grid', { name: 'Files in finance' })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Operations: service health, releases, incidents and administration.

const RELEASE_COLUMNS: DataGridColumn<ReleaseRow>[] = [
  { id: 'service', header: 'Service', accessor: row => row.service, grow: true },
  { id: 'version', header: 'Version', accessor: row => row.version, kind: 'code' },
  { id: 'environment', header: 'Environment', accessor: row => row.environment },
  { id: 'status', header: 'Status', accessor: row => row.status, kind: 'enum', tones: RELEASE_TONES },
  { id: 'deployed', header: 'Deployed', accessor: row => row.deployed, kind: 'datetime' },
  { id: 'by', header: 'By', accessor: row => row.by },
]

const ADMIN_PAGES = [
  { id: 'members', title: 'Members', type: { label: 'Administration', icon: 'people', color: 'azure' }, href: '#/admin/members' },
  { id: 'service-accounts', title: 'Service accounts', type: { label: 'Administration', icon: 'key', color: 'azure' }, href: '#/admin/service-accounts' },
  { id: 'credentials', title: 'Credentials', type: { label: 'Administration', icon: 'lock', color: 'azure' }, href: '#/admin/credentials' },
  { id: 'audit', title: 'Audit log', type: { label: 'Administration', icon: 'history', color: 'azure' }, href: '#/admin/audit' },
] as const

function OperationsTemplate() {
  return (
    <WorkspaceFrame active="operations">
      <PageHeader
        title="Operations"
        description="Service health, releases and incidents for this workspace."
        actions={<Button startIcon={<Icon name="refresh" />}>Refresh</Button>}
      />
      <Section>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(service => (
            <StatTile
              key={service.id}
              label={service.name}
              value={service.version}
              status={service.status}
              description={service.detail}
              icon={<Icon name="server" />}
            />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel title="Releases" subtitle="Last 7 days">
            <DataGrid label="Releases" columns={RELEASE_COLUMNS} rows={RELEASES} rowKey={row => row.id} defaultSort={{ columnId: 'deployed', direction: 'descending' }} height="auto" />
          </Panel>
          <Panel title="Incidents" padded>
            <ActivityFeed items={INCIDENTS} variant="timeline" aria-label="Incidents" />
          </Panel>
        </div>
        <Panel title="Administration" padded>
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {ADMIN_PAGES.map(page => (
              <li key={page.id}><ObjectChip object={page} /></li>
            ))}
          </ul>
        </Panel>
      </Section>
    </WorkspaceFrame>
  )
}

export const OperationsPage: Story = {
  name: 'Operations',
  render: () => <OperationsTemplate />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid', { name: 'Releases' })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Storage: buckets with usage and status, a bucket inspector, and the
// unconfigured state for volumes.

const BUCKET_COLUMNS: DataGridColumn<BucketRow>[] = [
  {
    id: 'name',
    header: 'Bucket',
    accessor: row => row.name,
    cell: row => (
      <span className="flex min-w-0 items-center gap-2">
        <Icon name="bucket" />
        <span className="truncate">{row.name}</span>
      </span>
    ),
    primary: true,
    pinned: true,
  },
  { id: 'used', header: 'Used', accessor: row => row.used, cell: row => `${formatBytes(row.used)} of ${formatBytes(row.quota)}`, sortValue: row => row.used },
  { id: 'usage', header: 'Usage', accessor: row => row.used / row.quota, format: 'percent' },
  { id: 'objects', header: 'Objects', accessor: row => row.objects, kind: 'integer' },
  { id: 'class', header: 'Class', accessor: row => row.storageClass, kind: 'enum' },
  { id: 'versioning', header: 'Versioning', accessor: row => row.versioning, kind: 'boolean' },
  { id: 'updated', header: 'Last write', accessor: row => row.updated, kind: 'datetime' },
  { id: 'status', header: 'Status', accessor: row => row.status, kind: 'enum', tones: BUCKET_TONES },
]

function StorageTemplate() {
  const [selected, setSelected] = useState<string[]>(['b-media'])
  const bucket = BUCKETS.find(row => row.id === selected[0])
  const used = BUCKETS.reduce((sum, row) => sum + row.used, 0)
  const quota = BUCKETS.reduce((sum, row) => sum + row.quota, 0)
  const inspector = bucket && (
    <Inspector label="Selected bucket" width={320}>
      <div className="grid gap-4 p-3">
        <ObjectHeader compact headingLevel={2} type={{ label: 'Bucket', icon: 'bucket', color: 'green' }} title={bucket.name} objectId={bucket.id} status={{ label: bucket.status, tone: BUCKET_TONES[bucket.status] ?? 'neutral' }} />
        <PropertyList
          items={[
            { id: 'used', label: 'Used', value: `${formatBytes(bucket.used)} of ${formatBytes(bucket.quota)}` },
            { id: 'objects', label: 'Objects', value: bucket.objects, kind: 'integer' },
            { id: 'class', label: 'Storage class', value: bucket.storageClass, kind: 'enum' },
            { id: 'versioning', label: 'Versioning', value: bucket.versioning },
            { id: 'updated', label: 'Last write', value: bucket.updated, kind: 'datetime' },
          ]}
        />
        <Button endIcon={<Icon name="external-link" />}>Browse bucket</Button>
      </div>
    </Inspector>
  )
  return (
    <WorkspaceFrame active="storage" inspector={inspector}>
      <PageHeader
        title="Storage"
        description="Buckets and volumes this workspace reads and writes."
        actions={(
          <>
            <Button startIcon={<Icon name="add" />}>New bucket</Button>
            <Button intent="primary" variant="solid" endIcon={<Icon name="external-link" />}>Open in Storage</Button>
          </>
        )}
      />
      <Section>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile label="Buckets" value={BUCKETS.length} />
          <StatTile label="Used" value={formatBytes(used)} description={`of ${formatBytes(quota)}`} />
          <StatTile label="Near quota" value={1} status={{ label: 'media', tone: 'warning' }} />
        </div>
        <DataGrid
          label="Buckets"
          columns={BUCKET_COLUMNS}
          rows={BUCKETS}
          rowKey={row => row.id}
          rowHref={row => `#/storage/${row.name}`}
          selection="single"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          height="auto"
        />
        <Panel title="Volumes" padded>
          <EmptyState
            compact
            icon={<Icon name="database" />}
            title="No volumes configured"
            description="Block volumes appear here once a storage node is registered."
            actions={<Button startIcon={<Icon name="plug" />}>Register a node</Button>}
          />
          <Callout intent="info" title="Configuration">
            Nodes are registered by an administrator in Connect. Buckets keep working without volumes.
          </Callout>
        </Panel>
      </Section>
    </WorkspaceFrame>
  )
}

export const StoragePage: Story = {
  name: 'Storage',
  render: () => <StorageTemplate />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid', { name: 'Buckets' })).toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Connect: connectors with sync status, and the selected connector as an
// object with its configuration and sync history.

const CONNECTOR_COLUMNS: DataGridColumn<ConnectorRow>[] = [
  {
    id: 'name',
    header: 'Connector',
    accessor: row => row.name,
    cell: row => (
      <span className="flex min-w-0 items-center gap-2">
        <TypeGlyph icon="plug" color="azure" size={16} />
        <span className="truncate">{row.name}</span>
      </span>
    ),
    primary: true,
    pinned: true,
  },
  { id: 'source', header: 'Source', accessor: row => row.source },
  { id: 'status', header: 'Status', accessor: row => row.status, kind: 'enum', tones: CONNECTOR_TONES },
  { id: 'lastSync', header: 'Last sync', accessor: row => row.lastSync, kind: 'datetime' },
  { id: 'records', header: 'Records', accessor: row => row.records, kind: 'integer' },
  { id: 'owner', header: 'Owner', accessor: row => row.owner, grow: true },
]

function ConnectTemplate() {
  const [selected, setSelected] = useState<string[]>(['c-billing'])
  const connector = CONNECTORS.find(row => row.id === selected[0]) ?? CONNECTORS[1]!
  return (
    <WorkspaceFrame active="connect">
      <PageHeader
        title="Connect"
        description="Sources that sync records into the workspace."
        actions={<Button intent="primary" variant="solid" startIcon={<Icon name="add" />}>New connector</Button>}
      />
      <Section>
        <DataGrid
          label="Connectors"
          columns={CONNECTOR_COLUMNS}
          rows={CONNECTORS}
          rowKey={row => row.id}
          selection="single"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          height="auto"
        />
        <div className="grid gap-4 rounded-[var(--mtc-radius-md)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-4">
          <ObjectHeader
            headingLevel={2}
            type={CONNECTOR_TYPE}
            title={connector.name}
            objectId={connector.id}
            status={{ label: connector.status, tone: CONNECTOR_TONES[connector.status] ?? 'neutral' }}
            meta={[`Source ${connector.source}`, `Owner ${connector.owner}`]}
            actions={(
              <>
                <Button startIcon={<Icon name="pause" />}>Pause</Button>
                <Button intent="primary" variant="solid" startIcon={<Icon name="refresh" />}>Sync now</Button>
              </>
            )}
          />
          {connector.status === 'Failing' && (
            <Callout intent="danger" title="The last sync failed">
              The warehouse closed the connection while loading. The next attempt starts in 30 seconds.
            </Callout>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <PropertyPanel title="Configuration" properties={CONNECTOR_CONFIG} now={NOW} headingLevel={3} />
            <Panel title="Sync history" padded headingLevel={3}>
              <ActivityFeed items={SYNC_HISTORY} variant="timeline" aria-label="Sync history" />
            </Panel>
          </div>
        </div>
      </Section>
    </WorkspaceFrame>
  )
}

export const ConnectPage: Story = {
  name: 'Connect',
  render: () => <ConnectTemplate />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Billing orders', level: 2 })).toBeInTheDocument()
  },
}
