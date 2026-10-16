import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'
import SectionHeading from '../ui/SectionHeading'

/** Yhteystiedot: kaikki arvot tulevat config/site.ts-tiedostosta. */
export default function Contact() {
  return (
    <section id="yhteys" className="section section--alt" aria-labelledby="yhteys-otsikko">
      <div className="container container--narrow">
        <SectionHeading id="yhteys-otsikko" eyebrow="Ota yhteyttä" title="Yhteystiedot" />

        <p className="contact__text">
          Avaamme pian Nilsiässä. Seuraa Instagramia, niin kuulet ensimmäisenä.
        </p>

        <div className="contact__cta">
          <BookingButton label="Varaa aika Instagramissa" />
        </div>

        <ul className="contact__list">
          <li>
            Puhelin: <a href={site.phoneHref}>{site.phone}</a>
          </li>
          <li>
            {/* Malliliteraali: ${...} liittää arvon merkkijonoon */}
            Sähköposti: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            Instagram:{' '}
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
          </li>
          <li>Sijainti: {site.city}</li>
        </ul>
      </div>
    </section>
  )
}
