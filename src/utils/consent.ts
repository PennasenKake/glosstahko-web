import { useSyncExternalStore } from 'react'

/**
 * Suostumus ulkoisen sisällön (Instagram, Meta) lataamiseen.
 *
 * - 'granted': julkaisut ladataan suoraan Instagramista karusellissa
 * - 'denied': näytetään vain esikatselukortit (kävijä voi avata yksittäisen julkaisun)
 * - null: ei vielä valittu, kysytään karusellin yläpuolella
 *
 * Valinta tallennetaan vain kävijän omaan selaimeen (localStorage), ei palvelimelle.
 * Jos selain estää tallennuksen, valinta pysyy muistissa kunnes sivu ladataan uudelleen.
 * Palvelinpuolella ja ennen hydrataatiota arvo on aina null, joten esirenderöity HTML ei
 * lataa mitään kolmannelta osapuolelta.
 */
export type Consent = 'granted' | 'denied' | null

export const CONSENT_KEY = 'glosstahko-consent-instagram'
const EVENT = 'glosstahko-consent-change'

let memory: Consent = null

export function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    if (value === 'granted' || value === 'denied') return value
    return memory
  } catch {
    return memory
  }
}

export function writeConsent(value: Consent): void {
  memory = value
  try {
    if (value === null) window.localStorage.removeItem(CONSENT_KEY)
    else window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // tallennus estetty: muistissa oleva arvo riittää tälle käynnille
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback) // toinen välilehti muutti valintaa
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

/** React-hook: palauttaa nykyisen suostumuksen ja päivittyy, kun se muuttuu missä tahansa komponentissa. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, readConsent, () => null)
}
