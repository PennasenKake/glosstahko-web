import { useEffect } from 'react'

/**
 * Paljastusanimaatio (kuten Lumoa Design ja Diamia Spa & Lounge): sisältö liukuu
 * pehmeästi näkyviin, kun se tulee ruudulle, ja sivun avautuessa heron osat tulevat
 * peräkkäin. Liike on tarkoituksella kiireetön, kuten sivun lupaus.
 *
 * Käyttö: lisää elementille `data-reveal` (tai `data-reveal="fade" | "write" | "grow"`).
 * Valinnainen `data-delay="600"` kiinnittää viiveen millisekunteina (esim. heron järjestys),
 * muuten samaan aikaan ruudulle tulevat porrastetaan automaattisesti.
 * Ulkoasu: styles/refine.css.
 *
 * - Esirenderöity HTML näkyy normaalisti ilman JavaScriptiä (piilotus vaatii html.has-js).
 * - Vähennetty liike (prefers-reduced-motion): kaikki näkyy heti.
 * - Paljastuksen jälkeen `data-reveal` poistetaan, jotta animaation transition ei jää
 *   häiritsemään elementin omia hover-tehosteita.
 */

export const REVEAL = {
  rootMargin: '0px 0px -10% 0px', // paljastus vähän ennen ruudun alareunaa
  staggerMs: 120, // porrastus samaan aikaan tulevien välillä
  maxSteps: 6,
  firstBatchDelayMs: 150, // sivun avautuessa ensimmäinen erä alkaa hieman viiveellä
  cleanupAfterMs: 2400, // pisin animaatio (1,8 s) + varaa
} as const

export type RevealDeps = {
  items: HTMLElement[]
  html: HTMLElement
  reduceMotion: boolean
  createObserver: (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit,
  ) => IntersectionObserver | null
  setTimer: (fn: () => void, ms: number) => number
  clearTimer: (id: number) => void
}

/** Logiikka erillään Reactista ja selaimesta, jotta se on testattavissa. */
export function initReveal(deps: RevealDeps): () => void {
  const { items, html, reduceMotion, createObserver, setTimer, clearTimer } = deps

  const observer = reduceMotion
    ? null
    : createObserver(handle, { rootMargin: REVEAL.rootMargin })

  if (!observer) {
    items.forEach((el) => el.setAttribute('data-rv', 'now'))
    html.classList.add('rv-ready')
    return () => {}
  }

  const timers: number[] = []
  let firstBatch = true

  function finish(el: HTMLElement, afterMs: number) {
    timers.push(
      setTimer(() => {
        el.removeAttribute('data-reveal')
        el.removeAttribute('data-rv')
        el.removeAttribute('data-delay')
        el.style.removeProperty('--rv-delay')
      }, afterMs),
    )
  }

  function handle(entries: IntersectionObserverEntry[]) {
    // Ruudulle tulevat ylhäältä alas ja vasemmalta oikealle
    const entering = entries
      .filter((entry) => entry.isIntersecting)
      .sort(
        (a, b) =>
          a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left,
      )

    entering.forEach((entry, index) => {
      const el = entry.target as HTMLElement
      const fixed = el.getAttribute('data-delay')
      const staggered =
        (firstBatch ? REVEAL.firstBatchDelayMs : 0) + Math.min(index, REVEAL.maxSteps) * REVEAL.staggerMs
      const delay = fixed !== null && Number.isFinite(Number(fixed)) ? Number(fixed) : staggered
      el.style.setProperty('--rv-delay', `${delay}ms`)
      el.setAttribute('data-rv', 'in')
      observer!.unobserve(el)
      finish(el, delay + REVEAL.cleanupAfterMs)
    })

    // Jo ohitetut (esim. ankkurilinkillä hypätty ohi): näytetään heti ilman animaatiota
    entries
      .filter((entry) => !entry.isIntersecting && entry.boundingClientRect.top < 0)
      .forEach((entry) => {
        const el = entry.target as HTMLElement
        el.setAttribute('data-rv', 'now')
        observer!.unobserve(el)
        finish(el, 50)
      })

    firstBatch = false
  }

  items.forEach((el) => observer.observe(el))
  html.classList.add('rv-ready')

  return () => {
    observer.disconnect()
    timers.forEach(clearTimer)
  }
}

export function useRevealOnScroll() {
  useEffect(() => {
    return initReveal({
      items: Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])')),
      html: document.documentElement,
      reduceMotion:
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window),
      createObserver: (callback, options) => new IntersectionObserver(callback, options),
      setTimer: (fn, ms) => window.setTimeout(fn, ms),
      clearTimer: (id) => window.clearTimeout(id),
    })
  }, [])
}
