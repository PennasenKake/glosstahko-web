import HeroVines from '../ui/HeroVines'
import { site } from '../../config/site'
import leaf from '../../assets/images/leaf.webp'
import SectionHeading from '../ui/SectionHeading'

/** Liikkuva palvelu: kotiin, mökille tai tapahtumaan Nilsiässä, Tahkolla ja lähialueilla. Ajat puhelimitse tai sähköpostilla. */
export default function Tahko() {
  return (
    <section id="tahko" className="section section--alt" aria-labelledby="tahko-otsikko">
      <HeroVines variant="d" side="left" className="sidevine sidevine--tahko" watch />
      <img
        className="leaf-deco tahko__leaf"
        src={leaf}
        alt=""
        width={640}
        height={574}
        loading="lazy"
      />
      <div className="container container--narrow">
        <SectionHeading id="tahko-otsikko" eyebrow="Liikkuva palvelu" title="Luoksesi" />

        <p className="tahko__lead" data-reveal>
          Liikkuva kynsi- ja kampaamopalvelu suoraan luoksesi.
        </p>
        <p className="tahko__text" data-reveal>
          Haluatko säästää aikaa ja nauttia hemmotteluhetkestä omassa rauhassasi?
          GlossTahko tuo laadukkaat geelilakkaukset ja kampaamopalvelut suoraan
          luoksesi: kotiin, mökille tai tapahtumaan.
        </p>
        <p className="tahko__text" data-reveal>
          Toimialueeni sydän on Nilsiä ja Tahko, ja liikun joustavasti myös
          lähialueilla sopimuksen mukaan. Voit varata minut yksityiskäynnille,
          ystävysten iltaan, pikkujouluihin tai vaikkapa hääseurueen laittamiseen.
          Tuon mukanani kaiken tarvittavan, sinun tarvitsee vain varata kalenterista
          aika ja järjestää minulle pieni työtila.
        </p>

        <ul className="chip-list tahko__list" data-reveal>
          <li className="chip">Kotiin, mökille tai tapahtumaan</li>
          <li className="chip">Ystävysten illat ja pikkujoulut</li>
          <li className="chip">Hääseurueet</li>
        </ul>

        <p className="tahko__booking" data-reveal>
          Liikkuvan palvelun ajat varataan puhelimitse tai sähköpostilla, ei
          Booksalonissa. Matkakulukorvaus sovitaan tapauskohtaisesti.
        </p>

        <div className="tahko__actions" data-reveal>
          <a className="btn btn--primary" href={site.phoneHref}>
            Soita {site.phone}
          </a>
          <a className="btn btn--ghost" href={`mailto:${site.email}`}>
            Lähetä sähköpostia
          </a>
        </div>
      </div>
    </section>
  )
}
