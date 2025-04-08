import React, { useState, useContext, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  TouchableWithoutFeedback, Keyboard, Alert, ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordInputRef = useRef(null);
  const { height } = useWindowDimensions();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Введите email и пароль.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user) {
        Alert.alert("Успех", "Вы успешно вошли!");
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { screen: "Поиск" } }],
        });
      } else if (data.error?.includes("подтвердите")) {
        Alert.alert("Ошибка", "Вы не подтвердили почту!");
        navigation.navigate("EmailVerify", { email });
      } else {
        Alert.alert("Ошибка", data.error || "Неверный email или пароль.");
      }
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

          <Text style={styles.title}>Вход</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordInputRef}
              style={styles.passwordInput}
              placeholder="Пароль"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="gray"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Загрузка..." : "Войти"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>
              Нет аккаунта? <Text style={styles.linkBold}>Зарегистрируйтесь</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#F9F9F9" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  closeButton: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 50, borderColor: "gray", borderWidth: 1, borderRadius: 10,
    marginBottom: 15, paddingHorizontal: 10, backgroundColor: "white"
  },
  passwordContainer: {
    flexDirection: "row", alignItems: "center", borderColor: "gray", borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 10, backgroundColor: "white", marginBottom: 5
  },
  passwordInput: { flex: 1, height: 50 },
  eyeButton: { padding: 10 },
  forgotText: {
    textAlign: "right",
    marginBottom: 15,
    fontSize: 14,
    color: "gray"
  },
  button: {
    backgroundColor: "black", paddingVertical: 14, borderRadius: 10,
    alignItems: "center", marginBottom: 15
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  linkText: { textAlign: "center", fontSize: 16, color: "gray" },
  linkBold: { fontWeight: "bold", color: "black" }
});

export default LoginScreen;
