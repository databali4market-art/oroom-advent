import { useState } from 'react';
import { analyticsEnabled, consentState, setConsent } from '../lib/analytics';
import { PRIVACY_URL } from '../config';

/** Lišta se souhlasem s měřením (GA4). Zobrazí se jen když je nastavené GA ID. */
export function Consent() {
  const [state, setState] = useState(consentState);
  if (!analyticsEnabled() || state) return null;
  const set = (v: 'yes' | 'no') => { setConsent(v); setState(v); };
  return (
    <div className="consent" role="dialog" aria-label="Cookies">
      <p>S vaším souhlasem měříme jen souhrnnou návštěvnost (které okénko se otevřelo, který kvíz se dokončil). Odpovědi z her se neukládají. <a href={PRIVACY_URL} target="_blank" rel="noopener">Zásady ochrany osobních údajů</a></p>
      <div><button className="btn ghost" onClick={() => set('no')}>Odmítnout</button><button className="btn primary" onClick={() => set('yes')}>Souhlasím</button></div>
    </div>
  );
}
