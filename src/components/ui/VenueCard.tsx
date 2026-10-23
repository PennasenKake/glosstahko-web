import { useId, useState } from 'react'
import { site } from '../../config/site'

/**
 * Toimitilan paikkamerkintä: osoite, reittiohjeet ja kartta kaarikehyksessä.
 * Kartta (OpenStreetMap) ladataan vasta, kun kävijä painaa "Näytä kartta". Näin sivu ei
 * tee kolmansien osapuolten pyyntöjä itsestään ja "ei evästeitä" -lupaus pitää.
 * Ulkoasu: styles/refine.css (.venue).
 */
const BOX = 0.006 // kartan rajaus asteina merkin ympärillä
const embedUrl =
  'https://www.openstreetmap.org/export/embed.html?bbox=' +
  `${site.lng - BOX * 1.6}%2C${site.lat - BOX}%2C${site.lng + BOX * 1.6}%2C${site.lat + BOX}` +
  `&layer=mapnik&marker=${site.lat}%2C${site.lng}`

export default function VenueCard() {
  const [loaded, setLoaded] = useState(false)
  const titleId = useId()

  return (
    <div className="venue" role="group" aria-labelledby={titleId} data-reveal>
      <div className="venue__info">
        <h3 className="venue__title" id={titleId}>
          Toimitila
        </h3>
        <address className="venue__address">
          <span>{site.address}</span>
          <span>
            {site.postalCode} {site.city}
          </span>
        </address>
        <p className="venue__note">
          Sesonkien aikana palvelu tulee myös mökille, majoitukseen tai juhlapaikalle Tahkolla.
        </p>
        <div className="venue__actions">
          <a
            className="btn btn--primary btn--small"
            href={site.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reittiohjeet
            <span className="sr-only"> (uusi välilehti, Google Maps)</span>
          </a>
          <a
            className="btn btn--ghost btn--small"
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Avaa kartta
            <span className="sr-only"> (uusi välilehti, OpenStreetMap)</span>
          </a>
        </div>
      </div>

      <div className="venue__side">
        <div className="venue__frame">
          {loaded ? (
            <iframe
              className="venue__iframe"
              title={`Kartta: ${site.addressLine}`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <button type="button" className="venue__load" onClick={() => setLoaded(true)}>
              <svg className="venue__pin" viewBox="0 0 48 64" aria-hidden="true" focusable="false">
                <path d="M24 2C12.4 2 3 11.2 3 22.6C3 38 24 62 24 62S45 38 45 22.6C45 11.2 35.6 2 24 2Z" />
                <circle cx="24" cy="22.6" r="8" />
              </svg>
              <span className="venue__load-text">Näytä kartta</span>
              <span className="venue__load-sub">{site.addressLine}</span>
            </button>
          )}
        </div>
        <p className="venue__privacy">
          Kartta ladataan OpenStreetMapista vasta, kun painat Näytä kartta.
        </p>
      </div>
    </div>
  )
}
