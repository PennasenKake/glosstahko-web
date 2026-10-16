/**
 * Osion otsikko: pieni ylärivi (eyebrow) ja iso h2.
 * Sama rakenne joka osiossa, joten se on oma komponenttinsa.
 *
 * `id` annetaan propsina, koska osion aria-labelledby viittaa siihen.
 */
type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
}

export default function SectionHeading({ id, eyebrow, title }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
    </header>
  )
}
