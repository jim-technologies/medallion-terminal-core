# Conventions Conformance

A strict audit of medallion-terminal-core against the team's agreed
designs. Source of truth: `PRD.md`, `README.md`, `AGENTS.md`,
`CHANGELOG.md`, `package.json`.

Each convention is marked **Conforms**, **Fixed** (an unintentional
deviation corrected in this pass — conservatively, no behavior / API /
export change), or **Intentional deviation** (correct on purpose, with a
one-line rationale so it doesn't read as accidental drift).

| # | Convention | Status | Notes |
|---|------------|--------|-------|
| 1 | Deps via flox: `.flox/env/manifest.toml` installs node + pnpm (+ buf) | Conforms | `[install]` declares `nodejs`, `pnpm`, `buf`. `flox activate -- pnpm check` runs clean. |
| 2 | CI runs the gate via flox | Conforms | `.github/workflows/ci.yml` uses `flox/activate-action` → `pnpm run ci` (= install + lint + test + both builds + storybook build). |
| 3 | ONE `pnpm check` = typecheck + lint + format-check + tests + lib build | Conforms | `check = lint && test && build && build:lib`; `lint` = `tsc --noEmit` (strict, see #4) + `buf format --diff --exit-code` + `buf lint` + `buf build` + proto regen drift check; `test` = vitest (293); `build:lib` = vite lib + `tsc -p tsconfig.build.json` (.d.ts). |
| 4 | tsc strict incl. `noUnused*` | Conforms | `tsconfig.json` extends strict with `noUnusedLocals` / `noUnusedParameters`; `pnpm check` typechecks twice (`tsc --noEmit`, then `tsc -b`). |
| 5 | Lint = biome/buf | Intentional deviation | Repo lints TypeScript with **tsc strict** (incl. `noUnused*`) and proto with **buf** (format-diff + lint + build + generated-code drift check). There is no biome config and never has been — TS correctness is enforced by the strict compiler, not a separate JS linter. "biome/buf" in the brief is the generic placeholder; buf is the actual proto toolchain here. |
| 6 | Consistent widget module pattern across ALL widgets | Conforms | Every `src/widgets/*.tsx` follows one shape: top-of-file purpose comment, a typed `({ data, options }: WidgetProps)` component, a private `normalize(data)` that accepts canonical shape + shorthand, shared `Empty`/`Skeleton`/`ErrorState` from `states.tsx`, a sibling `*.stories.tsx`, and registration via `WidgetRegistry`. |
| 7 | New export / embed / bi modules follow the same module shape | Conforms | `src/export/*`, `src/embed/*`, `src/bi/*` each open with a purpose + scope header comment, export named functions + types with JSDoc, keep shape-knowledge in one place (`flatten.ts`), and lazy-import heavy deps (`hyparquet-writer`) mirroring the widget `heic2any` pattern. |
| 8 | Public package exports (`.`, `./proto`, `./styles`) stable + intentional | Conforms | `package.json#exports` declares exactly those three subpaths; `./.` → JS + `index.d.ts`, `./proto` → `proto.d.ts` types, `./styles` → `styles.css`. The barrel `src/index.ts` is the single curated export surface. |
| 9 | BI-export surface (CSV / Parquet / JSON / NDJSON + embed + BI descriptor) follows the documented data-source contract | Conforms | `export/serializers.ts` emits the four formats; `flatten.ts` projects every `shapes.proto` shape to `{columns, rows}`; `embed/embedConfig.ts` parses the query-string embed contract documented in README §"Embed"; `bi/connector.ts` builds the typed `BiConnectorDescriptor`. All four match README §"BI export and embedding". |
| 10 | The backend SQL/DuckDB gateway is documented as the consumer contract (a separate backend concern, not this repo) | Conforms | `bi/connector.ts` header states "IMPORTANT SCOPE: the actual SQL/DuckDB gateway lives in a separate backend service ... this module defines the CLIENT-SIDE contract." README §"BI-connector descriptor" repeats it: this repo emits the descriptor; a separate backend runs the `protocol: 'sql'` DuckDB/Arrow-Flight gateway. |
| 11 | Chart category palette: shared `PALETTE` vs Timeseries/AreaChart local `COLORS` | Intentional deviation | See "Palette decision" below — kept separate on purpose. |
| 12 | Axis tick abbreviation: shared `abbreviateAxis` vs BarChart local `abbreviate` | Intentional deviation | See "Abbreviate decision" below — kept separate on purpose. |
| 13 | Radar "same color palette as Timeseries" (PRD decision) | Intentional deviation | Radar uses the shared `PALETTE`, not Timeseries' local `COLORS`; see "Palette decision". The CHANGELOG "byte-identical" note refers to Radar's former private array (which equaled `PALETTE`'s prefix), and is accurate. |

## Palette decision (items 11 + 13)

There are two distinct color sets, and they are kept distinct **on
purpose**:

- `PALETTE` (`src/widgets/colors.ts`) — the framework's general-purpose
  "give me N distinct categorical colors" rotation, used by
  `resolveColor`, Treemap, Boxplot, and Radar. Eight colors.
- `COLORS` (local in `src/widgets/Timeseries.tsx` and
  `src/widgets/AreaChart.tsx`, byte-identical to each other) — a
  six-color line palette tuned specifically for thin strokes on the dark
  chart background (lighter `#38bdf8`/`#34d399`/`#f87171` rather than the
  more saturated `PALETTE` hues, which read muddy as 1.5px lines).

**Decision: do NOT unify.** The two palettes are visually different by
design (line-on-dark legibility vs. categorical fill distinctness), and
collapsing them would change rendered pixels in Timeseries/AreaChart —
a behavior change this audit explicitly disallows. The PRD's "same
palette as Timeseries" line for Radar predates the `PALETTE`/`COLORS`
split; Radar in fact uses `PALETTE` (its former private array was the
`PALETTE` prefix, hence the CHANGELOG's correct "byte-identical" note).
The two-palette state is therefore the intended, documented design, not
drift. (If a future change wants true cross-chart palette unity, that is
a deliberate visual change for its own PR, not a conformance fix.)

The shared `TOOLTIP_STYLE` and `SEMANTIC` map in `colors.ts` remain the
single source for tooltip chrome and severity/category colors — those
*were* duplicated and are now centralized (per CHANGELOG "Internal").
`Gauge`'s local `COLORS` is a semantic band map (different concern,
keyed by band name) and intentionally distinct from both palettes.

## Abbreviate decision (item 12)

- `abbreviateAxis(n)` (`src/widgets/format.ts`) — shared axis tick
  formatter: `K/M/B` with **1 decimal**, and non-integers below 1e3
  rendered at **2 decimals**. Used by Timeseries and AreaChart.
- `abbreviate(n)` (local in `src/widgets/BarChart.tsx`) — same `K/M/B`
  scaling but non-integers below 1e3 render at **1 decimal**.

**Decision: do NOT unify.** The only difference is sub-1e3 fractional
precision (1dp vs 2dp). Bar values are typically counts/totals where one
decimal is the cleaner tick; replacing BarChart's local with
`abbreviateAxis` would change rendered tick text (2dp), a behavior
change this audit disallows. Kept as a deliberate per-widget choice and
documented here so the duplication does not read as accidental. A future
"unify tick precision" change is a visual decision for its own PR.

## Gate

`flox activate -- pnpm check` is GREEN: tsc strict + buf
format/lint/build/drift + 293 vitest tests + app build + lib build all
pass. This pass made **no code changes** (the two flagged "unify"
candidates were correctly resolved as intentional deviations because
unifying would alter rendered output); it only adds this document.
