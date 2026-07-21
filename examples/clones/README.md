# Clone showcase organization

These product-faithful examples prove presentation readiness without adding
vendor-specific APIs to the published framework.

## Catalog rule

Organize every showcase by vendor first, then by product or shared product
family:

```text
clones/
  airtable/      # vendor and product are the same
  databricks/
  google/
    calendar/
    drive/
    maps/
    photos/
    workspace/   # shared Docs, Sheets, and Slides implementation
  netflix/
  palantir/
    foundry/
  shared/        # vendor-neutral showcase primitives only
  snowflake/
```

Storybook follows the same navigation:

```text
Clones/
  Airtable
  Databricks
  Google/
    Calendar
    Docs
    Drive
    Maps/
      Timeline
    Photos
    Sheets
    Slides
  Netflix
  Palantir/
    Foundry/
      Foundation
      Ontology & Operations
  Snowflake
  …
```

Each clone story must declare:

- `cloneVendor`: the owning vendor used for the filesystem and first Storybook
  group.
- `cloneProduct`: the complete product name, including its vendor when they
  differ.
- `cloneNamespace`: a unique kebab-case implementation namespace.

Standalone products such as Airtable, Databricks, Netflix, Slack, Snowflake,
and Stripe remain one level deep because their vendor and product names are
identical. Do not introduce broad market-segment folders such as “SME” or
“finance”; those obscure the products and make the catalog harder to scan.

`storybookCoverage.test.ts` and `check-storybook.mjs` enforce this contract.
