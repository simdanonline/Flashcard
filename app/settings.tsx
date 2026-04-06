import { ScrollView, View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { formatInterval } from '@/lib/scheduler';
import { Colors } from '@/constants/theme';
import type { SettingKey } from '@/lib/types';

const SETTING_ROWS: { key: SettingKey; label: string }[] = [
  { key: 'easyMinutes', label: 'Easy' },
  { key: 'midMinutes', label: 'Mid' },
  { key: 'hardMinutes', label: 'Hard' },
  { key: 'veryHardMinutes', label: 'Very Hard' },
];

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const inputBg = colorScheme === 'dark' ? '#1e2022' : '#f5f5f5';
  const inputBorder = colorScheme === 'dark' ? '#333' : '#e0e0e0';

  const handleChange = (key: SettingKey, text: string) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateSetting(key, parsed);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Review Intervals
      </Text>
      <Text style={[styles.description, { color: colors.icon }]}>
        Set the delay (in minutes) before a card reappears after each difficulty
        rating. Changing these will reschedule all pending notifications.
      </Text>

      {SETTING_ROWS.map(({ key, label }) => (
        <View
          key={key}
          style={[
            styles.row,
            {
              backgroundColor: inputBg,
              borderColor: inputBorder,
            },
          ]}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <Text style={[styles.preview, { color: colors.icon }]}>
              {formatInterval(settings[key])}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: inputBorder,
                  color: colors.text,
                },
              ]}
              keyboardType="numeric"
              defaultValue={String(settings[key])}
              onEndEditing={(e) => handleChange(key, e.nativeEvent.text)}
            />
            <Text style={[styles.unit, { color: colors.icon }]}>min</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  labelContainer: {
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  unit: {
    fontSize: 14,
  },
});
