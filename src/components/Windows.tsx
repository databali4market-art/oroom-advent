import { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { cuba, DATE_DECK_FOR_DAY, DECK_FOR_DAY, envelopes, GAMES, KIND, ROOMS, ROOM_KEYS, STORY_ROOM, windowOf, type RoomKey } from '../content';
import { BONUS_END, BONUS_START, CODE_12, CODE_800, KV_VOUCHERS_URL, PLAYLIST_URL, RESERVE_URL, VOUCHERS_URL } from '../config';
import { track } from '../lib/analytics';
import { ActBtn, CodeBox, img, Kicker, LinkBtn, Paras, pdf, splitStory } from './ui';
import { CardGame } from './games/Cards';
import { DateGame } from './games/Dates';
import { RoomQuiz } from './games/RoomQuiz';
import { Guess } from './games/Guess';

export interface WProps { day: number; onToast: (t: string) => void; onOpenGame: (id: string) => void; now: number }

const Hero = ({ src, alt = '' }: { src: string; alt?: string }) => <div className="w-hero"><img src={src} alt={alt} loading="lazy" /></div>;
const Head = ({ day }: { day: number }) => {
  const w = windowOf(day);
  return (<><Kicker>Okénko č. {day} · {w.type}</Kicker><h1 className="w-title acc">{w.title}</h1></>);
};

/** Okénko s pokojem: fotka, příběhový text, tlačítko na poukaz */
function Story({ day }: WProps) {
  const w = windowOf(day); const room = ROOMS[STORY_ROOM[day]];
  return (
    <>
      <Hero src={img(room.img)} />
      <Head day={day} />
      <Paras text={splitStory(w.text)} className="w-text" />
      <div className="w-cta">
        <LinkBtn href={VOUCHERS_URL} day={day} target={`voucher_${room.key}`} className="wide">
          {day === 11 ? 'Darovat St. Petersburg (Brno)' : w.cta.split(' · ')[0]}
        </LinkBtn>
        {day === 11 && KV_VOUCHERS_URL && <LinkBtn href={KV_VOUCHERS_URL} day={day} target="voucher_kv_petersburg" ghost className="wide">Darovat St. Petersburg (Karlovy Vary)</LinkBtn>}
        {day === 15 && <LinkBtn href={pdf('letenka-svetla')} download ghost className="wide">Stáhnout letenku</LinkBtn>}
      </div>
    </>
  );
}

const Facts = () => (
  <div className="facts">
    <div><b>Hned</b><span>do e-mailu</span></div>
    <div><b>∞</b><span>neomezená platnost</span></div>
    <div><b>Vy</b><span>vyberete termín</span></div>
  </div>
);

function Tip({ day }: WProps) {
  const w = windowOf(day);
  return (
    <>
      <Hero src={img('poukaz-letenka')} />
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      <Facts />
      <div className="w-cta">
        <LinkBtn href={VOUCHERS_URL} day={day} target="vouchers" className="wide">Vybrat poukaz</LinkBtn>
        {day === 23 && <LinkBtn href={pdf('letenka-svetla')} download ghost className="wide">Stáhnout letenku</LinkBtn>}
      </div>
    </>
  );
}

function Flight({ day }: WProps) {
  const w = windowOf(day);
  return (
    <>
      <Hero src={img('poukaz-letenka')} />
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      <div className="w-cta">
        <LinkBtn href={pdf('letenka-svetla')} download className="wide">Stáhnout letenku (k vytištění)</LinkBtn>
        <LinkBtn href={pdf('letenka-tmava')} download ghost className="wide">Tmavá verze (na ukázku)</LinkBtn>
        <LinkBtn href={VOUCHERS_URL} day={day} target="vouchers" ghost className="wide">Vybrat poukaz</LinkBtn>
      </div>
      <p className="w-note">Letenka platí do konce adventu a funguje ke každému poukazu.</p>
    </>
  );
}

function Countdown({ to, now }: { to: number; now: number }) {
  const left = Math.max(0, Math.floor((to - now) / 1000));
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="cd3">
      <div><b>{p(Math.floor(left / 3600))}</b><span>hodin</span></div>
      <div><b>{p(Math.floor(left / 60) % 60)}</b><span>minut</span></div>
      <div><b>{p(left % 60)}</b><span>sekund</span></div>
    </div>
  );
}

function Bonus800({ day, now }: WProps) {
  const w = windowOf(day);
  const over = now >= BONUS_END;
  const to = BONUS_END;
  return (
    <>
      <Kicker>Okénko č. {day} · {w.type}</Kicker>
      <h1 className="w-title acc">{over ? 'Tohle překvapení už odletělo.' : w.title}</h1>
      <div className={`voucher ${over ? 'gone' : ''}`}>
        <div className="v-top"><span className="v-logo">OROOM</span><span>Dárkový poukaz</span></div>
        <div className="v-main"><b>−800</b> Kč <small>z poukazu v jakékoli hodnotě</small><em>{over ? 'Odletělo' : '48 h'}</em></div>
        {over && <div className="v-gate"><span>Let ADVENT 800</span><span>Brána uzavřena</span></div>}
      </div>
      {over ? (
        <>
          <p className="w-text">Bonus platil 48 hodin a letadlo už je ve vzduchu. Poukaz OROOM ale můžete darovat dál: do e-mailu dorazí hned a jeho platnost je neomezená. A v kalendáři na vás čekají další překvapení.</p>
          <div className="w-cta"><LinkBtn href={VOUCHERS_URL} day={day} target="vouchers" className="wide">Vybrat poukaz</LinkBtn></div>
        </>
      ) : (
        <>
          <Countdown to={to} now={Math.max(now, BONUS_START)} />
          <CodeBox code={CODE_800} label="Zkopírovat kód" day={day} />
          <Paras text={w.text} className="w-text" />
          <div className="w-cta"><LinkBtn href={VOUCHERS_URL} day={day} target="vouchers" className="wide">Vybrat poukaz</LinkBtn></div>
          <p className="w-note">Poukaz přijde do e-mailu hned. Platnost neomezená.</p>
        </>
      )}
    </>
  );
}

function Havana({ day }: WProps) {
  const w = windowOf(day);
  const [player, setPlayer] = useState(false);
  const sp = PLAYLIST_URL.replace('open.spotify.com/', 'open.spotify.com/embed/');
  const [intro, ...rest] = splitStory(w.text).split('\n\n');
  return (
    <>
      <Hero src={img('cubalibre')} />
      <Head day={day} />
      <Paras text={intro + (rest.length ? '\n\n' + rest.join('\n\n') : '')} className="w-text" />
      <div className="recipe">
        <div className="rc-h acc">{cuba['Nadpis']}</div>
        <div className="rc-cols">
          <ul>{cuba['Suroviny'].split(',').map((s) => <li key={s}>{s.trim()}</li>)}</ul>
          <ol>{['Postup 1', 'Postup 2', 'Postup 3'].map((k) => <li key={k}>{cuba[k]}</li>)}</ol>
        </div>
        <small>Bez alkoholu: {cuba['Bez alkoholu']}</small>
      </div>
      {player && PLAYLIST_URL && <iframe className="spotify" title="Playlist" src={sp} height="152" allow="encrypted-media" loading="lazy" />}
      <div className="w-cta">
        <LinkBtn href={VOUCHERS_URL} day={day} target="voucher_havana" className="wide">Darovat Havanu</LinkBtn>
        {PLAYLIST_URL && !player && <ActBtn ghost className="wide" onClick={() => { setPlayer(true); track('cta_click', { day, target: 'playlist' }); }}>Pustit playlist</ActBtn>}
        {KV_VOUCHERS_URL && <LinkBtn href={KV_VOUCHERS_URL} day={day} target="voucher_kv_havana" ghost className="wide">Darovat Havanu (Karlovy Vary)</LinkBtn>}
      </div>
    </>
  );
}

function Password({ day }: WProps) {
  const w = windowOf(day);
  const [main, ...tail] = w.text.split(' Při placení po pobytu');
  return (
    <>
      <Head day={day} />
      <Paras text={main} className="w-text" />
      <CodeBox code={CODE_12} label="Zkopírovat heslo" day={day} />
      <Paras text={'Při placení po pobytu' + tail.join('')} className="w-text" />
      <div className="w-cta"><LinkBtn href={RESERVE_URL} day={day} target="reserve" className="wide">{w.cta}</LinkBtn></div>
    </>
  );
}

function Plain({ day }: WProps) {
  const w = windowOf(day);
  return (
    <>
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      <div className="three" aria-hidden="true"><span>1.</span><span>2.</span><span>3.</span></div>
    </>
  );
}

function Envelope({ day }: WProps) {
  const w = windowOf(day);
  const [room, setRoom] = useState<RoomKey | null>(null);
  const front = envelopes['Všechny (přední strana)'].split('\n');
  const label = (k: RoomKey) => envelopes[ROOMS[k].name];
  return (
    <>
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      <div className="env-pick">
        {ROOM_KEYS.map((k) => (
          <button key={k} className={`env-room ${room === k ? 'on' : ''}`} onClick={() => setRoom(k)}>
            <img src={img(k)} alt="" loading="lazy" /><span>{ROOMS[k].name}</span>
          </button>
        ))}
      </div>
      {room && (
        <div className="env-card">
          <div className="env-front">{front.map((l, i) => <p key={i} className={i === 0 ? 'acc' : ''}>{l}</p>)}</div>
          <p className="env-text">{label(room)}</p>
          <LinkBtn href={pdf(`tajna-obalka-${room}`)} download className="wide">Stáhnout obálku: {ROOMS[room].name}</LinkBtn>
        </div>
      )}
      {!room && <p className="w-note">{w.cta}</p>}
    </>
  );
}

function Finale({ day, onOpenGame }: WProps) {
  const w = windowOf(day);
  const [hub, setHub] = useState(false);
  return (
    <>
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      <div className="w-cta">
        <ActBtn className="wide" onClick={() => setHub((v) => !v)}>{w.cta}</ActBtn>
        <LinkBtn href={VOUCHERS_URL} day={day} target="vouchers" ghost className="wide">Vybrat destinaci</LinkBtn>
      </div>
      {hub && <GameList onOpenGame={onOpenGame} />}
    </>
  );
}

export function GameList({ onOpenGame }: { onOpenGame: (id: string) => void }) {
  return (
    <ul className="gamelist">
      {GAMES.map((g) => (
        <li key={g.id}><button onClick={() => onOpenGame(g.id)}><Gamepad2 size={18} /><span><b>{g.title}</b><small>{g.sub}</small></span></button></li>
      ))}
    </ul>
  );
}

/** Samotná hra podle id (okénko i samostatná adresa ?hra=…) */
export function GameById({ id, onToast, onOpenGame }: { id: string; onToast: (t: string) => void; onOpenGame: (id: string) => void }) {
  const g = GAMES.find((x) => x.id === id);
  if (!g) return null;
  const d = g.day;
  const w = windowOf(d);
  switch (KIND[d]) {
    case 'roomquiz': return <><Head day={d} /><RoomQuiz day={d} onToast={onToast} /></>;
    case 'cards': return <><Head day={d} /><Paras text={w.text} className="w-text" /><CardGame deckKey={DECK_FOR_DAY[d]} title="Pravda, nebo výzva?" sub="Jen pro vás dva" startLabel={w.cta} day={d} /></>;
    case 'dates': return <><Head day={d} /><Paras text={w.text} className="w-text" /><DateGame deckKey={DATE_DECK_FOR_DAY[d]} startLabel={w.cta} onToast={onToast} /></>;
    case 'guess': return <><Head day={d} /><Guess round={d === 8 ? 1 : 2} intro={w.text} startLabel={w.cta} onOpenQuiz={() => onOpenGame('kviz')} /></>;
    case 'mikulas': return <Mikulas day={d} now={0} onToast={onToast} onOpenGame={onOpenGame} />;
    default: return null;
  }
}

function Mikulas({ day }: WProps) {
  const w = windowOf(day);
  const [deck, setDeck] = useState<null | 'Andělé' | 'Čerti'>(null);
  return (
    <>
      <Head day={day} />
      <Paras text={w.text} className="w-text" />
      {!deck ? (
        <div className="mik">
          <button className="mik-card angel" onClick={() => setDeck('Andělé')}><b className="acc">Andělé</b><span>Hodní celý rok</span><small>S láskou</small><em>Hrát</em></button>
          <button className="mik-card devil" onClick={() => setDeck('Čerti')}><b className="acc">Čerti</b><span>Zlobiví celý rok</span><small>Trochu hříchu</small><em>Hrát</em></button>
        </div>
      ) : (
        <CardGame deckKey={deck === 'Andělé' ? 'PnV 2 Andělé' : 'PnV 2 Čerti'} title={deck === 'Andělé' ? 'Andělský balíček' : 'Čertovský balíček'} sub={deck === 'Andělé' ? 'Hodní celý rok' : 'Zlobiví celý rok'} variant={deck === 'Andělé' ? 'angel' : 'devil'} startLabel="Otočit kartu" day={day} />
      )}
    </>
  );
}

export function WindowBody(p: WProps) {
  const k = KIND[p.day];
  useEffect(() => { track('advent_window_open', { day: p.day }); }, [p.day]);
  switch (k) {
    case 'story': return <Story {...p} />;
    case 'tip': return <Tip {...p} />;
    case 'flight': return <Flight {...p} />;
    case 'bonus800': return <Bonus800 {...p} />;
    case 'havana': return <Havana {...p} />;
    case 'password': return <Password {...p} />;
    case 'plain': return <Plain {...p} />;
    case 'envelope': return <Envelope {...p} />;
    case 'finale': return <Finale {...p} />;
    case 'mikulas': return <Mikulas {...p} />;
    case 'roomquiz': return <><Head day={p.day} /><RoomQuiz day={p.day} onToast={p.onToast} /></>;
    case 'cards': { const w = windowOf(p.day); return <><Head day={p.day} /><Paras text={w.text} className="w-text" /><CardGame deckKey={DECK_FOR_DAY[p.day]} title="Pravda, nebo výzva?" sub="Jen pro vás dva" startLabel={w.cta} day={p.day} /></>; }
    case 'dates': { const w = windowOf(p.day); return <><Head day={p.day} /><Paras text={w.text} className="w-text" /><DateGame deckKey={DATE_DECK_FOR_DAY[p.day]} startLabel={w.cta} onToast={p.onToast} /></>; }
    case 'guess': { const w = windowOf(p.day); return <><Head day={p.day} /><Guess round={p.day === 8 ? 1 : 2} intro={w.text} startLabel={w.cta} onOpenQuiz={() => p.onOpenGame('kviz')} /></>; }
    default: return null;
  }
}
