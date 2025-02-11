import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
          Alert.alert("Ошибка", data.error || "Не удалось загрузить профиль");
        }
      } catch (error) {
        Alert.alert("Ошибка", "Ошибка сети");
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      
      {/* ✅ Проверяем, есть ли userData перед рендерингом */}
      {userData ? (
        <>
          <Text style={styles.info}>👤 Имя пользователя: <Text style={styles.bold}>{userData.username}</Text></Text>
          <Text style={styles.info}>📧 Email: <Text style={styles.bold}>{userData.email}</Text></Text>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.buttonText}>Выйти</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Загрузка...</Text>
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
  bold: {
    fontWeight: "bold",
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
