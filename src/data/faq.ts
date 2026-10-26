import { site } from '../config/site'

/**
 * Usein kysytyt kysymykset. Uuden kysymyksen lisäys on yksi rivi tähän.
 * Faq-komponentti piirtää ne haitarina.
 *
 * Maksutavoista kerrotaan vain korttimaksu (Siirin oma maksupääte, 26.10.2026). Muita
 * maksutapoja ei mainita ennen kuin ne on vahvistettu.
 * Tekstit perustuvat Siirin omiin sanamuotoihin (24.10.2026). Peruutusehdot ja takuu:
 * public/kayttoehdot.html.
 */
export type FaqItem = {
  q: string
  a: string
}

export const faq: FaqItem[] = [
  // POISTETTU UKK:STA 25.10.2026 (kommentoituna alla): kotihoito, ihotesti, hääkampaus, liikkuva palvelu.
  // Palauta kysymys poistamalla rivien alusta //.
  {
    q: 'Miten varaan ajan?',
    a: 'Kynsipalvelut (geelilakkaukset ja vahvistukset) varataan netissä Booksalonin verkkoajanvarauksessa ympäri vuorokauden. Kampaamopuolen aikoja (värit, leikkaukset, hoidot ja kampaukset) on toistaiseksi tarjolla rajoitetusti, ja tuplabuukkauksien välttämiseksi ne varataan Instagram-viestillä tai puhelimitse. Jos jokin ajanvarauksessa mietityttää, laita viestiä, niin palaan asiaan.',
  },
  {
    q: 'Miten voin maksaa?',
    a: 'Maksaminen onnistuu korttimaksulla. Maksupääte kulkee mukanani, joten korttimaksu onnistuu myös liikkuvassa palvelussa.',
  },
  {
    q: 'Voinko yhdistää palveluita samalle käynnille?',
    a: 'Kyllä. Kynsi- ja hiuspalvelut onnistuvat samalla käynnillä, mutta kampaamon puolelle on tarjolla rajallinen määrä aikoja. Niiden ajanvaraus tehdään Instagram-viestillä tai puhelimitse. Huom! Palvelu on kiireetön: en vastaa puheluihin asiakastyön aikana, joten laita viesti, niin soitan pian takaisin.',
  },
  {
    q: 'Kuinka kauan geelilakkaus kestää?',
    a: 'Huoltosuositus on noin 3 viikkoa. Mitä pidempi kynsi, sitä lyhyempi huoltoväli. Kesto on kuitenkin yksilöllinen, enkä suosittele kolmea tai neljää viikkoa pidempää väliä. Kynsillä on aina 7 vuorokauden takuu, joten tutustuthan takuuehtoihin käyttöehdoissa.',
  },
  {
    q: 'Mikä ero on geelilakkauksella ja vahvistuksella?',
    a: 'Palvelu suunnitellaan aina yksilöllisesti sinun tarpeidesi ja toiveidesi pohjalta. Luonnonkynttä voidaan vahvistaa geelillä: joustavalla geelillä kynnelle rakennetaan muoto ja stressipiste. Tuote kiinnittyy luonnonkynteen kestävästi ja elää sen mukana, mikä tuo lisävahvuutta. Sen avulla saadaan kasvatettua omia kynsiä, ja se voi auttaa pääsemään eroon esimerkiksi kynsien puremisesta tai repimisestä. Suositeltu huoltoväli on 3–4 viikkoa.',
  },
  {
    q: 'Mitä tuotteita käytät?',
    a: 'Käytän vain ammattikäyttöön sopivia, EU-standardien mukaisia tuotteita ja laitteita. Kynsissä käytän Inveray-ammattilaissarjaa ja LED-kovetusta. Kerron mielelläni tuotteista lisää!',
  },
  {
    q: 'Miten hygienia hoidetaan?',
    a: 'Desinfioin työpisteen päivän aluksi, jokaisen asiakkaan välillä ja päivän päätteeksi. Välineet puhdistetaan, desinfioidaan ja steriloidaan kuumailmasterilisaattorissa jokaisen asiakkaan välissä. Tarkemmat tiedot löytyvät omavalvontasuunnitelmasta.',
  },
  // {
  //   q: 'Miten hoidan kynsiä kotona?',
  //   a: 'Öljyä kynsinauhat ja kynnet vähintään kerran päivässä, älä käytä kynsiä työkaluina, käytä siivoushanskoja eikä viilaa, leikkaa tai nypi tuotetta itse. Jos kynteen tulee vaurio tai ilmatasku, ota yhteyttä korjausaikaa varten. Täydelliset kotihoito-ohjeet löytyvät omalta sivultaan.',
  // },
  // {
  //   q: 'Tarvitseeko hiusten värjäykseen ihotesti?',
  //   a: 'Ihotesti suositellaan aina, kun käytät väriainetta ensimmäistä kertaa. Kysy ohjeet varattaessa.',
  // },
  // {
  //   q: 'Mitä hääkampaus sisältää?',
  //   a: 'Hääkampauksen hinta alkaen 170 € sisältää suunnittelun ja koekampauksen, joten lopputulos on valmiiksi mietitty ennen suurta päivää.',
  // },
  // {
  //   q: 'Tuletko mökille tai hotellille Tahkolla?',
  //   a: 'Kyllä, sesonkien aikana tarjolla on liikkuvaa kampaamo- ja kynsipalvelua mökille, majoitukseen ja juhlapaikalle. Ryhmille hinta sovitaan etukäteen.',
  // },
  {
    q: 'Missä palvelu on?',
    a: `Toimitila on osoitteessa ${site.addressLine} (${site.addressNote}). Sesonkien aikana palvelu tulee liikkuvana myös Tahkon alueelle.`,
  },
  {
    q: 'Entä jos en pääse paikalle?',
    a: 'Peruutus tehdään viimeistään 24 tuntia ennen varattua aikaa. Sairastapauksissa ota yhteyttä, niin sovitaan korvaava aika. Tutustuthan peruutusehtoihin käyttöehdoissa ennen ajanvarausta: myöhään peruttu tai käyttämättä jäänyt aika veloitetaan.',
  },
]

/** "Hyvä tietää" -kortit UKK:n yläpuolella: lyhyet lupaukset ilman kysymystä. */
export const goodToKnow = [
  { title: 'Kiireetön', text: 'Aikaa on varattu niin, ettei kiireen tunnetta tule. Suunnitellaan yhdessä, mikä sopii sinulle.' },
  { title: 'Turvallisuus', text: 'Ammattilaissarjat, ammattitaito ja huolellinen hygienia joka kerta.' },
  { title: 'Yhdellä käynnillä', text: 'Palvelut voi yhdistää samalle käynnille joustavasti toimipisteellä Nilsiässä tai tarvittaessa liikkuvana palveluna.' },
  { title: 'Peruutus 24 h', text: 'Kerro peruutuksesta viimeistään vuorokautta ennen, niin aika vapautuu toiselle.' },
] as const
