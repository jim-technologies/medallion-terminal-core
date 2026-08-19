# Product and Visual System

Medallion is an operating-intelligence product for small and medium-sized
businesses. It borrows the discipline of modern industrial software—dense
information, shared context, traceable actions, and calm operational
surfaces—without copying another company's brand, assets, names, or exact
trade dress.

The product promise is simple: **see the whole business and act from one
place**.

## Experience principles

1. **Owner-first language.** Prefer revenue, cash, customers, orders,
   projects, risks, and decisions over infrastructure terminology. Technical
   detail remains available when a user drills into data, lineage, or code.
2. **Decision before decoration.** Every prominent number or alert should
   help answer: what changed, why it matters, who owns it, and what happens
   next.
3. **Operational calm.** Neutral surfaces carry most of the interface. Color
   is reserved for selection, status, risk, and action; it is never ambient
   decoration.
4. **Progressive detail.** Start with the business pulse, then reveal the
   underlying object, relationship, source, or event without losing context.
5. **Trust is visible.** Show freshness, owner, status, permissions, action
   lifecycle, and audit-relevant outcomes near the work they describe.
6. **Keyboard-capable, pointer-friendly.** Power-user navigation must coexist
   with clear labels and familiar controls for users who do not live in a
   terminal.

## Theme presets

`Dashboard`, `MultiDashboard`, and `DesignSystemProvider` expose four scoped
themes:

| Theme | Intended use | Visual character |
|---|---|---|
| `dark` | Product default | Graphite surfaces, cobalt interaction, brass signal details |
| `operator` | High-contrast operational rooms | Near-black surfaces with softened citrine interaction |
| `light` | Bright offices, reports, and embedded BI | Cool white surfaces with restrained blue interaction |
| `high-contrast` | Accessibility-focused work | Black canvas, explicit boundaries, strong focus and status hierarchy |

```tsx
<Dashboard template={template} theme="dark" />
<Dashboard template={template} theme="operator" />
<DesignSystemProvider theme="high-contrast">...</DesignSystemProvider>
```

Themes are scoped under `.mtc-root`; multiple differently themed dashboards
can coexist on one page. Host products may override the public `--mtc-*`
variables, but should retain the semantic roles below.

The standalone embed accepts the same presets with
`embed.html?...&theme=operator`; invalid values fall back to `dark`.

## Color roles

- `--mtc-bg`: workspace canvas only.
- `--mtc-surface`: primary widget and control surface.
- `--mtc-surface-raised`: menus, headers, and raised details.
- `--mtc-panel`: selected rows, quiet tags, and skeletons.
- `--mtc-border` / `--mtc-border-strong`: hierarchy, never decoration.
- `--mtc-fg`, `--mtc-fg-soft`, and `--mtc-muted*`: text hierarchy.
- `--mtc-accent`: links, selection, focus, and primary action.
- `--mtc-signal`: tiny identity or attention marks, used sparingly.
- `--mtc-ok`, `--mtc-warning`, and `--mtc-danger`: state only.
- `--mtc-chart-1` through `--mtc-chart-8`: categorical data series.

Production widget code should use these variables or the shared
`widgets/colors.ts` exports. Hard-coded palette values belong only in a
canvas library's documented fallback path or a Storybook fixture.

All normal text, actionable accents, and semantic status text maintain at
least a 4.5:1 contrast ratio against the canvas, widget, and selected-panel
surfaces in every built-in theme. `--mtc-muted-subtle` is reserved for
non-essential metadata and maintains at least 3:1. State must also have a
label, icon, shape, or position cue; color alone is never the only signal.
`themeColors.test.ts` enforces these palette invariants.

## Typography and density

- Use the sans stack for navigation, titles, explanation, and actions.
- Use the mono stack for identifiers, code, timestamps, shortcuts, and raw
  values—not for ordinary prose.
- Use tabular numerals for changing metrics and aligned financial values.
- Sentence case is the default. Uppercase is reserved for short metadata,
  state labels, and section eyebrows.
- The default radius is six pixels. Large consumer-style pills and excessive
  rounding weaken the precise operating-system character.
- Comfortable density is the default for business users; compact mode is a
  deliberate operator preference.

## Surface hierarchy

1. Workspace canvas.
2. Toolbar and context band.
3. Widget surface.
4. Widget header or selected row.
5. Popover, confirmation, or fullscreen surface.

Do not create hierarchy by introducing unrelated colors. Use surface level,
border strength, spacing, and type weight first.

## Product hierarchy

The recommended default navigation and dashboard order is:

1. **Today / Business pulse** — cash, revenue, margin, demand, delivery, and
   customer health.
2. **Decisions** — approvals, exceptions, commitments, and risks with owners.
3. **Customers and sales** — accounts, pipeline, renewals, support, and
   activity.
4. **Operations** — orders, projects, capacity, inventory, suppliers, and
   service performance.
5. **Finance** — collections, payables, forecast, runway, and scenario views.
6. **Data foundation** — catalog, ontology, lineage, files, and repositories
   for advanced operators and implementation partners.

Record workspaces sit between day-to-day operations and the data foundation:
grid, board, calendar, and form are alternate views of the same typed business
objects. Selection and action state must remain coherent across every view.

The ontology is the connective tissue, not the first screen most business
owners should see.

## Definition of done for UI changes

- Works in `dark`, `operator`, `light`, and `high-contrast` themes.
- Uses semantic status colors and shared chart tokens.
- Has a visible keyboard focus state.
- Remains readable at mobile, tablet, and desktop breakpoints.
- Empty, loading, stale, disconnected, error, and confirmation states are
  coherent with the surrounding widget.
- Labels describe the business action; technical identifiers are secondary.
- No copied logo, product name, proprietary icon, screenshot, or exact
  competitor layout is introduced.
- Storybook and the complete CI build pass.
