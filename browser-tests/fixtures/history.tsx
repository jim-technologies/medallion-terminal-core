import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductShell, createHistoryRouter, useLocation } from '../../src/app'
import { Button, DataGrid, PageHeader } from '../../src/toolkit'
import '../../src/fonts/fonts.css'
import '../../src/index.css'

const TIP_ROWS = Array.from({ length: 60 }, (_, id) => ({ id, note: `Entry ${id} — 東京 / café / ${'long-name-'.repeat(8)}`, kind: 'Record' }))

declare global {
  interface Window {
    __historyFixtureRows?: { search: string; complete: () => void }
  }
}

function Pages() {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(false)
    if (new URLSearchParams(location.search).get('load') === 'manual') {
      const gate = { search: location.search, complete: () => setLoaded(true) }
      window.__historyFixtureRows = gate
      return () => {
        if (window.__historyFixtureRows === gate) delete window.__historyFixtureRows
      }
    }
    const timer = setTimeout(() => setLoaded(true), Number(new URLSearchParams(location.search).get('delay') ?? 500))
    return () => clearTimeout(timer)
  }, [location.search])
  const pane = new URLSearchParams(location.search).get('pane')
  if (pane === 'detail') return <PageHeader title="Detail" />
  if (pane === 'tips') return <>
    <PageHeader title="Value tips" />
    <DataGrid label="Tip rows" columns={[{ id: 'id', header: 'ID', width: 120 }, { id: 'note', header: 'Note', width: 240 }, { id: 'kind', header: 'Kind', width: 120 }]}
      rows={TIP_ROWS} rowKey={row => String(row.id)} height="auto" />
  </>
  return <>
    <PageHeader title="History scroll" />
    <a href="#history-target">Jump to target</a>
    <div style={{ height: 560 }} />
    <DataGrid label="History rows" scrollKey="history-list" columns={[{ id: 'id', header: 'ID', width: 200, pinned: true }, { id: 'name', header: 'Name', width: 1800 }, { id: 'kind', header: 'Kind', width: 180 }]}
      rows={loaded ? Array.from({ length: 10_001 }, (_, id) => ({ id, name: `Entry ${id}`, kind: 'Record' })) : []}
      rowKey={row => String(row.id)} height={320} loading={!loaded} />
    <div style={{ height: 1400 }} />
    <h2 id="history-target">Target</h2>
    <div style={{ height: 1400 }} />
  </>
}

function Fixture() {
  const router = useMemo(() => createHistoryRouter(), [])
  const navigate = (pane: string, replace = false) => {
    const url = new URL(window.location.href)
    url.searchParams.set('pane', pane)
    router.navigate(`${url.pathname}${url.search}`, { replace })
  }
  return <ProductShell product={{ name: 'History' }} router={router} actions={<>
    <Button onClick={() => navigate('detail')}>Open detail</Button>
    <Button onClick={() => navigate('list')}>Open list</Button>
    <Button onClick={() => navigate('list', true)}>Replace list</Button>
  </>}><Pages /></ProductShell>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>)
