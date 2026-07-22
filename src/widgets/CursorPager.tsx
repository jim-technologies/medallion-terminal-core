import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'

export interface CursorPaginationOptions {
  /** Context key mirrored into source.params.page_token by the template. */
  page_token_key?: string
  previous_label?: string
  next_label?: string
}

interface CursorPagerProps {
  nextPageToken?: string
  widgetId?: string
  options?: CursorPaginationOptions
  ariaLabel?: string
}

export function cursorPageTokenKey(
  widgetId?: string,
  options?: CursorPaginationOptions,
): string {
  return options?.page_token_key ?? (widgetId ? `${widgetId}_page_token` : 'page_token')
}

// Opaque cursors only point forward, so the client keeps the cursors it has
// visited in a tiny local stack. A deep-linked cursor can always return to the
// first page; backends never need to expose offsets or reversible tokens.
export function CursorPager({
  nextPageToken,
  widgetId,
  options,
  ariaLabel = 'Result pages',
}: CursorPagerProps) {
  const { ctx, setCtx } = useDashboard()
  const key = cursorPageTokenKey(widgetId, options)
  const currentToken = ctx[key] ?? ''
  const [backStack, setBackStack] = useState<string[]>([])

  useEffect(() => {
    setBackStack([])
  }, [key])

  useEffect(() => {
    if (!currentToken) setBackStack([])
  }, [currentToken])

  const nextToken = nextPageToken && nextPageToken !== currentToken
    ? nextPageToken
    : undefined
  const canGoBack = backStack.length > 0 || currentToken.length > 0
  const previousToken = useMemo(
    () => backStack[backStack.length - 1] ?? '',
    [backStack],
  )

  if (!canGoBack && !nextToken) return null

  const goBack = () => {
    if (!canGoBack) return
    setBackStack(current => current.slice(0, -1))
    setCtx(key, previousToken)
  }

  const goForward = () => {
    if (!nextToken) return
    setBackStack(current => [...current, currentToken])
    setCtx(key, nextToken)
  }

  return (
    <nav className="flex items-center gap-1" aria-label={ariaLabel} data-page-token-key={key}>
      <button
        type="button"
        onClick={goBack}
        disabled={!canGoBack}
        className="mtc-control px-2 py-0.5 disabled:opacity-30"
      >
        {options?.previous_label ?? 'Previous'}
      </button>
      <button
        type="button"
        onClick={goForward}
        disabled={!nextToken}
        className="mtc-control px-2 py-0.5 disabled:opacity-30"
      >
        {options?.next_label ?? 'Next'}
      </button>
    </nav>
  )
}
