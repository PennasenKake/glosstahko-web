/**
 * Käytössä olevat tuotesarjat. Data on omassa tiedostossaan, jotta
 * sarjan vaihto tai lisäys ei vaadi komponentin muokkausta.
 *
 * TARKISTETTAVA Siirin kanssa ennen julkaisua: sarjan nimi, tuotteet
 * ja väite EU-kosmetiikka-asetuksen mukaisuudesta (hakemuksessa mainittu).
 */
export type ProductLine = {
  label: string // esim. "Kynsituotteet"
  brand: string // sarjan nimi
  description: string
  items: string[]
}

export const nailProducts: ProductLine = {
  label: 'Kynsituotteet',
  brand: 'Inveray',
  description:
    'Kynsissä käytän Inveray-ammattilaissarjaa. Tuotteet ovat EU:n kosmetiikka-asetuksen mukaisia, ja geelit kovetetaan UV/LED-valolla.',
  items: [
    'Luxury Collection -geelilakat',
    'Builder in a Bottle (BIAB)',
    'No Wipe -pintageelit',
    'Natural Vibes -pohjageeli',
    'Vitamin Booster ja Nourishing Elixir -hoitotuotteet',
  ],
}
