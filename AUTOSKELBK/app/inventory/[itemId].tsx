import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { InventoryItem, useInventory } from "../contexts/InventoryContext";

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useInventory();
  const { user } = useAuth();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundItem = items.find((i) => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
      setQuantity(foundItem.quantity.toString());
    }
  }, [items, itemId]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Prekė nerasta</Text>
      </View>
    );
  }

  const handleUpdateQuantity = async () => {
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty < 0) {
      Alert.alert("Klaida", "Kiekis turi būti >= 0");
      return;
    }

    setLoading(true);

    try {
      await updateQuantity(item.id, qty);
      Alert.alert("Sėkmė", "Kiekis atnaujintas");
    } catch (err: any) {
      Alert.alert("Klaida", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async () => {
    if (!user) return;

    const amount = parseInt(quantity, 10);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Klaida", "Įveskite kiekį > 0");
      return;
    }

    if (amount > item.quantity) {
      Alert.alert("Klaida", "Negalima išduoti daugiau nei turite sandėlyje!");
      return;
    }

    setLoading(true);

    try {
      await removeItem(item.id, amount); //dispatchina

      Alert.alert(
        "Sėkmė",
        amount === item.quantity
          ? "Išduotas visas kiekis — prekė pašalinta"
          : `Išduota ${amount} vnt.`,
      );

      router.back();
    } catch (err: any) {
      Alert.alert("Klaida", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.label}>Aprašymas:</Text>
      <Text style={styles.text}>{item.description}</Text>

      <Text style={styles.label}>Turimas kiekis:</Text>
      <Text style={styles.text}>{item.quantity}</Text>

      <Text style={styles.label}>Įveskite naują kiekį arba kiekį išduoti:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <Button title="Atnaujinti kiekį" onPress={handleUpdateQuantity} />

          <View style={{ height: 15 }} />

          <Button title="Išduoti" onPress={handleDispatch} color="#FF3B30" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});