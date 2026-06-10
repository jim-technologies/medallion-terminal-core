import { describe, it, expect } from 'vitest'
import { assignSeriesColors, brandSeriesColor, PALETTE } from '../widgets/colors'

describe('brandSeriesColor', () => {
  it('maps AI-model series names to brand colors', () => {
    expect(brandSeriesColor('Claude Opus 4.8')).toBe('#d97757')
    expect(brandSeriesColor('ChatGPT 5.5 Thinking')).toBe('#10a37f')
    expect(brandSeriesColor('Gemini 3.5 Thinking')).toBe('#4285f4')
    expect(brandSeriesColor('Grok Heavy')).toBe('#fafafa')
    expect(brandSeriesColor('Market')).toBe('#38bdf8')
    expect(brandSeriesColor('Elo baseline')).toBe('#71717a')
  })

  it('returns null for non-brand names (teams, outcomes)', () => {
    expect(brandSeriesColor('Mexico')).toBeNull()
    expect(brandSeriesColor('Draw')).toBeNull()
    expect(brandSeriesColor(undefined)).toBeNull()
  })
})

describe('assignSeriesColors', () => {
  it('brands known series, palette-cycles the rest by index', () => {
    const out = assignSeriesColors(['Mexico', 'Claude Opus 4.8', 'Draw'])
    expect(out[0]).toBe(PALETTE[0])
    expect(out[1]).toBe('#d97757')
    expect(out[2]).toBe(PALETTE[2])
  })

  it('gives same-brand duplicates distinct shades', () => {
    const out = assignSeriesColors(['Claude Opus 4.8', 'Claude Fable 5'])
    expect(out[0]).toBe('#d97757')
    expect(out[1]).not.toBe('#d97757')
    expect(out[1]).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('darkens light bases for duplicates (Grok white)', () => {
    const out = assignSeriesColors(['Grok Heavy', 'Grok Fast'])
    expect(out[0]).toBe('#fafafa')
    expect(parseInt(out[1].slice(1, 3), 16)).toBeLessThan(0xfa)
  })
})
