# Application UI Toolkit

Medallion Terminal Core is one package with two complementary layers:

1. The existing proto-driven `Dashboard`, widget registry, data-source,
   action, export, and embed SDK.
2. A shared React foundation for building data-dense host applications without
   requiring `Dashboard`.

The toolkit is in the same package so a workbench, embedded dashboard, and
custom application share one visual and interaction contract. It is a
rendering toolkit, not an application runtime. Authentication,
authorization, tenant policy, storage, indexing, link resolution, ontology
semantics, routing, and application sandboxing remain outside this repository.

## Setup

Import the package styles once in the host:

```tsx
import 'medallion-terminal-core/styles'
```

Use `DesignSystemProvider` when composing controls without `Dashboard`:

```tsx
import {
  DesignSystemProvider,
  Button,
  FormField,
  Input,
} from 'medallion-terminal-core/toolkit'

<DesignSystemProvider theme="dark" density="standard">
  <FormField label="Name">
    <Input value={name} onChange={onNameChange} />
  </FormField>
  <Button intent="primary" variant="solid">Save</Button>
</DesignSystemProvider>
```

The provider emits deterministic class names and data attributes. It does not
read browser preferences during render, so server markup and the first client
render agree. `Dashboard` uses the same `.mtc-root` contract and applies its
persisted personal preferences only after hydration.

Portalled layers (menus, trays, toasts, hover cards) must not render into a
bare `document.body`, where they lose the scope's tokens and fonts. Render them
into `usePortalContainer()`, a body-level element that carries the nearest
scope's theme and density:

```tsx
const container = usePortalContainer()
return container ? createPortal(<Tray />, container) : null
```

## Foundations

### Themes

`PresentationTheme` supports:

- `dark`: slate neutrals with one azure accent; the default.
- `light`: the same roles on a cool white canvas.
- `operator`: the slate one step darker with a softened citrine accent.
- `high-contrast`: black canvas, stronger boundaries, text hierarchy, and
  focus treatment.

Themes are scoped to `.mtc-root`; no toolkit stylesheet targets `html`, `body`,
or a host application root. Multiple themes may coexist on one page.

### Density

`Density` is `compact | standard | comfortable`, and `standard` is the
default everywhere (28 px controls, 32 px rows; compact is 24/28 px,
comfortable 32/40 px). Density adjusts control height, row height, gaps, and
padding without changing semantic color or typography.
Components inherit density and selected controls also accept a local
`density` override.

### Public token groups

The original variables remain supported. Descriptive aliases are additive:

| Role | Existing token | Descriptive alias |
|---|---|---|
| Canvas | `--mtc-bg` | `--mtc-background` |
| Surface | `--mtc-surface` | `--mtc-background-surface` |
| Raised surface | `--mtc-surface-raised` | `--mtc-background-surface-raised` |
| Quiet surface | `--mtc-panel` | `--mtc-background-subtle` |
| Foreground | `--mtc-fg` | `--mtc-foreground` |
| Muted foreground | `--mtc-muted` | `--mtc-foreground-muted` |
| Border | `--mtc-border` | `--mtc-border-color` |
| Focus | `--mtc-focus` | `--mtc-focus-ring` |
| Accent | `--mtc-accent` | `--mtc-intent-accent` |
| Success | `--mtc-ok` | `--mtc-intent-success` |
| Warning | `--mtc-warning` | `--mtc-intent-warning` |
| Danger | `--mtc-danger` | `--mtc-intent-danger` |
| Information | `--mtc-info` | `--mtc-intent-info` |

Roles added by tokens v2 (no descriptive alias):

| Role | Tokens |
|---|---|
| Control boundary (inputs, checkboxes) | `--mtc-border-control` |
| Selected row or navigation item | `--mtc-selection`, `--mtc-selection-hover` |
| Link text | `--mtc-link` |
| Text on a solid accent fill | `--mtc-on-accent` |
| Text on a black scrim over media (light in every theme) | `--mtc-on-scrim` |
| Status tints | `--mtc-ok-bg`, `--mtc-warning-bg`, `--mtc-danger-bg`, `--mtc-info-bg` |
| Graph edges | `--mtc-graph-edge`, `--mtc-graph-edge-active` |
| Object type identity | `--mtc-type-{azure,cyan,teal,green,lime,olive,amber,orange,red,rose,magenta,violet}-{fg,bg}` |

Additional public groups:

- Typography: `--mtc-font-sans|mono`, `--mtc-font-size-xs|sm|md|lg|xl|2xl|3xl`
  (11/12/13/14/16/20/24 px), matching `--mtc-line-height-*`,
  `--mtc-font-weight-normal|medium|semibold`, and the unitless
  `--mtc-line-height-tight|normal`.
- Spacing: `--mtc-space-0` through `--mtc-space-16` (4 px grid).
- Radius: `--mtc-radius-xs|sm|md|lg|round` (2/3/4/6 px); `--mtc-radius` is
  the medium radius.
- Elevation: `--mtc-elevation-0|1|2|3` (none, sticky headers, menus and
  popovers, dialogs). `--mtc-shadow` and `--mtc-shadow-raised` alias levels 1
  and 2; `--mtc-highlight` is retained as `transparent`.
- Motion: `--mtc-duration-instant|fast|normal|slow` and
  `--mtc-easing-standard`.
- Density: `--mtc-control-height-*`, `--mtc-row-height`,
  `--mtc-density-padding-*`, and `--mtc-density-gap`.

Hosts may override tokens beneath their own `.mtc-root`. Reduced-motion media
preferences set toolkit transition durations to zero and constrain animation
without changing host-global behavior.

### Locale and messages

Every toolkit string a component shows by default (loading and error copy,
retry, close, expand and collapse labels, the combobox placeholder) comes from
a keyed catalog. `DesignSystemProvider` takes the locale, an optional time
zone for dates, and per-key overrides; nested scopes and Dashboards inherit
what they do not set:

```tsx
<DesignSystemProvider locale="zh-CN" timeZone="Asia/Shanghai"
  messages={{ 'state.loading': '正在加载工作区' }}>
  …
</DesignSystemProvider>
```

- Built-in catalogs: `EN_MESSAGES` (the default) and `ZH_CN_MESSAGES`,
  selected by language (`zh`, `zh-CN` and `zh-Hans` all pick Simplified
  Chinese). `MessageKey` types the keys; overrides are
  `Partial<MessageCatalog>`.
- `useMessage()` returns `t(key, values)` for host components that want the
  same strings; placeholders are `{name}`.
- A component prop (`retryLabel`, `placeholder`, `label`) still wins over the
  catalog.
- `lang` is set on the provider root only when `locale` is passed, so
  existing server markup is unchanged.

Formatting uses the platform `Intl` APIs with an explicit locale, so server
and client agree when the host passes the same values (`useLocale()` returns
the scope's `locale` and `timeZone`):

| Function | Output (`en`) |
|---|---|
| `formatNumber(1234567.8, { locale })` | `1,234,567.8` |
| `formatBytes(2_300_000, { locale })` | `2.3 MB` (SI units, one decimal) |
| `formatDateTime(value, { locale, timeZone })` | `Oct 18, 2026, 3:04 PM` |
| `formatRelativeTime(value, { locale, now })` | `5 minutes ago`, `in 3 days` |
| `formatDuration(ms, { locale })` | `30 seconds`, `2 minutes` (rounded up) |

Unparseable dates are returned as written, never as "Invalid Date".

### Intents and sizes

Interactive and status components use the shared `Intent` union:
`neutral | primary | success | warning | danger | info`.

Controls use `ComponentSize`: `small | medium | large`. Intent communicates
meaning; it must not be used as ambient decoration, and status text always
retains a label, icon, or structural cue in addition to color.

## Component catalog

### Controls

- `Icon` (`ICON_NAMES` lists the set), `TypeGlyph` (with `TYPE_COLORS` and
  `typeColorFor`), `Button`, `IconButton`, `ButtonGroup`
- `Input`, `TextArea`, `FormField`
- `Checkbox`, `Radio`, `Switch`, `Combobox`
- `Tag`, `Badge`, `Callout`
- `Tooltip`, `Popover`
- `Menu`, `ContextMenu`
- `Dialog`, `Drawer`
- `Tabs`, `Breadcrumbs`

Controls are controlled where application state matters. Native form elements
are used where they provide the strongest semantics. `Combobox` supports
filtering plus arrow, Home/End, Enter, Tab, and Escape handling.

Dialogs and drawers trap focus while open, close with Escape when dismissible,
and restore the previously focused element. Menus use roving focus. Tooltips
are associated with their focusable trigger through `aria-describedby`.
Popover and menu document listeners exist only while their layer is open.

### Display primitives

- `StatusBadge`: status dot plus label (`tone`: `ok`, `warning`,
  `danger`, `info`, `neutral`).
- `Kbd`: a keyboard key or shortcut hint.
- `Avatar`: initials (or an image) for a person or service; `initialsOf`
  derives the initials.
- `Skeleton`: a line, block, circle or paragraph placeholder.
- `CopyButton`: copies a value; inject `clipboard` in tests.
- `MetaRow`: a wrapping row of muted metadata items.
- `Panel`: titled, bordered content frame with header actions and footer.
- `HoverCard`: a non-modal preview on hover and focus, portalled into the
  scope so it keeps the theme and escapes clipping ancestors.

### Navigation, search and notifications

- `NavRail`: the shell's navigation rail (`NavRailSection`s of
  `NavRailItem`s with an icon or type glyph and a count), `activeId` for
  `aria-current`, a collapse toggle (`onCollapsedChange`), links with an
  optional `onNavigate`.
- `PageHeader`: breadcrumbs, title (or custom heading children such as an
  `ObjectHeader`), description, actions and a `tabs` slot; `sticky`.
- `SearchField`: a search landmark with scope `tokens` (removable, Backspace
  removes the last), clear, Enter to submit, and a `shortcut` key (`/`)
  that focuses it from anywhere outside another input.
- `CommandPalette`: the global palette. The host searches and returns
  `CommandGroup`s; the palette is a modal combobox with grouped options,
  arrow-key highlight, Enter to choose (or `onSubmit` the query when
  `autoHighlight` is off and nothing is highlighted), Escape to close, and
  Ctrl/⌘ K to toggle (`hotkey`). The Dashboard's palette is built on it.
- `Toaster` (controlled), `ToastProvider` and `useToast()` (a queue):
  notifications with an intent, description, one action and a duration
  (0 keeps it), announced politely (`danger` assertively), pausing while
  hovered or focused, portalled into the scope. The Dashboard's toasts use
  it.
- `Pagination`: numbered (`page`, `pageCount`, `onPageChange`) or cursor
  (`hasPrevious`, `hasNext`, `onPrevious`, `onNext`) paging with a summary.
- `StatTile`: a headline number with unit, `delta`, status, description,
  icon and an optional link.

### Files

- `FilePreview`: one file (`name`, `url`, optional `contentType` and
  `sizeBytes`) previewed under the shared policy (`planPreview`,
  `DEFAULT_PREVIEW_LIMITS`): text, code, JSON and Markdown read at most
  1 MB with a Range request and a bounded read; CSV and TSV at most
  1,000 rows × 100 columns into a `DataGrid`; PNG, JPEG, GIF, WebP and PDF
  fetched only under 20 MB and 50 MB and shown from a blob only when their
  bytes carry the right signature; audio and video play natively; HTML,
  SVG and XML show as source; anything else offers `onDownload`. Pass the
  product's `fetch` (for example a `createProductFetch`) so reads carry
  request ids and typed errors. The file's bytes stay on the origin that
  serves `url`.
- `CodeView`: read-only source with line numbers, wrap, copy, highlighted
  lines and a bounded line count (5,000).

### Object components

The ontology anatomy: an object has a type (`ObjectTypeRef`: label, icon,
colour slot, with `typePresentation` resolving the fallbacks) and is
referenced by an `ObjectRef` (id, title, type, `href`).

- `PropertyValue`: one value rendered by its kind (`string`, `id`, `code`,
  `number`, `integer`, `currency`, `percent`, `date`, `datetime`, `boolean`,
  `enum`, `list`, `object`, `link`, `url`, `email`); `context="grid"` keeps
  one compact line. `formatPropertyText`, `propertySortKey` and
  `compareSortKeys` give the same value as text and as a sort key.
- `PropertyPanel`: grouped `PropertyDefinition`s in a `Panel` with a
  filter and an "n of m" count.
- `ObjectHeader`: glyph, type eyebrow, monospace id with copy, title, status,
  metadata and actions; `compact` for inspectors and hover cards.
- `ObjectChip`: an inline object reference (link, button or text), with an
  optional `hoverCard`.
- `FacetList`: the explorer's facet rail (`FacetGroup`s of `FacetOption`s
  with counts; `single` groups are radio buttons with type glyphs, `multi`
  groups checkboxes; "Show more"; `onClear`).
- `ActivityFeed`: `ActivityItem`s (actor, verb, object, summary, time,
  tone) as a feed with avatars and relative times, or as a `timeline`
  with toned dots and absolute times for run and event histories.

- `LinkPanel`: an object's `LinkGroup`s (relation, direction, target type,
  count, the first `LinkItem`s with their detail, and a "View all" link or
  handler).
- `LinkGraph`: the same groups drawn as a one-hop ego graph around the
  object, capped at `maxNodes` (40) with "+N" nodes; nodes are links (Tab
  or the arrow keys move between them, Enter opens one).
- `SchemaGraph`: object types (`SchemaGraphType`, with a count and page)
  and link types (`SchemaGraphRelation`) on the layered layout the `dag`
  widget uses; `onSelect` receives the chosen type.

Both graphs are plain SVG with no dependency: drag the background to pan,
zoom with the buttons (or Ctrl/⌘ and the wheel), reset to the fitted view.

`PropertyList` renders its values through `PropertyValue` as well, and its
items accept `kind` and `format`.

### Workbench

- `AppSurface`: neutral application canvas.
- `Toolbar`: labeled, overflow-safe application actions.
- `Sidebar`: routing-agnostic explorer/navigation pane.
- `SplitPane`: pointer and keyboard resizing with narrow-screen stacking.
- `Inspector`: arbitrary selection details.
- `PropertyList`: safe presentation of arbitrary values.
- `DataGrid`: the toolkit's one table (it is also the "resource table" the
  product UIs list files, records and trees in). A WAI-ARIA grid with a
  single tab stop and roving cell focus: arrows, Home/End (Ctrl for the
  corners), PageUp/PageDown, Enter to activate a row (or follow its link),
  Space to select, Shift+arrows and Shift+click for ranges, Ctrl+A,
  the Menu key or Shift+F10 for `contextActions`, F2 for `onCellEdit`.
  Columns (`DataGridColumn`) sort (client, or `sortMode="server"`), resize
  by drag or Alt+arrows, pin to the start and render typed values through
  `PropertyValue` unless they supply `cell`. `rowHref` puts one link per row
  on the primary column; `onNavigate` routes a plain click. Rows have one
  fixed height, so above 200 rows (`virtualize="auto"`) only the rows in
  view render: ten thousand rows stay under 1,500 DOM nodes.
  `onEndReached` fires once per page as the last rows scroll into view
  (with `totalRows` when known); `loading` shows skeleton rows or a
  loading-more row; `empty` replaces the default empty state; `rowProps`
  adds stable `data-*` hooks.
- `Tree`: stable IDs, selection, expansion, and keyboard navigation.
- `EmptyState`, `LoadingState`, `ErrorState`: shared bounded states.
  `ErrorState` also takes `error`, a typed `SourceError`, and then leads with
  product copy for its kind (for example "You don’t have access" for a 403)
  while the server's reason, Connect code and request id sit in a Details
  disclosure.
- `AccessDeniedState`, `SignedOutState`, `SessionExpiredState`,
  `NotFoundState`, `RateLimitedState` and `StaleState`: the access, session,
  availability and freshness states product UIs render in place of the scope
  that failed, so navigation and the rest of the page keep working.
  `SourceErrorState` picks the right one from a `SourceError`'s kind.

`Toolbar`, `Sidebar`, and `Inspector` do not own routing, fetching,
authentication, or permissions. `SplitPane` exposes a separator with ARIA
value metadata and supports arrows, Home, and End. `Tree` requires stable item
IDs and keeps expansion and selection controlled by the host.

Storybook includes:

- `Toolkit/Compositions/Workbenches/Object Workbench`
- `Toolkit/Compositions/Workbenches/Model Workbench`
- `Toolkit/Compositions/Workbenches/Database Explorer`
- `Toolkit/Compositions/Workbenches/View Table`

They demonstrate three-pane composition only; they contain no
application-specific, connector, credential, or SQL-execution semantics. The
database explorer composes the generic tree, panes, table presentation, tabs, inspector,
schema metadata, indexes, and query text surface around host-owned data. The
focused table viewer additionally demonstrates sorting, filtering, bounded
paging, column visibility, and row inspection without the surrounding explorer.

### Typed failures

`SourceError` (exported by every entry point) is a failed request with the
server's side of the story kept:

| Field | Meaning |
|---|---|
| `kind` | `unauthenticated`, `forbidden`, `not_found`, `rate_limited`, `unavailable`, `invalid` or `unknown` |
| `status` | HTTP status, when a response arrived |
| `code` | Connect error code in wire spelling (`permission_denied`) |
| `message` | The server's reason (`payroll:read scope required`), else `HTTP 503` |
| `requestId` | `x-request-id` / `request-id` from the response, else the id sent |
| `retryAfterMs` | `Retry-After`, as seconds or an HTTP date |

| Kind | State | Copy (en) |
|---|---|---|
| `unauthenticated` | `SessionExpiredState` (Continue renews; falls back to retry) | "Your session expired" |
| `forbidden` | `AccessDeniedState` | "You don’t have access" · "Ask an owner of {resource} for access." |
| `not_found` | `NotFoundState` | "Not found" · "{resource} doesn’t exist or was moved." |
| `rate_limited` | `RateLimitedState` | "Too many requests" · "Try again in 30 seconds." |
| `unavailable`, `invalid`, `unknown` | `ErrorState` with the typed error | "Service unavailable", "Request not accepted", "Unable to load" |

Every state keeps the server's reason, Connect code and request id in a
collapsed Details disclosure, takes `title`, `description` and `actions`
overrides, and renders its copy from the message catalog. `SignedOutState`
is for "no session at all"; a 401 mid-journey is `SessionExpiredState`,
which keeps the route and drafts. `StaleState` takes `lastUpdated` (and a
`now` for deterministic rendering) and has a `compact` form for showing
beside stale content rather than instead of it.

`sourceErrorFromResponse(res)` reads a Connect JSON error body (bounded) and
headers; `toSourceError(thrown)` maps errors from generated Connect clients
(numeric or string `code`, `rawMessage`, `metadata`), timeouts and network
failures. The Connect code decides the kind before the HTTP status does.

## Host integration

### Generic intents

`Dashboard` accepts `onIntent`. Components emit:

```ts
type TerminalIntent =
  | { type: 'object.open'; objectId: string; mode?: string }
  | { type: 'object.select'; objectId: string }
  | {
      type: 'command.invoke'
      commandId: string
      objectIds?: string[]
      params?: Record<string, unknown>
    }
```

Custom widgets can call `useDashboard().emitIntent?.(intent)`. The optional
form keeps consumer-authored legacy context values compatible. Emission is a
message only; Terminal Core does not authorize, route, or execute the host
operation.

## Migration notes

### Scoped widget registries

Legacy registration remains unchanged:

```tsx
registerWidget('custom_widget', CustomWidget)
<Dashboard template={template} />
```

For isolation:

```tsx
const registry = createWidgetRegistry()
registry.register('custom_widget', CustomWidget)

<Dashboard template={template} registry={registry} />
```

Each instance has independent mutable state. Built-ins are included by default;
pass `{ includeBuiltIns: false }` only for a deliberately closed registry.
Dashboard rendering and template validation use the supplied registry.
Instance registration never mutates the process-global registry.

No migration is required for existing `registerWidget()` consumers. Adopt an
instance registry only when a host needs per-workspace or per-surface
isolation.

### Object-aware file entries

`FileBrowserEntry` remains compatible with path-only listings and adds:

```ts
interface FileBrowserEntry {
  id?: string
  kind?: string
  name?: string
  size_bytes?: number
  content_type?: string
  modified_at?: string
  path?: string
  is_container?: boolean
  capabilities?: string[]
  symlink_target_id?: string
}
```

Identity precedence is `id`, legacy `object_id`, authoritative `path`, then
derived parent path plus `name`. Semantic `kind` and informative
`content_type` take precedence over filename extensions. Extensions remain a
fallback for old entries with no semantic metadata or generic
`application/octet-stream`.

`symlink_target_id` is presentation metadata only. Terminal Core does not
resolve links. Capabilities and the unresolved target are forwarded as
first-class asset-reference fields but are not interpreted as authorization.

No migration is required for path-only backends. Add `id` when a stable host
object identity is available; keep `path` and `name` for storage navigation
and URLs.

### File browser extension points

The `file_browser` widget lists entries in a `DataGrid` and previews them
with `FilePreview`. Hosts customise it by registering a wrapper that passes
`FileBrowserExtensions`, never by rewriting its DOM:

```tsx
registry.register('file_browser', props => (
  <FileBrowser
    {...props}
    entryIcon={entry => <FileTypeIcon entry={entry} />}
    entryHref={(entry, path) => `/b/${bucket}/f/${path}`}
    selection="multi"
    onSelectionChange={entries => setSelected(entries)}
    contextActions={(entry, path) => [{ id: 'rename', label: 'Rename', onSelect: () => rename(path) }]}
    onOpen={(entry, path) => (entry.kind === 'folder' ? false : openFile(path))}
  />
))
```

- `entryIcon`: the leading icon (a folder or file glyph by default).
- `entryHref`: one link per row on the name; with `onOpen`, a plain click is
  handed to it.
- `selection`, `selectedIds`, `onSelectionChange`: none, single (default) or
  multi with ranges.
- `contextActions`: right-click, the Menu key or Shift+F10.
- `onOpen`: Enter, double-click or a plain click on the link; return `true`
  to replace the built-in behaviour (enter folders, preview or download).

Stable hooks for styling and tests are data attributes, not class names:
`data-mtc-file-browser` (with `data-mtc-path` and `data-mtc-view`) on the
root, `data-mtc-part` on `toolbar`, `list`, `gallery`, `preview` and
`upload-dialog`, and `data-mtc-entry-kind` (`folder` or `file`),
`data-mtc-entry-id` and `data-mtc-entry-path` on every row and tile. The
payload and options contracts are unchanged.

## Accessibility and validation

- Every interactive surface has a keyboard path and visible focus treatment.
- Escape closes dismissible layers.
- Dialog and drawer focus is trapped and restored.
- Disabled and loading actions cannot submit.
- Responsive panes stack on narrow viewports.
- High contrast and reduced motion are first-class scoped presentations.
- No component renders unsafe arbitrary HTML.
- Storybook play tests cover overlay focus, dismissal, menus, popovers, tabs,
  tree navigation, split-pane resizing, disabled/loading actions, themes,
  densities, host intents, and scoped registries.

Run the repository-defined full gate with:

```bash
flox activate -- make validate
```
