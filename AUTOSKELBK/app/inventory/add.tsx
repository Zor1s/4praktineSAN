import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useInventory } from "../contexts/InventoryContext";

export default function AddItemScreen() {
  const { addItem } = useInventory();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleAddItem = async () => {
    if (!name || !description || !quantity) {
      Alert.alert("Klaida", "Užpildykite visus laukus");
      return;
    }

    const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert("Klaida", "Kiekis turi būti teigiamas skaičius");
      return;
    }

    setLoading(true);
    try {
      await addItem({ name, description, quantity: quantityNumber, addedBy: "" }); // prideti preke
      Alert.alert("Sėkmė", "Prekė pridėta į sandėlį");
      router.back();
    } catch (error: any) {
      Alert.alert("Klaida", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pridėti prekę</Text>

      <TextInput
        style={styles.input}
        placeholder="Pavadinimas"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Aprašymas"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Kiekis"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Pridėti prekę" onPress={handleAddItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});