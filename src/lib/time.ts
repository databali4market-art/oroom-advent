/** Aktuální datum v Europe/Prague – okénka se odemykají o půlnoci českého času. */
export function pragueParts(now = Date.now()) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const [y, m, d] = f.split('-').map(Number);
  return { y, m, d };
}

/** Poslední odemčené okénko (0 = adventní kalendář ještě nezačal; od 24. 12. je otevřeno vše). */
export function availableDay(now = Date.now()): number {
  const { y, m, d } = pragueParts(now);
  if (y > 2026) return 24;
  if (y < 2026 || m < 12) return 0;
  return Math.min(24, d);
}

export const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
