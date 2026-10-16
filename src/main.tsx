import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Julkaistussa sivussa HTML on jo valmiiksi esirenderöity (scripts/prerender.mjs):
// hydrateRoot "herättää" sen eloon ja liittää tapahtumat olemassa olevaan HTML:ään.
// Kehityspalvelimessa root on tyhjä, ja sivu piirretään tavalliseen tapaan.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
