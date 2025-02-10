import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { AuthContext } from "../context/AuthContext";

const SellScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user ? "Чтобы продавать товар на данной площадке обратитесь к главному администратору" : "Хотите продать на Virginia Diver?"}</Text>
      <Text style={styles.subtitle}>{user ? "Нажмите на кнопку ниже, чтобы связаться с администратором." : "Присоединяйтесь к нашему фешн комьюнити и т.д."}</Text>
      
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => user ? Linking.openURL("https://t.me/blightfallsummer") : navigation.navigate("Auth")}
      >
        <Text style={styles.loginButtonText}>{user ? "Telegram" : "Log in / Sign up"}</Text>
      </TouchableOpacity>
      
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>🔒 Вы защищены</Text>
        <Text style={styles.featureText}>Ваши транзакции защищены по нашей Seller Protection Program</Text>
      </View>
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>📦 Отправляйте легко</Text>
        <Text style={styles.featureText}>Автоматическое создание доставки с помощью CDEK</Text>
      </View>
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>⚡ Продавайте быстро</Text>
        <Text style={styles.featureText}>Понижайте цену чтобы продать ваши вещи быстрее</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
    bottom: 20,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "left",
    marginBottom: 20,
    bottom: 5,
  },
  loginButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  featureBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: "gray",
  },
});

export default SellScreen;
