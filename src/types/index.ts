/**
 * Yksi palvelu hinnastossa (esim. "Geelilakkaus omille kynsille").
 * Kesto ja hinta ovat numeroita, ei tekstiä: ne voi laskea, järjestää
 * ja viedä myöhemmin esimerkiksi CSV:ksi. Näyttömuoto tehdään
 * utils/format.ts-tiedostossa.
 */
export type Service = {
  /** Uniikki tunniste. Reactin `key` käyttää tätä listoissa. */
  id: string
  /** Palvelun nimi sivulla. */
  name: string
  /** Kesto minuutteina. Valinnainen, koska kaikilla palveluilla ei ole kestoa. */
  minutes?: number
  /** Kestohaarukan yläraja (esim. 150–180 min). */
  minutesMax?: number
  /** Hinta euroina, sisältää alv:n. Haarukassa alaraja. */
  price: number
  /** Hintahaarukan yläraja (esim. 48–52 €). */
  priceMax?: number
  /** Näytetään "alk." hinnan edessä. */
  priceFrom?: boolean
  /** Hinta on euroa tunnilta (esim. 75 €/h). */
  perHour?: boolean
  /** Lisäpalvelu, jonka kesto ja hinta näytetään plus-merkillä (+10 €). */
  addon?: boolean
  /** Lisätieto rivin alle, esim. paketin sisältö. */
  note?: string
}

/**
 * Hinnaston pääryhmät eli kaksi saraketta. Unioni-tyyppi sallii vain
 * nämä kaksi arvoa: kirjoitusvirhe (esim. 'hiuksed') ei käänny.
 */
export type ServiceGroup = 'kynnet' | 'hiukset'

/**
 * Ryhmä palveluita (esim. "Kynnet"). Sivu piirtää jokaisesta
 * oman otsikon ja listan.
 */
export type ServiceCategory = {
  id: string
  title: string
  /** Kumpaan sarakkeeseen kategoria sijoitetaan hinnastossa. */
  group: ServiceGroup
  /** Lyhyt selite otsikon alle, valinnainen. */
  description?: string
  services: Service[]
}