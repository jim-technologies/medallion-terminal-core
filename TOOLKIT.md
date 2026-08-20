# Application UI Toolkit

Medallion Terminal Core is one npm package with two complementary layers:

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

<DesignSystemProvider theme="dark" density="comfortable">
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

## Foundations

### Themes

`PresentationTheme` supports:

- `dark`: graphite and cobalt default.
- `operator`: near-black and softened citrine for operational rooms.
- `light`: cool neutral office/reporting presentation.
- `high-contrast`: stronger boundaries, text hierarchy, and focus treatment.

Themes are scoped to `.mtc-root`; no toolkit stylesheet targets `html`, `body`,
or a host application root. Multiple themes may coexist on one page.

### Density

`Density` is `compact | comfortable`. Density adjusts control height, row
height, gaps, and padding without changing semantic color or typography.
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

Additional public groups:

- Typography: `--mtc-font-*`, `--mtc-font-size-*`,
  `--mtc-font-weight-*`, `--mtc-line-height-*`.
- Spacing: `--mtc-space-0` through `--mtc-space-10`.
- Radius: `--mtc-radius-sm|md|lg|round`.
- Elevation: `--mtc-elevation-1|2`.
- Motion: `--mtc-duration-instant|fast|normal|slow` and
  `--mtc-easing-standard`.
- Density: `--mtc-control-height-*`, `--mtc-row-height`,
  `--mtc-density-padding-*`, and `--mtc-density-gap`.

Hosts may override tokens beneath their own `.mtc-root`. Reduced-motion media
preferences set toolkit transition durations to zero and constrain animation
without changing host-global behavior.

### Intents and sizes

Interactive and status components use the shared `Intent` union:
`neutral | primary | success | warning | danger | info`.

Controls use `ComponentSize`: `small | medium | large`. Intent communicates
meaning; it must not be used as ambient decoration, and status text always
retains a label, icon, or structural cue in addition to color.

## Component catalog

### Controls

- `Icon`, `Button`, `IconButton`, `ButtonGroup`
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

### Workbench

- `AppSurface`: neutral application canvas.
- `Toolbar`: labeled, overflow-safe application actions.
- `Sidebar`: routing-agnostic explorer/navigation pane.
- `SplitPane`: pointer and keyboard resizing with narrow-screen stacking.
- `Inspector`: arbitrary selection details.
- `PropertyList`: safe presentation of arbitrary values.
- `Tree`: stable IDs, selection, expansion, and keyboard navigation.
- `EmptyState`, `LoadingState`, `ErrorState`: shared bounded states.

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
