# Conventions Conformance

A strict audit of medallion-terminal-core against the team's agreed
designs. Source of truth: `README.md`, `AGENTS.md`, `CHANGELOG.md`,
`MAKEFILE-CONTRACT.md`, `package.json`.

Each convention is marked **Conforms**, **Fixed** (an unintentional
deviation corrected in this pass — conservatively, no behavior / API /
export change), or **Intentional deviation** (correct on purpose, with a
one-line rationale so it doesn't read as accidental drift).

| # | Convention | Status | Notes |
|---|------------|--------|-------|
| 1 | Deps via flox: `.flox/env/manifest.toml` installs node + pnpm (+ buf) | Conforms | `[install]` declares `nodejs`, `pnpm`, `buf`. The manifest carries no `buf` version constraint; the Flox lockfile (`.flox/env/manifest.lock`, currently buf 1.71.0) is the pin. `flox activate -- make validate` runs clean. |
| 2 | CI runs the gate via flox | Conforms | `.github/workflows/ci.yml` runs exactly one command — `flox activate -- make validate` — with every action pinned to a full commit SHA, no stored secrets, and no artifact uploads. The gate self-provisions (frozen-lockfile install + Playwright's pinned Chromium), so CI cannot drift from the local gate. |
| 3 | ONE gate verb `make validate` = public surface + version parity + typecheck + lint + format-check + tests + builds | Conforms | `validate = check:surface && check:version && lint && check:breaking && check:conformance && test && test:storybook && build && check:dist && check:package && check:bundles && build:storybook && test:browser`; `lint` = `tsc --noEmit` (strict, see #4) + `buf format --diff --exit-code` + `buf lint` + `buf build` + content-based proto regen drift check; `build:lib` = Vite library output + TypeScript declarations; package and consumer-bundle checks verify exports, files, size ceilings, and lazy isolation. |
| 4 | tsc strict incl. `noUnused*` | Conforms | `tsconfig.json` extends strict with `noUnusedLocals` / `noUnusedParameters`; `make validate` typechecks twice (`tsc --noEmit`, then `tsc -b`). |
| 5 | Lint = biome/buf | Intentional deviation | Repo lints TypeScript with **tsc strict** (incl. `noUnused*`) and proto with **buf** (format-diff + lint + build + generated-code drift check). There is no biome config and never has been — TS correctness is enforced by the strict compiler, not a separate JS linter. "biome/buf" in the brief is the generic placeholder; buf is the actual proto toolchain here. |
| 6 | Consistent widget module pattern across ALL widgets | Conforms | Built-ins use typed `WidgetProps`, shared states, sibling stories, and `WidgetRegistry` registration. Normalization stays private when shape-specific and moves to a shared module when multiple widgets/exporters consume the same canonical contract (`platformShapes.ts`, `recordShapes.ts`). |
| 7 | New export / embed / bi modules follow the same module shape | Conforms | `src/export/*`, `src/embed/*`, `src/bi/*` each open with a purpose + scope header comment, export named functions + types with JSDoc, keep shape-knowledge in one place (`flatten.ts`), and lazy-import heavy optional dependencies such as `hyparquet-writer`. |
| 8 | Public package exports stay stable and intentional | Conforms | `package.json#exports` keeps the backward-compatible root plus `./proto` and `./styles`, and adds focused `./toolkit`, `./dashboard`, and `./asset-open` entries. Every JavaScript subpath has generated declarations and a package-contract check. |
| 9 | BI-export surface (CSV / Parquet / JSON / NDJSON + embed + BI descriptor) follows the documented data-source contract | Conforms | `export/serializers.ts` emits the four formats; `flatten.ts` projects every `shapes.proto` shape, including asset/object/graph/repository/record-set payloads, to `{columns, rows}`; `embed/embedConfig.ts` parses the query-string embed contract; `bi/connector.ts` builds the typed descriptor. |
| 10 | The backend SQL/DuckDB gateway is documented as the consumer contract (a separate backend concern, not this repo) | Conforms | `bi/connector.ts` header states "IMPORTANT SCOPE: the actual SQL/DuckDB gateway lives in a separate backend service ... this module defines the CLIENT-SIDE contract." README §"BI-connector descriptor" repeats it: this repo emits the descriptor; a separate backend runs the `protocol: 'sql'` DuckDB/Arrow-Flight gateway. |
| 11 | Chart colors use the scoped semantic theme | Conforms | `PALETTE` resolves through `--mtc-chart-1..8`; Timeseries, AreaChart, Radar, Treemap, and Boxplot share it, while status direction uses `--mtc-ok` / `--mtc-danger`. |
| 12 | Axis tick abbreviation: shared `abbreviateAxis` vs BarChart local `abbreviate` | Intentional deviation | See "Abbreviate decision" below — kept separate on purpose. |
| 13 | Production widgets avoid fixed visual palettes | Conforms | SVG/Recharts widgets use public CSS variables; Candlestick keeps literal values only as the canvas library's no-CSS fallback. Story fixtures may use literals. |
| 14 | jim-technologies Makefile contract (`MAKEFILE-CONTRACT.md`) | Conforms | Verbs: `help` / `fmt` / `test` (+ `test-unit` / `test-storybook` / `test-browser` sub-verbs) / `validate` / `build` / `generate` / `release`, all self-documented via `## comment`. `validate` is the only gate verb (`check` and `ci:verify` are gone) and adds the public-surface guard (`scripts/public-surface-check.mjs`) and `VERSION`↔`package.json` parity (`scripts/check-version.mjs`). `release` (`scripts/release.mjs`) refuses a dirty or unpushed tree and is a confirmed-only maintainer action. No `deploy` target, no CI secrets, no encrypted-secret store; all dependencies resolve from the public npm registry. |

## Palette system (items 11 + 13)

One scoped token system drives production widgets:

- `PALETTE` (`src/widgets/colors.ts`) rotates `--mtc-chart-1` through
  `--mtc-chart-8` for categorical series.
- `SEMANTIC` resolves state names through `--mtc-ok`, `--mtc-warning`,
  `--mtc-danger`, `--mtc-accent`, and `--mtc-muted`.
- `TOOLTIP_STYLE` is the shared raised-surface tooltip chrome.
- Heatmaps use CSS `color-mix()` between semantic tokens and the panel
  baseline so all three theme presets remain coherent.

The public tokens live on `.mtc-root`. Tailwind aliases are declared with
`@theme inline` so they resolve against that scoped root rather than becoming
invalid at document `:root`. See `DESIGN.md` for the visual contract.

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

`flox activate -- make validate` is GREEN under the Flox-locked Node 24 /
pnpm 11 toolchain. The gate covers the public-surface guard, `VERSION`
parity, TypeScript 7 strict mode, Buf format/lint/build/generated drift and
breaking checks, TerminalService conformance, 612 unit tests, 346
browser-rendered Storybook tests, Vite 8 application/library builds,
generated declarations, published-package contracts, focused consumer-bundle
isolation, and the static Storybook build.

The broad Playwright suite is also green: all 184 checks pass. It enforces
automated accessibility across the canonical product and toolkit stories,
interaction workflows, mobile/tablet containment, and reviewed visual
baselines for every clone plus the focused GitHub, GitLab, Spotify Backstage,
and production readiness states.
