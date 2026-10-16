import type { Service } from '../types'

type TimePrice = Pick<Service, 'minutes' | 'minutesMax' | 'price' | 'priceFrom' | 'addon'>

function minutesToText(min: number): string {
  if (min < 180) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export function formatDuration(s: TimePrice): string {
  const plus = s.addon ? '+' : ''
  if (s.minutesMax) return `${plus}${s.minutes}–${s.minutesMax} min`
  return `${plus}${minutesToText(s.minutes)}`
}

export function formatPrice(s: TimePrice): string {
  const from = s.priceFrom ? 'alk. ' : ''
  const plus = s.addon ? '+' : ''
  return `${from}${plus}${s.price} €`
}