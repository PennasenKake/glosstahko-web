import BookingButton from '../ui/BookingButton'

/** Liikkuva palvelu Tahkolla (sesonkeina). */
export default function Tahko() {
  return (
    <section id="tahko" aria-labelledby="tahko-otsikko">
      <h2 id="tahko-otsikko">Tahkolla</h2>
      <p>
        Sesonkien aikana tulen kampaamo- ja kynsipalveluiden kanssa suoraan
        lomamökille, hotellimajoitukseen tai juhlapaikalle Tahkon alueella.
        Palvelu sopii mökkiseurueille, hääseurueille ja juhliin, joissa moni
        haluaa kauniiksi samaan aikaan.
      </p>
      <ul>
        <li>Geelilakkaukset ja kynnet</li>
        <li>Juhla- ja hääkampaukset</li>
        <li>Ryhmille sopimuksen mukaan</li>
      </ul>

      {/* label-propsilla painikkeen teksti vaihtuu oletuksesta */}
      <BookingButton label="Kysy liikkuvasta palvelusta" />
    </section>
  )
}