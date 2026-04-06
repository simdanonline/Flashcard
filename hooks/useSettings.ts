import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getIntervalSettings,
  updateIntervalSetting,
} from '@/lib/settingsRepository';
import { rescheduleAllNotifications } from '@/lib/notifications';
import type { IntervalSettings, SettingKey } from '@/lib/types';
import { DEFAULT_INTERVALS } from '@/constants/defaults';

export function useSettings() {
  const [settings, setSettings] = useState<IntervalSettings>(DEFAULT_INTERVALS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await getIntervalSettings();
    setSettings(s);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const updateSetting = useCallback(async (key: SettingKey, value: number) => {
    await updateIntervalSetting(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));
    await rescheduleAllNotifications();
  }, []);

  return { settings, loading, updateSetting };
}
