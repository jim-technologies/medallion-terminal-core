import { useId, useMemo, useState, type ReactNode } from 'react'
import { Button, ButtonGroup } from '../../src/components/Button'
import { FormField, Input } from '../../src/components/FormControls'
import { StatTile } from '../../src/components/StatTile'
import { useLocale } from '../../src/foundations/DesignSystemProvider'
import { formatNumber } from '../../src/foundations/intl'
import type { WidgetProps } from '../../src/types/template'
import { getNested } from '../../src/core/getNested'

// Kelly sizing widget — custom widget example.
//
// Proves the framework's extension story: this widget lives outside
// src/, consumes only public types (WidgetProps) and toolkit components
// (so it follows the theme, density and type scale like a built-in
// widget), registers via registerWidget('kelly', Kelly), and gets the same
// DataSource + ctx + options plumbing as a built-in widget.
//
// Inputs (via options OR ctx, with widget overrides):
//   - probability  : your estimated win probability (0..1)
//   - odds         : decimal odds offered by the market (>1)
//   - bankroll     : capital available to risk
//   - fraction     : 'full' | 'half' | 'quarter' Kelly
//
// Outputs (computed):
//   - stake        : recommended wager size
//   - edge_percent : (your_p − implied_p) / implied_p
//   - ev           : expected value of the bet
//   - growth_rate  : log-growth rate of bankroll under repeated bets
//
// Optionally surfaces a data source (`data` from useDataSource) — lets
// the widget react to live odds streams. The PairedGrid demo wires
// this by passing the active-line odds into the widget's options.

type Fraction = 'full' | 'half' | 'quarter'

const FRACTION_MULTIPLIER: Record<Fraction, number> = {
  full: 1,
  half: 0.5,
  quarter: 0.25,
}

interface KellyOptions {
  probability?: number
  odds?: number
  bankroll?: number
  fraction?: Fraction
  // Optional dot-path to extract odds from a `source` payload, e.g.
  // "rows.0.left.values.odds" for a paired_grid first-row left side.
  odds_path?: string
}

export function kellyStake(args: {
  probability: number
  odds: number
  bankroll: number
  fraction: Fraction
}): { stake: number; edgePercent: number; ev: number; growthRate: number; kellyFraction: number } {
  const { probability: p, odds, bankroll, fraction } = args
  const b = odds - 1                  // net odds
  const q = 1 - p
  const fStar = (b * p - q) / b       // unbounded Kelly fraction
  const fAdj = Math.max(0, fStar) * FRACTION_MULTIPLIER[fraction]
  const stake = bankroll * fAdj
  const impliedP = 1 / odds
  const edgePercent = impliedP > 0 ? (p - impliedP) / impliedP : 0
  // `0 * negative = -0` in JS; normalize so the UI shows "0" not "-0".
  const ev = stake > 0 ? stake * (p * b - q) : 0
  // Long-run log growth rate at the chosen fraction.
  const growthRate = fAdj > 0
    ? p * Math.log(1 + b * fAdj) + q * Math.log(1 - fAdj)
    : 0
  return { stake, edgePercent, ev, growthRate, kellyFraction: fStar }
}

export function Kelly({ data, options }: WidgetProps) {
  const opts = (options ?? {}) as KellyOptions
  const { locale } = useLocale()
  const fractionLabel = useId()

  const [probability, setProbability] = useState(opts.probability ?? 0.55)
  const [bankroll, setBankroll] = useState(opts.bankroll ?? 10_000)
  const [fraction, setFraction] = useState<Fraction>(opts.fraction ?? 'half')
  // User-typed odds when no source path is bound. Ignored when
  // `odds_path` is set (in that case the source payload is truth).
  const [manualOdds, setManualOdds] = useState(opts.odds ?? 2)

  // Live odds: source payload at odds_path wins; otherwise the user's
  // manual entry. Tracked as state so manual edits actually re-render.
  const liveOdds = useMemo(() => {
    if (data && opts.odds_path) {
      const v = getNested(data, opts.odds_path)
      if (typeof v === 'number' && v > 1) return v
    }
    return manualOdds
  }, [data, opts.odds_path, manualOdds])

  const result = useMemo(
    () => kellyStake({ probability, odds: liveOdds, bankroll, fraction }),
    [probability, liveOdds, bankroll, fraction],
  )

  const percent = (value: number, digits = 1) => formatNumber(value, { locale, style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits })
  const signed = (value: number) => `${value > 0 ? '+' : ''}${formatNumber(value, { locale, minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const sign = (value: number) => (value > 0 ? 'ok' : value < 0 ? 'danger' : undefined)

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <FormField label="Your probability">
          <Input
            type="number" size="small" step={0.01} min={0} max={1}
            value={probability}
            onChange={e => setProbability(clamp(Number(e.target.value), 0, 1))}
            className="text-right tabular-nums"
          />
        </FormField>
        <FormField label="Decimal odds">
          <Input
            type="number" size="small" step={0.01} min={1.01}
            value={opts.odds_path ? liveOdds.toFixed(2) : manualOdds}
            readOnly={!!opts.odds_path}
            onChange={e => {
              if (opts.odds_path) return
              setManualOdds(Math.max(1.01, Number(e.target.value)))
            }}
            className="text-right tabular-nums"
          />
        </FormField>
        <FormField label="Bankroll">
          <Input
            type="number" size="small" step={100} min={0}
            value={bankroll}
            onChange={e => setBankroll(Math.max(0, Number(e.target.value)))}
            className="text-right tabular-nums"
          />
        </FormField>
        <div className="grid gap-1">
          <span className="mtc-form-label" id={fractionLabel}>Fraction</span>
          <ButtonGroup aria-labelledby={fractionLabel}>
            {(['full', 'half', 'quarter'] as const).map(f => (
              <Button
                key={f}
                size="small"
                aria-pressed={fraction === f}
                intent={fraction === f ? 'primary' : 'neutral'}
                variant={fraction === f ? 'solid' : 'outline'}
                onClick={() => setFraction(f)}
                aria-label={`${f} Kelly`}
              >
                {f === 'full' ? '1×' : f === 'half' ? '½' : '¼'}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      <dl className="grid gap-1 border-t border-[color:var(--mtc-border)] pt-2 tabular-nums">
        <Out label="Edge" tone={sign(result.edgePercent)}>{percent(result.edgePercent)}</Out>
        <Out label="Expected value" tone={sign(result.ev)}>{signed(result.ev)}</Out>
        <Out label="Kelly fraction">{percent(result.kellyFraction)}</Out>
        <Out label="Growth per bet">{percent(result.growthRate, 2)}</Out>
      </dl>

      <StatTile
        className="mt-auto"
        label="Stake"
        value={result.stake > 0 ? formatNumber(result.stake, { locale, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        description={result.stake > 0 ? undefined : 'No edge at these odds'}
      />
    </div>
  )
}

function Out({ label, tone, children }: { label: string; tone?: 'ok' | 'danger'; children: ReactNode }) {
  const color = tone === 'ok' ? 'text-[color:var(--mtc-ok)]' : tone === 'danger' ? 'text-[color:var(--mtc-danger)]' : 'text-[color:var(--mtc-fg)]'
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-[color:var(--mtc-muted)]">{label}</dt>
      <dd className={color}>{children}</dd>
    </div>
  )
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}
