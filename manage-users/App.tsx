import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/app_navigator";
import { useMontserratFonts } from "./src/utils";
import { toastConfig } from "./src/components/custom_toast";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useMontserratFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando recursos...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
