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
`pnpm lint`) enforces this with a ratcheting budget for the remaining
legacy sites.

**Contrast.** `themeColors.test.ts` checks every theme: text roles at 4.5:1
on the canvas, surfaces, quiet fill and selection; `--mtc-muted-subtle` at
3:1; status soft text on its tint, `--mtc-on-accent` on
`--mtc-accent-strong`, `--mtc-on-scrim` on a 70% black scrim over a white
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
- **Scale.** These are the only sizes; nothing is smaller than 11 px.

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
| `DataGrid` | Every table of objects, records, files or events | 32 px rows (28 compact, 40 comfortable), 12/500 sentence-case headers over a strong rule, typed cells, numeric columns end-aligned, selection as `--mtc-selection` plus a 2 px accent bar, one tab stop; windowed above 200 rows |

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
