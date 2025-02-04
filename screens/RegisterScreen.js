import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [linkPressed, setLinkPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, buttonPressed && styles.buttonPressed]}
        onPressIn={() => setButtonPressed(true)}
        onPressOut={() => setButtonPressed(false)}
        onPress={() => navigation.navigate("Главная")}
      >
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.link, linkPressed && styles.linkPressed]}
        onPressIn={() => setLinkPressed(true)}
        onPressOut={() => setLinkPressed(false)}
        onPress={() => navigation.navigate("Вход")}
      >
        <Text>Уже есть аккаунт? Войдите</Text>
      </TouchableOpacity>
    </View>
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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "black", // серый цвет
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonPressed: {
    backgroundColor: "black", // чернеет при нажатии
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "gray", // серый цвет
    textAlign: "center",
  },
  linkPressed: {
    color: "black", // чернеет при нажатии
  },
});

export default RegisterScreen;
