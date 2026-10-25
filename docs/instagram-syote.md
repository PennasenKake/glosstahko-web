# Instagram-karuselli: syötteen käyttöönotto (Behold)

Minusta-osion karuselli näyttää @glosstahko-tilin julkaisut. Instagram ei anna julkaisuja suoraan
selaimelle, joten ne haetaan Behold-palvelun (https://behold.so) JSON-syötteestä. Behold hoitaa
Instagramin pääsyavaimen ja päivittää syötteen itse kerran päivässä. Uuden julkaisun lisääminen
Instagramiin riittää: sivua ei tarvitse muuttaa eikä julkaista uudelleen.

Kunnes syötteen osoite on asetettu, karuselli näyttää vain linkin Instagram-profiiliin.

## 1. Luo syöte (kerran, Siirin Instagram-tilillä)

1. Luo tili osoitteessa https://behold.so ja valitse ilmainen paketti (1 syöte, enintään 6 julkaisua,
   1 200 hakua kuussa, päivitys kerran päivässä).
2. Yhdistä @glosstahko-tili (Behold ohjaa vaiheet; jos se vaatii yritys- tai creator-tilin,
   tilityypin voi vaihtaa Instagramin asetuksista).
3. Luo uusi syöte, valitse tyypiksi **JSON** ja anna sille nimi.
4. Kopioi syötteen osoite, muotoa `https://feeds.behold.so/TUNNISTE`.
5. Syötteen asetuksista **Domain whitelist** (suositus): lisää `glosstahko.fi` ja demosivun
   osoite `pennasenkake.github.io`. Subdomainit pitää lisätä erikseen, `localhost` toimii aina.

## 2. Ota osoite käyttöön

Liitä osoite tiedostoon `src/config/site.ts`:

```ts
instagramFeedUrl: 'https://feeds.behold.so/TUNNISTE',
```

Syötteen osoite ei ole salaisuus (se näkyy selaimessa), mutta domain whitelist estää sen
käytön muilla sivuilla.

## 3. Tarkista

- Sivu **ei** tee yhtään pyyntöä osoitteeseen `feeds.behold.so`, ennen kuin painat
  "Salli ja näytä julkaisut" (DevTools > Network).
- Luvan jälkeen karuselli näyttää julkaisut, nuolet vierittävät ja päässä oleva nuoli himmenee.
- Alatunnisteen "Evästeasetukset" nollaa valinnan ja kysyy luvan uudelleen.
- Konsolissa ei ole `Refused to ...` -virheitä. Jos kuvat eivät lataudu tuotannossa, tarkista
  CSP:n `img-src` tiedostossa `scripts/prerender.mjs`.

## Rajat ja huomiot

- Ilmainen paketti: 6 julkaisua ja 1 200 hakua kuussa. Jokainen luvan antanut kävijä kuluttaa
  yhden haun per sivulataus (haku tehdään vasta luvan jälkeen, ja tulos muistetaan sivun ajan).
  Jos raja ylittyy, Behold keskeyttää syötteen kuun loppuun ja karuselli näyttää virheen ja
  linkin Instagramiin.
- Tietosuoja: Behold ja kuvien palvelin saavat kävijän IP-osoitteen vasta luvan jälkeen.
  Tämä on kuvattu tietosuojaselosteessa (`public/tietosuoja.html`, kohta 6). Jos vaihdat
  palvelua, päivitä seloste ja CSP (`connect-src`).
