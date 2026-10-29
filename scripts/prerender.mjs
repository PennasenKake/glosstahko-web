// Buildin jälkivaihe: esirenderöinti, sitemap ja robots.txt.
// Ajetaan komennolla `npm run build` (ks. package.json).
//
// 1. Vite on jo tehnyt selainversion kansioon dist/
// 2. Vite on tehnyt myös palvelinversion kansioon dist-ssr/ (src/entry-server.tsx)
// 3. Tämä skripti ajaa palvelinversion, saa valmiin HTML:n ja kirjoittaa sen
//    dist/index.html:ään. Samalla lisätään JSON-LD sekä sitemap ja robots.txt.

import { createHash } from 'node:crypto'
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const { render, structuredData, siteUrl } = await import(
  pathToFileURL(resolve('dist-ssr/entry-server.js')).href
)

async function inlineStylesheets(source) {
  const links = [...source.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)]
  let out = source
  for (const [tag, href] of links) {
    const file = resolve('dist', href.replace(/^\/?/, '').replace(new RegExp(`^${(process.env.VITE_BASE ?? '/').replace(/^\//, '')}`), ''))
    const css = (await readFile(file, 'utf-8')).replace(/<\/style/gi, '<\\/style')
    out = out.replace(tag, () => `<style>${css}</style>`)
  }
  return out
}

// --- 1. Esirenderöity HTML sisään ---
const placeholder = '<div id="root"></div>'
let html = await readFile('dist/index.html', 'utf-8')
if (!html.includes(placeholder)) {
  throw new Error('index.html:stä ei löytynyt tyhjää root-elementtiä')
}
html = html.replace(placeholder, `<div id="root">${render()}</div>`)

// --- 2. JSON-LD <head>:iin (yritys + UKK). "<" koodataan, ettei data voi sulkea script-tagia. ---
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

// --- 2b2. Kriittinen CSS HTML:n sisään: ulkoinen tyylitiedosto estäisi ensimmäisen piirron
// yhden lisäkierroksen ajan (Lighthouse: render-blocking). Sivusto on pieni, joten koko
// tyylitiedosto (~55 kt, pakattuna ~10 kt) on järkevämpi sisällyttää kuin jakaa osiin.
// CSP sallii style-src 'unsafe-inline'. Tiedosto jää dist/assets-kansioon varalle.
html = await inlineStylesheets(html)

// --- 2c. Testijulkaisu (esim. GitHub Pages -demo): VITE_NOINDEX=1 pyytää hakukoneita
// olemaan indeksoimatta sivua, jotta demo ei kilpaile oikean domainin kanssa haussa.
const noindex = process.env.VITE_NOINDEX === '1'
const robotsMeta = '    <meta name="robots" content="noindex, nofollow" />\n'
if (noindex) {
  // Korvaa indeksointia sallivan oletusmerkinnän (index.html), jottei sivulla ole kahta ristiriitaista
  html = html.replace(/ *<meta name="robots"[^>]*>\n/, '')
  html = html.replace('</head>', `${robotsMeta}  </head>`)
}

await writeFile('dist/index.html', html)

// Lakisivut ja kotihoito-ohjeet ovat public/-kansion staattisia sivuja. Jokainen saa canonicalin
// ja linkin esikatselun (Open Graph) sivuston osoitteen mukaan. Demossa lisätään myös noindex.
for (const page of ['kayttoehdot.html', 'tietosuoja.html', 'kotihoito.html', 'omavalvonta.html']) {
  const path = `dist/${page}`
  let content = await readFile(path, 'utf-8')
  const title = content.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'GlossTahko'
  const description = content.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
  const url = `${siteUrl}/${page.replace(/\.html$/, '')}`
  const head =
    `    <link rel="canonical" href="${url}" />\n` +
    `    <meta property="og:type" content="website" />\n` +
    `    <meta property="og:locale" content="fi_FI" />\n` +
    `    <meta property="og:site_name" content="GlossTahko" />\n` +
    `    <meta property="og:title" content="${title}" />\n` +
    `    <meta property="og:description" content="${description}" />\n` +
    `    <meta property="og:url" content="${url}" />\n` +
    `    <meta property="og:image" content="${siteUrl}/og-image.jpg" />\n` +
    `    <meta name="twitter:card" content="summary_large_image" />\n` +
    `    <meta name="twitter:title" content="${title}" />\n` +
    `    <meta name="twitter:description" content="${description}" />\n` +
    `    <meta name="twitter:image" content="${siteUrl}/og-image.jpg" />\n` +
    `    <link rel="apple-touch-icon" href="apple-touch-icon.png" />\n` +
    (noindex ? robotsMeta : '')
  content = content.replace('</head>', `${head}  </head>`)
  await writeFile(path, content)
}

// --- 3. Sitemap ja robots.txt ---
// lastmod jätetään pois tarkoituksella: build-päivä ei kerro sisällön muutoksesta, ja
// Google ohittaa virheellisen lastmodin. Sivukartta kertoo vain, mitä sivuja on.
const pages = ['', 'tietosuoja.html', 'kayttoehdot.html', 'kotihoito.html', 'omavalvonta.html']
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>\n    <loc>${siteUrl}/${page.replace(/\.html$/, '')}</loc>\n  </url>`).join('\n')}
</urlset>
`,
)
await writeFile(
  'dist/robots.txt',
  noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
)

// --- 3b. Turvaotsikot (Cloudflare Pages lukee dist/_headers; GitHub Pages ohittaa tiedoston) ---
// CSP sallii vain oman sisällön, Beholdin Instagram-syötteen (connect-src), sen kuvat (img-src *.behold.pictures), OpenStreetMap-upotuksen (frame-src) sekä
// sivujen omat sisäiset skriptit niiden tiivisteellä (sha256), joten 'unsafe-inline' ei tarvita
// skripteille. Tiivisteet lasketaan valmiista HTML:stä, joten ne pysyvät ajan tasalla.
const inlineScriptHashes = new Set()
for (const file of (await readdir('dist')).filter((name) => name.endsWith('.html'))) {
  const page = await readFile(`dist/${file}`, 'utf-8')
  for (const match of page.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    // JSON-LD on dataa, ei suoritettavaa koodia
    if (/application\/ld\+json/.test(match[1])) continue
    inlineScriptHashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`)
  }
}
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...inlineScriptHashes].join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'", // React-komponenttien style-attribuutit
  "img-src 'self' data: https://*.behold.pictures", // Instagram-kuvat tulevat Beholdin kuvapalvelimelta (haetaan vasta luvalla)
  "font-src 'self' data:", // Vite liittää pienimmät fontit CSS:ään data-osoitteina
  "connect-src 'self' https://feeds.behold.so",
  'frame-src https://www.openstreetmap.org',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')
if (!noindex) {
  await writeFile(
    'dist/_headers',
    `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`,
  )
}

// --- 4. Siivous: palvelinversiota ei julkaista ---
await rm('dist-ssr', { recursive: true, force: true })
console.log(`Esirenderöinti valmis: ${siteUrl}`)
