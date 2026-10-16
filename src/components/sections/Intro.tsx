/**
 * Lyhyt esittely heron alla: yksi lause, mitä GlossTahko tekee,
 * ja avainsanat chipeinä. Tämä teksti on tärkeä myös Google-haulle.
 *
 * Chipit ovat taulukossa: lisääminen tai poisto tehdään yhdessä paikassa.
 */
const highlights = [
  'Kynsiteknikko',
  'Kampaaja',
  'Liikkuva palvelu Tahkolla',
  'Ammattilaistuotteet',
]

export default function Intro() {
  return (
    // Ei omaa otsikkoa, joten nimetään osio aria-labelilla
    <section className="intro" aria-label="Lyhyt esittely">
      <div className="container container--narrow">
        <p className="intro__text">
          GlossTahko tarjoaa geelilakkaukset, kynnet, hiusten värjäykset ja
          juhlakampaukset saman katon alla Nilsiässä. Sesonkien aikana
          palvelu tulee myös mökille, majoitukseen tai juhlapaikalle
          Tahkolla.
        </p>

        <ul className="chip-list">
          {highlights.map((text) => (
            <li className="chip" key={text}>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
