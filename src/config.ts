/**
 * NASTAVENÍ WEBU
 *
 * 1) Firebase – zkopírujte z Firebase Console → Project settings → Your apps → Web app.
 *    Tyto hodnoty nejsou tajné. Dokud je apiKey prázdný, web běží v UKÁZKOVÉM režimu
 *    (přihlášení jen e-mailem bez ověření, data jen v prohlížeči).
 */
export const FIREBASE = {
  // TODO: doplnit po vytvoření Firebase projektu Oroom (Project settings → Your apps → Web app).
  // Dokud je apiKey prázdný, web běží v ukázkovém režimu.
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

/** 'draft' = u nabídek a soutěží se ukazují poznámky „k potvrzení“. Před spuštěním přepněte na 'live'. */
export const CONTENT_MODE: 'draft' | 'live' = 'live';

/**
 * Klíč pro náhled všech okének před 1. prosincem: otevřete web s ?nahled=KLÍČ
 * (vypnutí: ?nahled=off). Kalendář je statický, takže nejde o zabezpečení – jen o pohodlné testování.
 */
export const PREVIEW_KEY = 'oroomadvent';

export const firebaseEnabled = () => !!FIREBASE.apiKey && !!FIREBASE.projectId;

/**
 * UKÁZKOVÁ VERZE PRO PREZENTACI
 * true = vše je odemčené a dá se proklikat bez přihlášení (postup se ukládá jen v prohlížeči).
 * Před ostrým spuštěním kampaně přepněte na false.
 */
export const DEMO_MODE = false;

/**
 * Kdo smí na stránce /?admin stahovat e-maily a soutěžní odpovědi (Google účty, malými písmeny).
 * Stejný seznam MUSÍ být i ve firestore.rules (funkce isAdmin), jinak databáze data nevydá.
 */
export const ADMIN_EMAILS: string[] = [
  // TODO: Google e-mail správce (malými písmeny)
];

/**
 * Znění souhlasu s newsletterem. Ukládá se ke každému kontaktu spolu s datem souhlasu (kvůli GDPR).
 * Když text změníte, zvyšte verzi – u kontaktu pak uvidíte, s jakým zněním souhlasil.
 */
export const NEWSLETTER_CONSENT = {
  version: 'v1-2026-11',
  text: 'Chci dostávat e-mailem novinky a nabídky OROOM Brno. Souhlas mohu kdykoli odvolat.',
};
