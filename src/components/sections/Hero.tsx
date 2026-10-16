import BookingButton from '../ui/BookingButton'
// Kuvat tuodaan importilla: Vite pakkaa ne mukaan, lisää tiedostonimeen tiivisteen
// (välimuisti) ja antaa oikean polun julkaisussa.
import leaf from '../../assets/images/leaf.webp'

/**
 * Etusivun avaus. Sivun ainoa <h1>: Google ja ruudunlukijat
 * käyttävät sitä sivun pääotsikkona.
 *
 * Vasemmalla teksti ja painikkeet, oikealla logon sanamerkki ja lehvä
 * (ruudunlukijalle piilotettu koriste). Mobiilissa sarakkeet pinoutuvat.
 * Ulkoasu: styles/sections.css (.hero).
 */
export default function Hero() {
  return (
    <section id="etusivu" className="hero" aria-labelledby="hero-otsikko">
      <div className="container hero__grid">
        <div className="hero__text">
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

        {/* Logo-osa on koriste: header kertoo jo yrityksen nimen */}
        <div className="hero__logo" aria-hidden="true">
          <p className="hero__brand">
            <span className="hero__brand-main">Gloss</span>
            <span className="hero__brand-sub">Tahko</span>
          </p>
          {/* alt="" = koriste. width/height estävät sivun hyppäämisen kuvan latautuessa. */}
          <img className="hero__leaf" src={leaf} alt="" width={640} height={574} />
        </div>
      </div>
    </section>
  )
}
