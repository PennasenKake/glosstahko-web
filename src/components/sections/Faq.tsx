import { faq, goodToKnow } from '../../data/faq'
import SectionHeading from '../ui/SectionHeading'

/**
 * UKK-osio: ensin "Hyvä tietää" -kortit, sitten kysymykset haitarina.
 * Haitari: natiivi <details>/<summary>, name="ukk" = yksi auki kerrallaan.
 */
export default function Faq() {
  return (
    <section id="ukk" className="section" aria-labelledby="ukk-otsikko">
      <span className="flora flora--left flora--edge-left flora--soft" aria-hidden="true" />
      <div className="container">
        <SectionHeading id="ukk-otsikko" eyebrow="Hyvä tietää" title="Usein kysyttyä" petals />

        <ul className="info-grid">
          {goodToKnow.map((item) => (
            <li className="info-card" key={item.title} data-reveal>
              <p className="info-card__title">{item.title}</p>
              <p className="info-card__text">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="faq__list">
          {faq.map((item, index) => (
            <details
              className="faq__item"
              name="ukk"
              key={item.q}
              open={index === 0}
              data-reveal
            >
              <summary className="faq__summary">
                <h3 className="faq__question">{item.q}</h3>
              </summary>
              <p className="faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
