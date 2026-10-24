import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
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

describe('Instagram-karuselli', () => {
  const html = renderToString(<App />)

  it('näyttää jokaisen noston esikatselukorttina ilman Instagram-pyyntöjä', async () => {
    const { instagramPosts } = await import('./data/instagram')
    expect(html.match(/insta__item--preview/g)).toHaveLength(instagramPosts.length)
    expect(html).not.toContain('instagram.com/p/')
    expect(html).not.toContain('<iframe')
  })

  it('jokaisella nostolla on uniikki tunniste, päiväys ja teksti', async () => {
    const { instagramPosts } = await import('./data/instagram')
    expect(new Set(instagramPosts.map((p) => p.id)).size).toBe(instagramPosts.length)
    for (const p of instagramPosts) {
      expect(p.id).toMatch(/^[\w-]{8,}$/)
      expect(['p', 'reel']).toContain(p.kind)
      if (p.date) expect(p.date).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/)
      if (p.text) expect(p.text.length).toBeGreaterThan(5)
    }
  })

  it('nuolet ovat piilossa esirenderöinnissä ja lista on näppäimistöllä vieritettävä', () => {
    expect(html).toMatch(/class="insta__list"[^>]*tabindex="0"/)
    expect(html.match(/class="insta__arrow[^"]*"[^>]*hidden/g) ?? []).toHaveLength(2)
  })
})

describe('metatiedot', () => {
  it('rakenteinen data sisältää varaustoiminnon Booksaloniin', () => {
    const data = buildStructuredData()
    expect(data.potentialAction['@type']).toBe('ReserveAction')
    expect(data.potentialAction.target.urlTemplate).toBe(site.bookingUrl)
  })
})

describe('Instagram-nostojen järjestys', () => {
  it('lista on lajiteltu uusimmasta vanhimpaan riippumatta lisäysjärjestyksestä', async () => {
    const { instagramPosts } = await import('./data/instagram')
    const time = (d: string) => {
      const [day, month, year] = d.split('.').map(Number)
      return new Date(year, month - 1, day).getTime()
    }
    const times = instagramPosts.filter((p) => p.date).map((p) => time(p.date!))
    expect(times).toEqual([...times].sort((a, b) => b - a))
  })
})

describe('Instagram-linkin jäsennys', () => {
  it('poimii tunnisteen ja tyypin eri muotoisista osoitteista', async () => {
    const { parseInstagramUrl } = await import('./data/instagram')
    expect(parseInstagramUrl('https://www.instagram.com/glosstahko/p/DehljGiN8mO/')).toEqual({ id: 'DehljGiN8mO', kind: 'p' })
    expect(parseInstagramUrl('https://www.instagram.com/p/DehljGiN8mO/?img_index=1')).toEqual({ id: 'DehljGiN8mO', kind: 'p' })
    expect(parseInstagramUrl('https://www.instagram.com/glosstahko/reel/Abc_123-xyz/')).toEqual({ id: 'Abc_123-xyz', kind: 'reel' })
  })

  it('hylkää osoitteet, jotka eivät ole julkaisuja', async () => {
    const { parseInstagramUrl } = await import('./data/instagram')
    expect(() => parseInstagramUrl('https://www.instagram.com/glosstahko/')).toThrow()
    expect(() => parseInstagramUrl('https://example.com/p/abc')).toThrow()
  })
})

describe('Instagram-suostumus', () => {
  it('esirenderöity sivu kysyy suostumusta eikä lataa Instagramia', () => {
    const html = renderToString(<App />)
    expect(html).not.toContain('<iframe')
    expect(html).toContain('Näytetäänkö Instagram-julkaisut tällä sivulla?')
    expect(html).toContain('Salli ja näytä julkaisut')
    expect(html).toContain('Evästeasetukset')
    expect(html).toContain('id="instagram"')
  })

  it('valinta tallentuu ja luetaan takaisin, ja nollaus tyhjentää sen', async () => {
    const store = new Map<string, string>()
    const events: string[] = []
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      },
      dispatchEvent: (e: Event) => void events.push(e.type),
    })
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
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => {
          throw new Error('estetty')
        },
        setItem: () => {
          throw new Error('estetty')
        },
        removeItem: () => {
          throw new Error('estetty')
        },
      },
      dispatchEvent: () => true,
    })
    const { readConsent, writeConsent } = await import('./utils/consent')
    writeConsent('granted')
    expect(readConsent()).toBe('granted')
    writeConsent(null)
    vi.unstubAllGlobals()
  })
})
