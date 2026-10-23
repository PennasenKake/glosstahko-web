import PetalDrift from './PetalDrift'

/**
 * Osion otsikko: pieni ylärivi (eyebrow) ja iso h2.
 * Sama rakenne joka osiossa, joten se on oma komponenttinsa.
 *
 * `id` annetaan propsina, koska osion aria-labelledby viittaa siihen.
 * `petals` näyttää kultaiset terälehdet otsikon reunoilla (Minusta, Palvelut, UKK).
 * `data-reveal`: otsikko paljastuu vieritettäessä ja sen koriste piirtyy perässä.
 */
type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  petals?: boolean
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  petals = false,
}: SectionHeadingProps) {
  return (
    <header className={`section-heading${petals ? ' section-heading--petals' : ''}`} data-reveal>
      {petals && <PetalDrift />}
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
    </header>
  )
}
