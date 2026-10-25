import { useEffect, useId, useRef, useState } from 'react'

/**
 * Köynnökset, jotka kasvavat heron alareunasta ylöspäin.
 *
 * Varsi piirtyy alhaalta ylös (stroke-dashoffset), ja lehdet puhkeavat esiin varren
 * kasvaessa: ensin alimmat, viimeisenä latvan lehdet. Mukana on salvianvihreitä lehtiä,
 * kullattuja viivapiirrettyjä lehtiä ja pieniä kultahiutaleita (kuten boho-kuvituksessa).
 * Kun kasvu on valmis, köynnös keinuu hyvin hitaasti tuulessa.
 *
 * Tekniikka:
 * - Pelkkää CSS-animaatiota (ei JavaScriptiä), joten se toimii heti esirenderöidystä sivusta.
 * - Lehtien paikat lasketaan varren Bezier-käyrältä moduulin latautuessa: sama tulos
 *   palvelimella ja selaimessa (ei hydraatiovirheitä).
 * - Vähennetty liike (prefers-reduced-motion): köynnös näkyy valmiina, ei liikettä.
 * - Koriste: aria-hidden, ei estä napautuksia. Asettelu: styles/sections.css (.hero__vine).
 */

type Pt = { x: number; y: number }
type Cubic = [Pt, Pt, Pt, Pt]

const W = 200
const H = 520
const GROW_S = 7 // varren kasvun kesto sekunteina

function bezier([p0, p1, p2, p3]: Cubic, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

/** Käyrän suuntakulma asteina (0 = ylös, myötäpäivään positiivinen) */
function heading(curve: Cubic, t: number): number {
  const a = bezier(curve, Math.max(0, t - 0.01))
  const b = bezier(curve, Math.min(1, t + 0.01))
  return (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI
}

type Kind = 'sage' | 'sageDark' | 'line' | 'gold'

type LeafSpec = { x: number; y: number; angle: number; scale: number; kind: Kind; t: number }

type VineSpec = {
  /** Varsi yhtenä Bezier-käyränä alhaalta ylös */
  curve: Cubic
  leaves: LeafSpec[]
  /** Kultahiutaleet: [t, sivuttaisetäisyys, koko] */
  flecks: { x: number; y: number; r: number; t: number }[]
  /** Pieni kiemura: [t, puoli] */
  tendrils: { x: number; y: number; angle: number; side: 1 | -1; t: number }[]
}

function build(curve: Cubic, startT: number, count: number, flip: 1 | -1): VineSpec {
  const kinds: Kind[] = ['sage', 'line', 'sageDark', 'sage', 'gold', 'sage', 'line', 'sageDark']
  const leaves: LeafSpec[] = []
  const flecks: VineSpec['flecks'] = []
  const tendrils: VineSpec['tendrils'] = []

  for (let i = 0; i < count; i++) {
    const t = startT + ((1 - startT - 0.03) * i) / (count - 1)
    const p = bezier(curve, t)
    const side = (i % 2 === 0 ? 1 : -1) * flip
    const grow = 1 - 0.5 * t // latvaa kohti pienempi
    const angle = heading(curve, t) + side * (48 + (i % 3) * 6)
    leaves.push({ x: p.x, y: p.y, angle, scale: grow * (1.4 + (i % 3) * 0.2), kind: kinds[i % kinds.length], t })
    // kultahiutale lehden vierelle
    if (i % 2 === 1) {
      const q = bezier(curve, Math.min(1, t + 0.025))
      flecks.push({ x: q.x + side * -11, y: q.y - 2, r: 1.8 + (i % 3) * 0.7, t })
    }
    // kiemura joka kolmannesta kohdasta
    if (i % 3 === 2) tendrils.push({ x: p.x, y: p.y, angle: heading(curve, t), side: (side * -1) as 1 | -1, t })
  }
  return { curve, leaves, flecks, tendrils }
}

export type VineVariant = 'a' | 'b' | 'c' | 'd'

const variants: Record<VineVariant, VineSpec> = {
  a: build(
    [
      { x: 108, y: H },
      { x: 30, y: 410 },
      { x: 150, y: 250 },
      { x: 78, y: 40 },
    ],
    0.08,
    13,
    1,
  ),
  b: build(
    [
      { x: 96, y: H },
      { x: 170, y: 420 },
      { x: 50, y: 270 },
      { x: 118, y: 70 },
    ],
    0.1,
    11,
    -1,
  ),
  // c ja d: lyhyemmät, hieman toisenlaiset muunnelmat osioiden reunoille
  c: build(
    [
      { x: 90, y: H },
      { x: 150, y: 440 },
      { x: 40, y: 350 },
      { x: 112, y: 150 },
    ],
    0.1,
    9,
    1,
  ),
  d: build(
    [
      { x: 110, y: H },
      { x: 52, y: 440 },
      { x: 160, y: 340 },
      { x: 84, y: 120 },
    ],
    0.1,
    10,
    -1,
  ),
}

/** Lehti kärki ylöspäin, tyvi origossa */
const LEAF = 'M0 0C-7 -7 -8 -21 0 -34C8 -21 7 -7 0 0Z'
const LEAF_VEIN = 'M0 -2V-27M0 -10L-3.6 -15M0 -10L3.6 -15M0 -18L-3 -22M0 -18L3 -22'

/**
 * `watch`: köynnös alkaa kasvaa vasta, kun se tulee ruudulle (osioiden reunakoristeet).
 * Ilman JavaScriptiä (tai vähennetyllä liikkeellä) se näkyy heti valmiina. Hero-köynnökset
 * kasvavat heti sivun avautuessa.
 */
export default function HeroVines({
  variant,
  side,
  className,
  watch = false,
}: {
  variant: VineVariant
  side: 'left' | 'right'
  className?: string
  watch?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!watch || !el) return
    if (typeof IntersectionObserver === 'undefined') {
      const t = window.setTimeout(() => setSeen(true), 0)
      return () => window.clearTimeout(t)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [watch])
  const spec = variants[variant]
  const [p0, p1, p2, p3] = spec.curve
  const stem = `M${p0.x} ${p0.y}C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`

  return (
    <svg
      ref={ref}
      className={`${className ?? 'hero__vine'} vine--${side}${watch ? ' vine--watch' : ''}${seen ? ' vine--seen' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset="0.5" stopColor="#d9b45e" />
          <stop offset="1" stopColor="#a98332" />
        </linearGradient>
      </defs>

      <g className="vine__sway">
        <path className="vine__stem" d={stem} pathLength={1} />

        {spec.tendrils.map((t, i) => (
          <g key={`t${i}`} transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${(t.angle + t.side * 70).toFixed(1)})`}>
            <path
              className="vine__tendril"
              d={`M0 0C${t.side * 9} -10 ${t.side * 1} -20 ${t.side * 8} -26C${t.side * 12} -29 ${t.side * 15} -25 ${t.side * 12} -22`}
              pathLength={1}
              style={{ animationDelay: `${(t.t * GROW_S).toFixed(2)}s` }}
            />
          </g>
        ))}

        {spec.leaves.map((leaf, i) => (
          <g
            key={i}
            transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.angle.toFixed(1)}) scale(${leaf.scale.toFixed(2)})`}
          >
            <g className="vine__leaf" style={{ animationDelay: `${(leaf.t * GROW_S * 0.92 + 0.3).toFixed(2)}s` }}>
              {leaf.kind === 'line' ? (
                <>
                  <path className="vine__leaf-line" d={LEAF} fill={`url(#${id}g)`} />
                  <path className="vine__leaf-line-vein" d={LEAF_VEIN} />
                </>
              ) : leaf.kind === 'gold' ? (
                <>
                  <path className="vine__leaf-gold" d={LEAF} fill={`url(#${id}g)`} />
                  <path className="vine__leaf-gold-vein" d={LEAF_VEIN} />
                </>
              ) : (
                <>
                  <path className={leaf.kind === 'sageDark' ? 'vine__leaf-sage vine__leaf-sage--dark' : 'vine__leaf-sage'} d={LEAF} />
                  <path className="vine__leaf-vein" d={LEAF_VEIN} />
                </>
              )}
            </g>
          </g>
        ))}

        {spec.flecks.map((f, i) => (
          <circle
            key={`f${i}`}
            className="vine__fleck"
            cx={f.x.toFixed(1)}
            cy={f.y.toFixed(1)}
            r={f.r.toFixed(1)}
            fill={`url(#${id}g)`}
            style={{ animationDelay: `${(f.t * GROW_S * 0.92 + 0.9).toFixed(2)}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
