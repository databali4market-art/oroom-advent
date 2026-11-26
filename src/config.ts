/**
 * NASTAVENÍ KALENDÁŘE – vše, co se při spuštění doplňuje, je tady.
 */

/** Veřejná adresa kalendáře (pro sdílení výsledků a OG obrázky). TODO: doplnit ostrou doménu. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://advent.oroom.cz';

/** Klíč pro náhled všech 24 okének před 1. prosincem: ?nahled=KLÍČ (vypnutí ?nahled=off). */
export const PREVIEW_KEY = 'oroomadvent';

/** GA4 měřicí ID (G-XXXXXXX). Prázdné = měření je vypnuté a lišta s cookies se nezobrazí. TODO: doplnit. */
export const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) || '';

/** Odkaz na Spotify playlist k okénku 10. 12. (https://open.spotify.com/playlist/…). TODO: doplnit. */
export const PLAYLIST_URL = '';

/** Poukazy pro Karlovy Vary (St. Petersburg, Havana). TODO: odkaz doplní František. */
export const KV_VOUCHERS_URL = '';

/** Firebase projekt oroom-advent (hodnoty nejsou tajné). */
export const FIREBASE = {
  apiKey: 'AIzaSyD_BykRR11TQqY5UnxzD3JNTO4780Tysd4',
  authDomain: 'oroom-advent.firebaseapp.com',
  projectId: 'oroom-advent',
  storageBucket: 'oroom-advent.firebasestorage.app',
  messagingSenderId: '924300012124',
  appId: '1:924300012124:web:8fb6d57f24d46cf4941499',
};
/** Náhledový build pro GitHub Pages (VITE_NAHLED=1, viz deploy.yml): vše odemčené, bez přihlášení, bez Firebase. */
export const NAHLED_BUILD = import.meta.env.VITE_NAHLED === '1';
export const firebaseEnabled = () => !NAHLED_BUILD && !!FIREBASE.apiKey && !!FIREBASE.projectId;

/**
 * Kdo smí na stránce /?admin stahovat e-maily (Google účty, malými písmeny).
 * Stejný seznam MUSÍ být i ve firestore.rules (funkce isAdmin), jinak databáze data nevydá.
 */
export const ADMIN_EMAILS: string[] = ['databali4market@gmail.com'];

/**
 * Znění souhlasu s newsletterem. Ukládá se ke každému kontaktu spolu s datem souhlasu (kvůli GDPR).
 * Když text změníte, zvyšte verzi.
 */
export const NEWSLETTER_CONSENT = {
  version: 'v1-2026-11',
  text: 'Chci dostávat e-mailem novinky a nabídky OROOM Brno. Souhlas mohu kdykoli odvolat.',
};

export const SHOP = 'https://www.brno.oroom.cz/';
export const VOUCHERS_URL = SHOP + 'vouchers';
export const PRIVACY_URL = SHOP + 'privacy-policy';
export const RESERVE_URL = SHOP; // rezervace se dělá na stránce pokoje
export const CONTACT = { email: 'brno@oroom.cz', phone: '+420 603 476 790' };

/** Slevový kód z okénka 7. 12. a heslo z 13. 12. */
export const CODE_800 = 'ADVENT800';
export const CODE_12 = 'ADVENT12';

/** Časy v Europe/Prague: bonus 7. 12. platí od 0:00 do 8. 12. 23:59:59 */
export const BONUS_START = Date.parse('2026-12-07T00:00:00+01:00');
export const BONUS_END = Date.parse('2026-12-09T00:00:00+01:00');
