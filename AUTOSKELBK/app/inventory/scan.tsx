import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScanResultItem } from "./ScanResultItem";

import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { InventoryItem, useInventory } from "../contexts/InventoryContext";

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [amount, setAmount] = useState<string>("1");

  const scanLock = useRef(false);

  const { items, addItem, updateQuantity, removeItem } = useInventory();
  const { user } = useAuth();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions(); // prasome permission

  if (!permission) return <Text>Loading permissions…</Text>;

  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  //skenavimo funkcija apdorojama
  const handleBarCodeScanned = async (result: any) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanned(true);

    const data = result.data; //nuskenuotas kodas
    const foundItem = items.find((i) => i.name === data);
    //Patikrina ar tokia preke yra sandelyje
    if (foundItem) {
      setCurrentItem(foundItem);
    } else {
      await addItem({ // Tokios prekes nera sukuriama nauja preke
        name: data,
        description: "Nuskenuota prekė",
        quantity: 1,
        addedBy: user?.email || "",
      });

      Alert.alert("Pavyko!", `Prekė ${data} pridėta.`);
      if (router.canGoBack()) router.back();

      scanLock.current = false;
    }
  };

  const handleAddAmount = async () => {
    if (!currentItem) return;

    const num = parseInt(amount);

    if (isNaN(num) || num <= 0) {
      Alert.alert("Klaida", "Įveskite teisingą kiekį");
      return;
    }

    await updateQuantity(currentItem.id, currentItem.quantity + num); // kiekis padidedja

    Alert.alert("Pavyko!", `Pridėta ${num} vnt.`);

    setCurrentItem(null);
    setScanned(false);
    scanLock.current = false;
  };

  const handleRemoveAmount = async () => {
    if (!currentItem) return;

    const num = parseInt(amount);

    if (isNaN(num) || num <= 0) {
      Alert.alert("Klaida", "Įveskite teisingą kiekį");
      return;
    }

    if (num > currentItem.quantity) {
      Alert.alert("Klaida", "Negalite ištrinti daugiau nei turite!");
      return;
    }

    await removeItem(currentItem.id, num);

    Alert.alert("Pavyko!", `Ištrinta ${num} vnt.`);

    setCurrentItem(null);
    setScanned(false);
    scanLock.current = false;
  };
 // Leidziami skanavimai
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={cameraType}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13"] }}
      />

{currentItem && (
  <Modal transparent animationType="slide" visible={true}>
    <View style={styles.modalBG}>
      <View style={styles.modal}>
        <ScanResultItem
          item={currentItem}
          onAdd={async (itemId, qty) => {
            await updateQuantity(itemId, currentItem.quantity + qty);
            Alert.alert("Pavyko!", `Pridėta ${qty} vnt.`);
            setCurrentItem(null);
            setScanned(false);
            scanLock.current = false;
          }}
          onRemove={async (itemId, qty) => { //prekes istrynimas
            if (qty > currentItem.quantity) {
              Alert.alert("Klaida", "Negalite ištrinti daugiau nei turite!");
              return;
            }
            await removeItem(itemId, qty);
            Alert.alert("Pavyko!", `Ištrinta ${qty} vnt.`);
            setCurrentItem(null);
            setScanned(false);
            scanLock.current = false;
          }}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#6c757d", marginTop: 10 }]}
          onPress={() => {
            setCurrentItem(null);
            setScanned(false);
            scanLock.current = false;
          }}
        >
          <Text style={styles.btnText}>Atšaukti</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}



      {scanned && !currentItem && (
        <Button
          title="Skenuoti dar kartą"
          onPress={() => {
            setScanned(false);
            scanLock.current = false;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  btn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  btnRemove: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 10,
  },
});