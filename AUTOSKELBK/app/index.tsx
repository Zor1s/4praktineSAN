import { useRouter } from "expo-router";
import { Box, Camera, Truck } from "lucide-react-native"; // ikonėlės
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const cards = [
    {
      title: "Sandėlis",
      icon: Box,
      route: "/inventory/list" as const,
      description: "Peržiūrėti visas prekes",
    },
    {
      title: "Skenavimas",
      icon: Camera,
      route: "/inventory/scan" as const,
      description: "Skanuoti naujas prekes",
    },
    {
      title: "Išvykusios prekės",
      icon: Truck,
      route: "/dispatched/list" as const,
      description: "Peržiūrėti išduotas prekes",
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <TouchableOpacity
            key={card.title}
            style={styles.card}
            onPress={() => router.push(card.route as any)}
          >
            <Icon size={36} color="#22C55E" />
            <Text style={styles.title}>{card.title}</Text>
            <Text style={styles.desc}>{card.description}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
});