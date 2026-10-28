import type { ServiceCategory } from '../types'

/**
 * Sivun hinnasto. Tämä on ainoa paikka, jossa hintoja muutetaan:
 * Services-komponentti piirtää kaiken tästä.
 *
 * LUONNOS: tarkistetaan ennen julkaisua.
 * - Hinnat sisältävät alv:n 25,5 %.
 * - Kynnet: hinnat ja kestot vastaavat Booksalon-ajanvarausta (25.10.2026). Hinnat ovat alkuhintoja.
 * - Hiukset: kampaamon hinnasto (käsinkirjoitetut luvut tarkistettava).
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'kynnet',
    group: 'kynnet',
    title: 'Geelilakkaus ja manikyyri',
    description: 'Hinnat ovat alkuhintoja ja vastaavat Booksalon-ajanvarauksen palveluita.',
    services: [
      {
        id: 'geelilakkaus-uudet',
        name: 'Geelilakkaus, uudet',
        minutes: 120,
        price: 65,
        priceFrom: true,
        note: 'Sis. manikyyrin, geelilakkauksen (vahvistus, värilakkaus tai ranskalainen) ja kynsinauhaöljyn. Koristelu lisäpalveluna.',
      },
      {
        id: 'geelilakkaus-huolto',
        name: 'Geelilakkaus, huolto',
        minutes: 120,
        price: 65,
        priceFrom: true,
        note: 'Sis. vanhan geelilakkauksen poiston tai huollon, manikyyrin, uuden geelilakkauksen ja kynsinauhaöljyn. Koristelu lisäpalveluna.',
      },
      {
        id: 'geelilakkaus-poisto',
        name: 'Geelilakkaus, poisto',
        minutes: 45,
        price: 45,
        priceFrom: true,
        note: 'Sis. geelilakkauksen poiston, manikyyrin ja lopuksi kynsinauhaöljyn ja käsien rasvauksen.',
      },
      {
        id: 'manikyyri',
        name: 'Manikyyri',
        minutes: 45,
        price: 45,
        priceFrom: true,
        note: 'Sis. kynsien muotoon viilauksen, kiillotuksen ja kynsinauhaöljyn. Ei sisällä lakkausta.',
      },

      // POISTETTU HINNASTOSTA 25.10.2026: palvelut eivät ole Booksalon-ajanvarauksessa.
      // Palauta riviltä pois kommentti, kun palvelu otetaan taas myyntiin (ja lisää se Booksaloniin).
      // { id: 'geelilakkaus', name: 'Geelilakkaus omille kynsille', minutes: 60, price: 55 },
      // { id: 'geelilakkaus-manikyyri', name: 'Geelilakkaus + manikyyri', minutes: 75, price: 65 },
      // { id: 'vahvistus', name: 'Vahvistus (builder-geeli / BIAB)', minutes: 75, price: 68 },
      // { id: 'vahvistus-huolto', name: 'Vahvistuksen huolto (3–5 vk)', minutes: 75, price: 62 },
      // { id: 'rakennekynnet-uudet', name: 'Rakennekynnet, uudet', minutes: 120, price: 85 },
      // { id: 'rakennekynnet-huolto', name: 'Rakennekynsien huolto', minutes: 105, price: 75 },
      // { id: 'geelin-poisto', name: 'Geelin poisto + hoito', minutes: 30, price: 30 },
      // { id: 'poisto-toinen-tekija', name: 'Poisto toisen tekijän geelistä', minutes: 15, price: 10, addon: true },
      // { id: 'ranskalainen', name: 'Ranskalainen / milky white', minutes: 15, price: 10, addon: true },
    ],
  },
  {
    id: 'koristelu',
    group: 'kynnet',
    title: 'Lisäpalvelut: koristelu',
    description:
      'Valitaan geelilakkauksen yhteyteen, esimerkiksi timantit, glitter, folio, käsinmaalaus ja kuviot.',
    services: [
      // addon-lippu näyttää ne muodossa "+20 min" ja "+7 €"
      { id: 'koristelu-s', name: 'Koristelu S (2–5 kynteen)', minutes: 20, price: 7, addon: true },
      { id: 'koristelu-m', name: 'Koristelu M (6–10 kynteen)', minutes: 30, price: 14, addon: true },
      // Vanha: { id: 'nail-art', name: 'Kynsikoristelu (nail art)', minutes: 10, minutesMax: 20, price: 5, priceFrom: true, addon: true },
    ],
  },
  {
    id: 'leikkaukset',
    group: 'hiukset',
    title: 'Leikkaukset',
    description: 'Kampaamoaikoja on rajoitetusti. Ajat varataan Instagram-viestillä tai puhelimitse.',
    services: [
      // priceMax = hintahaarukka (34–36 €)
      { id: 'leikkaus-30', name: 'Hiustenleikkaus', minutes: 30, price: 34, priceMax: 36 },
      { id: 'leikkaus-45', name: 'Hiustenleikkaus', minutes: 45, price: 48, priceMax: 52 },
      { id: 'leikkaus-pesu', name: 'Hiustenleikkaus, sis. pesun', minutes: 60, price: 52, priceMax: 54 },
      // Alla olevilla ei ole kestoa, joten minutes puuttuu ja kesto jää pois
      { id: 'tasoitus', name: 'Pitkien hiusten tasoitus', price: 40 },
      { id: 'leikkaus-lapset', name: 'Hiustenleikkaus, lapset', price: 30, priceMax: 35 },
      { id: 'koneleikkaus', name: 'Koneleikkaus', price: 22, priceMax: 25 },
      { id: 'otsa-niska', name: 'Otsa- ja niskahiusten leikkaus', price: 22, priceMax: 25 },
    ],
  },
  {
    id: 'varjaykset',
    group: 'hiukset',
    title: 'Värjäykset ja vaalennukset',
    description: 'Lopullinen hinta tarkentuu hiusten pituuden ja työn laajuuden mukaan.',
    services: [
      // POISTETTU HINNASTOSTA 25.10.2026: permanenttipalvelut eivät ole tarjolla.
      // Palauta riviltä pois kommentti, kun palvelu otetaan taas myyntiin.
      // { id: 'permanentti-lyhyt', name: 'Permanentti ja leikkaus, lyhyet', price: 125, priceMax: 135 },
      // { id: 'permanentti-pitka', name: 'Permanentti ja leikkaus, pitkät', price: 150, priceMax: 170 },
      // { id: 'osapermanentti', name: 'Osapermanentti ja leikkaus', price: 115 },
      { id: 'tyvivari', name: 'Tyviväri (alle 1,5 cm), sis. leikkauksen', price: 125, priceMax: 135 },
      { id: 'monivari-lyhyt', name: 'Monivärjäys, sis. leikkauksen, lyhyet', price: 140, priceMax: 150 },
      { id: 'monivari-pitka', name: 'Monivärjäys, sis. leikkauksen, pitkät', price: 150, priceMax: 180 },
      // perHour = tuntihinta (75 €/h)
      { id: 'raidoitukset', name: 'Raidoitukset / vaalennukset / vaalennuspesut', price: 75, perHour: true },
    ],
  },
  {
    id: 'kampaukset',
    group: 'hiukset',
    title: 'Kampaukset',
    services: [
      { id: 'kampaukset', name: 'Kampaukset', price: 75, perHour: true },
      // priceFrom = "alk." hinnan edessä
      { id: 'haakampaus', name: 'Hääkampaus, sis. suunnittelun ja koekampauksen', price: 170, priceFrom: true },
    ],
  },
  // Paketit (hiukset + kynnet samalla käynnillä) lisätään takaisin vasta,
  // kun leikkaus- ja kampaushinnat on vahvistettu: ne laskettiin vanhoista hinnoista.
]