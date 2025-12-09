import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../api/firebase";

interface DispatchedItem {
  id: string;
  name: string;
  quantity: number;
  dispatchedAt: any;
  dispatchedBy: string;
}

export default function DispatchedListScreen() {
  const [dispatchedItems, setDispatchedItems] = useState<DispatchedItem[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dispatched"), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DispatchedItem[];
      
      data.sort((a, b) => {
        const dateA = a.dispatchedAt?.toDate ? a.dispatchedAt.toDate().getTime() : a.dispatchedAt.seconds * 1000;
        const dateB = b.dispatchedAt?.toDate ? b.dispatchedAt.toDate().getTime() : b.dispatchedAt.seconds * 1000;
        return dateB - dateA;
      });

      setDispatchedItems(data);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: DispatchedItem }) => {
    const dispatchedDate = item.dispatchedAt?.toDate
      ? item.dispatchedAt.toDate()
      : new Date(item.dispatchedAt.seconds * 1000);

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Kiekis: {item.quantity}</Text>
        <Text>Išsiuntė: {item.dispatchedBy}</Text>
        <Text>Išvykimo data: {dispatchedDate.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dispatchedItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nėra išvykusių prekių</Text>}
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
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});