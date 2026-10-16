import { site } from '../../config/site'

/**
 * Propsit eli komponentin parametrit.
 * `?` tekee propsista valinnaisen. Ilman sitä TypeScript vaatisi sen jokaisessa käytössä.
 */
type BookingButtonProps = {
  label?: string // painikkeen teksti
}

/**
 * Ajanvarauspainike. Käytetään kaikkialla, missä sivu ohjaa varaukseen,
 * joten linkki tulee aina yhdestä paikasta (config/site.ts).
 *
 * `label = 'Varaa aika'` on oletusarvo: jos propsia ei anneta, käytetään tätä.
 * Esimerkit: <BookingButton />  ja  <BookingButton label="Kysy lisää" />
 */
export default function BookingButton({ label = 'Varaa aika' }: BookingButtonProps) {
  return (
    // target="_blank" avaa uuteen välilehteen. rel="noopener noreferrer"
    // estää uutta sivua pääsemästä käsiksi tähän sivuun (tietoturva).
    <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}