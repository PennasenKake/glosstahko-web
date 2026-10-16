import { setConsent, useConsent } from '../../utils/consent'

/**
 * Pieni suostumuspalkki sivun alareunassa. Näkyy vain, kun valintaa ei ole tehty.
 * Valinta koskee ainoastaan Instagram-julkaisujen automaattista latausta.
 * Ulkoasu: styles/layout.css (.consent).
 */
export default function ConsentBanner() {
  const consent = useConsent()
  if (consent !== 'unknown') return null

  return (
    <aside className="consent" aria-label="Evästeet ja Instagram-sisältö">
      <p className="consent__text">
        Sivu voi näyttää Instagram-julkaisut suoraan. Silloin Instagram (Meta) lataa sisältöä
        ja voi asettaa evästeitä. Ilman suostumustasi sivu ei käytä evästeitä.
      </p>
      <div className="consent__actions">
        <button type="button" className="btn btn--light btn--small" onClick={() => setConsent('granted')}>
          Hyväksy ja näytä
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={() => setConsent('denied')}>
          Vain välttämättömät
        </button>
      </div>
    </aside>
  )
}
