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

  it('ei sisällä katuosoitetta (kotiosoite ei kuulu verkkoon)', () => {
    expect(json).not.toMatch(/streetAddress|Jenunraitti/i)
    expect(data.address.addressLocality).toBe('Nilsiä')
  })

  it('sisältää palveluita hinnastosta', () => {
    expect(data.hasOfferCatalog.itemListElement.length).toBeGreaterThan(5)
  })
})
