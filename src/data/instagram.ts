/**
 * Instagram-julkaisut haetaan suoraan @glosstahko-tililtä Behold-syötepalvelun kautta
 * (https://behold.so). Instagram ei anna julkaisuja suoraan selaimelle, joten Behold
 * hoitaa pääsyavaimen ja välittää tilin julkaisut JSON-muodossa.
 *
 * Syöte haetaan vasta, kun kävijä on antanut luvan (utils/consent.ts), ja Behold päivittää
 * sen itse kerran päivässä. Uuden julkaisun lisääminen Instagramiin riittää: sivua ei
 * tarvitse muuttaa eikä julkaista uudelleen.
 *
 * Käyttöönotto: docs/instagram-syote.md
 */

export type InstagramPost = {
  id: string
  /** Julkaisun osoite Instagramissa (aina https://www.instagram.com/...) */
  permalink: string
  /** Kuvan osoite (https) */
  imageUrl: string
  alt: string
  caption: string
  /** ISO 8601 */
  timestamp: string
  kind: 'image' | 'video' | 'album'
}

const MAX_POSTS = 12
const PERMALINK = /^https:\/\/www\.instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/[\w-]+\/?/

/** Hyväksytään vain https-osoitteet, jottei syötteen kautta voi tulla muuta sisältöä. */
function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

type Raw = Record<string, unknown>

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Kuva otetaan Beholdin optimoiduista koista (sizes), jotka tulevat *.behold.pictures-palvelimelta. */
function pickImage(post: Raw): string | null {
  const sizes = isRecord(post.sizes) ? post.sizes : {}
  for (const key of ['medium', 'large', 'small', 'full']) {
    const size = sizes[key]
    if (isRecord(size)) {
      const url = httpsUrl(size.mediaUrl)
      if (url) return url
    }
  }
  return null
}

/** Muuntaa Beholdin JSON-syötteen julkaisuiksi. Virheelliset rivit jätetään pois. */
export function parseFeed(json: unknown): InstagramPost[] {
  if (!isRecord(json) || !Array.isArray(json.posts)) throw new Error('Syöte ei ole odotetun muotoinen')

  const posts: InstagramPost[] = []
  for (const item of json.posts) {
    if (!isRecord(item)) continue
    const permalink = typeof item.permalink === 'string' && PERMALINK.test(item.permalink) ? item.permalink : null
    const imageUrl = pickImage(item)
    if (!permalink || !imageUrl || typeof item.id !== 'string') continue

    const caption = String(item.prunedCaption ?? item.caption ?? '').trim()
    const alt = (typeof item.altText === 'string' && item.altText.trim()) || caption.slice(0, 120) || 'Instagram-julkaisu'
    const kind = item.mediaType === 'VIDEO' || item.isReel === true ? 'video' : item.mediaType === 'CAROUSEL_ALBUM' ? 'album' : 'image'

    posts.push({
      id: item.id,
      permalink,
      imageUrl,
      alt,
      caption,
      timestamp: typeof item.timestamp === 'string' ? item.timestamp : '',
      kind,
    })
    if (posts.length >= MAX_POSTS) break
  }
  return posts
}

/** Päiväys muodossa 15.10.2026 (tyhjä, jos aikaleima puuttuu tai on virheellinen). */
export function formatPostDate(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fi-FI', { timeZone: 'Europe/Helsinki' }).format(date)
}

let cache: { url: string; posts: Promise<InstagramPost[]> } | null = null

/**
 * Hakee julkaisut syötteestä. Tulos muistetaan sivun eliniän ajan, jottei suostumuksen
 * vaihtelu aiheuta uusia hakuja (Beholdin ilmainen paketti rajoittaa hakujen määrää).
 */
export function fetchPosts(feedUrl: string): Promise<InstagramPost[]> {
  if (cache?.url === feedUrl) return cache.posts
  const posts = fetch(feedUrl, { credentials: 'omit', headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error(`Syöte vastasi ${response.status}`)
      return response.json() as Promise<unknown>
    })
    .then(parseFeed)
  cache = { url: feedUrl, posts }
  posts.catch(() => {
    if (cache?.posts === posts) cache = null // virheen jälkeen saa yrittää uudelleen
  })
  return posts
}
