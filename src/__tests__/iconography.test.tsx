import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ICON_NAMES, Icon } from '../components/Icon'
import { TYPE_COLORS, TypeGlyph, typeColorFor } from '../components/TypeGlyph'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

describe('icon set', () => {
  it('names every glyph once and renders each as a non-empty stroke path', () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length)
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(90)
    for (const name of ICON_NAMES) {
      const html = renderToStaticMarkup(<Icon name={name} />)
      expect(html, name).toMatch(/<path d="[Mm][^"]{2,}"/)
      expect(html, name).toContain('aria-hidden="true"')
    }
  })

  it('uses 1.75-unit strokes unless the caller overrides them', () => {
    expect(renderToStaticMarkup(<Icon name="person" />)).toContain('stroke-width="1.75"')
    expect(renderToStaticMarkup(<Icon name="person" strokeWidth={2} />)).toContain('stroke-width="2"')
  })

  it('names labelled icons for assistive technology', () => {
    const html = renderToStaticMarkup(<Icon name="lock" label="Restricted" />)
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Restricted"')
  })
})

describe('type glyphs', () => {
  it('assigns a stable identity slot from the type id', () => {
    expect(typeColorFor('customer')).toBe(typeColorFor('customer'))
    expect(TYPE_COLORS).toContain(typeColorFor('customer'))
    const slots = new Set(['customer', 'person', 'contract', 'order', 'shipment', 'dataset', 'invoice', 'ticket']
      .map(typeColorFor))
    expect(slots.size).toBeGreaterThan(3)
  })

  it('has a style rule for every identity slot', () => {
    for (const color of TYPE_COLORS.filter(slot => slot !== 'azure')) {
      expect(css, color).toContain(`.mtc-type-glyph[data-color="${color}"] { --mtc-glyph-fg: var(--mtc-type-${color}-fg); --mtc-glyph-bg: var(--mtc-type-${color}-bg); }`)
    }
  })

  it('is decorative beside a visible name and labelled when standalone', () => {
    const decorative = renderToStaticMarkup(<TypeGlyph color="teal" icon="building" />)
    expect(decorative).toContain('aria-hidden="true"')
    expect(decorative).toContain('data-size="20"')
    const labelled = renderToStaticMarkup(<TypeGlyph color="teal" icon="building" size={40} label="Customer" />)
    expect(labelled).toContain('role="img"')
    expect(labelled).toContain('aria-label="Customer"')
    expect(labelled).toContain('width="22"')
  })
})
