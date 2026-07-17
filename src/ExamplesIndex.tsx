// Landing page that lists the bundled examples as clickable cards.
// Loaded by App.tsx when neither ?template nor ?tabs is present.

interface Example {
  path: string
  title: string
  blurb: string
  tags: string[]
  featured?: boolean
}

const EXAMPLES: Example[] = [
  {
    path: '/examples/business-operations.json',
    title: 'Business Operations',
    blurb: 'Owner-focused command center for revenue, cash runway, sales pipeline, capacity, customer health, and the decisions that need attention now.',
    tags: ['business', 'finance', 'sales', 'operations'],
    featured: true,
  },
  {
    path: '/examples/platform-foundation.json',
    title: 'Data & Ontology Platform',
    blurb: 'Governed discovery, semantic objects, lineage, operational geography, schema-driven actions, and ref-aware source browsing.',
    tags: ['catalog', 'ontology', 'lineage', 'map', 'code'],
    featured: true,
  },
  {
    path: '/examples/work-management.json',
    title: 'Work Management',
    blurb: 'Typed records with linked values, saved grid/board/calendar views, context-driven forms, inline editing, and revision-safe governed writes.',
    tags: ['records', 'workflow', 'crm', 'projects'],
    featured: true,
  },
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
    blurb: 'Full read + act spot trading UI: stats, annotated candles, ladder and cumulative depth, order ticket, open orders, and watchlist.',
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
    blurb: 'Binary event market: probability, liquidity share, price history, cumulative depth, top of book, live trades, and order entry.',
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
    blurb: 'Supply-chain control room: network map, KPIs, lane heatmap, category treemap, throughput, exceptions, and active shipments.',
    tags: ['logistics', 'ops', 'map'],
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
    <div className="mtc-workspace min-h-screen text-zinc-100">
      <header className="mtc-toolbar px-6 md:px-10 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="grid grid-cols-2 gap-0.5 w-5 h-5 p-1 border border-zinc-700 rounded-sm" aria-hidden="true">
              <span className="bg-sky-400 rounded-sm" />
              <span className="bg-zinc-600 rounded-sm" />
              <span className="bg-zinc-600 rounded-sm" />
              <span className="bg-zinc-400 rounded-sm" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">Medallion</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">Operating intelligence</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10">
        <section className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] gap-8 items-center border-b border-zinc-800">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-sky-400 mb-3">Built for owners and operators</div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 max-w-3xl">
              See the whole business. Act from one place.
            </h1>
            <p className="mt-4 text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
              A composable operating layer for growing businesses—connecting finance, sales, customers, delivery, data, and the decisions behind them.
            </p>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <a
                href="?template=%2Fexamples%2Fbusiness-operations.json"
                className="mtc-control px-4 py-2 text-xs font-medium text-zinc-100 border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20"
              >
                Open business workspace →
              </a>
              <a
                href="?template=%2Fexamples%2Fplatform-foundation.json&backend=http%3A%2F%2Flocalhost%3A3001"
                className="mtc-control px-4 py-2 text-xs text-zinc-400 hover:text-zinc-100"
              >
                Explore platform foundation
              </a>
            </div>
          </div>

          <div className="mtc-landing-card p-5">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-4">One operating model</div>
            <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded overflow-hidden">
              {[
                ['Business pulse', 'Cash, margin, pipeline'],
                ['Shared records', 'Customer, order, project'],
                ['Governed actions', 'Decide, assign, approve'],
                ['Data foundation', 'Catalog, lineage, code'],
              ].map(([title, detail]) => (
                <div key={title} className="bg-zinc-900 p-3 min-h-[78px]">
                  <div className="text-xs font-medium text-zinc-200">{title}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-1">Reference workspaces</div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Built from the same primitives</h2>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">{EXAMPLES.length} examples</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAMPLES.map(ex => (
              <a
                key={ex.path}
                href={`?template=${encodeURIComponent(ex.path)}`}
                className={`mtc-landing-card block p-4 ${ex.featured ? 'border-sky-500/30' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-zinc-100">{ex.title}</h3>
                  {ex.featured && (
                    <span className="text-[8px] uppercase tracking-[0.14em] text-sky-400 shrink-0">Foundation</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 min-h-[3.9rem]">{ex.blurb}</p>
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

          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-zinc-500">
              Developer utility: open the complete gallery while preserving tab state.
            </p>
            <a href={`?tabs=${EXAMPLES.map(e => e.path).join(',')}`} className="text-xs text-sky-400 hover:text-sky-300">
              Open all {EXAMPLES.length} workspaces →
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
