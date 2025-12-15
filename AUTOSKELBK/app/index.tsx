import { useRouter } from "expo-router";
import { Camera, ChevronRight, Package, Truck } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sandėlio valdymas</Text>
        <Text style={styles.headerSubtitle}>Greiti veiksmai ir peržiūra</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Primary action */}
        <TouchableOpacity
          style={styles.primaryCard}
          activeOpacity={0.85}
          onPress={() => router.push("/inventory/scan" as any)}
        >
          <View style={styles.primaryIcon}>
            <Camera size={26} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.primaryTitle}>Skenuoti</Text>
            <Text style={styles.primaryDesc}>QR / Barcode — pridėti arba išduoti</Text>
          </View>

          <ChevronRight size={22} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Secondary tiles */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.85}
            onPress={() => router.push("/inventory/list" as any)}
          >
            <View style={styles.tileIcon}>
              <Package size={22} color="#22C55E" />
            </View>
            <Text style={styles.tileTitle}>Sandėlis</Text>
            <Text style={styles.tileDesc}>Visos prekės</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.85}
            onPress={() => router.push("/dispatched/list" as any)}
          >
            <View style={styles.tileIcon}>
              <Truck size={22} color="#22C55E" />
            </View>
            <Text style={styles.tileTitle}>Išvykusios</Text>
            <Text style={styles.tileDesc}>Išduotos prekės</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 14,
  },

  primaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  primaryDesc: { marginTop: 3, fontSize: 13, color: "#6B7280" },

  grid: { flexDirection: "row", gap: 12 },
  tile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: { marginTop: 10, fontSize: 16, fontWeight: "800", color: "#111827" },
  tileDesc: { marginTop: 2, fontSize: 13, color: "#6B7280" },
});
