# Adventní kalendář 2026 – OROOM Brno

Statický web (Vite + React + TypeScript): 24 okének, která se odemykají každý den o půlnoci (Europe/Prague).
Bez registrace a bez přihlášení, **nesbírá žádné osobní údaje** (postup si pamatuje jen prohlížeč).
Vzhled vychází z www.brno.oroom.cz.

## Co kde je

| Soubor | Co obsahuje |
| --- | --- |
| `src/data/*.json` | **texty** z tabulky „OROOM adventní kalendář 2026“: `windows` (24 okének), `quizRooms` + `quizResults` (kvíz Kam spolu vyrazíte), `guess` (Jak dobře se znáte), `cards` (Pravda nebo výzva), `dates` (generátor rande), `envelopes`, `cuba` |
| `src/content.ts` | typy, pokoje (odkazy, fotky), přiřazení her k okénkům |
| `src/config.ts` | odkazy, kódy (ADVENT800, ADVENT12), časy bonusu, GA4, Spotify, Karlovy Vary, `PREVIEW_KEY` |
| `src/components/Windows.tsx` | vzhled jednotlivých okének |
| `src/components/games/` | kvíz pokoj, Hádej partnera, karty, generátor rande |
| `src/lib/` | odemykání podle data, měření GA4 se souhlasem, sdílení, localStorage |
| `public/img`, `public/og`, `public/pdf` | fotky pokojů (WebP), obrázky ke sdílení, letenky a tajné obálky |
| `tools/share-pages.mjs` | před buildem vytvoří stránky `/s/<pokoj>/` s OG obrázkem pro sdílení výsledku kvízu |

Opravy textů se dělají jen v `src/data/*.json`, kód se nemění.

## Vývoj

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # výstup v dist/
```

- **Náhled všech okének** před 1. 12.: `?nahled=oroomadvent` (vypnutí `?nahled=off`).
- **Okénko / hra přímo**: `?den=7`, `?hra=kviz` (hry: `kviz`, `pnv`, `andele-certi`, `pnv-odvazny`, `pnv-vanoce`, `rande-vikend`, `rande-20`, `rande-venku`, `znate-1`, `znate-2`). Hry zůstávají dostupné i po Vánocích.

## Před spuštěním (doplnit)

- [ ] **Doména** kalendáře: proměnná `SITE_URL` (GitHub → Settings → Variables), jinak se pro sdílení použije zástupná `https://advent.oroom.cz`.
- [ ] **GA4**: proměnná `GA_ID` (G-…). Bez ní se neměří nic a lišta s cookies se nezobrazí.
- [ ] **Spotify playlist** pro 10. 12.: `PLAYLIST_URL` v `src/config.ts` (tlačítko se zobrazí, až je vyplněno).
- [ ] **Poukazy Karlovy Vary**: `KV_VOUCHERS_URL` v `src/config.ts` (Havana a St. Petersburg, okénka 1., 10., 11. 12.).
- [ ] **Rezervace všedního večera** (13. 12.): `RESERVE_URL` v `src/config.ts` (zatím stránka pokojů).
- [ ] **Texty ke schválení**: karty 14. 12. (balíček PnV 3) a tajné obálky 18. 12.
- [ ] Ověřit v e-shopu kód `ADVENT800` (7.–8. 12.) a heslo `ADVENT12` (obsluha o něm ví).
- [ ] Odkazy na poukazy neobsahují UTM (kalendář a nákup poukazu zatím nemají společnou doménu, UTM by přepsaly původní zdroj návštěvy).
- [ ] Test: iPhone, Android, prohlížeče v Instagramu a Facebooku, přechod přes půlnoc, všechna okénka v náhledu.

## Nasazení (GitHub → Firebase Hosting)

Workflow `.github/workflows/deploy.yml` sestaví web a nasadí ho: push do `main` na testovací kanál, push do větve `produkce` na ostrý web.
Potřebuje secret `FIREBASE_SERVICE_ACCOUNT` (JSON klíč servisního účtu projektu Firebase). Bez něj se nasazení přeskočí.
Ruční nasazení: `npm run build && npx firebase-tools deploy --only hosting --project <id>`.
Firebase je použit jen jako hosting; přihlášení ani databáze se nepoužívají.
