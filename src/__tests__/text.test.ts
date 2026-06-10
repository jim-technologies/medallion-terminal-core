import { describe, it, expect } from 'vitest'
import { normalize, safeUrl, localDate } from '../widgets/textNormalize'

describe('Text normalization', () => {
  it('handles a plain string', () => {
    expect(normalize('hello')).toEqual([{ body: 'hello' }])
  })

  it('unwraps a TextPayload-style items array', () => {
    const items = normalize({ items: [{ title: 'A' }, { title: 'B' }] })
    expect(items.map(i => i.title)).toEqual(['A', 'B'])
  })

  it('builds meta from source/author/date', () => {
    const [item] = normalize([{ title: 'A', source: 'BBC', date: '2026-06-09' }])
    expect(item.meta).toBe('BBC · 2026-06-09')
  })

  it('keeps article urls so headlines render as links', () => {
    const [item] = normalize([
      { title: 'Mexico squad news', url: 'https://www.bbc.com/sport/football/123' },
    ])
    expect(item.url).toBe('https://www.bbc.com/sport/football/123')
  })

  it('accepts uri/link/href aliases', () => {
    expect(normalize([{ uri: 'https://a.example/x' }])[0].url).toBe('https://a.example/x')
    expect(normalize([{ link: 'https://b.example/y' }])[0].url).toBe('https://b.example/y')
    expect(normalize([{ href: 'http://c.example/z' }])[0].url).toBe('http://c.example/z')
  })

  it('drops non-web url schemes', () => {
    expect(normalize([{ title: 'x', url: 'javascript:alert(1)' }])[0].url).toBeUndefined()
    expect(normalize([{ title: 'x', url: 'data:text/html,hi' }])[0].url).toBeUndefined()
    expect(normalize([{ title: 'x', url: 42 }])[0].url).toBeUndefined()
  })
})

describe('safeUrl', () => {
  it('trims and accepts http(s)', () => {
    expect(safeUrl(' https://espn.com/a ')).toBe('https://espn.com/a')
    expect(safeUrl('ftp://espn.com/a')).toBeUndefined()
    expect(safeUrl(null)).toBeUndefined()
  })

  it('accepts root-relative internal links, rejects protocol-relative', () => {
    expect(safeUrl('/world-cup-2026/models/gpt-5')).toBe('/world-cup-2026/models/gpt-5')
    expect(safeUrl('//evil.example/x')).toBeUndefined()
    expect(safeUrl('relative/path')).toBeUndefined()
  })
})

describe('localDate', () => {
  it('converts ISO UTC timestamps to a locale string', () => {
    const out = localDate('2026-06-11T19:00:00Z')
    expect(typeof out).toBe('string')
    expect(out).not.toBe('2026-06-11T19:00:00Z')
    expect(String(out)).toMatch(/Jun/)
  })

  it('passes through non-ISO display strings', () => {
    expect(localDate('2026-06-11 19:00')).toBe('2026-06-11 19:00')
    expect(localDate('kickoff soon')).toBe('kickoff soon')
    expect(localDate(42)).toBe(42)
  })
})
