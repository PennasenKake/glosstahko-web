import SectionHeading from '../ui/SectionHeading'

/**
 * Kysymykset ja vastaukset taulukkona: uuden kysymyksen lisäys on yksi rivi,
 * eikä JSX:ää tarvitse kopioida. (Vaiheessa 5 tästä tehdään haitari.)
 */
const questions = [
  {
    q: 'Miten varaan ajan?',
    a: 'Ajanvaraus hoidetaan toistaiseksi Instagramissa tai puhelimitse. Paina Varaa aika -painiketta tai soita.',
  },
  {
    q: 'Kuinka kauan geelilakkaus kestää?',
    a: 'Tyypillisesti 3–4 viikkoa. Uusintaväliksi suosittelen noin kolmea viikkoa. Jos lakkaus nousee heti, kerro 7 vuorokauden sisällä, niin korjaan sen.',
  },
  {
    q: 'Mitä jos en pääse paikalle?',
    a: 'Peruutus viimeistään 24 tuntia ennen aikaa, jotta aika vapautuu toiselle.',
  },
  {
    q: 'Tarvitseeko hiusten värjäykseen ihotesti?',
    a: 'Ihotesti suositellaan aina, kun käytät väriainetta ensimmäistä kertaa. Kysy ohjeet varattaessa.',
  },
  {
    q: 'Tuletko mökille tai hotellille Tahkolla?',
    a: 'Kyllä, sesonkien aikana tarjolla on liikkuvaa kampaamo- ja kynsipalvelua. Sovi tarve etukäteen.',
  },
]

export default function Faq() {
  return (
    <section id="ukk" className="section" aria-labelledby="ukk-otsikko">
      <div className="container">
        <SectionHeading id="ukk-otsikko" eyebrow="Hyvä tietää" title="Usein kysyttyä" />

        <div className="faq__list">
          {questions.map((item) => (
            <div className="faq__item" key={item.q}>
              <h3 className="faq__question">{item.q}</h3>
              <p className="faq__answer">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
