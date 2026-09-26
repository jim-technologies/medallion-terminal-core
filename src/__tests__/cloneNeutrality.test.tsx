import { composeStories } from '@storybook/react'
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

// Clone showcases reproduce another product's layout so the toolkit can be
// judged against it, but never its name, logo, wordmark or the brand features
// it is known by (examples/clones/README.md). This guard renders every clone
// story and fails when any visible text or accessible name (aria-label,
// title, placeholder, alt) says one of these names. Folders, Storybook titles
// and the cloneVendor / cloneProduct parameters still name the reference;
// they are not rendered, so they are not checked here.
const THIRD_PARTY_NAMES = [
  // The products and vendors the clones reference.
  'Airtable', 'Superset', 'Confluence', 'Jira', 'Atlassian', 'Binance', 'CoinGecko',
  'Databricks', 'GitHub', 'GitLab', 'Google', 'Gmail', 'Grafana', 'HubSpot',
  'Interactive Brokers', 'Trader Workstation', 'IBKR', 'Intercom', 'Intuit', 'QuickBooks',
  'Facebook', 'Instagram', 'WhatsApp', 'Outlook', 'Netflix', 'Notion', 'OpenAI', 'ChatGPT',
  'Palantir', 'Foundry', 'Polymarket', 'Shopify', 'Slack', 'Snowflake', 'Spotify',
  'Backstage', 'Stripe', 'Linear',
  // Their branded features, assistants and sub-products.
  'Gemini', 'Breeze', 'Copilot', 'TechDocs', 'Unity Catalog', 'Lakeflow', 'Horizon',
  'Compass', 'Ask Photos', 'SQL Lab', 'Radar', 'Huddle', 'Workflow Builder', 'Fin',
  'Messenger', 'Reels', 'Mosaic', 'Top 10', 'Sidekick', 'Rovo', 'Duo', 'Genie', 'Cortex',
  'Snowsight', 'Pipeline Builder', 'Code Workbook', 'Discover Weekly', 'Jam',
  // Payment-network logotypes on card chips.
  'VISA', 'Visa',
] as const

// Case-sensitive whole words: "linear", "slack" and "outlook" are ordinary
// words in the demo copy; the capitalised names are the products.
const NAME_PATTERN = new RegExp(`\\b(?:${THIRD_PARTY_NAMES.map(name => name.replace(/\s+/g, '\\s+')).join('|')})\\b`)

const ACCESSIBLE_ATTRIBUTES = /\s(?:aria-label|aria-description|aria-roledescription|title|placeholder|alt)="([^"]*)"/g

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
}

// What a person sees or hears: text nodes and accessible-name attributes.
function visibleStrings(html: string): string[] {
  const withoutCode = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/g, ' ')
  const text = withoutCode.replace(/<[^>]+>/g, '\n').split('\n').map(line => decodeEntities(line).trim()).filter(Boolean)
  const attributes = [...withoutCode.matchAll(ACCESSIBLE_ATTRIBUTES)].map(match => decodeEntities(match[1]!))
  return [...text, ...attributes]
}

type StoryModule = Parameters<typeof composeStories>[0]
const modules = import.meta.glob<StoryModule>('../../examples/clones/**/*.stories.tsx', { eager: true })

const cases = Object.entries(modules).flatMap(([file, module]) => (
  Object.entries(composeStories(module)).map(([name, Story]) => ({
    id: `${file.replace('../../examples/clones/', '')} › ${name}`,
    Story: Story as ComponentType,
  }))
))

describe('clone showcases render no third-party names', () => {
  it('renders every clone story', () => {
    expect(cases.length).toBeGreaterThanOrEqual(140)
  })

  it.each(cases)('$id', ({ Story }) => {
    const found = visibleStrings(renderToStaticMarkup(<Story />)).filter(value => NAME_PATTERN.test(value))
    expect(found).toEqual([])
  })
})
