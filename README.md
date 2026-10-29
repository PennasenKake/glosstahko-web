# GlossTahko – verkkosivusto

Yhden sivun verkkosivusto nilsiäläiselle kynsi- ja kampaamoyritykselle **GlossTahko** (Nilsiä ja Tahko). Sivusto rakennetaan vaihe vaiheelta oppimisprojektina, ja versionhallinta on ollut mukana alusta asti.

## Tavoitteet

- Yksi sivu, jossa osiot ovat allekkain ja ylhäällä on tab-palkki, joka vie oikeaan kohtaan
- Mobiili ensin, toimii sujuvasti puhelimella
- Näkyy Google-haussa (paikallinen SEO: Nilsiä, Tahko)
- Ei backendia eikä tietojen tallennusta: ajanvaraus ja some ovat ulkoisia linkkejä
- Ei evästeitä eikä kolmansien osapuolten pyyntöjä (fontit ovat omassa paketissa)
  - Poikkeukset vaativat kävijän luvan: Instagram-karuselli (julkaisut haetaan Behold-syötteestä, `utils/consent.ts`, valinta localStorageen, perutaan footerin Evästeasetukset-linkistä) ja OpenStreetMap-kartta (latautuu painalluksesta). Ennen lupaa ei lähde pyyntöjä kolmansille osapuolille.
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
│                    InstagramFeed (karuselli + suostumus), ConsentSettings, VenueCard (kartta)
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
├── utils/           hinnan ja keston muotoilu, consent.ts (Instagram-suostumus)
├── assets/images/   lehvä ja kukkaoksat (läpinäkyvät webp-kuvat)
├── App.tsx          kokoaa sivun osiot
├── entry-server.tsx esirenderöinti (ajetaan vain buildissa)
├── index.css        tuo fontit ja tyylitiedostot
└── main.tsx         sovelluksen käynnistys (hydrateRoot / createRoot)

scripts/prerender.mjs   buildin jälkivaihe: HTML sisään, JSON-LD, sitemap.xml, robots.txt
public/                 favicon.svg, og-image.jpg, tietosuoja.html, kayttoehdot.html, kotihoito.html, omavalvonta.html,
                        404.html (staattisia, noindex 404:ssä), legal.css
.env                    VITE_SITE_URL = sivuston osoite
```

Sisältö (`data/`, `config/`) on erillään ulkoasusta, jotta hintojen, UKK:n ja yhteystietojen päivitys ei vaadi komponenttien muokkaamista.

## SEO

`npm run build` tekee kolme asiaa: selainversio (`dist/`), palvelinversio (`dist-ssr/`) ja `scripts/prerender.mjs`, joka ajaa palvelinversion ja kirjoittaa valmiin HTML:n `dist/index.html`:ään. Google näkee sisällön ilman JavaScriptiä, ja selain "herättää" sivun eloon `hydrateRoot`illa. Skripti lisää myös JSON-LD:n sekä `sitemap.xml`:n ja `robots.txt`:n.

Sivuston osoite on yhdessä paikassa: `.env` (`VITE_SITE_URL`).

## Instagram-karuselli

Minusta-osion tekstin alla oleva karuselli hakee julkaisut suoraan @glosstahko-tililtä Behold-syötteen kautta (`src/data/instagram.ts`), eikä niitä tarvitse päivittää käsin. Haku tehdään vasta, kun kävijä sallii sen. Käyttöönotto: [docs/instagram-syote.md](docs/instagram-syote.md) (syötteen osoite tiedostoon `src/config/site.ts`, `instagramFeedUrl`).

## Osoite ja kartta

Osoite on `config/site.ts`:ssä (`Laitilantie 27, 73300 Nilsiä`). Kartan koordinaatit (`coords`) ovat tyhjät: silloin kortti näyttää "Avaa kartta" -linkin OpenStreetMapiin osoitehaulla. Kun haluat upotetun kartan, hae oikea paikka openstreetmap.org:sta (oikea hiiren painike > Näytä osoite / Keskitä kartta tähän) ja täytä `coords: { lat, lng }`. Kortti vaihtuu silloin "Näytä kartta" -painikkeeksi (iframe ladataan vasta painalluksesta). Älä arvaa koordinaatteja, väärä nasta on huonompi kuin ei nastaa.

## Julkaisu

Sivusto on livenä osoitteessa **https://glosstahko.fi** ja julkaistaan **Cloudflare Workersilla** (staattiset tiedostot). Jokainen `git push` `main`-haaraan käynnistää Cloudflaressa buildin (`npm run lint && npm test && npm run build`, eli virheellinen koodi ei mene tuotantoon) ja julkaisun (`npx wrangler deploy`). Wrangler on lukittu tarkkaan versioon ja Node-versio on tiedostossa `.node-version`. Julkaisun asetukset ovat tiedostossa [`wrangler.jsonc`](wrangler.jsonc): julkaistava kansio on `dist`, ja tuntematon osoite näyttää `404.html`-sivun. Ilman tätä tiedostoa wrangler muokkaa projektia automaattisesti ja esirenderöinti kaatuu.

Täysi vaiheittainen ohje (Cloudflare Workers, Zoner-DNS, sähköposti, www-uudelleenohjaus, tarkistuslista, vianmääritys): [`docs/julkaisu.md`](docs/julkaisu.md).

**Ympäristömuuttujat:**
- `VITE_SITE_URL` tulee `.env`-tiedostosta (`https://glosstahko.fi`, ei salainen).
- `VITE_BASE` ja `VITE_NOINDEX` asetetaan vain GitHub Pages -demossa. Älä aseta niitä Cloudflaressa.

**Osoitteet:** Workers ohjaa `.html`-päätteiset osoitteet päätteettömiin (`/kayttoehdot`), joten linkit, canonicalit ja sitemap käyttävät päätteettömiä osoitteita. Tiedostot ovat `public/`-kansiossa `.html`-nimisinä.

**Turvaotsikot ja CSP** syntyvät buildissa tiedostoon `dist/_headers` (`scripts/prerender.mjs`). Kun lisäät ulkoisen palvelun, lisää sen osoite CSP:hen. Huomaa, että `*.behold.pictures` ei kata päädomainia `behold.pictures`.

**Demo (GitHub Pages):** `.github/workflows/pages.yml` ajaa joka `main`-pushilla lintin, testit ja buildin ja julkaisee `dist/`-kansion osoitteeseen pennasenkake.github.io/glosstahko-web. Demo on alikansiossa (`VITE_BASE=/glosstahko-web/`) ja `VITE_NOINDEX=1` lisää sivuille `noindex` ja tekee `robots.txt`:stä `Disallow: /`, jotta demo ei kilpaile oikean domainin kanssa. Kerran tehtävä asetus: GitHub > Settings > Pages > Source: **GitHub Actions**. Demo ohittaa `_headers`-tiedoston, joten testaa CSP-muutokset aina tuotantodomainissa.

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
- [x] Lakisivut (tietosuoja, käyttöehdot, omavalvonta, kotihoito-ohjeet) ja 404-sivu
- [x] Julkaisu: Cloudflare Workers + glosstahko.fi (29.10.2026), Search Console (domain, sitemap, indeksointipyyntö)
- [ ] Google Business Profile, Beholdin whitelist, HSTS ja DMARC (ks. `docs/julkaisu.md`, kohta 7)

## Avoimet asiat julkaisun jälkeen

- Päivitä `public/og-image.jpg`, kun oikeat kuvat ovat mukana
- Vaihda `bookingUrl` (`config/site.ts`) ajanvarausjärjestelmän linkkiin, kun se on käytössä, ja päivitä UKK:n vastaus "Miten varaan ajan?"
- Tarkista hinnat (`data/services.ts`), UKK (`data/faq.ts`) ja tuotetiedot (`data/products.ts`) yrittäjän kanssa
- Täytä tarvittaessa `coords` (kartta) ja lisää maksutavat sekä Booksalon verkkoajanvaraus vasta, kun ne ovat käytössä. Päivitä silloin myös `public/tietosuoja.html` ja `public/kayttoehdot.html` (TODO-kommentit)
- Vahvista hinnat Siirin kanssa (`data/services.ts` on merkitty luonnokseksi)
- Lisää oikeat kuvat ja alt-tekstit; koristekuvissa `alt=""`
- Käy läpi tietoturvatarkistuslista: sivulla ei ole salaisuuksia, lomakkeita eikä analytiikkaa. Jos lisäät jonkin niistä, päivitä tietosuojaseloste.
- Jos ajanvaraus tai analytiikka lisätään, tarkista kolmansien osapuolten skriptit ja tarve evästeilmoitukselle

## Lisenssi ja sisältö

Koodi on oppimis- ja portfolio-käyttöön. Sivuston tekstit, kuvat ja logo kuuluvat GlossTahkolle, eikä niitä saa käyttää uudelleen ilman lupaa.
