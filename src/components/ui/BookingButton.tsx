import { site } from '../../config/site'

/**
 * Propsit eli komponentin parametrit.
 * `?` tekee propsista valinnaisen. Ilman sitä TypeScript vaatisi sen jokaisessa käytössä.
 */
type BookingButtonProps = {
  label?: string // painikkeen teksti
  /** Ulkoasu: täytetty, vaalea (terrakottapinnalle) tai reunus. Vastaa CSS:n .btn--* -luokkia. */
  variant?: 'primary' | 'light' | 'ghost'
  /** Pienempi koko, esim. headeriin. */
  small?: boolean
  /** Oletus on kynsipalveluiden ajanvaraus (site.bookingUrl, Booksalon). Kampaamoajat varataan Instagram-viestillä tai puhelimitse. Muuhun kohteeseen, esim. Instagram-viestiin, annetaan oma osoite. */
  href?: string
}

/**
 * Ajanvarauspainike. Käytetään kaikkialla, missä sivu ohjaa varaukseen,
 * joten linkki tulee aina yhdestä paikasta (config/site.ts).
 *
 * Esimerkit:
 *   <BookingButton />
 *   <BookingButton label="Kysy lisää" variant="light" />
 *   <BookingButton small />
 */
export default function BookingButton({
  label = 'Varaa kynsiaika',
  variant = 'primary',
  small = false,
  href = site.bookingUrl,
}: BookingButtonProps) {
  // Rakennetaan CSS-luokat: esim. "btn btn--primary btn--small".
  // `small && 'btn--small'` on false, kun small ei ole päällä.
  // filter(Boolean) poistaa false-arvot, join(' ') yhdistää tekstiksi.
  const className = ['btn', `btn--${variant}`, small && 'btn--small']
    .filter(Boolean)
    .join(' ')

  return (
    // target="_blank" avaa uuteen välilehteen. rel="noopener noreferrer"
    // estää uutta sivua pääsemästä käsiksi tähän sivuun (tietoturva).
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}
