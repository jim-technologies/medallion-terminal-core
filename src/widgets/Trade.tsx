import { useState, useCallback, useEffect, useRef } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { buildSubmitActionUrl, buildActionRequest, newClientRequestId } from '../core/resolveSource'
import { useWatchAction, isTerminalStatus, isErrorStatus } from '../hooks/useWatchAction'
import { Empty } from './states'
import type { WidgetProps } from '../types/template'

type Side = 'buy' | 'sell'

interface TradeOptions {
  // Action id sent to the backend's SubmitAction RPC. Backends
  // dispatch on this. Default: "place_order". Override for swaps,
  // bets, votes, etc.
  action_id?: string
  // Non-Connect escape hatch: when backendUrl isn't set, POST the
  // raw order body to this URL instead.
  url?: string
  symbol?: string       // Defaults to ctx.symbol
  quote_unit?: string   // Display label ("BTC", "ETH", etc.)
  available?: number    // Optional balance display
  confirm?: boolean     // Show a confirm step before POST
  // Percent-of-available quick chips. Each value is a fraction
  // (0.25 → 25%); clicking fills the amount field with
  // (available * pct). No-op if `available` isn't provided.
  quick_amounts?: number[]
}

interface OrderBody {
  symbol: string
  side: Side
  amount: number
  price?: number
  type: 'market' | 'limit'
}

export function Trade({ options }: WidgetProps) {
  const opts = (options ?? {}) as TradeOptions
  const { ctx, toast, backendUrl, emit } = useDashboard()
  const symbol = opts.symbol ?? ctx.symbol ?? ''
  const fallbackUrl = opts.url
  const actionId = opts.action_id ?? 'place_order'
  // Prefer Connect (proto-driven) when the dashboard has a backend.
  // Fall back to the legacy `options.url` POST for non-Connect backends.
  const target = backendUrl ? 'connect' as const : fallbackUrl ? 'url' as const : null

  const [side, setSide] = useState<Side>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  // ctx → form sync. When another widget writes ctx.price or ctx.side
  // (e.g. an OrderBook click with price_context), pull those values
  // into the form. A ref tracks the last-seen ctx value so user typing
  // doesn't get wiped on unrelated ctx changes; we only overwrite when
  // the ctx value itself actually changed.
  const lastCtxPrice = useRef<string | undefined>(ctx.price)
  useEffect(() => {
    if (ctx.price !== lastCtxPrice.current) {
      lastCtxPrice.current = ctx.price
      if (ctx.price != null) setPrice(ctx.price)
    }
  }, [ctx.price])

  const lastCtxSide = useRef<string | undefined>(ctx.side)
  useEffect(() => {
    if (ctx.side !== lastCtxSide.current) {
      lastCtxSide.current = ctx.side
      if (ctx.side === 'buy' || ctx.side === 'sell') setSide(ctx.side)
    }
  }, [ctx.side])
  const [submitting, setSubmitting] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  // Arms WatchAction only after a non-terminal SubmitAction response.
  // Storing the client_request_id (not the backend id) lets us start
  // watching even before the response lands, but we wait for the
  // ActionResponse so we don't watch a rejected/synchronous-OK order.
  const [watchTarget, setWatchTarget] = useState<{ clientRequestId: string } | null>(null)
  const watch = useWatchAction(target === 'connect' ? backendUrl : undefined, watchTarget)

  // Show progress in the widget body (replaces previous `reply`), but
  // only toast on terminal status — intermediate PENDING/partial-fill
  // updates would otherwise spam 3-4 toasts per order.
  useEffect(() => {
    if (!watch.latest) return
    const u = watch.latest
    if (u.message) setReply(u.message)
    const terminal = isTerminalStatus(u.status)
    emit({
      type: 'action',
      actionId: u.action_id ?? actionId,
      clientRequestId: u.client_request_id ?? '',
      status: String(u.status ?? ''),
      message: u.message,
      terminal,
    })
    if (terminal) {
      if (u.message) toast(u.message, isErrorStatus(u.status) ? 'error' : 'ok')
      setWatchTarget(null)
    }
  }, [watch.latest, toast, emit, actionId])

  // Editing any field after entering confirm state must drop back to
  // the form — otherwise the confirm summary shows stale numbers.
  useEffect(() => {
    if (confirming) setConfirming(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fields, not confirming itself
  }, [amount, price, side])

  const submit = useCallback(async () => {
    if (!target || submitting) return
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      setError('Amount must be a positive number')
      return
    }
    const px = price ? Number(price) : undefined
    if (price && (!Number.isFinite(px!) || px! <= 0)) {
      setError('Price must be positive')
      return
    }

    // Two-step submit: first click moves into confirm state when opt-in.
    if (opts.confirm && !confirming) {
      setConfirming(true)
      setError(null)
      setReply(null)
      return
    }

    const orderParams: OrderBody = {
      symbol,
      side,
      amount: amt,
      type: px == null ? 'market' : 'limit',
      ...(px != null && { price: px }),
    }

    setSubmitting(true)
    setError(null)
    setReply(null)
    // One idempotency key per submit attempt — survives transient
    // network errors so a retry doesn't double-fill the order.
    const clientRequestId = newClientRequestId()
    try {
      const res = target === 'connect'
        ? await fetch(buildSubmitActionUrl(backendUrl!), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildActionRequest({ actionId, params: orderParams as unknown as Record<string, unknown>, clientRequestId })),
          })
        : await fetch(fallbackUrl!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Idempotency-Key': clientRequestId },
            body: JSON.stringify(orderParams),
          })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json().catch(() => ({}))
      // ActionResponse uses `message`; legacy backends may too.
      const msg = typeof data.message === 'string' ? data.message : 'Order submitted'
      const status = typeof data.status === 'string' ? data.status : ''
      emit({
        type: 'action',
        actionId,
        clientRequestId,
        status,
        message: msg,
        terminal: isTerminalStatus(status),
      })
      // A backend that synchronously rejects/fails the order is still
      // an HTTP 200 — the failure is in the status enum, not the
      // transport. Route it to error UI accordingly.
      if (isErrorStatus(data.status)) {
        setError(msg)
        toast(msg, 'error')
      } else {
        setReply(msg)
        toast(msg, 'ok')
        setAmount('')
        setPrice('')
        setConfirming(false)
      }
      // If the backend reported a non-terminal status, start watching
      // for the eventual outcome. Connect-only — url-mode backends
      // don't speak WatchAction.
      if (target === 'connect' && !isTerminalStatus(data.status)) {
        setWatchTarget({ clientRequestId })
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Submit failed'
      setError(msg)
      toast(msg, 'error')
      emit({
        type: 'action',
        actionId,
        clientRequestId,
        status: 'ACTION_STATUS_FAILED',
        message: msg,
        terminal: true,
      })
    } finally {
      setSubmitting(false)
    }
  }, [target, backendUrl, fallbackUrl, actionId, submitting, amount, price, symbol, side, opts.confirm, confirming, toast, emit])

  useEffect(() => {
    if (!confirming) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirming(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [confirming])

  if (!target) {
    return <Empty>Trade requires backendUrl or options.url</Empty>
  }

  const sideButtonClass = (s: Side) =>
    `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
      side === s
        ? s === 'buy'
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-red-500/20 text-red-400'
        : 'text-zinc-500 hover:text-zinc-300'
    }`

  const submitColor = side === 'buy'
    ? 'bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900'
    : 'bg-red-500/80 hover:bg-red-500 text-zinc-900'

  if (confirming) {
    const px = price ? Number(price) : null
    const summary = `${side.toUpperCase()} ${amount}${opts.quote_unit ? ` ${opts.quote_unit}` : ''} ${px ? `@ ${px.toLocaleString()}` : 'at market'}`
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">Confirm</div>
        <div className={`text-sm font-medium ${side === 'buy' ? 'text-emerald-300' : 'text-red-300'}`}>
          {summary}
        </div>
        {symbol && <div className="text-xs text-zinc-500">{symbol}</div>}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-30 ${submitColor}`}
          >
            {submitting ? '...' : 'Confirm'}
          </button>
        </div>
        {error && <div className="text-xs text-red-400">{error}</div>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex gap-1 bg-zinc-950 rounded p-1">
        <button onClick={() => setSide('buy')} className={sideButtonClass('buy')}>Buy</button>
        <button onClick={() => setSide('sell')} className={sideButtonClass('sell')}>Sell</button>
      </div>

      {symbol && (
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">
          {symbol}{opts.available != null && (
            <span className="ml-2 text-zinc-400 normal-case">
              avail <span className="tabular-nums text-zinc-200">{opts.available.toLocaleString()}</span>
              {opts.quote_unit && <span className="ml-1">{opts.quote_unit}</span>}
            </span>
          )}
        </div>
      )}

      <Field
        label="Amount"
        unit={opts.quote_unit}
        value={amount}
        onChange={setAmount}
        disabled={submitting}
      />
      {opts.quick_amounts && opts.quick_amounts.length > 0 && opts.available != null && (
        <div className="flex gap-1">
          {opts.quick_amounts.map((pct, i) => {
            const fillAmount = (opts.available! * pct)
            // Trim trailing zeros to keep typed input feel.
            const display = fillAmount.toFixed(6).replace(/\.?0+$/, '')
            return (
              <button
                key={i}
                onClick={() => setAmount(display)}
                disabled={submitting}
                className="flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30"
                title={`${(pct * 100).toFixed(0)}% of available`}
              >
                {(pct * 100).toFixed(0)}%
              </button>
            )
          })}
        </div>
      )}
      <Field
        label="Price"
        placeholder="market"
        value={price}
        onChange={setPrice}
        disabled={submitting}
      />

      <button
        onClick={submit}
        disabled={submitting || !amount}
        className={`mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${submitColor}`}
      >
        {submitting ? '...' : side === 'buy' ? `Buy ${opts.quote_unit ?? ''}`.trim() : `Sell ${opts.quote_unit ?? ''}`.trim()}
      </button>

      {reply && <div className="text-xs text-emerald-400">{reply}</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}

function Field({
  label, unit, placeholder, value, onChange, disabled,
}: {
  label: string
  unit?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-12 shrink-0">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        placeholder={placeholder ?? '0.00'}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
      />
      {unit && <span className="text-xs text-zinc-500 shrink-0">{unit}</span>}
    </div>
  )
}
