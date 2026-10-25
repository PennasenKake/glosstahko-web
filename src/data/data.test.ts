import { formatPostDate, parseFeed } from './instagram'
import { describe, expect, it } from 'vitest'
import { navItems } from '../config/nav'
import { faq, goodToKnow } from './faq'
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

describe('Instagram-syöte (instagram.ts)', () => {
  const feed = {
    username: 'glosstahko',
    posts: [
      {
        id: '1',
        timestamp: '2026-10-15T09:00:00+0000',
        permalink: 'https://www.instagram.com/p/DehljGiN8mO/',
        mediaType: 'IMAGE',
        mediaUrl: 'https://scontent.cdninstagram.com/huge.jpg',
        sizes: { medium: { mediaUrl: 'https://cdn.behold.so/a-medium.webp', width: 700, height: 875 } },
        caption: 'Uusi sävy! #kynnet #nilsia',
        prunedCaption: 'Uusi sävy!',
      },
      {
        id: '2',
        timestamp: '2026-10-07T09:00:00+0000',
        permalink: 'https://www.instagram.com/reel/AbcDefGh_12/',
        mediaType: 'VIDEO',
        isReel: true,
        mediaUrl: 'https://video.cdninstagram.com/v.mp4',
        sizes: { small: { mediaUrl: 'https://hop.behold.pictures/thumb.jpg' } },
        caption: 'Reel',
      },
      { id: '3', permalink: 'https://example.com/p/xyz/', mediaType: 'IMAGE', sizes: { medium: { mediaUrl: 'https://x.test/a.jpg' } } },
      { id: '4', permalink: 'https://www.instagram.com/p/Zzzzzzzz1/', mediaType: 'IMAGE', sizes: { medium: { mediaUrl: 'http://x.test/a.jpg' } } },
      { id: '5', permalink: 'https://www.instagram.com/p/javascript1/', mediaType: 'IMAGE', sizes: { medium: { mediaUrl: 'javascript:alert(1)' } } },
      { id: '6', permalink: 'https://www.instagram.com/p/Nosizes123/', mediaType: 'IMAGE', mediaUrl: 'https://scontent.cdninstagram.com/x.jpg' },
    ],
  }

  it('muuntaa julkaisut ja suosii optimoitua kuvaa ja siivottua tekstiä', () => {
    const posts = parseFeed(feed)
    expect(posts[0]).toMatchObject({
      id: '1',
      kind: 'image',
      imageUrl: 'https://cdn.behold.so/a-medium.webp',
      caption: 'Uusi sävy!',
    })
    expect(posts[1]).toMatchObject({ kind: 'video', imageUrl: 'https://hop.behold.pictures/thumb.jpg' })
  })

  it('hylkää muut kuin Instagram-osoitteet ja ei-https-kuvat', () => {
    const posts = parseFeed(feed)
    expect(posts.map((p) => p.id)).toEqual(['1', '2'])
  })

  it('heittää virheen väärän muotoisesta syötteestä', () => {
    expect(() => parseFeed(null)).toThrow()
    expect(() => parseFeed({ posts: 'x' })).toThrow()
    expect(parseFeed({ posts: [] })).toEqual([])
  })

  it('päiväys muotoillaan suomalaiseksi', () => {
    expect(formatPostDate('2026-10-15T09:00:00+0000')).toBe('15.10.2026')
    expect(formatPostDate('ei päiväys')).toBe('')
  })
})

describe('navigaatio (nav.ts)', () => {
  it('tabien tunnisteet ovat uniikkeja', () => {
    expect(unique(navItems.map((n) => n.id))).toBe(true)
  })
})
