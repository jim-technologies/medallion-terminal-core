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
`--mtc-accent-strong`, every type slot on its chip, and code tokens at 4.5:1;
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
  visual baselines are regenerated in the commit that intends the change.
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
