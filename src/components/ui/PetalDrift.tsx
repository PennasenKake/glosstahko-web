import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

/**
 * Leijuvat kultaiset eukalyptuksen lehdet otsikon sivuilla (Minusta, Palvelut, UKK).
 *
 * Lehdet on piirretty boho-kuvituksen mukaan: kapea kullattu lehti, pelkkä kultainen
 * ääriviiva (viivapiirros), pieni oksa jossa on vuorottain lehtiä, pyöreä eukalyptuslehti
 * ja kultahiutale. Kulta syntyy SVG-liukuvärillä (vaalea > kulta > tumma) ja pienellä
 * kiiltoläikällä, joka välähtää hitaasti (.petal__shine).
 *
 * Sijoittelu: lehdet pysyvät otsikon laatikon ulkopuolella, vasemmalla ja oikealla,
 * eivätkä laskeudu tekstin päälle. Vasemman puolen lehdet keinuvat vasemmalle ja oikean
 * puolen oikealle (poispäin tekstistä). Kapealla näytöllä lehtiä on vähemmän ja ne ovat
 * pienempiä.
 *
 * Tekniikka:
 * - Liike käyttää vain translate-, rotate- ja opacity-ominaisuuksia, joten selain
 *   piirtää sen näytönohjaimella eikä sivu asetu uudelleen.
 * - Animaatio pyörii vain, kun otsikko on näkyvissä (IntersectionObserver).
 * - Vähennetty liike (prefers-reduced-motion): lehdet ovat paikallaan.
 * - Koriste: aria-hidden, ei vaikuta tekstiin eikä napautuksiin.
 * Tyylit: styles/components.css (.petals, .petal).
 */
type Shape = 'slender' | 'line' | 'sprig' | 'round' | 'fleck'
type Tone = 'gold' | 'champagne' | 'amber'
type Side = 'left' | 'right'

type PetalConfig = {
  shape: Shape
  tone: Tone
  side: Side
  /** Koko rem-yksiköissä (leveys, korkeus) */
  size: [number, number]
  /** Etäisyys otsikon laatikon reunasta ulospäin (rem) ja korkeus laatikossa (%) */
  out: number
  top: number
  /** Lähtökulma asteina */
  rot: number
  /** Sivuttaiskeinunta rem-yksiköissä, aina ulospäin tekstistä */
  sway: number
  /** Kiertymä putoamisen aikana asteina */
  spin: number
  /** Kierroksen kesto sekunteina */
  dur: number
  /** Negatiivinen viive: lehdet eivät lähde liikkeelle yhtä aikaa */
  delay: number
}

// Järjestys on tärkeä: kapealla näytöllä näkyvät vain 1, 2, 4 ja 5 (ks. components.css)
const petals: PetalConfig[] = [
  { shape: 'sprig', tone: 'gold', side: 'left', size: [1.8, 3.1], out: 3, top: 4, rot: -18, sway: 0.7, spin: 32, dur: 12, delay: -4 },
  { shape: 'line', tone: 'champagne', side: 'left', size: [1.5, 2.6], out: 2.2, top: 50, rot: 24, sway: 0.5, spin: -30, dur: 13, delay: -9 },
  { shape: 'fleck', tone: 'amber', side: 'left', size: [0.6, 0.6], out: 3.6, top: 70, rot: 0, sway: 0.4, spin: 0, dur: 9, delay: -2 },
  { shape: 'slender', tone: 'gold', side: 'right', size: [1.3, 2.8], out: 2.8, top: 0, rot: 26, sway: 0.7, spin: -40, dur: 11, delay: -6 },
  { shape: 'round', tone: 'champagne', side: 'right', size: [1.6, 2], out: 2.1, top: 52, rot: -14, sway: 0.5, spin: 30, dur: 14, delay: -11 },
  { shape: 'fleck', tone: 'gold', side: 'right', size: [0.55, 0.55], out: 3.4, top: 78, rot: 0, sway: 0.4, spin: 0, dur: 10, delay: -5 },
]

/** Liukuvärin sävyt (alku, keski, loppu) */
const stops: Record<Tone, [string, string, string]> = {
  gold: ['#f6e3a1', '#d9b45e', '#a98332'],
  champagne: ['#f7e6ac', '#e0c06c', '#b08e3e'],
  amber: ['#f0d093', '#cf9f4c', '#94682a'],
}

const slenderPath = 'M15 42C8.5 32 7.5 15 15 1C22.5 15 21.5 32 15 42Z'
const slenderVeins = 'M15 42V6M15 30L10.6 24M15 30L19.4 24M15 21L11.4 15.6M15 21L18.6 15.6'
const linePath = 'M15 41C7 33 5.5 17 15 1.5C24.5 17 23 33 15 41Z'
const lineVeins = 'M15 41V6M15 29L10 22.5M15 29L20 22.5M15 19.5L11.2 14M15 19.5L18.8 14'
const roundPath = 'M15 34C6 33 1.5 25.5 3.2 16.5C4.8 8 10 2.6 15 1.2C20 2.6 25.2 8 26.8 16.5C28.5 25.5 24 33 15 34Z'
const roundVeins = 'M15 40V5M15 28L9.2 22.4M15 28L20.8 22.4M15 19.5L10.4 14.6M15 19.5L19.6 14.6'
/** Pieni lehti oksan varrella: kärki ylös, tyvi origossa */
const leaflet = 'M0 0C-3.4 -3.8 -3.8 -10 0 -15.5C3.8 -10 3.4 -3.8 0 0Z'
/** Oksan lehdet: [y, puoli, koko] */
const sprigLeaves: [number, 1 | -1, number][] = [
  [37, -1, 0.95],
  [32, 1, 0.95],
  [26.5, -1, 0.85],
  [21, 1, 0.85],
  [15.5, -1, 0.7],
  [10.5, 1, 0.7],
]

function Leaf({ shape, tone }: { shape: Shape; tone: Tone }) {
  // useId on sama palvelimella ja selaimessa; kaksoispisteet pois, jotta id kelpaa url(#...)-viitteeseen
  const id = useId().replace(/:/g, '')
  const [c0, c1, c2] = stops[tone]
  const fill = `url(#${id})`

  let body
  switch (shape) {
    case 'slender':
      body = (
        <>
          <path className="petal__stem" d="M15 40V46" />
          <path className="petal__body" d={slenderPath} fill={fill} />
          <path className="petal__vein" d={slenderVeins} />
          <path className="petal__shine" d="M10.2 9C8 15 8.6 25 11 32C11 24 12 15.6 14 7.4C12.6 7.8 11.4 8.2 10.2 9Z" />
        </>
      )
      break
    case 'line':
      // Viivapiirros: vain kultainen ääriviiva ja suonet, kevyt kultainen täyttö
      body = (
        <>
          <path className="petal__stem" d="M15 39V46" />
          <path className="petal__outline" d={linePath} fill={fill} />
          <path className="petal__outline-vein" d={lineVeins} />
        </>
      )
      break
    case 'sprig':
      body = (
        <>
          <path className="petal__stem" d="M15 46C14 36 16 16 15 3" />
          {sprigLeaves.map(([y, side, scale], i) => (
            <path
              key={i}
              className="petal__body"
              d={leaflet}
              fill={fill}
              transform={`translate(15 ${y}) rotate(${side * 52}) scale(${scale})`}
            />
          ))}
          <path className="petal__body" d={leaflet} fill={fill} transform="translate(15 4.5) scale(0.7)" />
        </>
      )
      break
    case 'round':
      body = (
        <>
          <path className="petal__stem" d="M15 33V41" />
          <path className="petal__body" d={roundPath} fill={fill} />
          <path className="petal__vein" d={roundVeins} />
          <path className="petal__shine" d="M8.5 8.5C5.2 13.2 5 20.5 8 25.5C7.6 19.5 8.4 13 12 6.8C10.8 7.2 9.6 7.8 8.5 8.5Z" />
        </>
      )
      break
    default:
      // Kultahiutale
      return (
        <svg viewBox="0 0 10 10" focusable="false">
          <defs>
            <radialGradient id={id} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor={c0} />
              <stop offset="0.55" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </radialGradient>
          </defs>
          <circle cx="5" cy="5" r="4" fill={fill} />
        </svg>
      )
  }

  return (
    <svg viewBox="0 -2 30 50" focusable="false">
      <defs>
        <linearGradient id={id} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.45" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {body}
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
          className={`petal petal--${p.tone} petal--${p.shape} petal--${p.side}`}
          style={
            {
              [p.side]: `${-p.out}rem`,
              top: `${p.top}%`,
              width: `${p.size[0]}rem`,
              height: `${p.size[1]}rem`,
              '--rot': `${p.rot}deg`,
              // Keinunta aina ulospäin: vasen puoli negatiivinen, oikea positiivinen
              '--sway': `${p.side === 'left' ? -p.sway : p.sway}rem`,
              '--spin': `${p.spin}deg`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--glint-delay': `${p.delay * -0.37}s`,
            } as CSSProperties
          }
        >
          <Leaf shape={p.shape} tone={p.tone} />
        </span>
      ))}
    </div>
  )
}
