import { Minus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ScanResultItemProps {
  item: {
    id: string;
    name: string;
    quantity: number;
  };
  onAdd: (itemId: string, qty: number) => void;
  onRemove: (itemId: string, qty: number) => void;
}

export const ScanResultItem: React.FC<ScanResultItemProps> = ({ item, onAdd, onRemove }) => {
  const [amount, setAmount] = useState<number>(1);

  const handleChange = (val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 1) return;
    setAmount(num);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.qty}>Turimas kiekis: {item.quantity}</Text>
      </View>

      <View style={styles.controls}>

        <TouchableOpacity style={styles.iconBtn} onPress={() => setAmount(a => Math.max(1, a - 1))}>
          <Minus size={20} color="#fff" />
        </TouchableOpacity>


        <TextInput
          style={styles.input}
          value={amount.toString()}
          keyboardType="numeric"
          onChangeText={handleChange}
        />

        <TouchableOpacity style={styles.iconBtn} onPress={() => setAmount(a => a + 1)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#28a745" }]}
          onPress={() => onAdd(item.id, amount)}
        >
          <Text style={styles.btnText}>Pridėti</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#dc3545" }]}
          onPress={() => onRemove(item.id, amount)}
        >
          <Text style={styles.btnText}>Ištrinti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 18, fontWeight: "bold" },
  qty: { fontSize: 14, color: "#555", marginBottom: 8 },
  controls: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  iconBtn: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 50,
    textAlign: "center",
    borderRadius: 6,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});