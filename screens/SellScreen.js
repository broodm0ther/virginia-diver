import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  PixelRatio,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const scaleFont = (size) => size * PixelRatio.getFontScale();

const SellScreen = () => {
  const { user, token } = useContext(AuthContext);
  const navigation = useNavigation();
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      if (user?.role === "seller") {
        try {
          const response = await fetch("http://192.168.1.15:8080/api/products/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setPendingProducts(data.products || []);
          }
        } catch (err) {
          console.error("Ошибка получения товаров продавца", err);
        }
      }
    };
    fetchPending();
  }, [user]);

  const renderContent = () => {
    if (!user) {
      return (
        <>
          <Text style={styles.title}>Хотите продать на amazonica project?</Text>
          <Text style={styles.subtitle}>Присоединяйтесь к нашему фешн комьюнити и т.д.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}>Log in / Sign up</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (user.role === "registered") {
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
      return (
        <>
          <Text style={styles.title}>Продавайте</Text>
          <Text style={styles.subtitle}>Теперь вы можете выставить товар на продажу</Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("AddProductScreen")}
          >
            <Text style={styles.loginButtonText}>Выставить товар на продажу</Text>
          </TouchableOpacity>

          {pendingProducts.length > 0 && (
            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>На проверке:</Text>
              {pendingProducts.map((item) => (
                <Text key={item.id} style={styles.featureText}>
                  • {item.title} — ожидает подтверждения
                </Text>
              ))}
            </View>
          )}
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Text style={styles.title}>Панель администратора</Text>
          <Text style={styles.subtitle}>Вы можете выдавать роли, управлять пользователями и следить за продавцами</Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate("UserManagementScreen")}
          >
            <Text style={styles.manageButtonText}>Управление пользователями</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate("ProductModerationScreen")}
          >
            <Text style={styles.manageButtonText}>Модерация объявлений</Text>
          </TouchableOpacity>
        </>
      );
    }

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
