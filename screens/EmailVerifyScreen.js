import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const EmailVerifyScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) return Alert.alert("Ошибка", "Введите код");

    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.15:8080/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Готово", "Почта подтверждена");
        navigation.replace("Login");
      } else {
        Alert.alert("Ошибка", data.error || "Неверный код");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="x" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Подтверждение почты</Text>
      <Text style={styles.subtitle}>Мы отправили код на {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите код"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Проверка..." : "Подтвердить"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F9F9" },
  closeButton: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  subtitle: { fontSize: 14, textAlign: "center", color: "gray", marginBottom: 10 },
  input: {
    height: 50, borderColor: "gray", borderWidth: 1, borderRadius: 10,
    marginBottom: 15, paddingHorizontal: 10, backgroundColor: "white"
  },
  button: {
    backgroundColor: "black", paddingVertical: 14, borderRadius: 10,
    alignItems: "center", marginBottom: 15
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" }
});

export default EmailVerifyScreen;
