import { describe, expect, it } from 'vitest'
import type { Service } from '../types'
import { formatDuration, formatPrice } from './format'

// Apufunktio: täyttää pakolliset kentät, jotta testeihin jää vain olennainen
const service = (overrides: Partial<Service>): Service => ({
  id: 'testi',
  name: 'Testipalvelu',
  price: 50,
  ...overrides,
})

describe('formatPrice', () => {
  it('näyttää tavallisen hinnan', () => {
    expect(formatPrice(service({ price: 55 }))).toBe('55 €')
  })

  it('näyttää hintahaarukan', () => {
    expect(formatPrice(service({ price: 48, priceMax: 52 }))).toBe('48–52 €')
  })

  it('näyttää "alk." ja tuntihinnan', () => {
    expect(formatPrice(service({ price: 170, priceFrom: true }))).toBe('alk. 170 €')
    expect(formatPrice(service({ price: 75, perHour: true }))).toBe('75 €/h')
  })

  it('lisäpalvelussa on plus-merkki', () => {
    expect(formatPrice(service({ price: 10, addon: true }))).toBe('+10 €')
    expect(formatPrice(service({ price: 5, priceFrom: true, addon: true }))).toBe('alk. +5 €')
  })
})

describe('formatDuration', () => {
  it('palauttaa null, jos kestoa ei ole', () => {
    expect(formatDuration(service({}))).toBeNull()
  })

  it('näyttää alle 3 tuntia minuutteina', () => {
    expect(formatDuration(service({ minutes: 45 }))).toBe('45 min')
    expect(formatDuration(service({ minutes: 179 }))).toBe('179 min')
  })

  it('näyttää 3 tuntia ja yli tunteina', () => {
    expect(formatDuration(service({ minutes: 180 }))).toBe('3 h')
    expect(formatDuration(service({ minutes: 210 }))).toBe('3 h 30 min')
  })

  it('näyttää kestohaarukan ja lisäpalvelun', () => {
    expect(formatDuration(service({ minutes: 150, minutesMax: 180 }))).toBe('150–180 min')
    expect(formatDuration(service({ minutes: 15, addon: true }))).toBe('+15 min')
  })
})
