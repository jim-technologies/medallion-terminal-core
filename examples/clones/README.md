# Clone showcase organization

These product-faithful examples prove presentation readiness without adding
vendor-specific APIs to the published framework.

## Catalog rule

Organize every showcase by vendor first, then by product or shared product
family:

```text
clones/
  apache/
    superset/
  airtable/      # vendor and product are the same
  atlassian/
    confluence/
    jira/
  binance/
  coingecko/
  databricks/
  github/
  gitlab/
  google/
    calendar/
    drive/
    gmail/
    maps/
    photos/
    workspace/   # shared Docs, Sheets, and Slides implementation
  grafana-labs/
    grafana/
  hubspot/
  intercom/
  interactive-brokers/
    trader-workstation/
  linear/
  meta/
    whatsapp/
  microsoft/
    outlook/
  netflix/
  notion/
  openai/
    chatgpt/
  palantir/
    foundry/
  polymarket/
  quickbooks/
  shared/        # vendor-neutral showcase primitives only
  shopify/
  slack/
  snowflake/
  spotify/
  stripe/
```

Storybook follows the same navigation:

```text
Clones/
  Apache/
    Superset
  Airtable
  Atlassian/
    Confluence
    Jira
  Binance
  CoinGecko
  Databricks
  GitHub
  GitLab
  Google/
    Calendar
    Docs
    Drive
    Gmail
    Maps/
      Timeline
    Photos
    Sheets
    Slides
  Grafana Labs/
    Grafana
  HubSpot
  Intercom
  Interactive Brokers/
    Trader Workstation
  Linear
  Meta/
    WhatsApp
  Microsoft/
    Outlook
  Netflix
  Notion
  OpenAI/
    ChatGPT
  Palantir/
    Foundry/
      Foundation
      Ontology & Operations
  Polymarket
  QuickBooks
  Shopify
  Slack
  Snowflake
  Spotify
  Stripe
```

Each clone story must declare:

- `cloneVendor`: the owning vendor used for the filesystem and first Storybook
  group.
- `cloneProduct`: the complete product name, including its vendor when they
  differ.
- `cloneNamespace`: a unique kebab-case implementation namespace.

Standalone products such as Airtable, Binance, CoinGecko, Databricks, GitHub,
GitLab, Linear, Netflix, Notion, Polymarket, Slack, Snowflake, Spotify, and Stripe
remain one level deep because their vendor and product names are identical.
Products owned by a broader provider use another level, such as
`Google/Gmail`, `Atlassian/Jira`, `Meta/WhatsApp`, or `OpenAI/ChatGPT`. Do not
introduce broad market-segment folders such as “SME” or “finance”; those
obscure the products and make the catalog harder to scan.

The remaining product suites share neutral archetype implementations from
`shared/archetypes`: mail, knowledge, work tracking, code collaboration,
markets, analytics, and conversation. Provider-specific story metadata and
visual tokens keep the catalog recognizable without duplicating an entire
component system per product.

`storybookCoverage.test.ts` and `check-storybook.mjs` enforce this contract.
