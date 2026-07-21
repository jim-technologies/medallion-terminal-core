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
| Operational geography | `geo_map` | `GeoPayload` / GeoJSON | Geospatial query, authorized features, host-controlled MapLibre style and tiles |
| Photo/video libraries | `media_gallery` | `MediaPayload` | Authorized media query, thumbnails/transcodes, albums, indexing, signed originals, HTTP Range |
| Channels, direct messages, and AI transcripts | `conversation` | `ConversationPayload` | Authorized history, search, pagination, realtime delivery, message writes, moderation, and retention |
| Code repositories | `code_browser` | `RepositoryPayload` | Git/ref resolution, tree listing, content retrieval, truncation, raw URLs |
| Record workspaces / business apps | `record_grid`, `record_board`, `record_calendar`, `record_form` | `RecordSetPayload` | Schemas, records, links, views, policy, formulas, revisions, automations |
| Files and data repositories | `file_browser`, `table`, charts | `TablePayload` and existing analytical shapes | Object storage, tabular query, previews, signed downloads, HTTP Range |
| Source catalog / Compass-style connection inventory | `catalog` | `ListSources` | Source registration, parameter schemas, health, authorization |
| Object and workflow actions | `object_view`, `trade`, custom forms | `SubmitAction` / `WatchAction` | Policy checks, idempotency, execution, lifecycle, audit |
| Schema-driven actions | `action_form` | Template field schema + `SubmitAction` / `WatchAction` | Field policy, server validation, authorization, execution, audit |
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
| Palantir Foundry | `asset_catalog` + `object_view` + `dag` + `geo_map` + `action_form` + `code_browser` + record/analytical widgets | Discovery, ontology detail, links, lineage, operational geography, governed actions, source browsing, workflows, and analysis |
| Google Calendar | `record_calendar` + `events` + optional `action_form`, `conversation`, and `object_view` | Month/week/day/schedule projections, multiple calendars, event detail, guests, rooms, conferencing, tasks, appointment surfaces, and host-governed scheduling actions |
| Google Drive | `file_browser` + `asset_catalog` + `object_view` + `events` / `action_log` + optional `action_form` | Paths, breadcrumbs, search, paging, upload/download, list/gallery, previews, details/activity, and policy-gated file operations |
| Google Photos | `media_gallery` + `file_browser` + optional `object_view`, `events`, and `action_form` | Capture timelines, albums, photo/video filtering, favorites, metadata, native playback, selection, storage upload, and policy-gated media operations |
| Google Maps Timeline | `geo_map` + `events` + `table` + optional `media_gallery` | Provider-neutral MapLibre paths and places, chronological activity, detail tables, related photos/video, and host-swappable basemaps |
| Google Docs / Google Sheets / Google Slides | `file_browser` + `table` + `text` + `image` / `iframe` + consumer-registered editors | File discovery, structured data, previews, context linking, and reference editor shells; persistence, realtime collaboration, formulas, and document formats remain host/editor services |
| Netflix | `asset_catalog` + `media_gallery` + `text` + `events` + optional `action_form` / consumer player | Personalized title discovery, visual rails, search, saved lists, title and episode detail, profiles, and player presentation; recommendations, rights, encoding, CDN delivery, entitlement, and DRM remain host services |
| Databricks | `code_browser` + `asset_catalog` + `table` + analytical widgets + `dag` + `events` / `action_log` | Notebook and SQL authoring shells, Unity Catalog discovery, Lakeflow task graphs and runs, result visualization, and AI-assistant presentation |
| Snowflake | `code_browser` + `asset_catalog` + `table` + analytical widgets + `events` / `action_log` + `dag` | File-based SQL projects, governed catalog discovery, query results, performance monitoring, transformation graphs, and current Workspaces reference anatomy |
| Airtable | `record_grid` + `record_board` + `record_calendar` + `record_form` | Typed fields, links, saved views, filters/sorts, inline edits, governed CRUD, revision checks, and multiple projections over one record set |
| Business operating workspace | `MultiDashboard` + record views + analytical widgets + `action_form` + `events` / `action_log` | Owner pulse, CRM/projects, commerce, support, finance, governed workflows, and drill-through into shared business objects |
| Grafana / Apache Superset | `metric`, `stat_strip`, `timeseries`, `area_chart`, `bar_chart`, `table`, `heatmap`, `histogram`, `boxplot`, `scatter`, `treemap`, `gauge`, `events`, `alert_log` | Context-driven filters, streaming/polling, freshness and retry state, annotations, alerts, drill-down, snapshots, export, and embedding |
| Binance | `stat_strip` + `candlestick` + `orderbook` + `depth_chart` + `tape` + `trade` + orders/holdings tables | Market statistics, candles, ladder and cumulative liquidity, prints, order entry, lifecycle, history, and watchlists |
| CoinGecko | `table` + `metric` / `stat_strip` + `timeseries` / `candlestick` + `distribution` + `text` | Ranked markets, coin detail, price/volume/cap history, metadata, categories, portfolio/watchlists, and news |
| Polymarket | `asset_catalog` / `table` + `gauge` + `timeseries` + `distribution` + `orderbook` / `depth_chart` + `trade` + `events` | Market discovery, implied probability, history, outcomes, liquidity, execution, positions, and activity |
| Interactive Brokers | `MultiDashboard` + analytical set + `candlestick` + `orderbook` + `depth_chart` + `paired_grid` + `trade` / `action_form` + `action_log` + `text` | Linked watchlists/scanners, portfolio and account views, charts, Level II, options, compact and advanced tickets, order monitoring, and news |
| Slack / WhatsApp / ChatGPT | `conversation` + `table` / `asset_catalog` + `events` + optional `action_form` / `prompt` | Channels, direct messaging, support, assistant/tool turns, participants, replies, reactions, files, delivery states, search, and context-driven drill-through |

These are capability-level analogues, not copies of another product's layout
or trade dress. A host can put them in tabs with `MultiDashboard`, retarget
all panels through shared `ctx`, and register a custom widget when a genuinely
new projection is required.

## Product showcase catalog

Storybook keeps product-faithful presentation references outside the published
core. Every story declares `cloneVendor`, `cloneProduct`, and a unique
implementation namespace. The filesystem and Storybook both group suites by
vendor before product:

| Vendor | Product | Storybook path | Generic framework foundation |
|---|---|---|---|
| Google | Calendar | `Clones/Google/Calendar` | Calendar records, events, scheduling actions, people, rooms, and conferencing |
| Google | Docs | `Clones/Google/Docs` | Files, text, embeds, context, consumer-registered editor |
| Google | Drive | `Clones/Google/Drive` | Files, catalog, object detail, activity, actions |
| Google | Maps | `Clones/Google/Maps/Timeline` | Maps, routes, events, media, provider-neutral basemaps |
| Google | Photos | `Clones/Google/Photos` | Media timeline, collections, files, metadata, actions |
| Google | Sheets | `Clones/Google/Sheets` | Tables, records, analytics, context, consumer-registered editor |
| Google | Slides | `Clones/Google/Slides` | Files, images, embeds, context, consumer-registered editor |
| Palantir | Foundry | `Clones/Palantir/Foundry/Foundation` and `Clones/Palantir/Foundry/Ontology & Operations` | Catalog, ontology, lineage, maps, data connections, code, records, actions |
| Airtable | Airtable | `Clones/Airtable` | Record grid, board, calendar, form, views, actions |
| Databricks | Databricks | `Clones/Databricks` | Notebooks, SQL editor, Lakeflow Jobs, Unity Catalog, compute, assistant |
| HubSpot | HubSpot | `Clones/HubSpot` | Records, customer detail, pipeline, activity, actions |
| Intercom | Intercom | `Clones/Intercom` | Inbox, conversation detail, tickets, customer context, reporting |
| Netflix | Netflix | `Clones/Netflix` | Personalized rails, title discovery, My List, profiles, episodes, and playback presentation |
| QuickBooks | QuickBooks | `Clones/QuickBooks` | Metrics, cash flow, invoices, transactions, review actions |
| Shopify | Shopify | `Clones/Shopify` | Commerce metrics, orders, inventory, fulfillment, actions |
| Slack | Slack | `Clones/Slack` | Workspace navigation, channels, presence, search, reactions, files, threads, app messages, composition |
| Snowflake | Snowflake | `Clones/Snowflake` | Workspaces, SQL projects, Horizon Catalog, query results and monitoring |
| Stripe | Stripe | `Clones/Stripe` | Payments, subscriptions, payouts, disputes, analytics |

The showcases accept host-provided records/content and demonstrate application
anatomy; they are not added to the npm barrel as vendor-specific framework
APIs. `storybookCoverage.test.ts` and `check-storybook.mjs` enforce the
vendor-first title and filesystem contract, unique namespaces,
discoverability, and coverage of every built-in and public dashboard example.

### Composition-ready products without a dedicated shell

These already have complete generic dashboard examples and readiness tests;
adding a product-faithful shell is presentation work, not a core capability
gap:

| Product | Existing proof |
|---|---|
| Binance | `spot-market.json` |
| CoinGecko | `crypto-watch.json` |
| Polymarket | `prediction-market.json` |
| Interactive Brokers | `medallion-terminal.json`, `options-desk.json`, `trading-floor.json` |
| Grafana / Superset | Analytical and operations examples across the public gallery |

### Next distinct interaction archetypes

If more product references are added, prioritize products that prove a new
interaction model rather than near-duplicates:

1. Gmail or Outlook — inbox/thread actions, composing, labels, search, and
   message lifecycle around Calendar’s now-proven scheduling surfaces.
2. Notion or Confluence — block documents, nested knowledge navigation,
   backlinks, comments, and permissions.
3. Linear or Jira — backlog, sprint planning, issue detail, dependencies, and
   workflow transitions over the existing record contract.
4. GitHub or GitLab — pull requests, review threads, checks, commits, and CI
   status around the existing code browser and DAG.

Slack now proves the shared conversation archetype; the generic widget stories
also show WhatsApp direct messaging and ChatGPT assistant/tool turns. Calendar
now proves agenda and time-grid scheduling. The first, second, and fourth
remaining items introduce meaningful editor behavior. Linear/Jira is already
capability-complete through record views and mainly needs a faithful reference
shell. Equivalent products such as
Microsoft Teams, Dropbox/OneDrive, Xero, Salesforce, or Adyen should reuse the
matching conversation, file, accounting, CRM, or payments archetype unless a
concrete workflow proves that the shared primitives are insufficient.

The current file surface intentionally stops short of pretending that storage
policy is a UI concern. Rename, move, delete, share, retention, and folder
creation can be presented through `action_form`, but only after the host
defines permission, audit, and confirmation rules. Likewise, `record_grid` is a typed operational
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

The regression suite codifies the requested product archetypes in
`src/__tests__/productSurfaces.test.ts`. It verifies both that the reference
compositions contain each required presentation primitive and that those
primitives remain registered under vendor-neutral names.

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
