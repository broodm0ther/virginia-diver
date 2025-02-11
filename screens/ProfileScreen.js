import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // ✅ Гарантируем, что токен загружен
        if (!token) {
          Alert.alert("Ошибка", "Токен отсутствует. Попробуйте войти снова.");
          return;
        }

        const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          Alert.alert("Ошибка", data.error || "Ошибка загрузки профиля.");
        }
      } catch (error) {
        Alert.alert("Ошибка", "Ошибка сети");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      {userData ? (
        <>
          <Text style={styles.info}>👤 Имя пользователя: {userData.username}</Text>
          <Text style={styles.info}>📧 Email: {userData.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.buttonText}>Выйти</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Ошибка загрузки профиля.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
