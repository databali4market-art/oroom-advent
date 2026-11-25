# Adventní kalendář pro další firmu (šablona z Mobil Maják)

Tento repozitář slouží jako šablona. Pro novou firmu se zkopíruje celý a vymění se jen **značka, obsah a Firebase projekt**.
Jádro zůstává beze změny: přihlášení jen přes Google, zamykání okének podle data (Europe/Prague), náhled `?nahled=…`,
hry a kvízy, soutěže s uzávěrkami (i ve `firestore.rules`), nahrání fotky, jednorázová nabídka newsletteru se souhlasem
(datum + znění), stránka správce `/?admin` s exportem CSV, pravidla soutěží `/?pravidla`, nasazení `main` → test, `produkce` → ostrý web.

## 1. Co připravíš ty (cca 20 minut)

1. **Nový repozitář ze šablony**
   - GitHub → `databali4market-art/mobilmajak` → Settings → General → zaškrtnout **Template repository** (stačí jednou).
   - Pak na hlavní stránce repa **Use this template → Create a new repository** → název např. `nazevfirmy-advent`, **Private**.
2. **Nový Firebase projekt** (vlastní pro každou firmu – limity se nesčítají, data jsou oddělená):
   - console.firebase.google.com → *Create a project* (bez Analytics).
   - *Project settings → General → Public-facing name* = název firmy.
   - Přidat webovou aplikaci `</>` → zkopírovat `firebaseConfig`.
   - *Authentication* → Google → Enable. *Firestore Database* → Create → `eur3` → production mode.
   - *Project settings → Service accounts → Generate new private key* → obsah JSON vložit na GitHubu do nového repa jako secret **`FIREBASE_SERVICE_ACCOUNT`** (do chatu ho neposílat).
   - Google Cloud → IAM → účet `firebase-adminsdk-…` → přidat role **Service Usage Consumer** a **Firebase Rules Admin**.
3. **Podklady od firmy**: logo (SVG/PNG, ideálně i manuál), barvy, Excel s obsahem 24 okének (nadpis, text, typ, kupón/odměna, platnost), fotky, odkaz na zásady ochrany osobních údajů, název firmy + sídlo + IČ/DIČ + kontaktní e-mail, web e-shopu, pobočky, Google e-mail správce.
4. **Nová session Claude Code** s novým repozitářem a zadáním níže.

## 2. Zadání pro novou session (zkopírovat a doplnit)

```
Tento repozitář je kopie adventního kalendáře Mobil Maják (šablona). Udělej z něj kalendář pro firmu <NÁZEV>.
Princip a funkce musí zůstat naprosto stejné – měň jen značku, obsah a Firebase projekt. Postupuj podle docs/NOVY-KLIENT.md (sekce 3).

Firebase config: <vložit firebaseConfig>
ID projektu: <id>
Správce (Google e-mail): <e-mail>
Firma: <název s.r.o.>, <sídlo>, IČ <…>, DIČ <…>, kontakt <e-mail>, <telefon>
Web / e-shop: <url>   Zásady ochrany osobních údajů: <url>
Doména kalendáře: <např. advent.firma.cz>
Podklady (logo, manuál, Excel, fotky) nahraju do chatu.
```

## 3. Co přesně se mění (kontrolní seznam pro session)

**Konfigurace a nasazení**
- `src/config.ts`: `FIREBASE` (config nového projektu; `authDomain` přepínat podle nové domény místo `advent.mobilmajak.cz`), `ADMIN_EMAILS`, `PREVIEW_KEY`, `NEWSLETTER_CONSENT` (text s názvem firmy, nová verze), `DEMO_MODE`, `CONTENT_MODE`.
- `firestore.rules`: seznam správců v `isAdmin()`, uzávěrky soutěží ve `deadline()` (časová razítka v ms pro 23:59:59 Europe/Prague) a dny soutěží (`day in [...]`, `photos` jen pro den s fotkou).
- `.firebaserc` a `.github/workflows/deploy.yml`: výchozí ID projektu (`mobil-majak` → nové).
- `package.json` (`name`), `index.html` (`<title>`, popis, `theme-color`), `vite.config.ts` (komentář s doménou).
- `src/App.tsx`: prefixy úložiště `SS = 'mmaj-'`, `GUEST_KEY`; `src/backend.ts`: klíče `mmaj-…` (aby se data různých kalendářů nepletla).

**Značka a vzhled**
- Logo: `src/logoPaths.ts` + `public/logo-*.svg` (vektorizace PNG přes potrace: písmena = currentColor, akcent zvlášť), komponenta `Logo` a motiv `BeaconA` v `src/components/Decor.tsx` (nahradit motivem nové značky nebo odstranit), `public/favicon.svg`.
- Barvy: tokeny `:root` v `src/styles.css` (`--navy`, `--pink`, `--pink-deep`, …) + barvy v `HeroArt.tsx`, `Decor.tsx` (žárovky), konfety.
- Písmo: `src/fonts.css` (jen latin + latin-ext), `font-family` v `src/styles.css`.
- `src/App.tsx`: horní lišta a hlavní menu napodobují web Mobil Maják (odkazy Servis, Kamenné prodejny…, „Získej 10 bodů…“, telefon) – přepsat podle webu nové firmy; texty v úvodu, „Jak to funguje“, sekce služeb, závěr, patička, sdílení (`navigator.share`), „Soukromí“.
- `src/components/HeroArt.tsx`: visačky (`gift-tag`) s nabídkami nové firmy.

**Obsah**
- `src/content.ts`: `YEAR`, odkazy (`SHOP`, `SERVICE`, `BRANCHES_URL`, `PRIVACY_URL`, …), `OPERATOR`, `PHONE`, `CONTEST_DAYS`, všech 24 okének (`doors`), kupóny (prefix `MAJAK-` → nový), soutěže (`until`, `prize`, `rules`).
- `src/components/Games.tsx` + `public/img/`: hry a kvízy podle nového obsahu (fotky zmenšit: max ~800 px, JPEG q≈70, progresivní).
- `src/components/Rules.tsx`: pravidla soutěží (pořadatel, soutěže, uzávěrky, vyhlášení).
- `src/components/LoginDialog.tsx`, `GiftsDrawer.tsx`, `Admin.tsx`: zbylé texty se značkou.

**Kontrola na konci**
- `grep -rniE "mobil|maj[aá]k|codaruina|mmaj" src index.html firestore.rules .firebaserc .github` → nesmí zůstat nic.
- `npm run build` bez chyb; v náhledu proklikat všech 24 okének (žádné chyby v konzoli, všechny obrázky načtené).
- Velikost první návštěvy ≤ ~350 kB (Firebase Spark: 360 MB přenosu denně).
- Push do `main` → testovací kanál; na ostrý web (`produkce`) až po schválení.
- Doména: Firebase Hosting → *Add custom domain*; Authentication → *Authorized domains*; OAuth klient → redirect `https://<doména>/__/auth/handler`.
