import { useEffect, useState } from 'react'
import { Dashboard } from './core/Dashboard'
import type { Template } from './types/template'

export default function App() {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url = params.get('template') || '/templates/demo.json'

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load template (${res.status})`)
        return res.json()
      })
      .then(setTemplate)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-500">
        Loading terminal...
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-2">
        <div className="text-red-400">{error || 'No template loaded'}</div>
        <div className="text-sm">
          Pass <code className="text-zinc-200">?template=URL</code> to load a dashboard template.
        </div>
      </div>
    )
  }

  return <Dashboard template={template} />
}
