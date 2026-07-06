import { useEffect, useState } from 'react'
import { Dashboard } from './core/Dashboard'
import { MultiDashboard, useTabFromUrl } from './core/MultiDashboard'
import { ExamplesIndex } from './ExamplesIndex'
import type { Template } from './types/template'

interface LoadedTab {
  label: string
  template: Template
}

export default function App() {
  const initialParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const hasTemplate = initialParams.has('template') || initialParams.has('tabs')

  const [tabs, setTabs] = useState<LoadedTab[] | null>(null)
  const [loading, setLoading] = useState(hasTemplate)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useTabFromUrl()

  useEffect(() => {
    if (!hasTemplate) return
    const params = new URLSearchParams(window.location.search)
    const tabsParam = params.get('tabs')
    const paths = tabsParam
      ? tabsParam.split(',').map(s => s.trim()).filter(Boolean)
      : [params.get('template')!]

    Promise.all(
      paths.map(async (path) => {
        const res = await fetch(path)
        if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
        const template: Template = await res.json()
        return { label: template.title || path.split('/').pop()?.replace('.json', '') || path, template }
      }),
    )
      .then(setTabs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [hasTemplate])

  // No URL params → show the examples landing page.
  if (!hasTemplate) return <ExamplesIndex />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">
        Loading terminal...
      </div>
    )
  }

  if (error || !tabs || tabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-2">
        <div className="text-red-400">{error || 'No template loaded'}</div>
        <a className="text-sm text-sky-400 hover:text-sky-300" href="/">← back to examples</a>
      </div>
    )
  }

  const backendUrl = initialParams.get('backend') ?? undefined
  if (tabs.length === 1) return <Dashboard template={tabs[0].template} backendUrl={backendUrl} />
  return <MultiDashboard tabs={tabs} activeIndex={activeIndex} onSelect={setActiveIndex} backendUrl={backendUrl} />
}
