import { serviceCategories } from '../../data/services'
import { formatDuration, formatPrice } from '../../utils/format'

export default function Services() {
  return (
    <section id="palvelut" aria-labelledby="palvelut-otsikko">
      <h2 id="palvelut-otsikko">Palvelut</h2>
      <p>Hinnat sisältävät arvonlisäveron.</p>

      {serviceCategories.map((category) => (
        <div key={category.id}>
          <h3>{category.title}</h3>
          {category.description && <p>{category.description}</p>}

          <ul>
            {category.services.map((service) => (
              <li key={service.id}>
                <span>{service.name}</span>{' '}
                <span>{formatDuration(service)}</span>{' '}
                <span>{formatPrice(service)}</span>
                {service.note && <small> {service.note}</small>}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <a href="https://www.instagram.com/glosstahko/" target="_blank" rel="noopener noreferrer">
        Varaa aika
      </a>
    </section>
  )
}