# GlossTahko – verkkosivusto

Yhden sivun verkkosivusto nilsiäläiselle kynsi- ja kampaamoyritykselle **GlossTahko** (Nilsiä ja Tahko). Sivusto rakennetaan vaihe vaiheelta oppimisprojektina, ja versionhallinta on ollut mukana alusta asti.

## Tavoitteet

- Yksi sivu, jossa osiot ovat allekkain ja ylhäällä on tab-palkki, joka vie oikeaan kohtaan
- Mobiili ensin, toimii sujuvasti puhelimella
- Näkyy Google-haussa (paikallinen SEO: Nilsiä, Tahko)
- Ei backendia eikä tietojen tallennusta: ajanvaraus ja some ovat ulkoisia linkkejä
- Ei evästeitä eikä kolmansien osapuolten pyyntöjä (fontit ovat omassa paketissa)
- Kaksi vaihdettavaa tyyliä, **Boho** ja **Minimal**, joista toinen valitaan lopulliseen käyttöön

## Teknologiat

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (kehityspalvelin ja build)
- Pelkkä CSS: muuttujat (design tokens), mobile first, ei CSS-kirjastoja
- Fontit [Fontsourcesta](https://fontsource.org/) (Lora, Cormorant Garamond, Mrs Saint Delafield, Jost)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) lintaukseen
- Versionhallinta: Git + GitHub

## Käynnistys

Vaatii Node.js:n LTS-version (v22.12 tai uudempi).

```bash
npm install
npm run dev      # kehityspalvelin, http://localhost:5173
npm run build    # tyyppitarkistus + tuotantobuild kansioon dist/
npm run lint     # Oxlint
npm run preview  # esikatsele tuotantobuild
```

## Projektin rakenne

```
src/
├── components/
│   ├── layout/      Header (tabit), Footer
│   ├── sections/    Hero, Intro, About, Services, Tahko, Faq, Contact
│   └── ui/          BookingButton, SectionHeading (+ Sprig, ei käytössä)
├── config/
│   ├── site.ts      yrityksen tiedot: yhteystiedot, some, ajanvaraus
│   └── nav.ts       tabit ja osioiden id:t (Header ja Footer lukevat tästä)
├── data/
│   ├── services.ts  hinnasto (kategoriat, hinnat, kestot)
│   ├── products.ts  käytössä oleva kynsisarja
│   └── faq.ts       UKK ja "Hyvä tietää" -kortit
├── hooks/
│   ├── useActiveSection.ts   aktiivinen osio vieritettäessä (tabin korostus)
│   └── useOverHero.ts        onko header heron päällä (läpinäkyvä vs. utuinen)
├── styles/
│   ├── tokens.css      värit, fontit, mitat (teeman vaihto tapahtuu täällä)
│   ├── base.css        nollaus, perustyylit, apuluokat
│   ├── layout.css      header, tabit, footer
│   ├── components.css  painikkeet, otsikot, chipit, boho-koristeet
│   └── sections.css    osiokohtaiset tyylit
├── types/           yhteiset TypeScript-tyypit
├── utils/           hinnan ja keston muotoilu
├── assets/images/   lehvä ja kukkaoksat (läpinäkyvät webp-kuvat)
├── App.tsx          kokoaa sivun osiot
├── index.css        tuo fontit ja tyylitiedostot
└── main.tsx         sovelluksen käynnistys
```

Sisältö (`data/`, `config/`) on erillään ulkoasusta, jotta hintojen, UKK:n ja yhteystietojen päivitys ei vaadi komponenttien muokkaamista.

## Tyyli

- **Boho** on toteutettu: terrakotta, kermanvalkoinen ja salvianvihreä, käsinkirjoitettu otsikkofontti, kukkaoksakoristeet ja pehmeät kortit.
- Heron päällä yläpalkki on läpinäkyvä. Sen jälkeen se on utuinen vaalea palkki, ja aktiivinen tabi korostuu.
- Kukkaoksat ovat CSS-maskeja, joten niiden väri vaihtuu pelkällä `color`-arvolla.
- **Minimal** toteutetaan vaihtamalla `tokens.css`:n arvot ja karsimalla koristeet.

## Eteneminen

- [x] Vite + React + TypeScript -pohja
- [x] Hakemistorakenne ja osiot omiksi komponenteiksi
- [x] Osioiden sisältö ja palveluhinnasto datana (`data/services.ts`)
- [x] Yrityksen tiedot yhteen paikkaan (`config/`) ja uudelleenkäytettävät komponentit (`BookingButton`, `SectionHeading`)
- [x] CSS: mobile first, sticky tab-palkki, Boho-tyyli
- [x] Interaktiivisuus: aktiivinen tab, läpinäkyvä yläpalkki, UKK-haitari
- [ ] Oikeat valokuvat (kaarikehykset) ja mahdolliset scroll-animaatiot
- [ ] Teema: Minimal ja valinta
- [ ] SEO: meta-tagit, rakenteinen data (JSON-LD), sitemap, esirenderöinti
- [ ] Julkaisu: domain, hosting ja Google Business Profile

## Ennen julkaisua

- Vaihda `bookingUrl` (`config/site.ts`) ajanvarausjärjestelmän linkkiin, kun se on käytössä, ja päivitä UKK:n vastaus "Miten varaan ajan?"
- Tarkista hinnat (`data/services.ts`), UKK (`data/faq.ts`) ja tuotetiedot (`data/products.ts`) yrittäjän kanssa
- Päätä, mitä osoitetta sivulla näytetään, ja lisää maksutavat vasta, kun ne ovat käytössä
- Lisää oikeat kuvat ja alt-tekstit; koristekuvissa `alt=""`
- Käy läpi tietoturvatarkistuslista: sivulla ei ole salaisuuksia, lomakkeita eikä analytiikkaa. Jos lisäät jonkin niistä, päivitä alatunnisteen tietosuojateksti.
- Jos ajanvaraus tai analytiikka lisätään, tarkista kolmansien osapuolten skriptit ja evästeilmoitus

## Lisenssi ja sisältö

Koodi on oppimis- ja portfolio-käyttöön. Sivuston tekstit, kuvat ja logo kuuluvat GlossTahkolle, eikä niitä saa käyttää uudelleen ilman lupaa.
