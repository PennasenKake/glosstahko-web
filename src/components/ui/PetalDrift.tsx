import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Terälehdet otsikon reunoilla (Minusta, Palvelut, UKK).
 *
 * Kuusi lehteä tai terälehteä leijuu hitaasti alas, keinuu sivulle ja häipyy:
 * sama kiireetön liike kuin muualla sivulla. Muodot ovat SVG:tä (lehti ja ruusun
 * terälehti), värit tulevat logon sävyistä (salvia, kulta, vaalea terrakotta).
 *
 * Tekniikka:
 * - Liike käyttää vain translate-, rotate- ja opacity-ominaisuuksia, joten selain
 *   piirtää sen näytönohjaimella eikä sivu asetu uudelleen.
 * - Animaatio pyörii vain, kun otsikko on näkyvissä (IntersectionObserver).
 * - Vähennetty liike (prefers-reduced-motion): lehdet ovat paikallaan.
 * - Koriste: aria-hidden, ei vaikuta tekstiin eikä napautuksiin.
 * Tyylit: styles/components.css (.petals, .petal).
 */
type Shape = 'leaf' | 'petal'
type Tone = 'sage' | 'gold' | 'blush'

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
  { shape: 'leaf', tone: 'sage', size: [1.1, 1.9], pos: { left: '-2.3rem', top: '0.4rem' }, rot: -28, sway: 0.8, spin: 40, dur: 11, delay: -4 },
  { shape: 'petal', tone: 'blush', size: [1.1, 1.3], pos: { left: '7%', top: '-1.3rem' }, rot: 18, sway: -0.6, spin: -35, dur: 13, delay: -9 },
  { shape: 'leaf', tone: 'gold', size: [0.8, 1.4], pos: { left: '-1.1rem', bottom: '0.2rem' }, rot: 62, sway: 0.5, spin: 55, dur: 12, delay: -2 },
  { shape: 'leaf', tone: 'gold', size: [1, 1.7], pos: { right: '-2.2rem', top: '0.2rem' }, rot: 30, sway: -0.8, spin: -45, dur: 10.5, delay: -6 },
  { shape: 'petal', tone: 'sage', size: [1, 1.2], pos: { right: '9%', top: '-1.1rem' }, rot: -15, sway: 0.6, spin: 30, dur: 14, delay: -11 },
  { shape: 'leaf', tone: 'blush', size: [0.85, 1.5], pos: { right: '-0.9rem', bottom: '0.3rem' }, rot: -58, sway: -0.5, spin: -50, dur: 12.5, delay: -3 },
]

/** Lehti: suipeneva muoto, keskisuoni ja kaksi sivusuonta */
function LeafShape() {
  return (
    <svg viewBox="0 0 24 40" focusable="false">
      <path d="M12 1.5C19.8 11 21.2 26 12 38.5C2.8 26 4.2 11 12 1.5Z" />
      <path className="petal__vein" d="M12 8V35M12 18l-4.2-4M12 25l5-4.6" />
    </svg>
  )
}

/** Ruusun terälehti: leveä, pehmeä muoto, jonka yläreunassa on pieni kärki */
function PetalShape() {
  return (
    <svg viewBox="0 0 28 34" focusable="false">
      <path d="M14 1.8C21 5.5 27.2 14 24.6 23.4C22.4 31.6 6.6 32 3.4 23.4C0.8 14.4 7 5.6 14 1.8Z" />
      <path className="petal__vein" d="M8.5 22.5C10.5 28 17.5 28.6 20.5 23.6" />
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
              width: `${p.size[0]}rem`,
              height: `${p.size[1]}rem`,
              '--rot': `${p.rot}deg`,
              '--sway': `${p.sway}rem`,
              '--spin': `${p.spin}deg`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
            } as CSSProperties
          }
        >
          {p.shape === 'leaf' ? <LeafShape /> : <PetalShape />}
        </span>
      ))}
    </div>
  )
}
