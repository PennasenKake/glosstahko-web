import BookingButton from '../ui/BookingButton'

/**
 * Sivun yläpalkki: logo, tabit ja ajanvarauspainike.
 * Tabit ovat tavallisia ankkurilinkkejä (#id), jotka vievät sivun
 * osioon, jonka id täsmää. Järjestys vastaa sivun järjestystä (App.tsx).
 *
 * Ulkoasu: styles/layout.css (sticky, mobiilissa tabit omalla rivillään).
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        {/* Logo vie sivun alkuun. aria-label lukee nimen yhtenä sanana. */}
        <a className="logo" href="#etusivu" aria-label="GlossTahko, sivun alkuun">
          <span className="logo__main">Gloss</span>
          <span className="logo__sub">Tahko</span>
        </a>

        {/* aria-label nimeää navigaation ruudunlukijalle */}
        <nav className="tabs" aria-label="Sivuston osiot">
          <ul className="tabs__list">
            <li><a className="tabs__link" href="#etusivu">Etusivu</a></li>
            <li><a className="tabs__link" href="#minusta">Minusta</a></li>
            <li><a className="tabs__link" href="#palvelut">Palvelut</a></li>
            <li><a className="tabs__link" href="#tahko">Tahko</a></li>
            <li><a className="tabs__link" href="#ukk">UKK</a></li>
            <li><a className="tabs__link" href="#yhteys">Yhteys</a></li>
          </ul>
        </nav>

        {/* Wrapper tarvitaan, jotta CSS-grid voi sijoittaa napin (grid-area: cta) */}
        <div className="site-header__cta">
          <BookingButton small />
        </div>
      </div>
    </header>
  )
}
