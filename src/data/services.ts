import type { ServiceCategory } from '../types'

// LUONNOS: hinnat ja kestot ovat suuntaa antavia, tarkistetaan ennen julkaisua.
// Hinnat sisältävät alv:n 25,5 %.
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
      { id: 'poisto-toinen-tekija', name: 'Poisto toisen tekijän geelistä', minutes: 15, price: 10, addon: true },
      { id: 'nail-art', name: 'Kynsikoristelu (nail art)', minutes: 10, minutesMax: 20, price: 5, priceFrom: true, addon: true },
      { id: 'ranskalainen', name: 'Ranskalainen / milky white', minutes: 15, price: 10, addon: true },
    ],
  },
  {
    id: 'hiukset',
    title: 'Hiukset',
    description: 'Lopullinen hinta tarkentuu konsultaatiossa, koska hiusten pituus ja tuotemäärä vaihtelevat.',
    services: [
      { id: 'leikkaus-nainen', name: 'Naisten leikkaus', minutes: 45, price: 45 },
      { id: 'leikkaus-mies', name: 'Miesten leikkaus', minutes: 30, price: 32 },
      { id: 'leikkaus-lapsi', name: 'Lasten leikkaus (alle 12 v)', minutes: 30, price: 25 },
      { id: 'juurikasvu', name: 'Juurikasvuvärjäys', minutes: 90, price: 95 },
      { id: 'varjays-lyhyt', name: 'Värjäys + leikkaus, lyhyet hiukset', minutes: 120, price: 120, priceFrom: true },
      { id: 'varjays-pitka', name: 'Värjäys + leikkaus, pitkät hiukset', minutes: 150, price: 150, priceFrom: true },
      { id: 'raidat', name: 'Raidat / vaalennus / balayage', minutes: 150, minutesMax: 180, price: 160, priceFrom: true },
      { id: 'tehohoito', name: 'Tehohoito (lisäpalveluna)', minutes: 20, price: 25, addon: true },
      { id: 'erikoishoito', name: 'Rakenne- tai erikoishoito', minutes: 45, price: 55 },
      { id: 'juhlakampaus', name: 'Juhlakampaus', minutes: 60, price: 110 },
      { id: 'haakampaus', name: 'Hääkampaus (sis. koristeiden kiinnityksen)', minutes: 90, price: 140 },
      { id: 'haakampaus-koe', name: 'Hääkampauksen koekerta', minutes: 60, price: 80 },
    ],
  },
  {
    id: 'paketit',
    title: 'Paketit',
    description: 'Hiukset ja kynnet samalla käynnillä.',
    services: [
      { id: 'paketti-hemmottelu', name: 'Hemmottelu', minutes: 105, price: 95, note: 'Naisten leikkaus + geelilakkaus. Säästö 5 €' },
      { id: 'paketti-juhlavalmis', name: 'Juhlavalmis', minutes: 120, price: 155, note: 'Juhlakampaus + geelilakkaus. Säästö 10 €' },
      { id: 'paketti-morsius', name: 'Morsiuspaketti', minutes: 210, price: 260, note: 'Hääkampaus + koekerta + geelilakkaus. Säästö 15 €' },
    ],
  },
]