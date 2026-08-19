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

function tokens(source: string): Theme {
  return Object.fromEntries(
    [...source.matchAll(/--mtc-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)]
      .map(match => [match[1], match[2].toLowerCase()]),
  )
}

function channel(value: number): number {
  const normalized = value / 255
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const [red, green, blue] = hex.match(/[0-9a-f]{2}/gi)!.map(value => parseInt(value, 16))
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

function contrast(left: string, right: string): number {
  const a = luminance(left)
  const b = luminance(right)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const base = tokens(block('.mtc-root {'))
const themes = {
  dark: base,
  operator: { ...base, ...tokens(block('.mtc-root[data-theme="operator"]')) },
  light: { ...base, ...tokens(block('.mtc-root[data-theme="light"]')) },
  highContrast: { ...base, ...tokens(block('.mtc-root[data-theme="high-contrast"]')) },
}

const readableText = [
  'fg',
  'fg-soft',
  'muted',
  'muted-strong',
  'accent',
  'accent-soft',
  'ok',
  'ok-soft',
  'warning',
  'warning-soft',
  'danger',
  'danger-soft',
  'info',
  'info-soft',
]

describe('theme color accessibility', () => {
  for (const [themeName, theme] of Object.entries(themes)) {
    it(`${themeName} keeps readable semantic text on every standard surface`, () => {
      for (const foreground of readableText) {
        for (const background of ['bg', 'surface', 'panel']) {
          expect(
            contrast(theme[foreground], theme[background]),
            `${themeName} --mtc-${foreground} on --mtc-${background}`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      }
    })

    it(`${themeName} keeps non-essential metadata visibly distinct`, () => {
      for (const background of ['bg', 'surface', 'panel']) {
        expect(
          contrast(theme['muted-subtle'], theme[background]),
          `${themeName} --mtc-muted-subtle on --mtc-${background}`,
        ).toBeGreaterThanOrEqual(3)
      }
    })
  }
})
