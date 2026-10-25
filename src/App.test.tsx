import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { navItems } from './config/nav'
import { site } from './config/site'
import InstagramFeed from './components/ui/InstagramFeed'
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

describe('kotihoito-ohjeet ja ehtosivut', () => {
  const html = renderToString(<App />)

  it('footer ja UKK linkittävät kotihoito-ohjeisiin ja käyttöehtoihin', () => {
    expect(html.match(/href="[^"]*kotihoito\.html"/g)?.length).toBeGreaterThanOrEqual(2)
    expect(html).toMatch(/href="[^"]*kayttoehdot\.html"/)
  })

  it('staattiset sivut ovat olemassa ja takuu viittaa kotihoito-ohjeisiin', () => {
    const pages = import.meta.glob('../public/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
    const terms = pages['../public/kayttoehdot.html']
    const care = pages['../public/kotihoito.html']
    expect(terms).toContain('id="takuu"')
    expect(terms).toContain('href="kotihoito.html"')
    expect(care).toContain('<h1>Kotihoito-ohjeet</h1>')
    expect((care.match(/<h2>/g) ?? []).length).toBe(6)
  })
})

describe('footerin ehto- ja lakilinkit', () => {
  const html = renderToString(<App />)

  it('Käyttöehdot, Tietosuoja, Omavalvonta ja Kotihoito-ohjeet ovat selkeänä listana', () => {
    const nav = html.match(/<nav aria-label="Ehdot ja tietosuoja">([\s\S]*?)<\/nav>/)?.[1] ?? ''
    for (const page of ['kayttoehdot', 'tietosuoja', 'omavalvonta', 'kotihoito']) {
      expect(nav, page).toMatch(new RegExp(`href="[^"]*${page}\\.html"`))
    }
    expect(nav).toContain('Evästeasetukset')
  })

  it('omavalvontasivu on olemassa, eikä siinä ole yksityistä sähköpostia', () => {
    const pages = import.meta.glob('../public/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
    const plan = pages['../public/omavalvonta.html']
    expect(plan).toContain('<h1>Omavalvontasuunnitelma</h1>')
    expect((plan.match(/<h2>/g) ?? []).length).toBe(12)
    expect(plan).toContain('Pisantie 3')
    expect(plan).not.toMatch(/@hotmail|@gmail/i)
    expect(pages['../public/kayttoehdot.html']).toContain('href="omavalvonta.html"')
  })
})

describe('Instagram-karuselli', () => {
  it('esirenderöity sivu kysyy luvan eikä lataa mitään kolmannelta osapuolelta', () => {
    const html = renderToString(<InstagramFeed feedUrl="https://feeds.behold.so/testi" />)
    expect(html).toContain('Salli ja näytä julkaisut')
    expect(html).toContain('Ei kiitos')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<iframe')
    expect(html).not.toContain('behold')
  })

  it('on Minusta-osiossa tekstin jälkeen ja alatunniste tarjoaa Evästeasetukset', () => {
    const html = renderToString(<App />)
    expect(html).toContain('id="instagram"')
    expect(html.indexOf('id="instagram"')).toBeGreaterThan(html.indexOf('id="minusta-otsikko"'))
    expect(html.indexOf('id="instagram"')).toBeLessThan(html.indexOf('id="palvelut'))
    expect(html).toContain('Evästeasetukset')
    expect(html).not.toContain('<iframe')
  })

  it('ilman syötteen osoitetta näytetään vain profiililinkki', () => {
    const html = renderToString(<InstagramFeed feedUrl="" />)
    expect(html).toContain(`href="${site.instagramUrl}"`)
    expect(html).not.toContain('Salli ja näytä')
  })
})

describe('Instagram-suostumus', () => {
  function stubStorage(throwing = false) {
    const store = new Map<string, string>()
    const events: string[] = []
    const fail = () => {
      throw new Error('estetty')
    }
    vi.stubGlobal('window', {
      localStorage: throwing
        ? { getItem: fail, setItem: fail, removeItem: fail }
        : {
            getItem: (k: string) => store.get(k) ?? null,
            setItem: (k: string, v: string) => void store.set(k, v),
            removeItem: (k: string) => void store.delete(k),
          },
      dispatchEvent: (e: Event) => void events.push(e.type),
    })
    return { store, events }
  }

  it('valinta tallentuu ja luetaan takaisin, ja nollaus tyhjentää sen', async () => {
    const { store, events } = stubStorage()
    const { readConsent, writeConsent, CONSENT_KEY } = await import('./utils/consent')
    expect(readConsent()).toBeNull()
    writeConsent('granted')
    expect(store.get(CONSENT_KEY)).toBe('granted')
    expect(readConsent()).toBe('granted')
    writeConsent('denied')
    expect(readConsent()).toBe('denied')
    writeConsent(null)
    expect(store.has(CONSENT_KEY)).toBe(false)
    expect(readConsent()).toBeNull()
    expect(events).toHaveLength(3)
    vi.unstubAllGlobals()
  })

  it('toimii, vaikka selain estää tallennuksen (muistivaraus)', async () => {
    stubStorage(true)
    const { readConsent, writeConsent } = await import('./utils/consent')
    writeConsent('granted')
    expect(readConsent()).toBe('granted')
    writeConsent(null)
    vi.unstubAllGlobals()
  })
})
