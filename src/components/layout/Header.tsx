import BookingButton from '../ui/BookingButton'

/**
 * Sivun yläpalkki: logo, tabit ja ajanvarauspainike.
 * Tabit ovat tavallisia ankkurilinkkejä (#id), jotka vievät sivun
 * osioon, jonka id täsmää. Järjestys vastaa sivun järjestystä (App.tsx).
 */
export default function Header() {
  return (
    <header>
      {/* Logo vie sivun alkuun */}
      <a href="#etusivu">GlossTahko</a>

      {/* aria-label nimeää navigaation ruudunlukijalle */}
      <nav aria-label="Sivuston osiot">
        <ul>
          <li><a href="#etusivu">Etusivu</a></li>
          <li><a href="#minusta">Minusta</a></li>
          <li><a href="#palvelut">Palvelut</a></li>
          <li><a href="#tahko">Tahko</a></li>
          <li><a href="#ukk">UKK</a></li>
          <li><a href="#yhteys">Yhteys</a></li>
        </ul>
      </nav>

      <BookingButton />
    </header>
  )
}