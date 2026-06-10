import { describe, it, expect } from 'vitest'
import { normalize, safeUrl } from '../widgets/textNormalize'

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
  it('trims and accepts http(s) only', () => {
    expect(safeUrl(' https://espn.com/a ')).toBe('https://espn.com/a')
    expect(safeUrl('ftp://espn.com/a')).toBeUndefined()
    expect(safeUrl(null)).toBeUndefined()
  })
})
