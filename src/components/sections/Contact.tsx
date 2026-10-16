import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'

/** Yhteystiedot: kaikki arvot tulevat config/site.ts-tiedostosta. */
export default function Contact() {
  return (
    <section id="yhteys" aria-labelledby="yhteys-otsikko">
      <h2 id="yhteys-otsikko">Yhteystiedot</h2>
      <p>Avaamme pian Nilsiässä. Seuraa Instagramia, niin kuulet ensimmäisenä.</p>

      <BookingButton label="Varaa aika Instagramissa" />

      <ul>
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
    </section>
  )
}