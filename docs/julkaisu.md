# Julkaisuohje: glosstahko.fi (Cloudflare Workers + Zoner)

Tilanne 29.10.2026: sivusto on **livenä osoitteessa https://glosstahko.fi**. Domain on Zonerilla (sopimus 4267288, 12 kk, laskutus vuosittain), nimipalvelimet on siirretty Cloudflareen ja sivusto julkaistaan **Cloudflare Workersilla** (staattiset tiedostot, ei Worker-koodia). Sähköposti (Zoner Sähköposti Free, sopimus 4267287) toimii edelleen Zonerin MX-tietueilla. GitHub Pages -demo (pennasenkake.github.io/glosstahko-web) on `noindex` ja jää esikatselukäyttöön.

Tämä ohje kuvaa toimivan lopputuloksen ja vaiheet, joilla se tehtiin. Yleinen, uudelleenkäytettävä versio uusille sivustoille kirjoitetaan erikseen.

> Cloudflaren valikot muuttuvat välillä. Jos nimi ei täsmää, etsi samanniminen kohta.

## 0. Tärkeimmät varoitukset

- **Älä paina** Zonerin sivulla "Irrota verkkotunnus paketista". Se irrottaisi domainin sähköpostipaketista.
- **Älä poista** Cloudflaren DNS:stä MX-tietueita (`mx1.zoner.fi`, `mx2.zoner.fi`), SPF-TXT:tä eikä Search Consolen `google-site-verification`-TXT:tä.
- Sähköpostiin liittyvät tietueet pidetään tilassa **DNS only** (harmaa pilvi). Oranssi pilvi rikkoo sähköpostin.
- DNS-tietueita muokataan nimipalvelinvaihdon jälkeen **vain Cloudflaressa**. Zonerin DNS-hallinta ei enää vaikuta mihinkään.
- Älä luo Cloudflaressa **Pages**-projektia rinnakkain, vaan käytä tätä Workers-projektia (ks. vaihe 4).

## 1. Valmistelu (Zoner)

1. Zoner > Verkkotunnukset > glosstahko.fi > **DNS-hallinta**. Alkuperäiset tietueet olivat:

   | Nimi | Tyyppi | Arvo |
   |---|---|---|
   | (juuri) | A | 84.34.166.69 (Zonerin tilapäissivu) |
   | www | A | 84.34.166.69 (Zonerin tilapäissivu) |
   | (juuri) | MX | 0 mx1.zoner.fi |
   | (juuri) | MX | 0 mx2.zoner.fi |
   | (juuri) | TXT | `v=spf1 include:spf.zoner.fi ~all` |

2. Laita päälle kytkin **"Näytä oletusarvoiset DNS-tietueet"** ja kirjoita ylös kaikki muutkin tietueet (esim. DKIM, `autoconfig`, `autodiscover`, `_dmarc`). Tässä tapauksessa niitä ei ollut.
3. Tarkista **DNSSEC**. Jos se on päällä, poista se ensin ja odota tunti, muuten domain voi lakata toimimasta nimipalvelinvaihdon jälkeen.
4. Rollback: nimipalvelimet-sivun **Palauta oletusasetukset** palauttaa Zonerin omat nimipalvelimet (`zoner.g1-dns.one` ja `zoner.g1-dns.com`).

## 2. Cloudflare-tili ja DNS

1. Luo ilmainen tili osoitteessa dash.cloudflare.com ja ota **kaksivaiheinen tunnistautuminen** käyttöön.
2. **Add a domain** > `glosstahko.fi` > **Free**-suunnitelma.
3. Cloudflare tuo tietueet automaattisesti. **Tarkista ne käsin**:
   - **MX**: `mx1.zoner.fi` ja `mx2.zoner.fi`, prioriteetti 0, **DNS only**
   - **TXT**: `v=spf1 include:spf.zoner.fi ~all`, **DNS only**
   - kaikki vaiheessa 1 ylös kirjatut muut tietueet
4. **Poista vanhat A-tietueet** (`84.34.166.69`, juuri ja www). Ne estävät domainin liittämisen Workeriin. Tilalle Cloudflare luo omat tietueet.
5. Cloudflare näyttää kaksi nimipalvelinta (muotoa `xxxx.ns.cloudflare.com`). Tässä projektissa ne olivat `ian.ns.cloudflare.com` ja `leanna.ns.cloudflare.com`.

## 3. Nimipalvelimien vaihto (Zoner)

1. Zoner > glosstahko.fi > **Nimipalvelimet** ("Omat nimipalvelimet").
2. Korvaa kentät 1 ja 2 Cloudflaren nimipalvelimilla. Kentät 3 ja 4 jätetään tyhjiksi. **Tallenna.**
3. Cloudflare > **Check nameservers**. Aktivoituminen kestää yleensä 15 min – 2 h, enintään vuorokauden. Tila **Active** tarkoittaa, että vaihto on valmis.
4. Testaa sähköposti: lähetä viesti domainin osoitteeseen ja takaisin.

## 4. Workers-projekti (GitHub-yhteys)

Cloudflaren nykyinen "Create"-polku luo oletuksena **Workers**-projektin, jossa deploy-komento on `npx wrangler deploy`. Staattinen sivusto toimii siinä hyvin (staattisten tiedostojen pyynnöt ovat ilmaisia), mutta projekti tarvitsee repossa oman `wrangler.jsonc`-tiedoston. Ilman sitä wrangler muokkaa projektia automaattisesti (asentaa `@cloudflare/vite-plugin`in ja ajaa buildin uudelleen), ja esirenderöinti kaatuu virheeseen `Cannot find module dist-ssr/entry-server.js`.

Repossa oleva `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "glosstahko",
  "compatibility_date": "2026-10-23",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

- `name` pitää vastata Workerin nimeä Cloudflaressa.
- `not_found_handling: "404-page"` näyttää tuntemattomassa osoitteessa `dist/404.html`-sivun.
- Älä aseta `html_handling: "none"`: silloin `/` ei palauta etusivua.

**Asetukset** (Workers & Pages > `glosstahko` > Settings > Build):

| Asetus | Arvo |
|---|---|
| Git-repo | `PennasenKake/glosstahko-web` (GitHub-sovellukselle pääsy vain tähän repoon) |
| Production branch | `main` |
| Build command | `npm run lint && npm test && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Variables | ei tarvita (`VITE_SITE_URL` tulee repon `.env`-tiedostosta) |

**Älä** aseta `VITE_BASE`-muuttujaa (vain GitHub Pages -demo käyttää sitä) äläkä `VITE_NOINDEX`-muuttujaa tuotantoon.

Jatkossa jokainen `git push` `main`-haaraan julkaisee uuden version noin minuutissa. Build command ajaa ensin lintin ja testit: jos jompikumpi epäonnistuu, julkaisu pysähtyy ja edellinen versio jää voimaan.

**Versiot on lukittu**, jotta build toimii samoin joka kerta:
- `wrangler` on `devDependency` tarkalla versiolla (`4.156.0`), joten `npx wrangler deploy` käyttää sitä eikä hae uusinta. Päivitä se tietoisesti: `npm i -D -E wrangler@<versio>`, aja build ja `npx wrangler deploy --dry-run`, ja commitoi.
- `.node-version` (`22`) kertoo Cloudflarelle Node-version. `package.json`:n `engines` vaatii `>=22.12` (Vite 8).

## 5. Domain Workeriin

1. Workers & Pages > `glosstahko` > **Domains** > **Add Domain** > **Custom domain** > `glosstahko.fi`. Koska domain on jo Cloudflaressa, DNS-tietue ja varmenne luodaan automaattisesti. Odota tilaa **Active**.
2. **workers.dev-osoitteet pois:** Settings > Domains & Routes > Worker URL. Sammuta sekä Production että Preview, jotta sama sivu ei ole julkisena kahdessa osoitteessa.
3. **www > juuri**. Workerille ei tarvitse liittää `www`-osoitetta. Luo sen sijaan:
   - **DNS:** `AAAA`, nimi `www`, arvo `100::`, **Proxied** (oranssi pilvi). Osoite on tarkoituksella tyhjä: pyyntö ei koskaan pääse sinne, koska sääntö pysäyttää sen.
   - **Rules > Redirect Rules > Create rule** (malli "Redirect from WWW to root"): Request URL `https://www.glosstahko.fi/*`, Target URL `https://glosstahko.fi/${1}`, status 301, **Preserve query string** päälle.
4. **SSL/TLS > Overview:** Full (strict). **Edge Certificates:** **Always Use HTTPS** päälle.
5. **HSTS** vasta, kun kaikki on toiminut viikon. Älä laita "Include subdomains" tai "Preload" -valintoja ilman erityistä syytä.

Canonical-osoite on koodissa `https://glosstahko.fi`, joten ensisijainen osoite on ilman www:tä.

## 6. Osoitteet ja turvaotsikot

**Päätteettömät osoitteet.** Workers ohjaa `/kayttoehdot.html`-osoitteen osoitteeseen `/kayttoehdot` (307). Siksi sivuston linkit, canonicalit ja sitemap käyttävät päätteettömiä osoitteita (`/kayttoehdot`, `/tietosuoja`, `/kotihoito`, `/omavalvonta`). Tiedostonimet `public/`-kansiossa ovat ennallaan (`kayttoehdot.html` jne.). GitHub Pages palvelee päätteettömät osoitteet samoin.

**Turvaotsikot.** Build luo tiedoston `dist/_headers` (`scripts/prerender.mjs`), jonka Cloudflare lukee automaattisesti. Siinä ovat CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy` ja pitkä välimuisti `/assets/*`-tiedostoille.

CSP sallii vain oman sisällön, Behold-syötteen (`connect-src https://feeds.behold.so`), Instagram-kuvat (`img-src https://behold.pictures https://*.behold.pictures`) ja OpenStreetMap-upotuksen. Huomaa: `*.behold.pictures` **ei** kata päädomainia `behold.pictures`, joten molemmat on lueteltava. Jos lisäät sivulle uuden ulkoisen palvelun (analytiikka, kartta, fontti, lomake), lisää sen osoite CSP:hen `scripts/prerender.mjs`-tiedostossa, muuten selain estää sen ("Refused to ..." konsolissa).

**Muista:** GitHub Pages -demo ohittaa `_headers`-tiedoston, joten CSP-virheet paljastuvat vasta oikeassa domainissa. Testaa muutokset aina tuotantodomainissa.

## 7. Tarkistuslista julkaisun jälkeen

Tehty 29.10.2026 (✓) ja jäljellä:

- [x] `https://glosstahko.fi` avautuu, `http://` ja `www.` ohjautuvat osoitteeseen `https://glosstahko.fi` (polku ja query string säilyvät)
- [x] `robots.txt` sisältää `Allow: /` ja Sitemap-rivin, `sitemap.xml` avautuu (5 päätteetöntä osoitetta)
- [x] Sivulla **ei** ole `noindex`-merkintää
- [x] Väärä osoite näyttää oman 404-sivun, ja `/.env`, `/package.json`, `/wrangler.jsonc` ja `/_headers` antavat 404
- [x] Varaa aika -painike avaa https://booksalon.fi/glosstahko
- [x] Instagram-karuselli näyttää kuvat suostumuksen jälkeen (vaati CSP-korjauksen, ks. vaihe 6)
- [x] Search Console: domain-ominaisuus vahvistettu (DNS-TXT), `sitemap.xml` lähetetty, etusivun indeksointia pyydetty
- [ ] Sähköposti toimii (lähetys ja vastaanotto)
- [ ] workers.dev-osoitteet sammutettu (vaihe 5, kohta 2)
- [ ] Beholdin whitelist: `glosstahko.fi`, `www.glosstahko.fi`, `pennasenkake.github.io`
- [ ] Lighthouse (Chrome DevTools) mobiilissa: Performance > 90, muut 100
- [ ] Rich Results Test (search.google.com/test/rich-results): HairSalon/NailSalon ja FAQPage ilman virheitä
- [ ] **Google Business Profile**: luo/vahvista yritysprofiili, osoite + sivusto `https://glosstahko.fi`, varauslinkki Booksaloniin
- [ ] Päivitä Instagramin bio-linkki ja Booksalon-profiilin verkkosivu osoitteeseen `https://glosstahko.fi`
- [ ] Kaksivaiheinen tunnistautuminen: Cloudflare, GitHub ja Zoner
- [ ] HSTS viikon päästä, DMARC (`_dmarc` TXT, `v=DMARC1; p=none`) myöhemmin

## 8. Demo (GitHub Pages)

Demo jää päälle. Workflow (`.github/workflows/pages.yml`) asettaa `VITE_NOINDEX=1`, joten se on `noindex` ja `robots.txt` kieltää haun. Sen voi sammuttaa (Settings > Pages ja workflow-tiedoston poisto) tai pitää esikatselukäytössä.

## 9. Jos nimipalvelimia ei haluta siirtää (vaihtoehto B, ei käytössä)

Cloudflare tukee ulkoisella DNS:llä vain aliverkkotunnusta (`www`) CNAME-tietueella. Juuridomainille tarvittaisiin uudelleenohjaus, ja canonical pitäisi vaihtaa osoitteeseen `https://www.glosstahko.fi` (`VITE_SITE_URL`). Siirto Cloudflareen (vaiheet 2–3) oli yksinkertaisempi ja valittiin siksi.

## 10. Kustannukset

- Cloudflare Workers (staattiset tiedostot), Free: 0 €. Staattisten tiedostojen pyynnöt ovat ilmaisia, ja kaupallinen käyttö on sallittu.
- Zoner: domain (12 kk) ja sähköpostipaketti sopimustenne mukaan. Nimipalvelinsiirto Cloudflareen ei muuta domainin omistusta tai laskutusta.

## 11. Vianmääritys

| Oire | Syy ja korjaus |
|---|---|
| Build: `Cannot find module dist-ssr/entry-server.js` | Wrangler ajoi automaattisen konfiguroinnin. Varmista, että repossa on `wrangler.jsonc` ja deploy command on `npx wrangler deploy`. |
| Build pysähtyy lint- tai testivirheeseen | Tarkoituksellinen suoja. Korjaa virhe (`npm run lint`, `npm test` paikallisesti) ja pushaa uudelleen. |
| `/` palauttaa 404 | `html_handling` on `none`. Poista asetus. |
| Instagram-kuvat eivät näy, syöte latautuu | CSP `img-src` ei salli `https://behold.pictures`. |
| Syöte ei lataudu | Beholdin whitelist ei sisällä domainia, tai CSP `connect-src` puuttuu. |
| `www` ei aukea | `www`-DNS-tietue (AAAA `100::`, Proxied) puuttuu tai uudelleenohjaussääntöä ei ole julkaistu. |
| Sähköposti ei toimi | MX- tai SPF-tietue on poistettu tai pilvi on oranssi. Palauta DNS only. |
