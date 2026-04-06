import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { parseContent } from '@/lib/content';
import { Colors, Fonts } from '@/constants/theme';
import type { StyleProp, TextStyle } from 'react-native';

interface ContentRendererProps {
  content: string;
  textStyle?: StyleProp<TextStyle>;
}

export function ContentRenderer({ content, textStyle }: ContentRendererProps) {
  const blocks = parseContent(content);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return (
              <Text
                key={index}
                style={[styles.text, { color: colors.text }, textStyle]}
              >
                {block.value}
              </Text>
            );
          case 'code':
            return (
              <View
                key={index}
                style={[
                  styles.codeContainer,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#2d2d2d' : '#f4f4f5',
                    borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.codeText,
                    {
                      color: colorScheme === 'dark' ? '#e0e0e0' : '#1f2937',
                      fontFamily: Fonts?.mono ?? 'monospace',
                    },
                  ]}
                >
                  {block.value}
                </Text>
              </View>
            );
          case 'image':
            return (
              <Image
                key={index}
                source={{ uri: block.uri }}
                style={styles.image}
                contentFit="contain"
                transition={200}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  codeContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  codeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
