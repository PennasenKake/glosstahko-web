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
    'Kynsi- ja hiuspalvelut Nilsiässä ja liikkuva palvelu Tahkolla: geelilakkaus, manikyyri, leikkaukset, värjäykset ja juhlakampaukset.',

  // Yhteystiedot
  phone: '044\u00A0513\u00A02714', // näytettävä muoto (\u00A0 = ei-katkeava väli)
  phoneHref: 'tel:+358445132714',
  email: 'siiri.launonen@hotmail.com',
  city: 'Nilsiä',

  // Toimitila
  address: 'Pisantie 3',
  postalCode: '73300',
  /** Näytettävä riviosoite */
  // Löytäminen perillä: kerros ja naapuri
  addressNote: '2. kerros, kampaamo Tuulikutrin yhteydessä',
  addressLine: 'Pisantie 3, 73300 Nilsiä',
  /**
   * Toimitilan koordinaatit (valinnainen). Kun ne annetaan, "Näytä kartta" lataa
   * OpenStreetMap-kartan merkillä ja rakenteiseen dataan tulee sijainti.
   * Niin kauan kuin arvo on null, kortti avaa kartan osoitehaulla uuteen välilehteen.
   * Koordinaatit saat OpenStreetMapista: hae osoite, napsauta merkkiä hiiren oikealla
   * ja valitse "Näytä osoite" tai kopioi leveys- ja pituusaste.
   */
  coords: null as { lat: number; lng: number } | null,
  /** Avaa OpenStreetMapin osoitehaun (ei upotusta) */
  mapUrl: 'https://www.openstreetmap.org/search?query=Pisantie%203%2C%2073300%20Nilsi%C3%A4',
  /** Reittiohjeet nykyisestä sijainnista (puhelimessa avautuu karttasovellus) */
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Pisantie%203%2C%2073300%20Nilsi%C3%A4',
  businessId: '3658530-3',

  // Some
  instagramUrl: 'https://www.instagram.com/glosstahko/',
  instagramHandle: '@glosstahko',
  /**
   * Behold-syötteen osoite (https://feeds.behold.so/TUNNISTE), josta Minusta-osion
   * Instagram-karuselli hakee julkaisut. Tyhjä = karuselli näyttää vain linkin profiiliin.
   * Ohje: docs/instagram-syote.md
   */
  instagramFeedUrl: 'https://feeds.behold.so/pCF6ORiF1zQsJesGUH6B',

  // Kaikki "Varaa aika" -painikkeet ohjautuvat tänne (Booksalon verkkoajanvaraus).
  bookingUrl: 'https://booksalon.fi/glosstahko',
} as const
