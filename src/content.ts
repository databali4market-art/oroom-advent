import windowsJson from './data/windows.json';
import quizRoomsJson from './data/quizRooms.json';
import quizResultsJson from './data/quizResults.json';
import guessJson from './data/guess.json';
import cardsJson from './data/cards.json';
import datesJson from './data/dates.json';
import envelopesJson from './data/envelopes.json';
import cubaJson from './data/cuba.json';
import { SHOP } from './config';

/**
 * OBSAH KALENDÁŘE: texty her a okének jsou v src/data/*.json (export z tabulky
 * „OROOM adventní kalendář 2026“), takže se opravují bez zásahu do kódu.
 */
export type RoomKey = 'indie' | 'havana' | 'japonsko' | 'petersburg' | 'persie' | 'tortuga';
export type WinType = 'Kvíz' | 'Hra' | 'Výzva' | 'Bonus' | 'Tip' | 'Finále';
export type Kind = 'roomquiz' | 'cards' | 'story' | 'flight' | 'dates' | 'mikulas' | 'bonus800' | 'guess' | 'tip' | 'havana' | 'password' | 'plain' | 'envelope' | 'finale';

export interface Win { day: number; type: WinType; title: string; text: string; cta: string }
export const windows = windowsJson as Win[];

export const ROOMS: Record<RoomKey, { key: RoomKey; name: string; page: string; img: string; og: string; kv?: boolean; acc: string }> = {
  indie: { key: 'indie', name: 'Indie', page: SHOP + 'Indie', img: 'indie', og: 'indie', acc: 'Indii' },
  havana: { key: 'havana', name: 'Havana', page: SHOP + 'Havana', img: 'havana', og: 'havana', kv: true, acc: 'Havanu' },
  japonsko: { key: 'japonsko', name: 'Japonsko', page: SHOP + 'Japonsko', img: 'japonsko', og: 'japonsko', acc: 'Japonsko' },
  petersburg: { key: 'petersburg', name: 'St. Petersburg', page: SHOP + 'StPetersburg', img: 'petersburg', og: 'petersburg', kv: true, acc: 'St. Petersburg' },
  persie: { key: 'persie', name: 'Persie', page: SHOP + 'Persie', img: 'persie', og: 'persie', acc: 'Persii' },
  tortuga: { key: 'tortuga', name: 'Tortuga', page: SHOP + 'Tortuga', img: 'tortuga', og: 'tortuga', acc: 'Tortugu' },
};
export const ROOM_KEYS = Object.keys(ROOMS) as RoomKey[];

export interface QuizQ { n: number; q: string; a: { t: string; rooms: RoomKey[] }[] }
export const quizRooms = quizRoomsJson as QuizQ[];
export interface QuizResult { name: string; sub: string; headline: string; text: string; cta: string }
export const quizResults = quizResultsJson as Record<RoomKey, QuizResult>;

export interface GuessQ { q: string; a: string[] }
export const guess = guessJson as { '1': GuessQ[]; '2': GuessQ[]; msg: { min: number; max: number; text: string }[] };

export interface Card { t: 'Pravda' | 'Výzva' | 'Konec'; text: string }
export const cards = cardsJson as Record<string, Card[]>;
export interface DateCard { co: string; kde: string; pravidlo: string }
export const dates = datesJson as Record<string, DateCard[]>;
export const envelopes = envelopesJson as Record<string, string>;
export const cuba = cubaJson as Record<string, string>;

/** Která okénka jak vypadají (typ obsahu); texty, nadpisy a tlačítka jsou v tabulce. */
export const KIND: Record<number, Kind> = {
  1: 'roomquiz', 2: 'cards', 3: 'story', 4: 'flight', 5: 'dates', 6: 'mikulas', 7: 'bonus800', 8: 'guess',
  9: 'tip', 10: 'havana', 11: 'story', 12: 'dates', 13: 'password', 14: 'cards', 15: 'story', 16: 'plain',
  17: 'story', 18: 'envelope', 19: 'dates', 20: 'guess', 21: 'story', 22: 'cards', 23: 'tip', 24: 'finale',
};
export const STORY_ROOM: Record<number, RoomKey> = { 3: 'tortuga', 11: 'petersburg', 15: 'indie', 17: 'persie', 21: 'japonsko' };
export const DECK_FOR_DAY: Record<number, string> = { 2: 'PnV 1 romantický', 14: 'PnV 3 odvážnější', 22: 'PnV 4 vánoční' };
export const DATE_DECK_FOR_DAY: Record<number, string> = { 5: 'Rande víkend', 12: 'Rande 20 minut', 19: 'Rande venku' };

export const windowOf = (day: number) => windows[day - 1];

/** Samostatně dostupné hry po Vánocích: ?hra=… */
export const GAMES: { id: string; day: number; title: string; sub: string }[] = [
  { id: 'kviz', day: 1, title: 'Kam spolu vyrazíte?', sub: 'Kvíz: vaše destinace' },
  { id: 'pnv', day: 2, title: 'Pravda, nebo výzva?', sub: 'Romantický balíček' },
  { id: 'andele-certi', day: 6, title: 'Hodní, nebo zlobiví?', sub: 'Andělé a čerti' },
  { id: 'pnv-odvazny', day: 14, title: 'Už jste se rozehřáli?', sub: 'Odvážnější balíček' },
  { id: 'pnv-vanoce', day: 22, title: 'Vánoční pravidla', sub: 'Vánoční balíček' },
  { id: 'rande-vikend', day: 5, title: 'Dnes večer? Nechte to na nás.', sub: 'Generátor rande: víkend' },
  { id: 'rande-20', day: 12, title: 'Rande za 20 minut', sub: 'Generátor rande' },
  { id: 'rande-venku', day: 19, title: 'Rande venku', sub: 'Generátor rande' },
  { id: 'znate-1', day: 8, title: 'Jak dobře se znáte?', sub: 'Kolo 1' },
  { id: 'znate-2', day: 20, title: 'Jak dobře se znáte? Kolo 2', sub: 'Kolo 2' },
];
