import { site } from '../config/site'
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
    geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng },
    hasMap: site.mapUrl,
    areaServed: [
      { '@type': 'City', name: 'Nilsiä' },
      { '@type': 'Place', name: 'Tahko' },
    ],
    sameAs: [site.instagramUrl],
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
