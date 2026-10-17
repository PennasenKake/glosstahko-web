// Buildin jälkivaihe: esirenderöinti, sitemap ja robots.txt.
// Ajetaan komennolla `npm run build` (ks. package.json).
//
// 1. Vite on jo tehnyt selainversion kansioon dist/
// 2. Vite on tehnyt myös palvelinversion kansioon dist-ssr/ (src/entry-server.tsx)
// 3. Tämä skripti ajaa palvelinversion, saa valmiin HTML:n ja kirjoittaa sen
//    dist/index.html:ään. Samalla lisätään JSON-LD sekä sitemap ja robots.txt.

import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const { render, structuredData, siteUrl } = await import(
  pathToFileURL(resolve('dist-ssr/entry-server.js')).href
)

// --- 1. Esirenderöity HTML sisään ---
const placeholder = '<div id="root"></div>'
let html = await readFile('dist/index.html', 'utf-8')
if (!html.includes(placeholder)) {
  throw new Error('index.html:stä ei löytynyt tyhjää root-elementtiä')
}
html = html.replace(placeholder, `<div id="root">${render()}</div>`)

// --- 2. JSON-LD <head>:iin. "<" koodataan, ettei data voi sulkea script-tagia. ---
const json = JSON.stringify(structuredData).replace(/</g, '\\u003c')
html = html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n  </head>`)

// --- 2b. Tärkeimmät fontit esiladataan: muuten selain löytää ne vasta CSS:n luettuaan
// ja otsikko vaihtaa fonttia kesken latauksen (hidastaa LCP:tä). Tiedostonimissä on
// tiiviste, joten nimet haetaan buildin tuloksesta. crossorigin on fonteille pakollinen.
const base = process.env.VITE_BASE ?? '/'
const assets = await readdir('dist/assets')
const preloads = ['great-vibes-latin-400-normal', 'lora-latin-400-normal', 'cormorant-garamond-latin-600-normal']
  .map((name) => assets.find((file) => file.startsWith(name) && file.endsWith('.woff2')))
  .filter(Boolean)
  .map((file) => `    <link rel="preload" href="${base}assets/${file}" as="font" type="font/woff2" crossorigin />\n`)
  .join('')
html = html.replace('</head>', `${preloads}  </head>`)

await writeFile('dist/index.html', html)

// --- 3. Sitemap ja robots.txt ---
const today = new Date().toISOString().slice(0, 10)
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

// --- 4. Siivous: palvelinversiota ei julkaista ---
await rm('dist-ssr', { recursive: true, force: true })
console.log(`Esirenderöinti valmis: ${siteUrl}`)
