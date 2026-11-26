import { NEWSLETTER_CONSENT } from '../config';

/** Jednorázová nabídka newsletteru po otevření okénka (ano i ne se zapamatuje). */
export function NewsletterOffer({ onAnswer }: { onAnswer: (v: boolean) => void }) {
  return (
    <div className="nl-offer">
      <strong>Chcete vědět o dalších překvapeních dřív než ostatní?</strong>
      <p>{NEWSLETTER_CONSENT.text}</p>
      <div className="nl-actions">
        <button className="btn primary" onClick={() => onAnswer(true)}>Ano, chci novinky</button>
        <button className="btn ghost" onClick={() => onAnswer(false)}>Teď ne</button>
      </div>
      <small>Okénka dostanete tak jako tak. Nastavení změníte kdykoli v Mém účtu.</small>
    </div>
  );
}
