# GlossTahko – verkkosivusto

Yhden sivun verkkosivusto nilsiäläiselle kynsi- ja kampaamoyritykselle **GlossTahko** (Nilsiä ja Tahko). Sivusto rakennetaan vaihe vaiheelta oppimisprojektina, ja versionhallinta on ollut mukana alusta asti.

## Tavoitteet

- Yksi sivu, jossa osiot ovat allekkain ja ylhäällä on tab-palkki, joka vie oikeaan kohtaan
- Mobiili ensin, toimii sujuvasti puhelimella
- Näkyy Google-haussa (paikallinen SEO: Nilsiä, Tahko)
- Ei backendia eikä tietojen tallennusta: ajanvaraus ja some ovat ulkoisia linkkejä
- Ei evästeitä eikä kolmansien osapuolten pyyntöjä (fontit ovat omassa paketissa)
- Yhtenäinen **Boho**-tyyli (valittu lopulliseksi teemaksi)

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
├── seo/             structuredData.ts: JSON-LD (yritys + palvelut) Googlelle
├── types/           yhteiset TypeScript-tyypit
├── utils/           hinnan ja keston muotoilu
├── assets/images/   lehvä ja kukkaoksat (läpinäkyvät webp-kuvat)
├── App.tsx          kokoaa sivun osiot
├── entry-server.tsx esirenderöinti (ajetaan vain buildissa)
├── index.css        tuo fontit ja tyylitiedostot
└── main.tsx         sovelluksen käynnistys (hydrateRoot / createRoot)

scripts/prerender.mjs   buildin jälkivaihe: HTML sisään, JSON-LD, sitemap.xml, robots.txt
public/                 favicon.svg, og-image.jpg (linkin esikatselukuva)
.env                    VITE_SITE_URL = sivuston osoite
```

Sisältö (`data/`, `config/`) on erillään ulkoasusta, jotta hintojen, UKK:n ja yhteystietojen päivitys ei vaadi komponenttien muokkaamista.

## SEO

`npm run build` tekee kolme asiaa: selainversio (`dist/`), palvelinversio (`dist-ssr/`) ja `scripts/prerender.mjs`, joka ajaa palvelinversion ja kirjoittaa valmiin HTML:n `dist/index.html`:ään. Google näkee sisällön ilman JavaScriptiä, ja selain "herättää" sivun eloon `hydrateRoot`illa. Skripti lisää myös JSON-LD:n sekä `sitemap.xml`:n ja `robots.txt`:n.

Sivuston osoite on yhdessä paikassa: `.env` (`VITE_SITE_URL`).

## Tyyli

- **Boho** on toteutettu: terrakotta, kermanvalkoinen ja salvianvihreä, käsinkirjoitettu otsikkofontti, kukkaoksakoristeet ja pehmeät kortit.
- Heron päällä yläpalkki on läpinäkyvä. Sen jälkeen se on utuinen vaalea palkki, ja aktiivinen tabi korostuu.
- Kukkaoksat ovat CSS-maskeja, joten niiden väri vaihtuu pelkällä `color`-arvolla.
- Teemaksi on valittu Boho, eikä Minimal-versiota tehdä. Värit, fontit ja mitat ovat silti `tokens.css`:ssä, joten sävyjä on helppo säätää.

## Eteneminen

- [x] Vite + React + TypeScript -pohja
- [x] Hakemistorakenne ja osiot omiksi komponenteiksi
- [x] Osioiden sisältö ja palveluhinnasto datana (`data/services.ts`)
- [x] Yrityksen tiedot yhteen paikkaan (`config/`) ja uudelleenkäytettävät komponentit (`BookingButton`, `SectionHeading`)
- [x] CSS: mobile first, sticky tab-palkki, Boho-tyyli
- [x] Interaktiivisuus: aktiivinen tab, läpinäkyvä yläpalkki, UKK-haitari
- [ ] Oikeat valokuvat (kaarikehykset) ja mahdolliset scroll-animaatiot
- [x] Teema valittu: Boho
- [x] SEO: meta-tagit, JSON-LD, sitemap, robots.txt, esirenderöinti (`npm run build`)
- [ ] Julkaisu: domain, hosting ja Google Business Profile

## Ennen julkaisua

- Vaihda `.env`:n `VITE_SITE_URL` oikeaan domainiin ja aja `npm run build` uudelleen (canonical, sitemap, JSON-LD ja og-kuvan osoite päivittyvät)
- Päivitä `public/og-image.jpg`, kun oikeat kuvat ovat mukana. Lisää sivu Google Search Consoleen ja lähetä sitemap
- Vaihda `bookingUrl` (`config/site.ts`) ajanvarausjärjestelmän linkkiin, kun se on käytössä, ja päivitä UKK:n vastaus "Miten varaan ajan?"
- Tarkista hinnat (`data/services.ts`), UKK (`data/faq.ts`) ja tuotetiedot (`data/products.ts`) yrittäjän kanssa
- Päätä, mitä osoitetta sivulla näytetään, ja lisää maksutavat vasta, kun ne ovat käytössä
- Lisää oikeat kuvat ja alt-tekstit; koristekuvissa `alt=""`
- Käy läpi tietoturvatarkistuslista: sivulla ei ole salaisuuksia, lomakkeita eikä analytiikkaa. Jos lisäät jonkin niistä, päivitä alatunnisteen tietosuojateksti.
- Jos ajanvaraus tai analytiikka lisätään, tarkista kolmansien osapuolten skriptit ja evästeilmoitus

## Lisenssi ja sisältö

Koodi on oppimis- ja portfolio-käyttöön. Sivuston tekstit, kuvat ja logo kuuluvat GlossTahkolle, eikä niitä saa käyttää uudelleen ilman lupaa.
