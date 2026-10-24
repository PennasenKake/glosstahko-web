# GlossTahko – verkkosivusto

Yhden sivun verkkosivusto nilsiäläiselle kynsi- ja kampaamoyritykselle **GlossTahko** (Nilsiä ja Tahko). Sivusto rakennetaan vaihe vaiheelta oppimisprojektina, ja versionhallinta on ollut mukana alusta asti.

## Tavoitteet

- Yksi sivu, jossa osiot ovat allekkain ja ylhäällä on tab-palkki, joka vie oikeaan kohtaan
- Mobiili ensin, toimii sujuvasti puhelimella
- Näkyy Google-haussa (paikallinen SEO: Nilsiä, Tahko)
- Ei backendia eikä tietojen tallennusta: ajanvaraus ja some ovat ulkoisia linkkejä
- Ei evästeitä eikä kolmansien osapuolten pyyntöjä (fontit ovat omassa paketissa)
  - Poikkeukset ovat kävijän omasta painalluksesta alkavia: Instagram-julkaisut (Minusta) ja OpenStreetMap-kartta ladataan vasta, kun kävijä painaa "Näytä julkaisu" / "Näytä kartta". Ennen sitä ei lähde pyyntöjä Metalle tai OSM:lle, eikä sivu tarvitse evästebanneria.
- Yhtenäinen **Boho**-tyyli (valittu lopulliseksi teemaksi)

## Teknologiat

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (kehityspalvelin ja build)
- Pelkkä CSS: muuttujat (design tokens), mobile first, ei CSS-kirjastoja
- Fontit [Fontsourcesta](https://fontsource.org/) (Lora, Cormorant Garamond, Great Vibes, Jost)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) lintaukseen
- Versionhallinta: Git + GitHub

## Käynnistys

Vaatii Node.js:n LTS-version (v22.12 tai uudempi).

```bash
npm install
npm run dev      # kehityspalvelin, http://localhost:5173
npm run build    # tyyppitarkistus + tuotantobuild kansioon dist/
npm run lint     # Oxlint
npm test         # Vitest: kaavat, sisältödata ja sivun rakenne
npm run preview  # esikatsele tuotantobuild
```

## Projektin rakenne

```
src/
├── components/
│   ├── layout/      Header (tabit), Footer
│   ├── sections/    Hero, Intro, About, Services, Tahko, Faq, Contact
│   └── ui/          BookingButton, SectionHeading, PetalDrift (otsikon terälehdet),
│                    InstagramFeed (click-to-load), VenueCard (kartta)
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
│   ├── components.css  painikkeet, otsikot, chipit, boho-koristeet, terälehdet
│   ├── sections.css    osiokohtaiset tyylit
│   └── refine.css      hienosäätö: reveal-animaatiot, kartta- ja korttityylit
├── seo/             structuredData.ts: JSON-LD (yritys, palvelut ja UKK/FAQPage) Googlelle
├── types/           yhteiset TypeScript-tyypit
├── utils/           hinnan ja keston muotoilu
├── assets/images/   lehvä ja kukkaoksat (läpinäkyvät webp-kuvat)
├── App.tsx          kokoaa sivun osiot
├── entry-server.tsx esirenderöinti (ajetaan vain buildissa)
├── index.css        tuo fontit ja tyylitiedostot
└── main.tsx         sovelluksen käynnistys (hydrateRoot / createRoot)

scripts/prerender.mjs   buildin jälkivaihe: HTML sisään, JSON-LD, sitemap.xml, robots.txt
public/                 favicon.svg, og-image.jpg, tietosuoja.html, kayttoehdot.html, kotihoito.html,
                        404.html (staattisia, noindex 404:ssä), legal.css
.env                    VITE_SITE_URL = sivuston osoite
```

Sisältö (`data/`, `config/`) on erillään ulkoasusta, jotta hintojen, UKK:n ja yhteystietojen päivitys ei vaadi komponenttien muokkaamista.

## SEO

`npm run build` tekee kolme asiaa: selainversio (`dist/`), palvelinversio (`dist-ssr/`) ja `scripts/prerender.mjs`, joka ajaa palvelinversion ja kirjoittaa valmiin HTML:n `dist/index.html`:ään. Google näkee sisällön ilman JavaScriptiä, ja selain "herättää" sivun eloon `hydrateRoot`illa. Skripti lisää myös JSON-LD:n sekä `sitemap.xml`:n ja `robots.txt`:n.

Sivuston osoite on yhdessä paikassa: `.env` (`VITE_SITE_URL`).

## Osoite ja kartta

Osoite on `config/site.ts`:ssä (`Pisantie 3, 73300 Nilsiä`). Kartan koordinaatit (`coords`) ovat tyhjät: silloin kortti näyttää "Avaa kartta" -linkin OpenStreetMapiin osoitehaulla. Kun haluat upotetun kartan, hae oikea paikka openstreetmap.org:sta (oikea hiiren painike > Näytä osoite / Keskitä kartta tähän) ja täytä `coords: { lat, lng }`. Kortti vaihtuu silloin "Näytä kartta" -painikkeeksi (iframe ladataan vasta painalluksesta). Älä arvaa koordinaatteja, väärä nasta on huonompi kuin ei nastaa.

## Julkaisu

**Demo (GitHub Pages):** workflow ajaa joka `main`-pushilla lintin, testit ja buildin ja julkaisee `dist/`-kansion. Kerran tehtävä asetus: GitHub > Settings > Pages > Source: **GitHub Actions**. Demo on alikansiossa (`VITE_BASE=/glosstahko-web/`) ja `VITE_NOINDEX=1` lisää sivuille `noindex` ja tekee `robots.txt`:stä `Disallow: /`, jotta demo ei kilpaile oikean domainin kanssa.

**Tuotanto (suunnitelma):** Cloudflare Pages (ilmainen, kaupallinen käyttö sallittu), domain glosstahko.fi Zonerilta. Build-komento `npm run build`, output `dist`, ympäristömuuttuja `VITE_SITE_URL=https://glosstahko.fi`, ei `VITE_BASE`- eikä `VITE_NOINDEX`-arvoa. Apex-domain vaatii DNS:n Cloudflareen (poista DNSSEC Zonerilla ensin) tai vaihtoehtoisesti www-osoite canonicalina. Turvaotsikot ja CSP kuuluvat Cloudflaren `_headers`-tiedostoon.

## Julkaisu (GitHub Pages, vanha ohje)

Workflow ajaa joka `main`-pushilla lintin, testit ja buildin ja julkaisee `dist/`-kansion. Kerran tehtävä asetus: GitHub > Settings > Pages > Source: **GitHub Actions** (ei "Deploy from a branch", koska se tarjoaisi lähdekoodin, ei buildia).

Testiosoite on alikansiossa, siksi workflow asettaa `VITE_BASE=/glosstahko-web/`. Oman domainin kanssa `VITE_BASE` jätetään pois ja `VITE_SITE_URL` vaihdetaan domainiin.

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
- [x] Testijulkaisu GitHub Pagesiin (`.github/workflows/pages.yml`)
- [x] Lakisivut (tietosuoja, käyttöehdot, kotihoito-ohjeet) ja 404-sivu
- [ ] Julkaisu: Cloudflare Pages + glosstahko.fi, Search Console ja Google Business Profile

## Ennen julkaisua

- Vaihda `.env`:n `VITE_SITE_URL` oikeaan domainiin ja aja `npm run build` uudelleen (canonical, sitemap, JSON-LD ja og-kuvan osoite päivittyvät)
- Päivitä `public/og-image.jpg`, kun oikeat kuvat ovat mukana. Lisää sivu Google Search Consoleen ja lähetä sitemap
- Vaihda `bookingUrl` (`config/site.ts`) ajanvarausjärjestelmän linkkiin, kun se on käytössä, ja päivitä UKK:n vastaus "Miten varaan ajan?"
- Tarkista hinnat (`data/services.ts`), UKK (`data/faq.ts`) ja tuotetiedot (`data/products.ts`) yrittäjän kanssa
- Täytä tarvittaessa `coords` (kartta) ja lisää maksutavat sekä Booksalon verkkoajanvaraus vasta, kun ne ovat käytössä. Päivitä silloin myös `public/tietosuoja.html` ja `public/kayttoehdot.html` (TODO-kommentit)
- Vahvista hinnat Siirin kanssa (`data/services.ts` on merkitty luonnokseksi)
- Lisää oikeat kuvat ja alt-tekstit; koristekuvissa `alt=""`
- Käy läpi tietoturvatarkistuslista: sivulla ei ole salaisuuksia, lomakkeita eikä analytiikkaa. Jos lisäät jonkin niistä, päivitä tietosuojaseloste.
- Jos ajanvaraus tai analytiikka lisätään, tarkista kolmansien osapuolten skriptit ja tarve evästeilmoitukselle

## Lisenssi ja sisältö

Koodi on oppimis- ja portfolio-käyttöön. Sivuston tekstit, kuvat ja logo kuuluvat GlossTahkolle, eikä niitä saa käyttää uudelleen ilman lupaa.
