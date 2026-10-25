import { navItems } from '../../config/nav'
import { site } from '../../config/site'
import BookingButton from '../ui/BookingButton'
import ConsentSettings from '../ui/ConsentSettings'

const year = new Date().getFullYear()

/**
 * Alatunniste: brändi, pikalinkit, yhteystiedot ja lakitekstit.
 * Ulkoasu: styles/layout.css (.site-footer).
 */
export default function Footer() {
  const base = import.meta.env.BASE_URL

  return (
    <footer className="site-footer">
      <span className="flora flora--right flora--edge-right flora--cream" aria-hidden="true" />

      <div className="container site-footer__grid" data-reveal="fade">
        <div className="site-footer__brand">
          <p className="site-footer__logo">
            <span className="site-footer__logo-main">Gloss</span>
            <span className="site-footer__logo-sub">Tahko</span>
          </p>
          <p className="site-footer__tagline">
            Kynnet ja hiukset kiireettömästi Nilsiässä ja Tahkolla.
          </p>
          <BookingButton variant="light" small />
        </div>

        <nav aria-label="Sivun pikalinkit">
          <p className="site-footer__title">Sivusto</p>
          <ul className="site-footer__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="site-footer__title">Yhteystiedot</p>
          <ul className="site-footer__list">
            <li>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram {site.instagramHandle}
              </a>
            </li>
            <li>{site.addressLine}</li>
          </ul>
        </div>

        <nav aria-label="Ehdot ja tietosuoja">
          <p className="site-footer__title">Tietoa ja ehdot</p>
          <ul className="site-footer__list">
            <li>
              <a href={`${base}kayttoehdot.html`}>Käyttöehdot</a>
            </li>
            <li>
              <a href={`${base}tietosuoja.html`}>Tietosuoja</a>
            </li>
            <li>
              <a href={`${base}omavalvonta.html`}>Omavalvonta</a>
            </li>
            <li>
              <a href={`${base}kotihoito.html`}>Kotihoito-ohjeet</a>
            </li>
            <li>
              <ConsentSettings />
            </li>
          </ul>
        </nav>
      </div>

      <div className="container site-footer__bottom" data-reveal="fade">
        <p>
          © {year} {site.name} · Y-tunnus {site.businessId}
        </p>
        <p>
          Hinnat sisältävät arvonlisäveron. Sivusto ei itse aseta evästeitä eikä
          tallenna tietojasi palvelimelle. Selaimeesi tallennetaan vain Instagram-valintasi.
          Instagram-julkaisut ja kartta ladataan kolmannelta osapuolelta vasta suostumuksellasi.
        </p>
        <a href="#etusivu">Takaisin ylös ↑</a>
      </div>
    </footer>
  )
}
