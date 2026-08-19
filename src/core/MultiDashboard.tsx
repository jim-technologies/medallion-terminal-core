import { useEffect, useState } from 'react'
import {
  Dashboard,
  type DashboardProps,
  type DashboardTemplateTrust,
  type DashboardTheme,
} from './Dashboard'
import type { TemplateTrustPolicy } from './templateSecurity'
import type { Template } from '../types/template'

// Cmd+1..9 / Ctrl+1..9 selects tab N. Common browser
// shortcut. Mounted once at the MultiDashboard level so adding it
// per-Dashboard isn't needed.
function useTabHotkeys(tabCount: number, onSelect: (i: number) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      const n = Number(e.key)
      if (Number.isFinite(n) && n >= 1 && n <= 9 && n <= tabCount) {
        e.preventDefault()
        onSelect(n - 1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [tabCount, onSelect])
}

interface Tab {
  label: string
  template: Template
}

// Multi-tab dashboard. All tabs are mounted at once (just `display: none`
// when not active) so each Dashboard keeps its widgets, ctx, and any
// transient state across tab switches. The cost is the one-time render
// of every tab — fine for the 2–6 tabs a power user actually has open.
//
// Active tab is controlled externally so the parent (typically the app
// shell) can sync it to the URL.
export function MultiDashboard({
  tabs,
  activeIndex,
  onSelect,
  backendUrl,
  backendHeaders,
  theme = 'dark',
  templateTrust,
  templateTrustPolicy,
  resolveAssetIntent,
  assetRenderers,
  assetApplicationFrame,
  saveAssetOpenPreference,
  onAssetOpenError,
  onIntent,
  registry,
}: {
  tabs: Tab[]
  activeIndex: number
  onSelect: (index: number) => void
  backendUrl?: string
  backendHeaders?: Record<string, string>
  theme?: DashboardTheme
  templateTrust?: DashboardTemplateTrust
  templateTrustPolicy?: TemplateTrustPolicy
  resolveAssetIntent?: DashboardProps['resolveAssetIntent']
  assetRenderers?: DashboardProps['assetRenderers']
  assetApplicationFrame?: DashboardProps['assetApplicationFrame']
  saveAssetOpenPreference?: DashboardProps['saveAssetOpenPreference']
  onAssetOpenError?: DashboardProps['onAssetOpenError']
  onIntent?: DashboardProps['onIntent']
  registry?: DashboardProps['registry']
}) {
  const safeIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1))
  useTabHotkeys(tabs.length, onSelect)
  // Track which tabs have ever been activated. Once activated, stay
  // mounted so state (ctx, fetch results) survives subsequent switches.
  const [activated, setActivated] = useState<Set<number>>(() => new Set([safeIndex]))
  useEffect(() => {
    setActivated(prev => (prev.has(safeIndex) ? prev : new Set([...prev, safeIndex])))
  }, [safeIndex])

  if (tabs.length === 0) return null

  return (
    <div className={`mtc-root mtc-theme-${theme}`} data-theme={theme}>
      <div className="mtc-workspace min-h-full">
        <TabStrip tabs={tabs} activeIndex={safeIndex} onSelect={onSelect} />
        {tabs.map((tab, i) => (
          <div key={i} style={{ display: i === safeIndex ? 'block' : 'none' }}>
            {activated.has(i) && (
              <Dashboard
                template={tab.template}
                backendUrl={backendUrl}
                backendHeaders={backendHeaders}
                theme={theme}
                templateTrust={templateTrust}
                templateTrustPolicy={templateTrustPolicy}
                resolveAssetIntent={resolveAssetIntent}
                assetRenderers={assetRenderers}
                assetApplicationFrame={assetApplicationFrame}
                saveAssetOpenPreference={saveAssetOpenPreference}
                onAssetOpenError={onAssetOpenError}
                onIntent={onIntent}
                registry={registry}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TabStrip({
  tabs, activeIndex, onSelect,
}: { tabs: Tab[]; activeIndex: number; onSelect: (i: number) => void }) {
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
  return (
    <div className="mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end">
      {tabs.map((tab, i) => {
        const active = i === activeIndex
        const hint = i < 9 ? `${isMac ? '⌘' : 'Ctrl'}${i + 1}` : null
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${
              active
                ? 'mtc-tab-active text-zinc-100 border-x border-t'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={hint ? `Switch with ${hint}` : undefined}
          >
            <span>{tab.label || `Tab ${i + 1}`}</span>
            {hint && (
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{hint}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Convenience hook for the common case: keep `?tab=N` in the URL.
// Reads the initial tab from the URL on mount; writes via replaceState
// when the parent calls the returned setter.
export function useTabFromUrl(defaultIndex = 0): [number, (i: number) => void] {
  const [index, setIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return defaultIndex
    const fromUrl = Number(new URLSearchParams(window.location.search).get('tab'))
    return Number.isFinite(fromUrl) && fromUrl >= 0 ? fromUrl : defaultIndex
  })
  const set = (i: number) => {
    setIndex(i)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('tab', String(i))
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`)
    }
  }
  return [index, set]
}
