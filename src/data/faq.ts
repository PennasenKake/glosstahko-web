/**
 * Usein kysytyt kysymykset. Uuden kysymyksen lisäys on yksi rivi tähän.
 * Faq-komponentti piirtää ne haitarina.
 *
 * Maksutapoja ei mainita tarkoituksella: korttimaksu tulee käyttöön
 * vasta, kun maksupääte on hankittu.
 */
export type FaqItem = {
  q: string
  a: string
}

export const faq: FaqItem[] = [
  {
    q: 'Miten varaan ajan?',
    a: 'Ajanvaraus hoidetaan toistaiseksi Instagramissa tai puhelimitse. Paina Varaa aika -painiketta tai soita.',
  },
  {
    q: 'Voinko tehdä kynnet ja hiukset samalla käynnillä?',
    a: 'Kyllä. Kynsi- ja hiuspalvelut saa saman katon alta, joten useamman palvelun kokonaisuus onnistuu yhdellä käynnillä. Mainitse varatessa, mitä haluat.',
  },
  {
    q: 'Kuinka kauan geelilakkaus kestää?',
    a: 'Tyypillisesti 3–4 viikkoa. Uusintaväliksi suosittelen noin kolmea viikkoa. Jos lakkaus nousee heti, kerro 7 vuorokauden sisällä, niin korjaan sen.',
  },
  {
    q: 'Mitä eroa on geelilakkauksella ja vahvistuksella?',
    a: 'Geelilakkaus on värigeeli omille kynsille. Vahvistuksessa kynnen päälle tehdään rakenne builder-geelillä (BIAB), ja värigeeli tulee sen päälle. Vahvistus sopii heikoille tai helposti halkeileville kynsille.',
  },
  {
    q: 'Mitä tuotteita käytät?',
    a: 'Kynsissä käytän Inveray-ammattilaissarjaa ja LED-kovetusta. Tuotteet ovat EU:n kosmetiikka-asetuksen mukaisia. Hiuksissa käytetään ammattilaistuotteita, ja tarvittaessa kerron värjäyksen tuotteista tarkemmin.',
  },
  {
    q: 'Miten hygienia hoidetaan?',
    a: 'Työvälineet puhdistetaan ja desinfioidaan jokaisen asiakkaan jälkeen ja steriloidaan kuumailmasterilaattorissa. Kynsipöly imuroidaan suodattimella työpöydältä.',
  },
  {
    q: 'Tarvitseeko hiusten värjäykseen ihotesti?',
    a: 'Ihotesti suositellaan aina, kun käytät väriainetta ensimmäistä kertaa. Kysy ohjeet varattaessa.',
  },
  {
    q: 'Mitä hääkampaus sisältää?',
    a: 'Hääkampauksen hinta alkaen 170 € sisältää suunnittelun ja koekampauksen, joten lopputulos on valmiiksi mietitty ennen suurta päivää.',
  },
  {
    q: 'Tuletko mökille tai hotellille Tahkolla?',
    a: 'Kyllä, sesonkien aikana tarjolla on liikkuvaa kampaamo- ja kynsipalvelua mökille, majoitukseen ja juhlapaikalle. Ryhmille hinta sovitaan etukäteen.',
  },
  {
    q: 'Missä palvelu on?',
    a: 'Nilsiän keskustassa, ja sesonkien aikana liikkuvana Tahkon alueella. Kysy tarkka osoite ajanvarauksen yhteydessä.',
  },
  {
    q: 'Mitä jos en pääse paikalle?',
    a: 'Peruutus viimeistään 24 tuntia ennen aikaa, jotta aika vapautuu toiselle.',
  },
]

/** "Hyvä tietää" -kortit UKK:n yläpuolella: lyhyet lupaukset ilman kysymystä. */
export const goodToKnow = [
  { title: 'Kiireetön', text: 'Aikaa on varattu niin, ettei kiireen tunnetta tule. Suunnitellaan yhdessä, mikä sopii sinulle.' },
  { title: 'Turvalliset tuotteet', text: 'Ammattilaissarjat, LED-kovetus ja huolellinen hygienia joka kerta.' },
  { title: 'Yhdellä käynnillä', text: 'Kynnet ja hiukset saman katon alta, Nilsiässä tai liikkuvana Tahkolla.' },
  { title: 'Peruutus 24 h', text: 'Kerro peruutuksesta viimeistään vuorokautta ennen, niin aika vapautuu toiselle.' },
] as const
