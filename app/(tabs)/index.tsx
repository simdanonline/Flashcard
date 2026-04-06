import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Link } from 'expo-router';
import { useDueCards } from '@/hooks/useDueCards';
import { useSettings } from '@/hooks/useSettings';
import { FlashCard } from '@/components/FlashCard';
import { DifficultyButtons } from '@/components/DifficultyButtons';
import { EmptyState } from '@/components/EmptyState';
import { updateCardReview } from '@/lib/cardRepository';
import { computeNextReviewAt, parseSQLiteDatetime } from '@/lib/scheduler';
import { scheduleCardDueNotification } from '@/lib/notifications';
import { Colors } from '@/constants/theme';
import type { Difficulty } from '@/lib/types';

export default function StudyScreen() {
  const { cards, loading, refresh } = useDueCards();
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Re-check for newly due cards every 30 seconds while tab is focused
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        refresh();
      }, 30_000);
      return () => clearInterval(interval);
    }, [refresh])
  );

  const currentCard = cards[currentIndex] ?? null;

  const handleRate = useCallback(
    async (difficulty: Difficulty) => {
      if (!currentCard) return;

      const nextReviewAt = computeNextReviewAt(difficulty, settings);
      await updateCardReview(currentCard.id, nextReviewAt, difficulty);

      // Schedule notification for when card becomes due again
      await scheduleCardDueNotification(
        currentCard.id,
        parseSQLiteDatetime(nextReviewAt)
      );

      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
        await refresh();
      }
    },
    [currentCard, currentIndex, cards.length, settings, refresh]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="All caught up!"
          message="No cards are due for review right now. Come back later or add new cards."
        />
        <Link href="/card/new" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Create a Card</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.progress, { color: colors.icon }]}>
          {currentIndex + 1} / {cards.length}
        </Text>
        <Link href="/settings" asChild>
          <Pressable>
            <Text style={[styles.settingsLink, { color: colors.tint }]}>
              Settings
            </Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.cardContainer}>
        <FlashCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onPress={() => setIsFlipped(!isFlipped)}
        />
      </View>

      {isFlipped && (
        <DifficultyButtons settings={settings} onRate={handleRate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsLink: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
