# Data Platform Foundation

Medallion Terminal Core now contains the frontend contracts and built-in
surfaces needed to assemble an ontology-driven data platform UI without
putting vendor- or domain-specific concepts into the framework.

Run the reference platform dashboard with:

```bash
flox activate
pnpm backend &
pnpm dev
```

Open:

```text
http://localhost:5173/?template=/examples/platform-foundation.json&backend=http://localhost:3001
```

## Capability map

| Platform capability | Frontend primitive | Canonical contract | Backend responsibility |
|---|---|---|---|
| Asset discovery / catalog | `asset_catalog` | `AssetCatalogPayload` | Search, filtering, ranking, ownership, classifications, authorization |
| Ontology / object explorer | `object_view` | `ObjectPayload` | Object schemas, properties, links, permissions, action definitions |
| Lineage / dependency graph | `dag` | `GraphPayload` | Graph traversal, lineage extraction, impact analysis, access filtering |
| Code repositories | `code_browser` | `RepositoryPayload` | Git/ref resolution, tree listing, content retrieval, truncation, raw URLs |
| Record workspaces / business apps | `record_grid`, `record_board`, `record_calendar`, `record_form` | `RecordSetPayload` | Schemas, records, links, views, policy, formulas, revisions, automations |
| Files and data repositories | `file_browser`, `table`, charts | `TablePayload` and existing analytical shapes | Object storage, tabular query, previews, signed downloads, HTTP Range |
| Source catalog / Compass-style connection inventory | `catalog` | `ListSources` | Source registration, parameter schemas, health, authorization |
| Object and workflow actions | `object_view`, `trade`, custom forms | `SubmitAction` / `WatchAction` | Policy checks, idempotency, execution, lifecycle, audit |
| AI-assisted views | `prompt` | `Generate` | Model orchestration, retrieval, policy, template validation |
| Reporting and BI | Export menu, embed mode, BI descriptor | `flatten()` / `BiConnectorDescriptor` | Optional SQL, ODBC, Arrow Flight, or query gateway |

Every selection can update shared dashboard context. For example, choosing an
asset can set `asset_id`, which retargets the object detail and lineage
widgets; choosing a repository can also set `repository`, `repo_ref`, and
`repo_path`.

## Ready product compositions

The framework should be composed from the existing primitives instead of
growing a second widget family for each adjacent product:

| Product surface | Compose these built-ins | What is ready |
|---|---|---|
| Compass / governed knowledge hub | `asset_catalog` + `object_view` + `dag` + `code_browser` | Curated discovery, tags and ownership, semantic detail, links, actions, lineage, and source browsing |
| Drive-style file workspace | `file_browser` + `asset_catalog` + optional `object_view` | Hierarchical paths, breadcrumbs, search, paging, upload, download, gallery mode, and inline media/document/data preview |
| Airtable-style operational app | `record_grid` + `record_board` + `record_calendar` + `record_form` | Typed fields, links, saved views, filters/sorts, inline edits, governed CRUD, revision checks, and multiple projections over one record set |
| Grafana / Superset-style analytics | `metric`, `stat_strip`, `timeseries`, `area_chart`, `bar_chart`, `table`, `heatmap`, `histogram`, `boxplot`, `scatter`, `treemap`, `gauge`, `events`, `alert_log` | Context-driven filters, streaming/polling, freshness and retry state, annotations, alerts, drill-down, snapshots, export, and embedding |
| Market / financial terminal | Analytical set above + `candlestick`, `orderbook`, `volume_profile`, `tape`, `ticker`, `paired_grid`, `trade` | Live market views, cross-widget selection, write actions, lifecycle tracking, and compact operator density |

These are capability-level analogues, not copies of another product's layout
or trade dress. A host can put them in tabs with `MultiDashboard`, retarget
all panels through shared `ctx`, and register a custom widget when a genuinely
new projection is required.

The current file surface intentionally stops short of pretending that storage
policy is a UI concern. Rename, move, delete, share, retention, and folder
creation should be exposed as permission-gated host actions once their audit
and confirmation rules exist. Likewise, `record_grid` is a typed operational
grid, not an Excel engine: bulk paste/fill, collaborative cursors, arbitrary
client formulas, and millions-row virtualization should only be added when a
validated product requirement warrants the complexity.

## Component admission rule

Before adding a built-in, prefer—in order:

1. a new template that composes existing widgets;
2. an option or saved view over an existing canonical payload;
3. a consumer-side `registerWidget` extension;
4. a built-in only when the interaction is broadly reusable across domains;
5. a new canonical payload only when identity, lifecycle, or wire semantics
   cannot be represented by an existing shape.

This keeps the core small and avoids parallel table, tree, chart, or form
systems that would drift in accessibility, theming, export, and streaming
behavior.

## Recommended backend shape

`TerminalService` should be the host application's frontend-facing adapter,
not necessarily one monolithic implementation. A production platform can
compose any internal architecture behind it:

1. Identity and policy service for authentication, row/object/field-level
   authorization, classifications, and entitlements.
2. Metadata and search service for assets, schemas, tags, ownership,
   documentation, quality, and freshness.
3. Ontology service for object types, object instances, links, derived
   properties, and action definitions.
4. Data plane for SQL/query execution, object storage, streaming, datasets,
   and binary media.
5. Code plane for repositories, refs, commits, files, reviews, and build
   artifacts.
6. Lineage and orchestration service for jobs, schedules, dependencies,
   impact analysis, and execution state.
7. Action service for policy-gated writes, idempotency, durable lifecycle
   updates, and audit records.
8. Optional generation service for AI-authored templates and analysis.

The record-workspace contract and governed mutation conventions are detailed
in [RECORDS.md](RECORDS.md).

The adapter maps those internal APIs onto the small set of canonical payloads
in `proto/medallion/terminal/v1/`.

## Production invariants

- Authorize every `Get`, `Stream`, download, and action on the server. A
  template or hidden widget is never an authorization boundary.
- Filter catalog, object links, graph nodes, and repository entries before
  returning them; do not expose inaccessible identifiers as placeholders.
- Treat `client_request_id` as an idempotency key and persist action lifecycle
  state when actions are asynchronous.
- Return signed or host-controlled URLs for raw files and repository content.
  Never place credentials in templates.
- Apply field masking and classification policy before serializing object
  properties or table rows.
- Record reads, exports, downloads, generated dashboards, and write actions in
  the host audit system.
- Validate untrusted templates with `validateTemplateTrust`; allow arbitrary
  URLs and iframe permissions only for operator-owned templates.
- Put rate limits, request-size limits, CORS restrictions, authentication, and
  durable storage in front of the reference backend before deployment.

## Deliberate boundary

This repository is still the React/TypeScript rendering framework. It does not
implement identity, a metadata graph, a database, object storage, Git hosting,
compute, orchestration, collaborative editing, or a SQL/Arrow gateway. Those
are host services. The framework now gives those services stable proto
contracts, composable widgets, examples, exports, and integration tests so the
full stack can be built without inventing frontend protocols for each surface.
