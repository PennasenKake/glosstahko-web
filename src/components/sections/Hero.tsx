import BookingButton from '../ui/BookingButton'
import Sprig from '../ui/Sprig'

/**
 * Etusivun avaus. Sivun ainoa <h1>: Google ja ruudunlukijat
 * käyttävät sitä sivun pääotsikkona.
 *
 * Esittelyteksti ja chipit ovat omassa Intro-komponentissaan heron alla.
 * Ulkoasu: styles/sections.css (.hero).
 */
export default function Hero() {
  return (
    <section id="etusivu" className="hero" aria-labelledby="hero-otsikko">
      {/* Koristeet reunoilla (aria-hidden, ei sisältöä) */}
      <Sprig side="left" />
      <Sprig side="right" />

      <div className="container">
        <p className="hero__eyebrow">Kynnet &amp; hiukset · Nilsiä ja Tahko</p>

        {/* Yksi h1, kaksi tyyliteltyä osaa. Ruudunlukija lukee: "Kauneutta kiireettömästi". */}
        <h1 id="hero-otsikko">
          <span className="hero__script">Kauneutta</span>{' '}
          <span className="hero__caps">kiireettömästi</span>
        </h1>

        <div className="hero__actions">
          <BookingButton variant="light" />
          <a className="btn btn--ghost" href="#palvelut">
            Katso palvelut
          </a>
        </div>
      </div>
    </section>
  )
}
