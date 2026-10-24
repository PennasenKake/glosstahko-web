// Lisää Instagram-noston sivulle: `npm run ig:add -- <noston osoite> --date 12.10.2026 --text "Noston alku"`
//
// Miksi ei automaattista hakua? Instagramin rajapinta vaatisi palvelimen ja pääsyavaimen, ja
// sivusto on tarkoituksella pelkkä staattinen sivu ilman salaisuuksia. Siksi nosto lisätään
// kerran käsin: osoite, päiväys ja alku Siirin omin sanoin. Itse julkaisu ladataan sivulla
// suoraan Instagramista upotuksena, kun kävijä painaa "Näytä julkaisu".
//
// Esimerkki:
//   npm run ig:add -- https://www.instagram.com/glosstahko/p/ABC123xyz_9/ --date 20.10.2026 --text "Uusi sävy!"
// Lisäasetus --dry-run näyttää muutoksen tallentamatta.

import { readFile, writeFile } from 'node:fs/promises'

const file = 'src/data/instagram.ts'
const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const dryRun = args.includes('--dry-run')
const url = args.find((a) => a.startsWith('http'))
const date = flag('--date')
const text = flag('--text')

const fail = (message) => {
  console.error(`Virhe: ${message}\n`)
  console.error('Käyttö: npm run ig:add -- <noston osoite> --date 20.10.2026 --text "Noston alku"')
  process.exit(1)
}

if (!url) fail('anna noston osoite (instagram.com/glosstahko/p/TUNNISTE/)')
const id = url.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel)\/([\w-]{8,})/)?.[1]
if (!id) fail('osoitteesta ei löytynyt noston tunnistetta (…/p/TUNNISTE/)')
if (!date || !/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(date)) fail('anna päiväys muodossa 20.10.2026 (--date)')
if (!text || text.trim().length < 5) fail('anna noston alku (--text "...")')

const source = await readFile(file, 'utf-8')
if (source.includes(`id: '${id}'`)) fail(`nosto ${id} on jo listalla`)

const quote = (value) => `'${value.trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const entry = `  {\n    id: ${quote(id)},\n    date: ${quote(date)},\n    text: ${quote(text)},\n  },\n`
const marker = 'const rawPosts: InstagramPost[] = [\n'
if (!source.includes(marker)) fail('listan alkua ei löytynyt tiedostosta ' + file)

if (dryRun) {
  console.log(`Lisättäisiin:\n${entry}`)
} else {
  await writeFile(file, source.replace(marker, marker + entry))
  console.log(`Lisätty: ${id} (${date}). Järjestys päivittyy automaattisesti uusimmasta vanhimpaan.`)
  console.log('Vinkki: lisää noston kuva tiedostoon src/assets/instagram/' + id + '.jpg (valinnainen).')
}
