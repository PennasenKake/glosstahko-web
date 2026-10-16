import { faq, goodToKnow } from '../../data/faq'
import SectionHeading from '../ui/SectionHeading'

/**
 * UKK-osio: ensin "Hyvä tietää" -kortit, sitten kysymykset haitarina.
 *
 * Haitari tehdään selaimen omalla <details>/<summary>-elementillä:
 * ei JavaScriptiä, toimii näppäimillä ja ruudunlukijalla valmiiksi.
 * Sama `name`-attribuutti tekee ryhmästä "yksi auki kerrallaan".
 * Sisältö: data/faq.ts.
 */
export default function Faq() {
  return (
    <section id="ukk" className="section" aria-labelledby="ukk-otsikko">
      <span className="flora flora--left flora--edge-left flora--soft" aria-hidden="true" />
      <div className="container">
        <SectionHeading id="ukk-otsikko" eyebrow="Hyvä tietää" title="Usein kysyttyä" />

        <ul className="info-grid">
          {goodToKnow.map((item) => (
            <li className="info-card" key={item.title}>
              <p className="info-card__title">{item.title}</p>
              <p className="info-card__text">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="faq__list">
          {faq.map((item, index) => (
            // key on pakollinen listoissa. open = ensimmäinen kysymys auki.
            <details className="faq__item" name="ukk" key={item.q} open={index === 0}>
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
