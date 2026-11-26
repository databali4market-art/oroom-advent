import { useState } from 'react';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { guess } from '../../content';
import { track } from '../../lib/analytics';
import { ActBtn, Paras } from '../ui';

const LETTERS = 'ABCD';
type Phase = 'intro' | 'answer' | 'pass' | 'guess' | 'feedback' | 'swap' | 'score';

/**
 * Hádej partnera: jeden telefon, dva hráči. V první půlce odpovídá hráč 1 a hádá hráč 2,
 * ve druhé se role prohodí. Odpovědi zůstávají jen v paměti stránky (nikam se neposílají).
 */
export function Guess({ round, intro, startLabel, onOpenQuiz }: { round: 1 | 2; intro: string; startLabel: string; onOpenQuiz: () => void }) {
  const qs = guess[String(round) as '1' | '2'];
  const n = qs.length;
  const [phase, setPhase] = useState<Phase>('intro');
  const [half, setHalf] = useState<0 | 1>(0); // 0: odpovídá hráč 1, 1: odpovídá hráč 2
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [guessed, setGuessed] = useState<number | null>(null);
  const [scores, setScores] = useState<[number, number]>([0, 0]); // [kolik uhodl hráč 1, kolik uhodl hráč 2]

  const answerer = half === 0 ? 1 : 2;
  const guesser = half === 0 ? 2 : 1;
  const q = qs[i];
  const quizId = `znate-${round}`;

  const start = () => { track('quiz_start', { quiz_id: quizId }); setScores([0, 0]); setHalf(0); setI(0); setPhase('answer'); };
  const doGuess = (g: number) => {
    setGuessed(g);
    if (g === answer) setScores((s) => (guesser === 1 ? [s[0] + 1, s[1]] : [s[0], s[1] + 1]));
    setPhase('feedback');
  };
  const nextQ = () => {
    setAnswer(null); setGuessed(null);
    if (i + 1 < n) { setI(i + 1); setPhase('answer'); }
    else if (half === 0) { setHalf(1); setI(0); setPhase('swap'); }
    else {
      const avg = Math.ceil((scores[0] + scores[1]) / 2);
      track('quiz_complete', { quiz_id: quizId, score: avg });
      setPhase('score');
    }
  };

  if (phase === 'intro') {
    return (
      <div className="qintro">
        <Paras text={intro} className="lead" />
        <div className="meta"><span>{n} otázek</span><span>·</span><span>1 telefon</span></div>
        <ActBtn onClick={start} className="wide">{startLabel}</ActBtn>
      </div>
    );
  }
  if (phase === 'pass' || phase === 'swap') {
    return (
      <div className="passpad">
        <div className="pass-ic"><ArrowLeftRight size={30} /></div>
        <h2 className="acc">{phase === 'swap' ? 'Prohazujete role.' : 'Předejte si telefon.'}</h2>
        <p>{phase === 'swap' ? `Teď odpovídá hráč 2 a hádá hráč 1. Znovu od první otázky. Předejte si telefon.` : `Odpověď je uložená. Teď hádá hráč ${guesser}: co asi odpověděl jeho protějšek? Žádné nápovědy, žádné grimasy.`}</p>
        <ActBtn onClick={() => setPhase(phase === 'swap' ? 'answer' : 'guess')} className="wide">Jsem připraven(a)</ActBtn>
      </div>
    );
  }
  if (phase === 'score') {
    const avg = Math.ceil((scores[0] + scores[1]) / 2);
    const msg = guess.msg.find((m) => avg >= m.min && avg <= m.max)?.text || '';
    return (
      <div className="gscore">
        <div className="kicker">Výsledek kola {round}</div>
        <div className="gs-row">
          <div><b>{scores[0]}</b><span>/{n}</span><small>Hráč 1 uhodl</small></div>
          <div><b>{scores[1]}</b><span>/{n}</span><small>Hráč 2 uhodl</small></div>
        </div>
        <p className="gs-msg acc">{msg}</p>
        <ActBtn onClick={onOpenQuiz} className="wide">Kam spolu vyrazíte? Kvíz</ActBtn>
        <button className="again" onClick={() => setPhase('intro')}>Hrát znovu</button>
      </div>
    );
  }
  const asking = phase === 'answer';
  return (
    <div className="qq">
      <div className="prog">{qs.map((_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</div>
      <div className="qn">Otázka {i + 1} / {n}</div>
      <div className="role">{asking ? `Hráč ${answerer} odpovídá za sebe` : `Hráč ${guesser} hádá`}</div>
      <h2 className="qt acc">{asking ? q.q : 'Co odpověděl tvůj protějšek?'}</h2>
      {!asking && <div className="qquote">„{q.q}“</div>}
      <div className="opts">
        {q.a.map((a, k) => {
          const done = phase === 'feedback';
          const cls = done ? (k === answer ? 'right' : k === guessed ? 'wrong' : 'dim') : '';
          return (
            <button key={k} className={`opt ${cls}`} disabled={done} onClick={() => (asking ? (setAnswer(k), setPhase('pass')) : doGuess(k))}>
              <b>{LETTERS[k]}</b>{a}
            </button>
          );
        })}
      </div>
      {phase === 'feedback' && (
        <div className="fb">
          <div className={`fb-msg ${guessed === answer ? 'ok' : 'no'}`}>{guessed === answer ? <><Check size={16} /> Shoda! Znáte se líp, než si myslíte.</> : <><X size={16} /> Tentokrát ne. Správně bylo: {q.a[answer as number]}.</>}</div>
          <ActBtn onClick={nextQ} className="wide">{i + 1 < n ? `Další otázka (telefon zpět hráči ${answerer})` : half === 0 ? 'Prohodit role' : 'Zobrazit výsledek'}</ActBtn>
        </div>
      )}
    </div>
  );
}
