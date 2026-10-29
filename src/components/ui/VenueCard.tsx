import { useId, useState } from 'react'
import { site } from '../../config/site'

/**
 * Toimitilakortti: osoite, reittiohjeet ja kartta kaarikehyksessä.
 *
 * Kartta toimii kahdella tavalla:
 * - Jos config/site.ts:ssä on koordinaatit (coords), kartta (OpenStreetMap) ladataan
 *   vasta, kun kävijä painaa "Näytä kartta". Sivu ei tee kolmansien osapuolten
 *   pyyntöjä itsestään, joten "ei evästeitä" -lupaus pitää.
 * - Jos koordinaatteja ei ole, kehys on linkki, joka avaa OpenStreetMapin osoitehaun
 *   uuteen välilehteen. Väärää merkkiä ei näytetä koskaan.
 * Ulkoasu: styles/refine.css (.venue).
 */
const BOX = 0.006 // kartan rajaus asteina merkin ympärillä

function buildEmbedUrl(lat: number, lng: number) {
  return (
    'https://www.openstreetmap.org/export/embed.html?bbox=' +
    `${lng - BOX * 1.6}%2C${lat - BOX}%2C${lng + BOX * 1.6}%2C${lat + BOX}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`
  )
}

function Pin() {
  return (
    <svg className="venue__pin" viewBox="0 0 48 64" aria-hidden="true" focusable="false">
      <path d="M24 2C12.4 2 3 11.2 3 22.6C3 38 24 62 24 62S45 38 45 22.6C45 11.2 35.6 2 24 2Z" />
      <circle cx="24" cy="22.6" r="8" />
    </svg>
  )
}

export default function VenueCard() {
  const [loaded, setLoaded] = useState(false)
  const titleId = useId()
  const coords = site.coords

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
          Liikkuva palvelu tulee myös luoksesi Nilsiässä, Tahkolla ja lähialueilla (ajat puhelimitse tai sähköpostilla).
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
          {coords && loaded ? (
            <iframe
              className="venue__iframe"
              title={`Kartta: ${site.addressLine}`}
              src={buildEmbedUrl(coords.lat, coords.lng)}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : coords ? (
            <button type="button" className="venue__load" onClick={() => setLoaded(true)}>
              <Pin />
              <span className="venue__load-text">Näytä kartta</span>
              <span className="venue__load-sub">{site.addressLine}</span>
            </button>
          ) : (
            <a
              className="venue__load"
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pin />
              <span className="venue__load-text">Avaa kartta</span>
              <span className="venue__load-sub">{site.addressLine}</span>
              <span className="sr-only"> (uusi välilehti, OpenStreetMap)</span>
            </a>
          )}
        </div>
        <p className="venue__privacy">
          {coords
            ? 'Kartta ladataan OpenStreetMapista vasta, kun painat Näytä kartta.'
            : 'Kartta avautuu OpenStreetMapissa uuteen välilehteen.'}
        </p>
      </div>
    </div>
  )
}
