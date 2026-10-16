import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { instagramPosts } from '../../data/instagram'
import type { InstagramPost } from '../../data/instagram'
import leaf from '../../assets/images/leaf.webp'
import { useConsent } from '../../utils/consent'

/**
 * Yksi karusellin kortti. Julkaisu latautuu heti suoraan Instagramista omana
 * upotuksenaan (iframe), ellei kävijä ole kieltänyt sitä (palkki, utils/consent.ts): kuva ja Instagramin
 * omat painikkeet. Pitkä kuvateksti jätetään pois, koska se venyttäisi kortin.
 * Jos kävijä kielsi Instagram-sisällön, kortti on esikatselu (teksti ja kuva tai koriste),
 * eikä Instagramiin tehdä yhtään pyyntöä ennen "Näytä julkaisu" -painiketta.
 */
function PostCard({ post }: { post: InstagramPost }) {
  const [open, setOpen] = useState(false)
  const consent = useConsent()
  // 'pending' = esirenderöity HTML: ei vielä pyyntöjä, upotus tulee heti hydraation jälkeen
  const show = open || consent === 'unknown' || consent === 'granted'
  const postUrl = `${site.instagramUrl}p/${post.id}/`

  const frameRef = useRef<HTMLIFrameElement>(null)
  // Upotuksen korkeus riippuu kuvatekstin pituudesta. Instagram kertoo sen viestillä.
  const [height, setHeight] = useState(640)

  useEffect(() => {
    if (!show) return
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.instagram.com') return
      if (event.source !== frameRef.current?.contentWindow) return
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        const next = data?.type === 'MEASURE' ? data.details?.height : undefined
        if (typeof next === 'number' && next > 100) setHeight(Math.ceil(next))
      } catch {
        // viesti ei ollut JSON-muotoinen: ohitetaan
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [show])

  if (show) {
    return (
      <li className="insta__item">
        <div className="insta__embed">
          <iframe
            ref={frameRef}
            src={`https://www.instagram.com/p/${post.id}/embed/`}
            title={`Instagram-julkaisu ${post.date}`}
            loading="lazy"
            style={{ height }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </li>
    )
  }

  return (
    <li className="insta__item insta__item--preview">
      <div className="insta__card">
        {post.image ? (
          <img
            className="insta__image"
            src={post.image}
            alt={post.imageAlt ?? ''}
            width={600}
            height={600}
            loading="lazy"
          />
        ) : (
          // Ei omaa kuvaa: koristeruutu, jotta kaikki kortit näyttävät samalta
          <span className="insta__placeholder" aria-hidden="true">
            <img src={leaf} alt="" width={640} height={574} loading="lazy" />
          </span>
        )}
        <span className="insta__text">{post.text}</span>

        <div className="insta__footer">
          <span className="insta__meta">
            {post.date} <span aria-hidden="true">·</span>{' '}
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              Avaa Instagramissa<span className="sr-only"> (uusi välilehti)</span>
            </a>
          </span>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
            Näytä julkaisu
          </button>
        </div>
      </div>
    </li>
  )
}

/**
 * Instagram-karuselli: uusimmat nostot korteissa. Sisältö: data/instagram.ts.
 *
 * Karuselli on tavallinen vieritettävä lista (CSS scroll-snap). Nuolipainikkeet
 * vierittävät yhden kortin kerrallaan ja näkyvät vain, kun kortit eivät mahdu
 * kerralla näkyviin. Ulkoasu: styles/components.css (.insta).
 */
export default function InstagramFeed() {
  // ref = suora viittaus vieritettävään listaan
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Lasketaan, onko vasemmalla tai oikealla vielä näkymättömiä kortteja
    const update = () => {
      setCanPrev(track.scrollLeft > 4)
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Vieritys yhden kortin verran (kortin leveys + väli) suuntaan -1 tai 1
  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current
    const card = track?.querySelector('li')
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({
      left: direction * (card.clientWidth + gap),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  const scrollable = canPrev || canNext

  return (
    <div className="insta" role="region" aria-label="Instagram-julkaisut">
      <p className="insta__title">
        Instagramissa{' '}
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          {site.instagramHandle}
        </a>
      </p>

      <div className="insta__viewport">
        <button
          type="button"
          className="insta__arrow insta__arrow--prev"
          aria-label="Edelliset julkaisut"
          disabled={!canPrev}
          hidden={!scrollable}
          onClick={() => scrollByCard(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>

        {/* tabIndex: lista on tarkennettavissa, jolloin nuolinäppäimet vierittävät sitä */}
        <ul className="insta__list" ref={trackRef} tabIndex={0} aria-label="Instagram-julkaisut, vieritä sivuttain">
          {instagramPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </ul>

        <button
          type="button"
          className="insta__arrow insta__arrow--next"
          aria-label="Seuraavat julkaisut"
          disabled={!canNext}
          hidden={!scrollable}
          onClick={() => scrollByCard(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="insta__controls">
        <a className="btn btn--ghost" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          Seuraa Instagramissa
        </a>
      </div>

      <p className="insta__note">
        Julkaisut ladataan suoraan Instagramista (Meta), joka voi asettaa evästeitä.
      </p>
    </div>
  )
}
