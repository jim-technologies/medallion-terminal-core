import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../components/Button'
import { Text, VisuallyHidden } from '../components/Display'
import { FormField, Select } from '../components/FormControls'
import { MenuPopup, Popover } from '../components/Overlays'
import { renderMarkdown } from '../files/markdown'
import { NavRail } from '../workbench/NavRail'

const html = (node: React.ReactNode) => renderToStaticMarkup(node)

// DOMPurify needs a DOM; here the resolvers are under test, not the sanitiser.
vi.mock('dompurify', () => ({ default: { sanitize: (dirty: string) => dirty } }))

// The primitives every product UI used to roll for itself (0.7.8).
describe('shared primitives', () => {
  it('draws a link as a button when given an href, inert while disabled', () => {
    const link = html(<Button href="/files/report.csv" download size="small">Download</Button>)
    expect(link).toMatch(/^<a /)
    expect(link).toContain('class="mtc-button"')
    expect(link).toContain('href="/files/report.csv"')
    expect(link).toContain('download=""')
    expect(link).not.toContain('type="button"')
    const external = html(<Button href="https://example.test" target="_blank">Open</Button>)
    expect(external).toContain('rel="noopener noreferrer"')
    const inert = html(<Button href="/x" disabled>Download</Button>)
    expect(inert).not.toContain('href=')
    expect(inert).toContain('aria-disabled="true"')
    expect(inert).toContain('tabindex="-1"')
    expect(html(<Button>Save</Button>)).toMatch(/^<button /)
  })

  it('renders checked menu items as radios with one check column', () => {
    const markup = html(
      <MenuPopup
        label="Appearance"
        initialIndex={0}
        onClose={() => {}}
        items={[
          { id: 'system', label: 'System', checked: true },
          { id: 'dark', label: 'Dark', checked: false },
        ]}
      />,
    )
    expect(markup).toContain('role="menuitemradio" aria-checked="true"')
    expect(markup).toContain('role="menuitemradio" aria-checked="false"')
    expect(markup.match(/mtc-menu-check/g)).toHaveLength(2)
    const plain = html(<MenuPopup label="Actions" initialIndex={0} onClose={() => {}} items={[{ id: 'open', label: 'Open' }]} />)
    expect(plain).toContain('role="menuitem"')
    expect(plain).not.toContain('mtc-menu-check')
  })

  it('draws the popover trigger as a button of the given variant', () => {
    const markup = html(<Popover trigger="Columns" triggerVariant="outline" triggerSize="small" triggerAriaLabel="Columns">x</Popover>)
    expect(markup).toContain('class="mtc-popover-trigger mtc-button"')
    expect(markup).toContain('data-variant="outline"')
    expect(markup).toContain('data-size="small"')
    expect(markup).toContain('<span class="mtc-button-label">Columns</span>')
    expect(html(<Popover trigger="Columns" triggerAriaLabel="Columns">x</Popover>)).toContain('class="mtc-popover-trigger"')
  })

  it('hides content visually and sets body text in the type scale', () => {
    expect(html(<VisuallyHidden>Choose a file</VisuallyHidden>)).toBe('<span class="mtc-visually-hidden">Choose a file</span>')
    expect(html(<Text tone="muted" size="sm">Saved to finance/</Text>))
      .toBe('<p class="mtc-text" data-tone="muted" data-size="sm">Saved to finance/</p>')
    expect(html(<Text as="span">Body</Text>)).toBe('<span class="mtc-text">Body</span>')
  })

  it('wires a native select through FormField like any control', () => {
    const markup = html(
      <FormField label="Sort" description="Applies to this view">
        <Select size="small" defaultValue="name">
          <option value="name">Name</option>
          <option value="size">Size</option>
        </Select>
      </FormField>,
    )
    expect(markup).toContain('<select id="mtc-field-')
    expect(markup).toContain('class="mtc-input mtc-select-control" data-size="small"')
    expect(markup).toMatch(/aria-describedby="mtc-field-[^"]+-description"/)
    expect(markup).toContain('mtc-select-icon')
    expect(html(<Select aria-label="Sort" invalid><option>Name</option></Select>)).toContain('aria-invalid="true"')
  })

  it('embeds a rail in a host sidebar', () => {
    const sections = [{ id: 'main', items: [{ id: 'home', label: 'Home', href: '#/' }] }]
    expect(html(<NavRail label="Views" variant="embedded" sections={sections} />)).toContain('data-variant="embedded"')
    expect(html(<NavRail label="Views" sections={sections} />)).not.toContain('data-variant')
  })

  it('lets a host resolve Markdown links and images before rendering', async () => {
    const rendered = await renderMarkdown('[Guide](docs/guide.md) ![Logo](logo.png)', {
      resolveHref: href => `/repo/blob/main/${href}`,
      resolveImage: src => `/repo/raw/main/${src}`,
    })
    expect(rendered).toContain('href="/repo/blob/main/docs/guide.md"')
    expect(rendered).toContain('src="/repo/raw/main/logo.png"')
    expect(await renderMarkdown('[Guide](docs/guide.md)')).toContain('href="docs/guide.md"')
  })
})
