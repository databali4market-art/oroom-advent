import { useState } from 'react';
import { ArrowRight, Check, Copy, Download, ExternalLink } from 'lucide-react';
import { copyText } from '../lib/share';
import { track } from '../lib/analytics';

const B = import.meta.env.BASE_URL;
export const img = (name: string) => `${B}img/${name}.webp`;
export const pdf = (name: string) => `${B}pdf/${name}.pdf`;

/** text s odstavci (prázdný řádek) */
export function Paras({ text, className }: { text: string; className?: string }) {
  return <div className={className}>{text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>;
}

/** Dlouhý příběhový text: poslední věta o skutečném pokoji se odděluje do vlastního odstavce. */
export function splitStory(text: string): string {
  return text.replace(/\s+(Skutečný |Skutečné |Skutečná |Celý příběh |U nás k |Pokračování |Zbytek rituálu)/, '\n\n$1');
}

interface BtnProps { children: React.ReactNode; day?: number; target?: string; ghost?: boolean; className?: string }
/** Tlačítko / odkaz. Měří se jen klik (den + cíl), nic dalšího. */
export function LinkBtn({ href, children, day, target, ghost, download, className = '' }: BtnProps & { href: string; download?: boolean }) {
  return (
    <a
      className={`btn ${ghost ? 'ghost' : 'primary'} ${className}`}
      href={href}
      {...(download ? { download: '' } : { target: '_blank', rel: 'noopener' })}
      onClick={() => {
        if (download) track('file_download', { file: href.split('/').pop() || href });
        else track('cta_click', { day: day || 0, target: target || href });
      }}
    >
      {children}
      {download ? <Download size={16} /> : ghost ? <ExternalLink size={14} /> : <ArrowRight size={16} />}
    </a>
  );
}

export function ActBtn({ children, onClick, ghost, className = '', disabled }: { children: React.ReactNode; onClick: () => void; ghost?: boolean; className?: string; disabled?: boolean }) {
  return <button className={`btn ${ghost ? 'ghost' : 'primary'} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

/** Kód / heslo s tlačítkem Zkopírovat */
export function CodeBox({ code, label, day }: { code: string; label: string; day: number }) {
  const [done, setDone] = useState(false);
  return (
    <div className="codebox">
      <b>{code}</b>
      <button onClick={async () => { if (await copyText(code)) { setDone(true); track('cta_click', { day, target: 'copy_' + code }); setTimeout(() => setDone(false), 2200); } }}>
        {done ? <><Check size={14} /> Zkopírováno</> : <><Copy size={14} /> {label}</>}
      </button>
    </div>
  );
}

export const Kicker = ({ children }: { children: React.ReactNode }) => <div className="kicker">{children}</div>;
