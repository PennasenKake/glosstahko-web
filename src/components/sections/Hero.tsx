import BookingButton from '../ui/BookingButton'
import HeroVines from '../ui/HeroVines'
// Kuvat tuodaan importilla: Vite pakkaa ne mukaan, lisää tiedostonimeen tiivisteen
// (välimuisti) ja antaa oikean polun julkaisussa.
import leaf from '../../assets/images/leaf.webp'

/**
 * Etusivun avaus. Sivun ainoa <h1>: Google ja ruudunlukijat
 * käyttävät sitä sivun pääotsikkona.
 *
 * Vasemmalla teksti ja painikkeet, oikealla logon sanamerkki ja lehvä (ruudunlukijalle
 * piilotettu koriste). Kasvavat köynnökset ovat heron ulkoreunoilla sisällön vierellä.
 * Mobiilissa sarakkeet pinoutuvat ja sanamerkki näkyy myös puhelimella.
 * Ulkoasu: styles/sections.css (.hero).
 */
export default function Hero() {
  return (
    <section id="etusivu" className="hero" aria-labelledby="hero-otsikko">
      {/* Köynnökset kasvavat heron alareunasta ylös ulkoreunoilla, joilla ei ole tekstiä tai muuta sisältöä */}
      <HeroVines variant="a" side="left" className="hero__vine hero__vine--left" />
      <HeroVines variant="b" side="right" className="hero__vine hero__vine--right" />

      <div className="container hero__grid">
        <div className="hero__text">
          <p className="hero__eyebrow" data-reveal data-delay="100">Kynnet &amp; hiukset · Nilsiä ja Tahko</p>

          {/* Yksi h1, kaksi tyyliteltyä osaa. Ruudunlukija lukee: "Kauneutta kiireettömästi". */}
          <h1 id="hero-otsikko">
            <span className="hero__script" data-reveal="write" data-delay="200">
              <span className="write-clip">Kauneutta</span>
            </span>{' '}
            <span className="hero__caps" data-reveal data-delay="1050">
              kiireettömästi
            </span>
          </h1>

          <div className="hero__actions" data-reveal data-delay="1350">
            <BookingButton variant="light" />
            <a className="btn btn--ghost" href="#palvelut">
              Katso palvelut
            </a>
          </div>
        </div>

        {/* Logo-osa on koriste: header kertoo jo yrityksen nimen */}
        <div className="hero__logo" aria-hidden="true">
          <p className="hero__brand" data-reveal="fade" data-delay="600">
            <span className="hero__brand-main">Gloss</span>
            <span className="hero__brand-sub">Tahko</span>
          </p>
          {/* alt="" = koriste. width/height estävät sivun hyppäämisen kuvan latautuessa. */}
          <img
            className="hero__leaf"
            src={leaf}
            alt=""
            width={640}
            height={574}
            data-reveal="grow"
            data-delay="900"
          />
        </div>
      </div>
    </section>
  )
}
