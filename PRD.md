# PRD — Platform and Record Foundation

## Goal

Provide the frontend contracts and composable built-in surfaces required to
build a governed data-platform and business-work application: asset discovery,
ontology/object detail, lineage, data/file repositories, code repositories,
typed records, saved views, forms, actions, and BI handoff.

Package those capabilities in an original, professional operating-intelligence
experience suitable for business owners and operators, with technical platform
surfaces available as progressive detail rather than the default entry point.

The framework remains domain-neutral and frontend-only. Host applications own
identity, authorization, metadata storage, query execution, object storage,
Git, orchestration, and generation.

## Scope

In:

- Canonical `AssetCatalogPayload`, `ObjectPayload`, `GraphPayload`, and
  `RepositoryPayload` proto messages.
- Built-in `asset_catalog`, `object_view`, and `code_browser` widgets.
- Canonical `RecordSetPayload` with typed fields, stable record identity,
  links, saved view metadata, revisions, and mutation capabilities.
- Canonical `ConversationPayload` with participants, messages, threads,
  attachments, reactions, delivery state, and context selection.
- Built-in `record_grid`, `record_board`, `record_calendar`, and `record_form`
  projections over the same record payload.
- Built-in `conversation` projection with channel, direct-message, and
  assistant modes.
- `dag` support for the canonical graph contract and context-driven node
  selection.
- Context handoff between catalog, object, lineage, and repository surfaces.
- Object actions through `SubmitAction` / `WatchAction`, explicitly enabled by
  widget options.
- Export/BI projections for all new payloads.
- A reference backend and `platform-foundation.json` dashboard that exercise
  the complete flow.
- A reference revision-safe, idempotent record mutation lifecycle and
  `work-management.json` workspace.
- Path-based file-store alignment across widget, example, backend, media
  preview, download, and tests.
- Flox-locked Node/pnpm/Buf upgrades plus current compatible frontend tooling.
- Scoped `dark`, `operator`, and `light` themes driven by semantic tokens.
- An owner-facing business-operations example and durable visual/product
  rules in `DESIGN.md`.

Out:

- Implementing a production metadata graph or ontology database.
- Authentication, authorization policy engines, audit storage, data masking,
  or secrets management.
- SQL execution, object storage, Git hosting, compute/orchestration, or
  collaborative editing.
- Product-specific naming or assumptions in core widget code.
- A production record database, formula engine, automation runtime, comments,
  notifications, or real-time collaborative editing.

## Decisions

### TerminalService is the frontend adapter

Production hosts may compose many internal services. The browser still talks
to one stable ConnectRPC contract, keeping templates and widgets independent
of backend topology.

### Canonical payloads stay generic

Assets use free-form `kind`; semantic objects use properties, links, and
actions; graphs use nodes and edges; repositories use refs, entries, and
optional text file content. Backends can represent different industries and
platform architectures without changing React components.

Record applications use only fields, records, links, views, revisions, and
capabilities. CRM, project, inventory, approval, and case semantics live in
backend schemas and templates. Grid, board, calendar, form, and future custom
projections share one canonical payload.

### Authorization remains server-side

The frontend can hide or disable controls for UX, but the backend must filter
every catalog result, property, link, graph node, repository entry, download,
and action. Templates are not an authorization boundary.

### Latest means reproducible and supported

Flox locks the newest cross-platform Node, pnpm, and Buf versions available to
the environment. JavaScript dependencies are upgraded to the newest versions
accepted by pnpm's supply-chain policy and verified by type-check, tests, app
build, library build, and Storybook build.

### Inspired, not copied

The visual system may use broad industrial-software principles—neutral
surfaces, dense information, sparse signal color, and traceable actions—but
must not reproduce competitor logos, product names, proprietary assets, or
exact trade dress. Business language and owner decisions lead; ontology and
data mechanics support them.

## Done When

- The platform dashboard runs against the reference backend.
- The record workspace runs against the reference backend and demonstrates
  linked selection, saved views, create/update/delete, idempotency, and stale
  revision rejection.
- Proto generation is stable and generated JSON types are publicly exported.
- `make validate` is green.
- `pnpm build:storybook` is green.
- File upload/list/Range/download integration is covered.
- Documentation clearly separates frontend readiness from backend services
  still required for production.
- Dark, operator, and light themes remain readable and production widgets use
  semantic tokens rather than fixed dark-only colors.
