import { describe, expect, it } from 'vitest'
import { MAX_HIGHLIGHT_LINE, codeLanguage, tokenizeLine, type CodeToken } from '../files/codeTokens'

const kinds = (tokens: CodeToken[]) => tokens.filter(token => token.kind !== 'plain').map(token => [token.kind, token.text])

describe('code tokens', () => {
  it('names languages by name, alias or extension', () => {
    expect(codeLanguage('JSON')).toBe('json')
    expect(codeLanguage('.yml')).toBe('yaml')
    expect(codeLanguage('PostgreSQL')).toBe('sql')
    expect(codeLanguage('TypeScript')).toBeNull()
    expect(codeLanguage()).toBeNull()
  })

  it('tells JSON keys from string values and marks numbers and literals', () => {
    expect(kinds(tokenizeLine('  "horizon_days": 90, "label": "Q3 \\"plan\\"", "live": true, "note": null', 'json'))).toEqual([
      ['key', '"horizon_days"'],
      ['number', '90'],
      ['key', '"label"'],
      ['string', '"Q3 \\"plan\\""'],
      ['key', '"live"'],
      ['literal', 'true'],
      ['key', '"note"'],
      ['literal', 'null'],
    ])
  })

  it('reads YAML keys, list items, scalars and comments', () => {
    expect(kinds(tokenizeLine('  - warehouse: lake # primary', 'yaml'))).toEqual([['key', 'warehouse'], ['comment', '# primary']])
    expect(kinds(tokenizeLine('retries: 3', 'yaml'))).toEqual([['key', 'retries'], ['number', '3']])
    expect(kinds(tokenizeLine('owner: ~', 'yaml'))).toEqual([['key', 'owner'], ['literal', '~']])
    expect(kinds(tokenizeLine("schedule: '0 4 * * *'", 'yaml'))).toEqual([['key', 'schedule'], ['string', "'0 4 * * *'"]])
    // A version is not a number, and a URL's colon is not a key.
    expect(kinds(tokenizeLine('version: 1.2.3', 'yaml'))).toEqual([['key', 'version']])
    expect(kinds(tokenizeLine('url: https://example.com/a', 'yaml'))).toEqual([['key', 'url']])
  })

  it('marks SQL keywords, strings, quoted identifiers, numbers and comments', () => {
    expect(kinds(tokenizeLine(`SELECT "id", amount FROM orders WHERE status = 'it''s' AND total > 10.5 -- open`, 'sql'))).toEqual([
      ['keyword', 'SELECT'],
      ['key', '"id"'],
      ['keyword', 'FROM'],
      ['keyword', 'WHERE'],
      ['string', "'it''s'"],
      ['keyword', 'AND'],
      ['number', '10.5'],
      ['comment', '-- open'],
    ])
    expect(kinds(tokenizeLine('where col1 is null', 'sql'))).toEqual([['keyword', 'where'], ['keyword', 'is'], ['literal', 'null']])
  })

  it('keeps the text intact and leaves very long lines plain', () => {
    const line = `{"a": [1, 2, {"b": "c"}], "d": false}`
    expect(tokenizeLine(line, 'json').map(token => token.text).join('')).toBe(line)
    const long = `"k": "${'x'.repeat(MAX_HIGHLIGHT_LINE)}"`
    expect(tokenizeLine(long, 'json')).toEqual([{ kind: 'plain', text: long }])
  })
})
