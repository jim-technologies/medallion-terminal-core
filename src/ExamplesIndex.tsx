// Landing page that lists the bundled examples as clickable cards.
// Loaded by App.tsx when neither ?template nor ?tabs is present.

interface Example {
  path: string
  title: string
  blurb: string
  tags: string[]
}

const EXAMPLES: Example[] = [
  {
    path: '/examples/medallion-terminal.json',
    title: 'Medallion Terminal',
    blurb: 'Showcase: tick-flash watchlist, OrderBook → Trade via ctx.price/side, per-dashboard 1/2/3 shortcuts, live action log, compound alert predicate.',
    tags: ['finance', 'showcase'],
  },
  {
    path: '/examples/file-browser.json',
    title: 'File Browser',
    blurb: 'Object-store front: drag-drop upload, breadcrumb nav, inline video/audio/image/PDF preview. Range-supporting /media endpoint backs the <video> scrub bar.',
    tags: ['files', 'demo'],
  },
  {
    path: '/examples/crypto-watch.json',
    title: 'Crypto Watch',
    blurb: 'AI summary, candles, peers (click-to-jump), sentiment gauge, and news in a compact market view.',
    tags: ['finance', 'ai'],
  },
  {
    path: '/examples/trading-floor.json',
    title: 'Trading Floor',
    blurb: 'Dense multi-asset desk: 6-up metric strip, candles + correlation heatmap, depth, allocation, tape, positions.',
    tags: ['finance', 'terminal'],
  },
  {
    path: '/examples/spot-market.json',
    title: 'Spot Market',
    blurb: 'Full read + act spot trading UI: stat strip, annotated candles, order book, order ticket (with confirm), watchlist with heat cells.',
    tags: ['finance', 'spot', 'trade'],
  },
  {
    path: '/examples/liquidity-pool.json',
    title: 'Liquidity Pool',
    blurb: 'Pool analytics + swap: TVL / volume / APR, price chart, swap ticket, composition, fee tier picker, recent swaps.',
    tags: ['finance', 'liquidity', 'trade'],
  },
  {
    path: '/examples/options-desk.json',
    title: 'Options Desk',
    blurb: 'BTC options: ATM IV / skew metrics, annotated candles, order book, full chain with greeks, cross-venue best bid/ask, fills.',
    tags: ['finance', 'options'],
  },
  {
    path: '/examples/prediction-market.json',
    title: 'Prediction Market',
    blurb: 'Binary event market: probability gauge, order book share donut, implied probability over time, top of book, trades.',
    tags: ['finance', 'prediction'],
  },
  {
    path: '/examples/service-ops.json',
    title: 'Service Ops',
    blurb: 'Service observability: latency p50/p95/p99, error budget gauge, queue depth, region heatmap, latency histogram + boxplot, incident log.',
    tags: ['ops', 'monitoring'],
  },
  {
    path: '/examples/audit-trail.json',
    title: 'Audit Trail',
    blurb: 'Audit workflow view: actor/action/resource table with before/after summaries, evidence links, and review queue metrics.',
    tags: ['audit', 'security', 'workflow'],
  },
  {
    path: '/examples/workflow-orchestrator.json',
    title: 'Workflow Orchestrator',
    blurb: 'Workflow operations: active runs, task queue depth, asset × date partition heatmap, freshness, duration boxplot, run history.',
    tags: ['ops', 'workflows'],
  },
  {
    path: '/examples/bot-operator.json',
    title: 'Bot Operator',
    blurb: 'Trading bot ops: PnL strip, equity curve, treemap allocation, returns histogram, strategy radar + boxplot, cron health, fleet gauge, sizing.',
    tags: ['finance', 'bot', 'ops'],
  },
  {
    path: '/examples/sports-betting.json',
    title: 'Sports Book',
    blurb: 'NBA spread ladder + Kelly sizing demo. Custom widget plugged in via registerWidget. Reads live odds from a paired_grid source.',
    tags: ['sports', 'betting', 'kelly', 'custom-widget'],
  },
  {
    path: '/examples/ml-monitoring.json',
    title: 'ML Monitoring',
    blurb: 'Production model dashboard: accuracy/precision/recall strip, drift over time, confusion matrix, latency histogram, PR curve, lifecycle events.',
    tags: ['ai', 'ml', 'ops'],
  },
  {
    path: '/examples/logistics-ops.json',
    title: 'Logistics',
    blurb: 'Supply-chain control room: KPIs, origin × destination heatmap, category treemap, hub throughput, exceptions, active shipments table.',
    tags: ['logistics', 'ops'],
  },
  {
    path: '/examples/clinical-icu.json',
    title: 'Clinical ICU',
    blurb: 'Bedside monitoring: HR/BP/SpO2 strip, vitals timeseries, infusion gauge, alerts log, active orders table, fluid balance, notes.',
    tags: ['healthcare', 'monitoring'],
  },
  {
    path: '/examples/energy-grid.json',
    title: 'Solar Farm',
    blurb: 'Generation site dashboard: output strip, actual vs forecast, battery SoC gauge, panel array health heatmap, weather, incidents, weekly PPA.',
    tags: ['energy', 'iot'],
  },
  {
    path: '/examples/reference-backend.json',
    title: 'Reference Backend',
    blurb: 'Live demo against the bundled Node TerminalService. Streams BTC spot/candles/orderbook, options chain, fills, news, AI prompt → widget actions.',
    tags: ['live', 'backend'],
  },
]

export function ExamplesIndex() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Medallion Terminal — Examples</h1>
          <p className="text-sm text-zinc-400">
            Each card opens a dashboard built from generic widgets only.
            Append <code className="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">?template=URL</code> for any single example,
            or <code className="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">?tabs=URL1,URL2</code> for multi-tab.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLES.map(ex => (
            <a
              key={ex.path}
              href={`?template=${encodeURIComponent(ex.path)}`}
              className="block p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h2 className="text-base font-medium text-zinc-100">{ex.title}</h2>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono shrink-0">
                  {ex.path.split('/').pop()}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">{ex.blurb}</p>
              <div className="flex gap-1.5 flex-wrap">
                {ex.tags.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Open all as tabs</h3>
          <a
            href={`?tabs=${EXAMPLES.map(e => e.path).join(',')}`}
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            ?tabs={EXAMPLES.length} dashboards →
          </a>
        </div>
      </div>
    </div>
  )
}
