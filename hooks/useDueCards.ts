import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDueCards } from '@/lib/cardRepository';
import type { Card } from '@/lib/types';

export function useDueCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const due = await getDueCards();
    setCards(due);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { cards, loading, refresh };
}
