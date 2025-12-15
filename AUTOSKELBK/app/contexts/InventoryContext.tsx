import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc, } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState, } from "react";
import { db } from "../api/firebase";
import { useAuth } from "./AuthContext";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  addedAt: Date;
  addedBy: string;
}

interface InventoryContextProps {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id" | "addedAt">) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeItem: (itemId: string, amount: number) => Promise<void>;
  fetchItems: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(
  undefined
);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>([]); //Juos ikelia cia
  const { user } = useAuth();

  const itemsCollection = collection(db, "inventory");
  const dispatchedCollection = collection(db, "dispatched"); 

  const fetchItems = async () => { //Pasieme duomenys is inventory kolekcijos fb
    if (!user) return;

    const snapshot = await getDocs(itemsCollection);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate
        ? doc.data().addedAt.toDate()
        : new Date(),
    })) as InventoryItem[];

    setItems(data); // Juos ikelia i atminti
  };

  const addItem = async (item: Omit<InventoryItem, "id" | "addedAt">) => { //sukuria nauja preke
    if (!user) return;

    const existing = items.find((i) => i.name === item.name);

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + item.quantity);
    } else {
      await addDoc(itemsCollection, {
        ...item,
        quantity: item.quantity,
        addedAt: Timestamp.now(),
        addedBy: user.email,
      });
    }

    await fetchItems();
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!user) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity <= 0) {
      await deleteDoc(doc(db, "inventory", itemId));
    } else {
      await updateDoc(doc(db, "inventory", itemId), {
        quantity: newQuantity,
      });
    }

    await fetchItems();
  };

 // istrynimo prekes logika
  const removeItem = async (itemId: string, amount: number) => {
    if (!user) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const remaining = item.quantity - amount;

  // irasom i dispatched
    await addDoc(dispatchedCollection, {
      name: item.name,
      quantity: amount,
      dispatchedAt: Timestamp.now(),
      dispatchedBy: user.email,
    });

    //Atnaujinam arba ištrinam iš "inventory"
    if (remaining <= 0) {
      await deleteDoc(doc(db, "inventory", itemId));
    } else {
      await updateDoc(doc(db, "inventory", itemId), {
        quantity: remaining,
      });
    }

    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        fetchItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context)
    throw new Error("useInventory must be used within InventoryProvider");
  return context;
};
