import InstagramFeed from '../ui/InstagramFeed'
import SectionHeading from '../ui/SectionHeading'

export default function About() {
  return (
    <section id="minusta" className="section" aria-labelledby="minusta-otsikko">
      <span className="flora flora--right flora--edge-right flora--soft" aria-hidden="true" />
      <div className="container container--narrow">
        <SectionHeading id="minusta-otsikko" eyebrow="Tekijä" title="Minusta" petals />

        <p className="about__text" data-reveal>
          Hei, olen Siiri. GlossTahko on oma yritykseni, ja tarjoan laadukkaita,
          kiireettömiä ja yksilöllisiä kynsi- ja hiuspalveluita. Minulla on
          hiusalan perustutkinto (Savon ammatti- ja aikuisopisto) sekä
          sertifioitu kynsiteknikon koulutus.
        </p>
        <p className="about__text" data-reveal>
          Käytän ammattilaistuotteita ja nykyaikaista LED-teknologiaa, jotta
          lopputulos on kaunis ja kestävä. Työskentelen Nilsiässä kokeneen
          hiusalan yrittäjän tiloissa, ja asiakkaan kanssa katsotaan aina
          yhdessä, mikä sopii juuri hänelle.
        </p>
      </div>

      <div className="container about__feed" data-reveal>
        <InstagramFeed />
      </div>
    </section>
  )
}
