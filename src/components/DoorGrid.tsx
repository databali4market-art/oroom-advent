import { useEffect, useState } from 'react';
import { Check, Gamepad2, Gift, Lightbulb, Lock, Plane, Sparkles, Compass, HelpCircle } from 'lucide-react';
import { windows, type WinType } from '../content';

export const TYPE_CLASS: Record<WinType, string> = { Kvíz: 'quiz', Hra: 'game', Výzva: 'challenge', Bonus: 'bonus', Tip: 'tip', Finále: 'finale' };

export const typeIcon = (t: WinType, size = 20) => {
  switch (t) {
    case 'Kvíz': return <HelpCircle size={size} />;
    case 'Hra': return <Gamepad2 size={size} />;
    case 'Výzva': return <Compass size={size} />;
    case 'Bonus': return <Gift size={size} />;
    case 'Tip': return <Lightbulb size={size} />;
    case 'Finále': return <Sparkles size={size} />;
    default: return <Plane size={size} />;
  }
};

function useCols() {
  const get = () => (innerWidth >= 900 ? 6 : innerWidth >= 560 ? 4 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => { const on = () => setCols(get()); addEventListener('resize', on); return () => removeEventListener('resize', on); }, []);
  return cols;
}

interface Props { max: number; opened: Set<number>; opening: number | null; onOpen: (day: number) => void }

/** 24 okének jako zabalené dárky. */
export function DoorGrid({ max, opened, opening, onOpen }: Props) {
  const cols = useCols();
  return (
    <div className="phone">
      <div className="phone-bar" aria-hidden="true"><span>Adventní kalendář</span><span>Advent 2026</span></div>
      <div className="grid" style={{ ['--cols' as string]: cols }} role="list" aria-label="24 adventních okének">
        {windows.map((w, i) => {
          const locked = w.day > max;
          const isOpen = !locked && opened.has(w.day);
          const today = w.day === max && !isOpen;
          const state = isOpen ? 'opened' : locked ? 'locked' : 'available';
          const label = `Okénko ${w.day}${locked ? ', odemkne se ' + w.day + '. prosince' : isOpen ? ', otevřené' : ', otevřít'}`;
          return (
            <div role="listitem" key={w.day} className="tile-slot">
              <button
                className={`tile t-${TYPE_CLASS[w.type]} ${state}${today ? ' today' : ''}${opening === w.day ? ' opening' : ''}`}
                aria-label={label}
                aria-disabled={locked}
                onClick={() => onOpen(w.day)}
                style={{ animationDelay: `${i * 24}ms` }}
              >
                <span className="tile-num">{w.day}</span>
                <span className="tile-ico">{typeIcon(w.type, 16)}</span>
                {locked && <span className="tile-lock"><Lock size={12} /></span>}
                {isOpen && <span className="tile-tick"><Check size={11} /></span>}
                {today && <span className="tile-badge">dnes</span>}
              </button>
              <span className="tile-label">{locked ? w.day + '. 12.' : w.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
