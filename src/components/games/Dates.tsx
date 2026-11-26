import { useMemo, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { dates } from '../../content';
import { track } from '../../lib/analytics';
import { shareLink } from '../../lib/share';
import { ActBtn } from '../ui';

const shuffle = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

/** Generátor rande: karta = Co, Kde, Pravidlo; losuje se bez opakování. */
export function DateGame({ deckKey, startLabel, onToast }: { deckKey: string; startLabel: string; onToast: (t: string) => void }) {
  const deck = dates[deckKey] || [];
  const order = useRef(shuffle(deck));
  const [i, setI] = useState(-1);
  const draw = () => {
    track('card_draw', { deck: deckKey });
    if (i + 1 >= order.current.length) { order.current = shuffle(deck); setI(0); } else setI(i + 1);
  };
  const cur = useMemo(() => (i >= 0 ? order.current[i] : null), [i]);

  const send = async () => {
    if (!cur) return;
    const r = await shareLink({ title: 'Naše rande', text: `Naše rande: ${cur.co} (${cur.kde}). Pravidlo: ${cur.pravidlo}`, quizId: 'rande' });
    onToast(r === 'copied' ? 'Odkaz je zkopírovaný, pošlete ho partnerovi.' : r === 'shared' ? 'Odesláno.' : 'Sdílení se nepodařilo.');
  };

  return (
    <div className="dategame">
      {cur ? (
        <div key={i} className="pcard rande flip">
          <i className="pc-frame" />
          <div className="rd-h">Vaše rande</div>
          <div className="rd-row"><span>Co</span><b>{cur.co}</b></div>
          <div className="rd-row"><span>Kde</span><b>{cur.kde}</b></div>
          <div className="rd-row"><span>Pravidlo</span><b>{cur.pravidlo}</b></div>
          <div className="pc-foot">Vylosovat znovu</div>
        </div>
      ) : (
        <div className="pcard rande empty"><i className="pc-frame" /><div className="rd-h">Vaše rande</div><p>Klikněte a generátor vám vylosuje: co, kde a jedno pravidlo navíc.</p></div>
      )}
      <p className="rule">Hrajte jen to, co vás baví oba. Každou kartu můžete přeskočit. Pravidla tvoříte vy dva.</p>
      <ActBtn onClick={draw} className="wide">{cur ? 'Vylosovat znovu' : startLabel}</ActBtn>
      {cur && <ActBtn ghost onClick={send} className="wide"><Send size={14} /> Poslat partnerovi</ActBtn>}
    </div>
  );
}
