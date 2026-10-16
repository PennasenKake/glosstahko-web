import { setConsent, useConsent } from '../../utils/consent'

/**
 * Pieni ilmoituspalkki sivun alareunassa. Näkyy vain, kun valintaa ei ole tehty.
 * Kertoo, miksi Instagram-julkaisut ladataan Instagramista ja että se voi
 * asettaa evästeitä. Kävijä voi kuitata tai kieltää sen.
 * Valinta koskee ainoastaan Instagram-sisältöä.
 * Ulkoasu: styles/layout.css (.consent).
 */
export default function ConsentBanner() {
  const consent = useConsent()
  if (consent !== 'unknown') return null

  return (
    <aside className="consent" aria-label="Evästeet ja Instagram-sisältö">
      <p className="consent__text">
        Sivu näyttää Instagram-julkaisut suoraan Instagramista, jotta näet uusimmat kuvat heti.
        Instagram (Meta) voi tallentaa selaimeesi evästeitä. Muuten sivu ei käytä evästeitä.
      </p>
      <div className="consent__actions">
        <button type="button" className="btn btn--light btn--small" onClick={() => setConsent('granted')}>
          Selvä
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={() => setConsent('denied')}>
          Älä näytä julkaisuja
        </button>
      </div>
    </aside>
  )
}
