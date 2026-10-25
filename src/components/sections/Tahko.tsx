import HeroVines from '../ui/HeroVines'
import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'
import leaf from '../../assets/images/leaf.webp'
import SectionHeading from '../ui/SectionHeading'

/** Liikkuva palvelu Tahkolla (sesonkeina). */
export default function Tahko() {
  return (
    <section id="tahko" className="section section--alt" aria-labelledby="tahko-otsikko">
      <HeroVines variant="d" side="left" className="sidevine sidevine--tahko" watch />
      <img
        className="leaf-deco tahko__leaf"
        src={leaf}
        alt=""
        width={640}
        height={574}
        loading="lazy"
      />
      <div className="container container--narrow">
        <SectionHeading id="tahko-otsikko" eyebrow="Liikkuva palvelu" title="Tahkolla" />

        <p className="tahko__text" data-reveal>
          Sesonkien aikana tulen kampaamo- ja kynsipalveluiden kanssa suoraan
          lomamökille, hotellimajoitukseen tai juhlapaikalle Tahkon alueella.
          Palvelu sopii mökkiseurueille, hääseurueille ja juhliin, joissa moni
          haluaa kauniiksi samaan aikaan.
        </p>

        <ul className="chip-list tahko__list" data-reveal>
          <li className="chip">Geelilakkaukset ja kynnet</li>
          <li className="chip">Juhla- ja hääkampaukset</li>
          <li className="chip">Ryhmille sopimuksen mukaan</li>
        </ul>

        <div data-reveal>
          <BookingButton label="Kysy liikkuvasta palvelusta" href={site.instagramUrl} />
        </div>
      </div>
    </section>
  )
}
