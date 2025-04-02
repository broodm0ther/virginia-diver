import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!code || !newPassword) {
      return Alert.alert("Ошибка", "Введите код и новый пароль");
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.15:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword })
      });

      if (res.ok) {
        Alert.alert("Успех", "Пароль обновлён");
        navigation.replace("Login");
      } else {
        const data = await res.json();
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

      <Text style={styles.title}>Сброс пароля</Text>
      <TextInput
        style={styles.input}
        placeholder="Код из почты"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Новый пароль"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Сохранение..." : "Сбросить пароль"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F9F9" },
  closeButton: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
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

export default ResetPasswordScreen;
