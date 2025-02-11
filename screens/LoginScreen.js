import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  TouchableWithoutFeedback, Keyboard, Alert
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Введите email и пароль.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Успех", "Вы успешно вошли!");
        console.log("Токен:", data.token);
  
        
        navigation.reset({
          index: 0,
          routes: [{ name: "Main", params: { screen: "Профиль" } }],
        });
      } else {
        Alert.alert("Ошибка", data.error || "Неверный email или пароль.");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось подключиться к серверу.");
      console.error("Ошибка входа:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Вход</Text>

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
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 15 }} />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Загрузка..." : "Войти"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("RegisterScreen")}>
          <Text>Нет аккаунта? Зарегистрируйтесь</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    height: 45,
  },
  eyeButton: {
    padding: 10,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
