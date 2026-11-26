import { LogOut } from 'lucide-react';
import { windows } from '../content';
import { NEWSLETTER_CONSENT } from '../config';
import type { User } from '../types';
import { Sheet } from './Sheet';

/** „Moje okénka“: přehled otevřených okének, souhlas s newsletterem a odhlášení */
export function MyWindows({ user, opened, newsletter, onClose, onPick, onNewsletter, onLogout }: {
  user: User; opened: number[]; newsletter: boolean; onClose: () => void; onPick: (day: number) => void; onNewsletter: (v: boolean) => void; onLogout: () => void;
}) {
  const list = [...opened].sort((a, b) => a - b).map((d) => windows[d - 1]).filter(Boolean);
  return (
    <Sheet label="Můj účet" onClose={onClose}>
      <div className="kicker">Váš účet</div>
      <h1 className="w-title acc">Moje okénka</h1>
      <div className="drawer-user">{user.email}</div>
      <h3 className="mw-h">Otevřená okénka <span>{list.length}/24</span></h3>
      {list.length === 0 ? <p className="w-text">Zatím tu nic není. Otevřete první okénko.</p> : (
        <ul className="gamelist">
          {list.map((w) => <li key={w.day}><button onClick={() => onPick(w.day)}><span className="gift-day">{w.day}</span><span><b>{w.title}</b><small>{w.type}</small></span></button></li>)}
        </ul>
      )}
      <label className="check">
        <input type="checkbox" checked={newsletter} onChange={(e) => onNewsletter(e.target.checked)} />
        <span>{NEWSLETTER_CONSENT.text}</span>
      </label>
      <button className="btn ghost wide" onClick={onLogout}><LogOut size={14} /> Odhlásit se</button>
    </Sheet>
  );
}
