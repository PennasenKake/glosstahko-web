/**
 * Kasvikoriste (varsi ja lehdet) SVG:nä. Piirretään koodilla:
 * lehdet luodaan silmukalla, joten kuvaa ei tarvitse ladata tiedostona.
 *
 * `side` valitsee, kummassa laidassa koriste on (CSS peilaa oikean puolen).
 */
type SprigProps = {
  side: 'left' | 'right'
}

// Kahdeksan lehteä: Array.from tekee taulukon [0, 1, ... 7]
const leaves = Array.from({ length: 8 }, (_, i) => i)

export default function Sprig({ side }: SprigProps) {
  return (
    <svg
      className={`sprig sprig--${side}`}
      viewBox="0 0 60 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true" // koriste: ruudunlukija ohittaa
    >
      {/* Varsi: kaareva viiva alhaalta ylös */}
      <path d="M30 260 C 26 200 36 120 30 14" />

      {leaves.map((i) => {
        const y = 236 - i * 28 // jokainen lehti 28 yksikköä edellisen yläpuolelle
        const dir = i % 2 === 0 ? -1 : 1 // vuorotellen vasen ja oikea
        const cx = 30 + dir * 13
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={y}
            rx="12"
            ry="5.5"
            transform={`rotate(${dir * -35} ${cx} ${y})`}
          />
        )
      })}
    </svg>
  )
}
