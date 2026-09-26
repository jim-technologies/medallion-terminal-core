import { describe, expect, it } from 'vitest'
import { violations } from '../../scripts/style-token-rules.mjs'

const rulesOf = (relative: string, text: string) => violations(relative, text).map(found => `${found.rule}:${found.text}`)

describe('style-token rules: type sizes', () => {
  it('rejects CSS font sizes under 11 px, in px, rem and the font shorthand', () => {
    const css = [
      '.a { font-size: 9px; }',
      '.b { font-size: .625rem; }',
      '.c { font: 500 10px/14px Inter, sans-serif; }',
      '.d{font-size:10.5px}',
    ].join('\n')
    expect(rulesOf('examples/readiness/sample.css', css)).toEqual([
      'font-size-css:font-size: 9px',
      'font-size-css:font-size: .625rem',
      'font-size-css:font: 500 10px',
      'font-size-css:font-size:10.5px',
    ])
  })

  it('rejects inline and SVG font sizes under 11 px, where a bare number is px', () => {
    const tsx = [
      "const style = { fontSize: 10, other: { fontSize: '9px' }, small: { fontSize: '0.6rem' } }",
      '<text fontSize={10}>a</text><text fontSize="8">b</text>',
    ].join('\n')
    expect(rulesOf('src/widgets/Sample.tsx', tsx)).toEqual([
      'font-size-css:fontSize: 10',
      "font-size-css:fontSize: '9px",
      "font-size-css:fontSize: '0.6rem",
      'font-size-css:fontSize={10',
      'font-size-css:fontSize="8',
    ])
  })

  it('accepts sizes on or above the floor, tokens and relative units', () => {
    const ok = [
      '.a { font-size: 11px; font: 600 12px/16px Inter; }',
      '.b { font-size: 0.75rem; font-size: 0.9em; font-size: 80%; }',
      '.c { font-size: var(--mtc-font-size-xs); font: inherit; }',
      "const style = { fontSize: 11, big: { fontSize: '1.2em' }, token: { fontSize: 'var(--mtc-font-size-sm)' } }",
      '<text fontSize={12}>c</text>',
    ].join('\n')
    expect(rulesOf('src/widgets/Sample.tsx', ok)).toEqual([])
  })

  it('rejects Tailwind sizes under 11 px or off the scale, in px or rem', () => {
    expect(rulesOf('src/widgets/Sample.tsx', "const c = 'text-[10px] text-[0.6rem] text-[15px] text-[12px] text-[0.75rem]'"))
      .toEqual(['font-size:text-[10px]', 'font-size:text-[0.6rem]', 'font-size:text-[15px]'])
  })

  it('checks stories only for their frame background', () => {
    expect(rulesOf('src/widgets/Sample.stories.tsx', "const s = { fontSize: 9, background: '#fff' }"))
      .toEqual(["story-frame:background: '#fff'"])
  })

  it('holds the page templates to the 11 px floor and sentence-case labels', () => {
    const tsx = [
      '<p className="text-[9px] uppercase">Owner</p>',
      "<span style={{ fontSize: 10, letterSpacing: '0.08em' }} className=\"tracking-wider\">Kind</span>",
      "const frame = { background: 'white' }",
    ].join('\n')
    expect(rulesOf('src/templates/Pages.stories.tsx', tsx)).toEqual([
      'font-size:text-[9px]',
      'micro-label:uppercase',
      'font-size-css:fontSize: 10',
      'micro-label:tracking-wider',
      "story-frame:background: 'white'",
    ])
    expect(rulesOf('src/templates/Pages.stories.tsx', '<p className="text-[length:var(--mtc-font-size-xs)]">Owner</p>')).toEqual([])
  })
})
