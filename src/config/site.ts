/**
 * Yrityksen tiedot yhdessä paikassa.
 * Kun jokin muuttuu (puhelin, ajanvarauslinkki, sähköposti), muutat sen
 * täältä, ja koko sivu päivittyy. Muualla koodissa ei ole kovakoodattuja
 * yhteystietoja.
 *
 * `as const` lukitsee arvot kirjaimellisiksi: TypeScript tietää esimerkiksi
 * site.city:n olevan tarkalleen 'Nilsiä', ei mikä tahansa merkkijono.
 */
export const site = {
  name: 'GlossTahko',
  // Osoite tulee .env-tiedostosta (VITE_SITE_URL), ei lopussa kauttaviivaa
  url: String(import.meta.env.VITE_SITE_URL).replace(/\/$/, ''),
  description:
    'Kynsi- ja hiuspalvelut Nilsiässä ja liikkuva palvelu Tahkolla: geelilakkaus, rakennekynnet, leikkaukset, värjäykset ja juhlakampaukset.',

  // Yhteystiedot
  phone: '044\u00A0513\u00A02714', // näytettävä muoto (\u00A0 = ei-katkeava väli)
  phoneHref: 'tel:+358445132714',
  email: 'siiri.launonen@hotmail.com',
  city: 'Nilsiä',

  // Toimitila (sama kiinteistöalue kuin Alko Nilsiä)
  address: 'Laitilantie 27',
  postalCode: '73300',
  /** Näytettävä riviosoite */
  addressLine: 'Laitilantie 27, 73300 Nilsiä',
  /** Sijainti kartan merkkiä ja rakenteista dataa varten */
  lat: 63.201,
  lng: 28.0902,
  /** Avaa OpenStreetMapin kartan merkki toimitilan kohdalla (ei upotusta) */
  mapUrl: 'https://www.openstreetmap.org/?mlat=63.201&mlon=28.0902#map=17/63.201/28.0902',
  /** Reittiohjeet nykyisestä sijainnista (puhelimessa avautuu karttasovellus) */
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Laitilantie%2027%2C%2073300%20Nilsi%C3%A4',
  businessId: '3658530-3',

  // Some
  instagramUrl: 'https://www.instagram.com/glosstahko/',
  instagramHandle: '@glosstahko',

  // Kaikki "Varaa aika" -painikkeet ohjautuvat tänne.
  bookingUrl: 'https://www.instagram.com/glosstahko/',
} as const
