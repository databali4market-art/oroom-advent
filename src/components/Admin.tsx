/**
 * Stránka pro správce: /?admin
 * Přihlášení přes Google (účet z ADMIN_EMAILS) → stažení kontaktů do CSV.
 * Data vydá jen databáze podle firestore.rules (funkce isAdmin).
 */
import { useEffect, useState } from 'react';
import { Download, LogOut, RefreshCw } from 'lucide-react';
import { backend, type ExportData } from '../backend';
import { ADMIN_EMAILS } from '../config';
import type { User } from '../types';
import { Logo } from './Decor';

function toCsv(header: string[], rows: (string | number | boolean)[][]) {
  const cell = (v: string | number | boolean) => {
    const s = typeof v === 'boolean' ? (v ? 'ano' : 'ne') : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
}
function download(name: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const stamp = () => new Date().toISOString().slice(0, 10);
const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString('cs-CZ') : '');

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<ExportData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let off: (() => void) | undefined;
    backend.watch((u) => { setUser(u); setReady(true); }).then((f) => { off = f; });
    return () => off?.();
  }, []);
  const allowed = !!user && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(user.email);

  async function load() {
    setBusy(true); setError('');
    try { setData(await backend.exportData()); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  useEffect(() => { if (allowed) void load(); }, [allowed]);
  async function signIn() { setError(''); try { await backend.signInGoogle(false); } catch (e) { setError((e as Error).message); } }

  const subscribers = data?.contacts.filter((c) => c.newsletter) ?? [];
  const dlNewsletter = () => download(`newsletter-souhlas-${stamp()}.csv`, toCsv(['email', 'jmeno', 'souhlas_od', 'zneni_souhlasu'], subscribers.map((c) => [c.email, c.name, fmt(c.newsletterAt), c.newsletterConsent])));
  const dlAll = () => download(`vsichni-prihlaseni-${stamp()}.csv`, toCsv(['email', 'jmeno', 'newsletter', 'stav_souhlasu', 'souhlas_od', 'odvolano', 'registrace', 'naposledy', 'otevrenych_okenek'], data!.contacts.map((c) => [c.email, c.name, c.newsletter, c.consentStatus, fmt(c.newsletterAt), fmt(c.revokedAt), fmt(c.createdAt), fmt(c.lastSeenAt), c.opened])));

  return (
    <main className="admin wrap">
      <div className="admin-card">
        <Logo />
        <h1>Správa kalendáře</h1>
        {!ready ? <p className="muted">Načítám…</p>
          : backend.mode !== 'firebase' ? <p className="form-error">Firebase zatím není nastavený (src/config.ts), web běží v ukázkovém režimu.</p>
          : !user ? (<><p className="muted">Přihlaste se Google účtem správce.</p><button className="btn primary" onClick={signIn}>Přihlásit přes Google</button></>)
          : !allowed ? (<><p className="form-error">Účet {user.email} není mezi správci (ADMIN_EMAILS v config.ts a firestore.rules).</p><button className="btn ghost" onClick={() => backend.signOut()}><LogOut size={16} /> Odhlásit</button></>)
          : (
            <>
              <p className="muted">Přihlášen: <b>{user.email}</b></p>
              {data && (
                <div className="admin-stats">
                  <div><strong>{data.contacts.length}</strong><span>přihlášených</span></div>
                  <div><strong>{subscribers.length}</strong><span>se souhlasem s newsletterem{data.contacts.length ? ` (${Math.round((subscribers.length / data.contacts.length) * 100)} %)` : ''}</span></div>
                  <div><strong>{data.contacts.filter((c) => c.consentStatus === 'odmítl' || c.consentStatus === 'odvolal').length}</strong><span>odmítlo nebo odvolalo</span></div>
                </div>
              )}
              <div className="admin-actions">
                <button className="btn primary" onClick={dlNewsletter} disabled={!data || busy}><Download size={16} /> E-maily pro newsletter (CSV)</button>
                <button className="btn ghost" onClick={dlAll} disabled={!data || busy}><Download size={16} /> Všichni přihlášení (CSV)</button>
                <button className="btn ghost" onClick={load} disabled={busy}><RefreshCw size={16} /> {busy ? 'Načítám…' : 'Obnovit'}</button>
              </div>
              <p className="legal">Do newsletteru patří jen soubor „E-maily pro newsletter“ – lidé, kteří souhlas zaškrtli. Ostatní adresy smíte použít jen pro kalendář.</p>
              <button className="link" onClick={() => backend.signOut()}>Odhlásit</button>
            </>
          )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </main>
  );
}
