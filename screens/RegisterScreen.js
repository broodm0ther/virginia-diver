import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  TouchableWithoutFeedback, Keyboard, Alert, ScrollView 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { height } = useWindowDimensions();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Ошибка", "Все поля должны быть заполнены!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть минимум 6 символов");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Успех", "Код подтверждения отправлен на почту");
        navigation.navigate("EmailVerify", { email }); // ✅ Переход на EmailVerify
      } else {
        Alert.alert("Ошибка", data.error || "Что-то пошло не так");
      }
    } catch (err) {
      Alert.alert("Ошибка", "Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[styles.container, { minHeight: height * 0.9 }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Icon name="x" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Регистрация</Text>

          <TextInput
            style={styles.input}
            placeholder="Имя пользователя"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="gray"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Пароль"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="gray"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Загрузка..." : "Зарегистрироваться"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.linkText}>Уже есть аккаунт? <Text style={styles.linkBold}>Войдите</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#F9F9F9" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  closeButton: { position: "absolute", top: 10, right: 20, zIndex: 10 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 50, borderColor: "gray", borderWidth: 1, borderRadius: 10,
    marginBottom: 15, paddingHorizontal: 10, backgroundColor: "white"
  },
  passwordContainer: {
    flexDirection: "row", alignItems: "center", borderColor: "gray", borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 10, backgroundColor: "white", marginBottom: 15
  },
  passwordInput: { flex: 1, height: 50 },
  eyeButton: { padding: 10 },
  button: {
    backgroundColor: "black", paddingVertical: 14, borderRadius: 10,
    alignItems: "center", marginBottom: 15
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  linkText: { textAlign: "center", fontSize: 16, color: "gray" },
  linkBold: { fontWeight: "bold", color: "black" }
});

export default RegisterScreen;
