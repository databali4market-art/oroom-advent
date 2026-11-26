import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Logo } from './Decor';

/** Okno okénka: na mobilu přes celou obrazovku, na počítači jako karta uprostřed (podle dodané grafiky). */
export function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', key);
    ref.current?.focus();
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', key); };
  }, [onClose]);
  return (
    <div className="sheet-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} ref={ref} tabIndex={-1}>
        <div className="sheet-top">
          <span className="sheet-day">{label}</span>
          <Logo city={false} />
          <button className="sheet-x" onClick={onClose} aria-label="Zavřít"><X size={16} /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
