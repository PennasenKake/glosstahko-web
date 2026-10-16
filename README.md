# GlossTahko – verkkosivusto

Yhden sivun verkkosivusto nilsiäläiselle kynsi- ja kampaamoyritykselle **GlossTahko** (Nilsiä ja Tahko). Sivusto on rakenteilla, ja se rakennetaan vaihe vaiheelta oppimisprojektina.

## Tavoitteet

- Yksi sivu, jossa osiot ovat allekkain ja ylhäällä on tab-palkki, joka vie oikeaan kohtaan
- Mobiili ensin, toimii sujuvasti puhelimella
- Näkyy Google-haussa (paikallinen SEO: Nilsiä, Tahko)
- Ei backendia eikä tietojen tallennusta: ajanvaraus ja some ovat ulkoisia linkkejä
- Kaksi vaihdettavaa tyyliä, **Boho** ja **Minimal**, joista toinen valitaan lopulliseen käyttöön

## Teknologiat

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (kehityspalvelin ja build)
- CSS (muuttujat ja mobile first)
- Versionhallinta: Git + GitHub

## Käynnistys

Vaatii Node.js:n LTS-version (v22.12 tai uudempi).

```bash
npm install
npm run dev      # kehityspalvelin, http://localhost:5173
npm run build    # tyyppitarkistus + tuotantobuild kansioon dist/
npm run preview  # esikatsele tuotantobuild
```

## Projektin rakenne

```
src/
├── components/
│   ├── layout/      Header, Footer
│   ├── sections/    Hero, Services, Tahko, About, Faq, Contact
│   └── ui/          pienet uudelleenkäytettävät komponentit
├── config/          yrityksen tiedot (yhteystiedot, linkit)
├── data/            palvelut, hinnat, UKK
├── hooks/           omat React-koukut
├── styles/          globaali CSS ja teemamuuttujat
├── types/           yhteiset TypeScript-tyypit
├── assets/images/   kuvat
├── App.tsx          kokoaa sivun osiot
└── main.tsx         sovelluksen käynnistys
```

Sisältö (`data/`, `config/`) on erillään ulkoasusta, jotta hintojen ja yhteystietojen päivitys ei vaadi komponenttien muokkaamista.

## Eteneminen

- [x] Vite + React + TypeScript -pohja
- [x] Hakemistorakenne ja osiot omiksi komponenteiksi
- [ ] Sisältö: yrityksen tiedot, palvelut ja hinnat
- [ ] CSS: mobile first, sticky tab-palkki
- [ ] Interaktiivisuus: aktiivinen tab, UKK-haitari
- [ ] Teemat: Boho ja Minimal
- [ ] SEO: meta-tagit, rakenteinen data, sitemap
- [ ] Julkaisu: domain ja hosting

## Lisenssi ja sisältö

Koodi on oppimis- ja portfolio-käyttöön. Sivuston tekstit, kuvat ja logo kuuluvat GlossTahkolle, eikä niitä saa käyttää uudelleen ilman lupaa.
