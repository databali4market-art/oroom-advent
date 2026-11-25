# Adventní kalendář 2026 – Mobil Maják

Statický web (Vite + React + TypeScript): 24 okének, která se odemykají každý den o půlnoci (Europe/Prague). Přihlášení přes Google (Firebase Authentication), data (otevřená okénka, soutěžní odpovědi, souhlas s novinkami) ve Firestore. Design podle mobilmajak.cz. Obsah vychází z tabulky „Mobil Maják – adventní kalendář 2026“.

## Co kde je

| Soubor | Co obsahuje |
| --- | --- |
| `src/content.ts` | obsah všech 24 okének; `confirm` = co je ještě potřeba potvrdit (zobrazí se jen v režimu `draft`) |
| `src/config.ts` | Firebase, `DEMO_MODE`, `CONTENT_MODE`, klíč náhledu `PREVIEW_KEY` |
| `src/components/Games.tsx` | foto kvíz (2), kvíz (6), řazení telefonů přetahováním (16) a typový kvíz (20) |
| `public/img/` | fotky k okénkům 2, 15 a 16 (zmenšené; názvy záměrně neprozrazují odpovědi) |
| `src/styles.css` | design (barvy: navy `#1b2a5a`, růžová `#ea1d63`, azurová `#2bb3e6`) |
| `src/components/Admin.tsx` | stránka `/?admin` – stažení e-mailů a soutěžních odpovědí do CSV |
| `firestore.rules` | pravidla Firestore (soutěže ve dnech 5, 13, 19, přístup správců) |
| `firebase.json`, `.github/workflows/deploy.yml` | hosting a automatické nasazení |

## Vývoj

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # výstup v dist/
```

## Jak to celé funguje

- **Ostrý web**: Firebase Hosting, `https://advent.mobilmajak.cz` (a `https://mobil-majak.web.app`). Nasazuje se jen z větve **`produkce`**.
- **Testovací web**: preview kanál Firebase `test` (`https://mobil-majak--test-….web.app`, adresa je v logu GitHub Actions). Nasazuje se po každém pushi do **`main`**.
- Tarif **Spark (zdarma)**: hosting 360 MB přenosu denně. První návštěva ≈ 340 kB, opakovaná ≈ 1 kB → zhruba 1 000 nových návštěvníků denně. Při blížícím se limitu (Firebase → Hosting → Usage) přepnout projekt na Blaze – web se pak nevypne, platí se 0,15 $/GB navíc.
- **Přihlášení** jen přes Google (Firebase Authentication). Bez přihlášení se okénka neotevřou (pokud `DEMO_MODE = false`).
- **Data** ve Firestore: `users/{uid}` (e-mail, jméno, otevřená okénka, souhlas s newsletterem vč. data a znění), `entries` (soutěžní odpovědi vč. kontaktního e-mailu), `photos` (fotky rozbitých displejů ze soutěže 19 – zmenšený JPEG přímo v dokumentu, protože Cloud Storage na tarifu Spark nejde). Uzávěrky soutěží hlídá web i `firestore.rules`.
- **E-maily** stahuje správce na `https://advent.mobilmajak.cz/?admin` jako CSV (newsletter / všichni přihlášení / soutěžní odpovědi); fotky ze soutěže 19 tamtéž tlačítkem „Fotky rozbitých displejů“ (klik = stažení).

Stačí bezplatný tarif Firebase (Spark) – přihlášení a databáze mají vlastní, dostatečné limity. Kalendář má mít vlastní Firebase projekt, oddělený od jiných aplikací.

## Nastavení Firebase (jednorázově, cca 15 minut)

1. **Projekt** (hotovo: `mobil-majak`): [console.firebase.google.com](https://console.firebase.google.com) → *Add project* (Google Analytics není potřeba).
2. **Webová aplikace**: Project settings → *Your apps* → ikona `</>` → název `advent` → zkopírovat objekt `firebaseConfig` do `src/config.ts` (`FIREBASE`). Hodnoty nejsou tajné.
3. **Přihlášení**: Build → *Authentication* → Get started → *Google* → Enable → vyplnit e-mail podpory → Save.
   Na záložce *Settings → Authorized domains* přidat `advent.mobilmajak.cz`.
   Na stránce souhlasu Googlu (Google Cloud Console → APIs & Services → OAuth consent screen / Branding) nastavit název „Mobil Maják“, logo a odkaz na zásady ochrany osobních údajů – to uvidí lidé při přihlášení.
4. **Databáze**: Build → *Firestore Database* → Create database → lokace `eur3 (europe-west)` → *production mode*.
5. **Správci**: svůj Google e-mail (malými písmeny) zapsat do `ADMIN_EMAILS` v `src/config.ts` **a** do funkce `isAdmin()` ve `firestore.rules`.
6. **Hosting**: Build → *Hosting* → Get started (stačí proklikat). Pak *Add custom domain* → `advent.mobilmajak.cz` → u správce DNS přidat záznamy, které Firebase ukáže. Po ověření domény přepsat v `src/config.ts` `authDomain` na `advent.mobilmajak.cz` (spolehlivé přihlášení v Safari / na iPhonu).

## Nasazení (GitHub → Firebase)

Workflow `.github/workflows/deploy.yml` sestaví web a nasadí ho (z `main` na testovací kanál, z `produkce` na ostrý web) i s `firestore.rules` do projektu `mobil-majak`. Potřebuje jedno nastavení v GitHubu (repo → Settings → Secrets and variables → Actions). Dokud chybí, nasazení se přeskočí.

1. **Secrets** → `FIREBASE_SERVICE_ACCOUNT` = JSON klíč: Firebase Console → Project settings → *Service accounts* → **Generate new private key** → obsah souboru vložit do secretu, soubor smazat.
2. Aby se nasazovala i pravidla databáze, potřebuje tento účet (`firebase-adminsdk-…@mobil-majak.iam.gserviceaccount.com`) navíc roli **Service Usage Consumer**: [Google Cloud → IAM](https://console.cloud.google.com/iam-admin/iam?project=mobil-majak) → u účtu tužka → *Add another role* → Service Usage Consumer → Save. Bez ní se nasadí jen web.

Ruční nasazení z počítače: `npm run build && npx firebase-tools deploy --only hosting,firestore:rules --project mobil-majak`.

## Ostrý web a doména

Postup práce: změny → `main` → vyzkoušet na testovacím webu → sloučit `main` do `produkce` → ostrý web.

Jednorázové nastavení domény `advent.mobilmajak.cz`:
1. Firebase → Hosting → *Add custom domain* → `advent.mobilmajak.cz` → DNS záznamy, které Firebase ukáže, přidat u správce DNS (Cloudflare: **DNS only / šedý mráček**, jinak se nevydá certifikát).
2. Firebase → Authentication → Settings → *Authorized domains* → přidat `advent.mobilmajak.cz` (a doménu testovacího kanálu `mobil-majak--test-….web.app`).
3. Google Cloud → APIs & Services → Credentials → OAuth klient „Web client (auto created by Google Service)“ → *Authorized redirect URIs* → přidat `https://advent.mobilmajak.cz/__/auth/handler`.

`authDomain` se v `src/config.ts` přepíná podle domény: na `advent.mobilmajak.cz` běží přihlašovací stránka přímo na doméně webu (spolehlivé v Safari / na iPhonu).

## Newsletter a e-maily

- Na `/?admin` se přihlaste Google účtem správce → **E-maily pro newsletter (CSV)** → importovat do nástroje na newsletter (Ecomail, Mailchimp…). CSV má středníky a UTF-8, v Excelu se otevře správně.
- Do newsletteru patří **jen** tento soubor – lidé, kteří zaškrtli souhlas. U každého je datum a znění souhlasu (kvůli GDPR). Znění je v `src/config.ts` (`NEWSLETTER_CONSENT`).
- Soubor „Všichni přihlášení“ slouží jen pro kalendář a kontakt s výherci, ne pro marketing.
- Kdo souhlas v sekci *Moje kupóny* odškrtne, v CSV pro newsletter už nebude (export dělejte až před rozesláním).

Dokud je `apiKey` prázdný, web běží v ukázkovém režimu (data jen v prohlížeči).

## Před spuštěním (1. 12.)

- [ ] Firebase nastavený a vyzkoušené přihlášení i export na `/?admin`.
- [ ] `DEMO_MODE = false`, `CONTENT_MODE = 'live'` v `src/config.ts`.
- [ ] Vyřešit všechny poznámky `confirm` v `src/content.ts` (ceny, kapacita, dárky, otevírací doba, výkup).
- [ ] Soutěž 19: doplnit, kam se posílá fotka (`sendTo`); případně přidat nahrávání fotek (Firebase Storage).
- [ ] Soutěž 5: pravidla soutěže; losování 24. 12.
- [ ] Doplnit logo (soubor) a odkaz na zásady ochrany osobních údajů ve footeru (`src/App.tsx`, sekce `#soukromi`).
- [ ] Zkontrolovat odkazy na mobilmajak.cz (`/servis/`, `/kamenne-prodejny/`, `/vykup/`, `/o-nas/` jsou odhad adres).
- [ ] Kupóny `MAJAK-xx` jsou jen identifikátory pro obsluhu; kapacitu („prvních 30 lidí“) web nehlídá.

> Web je statický, takže obsah budoucích okének je technicky součástí stránky. Správný počet oprav pro soutěž 13 záměrně v kódu není.

## Náhled před 1. prosincem

`?nahled=majakadvent` odemkne všechna okénka (vypnutí `?nahled=off`).
