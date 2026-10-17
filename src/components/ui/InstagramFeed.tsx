import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { instagramPosts } from '../../data/instagram'
import type { InstagramPost } from '../../data/instagram'
import leaf from '../../assets/images/leaf.webp'

/**
 * Yksi karusellin kortti. Aluksi näkyy teaser: lehvä kuvapaikalla sekä noston
 * päiväys ja teksti. Instagramiin ei tehdä yhtään pyyntöä ennen kuin kävijä
 * painaa "Näytä julkaisu": silloin kortti vaihtuu Instagramin omaksi upotukseksi
 * (iframe). Upotuksen alta sen saa takaisin piiloon.
 */
function PostCard({ post }: { post: InstagramPost }) {
  const [open, setOpen] = useState(false)
  const postUrl = `${site.instagramUrl}p/${post.id}/`

  const frameRef = useRef<HTMLIFrameElement>(null)
  // Upotuksen korkeus riippuu kuvatekstin pituudesta. Instagram kertoo sen viestillä.
  const [height, setHeight] = useState(640)

  useEffect(() => {
    if (!open) return
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
  }, [open])

  if (open) {
    return (
      <li className="insta__item">
        <div className="insta__embed">
          <iframe
            ref={frameRef}
            src={`https://www.instagram.com/p/${post.id}/embed/`}
            title={`Instagram-julkaisu ${post.date}`}
            style={{ height }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
        <button type="button" className="insta__hide" onClick={() => setOpen(false)}>
          Piilota julkaisu
        </button>
      </li>
    )
  }

  return (
    <li className="insta__item insta__item--preview">
      <div className="insta__card">
        {/* Koriste: sama lehvä jokaisen julkaisun kuvapaikalla */}
        <span className="insta__placeholder" aria-hidden="true">
          <img src={leaf} alt="" width={640} height={574} loading="lazy" />
        </span>

        <p className="insta__date">{post.date}</p>
        <p className="insta__text">{post.text}</p>

        <div className="insta__footer">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
            Näytä julkaisu
          </button>
          <a className="insta__link" href={postUrl} target="_blank" rel="noopener noreferrer">
            Avaa Instagramissa<span className="sr-only"> (uusi välilehti)</span>
          </a>
        </div>
      </div>
    </li>
  )
}

/**
 * Instagram-karuselli: uusimmat nostot korteissa (teaser + "Näytä julkaisu"). Sisältö: data/instagram.ts.
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
    <section className="insta" aria-label="Instagram-julkaisut">
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
        Julkaisu ladataan Instagramista (Meta) vasta, kun painat Näytä julkaisu. Silloin Meta voi
        asettaa evästeitä.
      </p>
    </section>
  )
}
