import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { InventoryProvider } from "./contexts/InventoryContext";

function RootStack() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {

      router.replace("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }


  return (
<Stack
  screenOptions={{
    headerStyle: { backgroundColor: "#1F2933" },
    headerTintColor: "#fff",
    contentStyle: { backgroundColor: "#f2f2f2" },
  }}
>
  <Stack.Screen name="index" options={{ title: "Pagrindinis" }} />
  <Stack.Screen name="inventory/list" options={{ title: "Sandėlis" }} />
  <Stack.Screen name="inventory/scan" options={{ title: "Skenavimas" }} />
  <Stack.Screen name="inventory/[itemId]" options={{ title: "Prekė" }} /> {/* <- čia */}
  <Stack.Screen name="dispatched/list" options={{ title: "Išvykusios prekės" }} />
</Stack>

  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <RootStack />
      </InventoryProvider>
    </AuthProvider>
  );
}