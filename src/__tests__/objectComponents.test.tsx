import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Avatar, initialsOf, MetaRow, Panel, StatusBadge } from '../components/Display'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import { ObjectChip } from '../objects/ObjectChip'
import { ObjectHeader } from '../objects/ObjectHeader'
import { PropertyPanel } from '../objects/PropertyPanel'
import { PropertyValue } from '../objects/PropertyValue'
import { PropertyList } from '../workbench/PropertyList'

const html = (node: React.ReactNode) => renderToStaticMarkup(node)
const NOW = Date.parse('2026-09-25T17:00:00Z')

describe('PropertyValue', () => {
  it('renders ids in monospace with a copy action only in panels', () => {
    expect(html(<PropertyValue value="CUS-01842" kind="id" />)).toContain('<code>CUS-01842</code>')
    expect(html(<PropertyValue value="CUS-01842" kind="id" />)).toContain('aria-label="Copy"')
    expect(html(<PropertyValue value="CUS-01842" kind="id" context="grid" />)).not.toContain('aria-label="Copy"')
  })

  it('adds the currency code and relative time in panels only', () => {
    expect(html(<PropertyValue value={284000} format="currency:USD" />)).toContain('USD</span>')
    expect(html(<PropertyValue value={284000} format="currency:USD" context="grid" />)).not.toContain('USD</span>')
    const date = html(<PropertyValue value="2026-10-18" kind="date" now={NOW} />)
    expect(date).toContain('dateTime="2026-10-18"')
    expect(date).toContain('in 23 days')
  })

  it('links only http URLs and opens them in a new tab', () => {
    const link = html(<PropertyValue value="https://northstar.example" kind="url" />)
    expect(link).toContain('href="https://northstar.example/"')
    expect(link).toContain('rel="noopener noreferrer"')
    expect(html(<PropertyValue value="javascript:alert(1)" kind="url" />)).not.toContain('href=')
  })

  it('shows tones as status badges and the rest of a list as +N', () => {
    expect(html(<PropertyValue value="Churned" kind="enum" tones={{ Churned: 'danger' }} />)).toContain('data-tone="danger"')
    const list = html(<PropertyValue value={['a', 'b', 'c', 'd', 'e']} />)
    expect(list).toContain('+2')
    expect(list).toContain('2 more: d, e')
  })

  it('never renders nested objects as JSON', () => {
    const markup = html(<PropertyValue value={{ horizon: 90, currency: 'USD' }} />)
    expect(markup).toContain('<details')
    expect(markup).toContain('2 fields')
    expect(markup).not.toContain('{&quot;')
  })

  it('translates words through the scope catalog', () => {
    const markup = html(
      <DesignSystemProvider locale="zh-CN"><PropertyValue value={true} /></DesignSystemProvider>,
    )
    expect(markup).toContain('是')
  })
})

describe('object components', () => {
  it('ObjectHeader names the type, id and status with the title as the heading', () => {
    const markup = html(
      <ObjectHeader
        type={{ id: 'customer', label: 'Customer', icon: 'building', color: 'teal' }}
        title="Northstar Labs"
        objectId="res-customer-northstar"
        status={{ label: 'Active', tone: 'ok' }}
        meta={['Revision 14']}
      />,
    )
    expect(markup).toContain('<h1 class="mtc-object-header-title">Northstar Labs</h1>')
    expect(markup).toContain('--mtc-object-type-fg:var(--mtc-type-teal-fg)')
    expect(markup).toContain('aria-label="Copy ID"')
    expect(markup).toContain('Revision 14')
    expect(html(<ObjectHeader compact type={{ label: 'Customer' }} title="N" />)).toContain('<h2')
  })

  it('ObjectChip is a link with an href, a button with only onNavigate, else text', () => {
    const object = { id: 'p1', title: 'Ada Morgan', type: { label: 'Person', icon: 'person' as const } }
    expect(html(<ObjectChip object={{ ...object, href: '#/p1' }} />)).toMatch(/^<a href="#\/p1"/)
    expect(html(<ObjectChip object={object} onNavigate={() => {}} />)).toMatch(/^<button type="button"/)
    expect(html(<ObjectChip object={object} />)).toMatch(/^<span/)
  })

  it('PropertyPanel groups rows and counts them', () => {
    const markup = html(
      <PropertyPanel
        properties={[
          { id: 'a', label: 'Legal name', value: 'Northstar', group: 'Identity' },
          { id: 'b', label: 'ACV', value: 5, format: 'currency:USD', group: 'Commercial' },
        ]}
      />,
    )
    expect(markup).toContain('2 of 2')
    expect(markup).toContain('aria-label="Identity"')
    expect(markup).toContain('aria-label="Commercial"')
    expect(markup).toContain('aria-label="Filter properties"')
  })

  it('PropertyList renders values through PropertyValue', () => {
    const markup = html(<PropertyList properties={{ Count: 1234567, Nested: { a: 1 } }} />)
    expect(markup).toContain('1,234,567')
    expect(markup).toContain('<details')
  })
})

describe('display primitives', () => {
  it('derives initials from the first and last words', () => {
    expect(initialsOf('Jamie Kim')).toBe('JK')
    expect(initialsOf('Ada Lovelace Morgan')).toBe('AM')
    expect(initialsOf('sync')).toBe('SY')
    expect(initialsOf('  ')).toBe('?')
    expect(html(<Avatar name="Jamie Kim" />)).toContain('aria-label="Jamie Kim"')
    expect(html(<Avatar name="Jamie Kim" decorative />)).toContain('aria-hidden="true"')
  })

  it('StatusBadge keeps a label beside its tone dot', () => {
    const markup = html(<StatusBadge tone="warning">Needs review</StatusBadge>)
    expect(markup).toContain('mtc-badge-dot')
    expect(markup).toContain('data-intent="warning"')
    expect(markup).toContain('Needs review')
  })

  it('MetaRow drops empty items and Panel labels its region by its title', () => {
    expect(html(<MetaRow items={['a', null, false, 'b']} />).match(/<li/g)).toHaveLength(2)
    const panel = html(<Panel title="Links" subtitle="4 types">x</Panel>)
    expect(panel).toMatch(/<section aria-labelledby="([^"]+)"[^>]*>.*id="\1"/)
  })
})
