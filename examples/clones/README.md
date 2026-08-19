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
  intuit/
    quickbooks/
  linear/
  meta/
    facebook/
    instagram/
    shared/       # provider-local social presentation only
    threads/
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
  shared/        # vendor-neutral showcase primitives only
  shopify/
  slack/
  snowflake/
  spotify/        # Spotify music product at the provider root
    backstage/
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
  Intuit/
    QuickBooks
  Linear
  Meta/
    Facebook
    Instagram
    Threads
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
  Shopify
  Slack
  Snowflake
  Spotify         # consumer music product stories
  Spotify/
    Backstage
  Stripe
```

Each clone story must declare:

- `cloneVendor`: the owning vendor used for the filesystem and first Storybook
  group.
- `cloneProduct`: the complete product name, including its vendor when they
  differ.
- `cloneNamespace`: a unique kebab-case implementation namespace.

Standalone products such as Airtable, Binance, CoinGecko, Databricks, GitHub,
GitLab, Linear, Netflix, Notion, Polymarket, Slack, Snowflake, and Stripe
remain one level deep because their vendor and product names are identical.
Products owned by a broader provider use another level, such as
`Google/Gmail`, `Atlassian/Jira`, `Meta/Instagram`, `OpenAI/ChatGPT`, or
`Spotify/Backstage`. Spotify's consumer music product remains at the provider
root while Backstage uses its named product child. Do not introduce broad
market-segment folders such as “SME” or “finance”; those obscure the products
and make the catalog harder to scan.

Some product suites share typed fixtures and low-level primitives from
`shared/archetypes`, but every named product owns its presentation shell and
information architecture. Outlook does not reuse Gmail chrome, Jira does not
reuse Linear chrome, Confluence does not reuse Notion chrome, Trader Workstation
does not reuse Binance chrome, and Superset does not reuse Grafana chrome.

GitHub and GitLab likewise use independent product renderers over one neutral
code-collaboration data contract; their pull-request/checks and
merge-request/pipeline information architectures stay intentionally distinct.
Instagram, Facebook, and Threads share one typed, provider-local renderer under
`meta/shared`; it keeps their common social data and interaction contract
together without turning Meta-specific presentation into a published framework
API.

`storybookCoverage.test.ts` and `check-storybook.mjs` enforce this contract.
