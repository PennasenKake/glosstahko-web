import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { instagramPosts } from '../../data/instagram'
import type { InstagramPost } from '../../data/instagram'

/**
 * Yksi karusellin kortti. Aluksi kortti on pelkkä esikatselu (teksti ja
 * mahdollinen oma kuva), eikä Instagramiin tehdä yhtään pyyntöä. Vasta
 * "Näytä julkaisu" -painikkeen napautus lataa julkaisun suoraan Instagramista
 * (iframe). Näin sivu pysyy evästeettömänä, ellei kävijä itse halua nostoa esiin.
 */
function PostCard({ post }: { post: InstagramPost }) {
  const [open, setOpen] = useState(false)
  const postUrl = `${site.instagramUrl}p/${post.id}/`

  return (
    <li className="insta__item">
      <div className="insta__card">
        {open ? (
          <div className="insta__embed">
            <iframe
              src={`https://www.instagram.com/p/${post.id}/embed/`}
              title={`Instagram-julkaisu ${post.date}`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        ) : (
          <>
            {post.image && (
              <img
                className="insta__image"
                src={post.image}
                alt={post.imageAlt ?? ''}
                width={600}
                height={600}
                loading="lazy"
              />
            )}
            <span className="insta__text">{post.text}</span>
          </>
        )}

        <div className="insta__footer">
          <span className="insta__meta">
            {post.date} <span aria-hidden="true">·</span>{' '}
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              Avaa Instagramissa<span className="sr-only"> (uusi välilehti)</span>
            </a>
          </span>
          {!open && (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
              Näytä julkaisu
            </button>
          )}
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

      <ul className="insta__list" ref={trackRef}>
        {instagramPosts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </ul>

      <div className="insta__controls">
        <button
          type="button"
          className="insta__arrow"
          aria-label="Edelliset julkaisut"
          disabled={!canPrev}
          hidden={!scrollable}
          onClick={() => scrollByCard(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <a className="btn btn--ghost" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          Seuraa Instagramissa
        </a>
        <button
          type="button"
          className="insta__arrow"
          aria-label="Seuraavat julkaisut"
          disabled={!canNext}
          hidden={!scrollable}
          onClick={() => scrollByCard(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="insta__note">
        "Näytä julkaisu" lataa noston suoraan Instagramista (Meta), joka voi asettaa evästeitä.
      </p>
    </div>
  )
}
