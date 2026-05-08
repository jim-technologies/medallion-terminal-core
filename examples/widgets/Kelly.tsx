import { useMemo, useState } from 'react'
import type { WidgetProps } from '../../src/types/template'
import { getNested } from '../../src/core/getNested'

// Kelly sizing widget — domain-pack example.
//
// Proves the framework's extension story: this widget lives outside
// src/, consumes only public types (WidgetProps), registers via
// registerWidget('kelly', Kelly), and gets the same DataSource +
// ctx + options plumbing as a built-in widget.
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

  const edgeColor = result.edgePercent > 0 ? 'text-emerald-400' : 'text-red-400'
  const evColor = result.ev > 0 ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className="h-full flex flex-col gap-2 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Your P">
          <input
            type="number" step={0.01} min={0} max={1}
            value={probability}
            onChange={e => setProbability(clamp(Number(e.target.value), 0, 1))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-right text-zinc-100 tabular-nums outline-none focus:border-zinc-500"
          />
        </Field>
        <Field label="Odds (decimal)">
          <input
            type="number" step={0.01} min={1.01}
            value={opts.odds_path ? liveOdds.toFixed(2) : manualOdds}
            readOnly={!!opts.odds_path}
            onChange={e => {
              if (opts.odds_path) return
              setManualOdds(Math.max(1.01, Number(e.target.value)))
            }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-right text-zinc-100 tabular-nums outline-none focus:border-zinc-500"
          />
        </Field>
        <Field label="Bankroll">
          <input
            type="number" step={100} min={0}
            value={bankroll}
            onChange={e => setBankroll(Math.max(0, Number(e.target.value)))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-right text-zinc-100 tabular-nums outline-none focus:border-zinc-500"
          />
        </Field>
        <Field label="Fraction">
          <div className="flex gap-1 bg-zinc-800 rounded p-0.5">
            {(['full', 'half', 'quarter'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFraction(f)}
                className={`flex-1 py-0.5 text-[10px] uppercase tracking-wider rounded ${fraction === f ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                {f === 'full' ? '1×' : f === 'half' ? '½' : '¼'}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="border-t border-zinc-800 pt-2 grid grid-cols-2 gap-y-1.5 gap-x-3 font-mono tabular-nums">
        <Out label="Edge" value={`${(result.edgePercent * 100).toFixed(1)}%`} className={edgeColor} />
        <Out label="EV" value={`${result.ev >= 0 ? '+' : ''}${result.ev.toFixed(2)}`} className={evColor} />
        <Out label="Kelly f*" value={`${(result.kellyFraction * 100).toFixed(1)}%`} className="text-zinc-300" />
        <Out label="Growth/bet" value={`${(result.growthRate * 100).toFixed(2)}%`} className="text-zinc-300" />
      </div>

      <div className="mt-auto border border-zinc-700 rounded px-2 py-1.5 bg-zinc-950">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">Stake</div>
        <div className={`text-base font-mono tabular-nums ${result.stake > 0 ? 'text-zinc-100' : 'text-zinc-500'}`}>
          {result.stake > 0 ? result.stake.toFixed(2) : '—'}
          {result.stake <= 0 && <span className="text-[10px] text-zinc-500 ml-2 normal-case">no edge</span>}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">{label}</div>
      {children}
    </div>
  )
}

function Out({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className={className}>{value}</span>
    </div>
  )
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}
