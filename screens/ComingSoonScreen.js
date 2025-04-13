import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ComingSoonScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>amazonica project</Text>

      {/* Иконка/заглушка */}
      <View style={styles.illustrationWrapper}>
        <Text style={styles.emoji}>🛠️</Text>
      </View>

      {/* Основной текст */}
      <Text style={styles.title}>Страница в разработке</Text>
      <Text style={styles.subtitle}>Скоро здесь будет что-то классное 🔥</Text>

      {/* Кнопка */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MainTabs", { screen: "Продать" })}
      >
        <Text style={styles.buttonText}>К продажам</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontFamily: "MomTypewriter",
    fontSize: 26,
    color: "#222",
    position: "absolute",
    top: 65,
    left: 20,
  },
  illustrationWrapper: {
    marginBottom: 20,
  },
  emoji: {
    fontSize: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
