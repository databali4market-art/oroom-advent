import { useState } from 'react';
import { RotateCw, Share2 } from 'lucide-react';
import { quizRooms, quizResults, ROOMS, ROOM_KEYS, windowOf, type RoomKey } from '../../content';
import { KV_VOUCHERS_URL, SITE_URL, VOUCHERS_URL } from '../../config';
import { track } from '../../lib/analytics';
import { shareLink } from '../../lib/share';
import { ActBtn, LinkBtn, Paras, img } from '../ui';

const LETTERS = 'ABCDEF';

/** Výsledek: nejvíc bodů; při shodě rozhoduje odpověď na poslední otázku; když ani ta ne, obě doporučení. */
export function scoreRooms(picks: number[]): RoomKey[] {
  const score: Record<string, number> = {};
  quizRooms.forEach((q, qi) => q.a[picks[qi]]?.rooms.forEach((r) => { score[r] = (score[r] || 0) + 1; }));
  const max = Math.max(...ROOM_KEYS.map((r) => score[r] || 0));
  let top = ROOM_KEYS.filter((r) => (score[r] || 0) === max);
  if (top.length > 1) {
    const last = quizRooms[quizRooms.length - 1].a[picks[quizRooms.length - 1]]?.rooms || [];
    const byLast = top.filter((r) => last.includes(r));
    if (byLast.length >= 1) top = byLast;
  }
  return top.slice(0, 2);
}

function ResultCard({ room, day, primary, onToast, onAgain }: { room: RoomKey; day: number; primary: boolean; onToast: (t: string) => void; onAgain?: () => void }) {
  const r = quizResults[room];
  const info = ROOMS[room];
  const share = async () => {
    const res = await shareLink({ title: `Náš pokoj OROOM: ${info.name}`, text: `Kvíz OROOM nám vyšel: ${info.name} – ${r.sub}. A vám?`, url: `${SITE_URL}/s/${info.og}/`, quizId: room });
    onToast(res === 'copied' ? 'Odkaz je zkopírovaný, pošlete ho partnerovi.' : res === 'shared' ? 'Sdíleno.' : 'Sdílení se nepodařilo.');
  };
  return (
    <div className={`qres ${primary ? '' : 'secondary'}`}>
      <div className="qres-ph"><img src={img(info.img)} alt="" loading="lazy" /></div>
      <div className="qres-c">
        <div className="kicker">{primary ? 'Vaše destinace' : 'Nebo také'}</div>
        <h2 className="qres-name">{info.name}</h2>
        <div className="qres-sub acc">{r.sub}</div>
        <div className="qres-hl">{r.headline}</div>
        <p>{r.text}</p>
        <LinkBtn href={VOUCHERS_URL} day={day} target={`voucher_${room}`} className="wide">{r.cta}</LinkBtn>
        {info.kv && KV_VOUCHERS_URL && <LinkBtn href={KV_VOUCHERS_URL} day={day} target={`voucher_kv_${room}`} ghost className="wide">{r.cta.replace('Darovat', 'Darovat')} (Karlovy Vary)</LinkBtn>}
        <div className="row2">
          <LinkBtn href={info.page} day={day} target={`room_${room}`} ghost>Prozkoumat pokoj</LinkBtn>
          <ActBtn ghost onClick={share}><Share2 size={14} /> Sdílet s partnerem</ActBtn>
        </div>
        {primary && onAgain && <button className="again" onClick={onAgain}><RotateCw size={13} /> Hrát znovu</button>}
      </div>
    </div>
  );
}

export function RoomQuiz({ day, onToast }: { day: number; onToast: (t: string) => void }) {
  const w = windowOf(1);
  const [step, setStep] = useState(-1); // -1 úvod, 0..n-1 otázky, n výsledek
  const [picks, setPicks] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const n = quizRooms.length;

  const start = () => { track('quiz_start', { quiz_id: 'pokoj' }); setPicks([]); setSel(null); setStep(0); };
  const pick = (ai: number) => {
    if (sel !== null) return;
    setSel(ai);
    setTimeout(() => {
      const np = [...picks, ai];
      setPicks(np); setSel(null);
      if (step + 1 >= n) { const res = scoreRooms(np); track('quiz_complete', { quiz_id: 'pokoj', result: res.join('+') }); }
      setStep(step + 1);
    }, 380);
  };

  if (step < 0) {
    return (
      <div className="qintro">
        <div className="collage" aria-hidden="true">{ROOM_KEYS.map((k) => <img key={k} src={img(k)} alt="" loading="lazy" />)}</div>
        {day === 1 && <Paras text={w.text} className="lead" />}
        {day !== 1 && <Paras text="Šest otázek vám prozradí, která destinace OROOM je napsaná přímo pro vás. Odpovídáte spolu. Hádat se o odpověď je povoleno." className="lead" />}
        <div className="meta"><span>6 otázek</span><span>·</span><span>2 minuty</span><span>·</span><span>pro dva</span></div>
        <ActBtn onClick={start} className="wide">Spustit kvíz</ActBtn>
      </div>
    );
  }
  if (step >= n) {
    const res = scoreRooms(picks);
    return (
      <div className="qresults">
        {res.map((r, i) => <ResultCard key={r} room={r} day={day} primary={i === 0} onToast={onToast} onAgain={() => setStep(-1)} />)}
      </div>
    );
  }
  const q = quizRooms[step];
  return (
    <div className="qq">
      <div className="prog">{quizRooms.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
      <div className="qn">Otázka {step + 1} / {n}</div>
      <h2 className="qt acc">{q.q}</h2>
      <div className="opts">
        {q.a.map((a, i) => (
          <button key={i} className={`opt ${sel === i ? 'sel' : ''}`} onClick={() => pick(i)}><b>{LETTERS[i]}</b>{a.t}</button>
        ))}
      </div>
      <div className="hint">Odpovídejte spolu. Hádat se je povoleno.</div>
    </div>
  );
}
