import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductShell, createHistoryRouter, useLocation } from '../../src/app'
import { Button, DataGrid, PageHeader } from '../../src/toolkit'
import '../../src/fonts/fonts.css'
import '../../src/index.css'

function Pages() {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(false)
    const timer = setTimeout(() => setLoaded(true), Number(new URLSearchParams(location.search).get('delay') ?? 500))
    return () => clearTimeout(timer)
  }, [location.search])
  if (new URLSearchParams(location.search).get('pane') === 'detail') return <PageHeader title="Detail" />
  return <>
    <PageHeader title="History scroll" />
    <div style={{ height: 560 }} />
    <DataGrid label="History rows" scrollKey="history-list" columns={[{ id: 'id', header: 'ID', width: 200 }, { id: 'name', header: 'Name', width: 1800 }, { id: 'kind', header: 'Kind', width: 180 }]}
      rows={loaded ? Array.from({ length: 10_001 }, (_, id) => ({ id, name: `Entry ${id}`, kind: 'Record' })) : []}
      rowKey={row => String(row.id)} height={320} loading={!loaded} />
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
