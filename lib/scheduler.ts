import type { Difficulty, IntervalSettings } from './types';
import { DIFFICULTY_TO_SETTING_KEY } from '@/constants/defaults';

export function computeNextReviewAt(
  difficulty: Difficulty,
  settings: IntervalSettings
): string {
  const settingKey = DIFFICULTY_TO_SETTING_KEY[difficulty];
  const minutes = settings[settingKey];

  const nextDate = new Date();
  nextDate.setMinutes(nextDate.getMinutes() + minutes);

  return toSQLiteDatetime(nextDate);
}

/** Format a Date as SQLite-compatible UTC string: `YYYY-MM-DD HH:MM:SS` */
export function toSQLiteDatetime(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

/** Parse a SQLite UTC datetime string back to a Date */
export function parseSQLiteDatetime(s: string): Date {
  // SQLite stores as "YYYY-MM-DD HH:MM:SS" in UTC — append Z so JS treats it as UTC
  return new Date(s.replace(' ', 'T') + 'Z');
}

export function formatInterval(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) {
    const hours = Math.round(minutes / 60);
    return `${hours}h`;
  }
  const days = Math.round(minutes / 1440);
  return `${days}d`;
}
