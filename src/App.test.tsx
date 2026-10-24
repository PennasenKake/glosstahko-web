import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { navItems } from './config/nav'
import { site } from './config/site'
import { buildFaqData, buildStructuredData } from './seo/structuredData'

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
    // Rakenteisen datan katuosoite on aina configin toimitila. Kotiosoitetta ei lueta mistään.
    expect(data.address.streetAddress).toBe(site.address)
    expect(data.address.postalCode).toBe(site.postalCode)
    expect(data.address.addressLocality).toBe('Nilsiä')
  })

  it('sisältää karttalinkin ja sijainnin vain, jos koordinaatit tunnetaan', () => {
    expect(data.hasMap).toMatch(/^https:\/\//)
    if (site.coords) {
      expect(data.geo?.latitude).toBe(site.coords.lat)
      expect(data.geo?.longitude).toBe(site.coords.lng)
    } else {
      expect(json).not.toContain('GeoCoordinates')
    }
  })

  it('sisältää hintahaarukan hinnastosta', () => {
    expect(data.priceRange).toMatch(/^\d+–\d+ €$/)
  })

  it('sisältää palveluita hinnastosta', () => {
    expect(data.hasOfferCatalog.itemListElement.length).toBeGreaterThan(5)
  })
})

describe('UKK-rakenne (FAQPage)', () => {
  const faqData = buildFaqData()

  it('sisältää saman määrän kysymyksiä kuin näkyvä UKK', () => {
    const html = renderToString(<App />)
    const visible = html.match(/class="faq__question"/g)?.length ?? 0
    expect(faqData['@type']).toBe('FAQPage')
    expect(faqData.mainEntity).toHaveLength(visible)
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

  it('toimitila näkyy osoitteena ja karttaa ei ladata itsestään', () => {
    expect(html).toContain(site.address)
    expect(html).toContain(site.postalCode)
    // HTML koodaa &-merkin attribuutissa muotoon &amp;
    expect(html).toContain(`href="${site.directionsUrl.replaceAll('&', '&amp;')}"`)
    expect(html).toContain(`href="${site.mapUrl.replaceAll('&', '&amp;')}"`)
    expect(html).toContain(site.coords ? 'Näytä kartta' : 'Avaa kartta')
    expect(html).not.toContain('<iframe') // ei kolmansien osapuolten pyyntöjä itsestään
  })

  it('toimitilan osoite on Pisantie 3 ja se näkyy sivulla kerran riviosoitteena', () => {
    expect(site.addressLine).toBe('Pisantie 3, 73300 Nilsiä')
    expect(html).toContain(site.addressLine)
  })

  it('kokonaisia osioita ei enää piiloteta .reveal-luokalla', () => {
    expect(html).not.toMatch(/class="[^"]*\breveal\b/)
  })
})

describe('otsikoiden terälehdet', () => {
  const html = renderToString(<App />)
  const blocks = html.match(/<div class="petals[^"]*" aria-hidden="true">/g) ?? []

  it('on koristetta (aria-hidden) kolmen osion otsikoissa', () => {
    expect(blocks).toHaveLength(3)
  })

  it('jokaisessa otsikossa on kuusi SVG-lehteä, eikä animaatio ole päällä esirenderöinnissä', () => {
    expect(html.match(/<span class="petal petal--/g)).toHaveLength(18)
    expect(html).not.toContain('petals--live')
  })
})

describe('ajanvaraus (Booksalon)', () => {
  const html = renderToString(<App />)

  it('bookingUrl on Booksalonin sivu', () => {
    expect(site.bookingUrl).toBe('https://booksalon.fi/glosstahko')
  })

  it('kaikki Varaa aika -painikkeet vievät Booksaloniin (header, hero, yhteys, footer)', () => {
    const count = html.split(`href="${site.bookingUrl}"`).length - 1
    expect(count).toBeGreaterThanOrEqual(4)
  })

  it('liikkuvan palvelun kysely ohjaa Instagram-viestiin, ei ajanvaraukseen', () => {
    expect(html).toMatch(/href="https:\/\/www\.instagram\.com\/glosstahko\/"[^>]*>Kysy liikkuvasta palvelusta/)
  })

  it('UKK ei enää väitä ajanvarauksen olevan vain Instagramissa', () => {
    expect(html).not.toContain('toistaiseksi Instagramissa')
    expect(html).toContain('Booksalonin verkkoajanvarauksessa')
  })

  it('toimitilan lisätieto (kerros ja kampaamo) näkyy', () => {
    expect(html).toContain(site.addressNote)
  })
})
