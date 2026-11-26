import { useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { cards, type Card } from '../../content';
import { track } from '../../lib/analytics';
import { VOUCHERS_URL } from '../../config';
import { ActBtn, LinkBtn } from '../ui';

const RULE = 'Hrajte jen to, co vás baví oba. Každou kartu můžete přeskočit. Pravidla tvoříte vy dva.';
const shuffle = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

/** „Konec“ karta má tvar „Text. → Tlačítko“ */
function splitEnd(t: string) { const [a, b] = t.split(' → '); return { text: a, cta: b || 'Vybrat poukaz' }; }

interface Props {
  deckKey: string;
  title: string;
  sub?: string;
  variant?: 'base' | 'angel' | 'devil';
  startLabel?: string;
  day?: number;
  /** odkaz z poslední karty (výchozí: poukazy) */
  endUrl?: string;
}

/** Náhodné karty bez opakování; karta „Konec“ se objeví až po poslední kartě. */
export function CardGame({ deckKey, title, sub, variant = 'base', startLabel = 'Otočit kartu', day = 0, endUrl = VOUCHERS_URL }: Props) {
  const all: Card[] = cards[deckKey] || [];
  const end = all.find((c) => c.t === 'Konec');
  const queue = useMemo(() => shuffle(all.filter((c) => c.t !== 'Konec')), [deckKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(-1); // -1 = rub, queue.length = konec
  const [round, setRound] = useState(0);
  const q = useMemo(() => (round ? shuffle(queue) : queue), [queue, round]);

  const next = () => {
    track('card_draw', { deck: deckKey });
    setI((v) => Math.min(v + 1, q.length));
  };
  const restart = () => { setRound((r) => r + 1); setI(-1); };
  const cur = i >= 0 && i < q.length ? q[i] : null;
  const isEnd = i >= q.length && !!end;
  const e = end ? splitEnd(end.text) : null;

  return (
    <div className={`cardgame ${variant}`}>
      {i < 0 && (
        <>
          <div className="pcard back" onClick={next} role="button" tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && next()}>
            <i className="pc-frame" />
            <div className="pc-c"><span className="pc-logo">OROOM</span><div className="pc-title">{title}</div><i className="pc-dia" />{sub && <small>{sub}</small>}</div>
          </div>
          <p className="rule">{RULE}</p>
          <ActBtn onClick={next} className="wide">{startLabel}</ActBtn>
        </>
      )}
      {cur && (
        <>
          <div key={`${round}-${i}`} className={`pcard front ${cur.t === 'Pravda' ? 'pravda' : 'vyzva'} flip`}>
            <i className="pc-frame" />
            <div className="pc-lab">{cur.t}</div>
            <div className="pc-q">{cur.text}</div>
            <div className="pc-foot">OROOM<br />Adventní kalendář</div>
          </div>
          <div className="row2">
            <ActBtn ghost onClick={next}>Přeskočit</ActBtn>
            <ActBtn onClick={next}>Další karta</ActBtn>
          </div>
          <div className="counter">{i + 1} / {q.length}</div>
        </>
      )}
      {isEnd && e && (
        <>
          <div key="end" className="pcard front konec flip">
            <i className="pc-frame" />
            <div className="pc-lab">Konec balíčku</div>
            <div className="pc-q">{e.text}</div>
            <div className="pc-foot"><LinkBtn href={endUrl} day={day} target={`deck_${deckKey}`}>{e.cta}</LinkBtn></div>
          </div>
          <button className="again" onClick={restart}><RotateCw size={13} /> Zamíchat znovu</button>
        </>
      )}
    </div>
  );
}
