import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

/**
 * Leijuvat eukalyptuksen lehdet otsikon reunoilla (Minusta, Palvelut, UKK).
 *
 * Kuusi kiiltävän kultaista lehteä leijuu hitaasti alas, keinuu sivulle ja häipyy.
 * Lehdet ovat boho-tyylin eukalyptusta: pyöreä "hopeadollari"-lehti ja kapeampi
 * soikea lehti, kummassakin lyhyt varsi, keskisuoni ja sivusuonet. Kulta syntyy
 * SVG-liukuvärillä (vaalea > kulta > tumma) ja pienellä kiiltoläikällä, joka
 * välähtää hitaasti (.petal__shine).
 *
 * Tekniikka:
 * - Liike käyttää vain translate-, rotate- ja opacity-ominaisuuksia, joten selain
 *   piirtää sen näytönohjaimella eikä sivu asetu uudelleen.
 * - Animaatio pyörii vain, kun otsikko on näkyvissä (IntersectionObserver).
 * - Vähennetty liike (prefers-reduced-motion): lehdet ovat paikallaan.
 * - Koriste: aria-hidden, ei vaikuta tekstiin eikä napautuksiin.
 * Tyylit: styles/components.css (.petals, .petal).
 */
type Shape = 'round' | 'oval'
type Tone = 'gold' | 'champagne' | 'amber'

type PetalConfig = {
  shape: Shape
  tone: Tone
  /** Koko rem-yksiköissä (leveys, korkeus) */
  size: [number, number]
  /** Sijainti otsikon laatikossa */
  pos: Pick<CSSProperties, 'left' | 'right' | 'top' | 'bottom'>
  /** Lähtökulma asteina */
  rot: number
  /** Sivuttaiskeinunta rem-yksiköissä (negatiivinen = vasemmalle) */
  sway: number
  /** Kiertymä putoamisen aikana asteina */
  spin: number
  /** Kierroksen kesto sekunteina */
  dur: number
  /** Negatiivinen viive: lehdet eivät lähde liikkeelle yhtä aikaa */
  delay: number
}

const petals: PetalConfig[] = [
  { shape: 'round', tone: 'gold', size: [1.5, 1.9], pos: { left: '-2.6rem', top: '0.2rem' }, rot: -24, sway: 0.8, spin: 40, dur: 11, delay: -4 },
  { shape: 'oval', tone: 'champagne', size: [1.1, 1.8], pos: { left: '7%', top: '-1.4rem' }, rot: 18, sway: -0.6, spin: -35, dur: 13, delay: -9 },
  { shape: 'round', tone: 'amber', size: [1.1, 1.4], pos: { left: '-1.2rem', bottom: '0.1rem' }, rot: 58, sway: 0.5, spin: 55, dur: 12, delay: -2 },
  { shape: 'oval', tone: 'gold', size: [1.2, 2], pos: { right: '-2.5rem', top: '0.1rem' }, rot: 28, sway: -0.8, spin: -45, dur: 10.5, delay: -6 },
  { shape: 'round', tone: 'champagne', size: [1.3, 1.65], pos: { right: '9%', top: '-1.3rem' }, rot: -14, sway: 0.6, spin: 30, dur: 14, delay: -11 },
  { shape: 'oval', tone: 'amber', size: [1, 1.7], pos: { right: '-1rem', bottom: '0.2rem' }, rot: -56, sway: -0.5, spin: -50, dur: 12.5, delay: -3 },
]

/** Liukuvärin sävyt (alku, keski, loppu) */
const stops: Record<Tone, [string, string, string]> = {
  gold: ['#f1d98f', '#d4af5a', '#a98332'],
  champagne: ['#f2d98f', '#dab75f', '#ad8a3b'],
  amber: ['#ecc98a', '#c89a4a', '#94682a'],
}

/** Pyöreä eukalyptuksen lehti ("hopeadollari"): leveä, hentoinen kärki, lyhyt varsi */
const roundPath = 'M15 34C6 33 1.5 25.5 3.2 16.5C4.8 8 10 2.6 15 1.2C20 2.6 25.2 8 26.8 16.5C28.5 25.5 24 33 15 34Z'
const roundVeins = 'M15 40V5M15 28L9.2 22.4M15 28L20.8 22.4M15 19.5L10.4 14.6M15 19.5L19.6 14.6'
/** Soikea eukalyptuksen lehti: kapeampi ja pidempi */
const ovalPath = 'M15 36C7.5 34 4.5 24 6 15C7.4 7.2 11.4 2.2 15 0.8C18.6 2.2 22.6 7.2 24 15C25.5 24 22.5 34 15 36Z'
const ovalVeins = 'M15 41V5M15 29L10.4 23.4M15 29L19.6 23.4M15 20L11 14.8M15 20L19 14.8'

function EucalyptusLeaf({ shape, tone }: { shape: Shape; tone: Tone }) {
  // useId on sama palvelimella ja selaimessa; kaksoispisteet pois, jotta id kelpaa url(#...)-viitteeseen
  const id = useId().replace(/:/g, '')
  const [c0, c1, c2] = stops[tone]
  const round = shape === 'round'
  return (
    <svg viewBox="0 -2 30 46" focusable="false">
      <defs>
        <linearGradient id={id} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.45" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* Varsi */}
      <path className="petal__stem" d={round ? 'M15 33V41' : 'M15 35V43'} />
      {/* Lehden runko */}
      <path className="petal__body" d={round ? roundPath : ovalPath} fill={`url(#${id})`} />
      {/* Suonet */}
      <path className="petal__vein" d={round ? roundVeins : ovalVeins} />
      {/* Kiiltoläikkä: vasen reuna, välähtää hitaasti */}
      <path
        className="petal__shine"
        d={round ? 'M8.5 8.5C5.2 13.2 5 20.5 8 25.5C7.6 19.5 8.4 13 12 6.8C10.8 7.2 9.6 7.8 8.5 8.5Z' : 'M9.6 8.4C7.2 13.6 7.4 21 9.8 27C9.8 20.5 11 13.4 14 6.4C12.4 6.8 10.9 7.5 9.6 8.4Z'}
      />
    </svg>
  )
}

export default function PetalDrift() {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  // Animaatio pyörii vain näkyvissä olevalle otsikolle
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLive(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), {
      rootMargin: '80px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`petals${live ? ' petals--live' : ''}`} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal petal--${p.tone}`}
          style={
            {
              ...p.pos,
              width: `${(p.size[0] * 1.15).toFixed(2)}rem`,
              height: `${(p.size[1] * 1.15).toFixed(2)}rem`,
              '--rot': `${p.rot}deg`,
              '--sway': `${p.sway}rem`,
              '--spin': `${p.spin}deg`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--glint-delay': `${p.delay * -0.37}s`,
            } as CSSProperties
          }
        >
          <EucalyptusLeaf shape={p.shape} tone={p.tone} />
        </span>
      ))}
    </div>
  )
}
