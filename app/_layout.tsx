import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDatabase } from "@/hooks/useDatabase";
import {
  requestPermissions,
  setupNotificationHandler,
} from "@/lib/notifications";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isReady } = useDatabase();

  useEffect(() => {
    setupNotificationHandler();
    requestPermissions();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{ presentation: "modal", title: "Settings" }}
        />
        <Stack.Screen
          name="card/new"
          options={{ title: "New Card", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="card/[id]"
          options={{ title: "Edit Card", headerBackTitle: "Back" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
