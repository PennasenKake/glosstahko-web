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
  phone: '044\u00A0513\u00A02714', // näytettävä muoto (\u00A0 = ei-katkeava väli: numero ei rivity kahdelle riville)
  phoneHref: 'tel:+358445132714', // puhelimessa avaa soittosovelluksen
  email: 'siiri.launonen@hotmail.com', // vaihdetaan myöhemmin oman domainin osoitteeseen
  city: 'Nilsiä',
  businessId: '3658530-3', // Y-tunnus (julkinen tieto), näytetään alatunnisteessa

  // Some
  instagramUrl: 'https://www.instagram.com/glosstahko/',
  instagramHandle: '@glosstahko',

  // Kaikki "Varaa aika" -painikkeet ohjautuvat tänne.
  // Vaihda Timma/Noona/Booksalon-linkkiin, kun ajanvarausjärjestelmä on käytössä.
  bookingUrl: 'https://www.instagram.com/glosstahko/',
} as const