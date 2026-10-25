import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { fetchPosts, formatPostDate } from '../../data/instagram'
import type { InstagramPost } from '../../data/instagram'
import { useConsent, writeConsent } from '../../utils/consent'

type Status = 'loading' | 'ready' | 'error'

const KIND_LABEL: Record<InstagramPost['kind'], string> = {
  image: '',
  video: 'Video',
  album: 'Kuvakaruselli',
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Tile({ post }: { post: InstagramPost }) {
  const date = formatPostDate(post.timestamp)
  const kind = KIND_LABEL[post.kind]
  return (
    <li className="insta__item">
      <a className="insta__tile" href={post.permalink} target="_blank" rel="noopener noreferrer">
        <span className="insta__media">
          <img src={post.imageUrl} alt={post.alt} width={700} height={700} loading="lazy" decoding="async" />
          {kind && (
            <span className="insta__badge" aria-hidden="true">
              {post.kind === 'video' ? '▶' : '❐'}
            </span>
          )}
        </span>
        <span className="insta__caption">
          {date && <span className="insta__date">{date}</span>}
          {post.caption && <span className="insta__text">{post.caption}</span>}
        </span>
        <span className="sr-only">
          {kind ? ` (${kind}, ` : ' ('}avaa Instagramissa, uusi välilehti)
        </span>
      </a>
    </li>
  )
}

/** Karuselli: sivusuuntainen vieritys, nuolipainikkeet, pyyhkäisy ja nuolinäppäimet. */
function Carousel({ posts }: { posts: InstagramPost[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setEdges({ start: track.scrollLeft <= 4, end: max - track.scrollLeft <= 4 })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(track)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [update, posts])

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const first = track.firstElementChild as HTMLElement | null
    const step = first ? first.getBoundingClientRect().width + 16 : track.clientWidth
    // Kapealla ruudulla yksi kortti kerrallaan, leveällä kaikki näkyvät kortit
    const count = Math.max(1, Math.floor(track.clientWidth / step))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * step * count, behavior: reduce ? 'auto' : 'smooth' })
  }

  const noOverflow = edges.start && edges.end

  return (
    <div className="insta__viewport">
      <button
        type="button"
        className="insta__arrow insta__arrow--prev"
        onClick={() => scrollByPage(-1)}
        disabled={edges.start}
        hidden={noOverflow}
        aria-label="Edelliset julkaisut"
      >
        <Chevron direction="left" />
      </button>
      <ul className="insta__list" ref={trackRef} tabIndex={0} aria-label="Instagram-julkaisut, vieritä sivuttain">
        {posts.map((post) => (
          <Tile key={post.id} post={post} />
        ))}
      </ul>
      <button
        type="button"
        className="insta__arrow insta__arrow--next"
        onClick={() => scrollByPage(1)}
        disabled={edges.end}
        hidden={noOverflow}
        aria-label="Seuraavat julkaisut"
      >
        <Chevron direction="right" />
      </button>
    </div>
  )
}

function ProfileLink({ label }: { label: string }) {
  return (
    <a className="btn btn--ghost" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
      {label}
      <span className="sr-only"> (uusi välilehti)</span>
    </a>
  )
}

/**
 * Instagram-karuselli (Minusta-osion tekstin alla).
 *
 * Julkaisut haetaan @glosstahko-tililtä Behold-syötteestä (config/site.ts: instagramFeedUrl)
 * vasta, kun kävijä sallii sen. Ennen lupaa sivu ei tee yhtään pyyntöä kolmannelle osapuolelle.
 * Valinta muistetaan selaimessa ja sen voi perua alatunnisteen Evästeasetukset-linkistä.
 */
export default function InstagramFeed({ feedUrl = site.instagramFeedUrl as string }: { feedUrl?: string }) {
  const consent = useConsent()
  const [attempt, setAttempt] = useState(0)
  // Tulos tallennetaan haun avaimen kanssa, joten tila johdetaan renderöinnissä (ei setStatus-kutsua efektin alussa)
  const [result, setResult] = useState<{ key: string; posts: InstagramPost[] | null } | null>(null)

  const active = consent === 'granted' && feedUrl !== ''
  const key = `${feedUrl}#${attempt}`

  useEffect(() => {
    if (!active) return
    let cancelled = false
    fetchPosts(feedUrl)
      .then((posts) => !cancelled && setResult({ key, posts }))
      .catch(() => !cancelled && setResult({ key, posts: null }))
    return () => {
      cancelled = true
    }
  }, [active, feedUrl, key])

  const done = result?.key === key
  const status: Status = !done ? 'loading' : result.posts ? 'ready' : 'error'
  const posts = result?.posts ?? []

  let body
  if (feedUrl === '' || consent === 'denied') {
    body = (
      <div className="insta__panel">
        <p>Julkaisut löytyvät Instagram-tililtämme.</p>
        <div className="insta__actions">
          <ProfileLink label="Seuraa Instagramissa" />
        </div>
      </div>
    )
  } else if (consent !== 'granted') {
    body = (
      <div className="insta__panel">
        <p className="insta__panel-title">Näytetäänkö viimeisimmät julkaisumme?</p>
        <p>
          Julkaisut haetaan Instagram-tililtämme Behold-palvelun kautta. Silloin Behold ja
          kuvien palvelin saavat IP-osoitteesi, eikä sivu lataa niitä ennen kuin sallit sen. Valinta
          tallennetaan selaimeesi, ja voit muuttaa sen alatunnisteen Evästeasetukset-linkistä.
        </p>
        <div className="insta__actions">
          <button type="button" className="btn btn--primary" onClick={() => writeConsent('granted')}>
            Salli ja näytä julkaisut
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => writeConsent('denied')}>
            Ei kiitos
          </button>
        </div>
      </div>
    )
  } else if (status === 'loading') {
    body = (
      <p className="insta__status" role="status">
        Ladataan julkaisuja…
      </p>
    )
  } else if (status === 'error' || posts.length === 0) {
    body = (
      <div className="insta__panel">
        <p role="status">
          {status === 'error' ? 'Julkaisujen lataus ei onnistunut juuri nyt.' : 'Julkaisuja ei löytynyt.'}
        </p>
        <div className="insta__actions">
          {status === 'error' && (
            <button type="button" className="btn btn--ghost" onClick={() => setAttempt((n) => n + 1)}>
              Yritä uudelleen
            </button>
          )}
          <ProfileLink label="Avaa Instagram" />
        </div>
      </div>
    )
  } else {
    body = (
      <>
        <Carousel posts={posts} />
        <div className="insta__actions">
          <ProfileLink label="Seuraa Instagramissa" />
        </div>
      </>
    )
  }

  return (
    <section className="insta" id="instagram" aria-label="Instagram-julkaisut">
      <p className="insta__title">
        Instagramissa{' '}
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          {site.instagramHandle}
        </a>
      </p>
      {body}
    </section>
  )
}
