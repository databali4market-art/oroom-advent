import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, Gift, Share2, Snowflake, Send, Ticket, HelpCircle, DoorOpen } from 'lucide-react';
import { GAMES, windowOf } from './content';
import { CONTACT, PREVIEW_KEY, PRIVACY_URL, SHOP, SITE_URL, VOUCHERS_URL } from './config';
import { availableDay, plural } from './lib/time';
import { loadOpened, saveOpened } from './lib/progress';
import { shareLink } from './lib/share';
import { DoorGrid, TYPE_CLASS } from './components/DoorGrid';
import { Celebrate, Lights, Logo, Snow } from './components/Decor';
import { Sheet } from './components/Sheet';
import { Consent } from './components/Consent';
import { GameById, WindowBody } from './components/Windows';

const EVE = Date.parse('2026-12-24T00:00:00+01:00');
const SS = 'oroom-';

function readPreview(): boolean {
  try {
    const url = new URL(location.href);
    const q = url.searchParams.get('nahled');
    if (q !== null) {
      if (q === PREVIEW_KEY) sessionStorage.setItem(SS + 'nahled', '1'); else sessionStorage.removeItem(SS + 'nahled');
      url.searchParams.delete('nahled'); history.replaceState(null, '', url);
    }
    return sessionStorage.getItem(SS + 'nahled') === '1';
  } catch { return false; }
}

type View = { kind: 'day'; day: number } | { kind: 'game'; id: string; fromDay?: number };

export default function App() {
  const [preview, setPreview] = useState(readPreview);
  const [now, setNow] = useState(() => Date.now());
  const today = availableDay(now);
  const max = preview ? 24 : today;
  const [opened, setOpened] = useState<Set<number>>(() => new Set(loadOpened()));
  const [view, setView] = useState<View | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [burst, setBurst] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const notify = useCallback((s: string) => { setToast(s); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 3800); }, []);

  const setUrl = (fn: (u: URL) => void) => { const u = new URL(location.href); fn(u); history.replaceState(null, '', u); };

  const openDoor = useCallback(async (day: number) => {
    if (day > max) { notify(`Okénko ${day} se odemkne ${day}. prosince o půlnoci.`); return; }
    if (!opened.has(day)) {
      setOpening(day);
      await new Promise((r) => setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500));
      setOpening(null);
      setOpened((s) => { const n = new Set(s).add(day); saveOpened([...n]); return n; });
      setBurst((b) => b + 1);
    }
    setView({ kind: 'day', day });
    setUrl((u) => { u.searchParams.set('den', String(day)); u.searchParams.delete('hra'); });
  }, [max, opened, notify]);

  const openGame = useCallback((id: string, fromDay?: number) => {
    setView({ kind: 'game', id, fromDay });
    setUrl((u) => { u.searchParams.set('hra', id); u.searchParams.delete('den'); });
  }, []);

  const close = useCallback(() => {
    setView(null);
    setUrl((u) => { u.searchParams.delete('den'); u.searchParams.delete('hra'); });
  }, []);

  /* odkaz na okénko (?den=) nebo hru (?hra=) */
  const linked = useRef(false);
  useEffect(() => {
    if (linked.current) return;
    linked.current = true;
    const q = new URLSearchParams(location.search);
    const g = q.get('hra'); const n = Number(q.get('den'));
    if (g && GAMES.some((x) => x.id === g) && (max >= 24 || preview || GAMES.find((x) => x.id === g)!.day <= max)) openGame(g);
    else if (n >= 1 && n <= 24 && n <= max) void openDoor(n);
  }, [max, preview, openDoor, openGame]);

  async function share(day?: number) {
    const url = SITE_URL + '/' + (day ? `?den=${day}` : '');
    const r = await shareLink({ title: 'Adventní kalendář OROOM Brno', text: '24 večerů jen pro vás dva: hry, výzvy a překvapení až do Štědrého dne.', url });
    if (r === 'copied') notify('Odkaz je zkopírovaný. Pošlete ho partnerovi.'); else if (r === 'failed') notify('Sdílení se nepodařilo.');
  }

  const left = Math.max(0, Math.floor((EVE - now) / 1000));
  const countdown = [Math.floor(left / 86400), Math.floor(left / 3600) % 24, Math.floor(left / 60) % 60, left % 60];
  const openedCount = useMemo(() => [...opened].filter((d) => d <= max).length, [opened, max]);
  const status = preview ? 'Režim náhledu – všechna okénka jsou odemčená'
    : max === 0 ? 'První okénko se odemkne 1. prosince o půlnoci'
    : max >= 24 ? 'Všechna okénka jsou odemčená. Krásné Vánoce!'
    : opened.has(max) ? `Dnešní okénko máte otevřené. Zítra čeká ${max + 1}.`
    : `Dnes na vás čeká okénko číslo ${max}`;

  const day = view?.kind === 'day' ? view.day : null;
  const tomorrow = day && day < 24 ? windowOf(day + 1) : null;

  return (
    <>
      {preview && (
        <div className="preview-bar">
          <Eye size={15} /> Náhled: všechna okénka odemčená
          <button onClick={() => { try { sessionStorage.removeItem(SS + 'nahled'); } catch { /* */ } setPreview(false); }}>Ukončit</button>
        </div>
      )}

      <header className="topbar">
        <div className="wrap">
          <nav className="actions left" aria-label="Sdílení">
            <button className="chip" onClick={() => share()} aria-label="Sdílet kalendář"><Share2 size={16} /><span>Sdílet</span></button>
          </nav>
          <a href={SHOP} className="brand" aria-label="OROOM Brno"><Logo /></a>
          <nav className="actions right" aria-label="Poukazy">
            <a className="chip pink" href={VOUCHERS_URL} target="_blank" rel="noopener"><Gift size={16} /><span>Poukaz</span></a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <Snow />
        <Lights className="hero-lights" count={22} />
        <div className="wrap hero-center">
          <img className="hero-emblem" src={`${import.meta.env.BASE_URL}emblem.svg`} alt="" width="56" height="56" />
          <div className="hero-kicker">Adventní kalendář <i>2026</i></div>
          <h1>24 večerů<br />jen pro vás dva</h1>
          <p>Každý den o půlnoci se odemkne nové okénko: kvíz, hra, výzva nebo dárek. Hrajte spolu a objevte, která destinace OROOM je napsaná přímo pro vás.</p>
          <div className="hero-cta"><a href="#kalendar" className="btn primary big">Ke kalendáři <ArrowRight size={18} /></a></div>
        </div>
        <div className="wrap countdown" aria-label="Odpočet do Štědrého dne">
          <div className="cd-label">Do Štědrého dne zbývá</div>
          <div className="cd-time">
            {countdown.map((v, i) => (
              <div key={i}><strong>{String(v).padStart(2, '0')}</strong><span>{[plural(v, 'den', 'dny', 'dní'), plural(v, 'hodina', 'hodiny', 'hodin'), plural(v, 'minuta', 'minuty', 'minut'), plural(v, 'sekunda', 'sekundy', 'sekund')][i]}</span></div>
            ))}
          </div>
        </div>
      </section>

      <main>
        <section id="kalendar" className="calendar wrap">
          <div className="cal-head">
            <div>
              <div className="eyebrow">Každý den jedno okénko</div>
              <h2>Vyberte si <em>dnešní překvapení</em></h2>
            </div>
            <p>Kvízy, hry, výzvy a dárky pro dva. Odpovídáte spolu a hádat se o odpověď je povoleno.</p>
          </div>
          <div className="cal-bar">
            <div className="progress">
              <span><b>{openedCount}</b> / 24 okének objeveno</span>
              <div className="track"><i style={{ width: `${(openedCount / 24) * 100}%` }} /></div>
            </div>
            <span className="status">{status}</span>
          </div>
          <DoorGrid max={max} opened={opened} opening={opening} onOpen={openDoor} />
          <div className="legend" aria-hidden="true">
            {(['Kvíz', 'Hra', 'Výzva', 'Bonus', 'Tip', 'Finále'] as const).map((t) => <span key={t}><i className={'t-' + TYPE_CLASS[t]} />{t}</span>)}
          </div>
        </section>

        <section className="how wrap">
          <h2>Jak to funguje</h2>
          <ol>
            <li><b>1</b><div><strong>Otevírejte okénka</strong><span>Každý den o půlnoci se odemkne nové. Bez přihlášení.</span></div></li>
            <li><b>2</b><div><strong>Hrajte spolu</strong><span>Kvízy, karty a výzvy jsou psané pro dva.</span></div></li>
            <li><b>3</b><div><strong>Darujte zážitek</strong><span>Poukaz OROOM přijde do e-mailu za pár minut.</span></div></li>
          </ol>
        </section>

        <section className="services wrap">
          <a href={VOUCHERS_URL} target="_blank" rel="noopener"><Ticket size={26} /><strong>Dárkové poukazy</strong><span>Do e-mailu hned, platnost neomezená. Termín si vyberete spolu.</span><ArrowUpRight size={18} /></a>
          <a href={SHOP} target="_blank" rel="noopener"><DoorOpen size={26} /><strong>Naše pokoje</strong><span>Indie, Havana, Japonsko, St. Petersburg, Persie a Tortuga.</span><ArrowUpRight size={18} /></a>
          <a href={SHOP + 'otazky-a-odpovedi'} target="_blank" rel="noopener"><HelpCircle size={26} /><strong>Otázky a odpovědi</strong><span>Jak to u nás funguje, než dorazíte ke dveřím.</span><ArrowUpRight size={18} /></a>
        </section>

        <section className="closing">
          <Snowflake size={30} />
          <h2>Krásný advent přeje <em>tým OROOM Brno</em></h2>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <Logo />
          <div className="footer-links">
            <a href={SHOP} target="_blank" rel="noopener">OROOM Brno ↗</a>
            <a href={VOUCHERS_URL} target="_blank" rel="noopener">Poukazy ↗</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
            <a href={PRIVACY_URL} target="_blank" rel="noopener">Ochrana osobních údajů ↗</a>
          </div>
          <div id="soukromi" className="privacy">
            <h3>Soukromí</h3>
            <p>Kalendář nesbírá žádné osobní údaje: není potřeba registrace ani přihlášení. Které okénko jste otevřeli si pamatuje jen váš prohlížeč. Odpovědi z kvízů a her se nikam neodesílají. S vaším souhlasem měříme souhrnnou návštěvnost (otevřená okénka, dokončené kvízy). Více v <a href={PRIVACY_URL} target="_blank" rel="noopener">zásadách ochrany osobních údajů</a>.</p>
          </div>
          <small>© 2026 OROOM Brno · Okénka se odemykají o půlnoci (Europe/Prague)</small>
        </div>
      </footer>

      {view && (
        <Sheet label={day ? `${day}. 12.` : 'Hry'} onClose={close}>
          {view.kind === 'game' && view.fromDay && <button className="back" onClick={() => openDoor(view.fromDay!)}><ArrowLeft size={14} /> Zpět</button>}
          {view.kind === 'day' ? (
            <>
              <WindowBody day={view.day} now={now} onToast={notify} onOpenGame={(id) => openGame(id, view.day)} />
              <div className="w-foot">
                <div className="counter">Objeveno {openedCount} / 24</div>
                {tomorrow && <div className="tomorrow">Zítra: <b>{tomorrow.title}</b></div>}
                <button className="btn ghost wide" onClick={() => share(view.day)}><Send size={14} /> Poslat partnerovi</button>
              </div>
            </>
          ) : (
            <GameById id={view.id} onToast={notify} onOpenGame={(id) => openGame(id, view.fromDay)} />
          )}
        </Sheet>
      )}
      <Consent />
      <Celebrate burst={burst} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
