# Adventní kalendář 2026 – OROOM Brno

Statický web (Vite + React + TypeScript): 24 okének, která se odemykají každý den o půlnoci (Europe/Prague).
Přihlášení jen přes Google (Firebase Authentication), data (otevřená okénka, souhlas s newsletterem) ve Firestore, stejně jako u ostatních kalendářů. Odpovědi z kvízů a her se neukládají.
Vzhled vychází z www.brno.oroom.cz.

## Co kde je

| Soubor | Co obsahuje |
| --- | --- |
| `src/data/*.json` | **texty** z tabulky „OROOM adventní kalendář 2026“: `windows` (24 okének), `quizRooms` + `quizResults` (kvíz Kam spolu vyrazíte), `guess` (Jak dobře se znáte), `cards` (Pravda nebo výzva), `dates` (generátor rande), `envelopes`, `cuba` |
| `src/content.ts` | typy, pokoje (odkazy, fotky), přiřazení her k okénkům |
| `src/config.ts` | odkazy, kódy (ADVENT800, ADVENT12), časy bonusu, GA4, Spotify, Karlovy Vary, `PREVIEW_KEY` |
| `src/components/Windows.tsx` | vzhled jednotlivých okének |
| `src/components/games/` | kvíz pokoj, Hádej partnera, karty, generátor rande |
| `src/backend.ts`, `src/components/Admin.tsx` | přihlášení, Firestore, stránka správce `/?admin` (CSV s e-maily a souhlasy) |
| `firestore.rules` | pravidla databáze (jen vlastní dokument, správce čte vše) |
| `src/lib/` | odemykání podle data, měření GA4 se souhlasem, sdílení |
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
- [ ] Hry jsou dostupné i bez přihlášení na `?hra=…`, okénka vyžadují přihlášení.
- [ ] Odkazy na poukazy neobsahují UTM (kalendář a nákup poukazu zatím nemají společnou doménu, UTM by přepsaly původní zdroj návštěvy).
- [ ] Test: iPhone, Android, prohlížeče v Instagramu a Facebooku, přechod přes půlnoc, všechna okénka v náhledu.

## Nastavení Firebase (projekt oroom-advent)

1. **Authentication** → Get started → Google → Enable. V *Settings → Authorized domains* přidat doménu kalendáře. Na stránce souhlasu Googlu nastavit název „OROOM Brno“.
2. **Firestore Database** → Create database → `eur3 (europe-west)` → production mode.
3. **Hosting** → Get started.
4. **Správci**: Google e-mail do `ADMIN_EMAILS` v `src/config.ts` **a** do `isAdmin()` ve `firestore.rules` (zatím `databali4market@gmail.com`).
5. **Service account** → Generate new private key → obsah jako secret `FIREBASE_SERVICE_ACCOUNT` na GitHubu. Účtu `firebase-adminsdk-…` v Google Cloud IAM přidat role **Service Usage Consumer**, **Firebase Hosting Admin** a **Firebase Rules Admin**.
6. Po připojení vlastní domény přepsat `authDomain` v `src/config.ts` na tuto doménu (spolehlivé přihlášení v Safari) a přidat OAuth redirect `https://<doména>/__/auth/handler`.

E-maily stahuje správce na `/?admin` (CSV pro newsletter jen se souhlasem, datum a znění souhlasu se ukládá kvůli GDPR).

## Nasazení (GitHub → Firebase)

Workflow `.github/workflows/deploy.yml`: push do `main` → testovací kanál `test` (adresa v logu), push do `produkce` → ostrý web. Nasazují se i `firestore.rules`. Bez secretu `FIREBASE_SERVICE_ACCOUNT` se nasazení přeskočí.
Ruční nasazení: `npm run build && npx firebase-tools deploy --only hosting,firestore:rules --project oroom-advent`.
