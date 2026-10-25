# Julkaisuohje: glosstahko.fi (Cloudflare Pages + Zoner)

Tilanne: domain **glosstahko.fi** on Zonerilla (sopimus 4267288, 12 kk, laskutus vuosittain). Sähköpostipaketti **Zoner Sähköposti Free** (sopimus 4267287) on liitetty domainiin. Demo pyörii GitHub Pagesissa osoitteessa pennasenkake.github.io/glosstahko-web (noindex).

Tavoite: tuotantosivu Cloudflare Pagesissa osoitteessa **https://glosstahko.fi**, demo jää paikalleen. Sähköposti ei saa katketa.

> Cloudflaren valikot muuttuvat välillä. Jos nimi ei täsmää, etsi samanniminen kohta (Workers & Pages > Pages).

## 0. Tärkeimmät varoitukset

- **Älä paina** Zonerin sivulla "Irrota verkkotunnus paketista". Se irrottaisi domainin sähköpostipaketista.
- **Älä poista** Zonerin MX- ja TXT-tietueita ennen kuin ne on kopioitu Cloudflareen (vaihe 2).
- Nimipalvelinmuutoksen jälkeen DNS-tietueita muokataan **vain Cloudflaressa**. Zonerin DNS-hallinta ei enää vaikuta mihinkään.

## 1. Valmistelu (Zoner)

1. Zoner > Verkkotunnukset > glosstahko.fi > **DNS-hallinta**. Kuvakaappauksen mukaan tietueet ovat nyt:

   | Nimi | Tyyppi | Arvo |
   |---|---|---|
   | (juuri) | A | 84.34.166.69 |
   | www | A | 84.34.166.69 |
   | (juuri) | MX | 0 mx1.zoner.fi |
   | (juuri) | MX | 0 mx2.zoner.fi |
   | (juuri) | TXT | `v=spf1 include:spf.zoner.fi ~all` |

2. Laita päälle kytkin **"Näytä oletusarvoiset DNS-tietueet"** ja kirjoita ylös kaikki muutkin tietueet (esim. DKIM `...._domainkey`, `autoconfig`, `autodiscover`, `mail`, `_dmarc`). Ne pitää kopioida Cloudflareen samalla tavalla.
3. Tarkista Zonerin domain-asetuksista, onko **DNSSEC** päällä. Jos on, **poista se ensin** ja odota tunti. Muuten domain voi lakata toimimasta nimipalvelinvaihdon jälkeen.
4. Kirjaudu ulos vasta kun muistiinpanot ovat tallessa. Rollback-keino: nimipalvelimet-sivun **Palauta oletusasetukset** palauttaa Zonerin omat nimipalvelimet (nyt `zoner.g1-dns.one` ja `zoner.g1-dns.com`).

## 2. Cloudflare-tili ja DNS

1. Luo ilmainen tili osoitteessa dash.cloudflare.com (sähköpostina Siirin tai oma, ota kaksivaiheinen tunnistautuminen käyttöön).
2. **Add a domain** > `glosstahko.fi` > **Free**-suunnitelma.
3. Cloudflare yrittää tuoda tietueet automaattisesti. **Tarkista ne käsin** ja lisää puuttuvat:
   - **MX**: `mx1.zoner.fi` (prioriteetti 0) ja `mx2.zoner.fi` (prioriteetti 0)
   - **TXT**: `v=spf1 include:spf.zoner.fi ~all`
   - kaikki vaiheessa 1 ylös kirjatut oletustietueet (DKIM ym.)
   - Sähköpostiin liittyvät tietueet: **Proxy status = DNS only** (harmaa pilvi). Oranssi pilvi rikkoo sähköpostin.
4. **Poista** vanhat A-tietueet (`84.34.166.69`, juuri ja www): ne osoittavat Zonerin tilapäissivulle. Cloudflare tekee oikeat tietueet vaiheessa 5.
5. Cloudflare näyttää kaksi nimipalvelinta (muotoa `xxxx.ns.cloudflare.com`). Älä sulje sivua, tarvitset ne seuraavassa vaiheessa.

## 3. Nimipalvelimien vaihto (Zoner)

1. Zoner > glosstahko.fi > **Nimipalvelimet** (kuvakaappauksen sivu "Omat nimipalvelimet").
2. Korvaa kentät 1 ja 2 Cloudflaren nimipalvelimilla. Kentät 3 ja 4 jätetään tyhjiksi. **Tallenna.**
3. Palaa Cloudflareen ja paina **Check nameservers**. Aktivoituminen kestää yleensä 15 min – 2 h, enintään vuorokauden. Cloudflare lähettää sähköpostin, kun domain on "Active".
4. Testaa sähköposti: lähetä viesti domainin osoitteeseen ja takaisin (jos postilaatikko on käytössä). Jos ei toimi, tarkista MX-tietueet ja että pilvi on harmaa.

## 4. Pages-projekti (GitHub-yhteys)

1. Cloudflare > **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
2. Valtuuta GitHub-sovellus ja anna pääsy **vain** repositoriolle `PennasenKake/glosstahko-web` (Only select repositories).
3. Projektin nimeksi esim. `glosstahko` (osoite tulee muotoon `glosstahko.pages.dev`).
4. Build-asetukset:

   | Asetus | Arvo |
   |---|---|
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. **Environment variables** (Production):
   - `NODE_VERSION` = `22`
   - `VITE_SITE_URL` = `https://glosstahko.fi`

   Preview-ympäristöön (haarakohtaiset esikatselut): lisää samat sekä `VITE_NOINDEX` = `1`, jotta esikatselut eivät päädy Googleen.
   **Älä** aseta `VITE_BASE`-muuttujaa (sitä käyttää vain GitHub Pages -demo).
6. **Save and Deploy**. Ensimmäinen build kestää n. 1–2 min. Avaa `glosstahko.pages.dev` ja tarkista, että sivu toimii.

Jatkossa jokainen `git push` `main`-haaraan julkaisee uuden version automaattisesti. Lint ja testit ajetaan GitHub Actionsissa, Cloudflare ajaa vain buildin (`tsc` + Vite + esirenderöinti).

## 5. Domain Pagesiin

1. Pages-projekti > **Custom domains** > **Set up a custom domain**.
2. Lisää `glosstahko.fi`. Koska domain on jo Cloudflaressa, tietue (CNAME) luodaan automaattisesti. Odota, että tila on **Active** ja varmenne on myönnetty (muutama minuutti).
3. Lisää samoin `www.glosstahko.fi`.
4. **www > juuri -uudelleenohjaus**: Cloudflare > glosstahko.fi > **Rules** > **Redirect Rules** > Create rule:
   - When: Hostname equals `www.glosstahko.fi`
   - Then: Dynamic redirect, URL `concat("https://glosstahko.fi", http.request.uri.path)`, status 301, säilytä query string.
   Canonical-osoite on koodissa `https://glosstahko.fi`, joten ensisijainen osoite on ilman www:tä.
5. **SSL/TLS** > Overview: tila **Full (strict)**. **Edge Certificates**: **Always Use HTTPS** päälle. HSTS kannattaa laittaa päälle vasta, kun kaikki on testattu viikon ajan.

## 6. Turvaotsikot

Build luo tiedoston `dist/_headers` (scripts/prerender.mjs), jonka Cloudflare Pages lukee automaattisesti. Siinä ovat CSP (sallii vain oman sisällön ja OpenStreetMap-upotuksen), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` ja pitkä välimuisti `/assets/*`-tiedostoille. CSP on testattu paikallisesti kaikilla sivuilla.

Jos lisäät sivulle uuden ulkoisen palvelun (analytiikka, kartta, fontti, lomake), lisää sen osoite CSP:hen tiedostossa `scripts/prerender.mjs`, muuten selain estää sen. Konsolissa lukee silloin "Refused to ...".

## 7. Tarkistuslista julkaisun jälkeen

- [ ] `https://glosstahko.fi` avautuu, `http://` ja `www.` ohjautuvat osoitteeseen `https://glosstahko.fi`
- [ ] Sähköposti toimii (lähetys ja vastaanotto)
- [ ] `https://glosstahko.fi/robots.txt` sisältää `Allow: /` ja Sitemap-rivin, `sitemap.xml` avautuu
- [ ] Sivun lähdekoodissa **ei** ole `noindex`-merkintää (`<meta name="robots">`)
- [ ] `https://glosstahko.fi/jokin-vaara-osoite` näyttää oman 404-sivun
- [ ] Varaa aika -painike avaa https://booksalon.fi/glosstahko
- [ ] Kartan avaus (Näytä kartta) toimii eikä konsolissa ole "Refused to ..." -virheitä (CSP ei estä)
- [ ] Lighthouse (Chrome DevTools) mobiilissa: Performance > 90, muut 100
- [ ] Rich Results Test (search.google.com/test/rich-results): LocalBusiness ja FAQPage ilman virheitä
- [ ] **Google Search Console**: lisää domain-ominaisuus `glosstahko.fi` (vahvistus DNS-TXT:llä, lisää tietue Cloudflaressa), lähetä `sitemap.xml`, pyydä etusivun indeksointia
- [ ] **Google Business Profile**: luo/vahvista yritysprofiili, osoite Pisantie 3 + sivusto `https://glosstahko.fi`, varauslinkki Booksaloniin
- [ ] Päivitä Instagramin bio-linkki ja Booksalon-profiilin verkkosivu osoitteeseen `https://glosstahko.fi`

## 8. Demo (GitHub Pages)

Demo jää päälle. Workflow asettaa `VITE_NOINDEX=1`, joten se on `noindex` ja `robots.txt` kieltää haun. Kun tuotanto on toiminnassa, demon voi sammuttaa (Settings > Pages) tai pitää opetus- ja testikäytössä.

## 9. Tarvittaessa: pelkkä Zonerin DNS (vaihtoehto B)

Jos et halua siirtää nimipalvelimia: Cloudflare Pages tukee ulkoisella DNS:llä vain aliverkkotunnusta (`www`). Silloin lisää Zonerille `www` CNAME `glosstahko.pages.dev`, ja juuridomainille tarvitaan uudelleenohjaus osoitteeseen www (Zonerin tuki tälle tulee tarkistaa). Canonical-osoitteeksi pitää vaihtaa `https://www.glosstahko.fi` (`VITE_SITE_URL`). Suositus on siirtää nimipalvelimet (vaiheet 2–3), koska se on yksinkertaisempi ja nopeampi.

## 10. Kustannukset

- Cloudflare Pages Free: 0 €, 500 buildia/kk. Kaupallinen käyttö sallittu.
- Zoner: domain (12 kk) ja sähköpostipaketti sopimustenne mukaan. Nimipalvelinsiirto Cloudflareen ei muuta domainin omistusta tai laskutusta.
