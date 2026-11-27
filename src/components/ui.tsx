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
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const copy = async () => {
    const ok = await copyText(code);
    setState(ok ? 'ok' : 'fail');
    if (!ok) document.querySelector<HTMLElement>('.codebox b')?.focus();
    if (ok) track('cta_click', { day, target: 'copy_' + code });
    setTimeout(() => setState('idle'), ok ? 2200 : 6000);
  };
  const select = (e: React.SyntheticEvent<HTMLElement>) => {
    const r = document.createRange(); r.selectNodeContents(e.currentTarget);
    const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
  };
  return (
    <div className="codebox">
      <b onClick={select} onFocus={select} tabIndex={0}>{code}</b>
      <button onClick={copy}>
        {state === 'ok' ? <><Check size={14} /> Zkopírováno</> : <><Copy size={14} /> {label}</>}
      </button>
      {state === 'fail' && <small className="codebox-hint">Kopírování se nepovedlo. Kód je označený, podržte ho a zvolte Kopírovat.</small>}
    </div>
  );
}

export const Kicker = ({ children }: { children: React.ReactNode }) => <div className="kicker">{children}</div>;
