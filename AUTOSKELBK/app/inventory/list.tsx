import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInventory } from "../contexts/InventoryContext";

export default function InventoryListScreen() {
  const { items, fetchItems } = useInventory();
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const getAddedDate = (addedAt: any) => {
  if (!addedAt) return new Date(); 
  if (addedAt.toDate) return addedAt.toDate(); 
  if (addedAt.seconds) return new Date(addedAt.seconds * 1000); 
  if (typeof addedAt === "string" || typeof addedAt === "number") return new Date(addedAt);
  if (addedAt instanceof Date) return addedAt; 
  return new Date();
};


const renderItem = ({ item }: any) => {
  const addedDate = getAddedDate(item.addedAt);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`/inventory/${item.id}` as any)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>Kiekis: {item.quantity}</Text>
      <Text>Įdėjo: {item.addedBy}</Text>
      <Text>Įkėlimo data: {addedDate.toLocaleString()}</Text>
    </TouchableOpacity>
  );
};



return (
  <View style={styles.container}>
    <View style={styles.buttonsContainer}>
      <Button
        title="Pridėti prekę"
        onPress={() => router.push("/invetory/add" as any)}
      />
      <Button
        title="Skenuoti QR / Barcode"
        onPress={() => router.push("/inventory/scan" as any)}
      />
    </View>

    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.emptyText}>Sandėlis tuščias</Text>}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});