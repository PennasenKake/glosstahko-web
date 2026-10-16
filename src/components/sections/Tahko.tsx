import BookingButton from '../ui/BookingButton'
import SectionHeading from '../ui/SectionHeading'

/** Liikkuva palvelu Tahkolla (sesonkeina). Tausta vaihtuu (section--alt). */
export default function Tahko() {
  return (
    <section id="tahko" className="section section--alt" aria-labelledby="tahko-otsikko">
      <div className="container container--narrow">
        <SectionHeading id="tahko-otsikko" eyebrow="Liikkuva palvelu" title="Tahkolla" />

        <p className="tahko__text">
          Sesonkien aikana tulen kampaamo- ja kynsipalveluiden kanssa suoraan
          lomamökille, hotellimajoitukseen tai juhlapaikalle Tahkon alueella.
          Palvelu sopii mökkiseurueille, hääseurueille ja juhliin, joissa moni
          haluaa kauniiksi samaan aikaan.
        </p>

        {/* Sama chip-tyyli kuin Introssa */}
        <ul className="chip-list tahko__list">
          <li className="chip">Geelilakkaukset ja kynnet</li>
          <li className="chip">Juhla- ja hääkampaukset</li>
          <li className="chip">Ryhmille sopimuksen mukaan</li>
        </ul>

        {/* label-propsilla painikkeen teksti vaihtuu oletuksesta */}
        <BookingButton label="Kysy liikkuvasta palvelusta" />
      </div>
    </section>
  )
}
