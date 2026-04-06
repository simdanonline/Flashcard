import { getDatabase } from './database';
import { DEFAULT_INTERVALS } from '@/constants/defaults';
import type { IntervalSettings, SettingKey } from './types';

export async function getIntervalSettings(): Promise<IntervalSettings> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    `SELECT key, value FROM settings WHERE key IN ('easyMinutes', 'midMinutes', 'hardMinutes', 'veryHardMinutes')`
  );

  const stored: Partial<IntervalSettings> = {};
  for (const row of rows) {
    stored[row.key as SettingKey] = parseInt(row.value, 10);
  }

  return { ...DEFAULT_INTERVALS, ...stored };
}

export async function updateIntervalSetting(
  key: SettingKey,
  value: number
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    String(value)
  );
}
