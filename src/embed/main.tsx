import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { EmbedView } from './EmbedView'
import { parseEmbedConfig } from './embedConfig'
// Side-effect import: register example custom widgets so a template that
// uses them still renders inside an embed.
import '../../examples/widgets/registry'

// Standalone embed entry. A BI tool (Grafana panel, Superset iframe,
// Power BI / Looker report page) points an <iframe> at embed.html with
// query params describing what to render. Everything is driven by the
// URL — see embedConfig.ts for the parameter grammar.
const config = parseEmbedConfig(window.location.search)

createRoot(document.getElementById('embed-root')!).render(
  <StrictMode>
    <EmbedView config={config} />
  </StrictMode>,
)
