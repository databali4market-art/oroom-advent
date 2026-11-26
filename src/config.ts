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
