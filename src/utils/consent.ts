import { useSyncExternalStore } from 'react'

/**
 * Suostumus Instagram-sisällön lataamiseen.
 *
 * Instagramin upotus (Meta) asettaa evästeitä, joten se ladataan automaattisesti
 * vain, jos kävijä on hyväksynyt sen. Muuten sivu ei tee yhtään pyyntöä Metalle.
 * Valinta tallennetaan selaimen localStorageen (ei eväste, ja se kertoo vain
 * valinnan, ei mitään kävijästä). Se ei lähde palvelimelle.
 *
 *  - 'pending' = vielä tuntematon (esirenderöinti ja hetki ennen kuin selain on luettu)
 *  - 'unknown' = valintaa ei ole tehty, kysytään
 *  - 'granted' = hyväksytty, 'denied' = vain välttämättömät
 */
export type Consent = 'pending' | 'unknown' | 'granted' | 'denied'

const KEY = 'glosstahko-instagram-consent'

// localStorage voi puuttua tai heittää virheen (esim. yksityinen selaus): siksi try/catch
function read(): Consent {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'granted' || value === 'denied' ? value : 'unknown'
  } catch {
    return 'unknown'
  }
}

let current: Consent | null = null // välimuisti: useSyncExternalStore vaatii vakaan arvon
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function setConsent(value: 'granted' | 'denied' | 'unknown') {
  current = value
  try {
    if (value === 'unknown') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, value)
  } catch {
    // valinta pysyy muistissa tämän käynnin ajan
  }
  emit()
}

/** Palauttaa nykyisen valinnan ja päivittää komponentin, kun se muuttuu. */
export function useConsent(): Consent {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => (current ??= read()), // selaimessa
    () => 'pending', // palvelimella ja hydraation ensimmäisellä kierroksella
  )
}
