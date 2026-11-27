import { SITE_URL } from '../config';
import { track } from './analytics';

/** Kopírování přímo z kliknutí (iOS a vestavěné prohlížeče Instagramu/Facebooku vyžadují synchronní volání). */
function legacyCopy(text: string): boolean {
  const prev = document.activeElement as HTMLElement | null;
  const t = document.createElement('textarea');
  t.value = text; t.readOnly = true;
  t.setAttribute('aria-hidden', 'true');
  t.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;';
  document.body.appendChild(t);
  let ok = false;
  try {
    t.focus({ preventScroll: true });
    t.select(); t.setSelectionRange(0, text.length);
    ok = document.execCommand('copy');
  } catch { ok = false; }
  t.remove();
  prev?.focus?.({ preventScroll: true });
  return ok;
}

export async function copyText(text: string): Promise<boolean> {
  if (legacyCopy(text)) return true; // běží synchronně v rámci kliknutí
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/** Web Share API; kde není, zkopíruje odkaz. Vrací 'shared' | 'copied' | 'failed'. */
export async function shareLink(opts: { title: string; text: string; url?: string; quizId?: string }): Promise<'shared' | 'copied' | 'failed'> {
  const url = opts.url || SITE_URL + '/';
  track('share', { quiz_id: opts.quizId || 'kalendar' });
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
  if (nav.share) {
    try { await nav.share({ title: opts.title, text: opts.text, url }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'failed'; }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
