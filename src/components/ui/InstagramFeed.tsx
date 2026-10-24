import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { instagramPosts } from '../../data/instagram'
import type { InstagramPost } from '../../data/instagram'
import leaf from '../../assets/images/leaf.webp'
import { useConsent, writeConsent } from '../../utils/consent'
import type { Consent } from '../../utils/consent'

/**
 * Valinnaiset omat kuvat nostoille: tiedosto src/assets/instagram/TUNNISTE.jpg (tai webp/png).
 * Vite paketoi ne mukaan buildissa, ja kuvat tulevat omalta palvelimelta eli Metaan ei tehdä pyyntöjä.
 */
const photoFiles = import.meta.glob('../../assets/instagram/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const photos: Record<string, string> = Object.fromEntries(
  Object.entries(photoFiles).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url]),
)

/**
 * Instagramin upotus (iframe). Instagram kertoo upotuksen korkeuden viestillä (MEASURE),
 * koska se riippuu kuvatekstin pituudesta. loading="lazy": ruudun ulkopuoliset kortit
 * ladataan vasta, kun karuselli vieritetään niiden kohdalle.
 */
function Embed({ post }: { post: InstagramPost }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(640)

  useEffect(() => {
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
  }, [])

  return (
    <div className="insta__embed">
      <iframe
        ref={frameRef}
        src={`https://www.instagram.com/${post.kind}/${post.id}/embed/`}
        title={`Instagram-julkaisu${post.date ? ` ${post.date}` : ''}`}
        loading="lazy"
        style={{ height }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  )
}

/**
 * Yksi karusellin kortti.
 * - Suostumus annettu: julkaisu ladataan heti Instagramista (upotus).
 * - Muuten: esikatselu (päiväys, teksti, lehvä). Yksittäisen julkaisun voi avata painikkeella,
 *   jolloin vain se lataa sisältöä Instagramista.
 */
function PostCard({ post, consent }: { post: InstagramPost; consent: Consent }) {
  const [open, setOpen] = useState(false)
  const postUrl = `${site.instagramUrl}${post.kind}/${post.id}/`

  if (consent === 'granted') {
    return (
      <li className="insta__item">
        <Embed post={post} />
      </li>
    )
  }

  if (open) {
    return (
      <li className="insta__item">
        <Embed post={post} />
        <button type="button" className="insta__hide" onClick={() => setOpen(false)}>
          Piilota julkaisu
        </button>
      </li>
    )
  }

  return (
    <li className="insta__item insta__item--preview">
      <div className="insta__card">
        {photos[post.id] ? (
          // Noston oma kuva. alt on tyhjä, koska teksti on kortissa heti kuvan alla.
          <span className="insta__placeholder insta__placeholder--photo" aria-hidden="true">
            <img src={photos[post.id]} alt="" loading="lazy" decoding="async" />
          </span>
        ) : (
          // Ei omaa kuvaa: koriste, sama lehvä kuvapaikalla
          <span className="insta__placeholder" aria-hidden="true">
            <img src={leaf} alt="" width={640} height={574} loading="lazy" />
          </span>
        )}

        {post.date && <p className="insta__date">{post.date}</p>}
        <p className="insta__text">{post.text ?? 'Instagram-julkaisu'}</p>

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
  const consent = useConsent()
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
    <section className="insta" id="instagram" aria-label="Instagram-julkaisut">
      <p className="insta__title">
        Instagramissa{' '}
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          {site.instagramHandle}
        </a>
      </p>

      {consent === null && (
        <div className="insta__consent" role="group" aria-labelledby="insta-consent-title">
          <p className="insta__consent-title" id="insta-consent-title">
            Näytetäänkö Instagram-julkaisut tällä sivulla?
          </p>
          <p className="insta__consent-text">
            Julkaisut ladataan suoraan Instagramista (Meta). Silloin Meta saa IP-osoitteesi ja voi
            asettaa evästeitä. Valintasi tallennetaan vain tähän selaimeen, ja voit muuttaa sen
            alatunnisteen Evästeasetukset-linkistä.
          </p>
          <div className="insta__consent-actions">
            <button type="button" className="btn btn--primary btn--small" onClick={() => writeConsent('granted')}>
              Salli ja näytä julkaisut
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => writeConsent('denied')}>
              Ei nyt
            </button>
          </div>
        </div>
      )}

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
            <PostCard post={post} consent={consent} key={post.id} />
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
        {consent === 'granted' ? (
          <>
            Julkaisut ladataan Instagramista (Meta), joka voi asettaa evästeitä.{' '}
            <button type="button" className="link-button" onClick={() => writeConsent(null)}>
              Peru suostumus
            </button>
          </>
        ) : (
          <>
            Julkaisu ladataan Instagramista (Meta) vasta, kun sallit sen tai painat Näytä julkaisu.
            Silloin Meta voi asettaa evästeitä.
            {consent === 'denied' && (
              <>
                {' '}
                <button type="button" className="link-button" onClick={() => writeConsent('granted')}>
                  Salli ja näytä kaikki julkaisut
                </button>
              </>
            )}
          </>
        )}
      </p>
    </section>
  )
}
