import { GA_ID } from '../config';

/**
 * Měření GA4 jen se souhlasem s cookies. Posílají se pouze souhrnné události
 * (otevřené okénko, dokončený kvíz, výsledný pokoj, klik na tlačítko), nikdy odpovědi z her.
 */
const CONSENT_KEY = 'oroom-advent-cookies';
type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
let loaded = false;

export const analyticsEnabled = () => !!GA_ID;
export function consentState(): 'yes' | 'no' | null {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === 'yes' || v === 'no' ? v : null; } catch { return null; }
}
export function setConsent(v: 'yes' | 'no') {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* */ }
  if (v === 'yes') load();
}

function load() {
  if (loaded || !GA_ID) return;
  loaded = true;
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { (w.dataLayer as unknown[]).push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function initAnalytics() { if (consentState() === 'yes') load(); }

export function track(name: string, params: Record<string, string | number> = {}) {
  if (consentState() !== 'yes' || !GA_ID) return;
  load();
  (window as W).gtag?.('event', name, params);
}
