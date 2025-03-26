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
  const navigation = useNavigation();

  console.log("🧩 user:", user);

  const renderContent = () => {
    if (!user) {
      // 🔹 Unregistered
      return (
        <>
          <Text style={styles.title}>Хотите продать на Virginia Diver?</Text>
          <Text style={styles.subtitle}>Присоединяйтесь к нашему фешн комьюнити и т.д.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}>Log in / Sign up</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (user.role === "registered") {
      // 🔹 Registered user
      return (
        <>
          <Text style={styles.title}>Чтобы продавать товар на данной площадке обратитесь к главному администратору</Text>
          <Text style={styles.subtitle}>Нажмите на кнопку ниже, чтобы связаться с администратором.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => Linking.openURL("https://t.me/amazonicaproject")}>
            <Text style={styles.loginButtonText}>Telegram</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (user.role === "seller") {
      // 🔹 Seller
      return (
        <>
          <Text style={styles.title}>Ваш товар ещё не опубликован</Text>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>1. Товар добавлен</Text>
            <Text style={styles.featureText}>Вы можете добавить больше товаров или отредактировать текущий</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>2. Добавьте реквизиты</Text>
            <Text style={styles.featureText}>Укажите, куда отправлять оплату за проданный товар</Text>
          </View>
          <View style={[styles.featureBox, styles.lastFeatureBox]}>
            <Text style={styles.featureTitle}>3. Ожидается проверка</Text>
            <Text style={styles.featureText}>Ваш лот появится в течение 72 часов после модерации</Text>
          </View>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Text style={styles.title}>Панель администратора</Text>
          <Text style={styles.subtitle}>
            Вы можете выдавать роли, управлять пользователями и следить за продавцами
          </Text>
    
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate("UserManagementScreen")}
          >
            <Text style={styles.manageButtonText}>Управление пользователями</Text>
          </TouchableOpacity>
        </>
      );
    }
    
    // fallback
    return <Text>Неизвестная роль: {user.role}</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderContent()}

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
  manageButton: {
    backgroundColor: "black",
    paddingVertical: height * 0.015,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.03,
    width: "100%",
  },
  
  manageButtonText: {
    color: "white",
    fontSize: scaleFont(16),
    fontWeight: "bold",
    textAlign: "center",
  },  
});

export default SellScreen;
