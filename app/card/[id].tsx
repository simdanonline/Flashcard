import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getCardById, updateCard, deleteCard } from '@/lib/cardRepository';
import { cancelCardNotification } from '@/lib/notifications';
import { parseContent, serializeContent } from '@/lib/content';
import { ContentEditor } from '@/components/ContentEditor';
import { Colors } from '@/constants/theme';
import type { ContentBlock } from '@/lib/types';

function hasContent(blocks: ContentBlock[]): boolean {
  return blocks.some((b) => {
    if (b.type === 'text' || b.type === 'code') return b.value.trim().length > 0;
    if (b.type === 'image') return b.uri.length > 0;
    return false;
  });
}

export default function EditCardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [frontBlocks, setFrontBlocks] = useState<ContentBlock[]>([
    { type: 'text', value: '' },
  ]);
  const [backBlocks, setBackBlocks] = useState<ContentBlock[]>([
    { type: 'text', value: '' },
  ]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (!id) return;
    getCardById(Number(id)).then((card) => {
      if (card) {
        setFrontBlocks(parseContent(card.front));
        setBackBlocks(parseContent(card.back));
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    const front = serializeContent(frontBlocks);
    const back = serializeContent(backBlocks);
    if (!front || !back || !id) return;
    await updateCard(Number(id), { front, back });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await cancelCardNotification(Number(id));
          await deleteCard(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const canSave = hasContent(frontBlocks) && hasContent(backBlocks);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.text }]}>
          Front (Question)
        </Text>
        <ContentEditor
          blocks={frontBlocks}
          onChange={setFrontBlocks}
          placeholder="Enter question or prompt..."
        />

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          Back (Answer)
        </Text>
        <ContentEditor
          blocks={backBlocks}
          onChange={setBackBlocks}
          placeholder="Enter answer..."
        />

        <Pressable
          style={[styles.button, !canSave && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!canSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Card</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
