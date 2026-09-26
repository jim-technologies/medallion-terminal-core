import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

type Theme = Record<string, string>

function block(selector: string): string {
  const selectorAt = css.indexOf(selector)
  if (selectorAt < 0) throw new Error(`Missing theme selector: ${selector}`)
  const start = css.indexOf('{', selectorAt)
  if (start < 0) throw new Error(`Missing block for: ${selector}`)

  let depth = 0
  for (let index = start; index < css.length; index++) {
    if (css[index] === '{') depth++
    if (css[index] === '}') {
      depth--
      if (depth === 0) return css.slice(start + 1, index)
    }
  }
  throw new Error(`Unclosed block for: ${selector}`)
}

/** Custom-property declarations, keeping `var(--mtc-x)` references. */
function declarations(source: string): Theme {
  return Object.fromEntries(
    [...source.matchAll(/--mtc-([a-z0-9-]+):\s*([^;]+);/gi)]
      .map(match => [match[1], match[2].trim().toLowerCase()]),
  )
}

/** Resolves `var(--mtc-x)` chains to the hex value they end at. */
function resolve(theme: Theme, name: string, seen = new Set<string>()): string {
  const value = theme[name]
  if (value === undefined) throw new Error(`--mtc-${name} is not declared`)
  const reference = value.match(/^var\(--mtc-([a-z0-9-]+)\)$/)
  if (!reference) return value
  if (seen.has(name)) throw new Error(`--mtc-${name} is circular`)
  seen.add(name)
  return resolve(theme, reference[1], seen)
}

function hex(theme: Theme, name: string): string {
  const value = resolve(theme, name)
  if (!/^#[0-9a-f]{6}$/.test(value)) throw new Error(`--mtc-${name} is not a six-digit hex colour: ${value}`)
  return value
}

function channel(value: number): number {
  const normalized = value / 255
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(color: string): number {
  const [red, green, blue] = color.match(/[0-9a-f]{2}/gi)!.map(value => parseInt(value, 16))
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

function contrast(left: string, right: string): number {
  const a = luminance(left)
  const b = luminance(right)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const base = declarations(block('.mtc-root {'))
const themes = {
  dark: base,
  operator: { ...base, ...declarations(block('.mtc-root[data-theme="operator"]')) },
  light: { ...base, ...declarations(block('.mtc-root[data-theme="light"]')) },
  highContrast: { ...base, ...declarations(block('.mtc-root[data-theme="high-contrast"]')) },
}

/** Text roles that must read at 4.5:1 wherever text can sit. */
const readableText = [
  'fg',
  'fg-soft',
  'muted',
  'muted-strong',
  'accent',
  'accent-soft',
  'link',
  'ok',
  'ok-soft',
  'warning',
  'warning-soft',
  'danger',
  'danger-soft',
  'info',
  'info-soft',
]

/** Every surface text can sit on, including a selected row. */
const textSurfaces = ['bg', 'surface', 'panel', 'selection']

const typeSlots = [
  'azure', 'cyan', 'teal', 'green', 'lime', 'olive',
  'amber', 'orange', 'red', 'rose', 'magenta', 'violet',
]

describe('theme color accessibility', () => {
  for (const [themeName, theme] of Object.entries(themes)) {
    it(`${themeName} keeps readable semantic text on every text surface`, () => {
      for (const foreground of readableText) {
        for (const background of textSurfaces) {
          expect(
            contrast(hex(theme, foreground), hex(theme, background)),
            `${themeName} --mtc-${foreground} on --mtc-${background}`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      }
    })

    it(`${themeName} keeps non-essential metadata visibly distinct`, () => {
      for (const background of textSurfaces) {
        expect(
          contrast(hex(theme, 'muted-subtle'), hex(theme, background)),
          `${themeName} --mtc-muted-subtle on --mtc-${background}`,
        ).toBeGreaterThanOrEqual(3)
      }
    })

    it(`${themeName} keeps status text readable on its own tint`, () => {
      for (const status of ['ok', 'warning', 'danger', 'info']) {
        expect(
          contrast(hex(theme, `${status}-soft`), hex(theme, `${status}-bg`)),
          `${themeName} --mtc-${status}-soft on --mtc-${status}-bg`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    })

    it(`${themeName} keeps text on solid accent fills readable`, () => {
      expect(
        contrast(hex(theme, 'on-accent'), hex(theme, 'accent-strong')),
        `${themeName} --mtc-on-accent on --mtc-accent-strong`,
      ).toBeGreaterThanOrEqual(4.5)
    })

    it(`${themeName} keeps text over a media scrim readable on any image`, () => {
      // The badge scrim is black at 70%; over the brightest image (white) it
      // composites to #4d4d4d, the worst case the text can sit on.
      expect(
        contrast(hex(theme, 'on-scrim'), '#4d4d4d'),
        `${themeName} --mtc-on-scrim on a 70% black scrim over white`,
      ).toBeGreaterThanOrEqual(4.5)
    })

    it(`${themeName} keeps control boundaries and graph edges visible`, () => {
      for (const role of ['border-control', 'graph-edge', 'accent-strong']) {
        for (const background of ['bg', 'surface']) {
          expect(
            contrast(hex(theme, role), hex(theme, background)),
            `${themeName} --mtc-${role} on --mtc-${background}`,
          ).toBeGreaterThanOrEqual(3)
        }
      }
    })

    it(`${themeName} keeps every type identity slot readable on its chip`, () => {
      for (const slot of typeSlots) {
        expect(
          contrast(hex(theme, `type-${slot}-fg`), hex(theme, `type-${slot}-bg`)),
          `${themeName} --mtc-type-${slot}-fg on --mtc-type-${slot}-bg`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    })

    it(`${themeName} keeps categorical chart colors distinct from the surface`, () => {
      for (let index = 1; index <= 8; index++) {
        expect(
          contrast(hex(theme, `chart-${index}`), hex(theme, 'surface')),
          `${themeName} --mtc-chart-${index} on --mtc-surface`,
        ).toBeGreaterThanOrEqual(3)
      }
    })

    it(`${themeName} keeps code tokens readable on the surface`, () => {
      for (const role of ['code-key', 'code-string', 'code-number', 'code-literal']) {
        expect(
          contrast(hex(theme, role), hex(theme, 'surface')),
          `${themeName} --mtc-${role} on --mtc-surface`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    })
  }
})

describe('canvas-library fallbacks', () => {
  const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

  it('Candlestick falls back to the dark theme values of its roles', () => {
    const candlestick = source('../widgets/Candlestick.tsx')
    const start = candlestick.indexOf('const FALLBACK_THEME_COLORS')
    const fallback = candlestick.slice(start, candlestick.indexOf('}', start))
    const roles: Record<string, string> = {
      accent: 'accent',
      danger: 'danger',
      ok: 'ok',
      warning: 'warning',
      muted: 'muted',
      mutedSubtle: 'muted-subtle',
      border: 'border',
      grid: 'grid',
    }
    const entries = [...fallback.matchAll(/(\w+): '(#[0-9a-f]{6})'/g)]
    expect(entries.length).toBe(Object.keys(roles).length)
    for (const [, key, value] of entries) {
      expect(value, `Candlestick fallback ${key}`).toBe(hex(themes.dark, roles[key]))
    }
  })

  it('GeoMap falls back to the dark theme value of each token it reads', () => {
    const entries = [...source('../widgets/GeoMap.tsx').matchAll(/value\('--mtc-([a-z0-9-]+)', '(#[0-9a-f]{6})'\)/g)]
    expect(entries.length).toBeGreaterThan(0)
    for (const [, name, value] of entries) {
      expect(value, `GeoMap fallback --mtc-${name}`).toBe(hex(themes.dark, name))
    }
  })
})
