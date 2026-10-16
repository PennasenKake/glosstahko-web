/**
 * Instagram-nostot (@glosstahko), jotka näytetään Minusta-osiossa.
 *
 * Miksi käsin poimittu lista eikä upotus (embed)?
 * - Instagramin upotus lataisi Metan skriptit ja evästeet, ja sivu lupaa,
 *   ettei se käytä evästeitä eikä kolmansien osapuolten pyyntöjä.
 * - Virallinen rajapinta vaatisi palvelimen ja pääsyavaimen.
 * - Käsin poimittu lista on nopea, toimii ilman JavaScriptiä ja näyttää
 *   vain ne nostot, jotka Siiri haluaa esiin.
 *
 * Uuden noston lisäys: kopioi osoite (instagram.com/glosstahko/p/TUNNISTE/),
 * lisää rivi tämän listan alkuun ja kirjoita siihen noston alku.
 *
 * `image` on valinnainen. Jos kuva puuttuu, kortti näyttää tekstin.
 * Kuva laitetaan kansioon src/assets/instagram/ ja tuodaan importilla.
 */
export type InstagramPost = {
  id: string // osoitteen lopussa oleva tunniste
  date: string // näytettävä päiväys
  text: string // noston alku (Siirin omin sanoin)
  image?: string
  imageAlt?: string
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 'DehljGiN8mO',
    date: '15.10.2026',
    text: 'Ensimmäinen geelilakkaus tälle ihanalle asiakkaalle! 🩷',
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
