/**
 * Instagram-nostot (@glosstahko), jotka näytetään Minusta-osiossa.
 *
 * Miksi käsin poimittu lista eikä automaattinen syöte?
 * - Virallinen rajapinta vaatisi palvelimen ja pääsyavaimen.
 * - Käsin poimittu lista on nopea ja näyttää vain ne nostot, jotka Siiri haluaa esiin.
 *
 * Miten julkaisu näytetään?
 * - Kortissa on heti näkyvissä noston päiväys ja teksti (teaser) sekä logon lehvä
 *   kuvapaikalla. Instagramiin (Meta) ei tehdä yhtään pyyntöä, ennen kuin kävijä
 *   painaa "Näytä julkaisu". Silloin kortti vaihtuu Instagramin omaksi upotukseksi.
 *   Näin sivu pysyy evästeettömänä, eikä suostumuspalkkia tarvita.
 *
 * Uuden noston lisäys: kopioi osoite (instagram.com/glosstahko/p/TUNNISTE/),
 * lisää rivi tämän listan alkuun ja kirjoita siihen noston alku.
 */
export type InstagramPost = {
  id: string // osoitteen lopussa oleva tunniste
  date: string // näytettävä päiväys
  text: string // noston alku (Siirin omin sanoin)
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
