import { useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Pressable,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAllCards } from '@/hooks/useAllCards';
import { CardListItem } from '@/components/CardListItem';
import { EmptyState } from '@/components/EmptyState';
import { deleteCard } from '@/lib/cardRepository';
import { cancelCardNotification } from '@/lib/notifications';
import { Colors } from '@/constants/theme';

export default function LibraryScreen() {
  const { cards, loading, refresh } = useAllCards();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Re-render every 30s to keep "Due in" labels accurate
  const [, setTick] = useState(0);
  useFocusEffect(
    useCallback(() => {
      refresh();
      const interval = setInterval(() => {
        setTick((t) => t + 1);
      }, 30_000);
      return () => clearInterval(interval);
    }, [refresh])
  );

  const handleDelete = async (id: number) => {
    await cancelCardNotification(id);
    await deleteCard(id);
    await refresh();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cards}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={cards.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <CardListItem
            card={item}
            onPress={() => router.push(`/card/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              title="No cards yet"
              message="Tap the + button to create your first flashcard."
            />
          )
        }
      />
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/card/new')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
});
