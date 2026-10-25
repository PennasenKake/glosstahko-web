import { writeConsent } from '../../utils/consent'

/**
 * "Evästeasetukset"-painike alatunnisteessa: nollaa Instagram-valinnan ja vie karusellin
 * kohdalle, jossa valinta kysytään uudelleen.
 */
export default function ConsentSettings() {
  return (
    <button
      type="button"
      className="link-button"
      onClick={() => {
        writeConsent(null)
        document.getElementById('instagram')?.scrollIntoView({ block: 'center' })
      }}
    >
      Evästeasetukset
    </button>
  )
}
