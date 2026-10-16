import type { Service } from '../types'

/**
 * Muuttaa minuutit tekstiksi.
 * Alle 3 tuntia näytetään minuutteina (105 -> "105 min"),
 * sitä pidemmät tunteina (210 -> "3 h 30 min").
 */
function minutesToText(min: number): string {
  if (min < 180) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/**
 * Palvelun kesto näytettävänä tekstinä.
 * Palauttaa null, jos kestoa ei ole annettu. Komponentti jättää
 * silloin keston kokonaan pois.
 * Esimerkit: "45 min", "150–180 min", "+15 min" (lisäpalvelu).
 */
export function formatDuration(s: Service): string | null {
  if (s.minutes === undefined) return null
  const plus = s.addon ? '+' : ''
  if (s.minutesMax) return `${plus}${s.minutes}–${s.minutesMax} min`
  return `${plus}${minutesToText(s.minutes)}`
}

/**
 * Palvelun hinta näytettävänä tekstinä.
 * Esimerkit: "55 €", "48–52 €", "alk. 170 €", "75 €/h", "alk. +5 €".
 */
export function formatPrice(s: Service): string {
  const from = s.priceFrom ? 'alk. ' : ''
  const plus = s.addon ? '+' : ''
  const amount = s.priceMax ? `${s.price}–${s.priceMax}` : `${s.price}`
  const unit = s.perHour ? ' €/h' : ' €'
  return `${from}${plus}${amount}${unit}`
}