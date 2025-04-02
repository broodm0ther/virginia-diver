import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) return Alert.alert("Ошибка", "Введите email");

    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.15:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        navigation.navigate("ResetPassword", { email });
      } else {
        const data = await res.json();
        Alert.alert("Ошибка", data.error || "Ошибка при отправке кода");
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось отправить код");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="x" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Забыли пароль?</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Отправка..." : "Отправить код"}</Text>
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

export default ForgotPasswordScreen;
