import type { Difficulty, IntervalSettings } from '@/lib/types';

export const DEFAULT_INTERVALS: IntervalSettings = {
  easyMinutes: 5760, // 4 days
  midMinutes: 2880, // 2 days
  hardMinutes: 120, // 2 hours
  veryHardMinutes: 10, // 10 minutes
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  mid: 'Mid',
  hard: 'Hard',
  very_hard: 'Very Hard',
};

export const DIFFICULTY_TO_SETTING_KEY: Record<Difficulty, keyof IntervalSettings> = {
  easy: 'easyMinutes',
  mid: 'midMinutes',
  hard: 'hardMinutes',
  very_hard: 'veryHardMinutes',
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'mid', 'hard', 'very_hard'];
