import BookingButton from '../ui/BookingButton'

/**
 * Etusivun avaus. Sivun ainoa <h1>: Google ja ruudunlukijat
 * käyttävät sitä sivun pääotsikkona.
 */
export default function Hero() {
  return (
    <section id="etusivu" aria-labelledby="hero-otsikko">
      <p>Kynnet ja hiukset · Nilsiä ja Tahko</p>
      <h1 id="hero-otsikko">Kauneutta kiireettömästi</h1>
      <p>
        GlossTahko tarjoaa geelilakkaukset, kynnet, hiusten värjäykset ja
        juhlakampaukset saman katon alla Nilsiässä. Sesonkien aikana
        palvelu tulee myös mökille ja juhlapaikalle Tahkolla.
      </p>

      <BookingButton />
      <a href="#palvelut">Palvelut</a>
    </section>
  )
}