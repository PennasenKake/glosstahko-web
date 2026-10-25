import { nailProducts } from '../../data/products'
import { serviceCategories } from '../../data/services'
import type { ServiceGroup } from '../../types'
import { formatDuration, formatPrice } from '../../utils/format'
import SectionHeading from '../ui/SectionHeading'

const groups: { id: ServiceGroup; title: string }[] = [
  { id: 'kynnet', title: 'Kynnet' },
  { id: 'hiukset', title: 'Hiukset' },
]

/**
 * Palvelut-osio: piirtää hinnaston data/services.ts-tiedostosta.
 * Komponentissa ei ole yhtään kovakoodattua palvelua.
 */
export default function Services() {
  return (
    <section id="palvelut" className="section" aria-labelledby="palvelut-otsikko">
      <div className="container">
        <SectionHeading
          id="palvelut-otsikko"
          eyebrow="Palvelut ja hinnat"
          title="Palvelut"
          petals
        />
        <p className="services__intro" data-reveal>
          Hinnat sisältävät arvonlisäveron. Lopullinen hinta riippuu työn
          laajuudesta. Pidätämme oikeudet muutoksiin.
        </p>

        <div className="price-card" data-reveal>
          {groups.map((group) => {
            const categories = serviceCategories.filter((c) => c.group === group.id)

            return (
              <div key={group.id}>
                <h3 className="price-group__title">{group.title}</h3>

                {categories.map((category) => (
                  <div key={category.id}>
                    {categories.length > 1 && (
                      <h4 className="price-category__title">{category.title}</h4>
                    )}
                    {category.description && <p className="price-category__desc">{category.description}</p>}

                    <ul>
                      {category.services.map((service) => {
                        const duration = formatDuration(service)
                        const meta = [duration, service.note].filter(Boolean).join(' · ')

                        return (
                          <li className="price-row" key={service.id}>
                            <div className="price-row__main">
                              <span className="price-row__name">{service.name}</span>
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

        <aside className="products" aria-labelledby="products-otsikko" data-reveal>
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
