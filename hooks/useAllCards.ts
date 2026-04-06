import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllCards } from '@/lib/cardRepository';
import type { Card } from '@/lib/types';

export function useAllCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await getAllCards();
    setCards(all);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { cards, loading, refresh };
}
