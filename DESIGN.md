# Product and Visual System

Medallion is an operating-intelligence product for small and medium-sized
businesses: **see the whole business and act from one place**. Its visual
language is ontology-first. Every noun a person touches is an object with a
type; types carry identity; properties render by their type; links are
first-class; search is the front door.

The language is *inspired by* object-centric industrial software (dense
typed tables, typed property panels, link panels and graphs, search-first
exploration). It never copies another company's name, logo, wordmark,
palette values, icons, screenshots or exact layout. Every value in this
document is original.

## Principles

1. **Objects first.** Objects have a type, and types have identity: an icon
   and one of twelve colour slots. Resources such as files and folders stay
   neutral.
2. **Colour has three jobs only:** the accent (selection, focus, primary
   action, links), status (ok, warning, danger, info), and type identity
   (the small `TypeGlyph` chip, facet dots and graph nodes). Surfaces are
   neutral slate; colour is never ambient decoration.
3. **Density is a feature.** Base text is 13 px, controls 28 px, rows
   32 px, on a 4 px grid.
4. **Typed rendering.** A value's type decides its font, alignment, format
   and affordance. Monospace is for identifiers, code, hashes, paths and raw
   JSON only.
5. **Links are first-class.** Object views show relationships grouped by
   link type with counts and previews.
6. **Flat and calm.** Borders and surface level create hierarchy. There are
   no gradients, blurs, glows or inset highlights; elevation is reserved for
   overlays.
7. **Trust is visible.** Freshness, owner, status, permissions, action
   lifecycle and audit-relevant outcomes sit near the work they describe.
8. **Owner-first language, progressive detail.** Prefer revenue, customers,
   orders and decisions over infrastructure terms; reveal the object,
   relationship, source or event underneath without losing context.
9. **Keyboard-capable, pointer-friendly.** Power-user navigation coexists
   with clear labels and familiar controls.
10. **One shell, one vocabulary** across every product built on Terminal
    Core.

## Theme presets

`Dashboard`, `MultiDashboard` and `DesignSystemProvider` expose four scoped
themes. A `Dashboard` inside a `DesignSystemProvider` inherits its theme
unless given its own.

| Theme | Intended use | Character |
|---|---|---|
| `dark` | Product default | Slate neutrals (OKLCH hue 255), one azure accent |
| `light` | Bright offices, reports, embedded BI | The same roles on a cool white canvas |
| `operator` | Operations rooms | The slate one step darker, with an original softened citrine as its single accent |
| `high-contrast` | Accessibility-focused work | Black canvas, explicit boundaries, strong focus and status hierarchy |

```tsx
<DesignSystemProvider theme="light">...</DesignSystemProvider>
<Dashboard template={template} theme="operator" />
```

Themes are scoped under `.mtc-root`; differently themed subtrees can coexist
on one page. Hosts may override the public `--mtc-*` variables but must keep
the semantic roles below. The standalone embed accepts the same presets with
`embed.html?...&theme=light`; invalid values fall back to `dark`.

## Colour roles

| Role | Tokens | Use |
|---|---|---|
| Canvas | `--mtc-bg` | Workspace background only |
| Surfaces | `--mtc-surface`, `--mtc-surface-raised` | Panels and controls; menus and raised details |
| Quiet fill | `--mtc-panel`, `--mtc-panel-hover` | Chips, skeletons, hover |
| Selection | `--mtc-selection`, `--mtc-selection-hover` | Selected rows and navigation items, with a 2 px accent bar on the leading edge |
| Dividers | `--mtc-border`, `--mtc-border-strong` | Hierarchy, never decoration |
| Control boundary | `--mtc-border-control` | Inputs, checkboxes, switches (3:1 against the surface) |
| Text | `--mtc-fg`, `--mtc-fg-soft`, `--mtc-muted-strong`, `--mtc-muted` | Text hierarchy |
| Metadata | `--mtc-muted-subtle` | Non-essential metadata only (3:1): placeholders, separators, disabled hints. Readable labels, counts and captions use `--mtc-muted` so they pass the 4.5:1 text check in every theme |
| Accent | `--mtc-accent`, `--mtc-accent-strong`, `--mtc-accent-soft`, `--mtc-focus` | Focus, selection bar, icons; primary fills; soft emphasis; focus rings |
| On accent | `--mtc-on-accent` | Text and icons on `--mtc-accent-strong` fills |
| Links | `--mtc-link` | Link text |
| Status | `--mtc-{ok,warning,danger,info}`, `-soft`, `-bg` | Status text, text on a status tint, the tint itself |
| On status | `--mtc-on-solid` | Text on solid status fills |
| On scrim | `--mtc-on-scrim` | Text and marks on a black scrim over media (captions, duration badges, viewer arrows); light in every theme because the scrim is always dark |
| Graph | `--mtc-graph-edge`, `--mtc-graph-edge-active`, `--mtc-grid` | Edges (3:1), the active edge, chart and canvas grids |
| Type identity | `--mtc-type-{slot}-fg`, `--mtc-type-{slot}-bg` | Object type chips and graph nodes only |
| Data | `--mtc-chart-1` … `--mtc-chart-8` | Categorical series |
| Code | `--mtc-code-{key,string,number,literal}` | Syntax colouring |
| Signal | `--mtc-signal` | Rare attention marks; never decoration |

Production code uses these variables or the shared `widgets/colors.ts`
exports. Hard-coded colours belong only in a canvas library's documented
fallback or a Storybook fixture; `scripts/check-style-tokens.mjs` (run by
`pnpm lint`) enforces this, the 11 px floor (Tailwind sizes, CSS `font-size`
and `font` declarations, inline and SVG `fontSize`) and sentence-case labels
across `src/` and the examples built on the toolkit, with a ratcheting
budget for the remaining legacy sites. The clone showcases are outside that
scope; see Typography.

**Contrast.** `themeColors.test.ts` checks every theme: text roles at 4.5:1
on the canvas, surfaces, quiet fill and selection; `--mtc-muted-subtle` at
3:1; status soft text on its tint, `--mtc-on-accent` on
`--mtc-accent-strong` at rest and on hover (a solid button keeps its
on-colour on hover and its fill moves away from it, toward
`--mtc-accent-hover-mix` or `--mtc-solid-hover-mix`, so hover never lowers
contrast), `--mtc-on-scrim` on a 70% black scrim over a white
image, every type slot on its chip, and code tokens at 4.5:1;
control boundaries, graph edges, the primary fill and chart colours at 3:1.
State must also carry a label, icon, shape or position cue; colour alone is
never the only signal.

## Object type identity

Twelve muted slots, derived at a fixed lightness and chroma per theme:
`azure`, `cyan`, `teal`, `green`, `lime`, `olive`, `amber`, `orange`, `red`,
`rose`, `magenta`, `violet`. A type's slot comes from its presentation hints;
without one, a deterministic hash of the type id picks the slot so a type's
colour never changes between loads. Slots appear only in the type chip, facet
dots and graph nodes, never on backgrounds larger than 40 × 40 px, and never
for status.

## Typography

- **Families.** Sans is Inter, then CJK fallbacks (`PingFang SC`,
  `Noto Sans CJK SC`, `Microsoft YaHei`), then `system-ui`. Mono is
  JetBrains Mono. Both are vendored (SIL OFL 1.1) so every host renders the
  same glyphs.
- **Scale.** These are the only sizes; nothing is smaller than 11 px, in
  scaled drawings too: graph text keeps its size when a graph is fitted or
  zoomed out, and is hidden rather than shrunk in an overview.
- **Scope.** The floor, the scale and sentence-case labels govern
  everything that ships as Medallion: `src/`, the widgets, the page
  templates and the examples built on the toolkit (`examples/widgets`,
  `examples/readiness`). The clone showcases under `examples/clones` are
  exempt on purpose: each reproduces another product's density at the sizes
  that product ships, from its own stylesheet rather than the `--mtc-*`
  tokens, so the toolkit can be judged against it. They are fidelity
  references, not Medallion surfaces; take structure from the page
  templates and never type or colour from a clone.

| Token | Size / line | Weight | Use |
|---|---|---|---|
| `--mtc-font-size-xs` | 11 / 16 | 500 | Group labels, counts, badges, keyboard hints |
| `--mtc-font-size-sm` | 12 / 16 | 400 | Secondary text, property labels, table headers (500), breadcrumbs, mono ids |
| `--mtc-font-size-md` | 13 / 20 | 400 / 500 | Base: body, cells, values, navigation, buttons (500) |
| `--mtc-font-size-lg` | 14 / 20 | 600 | Panel titles |
| `--mtc-font-size-xl` | 16 / 24 | 600 | Dense page titles, inspector titles |
| `--mtc-font-size-2xl` | 20 / 28 | 600 | Object titles |
| `--mtc-font-size-3xl` | 24 / 32 | 600 | Sign-in and chooser only |

- **Weights** are 400, 500 and 600.
- **Case.** Sentence case everywhere, including group labels and column
  headers. Uppercase is retired except for keyboard keys. Letter-spacing is
  0 (−0.01em on titles of 20 px and up).
- **Numbers** use tabular numerals where values align or change; numeric
  columns are end-aligned.

## Space, density, shape and motion

- **Grid.** `--mtc-space-{0,1,2,3,4,5,6,8,10,12,16}` = 0–64 px on a 4 px
  grid; only icon-to-text optical adjustments use 2 or 6 px.
- **Density.** `compact`, `standard` (the default for every product) and
  `comfortable` set control heights, row height, cell padding and gaps
  without changing colour or type.

| Density | Controls sm / md / lg | Row | Cell padding x / y | Gap |
|---|---|---|---|---|
| `compact` | 20 / 24 / 28 | 28 | 8 / 4 | 4 |
| `standard` | 24 / 28 / 32 | 32 | 12 / 6 | 8 |
| `comfortable` | 28 / 32 / 36 | 40 | 12 / 8 | 8 |

- **Radii.** `--mtc-radius-xs` 2 px (checkboxes, chips, badges), `-sm` 3 px
  (buttons, inputs, rows), `-md` 4 px (panels, cards, popovers, type glyphs),
  `-lg` 6 px (dialogs), `-round` (avatars and status dots only). No pills.
- **Borders** are 1 px. Selection is `--mtc-selection` plus a 2 px accent
  bar on the leading edge.
- **Elevation.** `--mtc-elevation-0` for every in-page surface; `-1` for
  sticky headers; `-2` for menus, popovers and hover cards; `-3` for dialogs
  and drawers.
- **Motion.** 0 / 120 / 180 / 260 ms with the standard easing. Hover never
  moves an element. Reduced-motion preferences zero every duration.

## Iconography

- One first-party set, owned by `Icon`: a 24-unit grid, 1.75-unit strokes,
  round caps and joins, `currentColor`, 16 px in UI chrome. `ICON_NAMES`
  lists every glyph. Nouns (`person`, `organization`, `contract`, `order`,
  `dataset`, `truck`, …) double as object type icons; verbs (`filter`,
  `sort-asc`, `copy`, `refresh`, …) label actions.
- `TypeGlyph` puts a type icon on its identity slot at 16, 20, 24 or 40 px
  (radius 2, 3, 4, 4; icon 11, 12, 14, 22 px). It is the only place type
  colour appears in chrome. Beside a visible type name it is decorative;
  standalone it takes a `label`. `typeColorFor(typeId)` is the deterministic
  fallback slot.
- Products never ship a second icon system, and no glyph reproduces another
  product's icons or logo.

## Component inventory

Every component below lives in the toolkit (`medallion-terminal-core/toolkit`),
is routing-agnostic (an `href` plus an optional `onNavigate` for a plain click,
so new-tab and copy-link keep working), takes its strings from the message
catalog with prop overrides, and has dark and light baselines with exact text
snapshots.

| Component | Use | Rules |
|---|---|---|
| `StatusBadge` | An object's or run's status | Dot plus label; tone `ok`, `warning`, `danger`, `info` or `neutral`; never colour alone |
| `Kbd` | Keyboard hints (`Ctrl K`, `/`) | 11 px, bordered; the only uppercase allowed is a key's own name |
| `Avatar` | People and services in feeds and menus | Initials on the quiet fill (24 or 32 px); decorative beside a visible name |
| `Skeleton` | Loading placeholders in the content's shape | Hidden from assistive technology; announce loading on the region |
| `CopyButton` | Ids, hashes, paths | Ghost icon button; a check and a polite "Copied" status confirm |
| `MetaRow` | "Updated … by …", revision, source | 12 px muted, wraps, 12 px gaps |
| `Panel` | The frame for property, link, feed and graph panels | 1 px border, 36 px header with a 14/600 title and muted count, no shadow |
| `HoverCard` | A preview of the object behind a link | Opens on hover and focus, closes on Escape; supplementary only, never the sole path to an action |
| `PropertyValue` | Any property value | Rendering by kind (see below); monospace only for ids and code; nothing rendered as HTML |
| `PropertyPanel` | An object's properties | Grouped rows with 11 px muted group labels, a 160 px label column, "n of m" with a filter |
| `ObjectHeader` | An object's identity | 40 px `TypeGlyph`, type eyebrow in the type colour, mono id with copy, 20/600 title, status and metadata; `compact` for inspectors and hover cards |
| `ObjectChip` | Inline object references | 16 px glyph plus title; a link in the link colour when it has an `href` |
| `ObjectPage` | An object's page | Breadcrumbs, the `ObjectHeader`, section tabs (Overview, Properties, Links, History) on the page gutter; Overview is a two-column grid of property, link, graph and activity panels |
| `LinkPanel` | An object's relationships | One group per link type: relation, arrow (← for incoming), target type glyph and name, count; the first three objects with their detail; "View all" |
| `LinkGraph` | The object's one-hop neighbourhood | Deterministic radial sectors per link type, relation on the middle edge, at most 40 nodes with "+N", dashed incoming edges, labels radial when the ring is dense; 1:1 scale fitted to at least 80% with text at its type size, the object kept in view, pan and zoom |
| `SchemaGraph` | The ontology's types and link types | Layered left to right, type glyph, name and count per node, curved directed edges with labels, back edges and rank-skipping edges routed through the gaps between nodes (a skipping edge's label on its straight run), the selected type highlighted and kept in view |
| `NavRail` | The shell's left navigation | 232 px (48 collapsed), sections with 11 px labels, 28 px items with an icon or type glyph and a count, the current item on `--mtc-selection` with a 2 px accent bar |
| `PageHeader` | The top of every page | Breadcrumbs, a 16/600 title (or an `ObjectHeader`), description, actions, an optional tab strip; flat, optionally sticky |
| `SearchField` | Search boxes | 32 px, control boundary, search icon, type-pill tokens, clear, a `/` focus hint |
| `CommandPalette` | Global search and commands (Ctrl/⌘ K) | Results grouped by type with glyphs, the highlight as selection plus accent bar, keyboard hints in the footer |
| `FacetList` | Explorer filters | Object type as a single-select list with glyphs and counts, value facets as checkboxes, "Show more" past eight |
| `ActivityFeed` | Who did what to which object | Avatar, bold actor, verb, `ObjectChip`, summary, relative time; the `timeline` variant draws toned dots on a line with absolute times |
| `StatTile` | Headline numbers | 20/600 tabular value with unit, change with a direction arrow (ok or danger tone), optional status and link |
| `Toaster` | Notifications | Bottom-end stack, a 2 px tone bar, polite status (`danger` assertive), pauses on hover or focus |
| `Pagination` | Page and cursor paging | Summary, Previous and Next, "Page n of m" when the count is known |
| `FilePreview` | Previews of stored files | Bounded reads, signature-checked images and PDFs, sanitised Markdown with the type scale, CSV in a `DataGrid`, a neutral notice when cut, a download action when refused |
| `CodeView` | Source, logs and raw JSON | Monospace 12 px on a 20 px line, muted line numbers that are never copied, wrap with a hanging indent, highlighted lines as selection plus accent bar |
| `ProductShell` | The frame of every product UI | 44 px top bar (product mark, scope, centred search with `Ctrl K`, account), 232 px rail (48 collapsed, a drawer on phones), page, optional 360 px inspector, 24 px status bar; flat, one border between regions |
| `OperationsTray` | Uploads, ingests and other long work | A raised tray at the bottom end (a sheet on phones), summary header, status icon per row, a 4 px accent progress bar, Cancel, Retry and Dismiss |
| `DataGrid` | Every table of objects, records, files or events | 32 px rows (28 compact, 40 comfortable), 12/500 sentence-case headers over a strong rule, typed cells, numeric columns end-aligned, columns sized to their content and fitted to the width (text gives way with an ellipsis only when every column then fits, otherwise the grid scrolls; numbers, dates and chips never give way; a value cut short keeps its title and shows whole on keyboard focus), selection as `--mtc-selection` plus a 2 px accent bar, one tab stop; windowed above 200 rows |

**Typed values.** `PropertyValue` decides presentation from `kind` or
`format`: strings clamp to two lines in panels and one in grids; `id` and
`code` are monospace with a copy action in panels; numbers group and align to
the end in grids; `currency:XXX` adds the muted code in panels; `percent`
takes a 0–1 ratio (`18.0%`); `date` and `datetime` add relative time in
panels (a calendar date never shifts a day across time zones); booleans are a
check or cross with Yes or No; `enum` is a chip, or a `StatusBadge` when a
tone is given; lists show three chips then "+N"; object references are
`ObjectChip`s; `url` links only `http:` and `https:` (new tab, external icon);
nested objects open in a disclosure, never as raw JSON; empty values are an
em dash in `--mtc-muted-subtle`.

## Page templates

The `Templates/Pages` stories are the reference layouts for product pages,
composed only from the toolkit entry (a unit test rejects any other import):
Object explorer, Object view, Object type, Schema graph, Files, Operations,
Storage and Connect. Each has dark and light baselines at 1440 px and 390 px.
Copy structure from these, not from the product clones.

| Template | Layout |
|---|---|
| Workspace frame | 44 px top bar (mark, workspace scope, search launcher with `Ctrl K`, settings, account), `NavRail`, page, an `Inspector` at 1280 px and wider, 24 px status bar with the prototype badge; on phones the rail is a `Drawer` behind the menu button and search is an icon |
| Object explorer | Rail collapsed; `FacetList` on the left (a `Drawer` behind "Filters" below 1024 px); `PageHeader`; `SearchField` with the type token; a result summary; a type-scoped `DataGrid`; the inspector previews the selection (compact header, key properties, link counts, "Open object") |
| Object view | `ObjectPage`: breadcrumbs, header with actions, tabs; Overview is `PropertyPanel` and `LinkPanel`, then `LinkGraph` and `ActivityFeed` |
| Object type | `ObjectPage` for the type: a schema `DataGrid` (property, API name, kind, required, format) beside the link-type `LinkPanel`, a `SchemaGraph` of the direct neighbourhood, and the first objects |
| Schema graph | `PageHeader` with Object types, Link types and Graph tabs; the full-width `SchemaGraph`; the inspector summarises the selected type |
| Files | Rail collapsed (the folder tree is the page's navigation); `PageHeader` with list or grid toggle and Upload; `SplitPane` of a folder `Tree` and the file `DataGrid` (name, linked object, size, updated, owner; the icon carries the kind), stacked on phones; the inspector shows the file's properties, kind included, and a bounded `FilePreview` |
| Operations | Service `StatTile`s with status, a Releases `DataGrid`, an incident `ActivityFeed` timeline, administration links as `ObjectChip`s |
| Storage | Summary `StatTile`s, a Buckets `DataGrid` (usage, objects, class, versioning, last write, status) with an inspector; an unconfigured area is an `EmptyState` with a `Callout`, never a sentence box |
| Connect | A Connectors `DataGrid`; the selected connector as an object: `ObjectHeader` with actions, a failure `Callout`, configuration `PropertyPanel` and sync-history timeline |

## Surface hierarchy

1. Workspace canvas.
2. Toolbar and context band.
3. Panel or widget surface.
4. Panel header or selected row.
5. Popover, confirmation or fullscreen surface.

Do not create hierarchy with unrelated colours: use surface level, border
strength, spacing and type weight first.

## Product hierarchy

The ontology language — typed objects, links, identity — is the visual
system everywhere, not a technical corner. Navigation still leads with the
business:

1. **Home / business pulse** — cash, revenue, margin, demand, delivery and
   customer health.
2. **Explore** — search-first access to every object, filtered by type.
3. **Decisions** — approvals, exceptions, commitments and risks with owners.
4. **Customers, operations and finance** — the owner's working areas, each
   an object set with object pages.
5. **Ontology** — the semantic model: object types, link types and their
   graph.
6. **Data foundation** — catalog, lineage, files, repositories and system
   topology for operators and implementation partners.

Record workspaces sit between day-to-day operations and the data foundation:
grid, board, calendar and form are alternate views of the same typed objects,
and selection and action state stay coherent across them.

## Definition of done for UI changes

- Works in `dark`, `light`, `operator` and `high-contrast`; dark and light
  visual baselines, and the exact text baseline beside them
  (`browser-tests/__aria__/<story>.yml`), are regenerated in the commit that
  intends the change (`pnpm exec playwright test -g "visual baseline|Dashboard
  (mobile|tablet) layout" --workers=2 --update-snapshots=changed`, then
  review every changed file).
- Uses semantic, status, type-identity and chart tokens only; the
  style-token check passes without raising any budget.
- Uses the type scale, sentence case, and monospace only for identifiers and
  code.
- Has a visible keyboard focus state.
- Remains readable at mobile, tablet and desktop widths without horizontal
  page scroll.
- Empty, loading, stale, disconnected, error, access-denied and confirmation
  states are coherent with the surrounding surface.
- Labels describe the business action; technical identifiers are secondary.
- No copied logo, product name, wordmark, proprietary icon, screenshot or
  exact competitor layout is introduced.
- `make validate` passes.
