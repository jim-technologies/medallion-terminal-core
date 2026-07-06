import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
// Side-effect import: registers the Kelly widget so the
// sports-betting example dashboard can render it.
import '../examples/widgets/registry'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="mtc-root mtc-theme-dark" data-theme="dark">
      <div className="min-h-screen">
        <App />
      </div>
    </div>
  </StrictMode>,
)
