import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Difficulty, IntervalSettings } from '@/lib/types';
import { formatInterval } from '@/lib/scheduler';
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  DIFFICULTY_TO_SETTING_KEY,
} from '@/constants/defaults';

interface Props {
  settings: IntervalSettings;
  onRate: (difficulty: Difficulty) => void;
}

const BUTTON_COLORS: Record<Difficulty, string> = {
  easy: '#22c55e',
  mid: '#3b82f6',
  hard: '#f59e0b',
  very_hard: '#ef4444',
};

export function DifficultyButtons({ settings, onRate }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How did you find it?</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((d) => {
          const minutes = settings[DIFFICULTY_TO_SETTING_KEY[d]];
          return (
            <Pressable
              key={d}
              style={[styles.button, { backgroundColor: BUTTON_COLORS[d] }]}
              onPress={() => onRate(d)}>
              <Text style={styles.label}>{DIFFICULTY_LABELS[d]}</Text>
              <Text style={styles.interval}>{formatInterval(minutes)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  interval: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
});
