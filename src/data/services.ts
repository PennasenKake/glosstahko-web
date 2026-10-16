import type { ServiceCategory } from '../types'

/**
 * Sivun hinnasto. Tämä on ainoa paikka, jossa hintoja muutetaan:
 * Services-komponentti piirtää kaiken tästä.
 *
 * LUONNOS: tarkistetaan ennen julkaisua.
 * - Hinnat sisältävät alv:n 25,5 %.
 * - Kynnet: Siirin oma luonnoshinnasto.
 * - Hiukset: kampaamon hinnasto (käsinkirjoitetut luvut tarkistettava).
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'kynnet',
    title: 'Kynnet',
    services: [
      { id: 'manikyyri', name: 'Manikyyri (ei lakkausta)', minutes: 45, price: 42 },
      { id: 'geelilakkaus', name: 'Geelilakkaus omille kynsille', minutes: 60, price: 55 },
      { id: 'geelilakkaus-manikyyri', name: 'Geelilakkaus + manikyyri', minutes: 75, price: 65 },
      { id: 'vahvistus', name: 'Vahvistus (builder-geeli / BIAB)', minutes: 75, price: 68 },
      { id: 'vahvistus-huolto', name: 'Vahvistuksen huolto (3–5 vk)', minutes: 75, price: 62 },
      { id: 'rakennekynnet-uudet', name: 'Rakennekynnet, uudet', minutes: 120, price: 85 },
      { id: 'rakennekynnet-huolto', name: 'Rakennekynsien huolto', minutes: 105, price: 75 },
      { id: 'geelin-poisto', name: 'Geelin poisto + hoito', minutes: 30, price: 30 },
      // Lisäpalvelut: addon-lippu näyttää ne muodossa "+15 min" ja "+10 €"
      { id: 'poisto-toinen-tekija', name: 'Poisto toisen tekijän geelistä', minutes: 15, price: 10, addon: true },
      { id: 'nail-art', name: 'Kynsikoristelu (nail art)', minutes: 10, minutesMax: 20, price: 5, priceFrom: true, addon: true },
      { id: 'ranskalainen', name: 'Ranskalainen / milky white', minutes: 15, price: 10, addon: true },
    ],
  },
  {
    id: 'leikkaukset',
    title: 'Leikkaukset',
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
    title: 'Värjäykset, permanentit ja vaalennukset',
    description: 'Lopullinen hinta tarkentuu hiusten pituuden ja työn laajuuden mukaan.',
    services: [
      { id: 'permanentti-lyhyt', name: 'Permanentti ja leikkaus, lyhyet', price: 125, priceMax: 135 },
      { id: 'permanentti-pitka', name: 'Permanentti ja leikkaus, pitkät', price: 150, priceMax: 170 },
      { id: 'osapermanentti', name: 'Osapermanentti ja leikkaus', price: 115 },
      { id: 'tyvivari', name: 'Tyviväri (alle 1,5 cm), sis. leikkauksen', price: 125, priceMax: 135 },
      { id: 'monivari-lyhyt', name: 'Monivärjäys, sis. leikkauksen, lyhyet', price: 140, priceMax: 150 },
      { id: 'monivari-pitka', name: 'Monivärjäys, sis. leikkauksen, pitkät', price: 150, priceMax: 180 },
      // perHour = tuntihinta (75 €/h)
      { id: 'raidoitukset', name: 'Raidoitukset / vaalennukset / vaalennuspesut', price: 75, perHour: true },
    ],
  },
  {
    id: 'kampaukset',
    title: 'Kampaukset',
    services: [
      { id: 'kampaukset', name: 'Kampaukset', price: 75, perHour: true },
      // priceFrom = "alk." hinnan edessä
      { id: 'haakampaus', name: 'Hääkampaus, sis. suunnittelun ja koekampauksen', price: 170, priceFrom: true },
    ],
  },
//   // VAHVISTETTAVA: tarjoaako Siiri kulmien ja ripsien värjäystä?
//   // Jos ei, poista koko lohko.
//   {
//     id: 'kulmat-ripset',
//     title: 'Kulmat ja ripset',
//     services: [
//       { id: 'kulmat', name: 'Kulmien kestovärjäys ja muotoilu', price: 20 },
//       { id: 'ripset', name: 'Ripsien kestovärjäys', price: 20 },
//       { id: 'ripset-kulmat', name: 'Ripset ja kulmat yhdessä', price: 38 },
//       { id: 'ripset-kulmat-lisa', name: 'Ripset ja kulmat muun työn yhteydessä', price: 30 },
//     ],
//   },
  // Paketit (hiukset + kynnet samalla käynnillä) lisätään takaisin vasta,
  // kun leikkaus- ja kampaushinnat on vahvistettu: ne laskettiin vanhoista hinnoista.
]