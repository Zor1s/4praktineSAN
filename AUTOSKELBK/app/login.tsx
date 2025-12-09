import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View, } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Klaida", "Įveskite el. paštą ir slaptažodį");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace({ pathname: "/" });
    } catch (error: any) {
      Alert.alert("Prisijungimo klaida", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prisijungimas</Text>

      {/* EMAIL */}
      <Text style={styles.label}>El. paštas</Text>
      <TextInput
        style={styles.input}
        placeholder="pvz. vardas@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* PASSWORD */}
      <Text style={styles.label}>Slaptažodis</Text>
      <TextInput
        style={styles.input}
        placeholder="Įveskite slaptažodį"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Prisijungti" onPress={handleLogin} />
      )}

      <Text
        style={styles.registerText}
        onPress={() => router.push({ pathname: "./register" })}
      >
        Neturi paskyros? Registruokis čia
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },

 
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },


  input: {
    height: 50,
    borderColor: "#007AFF",
    borderWidth: 1.5,
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  registerText: {
    marginTop: 20,
    color: "#007AFF",
    textAlign: "center",
  },
});
