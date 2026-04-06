import { Pressable, ScrollView, StyleSheet, Text, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { ContentRenderer } from '@/components/ContentRenderer';

interface FlashCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onPress: () => void;
}

export function FlashCard({ front, back, isFlipped, onPress }: FlashCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colorScheme === 'dark' ? '#1e2022' : '#fff',
          borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.label, { color: colors.icon }]}>
        {isFlipped ? 'ANSWER' : 'QUESTION'}
      </Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <ContentRenderer
          content={isFlipped ? back : front}
          textStyle={[styles.cardText, { color: colors.text }]}
        />
      </ScrollView>
      {!isFlipped && (
        <Text style={[styles.hint, { color: colors.icon }]}>Tap to reveal</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 32,
  },
  hint: {
    fontSize: 14,
    marginTop: 24,
  },
});
