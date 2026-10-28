import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'
import HeroVines from '../ui/HeroVines'
import InstagramFeed from '../ui/InstagramFeed'
import SectionHeading from '../ui/SectionHeading'

export default function About() {
  return (
    <section id="minusta" className="section" aria-labelledby="minusta-otsikko">
      <HeroVines variant="c" side="left" className="sidevine sidevine--about" watch />
      <span className="flora flora--right flora--edge-right flora--soft" aria-hidden="true" />
      <div className="container container--narrow">
        <SectionHeading id="minusta-otsikko" eyebrow="GlossTahko by Siiri" title="Minusta" petals />

        <p className="about__text" data-reveal>
          Moikka, olen Siiri – yrittäjä, GlossTahkon perustaja ja koulutettu
          parturi-kampaaja sekä sertifioitu kynsiteknikko.
        </p>
        <p className="about__text" data-reveal>
          Kolmen pienen lapsen ruuhkavuosien keskellä mussa syttyi lopullinen
          rohkeus ja palo luoda jotain aivan omaa ja uutta. Syntyi GlossTahko.
          Mun näköiseni brändi, joka on tehty tuomaan arkeen jotain kaunista.
        </p>
        <p className="about__text" data-reveal>
          GlossTahko sai alkunsa mun omasta, aidosta tarpeesta. Tiedän tasan
          tarkkaan, mitä arjen pyöritys, aikataulut ja jatkuva kiire ovat.
          Huomasin itse kaipaavani paikkaa ja hetkeä, jossa voi vain vetää
          henkeä. Lupaa nauttia, pysähtyä ja olla hetken olemassa vain itseään
          varten. Tänä päivänä se on meidän jokaisen perustarve,
          elämäntilanteesta riippumatta. Ja juuri sen hetken mä haluan tarjota
          sulle.
        </p>
        <p className="about__text" data-reveal>
          GlossTahkolla et saa palvelua liukuhihnatyyliin. Mun koko toimintani
          perusta nojaa pehmeään, kiireettömään palveluun. Varaan kalenterista
          sulle tietoisesti riittävästi aikaa, jotta kohtaaminen on rauhallinen,
          kiireetön ja yksilöllinen. Tämä on sun omaa ansaittua laatuaikaa arjen
          keskellä. Vaikka tunnelma on rentouttava ja pehmeä, laadusta ja
          turvallisuudesta emme tingi. Keskiössä ovat aina ehdoton laatu,
          tuoteturvallisuus ja huolellinen hygienia.
        </p>
      </div>

      {/* Ajanvaraus ja asiointi: kynnet Booksalonissa, kampaamoajat Instagram-viestillä tai puhelimitse */}
      <div className="container container--narrow about__booking">
        <h3 className="about__subtitle" data-reveal>
          Ajanvaraus ja asiointi
        </h3>
        <p className="about__text" data-reveal>
          Haluan tehdä hemmotteluhetkestäsi mahdollisimman sujuvan alusta
          loppuun. Löydät mun toimipisteen aivan Nilsiän keskustasta, mutta
          GlossTahko tarjoaa myös joustavaa, liikkuvaa palvelua suoraan
          luoksesi, esimerkiksi kotiin, mökille tai tapahtumaan Nilsiässä,
          Tahkolla ja lähialueilla.
        </p>

        <ul className="about__channels" data-reveal>
          <li className="about__channel">
            <h4 className="about__channel-title">Kynsipalvelut</h4>
            <p>
              Geelilakkaukset ja vahvistukset ovat varattavissa suoraan netissä
              sähköisen ajanvarauksen kautta ympäri vuorokauden.
            </p>
            <BookingButton label="Varaa kynsiaika" />
          </li>
          <li className="about__channel">
            <h4 className="about__channel-title">Kampaamopalvelut</h4>
            <p>
              Kampaamopuolen aikoja (värit, leikkaukset, hoidot ja kampaukset)
              on toistaiseksi tarjolla rajoitetusti. Tuplabuukkauksien
              välttämiseksi ajanvaraukset tehdään suoraan Instagram-viestillä tai
              puhelimitse.
            </p>
            <BookingButton label="Viesti Instagramissa" href={site.instagramUrl} variant="ghost" />
            <a className="about__phone" href={site.phoneHref}>
              tai soita {site.phone}
            </a>
          </li>
        </ul>

        <p className="about__text" data-reveal>
          Maksaminen onnistuu nykyaikaisesti ja joustavasti: korttimaksu kulkee
          mukanani omalla maksupäätteelläni.
        </p>
        <p className="about__closing" data-reveal>
          Tule juuri sellaisena kuin olet, ja anna itsellesi lupa pysähtyä!
        </p>
      </div>

      <div className="container about__feed" data-reveal>
        <InstagramFeed />
      </div>
    </section>
  )
}
