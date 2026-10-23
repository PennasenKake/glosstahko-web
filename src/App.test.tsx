import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { navItems } from './config/nav'
import { site } from './config/site'
import { buildStructuredData } from './seo/structuredData'

/**
 * Savutesti: koko sivu renderöityy palvelinpuolella (kuten esirenderöinnissä)
 * ilman virheitä, ja rakenne on odotettu.
 */
describe('sivun rakenne', () => {
  const html = renderToString(<App />)

  it('sisältää täsmälleen yhden h1-otsikon', () => {
    expect(html.match(/<h1[ >]/g)).toHaveLength(1)
  })

  it('jokaisella tabilla on vastaava osio (id) sivulla', () => {
    for (const item of navItems) {
      expect(html, item.id).toContain(`id="${item.id}"`)
    }
  })

  it('ei sisällä rikkinäisiä arvoja', () => {
    expect(html).not.toMatch(/undefined|NaN|\[object/)
  })

  it('ajanvaraus- ja Instagram-linkit osoittavat configin osoitteisiin', () => {
    expect(html).toContain(`href="${site.bookingUrl}"`)
    expect(html).toContain(`href="${site.instagramUrl}"`)
  })
})

describe('rakenteinen data (JSON-LD)', () => {
  const data = buildStructuredData()
  const json = JSON.stringify(data)

  it('on yritystyyppiä ja osoite alkaa https:llä', () => {
    expect(data['@type']).toContain('HairSalon')
    expect(data.url).toMatch(/^https:\/\//)
  })

  it('osoite on toimitilan osoite configista, ei kotiosoite', () => {
    // Kotikadun nimi ei saa päätyä verkkoon. Toimitilan osoite on tarkoituksella mukana.
    expect(json).not.toMatch(/Jenunraitti/i)
    expect(data.address.streetAddress).toBe(site.address)
    expect(data.address.postalCode).toBe(site.postalCode)
    expect(data.address.addressLocality).toBe('Nilsiä')
  })

  it('sisältää sijainnin ja karttalinkin', () => {
    expect(data.geo.latitude).toBeCloseTo(63.2, 1)
    expect(data.geo.longitude).toBeCloseTo(28.09, 1)
    expect(data.hasMap).toMatch(/^https:\/\//)
  })

  it('sisältää palveluita hinnastosta', () => {
    expect(data.hasOfferCatalog.itemListElement.length).toBeGreaterThan(5)
  })
})

describe('paljastusanimaatiot ja toimitila', () => {
  const html = renderToString(<App />)

  it('osat on merkitty data-reveal-attribuutilla, mutta mitään ei ole piilotettu esirenderöinnissä', () => {
    expect(html.match(/data-reveal/g)?.length ?? 0).toBeGreaterThan(20)
    expect(html).not.toContain('data-rv=')
  })

  it('heron osille on määritelty järjestys', () => {
    expect(html).toContain('data-reveal="write" data-delay="350"')
    expect(html).toContain('data-reveal="grow" data-delay="900"')
  })

  it('toimitila näkyy osoitteena ja kartta ladataan vasta painalluksesta', () => {
    expect(html).toContain(site.address)
    expect(html).toContain(site.postalCode)
    // HTML koodaa &-merkin attribuutissa muotoon &amp;
    expect(html).toContain(`href="${site.directionsUrl.replaceAll('&', '&amp;')}"`)
    expect(html).toContain(`href="${site.mapUrl.replaceAll('&', '&amp;')}"`)
    expect(html).toContain('Näytä kartta')
    expect(html).not.toContain('<iframe') // ei kolmansien osapuolten pyyntöjä itsestään
  })

  it('kokonaisia osioita ei enää piiloteta .reveal-luokalla', () => {
    expect(html).not.toMatch(/class="[^"]*\breveal\b/)
  })
})
