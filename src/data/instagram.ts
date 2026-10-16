/**
 * Instagram-nostot (@glosstahko), jotka näytetään Minusta-osiossa.
 *
 * Miksi käsin poimittu lista eikä automaattinen syöte?
 * - Virallinen rajapinta vaatisi palvelimen ja pääsyavaimen.
 * - Käsin poimittu lista on nopea ja näyttää vain ne nostot, jotka Siiri haluaa esiin.
 * - Julkaisu latautuu Instagramista (iframe-upotus) vasta, kun kävijä on
 *   hyväksynyt sen suostumuspalkissa tai napauttanut "Näytä julkaisu". Muuten
 *   kortti on esikatselu, eikä Metalle tehdä pyyntöjä eikä evästeitä synny.
 *
 * Uuden noston lisäys: kopioi osoite (instagram.com/glosstahko/p/TUNNISTE/),
 * lisää rivi tämän listan alkuun ja kirjoita siihen noston alku.
 *
 * Esikatselukuva (valinnainen): tallenna noston kuva kansioon src/assets/instagram/ nimellä
 * TUNNISTE.jpg (esim. DehljGiN8mO.jpg). Ne löytyvät automaattisesti
 * (import.meta.glob), eikä koodiin tarvitse lisätä importteja. Jos kuvaa
 * ei ole, kortti näyttää pelkän tekstin.
 */

// Vite etsii kaikki kansion jpg-kuvat buildin aikana: { '../assets/instagram/ABC.jpg': 'osoite' }
const imageFiles = import.meta.glob('../assets/instagram/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// Tunniste -> kuvan osoite
const imagesById = Object.fromEntries(
  Object.entries(imageFiles).map(([path, url]) => [path.split('/').pop()!.replace('.jpg', ''), url]),
)

type PostInfo = {
  id: string // osoitteen lopussa oleva tunniste
  date: string // näytettävä päiväys
  text: string // noston alku (Siirin omin sanoin)
  imageAlt?: string // kuvan kuvaus ruudunlukijalle (tyhjä = koriste, teksti kertoo jo asian)
}

export type InstagramPost = PostInfo & { image?: string }

const posts: PostInfo[] = [
  {
    id: 'DehljGiN8mO',
    date: '15.10.2026',
    text: 'Ensimmäinen geelilakkaus tälle ihanalle asiakkaalle! 🩷',
    imageAlt: 'Lyhyet, luonnollisen vaaleanpunaiset geelilakatut kynnet',
  },
  {
    id: 'DeMdqkvtkCE',
    date: '7.10.2026',
    text: 'Tän päivän geelilakkaus huolto & uusi ihana "pink milk" -sävy, joka sopii melkeinpä jokaiseen hetkeen ja asuun! 🩷',
  },
  {
    id: 'DeKjtoItgVt',
    date: '6.10.2026',
    text: 'Mitä jos ottaisit hetken ihan vain itsellesi? ✨',
  },
]

/** Nostot kuvineen. Kuva liitetään tunnisteen perusteella. */
export const instagramPosts: InstagramPost[] = posts.map((post) => ({
  ...post,
  image: imagesById[post.id],
}))
