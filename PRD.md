# PRD — Iteration 36: Radar Chart

PRD wiped between iterations.

## Goal

Multi-metric comparison radar (a.k.a. spider chart). The natural
shape for "compare these N things across M metrics at a glance":

- Strategies on Sharpe / DD / Vol / IC / Hit-rate
- Assets on factor exposures (size / value / momentum / quality)
- Models on accuracy / precision / recall / F1 / latency
- Bots on PnL / win-rate / drawdown / latency / fills

Common quant viz; Recharts has it built-in.

## Scope

In:
- `src/widgets/Radar.tsx` accepting either:
  - `[{metric, A: 0.8, B: 0.6}]` — wide form, multi-series
  - `{ metrics: [...], series: [{name, values: [...]}] }` — long form
- Single series renders one filled polygon; multi-series overlays
  each.
- Register, default height, story.

Out:
- Auto-normalisation of metrics with different scales. Authors
  pre-normalise their data; making this widget re-scale would be
  domain-specific opinion (do you normalize by max? by 95th%? by
  z-score?).
- Per-axis grid labels. Polar axes are notoriously hard to label
  cleanly; Recharts' default is good enough.

## Decisions

### Wide form for one row of values, long form for explicit series

Wide form is the table-like "one row per metric, one column per
entity" — easy to author, easy for backends. Long form is for
cases where you have computed series objects already.

### Same color palette as Timeseries

Six-color rotation, matches the rest of the framework.

## Open Questions

(answered)

1. **Domain max for the radial axis?** → Resolved: auto-detect
   from data. Authors can pre-clip if they want fixed scales.
2. **Show numeric values on points?** → Resolved: no; tooltip
   shows them on hover. The chart should read at a glance.

## Done When

- `pnpm lint && pnpm test && pnpm build` clean.
- Storybook story shows a 4-strategy × 5-metric radar.
