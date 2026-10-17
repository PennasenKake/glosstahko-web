import { describe, expect, it } from 'vitest'
import { navItems } from '../config/nav'
import { faq, goodToKnow } from './faq'
import { instagramPosts } from './instagram'
import { serviceCategories } from './services'

const unique = (values: string[]) => new Set(values).size === values.length

/**
 * Sisältödatan tarkistukset: kun hintoja tai tekstejä muokataan käsin,
 * tyypillinen virhe (kaksoistunniste, nolla-hinta, väärä haarukka) jää
 * kiinni ennen julkaisua.
 */
describe('hinnasto (services.ts)', () => {
  const services = serviceCategories.flatMap((c) => c.services)

  it('palveluiden ja kategorioiden tunnisteet ovat uniikkeja', () => {
    expect(unique(services.map((s) => s.id))).toBe(true)
    expect(unique(serviceCategories.map((c) => c.id))).toBe(true)
  })

  it('jokaisella palvelulla on nimi ja positiivinen hinta', () => {
    for (const s of services) {
      expect(s.name.trim(), s.id).not.toBe('')
      expect(s.price, s.id).toBeGreaterThan(0)
    }
  })

  it('haarukoiden yläraja on alarajaa suurempi', () => {
    for (const s of services) {
      if (s.priceMax !== undefined) expect(s.priceMax, s.id).toBeGreaterThan(s.price)
      if (s.minutesMax !== undefined) expect(s.minutesMax, s.id).toBeGreaterThan(s.minutes ?? 0)
    }
  })

  it('jokainen kategoria kuuluu kynnet- tai hiukset-sarakkeeseen ja sisältää palveluita', () => {
    for (const c of serviceCategories) {
      expect(['kynnet', 'hiukset'], c.id).toContain(c.group)
      expect(c.services.length, c.id).toBeGreaterThan(0)
    }
  })
})

describe('UKK (faq.ts)', () => {
  it('kysymykset ovat uniikkeja ja vastaukset ei-tyhjiä', () => {
    expect(unique(faq.map((f) => f.q))).toBe(true)
    for (const f of faq) {
      expect(f.q.trim()).not.toBe('')
      expect(f.a.trim(), f.q).not.toBe('')
    }
  })

  it('Hyvä tietää -kortit ovat täytettyjä', () => {
    for (const card of goodToKnow) {
      expect(card.title.trim()).not.toBe('')
      expect(card.text.trim()).not.toBe('')
    }
  })
})

describe('Instagram-nostot (instagram.ts)', () => {
  it('tunnisteet ovat uniikkeja ja Instagramin tunnistemuotoa', () => {
    expect(unique(instagramPosts.map((p) => p.id))).toBe(true)
    for (const p of instagramPosts) expect(p.id).toMatch(/^[A-Za-z0-9_-]{8,}$/)
  })

  it('päiväys on muodossa p.k.vvvv', () => {
    for (const p of instagramPosts) expect(p.date, p.id).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/)
  })
})

describe('navigaatio (nav.ts)', () => {
  it('tabien tunnisteet ovat uniikkeja', () => {
    expect(unique(navItems.map((n) => n.id))).toBe(true)
  })
})
