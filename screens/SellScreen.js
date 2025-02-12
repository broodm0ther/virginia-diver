import React, { useContext } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Linking, 
  Dimensions, PixelRatio, SafeAreaView, ScrollView
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const scaleFont = (size) => size * PixelRatio.getFontScale();

const SellScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation(); // ✅ Добавляем навигацию

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>
          {String(user
            ? "Чтобы продавать товар на данной площадке обратитесь к главному администратору"
            : "Хотите продать на Virginia Diver?")}
        </Text>

        <Text style={styles.subtitle}>
          {String(user
            ? "Нажмите на кнопку ниже, чтобы связаться с администратором."
            : "Присоединяйтесь к нашему фешн комьюнити и т.д.")}
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => (user ? Linking.openURL("https://t.me/blightfallsummer") : navigation.navigate("Login"))} // ✅ Теперь открывает `LoginScreen`
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
        <View style={[styles.featureBox, styles.lastFeatureBox]}>
          <Text style={styles.featureTitle}>⚡ Продавайте быстро</Text>
          <Text style={styles.featureText}>Понижайте цену, чтобы продать ваши вещи быстрее</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    width: "100%",
  },
  subtitle: {
    fontSize: scaleFont(14),
    textAlign: "center",
    marginBottom: height * 0.02,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "black",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  loginButtonText: {
    color: "white",
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  featureBox: {
    backgroundColor: "white",
    padding: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.02,
    elevation: 2,
    width: "100%",
  },
  lastFeatureBox: {
    marginBottom: height * 0.05,
  },
  featureTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  featureText: {
    fontSize: scaleFont(14),
    color: "gray",
  },
});

export default SellScreen;
