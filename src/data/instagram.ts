/**
 * Instagram-julkaisut (@glosstahko), jotka näytetään Minusta-osiossa karusellissa.
 *
 * Miten julkaisut näytetään?
 * - Kun kävijä sallii Instagram-sisällön (karusellin yläpuolella oleva valinta), jokainen
 *   julkaisu ladataan suoraan Instagramista upotuksena. Ennen suostumusta kortissa on
 *   esikatselu (päiväys ja teksti), eikä Metaan lähde pyyntöjä.
 *
 * UUDEN JULKAISUN LISÄYS (vain linkki riittää):
 * 1. Avaa julkaisu Instagramissa > kolme pistettä > "Kopioi linkki".
 *    Linkki on muotoa https://www.instagram.com/glosstahko/p/TUNNISTE/ (reel: /reel/TUNNISTE/).
 * 2. Lisää rivi tähän listaan (uusin ensin) ja liitä linkki `url`-kenttään.
 * 3. `date` ja `text` ovat valinnaisia: ne näkyvät vain esikatselukortissa ennen suostumusta.
 *    Jos jätät ne pois, esikatselussa lukee "Instagram-julkaisu".
 * Upotus näyttää kuvan, kuvatekstin ja tykkäykset Instagramin omana korttina.
 *
 * Miksi käsin poimittu lista eikä automaattinen syöte?
 * - Virallinen rajapinta vaatisi palvelimen ja pääsyavaimen.
 * - Käsin poimittu lista näyttää vain ne julkaisut, jotka Siiri haluaa esiin.
 */
export type InstagramPost = {
  id: string // julkaisun tunniste (osoitteen loppuosa)
  kind: 'p' | 'reel' // kuvajulkaisu vai reel
  date?: string // näytettävä päiväys (valinnainen)
  text?: string // noston alku esikatselussa (valinnainen)
}

type PostSource = { url: string; date?: string; text?: string }

/** Poimii linkistä tunnisteen ja tyypin. Heittää virheen, jos linkki ei ole Instagram-julkaisun osoite. */
export function parseInstagramUrl(url: string): Pick<InstagramPost, 'id' | 'kind'> {
  const match = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels)\/([\w-]+)/)
  if (!match) throw new Error(`Ei Instagram-julkaisun osoite: ${url}`)
  return { id: match[2], kind: match[1] === 'p' ? 'p' : 'reel' }
}

const sources: PostSource[] = [
  {
    url: 'https://www.instagram.com/glosstahko/p/DehljGiN8mO/',
    date: '15.10.2026',
    text: 'Ensimmäinen geelilakkaus tälle ihanalle asiakkaalle! 🩷',
  },
  {
    url: 'https://www.instagram.com/glosstahko/p/DeMdqkvtkCE/',
    date: '7.10.2026',
    text: 'Tän päivän geelilakkaus huolto & uusi ihana "pink milk" -sävy, joka sopii melkeinpä jokaiseen hetkeen ja asuun! 🩷',
  },
  {
    url: 'https://www.instagram.com/glosstahko/p/DeKjtoItgVt/',
    date: '6.10.2026',
    text: 'Mitä jos ottaisit hetken ihan vain itsellesi? ✨',
  },
  // TODO (Eero): neljäs, vanhin julkaisu puuttuu. Kopioi sen linkki Instagramista ja lisää tähän:
  // { url: 'https://www.instagram.com/glosstahko/p/TUNNISTE/', date: 'PP.KK.VVVV', text: 'noston alku' },
]

export const instagramPosts: InstagramPost[] = sources.map(({ url, ...rest }) => ({
  ...parseInstagramUrl(url),
  ...rest,
}))
