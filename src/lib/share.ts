import { SITE_URL } from '../config';
import { track } from './analytics';

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* starší prohlížeče */ }
  try {
    const t = document.createElement('textarea');
    t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  } catch { return false; }
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
