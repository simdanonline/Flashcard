import { ContentEditor } from "@/components/ContentEditor";
import { Colors } from "@/constants/theme";
import { createCard } from "@/lib/cardRepository";
import { serializeContent } from "@/lib/content";
import type { ContentBlock } from "@/lib/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

function hasContent(blocks: ContentBlock[]): boolean {
  return blocks.some((b) => {
    if (b.type === "text" || b.type === "code")
      return b.value.trim().length > 0;
    if (b.type === "image") return b.uri.length > 0;
    return false;
  });
}

export default function NewCardScreen() {
  const router = useRouter();
  const [frontBlocks, setFrontBlocks] = useState<ContentBlock[]>([
    { type: "text", value: "" },
  ]);
  const [backBlocks, setBackBlocks] = useState<ContentBlock[]>([
    { type: "text", value: "" },
  ]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleSave = async () => {
    const front = serializeContent(frontBlocks);
    const back = serializeContent(backBlocks);
    if (!front || !back) return;
    await createCard({ front, back });
    router.back();
  };

  const canSave = hasContent(frontBlocks) && hasContent(backBlocks);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.form}>
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
          disabled={!canSave}
        >
          <Text style={styles.buttonText}>Save Card</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
