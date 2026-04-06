import { Pressable, StyleSheet, Text, View, useColorScheme, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { parseSQLiteDatetime } from '@/lib/scheduler';
import { getContentPreview } from '@/lib/content';
import type { Card } from '@/lib/types';

interface Props {
  card: Card;
  onPress: () => void;
  onDelete: () => void;
}

function formatDate(sqliteDatetime: string): string {
  const date = parseSQLiteDatetime(sqliteDatetime);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs <= 0) return 'Due now';

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `Due in ${diffMins}m`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Due in ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Due in ${diffDays}d`;
}

export function CardListItem({ card, onPress, onDelete }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLongPress = () => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#1e2022' : '#fff',
          borderColor: colorScheme === 'dark' ? '#333' : '#e8e8e8',
        },
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}>
      <Text style={[styles.front, { color: colors.text }]} numberOfLines={2}>
        {getContentPreview(card.front)}
      </Text>
      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: colors.icon }]}>
          {formatDate(card.next_review_at)}
        </Text>
        {card.review_count > 0 && (
          <Text style={[styles.metaText, { color: colors.icon }]}>
            Reviewed {card.review_count}x
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  front: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 13,
  },
});
