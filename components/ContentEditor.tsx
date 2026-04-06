import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Fonts } from '@/constants/theme';
import { copyImageToAppStorage, deleteImageFile } from '@/lib/content';
import type { ContentBlock } from '@/lib/types';

interface ContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  placeholder?: string;
}

export function ContentEditor({ blocks, onChange, placeholder }: ContentEditorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const inputBg = colorScheme === 'dark' ? '#1e2022' : '#f5f5f5';
  const inputBorder = colorScheme === 'dark' ? '#333' : '#e0e0e0';

  const updateBlock = (index: number, updated: ContentBlock) => {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  };

  const removeBlock = (index: number) => {
    const block = blocks[index];
    if (block.type === 'image' && block.uri) {
      deleteImageFile(block.uri);
    }
    const next = blocks.filter((_, i) => i !== index);
    if (next.length === 0) {
      next.push({ type: 'text', value: '' });
    }
    onChange(next);
  };

  const addTextBlock = () => {
    onChange([...blocks, { type: 'text', value: '' }]);
  };

  const addCodeBlock = () => {
    onChange([...blocks, { type: 'code', value: '' }]);
  };

  const addImageBlock = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const localUri = copyImageToAppStorage(result.assets[0].uri);
    onChange([...blocks, { type: 'image', uri: localUri }]);
  };

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => (
        <View key={index} style={styles.blockRow}>
          {block.type === 'text' && (
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  color: colors.text,
                },
              ]}
              value={block.value}
              onChangeText={(text) => updateBlock(index, { ...block, value: text })}
              placeholder={index === 0 ? (placeholder ?? 'Enter text...') : 'Enter text...'}
              placeholderTextColor={colors.icon}
              multiline
              textAlignVertical="top"
            />
          )}

          {block.type === 'code' && (
            <View>
              <Text style={[styles.blockLabel, { color: colors.icon }]}>CODE</Text>
              <TextInput
                style={[
                  styles.codeInput,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#2d2d2d' : '#f4f4f5',
                    borderColor: inputBorder,
                    color: colorScheme === 'dark' ? '#e0e0e0' : '#1f2937',
                    fontFamily: Fonts?.mono ?? 'monospace',
                  },
                ]}
                value={block.value}
                onChangeText={(text) => updateBlock(index, { ...block, value: text })}
                placeholder="Enter code..."
                placeholderTextColor={colors.icon}
                multiline
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {block.type === 'image' && (
            <Image
              source={{ uri: block.uri }}
              style={styles.imageThumb}
              contentFit="cover"
            />
          )}

          {(blocks.length > 1 || block.type !== 'text') && (
            <Pressable
              style={styles.removeButton}
              onPress={() => removeBlock(index)}
              hitSlop={8}
            >
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
        </View>
      ))}

      <View style={styles.toolbar}>
        <Pressable
          style={[styles.toolbarButton, { borderColor: inputBorder }]}
          onPress={addTextBlock}
        >
          <Text style={[styles.toolbarButtonText, { color: colors.tint }]}>+ Text</Text>
        </Pressable>
        <Pressable
          style={[styles.toolbarButton, { borderColor: inputBorder }]}
          onPress={addCodeBlock}
        >
          <Text style={[styles.toolbarButtonText, { color: colors.tint }]}>+ Code</Text>
        </Pressable>
        <Pressable
          style={[styles.toolbarButton, { borderColor: inputBorder }]}
          onPress={addImageBlock}
        >
          <Text style={[styles.toolbarButtonText, { color: colors.tint }]}>+ Image</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  blockRow: {
    position: 'relative',
  },
  blockLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 80,
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 80,
  },
  imageThumb: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  toolbarButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
