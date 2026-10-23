import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'
import SectionHeading from '../ui/SectionHeading'
import VenueCard from '../ui/VenueCard'

/** Yhteystiedot: kaikki arvot tulevat config/site.ts-tiedostosta. */
export default function Contact() {
  return (
    <section
      id="yhteys"
      className="section section--brand"
      aria-labelledby="yhteys-otsikko"
    >
      <span className="flora flora--right flora--edge-right flora--cream" aria-hidden="true" />
      <span className="flora flora--left flora--edge-left flora--cream" aria-hidden="true" />
      <div className="container container--narrow">
        <SectionHeading id="yhteys-otsikko" eyebrow="Ota yhteyttä" title="Yhteystiedot" />

        <p className="contact__text" data-reveal>
          Avaamme pian Nilsiässä. Seuraa Instagramia, niin kuulet ensimmäisenä.
        </p>

        <div className="contact__cta" data-reveal>
          <BookingButton label="Varaa aika Instagramissa" variant="light" />
        </div>

        <ul className="contact__list" data-reveal>
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
        </ul>

        <VenueCard />
      </div>
    </section>
  )
}
