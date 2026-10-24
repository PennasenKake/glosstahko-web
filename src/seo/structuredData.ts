import { site } from '../config/site'
import { faq } from '../data/faq'
import { serviceCategories } from '../data/services'

/**
 * Rakenteinen data (JSON-LD) Googlelle: kertoo koneluettavasti, mikä yritys
 * sivu on. Sitä käytetään paikallisessa haussa ja Google-profiilin tukena.
 *
 * Tiedot tulevat samoista lähteistä kuin näkyvä sivu (config/site.ts ja
 * data/services.ts), joten ne eivät pääse eriytymään.
 *
 * Huom: osoite on toimitilan osoite (config/site.ts), ei kotiosoite. Kotiosoite ei
 * kuulu verkkoon, ja testi (App.test.tsx) varmistaa, ettei se päädy tähän dataan.
 *
 * Schema.org: https://schema.org/HairSalon ja https://schema.org/NailSalon
 */
export function buildStructuredData() {
  // Set poistaa kaksoiskappaleet (esim. kaksi "Hiustenleikkaus"-riviä)
  const serviceNames = [
    ...new Set(serviceCategories.flatMap((category) => category.services.map((s) => s.name))),
  ]

  // Hintahaarukka hinnastosta, esim. "22–180 €". Lisäpalveluita ei lasketa mukaan.
  const prices = serviceCategories
    .flatMap((category) => category.services)
    .filter((service) => !service.addon)
    .flatMap((service) => [service.price, service.priceMax ?? service.price])
  const priceRange = `${Math.min(...prices)}–${Math.max(...prices)} €`

  return {
    '@context': 'https://schema.org',
    '@type': ['HairSalon', 'NailSalon'],
    '@id': `${site.url}/#yritys`,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    image: `${site.url}/og-image.jpg`,
    telephone: '+358445132714',
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressCountry: 'FI',
    },
    // Sijainti vain, jos koordinaatit tunnetaan (config/site.ts). Väärä sijainti on huonompi kuin ei sijaintia.
    ...(site.coords && {
      geo: { '@type': 'GeoCoordinates', latitude: site.coords.lat, longitude: site.coords.lng },
    }),
    hasMap: site.mapUrl,
    priceRange,
    areaServed: [
      { '@type': 'City', name: 'Nilsiä' },
      { '@type': 'Place', name: 'Tahko' },
    ],
    sameAs: [site.instagramUrl],
    // Verkkoajanvaraus (Booksalon): Google voi näyttää varauslinkin hakutuloksessa
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Varaa aika',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.bookingUrl,
        inLanguage: 'fi',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Palvelut',
      itemListElement: serviceNames.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }
}

/**
 * UKK-sivun rakenteinen data (FAQPage): sama sisältö kuin näkyvä UKK, joten sitä
 * ei voi ylläpitää erikseen. Googlen UKK-rich result -näkymä on rajattu, mutta
 * haku- ja tekoälyvastaukset hyötyvät kysymys-vastaus-parista.
 */
export function buildFaqData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
