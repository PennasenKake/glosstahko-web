import { useEffect, useRef } from 'react'
import { navItems, sectionIds } from '../../config/nav'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useOverHero } from '../../hooks/useOverHero'
import BookingButton from '../ui/BookingButton'

/**
 * Sivun yläpalkki: logo, tabit ja ajanvarauspainike.
 *
 * - Tabit ovat ankkurilinkkejä (#id), ja ne luetaan config/nav.ts:stä.
 * - Aktiivinen tabi korostuu vieritettäessä (useActiveSection).
 * - Heron päällä palkki on läpinäkyvä, sen jälkeen utuinen vaalea (useOverHero).
 *   Tila kulkee CSS:lle data-over-hero-attribuutilla (layout.css).
 */
export default function Header() {
  const active = useActiveSection(sectionIds)
  const overHero = useOverHero('etusivu')

  // ref = suora viittaus DOM-elementtiin (tässä tabialueeseen)
  const navRef = useRef<HTMLElement>(null)

  // Mobiilissa tabit vierittyvät sivusuunnassa: tuodaan aktiivinen tabi keskelle
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!nav || !link) return
    nav.scrollTo({
      left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2,
      behavior: 'smooth',
    })
  }, [active])

  return (
    <header className="site-header" data-over-hero={overHero}>
      <div className="site-header__inner container">
        {/* Logo vie sivun alkuun. aria-label lukee nimen yhtenä sanana. */}
        <a className="logo" href="#etusivu" aria-label="GlossTahko, sivun alkuun">
          <span className="logo__main">Gloss</span>
          <span className="logo__sub">Tahko</span>
        </a>

        {/* aria-label nimeää navigaation ruudunlukijalle */}
        <nav className="tabs" aria-label="Sivuston osiot" ref={navRef}>
          <ul className="tabs__list">
            {navItems.map((item) => (
              <li key={item.id}>
                {/* aria-current kertoo ruudunlukijalle ja CSS:lle, mikä tabi on aktiivinen */}
                <a
                  className="tabs__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
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
