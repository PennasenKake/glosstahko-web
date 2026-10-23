import { describe, expect, it } from 'vitest'
import { initReveal, REVEAL } from './useRevealOnScroll'
import type { RevealDeps } from './useRevealOnScroll'

/** Kevyt kopio elementistä: riittää logiikan testaamiseen ilman selainta. */
function fakeEl(name: string, attrs: Record<string, string> = {}) {
  const a = new Map(Object.entries(attrs))
  const style = new Map<string, string>()
  return {
    name,
    setAttribute: (k: string, v: string) => void a.set(k, v),
    getAttribute: (k: string) => a.get(k) ?? null,
    removeAttribute: (k: string) => void a.delete(k),
    style: {
      setProperty: (k: string, v: string) => void style.set(k, v),
      removeProperty: (k: string) => void style.delete(k),
    },
    attrs: a,
    css: style,
  }
}
type Fake = ReturnType<typeof fakeEl>

function setup(reduceMotion = false, noObserver = false) {
  const html = { classList: { added: [] as string[], add(c: string) { this.added.push(c) } } }
  const observed: Fake[] = []
  const unobserved: Fake[] = []
  let callback: IntersectionObserverCallback = () => {}
  const timers: { fn: () => void; ms: number; id: number; cleared: boolean }[] = []

  const deps = (items: Fake[]): RevealDeps => ({
    items: items as unknown as HTMLElement[],
    html: html as unknown as HTMLElement,
    reduceMotion,
    createObserver: (cb) => {
      if (noObserver) return null
      callback = cb
      return {
        observe: (el: Fake) => void observed.push(el),
        unobserve: (el: Fake) => void unobserved.push(el),
        disconnect: () => {},
      } as unknown as IntersectionObserver
    },
    setTimer: (fn, ms) => {
      const id = timers.length + 1
      timers.push({ fn, ms, id, cleared: false })
      return id
    },
    clearTimer: (id) => {
      const t = timers.find((x) => x.id === id)
      if (t) t.cleared = true
    },
  })

  const entry = (el: Fake, isIntersecting: boolean, top: number, left = 0) =>
    ({ target: el, isIntersecting, boundingClientRect: { top, left } }) as unknown as IntersectionObserverEntry

  return { html, observed, unobserved, timers, deps, entry, fire: (e: IntersectionObserverEntry[]) => callback(e, {} as IntersectionObserver) }
}

describe('initReveal', () => {
  it('tarkkailee kaikkia elementtejä ja merkitsee valmiiksi (rv-ready)', () => {
    const s = setup()
    const items = [fakeEl('a'), fakeEl('b')]
    initReveal(s.deps(items))
    expect(s.observed).toHaveLength(2)
    expect(s.html.classList.added).toContain('rv-ready')
  })

  it('porrastaa samaan aikaan tulevat ylhäältä alas ja antaa ensimmäiselle erälle viiveen', () => {
    const s = setup()
    const [a, b, c] = [fakeEl('a'), fakeEl('b'), fakeEl('c')]
    initReveal(s.deps([a, b, c]))
    // annetaan epäjärjestyksessä: c ylimpänä
    s.fire([s.entry(a, true, 300), s.entry(b, true, 500), s.entry(c, true, 100)])
    expect(c.css.get('--rv-delay')).toBe(`${REVEAL.firstBatchDelayMs}ms`)
    expect(a.css.get('--rv-delay')).toBe(`${REVEAL.firstBatchDelayMs + REVEAL.staggerMs}ms`)
    expect(b.css.get('--rv-delay')).toBe(`${REVEAL.firstBatchDelayMs + 2 * REVEAL.staggerMs}ms`)
    expect([a, b, c].every((el) => el.attrs.get('data-rv') === 'in')).toBe(true)
    expect(s.unobserved).toHaveLength(3)
  })

  it('myöhemmät erät eivät saa ensimmäisen erän viivettä', () => {
    const s = setup()
    const [a, b] = [fakeEl('a'), fakeEl('b')]
    initReveal(s.deps([a, b]))
    s.fire([s.entry(a, true, 100)])
    s.fire([s.entry(b, true, 900)])
    expect(b.css.get('--rv-delay')).toBe('0ms')
  })

  it('data-delay kiinnittää viiveen (heron järjestys)', () => {
    const s = setup()
    const script = fakeEl('script', { 'data-delay': '350' })
    initReveal(s.deps([script]))
    s.fire([s.entry(script, true, 300)])
    expect(script.css.get('--rv-delay')).toBe('350ms')
  })

  it('ohitetut (ruudun yläpuolella) näytetään heti ilman animaatiota', () => {
    const s = setup()
    const above = fakeEl('above')
    initReveal(s.deps([above]))
    s.fire([s.entry(above, false, -400)])
    expect(above.attrs.get('data-rv')).toBe('now')
    expect(s.unobserved).toContain(above)
  })

  it('alapuolella olevat jäävät odottamaan', () => {
    const s = setup()
    const below = fakeEl('below')
    initReveal(s.deps([below]))
    s.fire([s.entry(below, false, 1500)])
    expect(below.attrs.has('data-rv')).toBe(false)
    expect(s.unobserved).toHaveLength(0)
  })

  it('siivoaa attribuutit animaation jälkeen (elementin omat transitiot palaavat)', () => {
    const s = setup()
    const el = fakeEl('el', { 'data-reveal': 'true', 'data-delay': '100' })
    initReveal(s.deps([el]))
    s.fire([s.entry(el, true, 200)])
    const cleanup = s.timers.at(-1)!
    expect(cleanup.ms).toBe(100 + REVEAL.cleanupAfterMs)
    cleanup.fn()
    expect(el.attrs.has('data-reveal')).toBe(false)
    expect(el.attrs.has('data-rv')).toBe(false)
    expect(el.css.has('--rv-delay')).toBe(false)
  })

  it('vähennetty liike: kaikki näkyy heti eikä kuunnella vieritystä', () => {
    const s = setup(true)
    const items = [fakeEl('a'), fakeEl('b')]
    initReveal(s.deps(items))
    expect(items.every((el) => el.attrs.get('data-rv') === 'now')).toBe(true)
    expect(s.observed).toHaveLength(0)
    expect(s.html.classList.added).toContain('rv-ready')
  })

  it('ilman IntersectionObserveria kaikki näkyy heti', () => {
    const s = setup(false, true)
    const el = fakeEl('a')
    initReveal(s.deps([el]))
    expect(el.attrs.get('data-rv')).toBe('now')
  })

  it('purku pysäyttää ajastimet', () => {
    const s = setup()
    const el = fakeEl('a')
    const stop = initReveal(s.deps([el]))
    s.fire([s.entry(el, true, 100)])
    stop()
    expect(s.timers.every((t) => t.cleared)).toBe(true)
  })
})
