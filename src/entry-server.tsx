import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { site } from './config/site'
import { buildFaqData, buildStructuredData } from './seo/structuredData'

/**
 * Palvelinpuolen sisääntulo. Sitä ajetaan vain buildin aikana
 * (scripts/prerender.mjs), ei selaimessa.
 *
 * renderToString muuttaa React-komponentit valmiiksi HTML-tekstiksi.
 * Google ja sosiaalinen media saavat näin sisällön heti, vaikka
 * JavaScript ei ehtisi suoriutua.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Taulukko: yritys + UKK. JSON-LD sallii useita solmuja yhdessä script-tagissa.
export const structuredData = [buildStructuredData(), buildFaqData()]
export const siteUrl = site.url
