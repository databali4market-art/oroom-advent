/** Postup (které okénko jste otevřeli) se ukládá jen v tomto zařízení; na server se neposílá nic. */
const KEY = 'oroom-advent-otevrena';

export function loadOpened(): number[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((n) => Number.isInteger(n)) : []; } catch { return []; }
}
export function saveOpened(days: number[]) {
  try { localStorage.setItem(KEY, JSON.stringify(days)); } catch { /* soukromý režim */ }
}
