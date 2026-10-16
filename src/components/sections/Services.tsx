import { serviceCategories } from '../../data/services'
import { formatDuration, formatPrice } from '../../utils/format'
import BookingButton from '../ui/BookingButton'

/**
 * Palvelut-osio: piirtää hinnaston data/services.ts-tiedostosta.
 * Komponentissa ei ole yhtään kovakoodattua palvelua, joten hintojen
 * muutos tehdään vain datatiedostossa.
 */
export default function Services() {
  return (
    // id="palvelut" on tab-linkin (#palvelut) kohde.
    // aria-labelledby nimeää osion otsikolla ruudunlukijalle.
    <section id="palvelut" aria-labelledby="palvelut-otsikko">
      <h2 id="palvelut-otsikko">Palvelut</h2>
      <p>Hinnat sisältävät arvonlisäveron.</p>

      {/* Ulompi map: yksi lohko per kategoria. key on pakollinen ja uniikki. */}
      {serviceCategories.map((category) => (
        <div key={category.id}>
          <h3>{category.title}</h3>

          {/* Näytetään vain, jos kategorialla on selite */}
          {category.description && <p>{category.description}</p>}

          <ul>
            {/* Sisempi map: yksi rivi per palvelu. Aaltosulut + return,
                koska keston tarkistus tarvitsee logiikkaa ennen palautusta. */}
            {category.services.map((service) => {
              // null, jos palvelulla ei ole kestoa
              const duration = formatDuration(service)

              return (
                <li key={service.id}>
                  <span>{service.name}</span>{' '}
                  {/* Kesto näytetään vain, jos se on olemassa */}
                  {duration && <span>{duration} </span>}
                  <span>{formatPrice(service)}</span>
                  {/* Lisätieto (esim. paketin sisältö), jos annettu */}
                  {service.note && <small> {service.note}</small>}
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* Ajanvarauslinkki tulee yhdestä paikasta (config/site.ts) */}
      <BookingButton />
    </section>
  )
}