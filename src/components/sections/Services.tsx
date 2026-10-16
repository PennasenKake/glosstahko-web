import { nailProducts } from '../../data/products'
import { serviceCategories } from '../../data/services'
import type { ServiceGroup } from '../../types'
import { formatDuration, formatPrice } from '../../utils/format'
import SectionHeading from '../ui/SectionHeading'

/**
 * Hinnaston kaksi saraketta. `id` täsmää kategorioiden `group`-kenttään
 * (data/services.ts), `title` on sarakkeen otsikko sivulla.
 */
const groups: { id: ServiceGroup; title: string }[] = [
  { id: 'kynnet', title: 'Kynnet' },
  { id: 'hiukset', title: 'Hiukset' },
]

/**
 * Palvelut-osio: piirtää hinnaston data/services.ts-tiedostosta.
 * Komponentissa ei ole yhtään kovakoodattua palvelua, joten hintojen
 * muutos tehdään vain datatiedostossa.
 *
 * Rakenne: osio > kortti > sarake (group) > kategoria > rivit.
 * Otsikkotasot: h2 osio, h3 sarake, h4 kategoria.
 */
export default function Services() {
  return (
    // id="palvelut" on tab-linkin (#palvelut) kohde.
    // aria-labelledby nimeää osion otsikolla ruudunlukijalle.
    <section id="palvelut" className="section" aria-labelledby="palvelut-otsikko">
      <div className="container">
        <SectionHeading
          id="palvelut-otsikko"
          eyebrow="Palvelut ja hinnat"
          title="Palvelut"
        />
        <p className="services__intro">
          Hinnat sisältävät arvonlisäveron. Lopullinen hinta riippuu työn
          laajuudesta ja hiusten pituudesta.
        </p>

        <div className="price-card">
          {/* Ulompi map: yksi sarake per ryhmä */}
          {groups.map((group) => {
            // filter jättää jäljelle vain tämän ryhmän kategoriat
            const categories = serviceCategories.filter((c) => c.group === group.id)

            return (
              <div key={group.id}>
                <h3 className="price-group__title">{group.title}</h3>

                {categories.map((category) => (
                  <div key={category.id}>
                    {/* Alaotsikko vain, jos sarakkeessa on useita kategorioita */}
                    {categories.length > 1 && (
                      <h4 className="price-category__title">{category.title}</h4>
                    )}

                    <ul>
                      {category.services.map((service) => {
                        // null, jos palvelulla ei ole kestoa
                        const duration = formatDuration(service)
                        // Rivin alle kesto ja lisätieto, jos niitä on. filter(Boolean) poistaa tyhjät.
                        const meta = [duration, service.note].filter(Boolean).join(' · ')

                        return (
                          <li className="price-row" key={service.id}>
                            <div className="price-row__main">
                              <span className="price-row__name">{service.name}</span>
                              {/* Koriste: pisteviiva nimen ja hinnan välissä */}
                              <span className="price-row__dots" aria-hidden="true" />
                              <span className="price-row__price">{formatPrice(service)}</span>
                            </div>
                            {meta && <p className="price-row__meta">{meta}</p>}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Käytössä oleva kynsisarja (data/products.ts) */}
        <aside className="products" aria-labelledby="products-otsikko">
          <p className="products__label" id="products-otsikko">
            {nailProducts.label}
          </p>
          <p className="products__brand">{nailProducts.brand}</p>
          <p className="products__text">{nailProducts.description}</p>
          <ul className="chip-list">
            {nailProducts.items.map((item) => (
              <li className="chip" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
