import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";

const ProfileScreen = ({ navigation }) => {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (error) {
        console.error("Ошибка профиля:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔝 Иконки настроек и шэринга */}
        <View style={styles.topRightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="settings" size={22} color="black" />
          </TouchableOpacity>
        </View>

        {/* 👤 Аватар и имя */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData?.avatar || "https://placehold.co/150" }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{userData?.username || "User"}</Text>
          <Text style={styles.email}>{userData?.email || ""}</Text>
        </View>

        {/* ✏️ Кнопка редактирования */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* 📊 Рейтинг, отзывы, сделки */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⭐ {userData?.rating || "0.0"}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userData?.reviews || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userData?.transactions || 0}</Text>
            <Text style={styles.statLabel}>Deals</Text>
          </View>
        </View>

        {/* 🤝 Подписчики и подписки */}
        <View style={styles.followContainer}>
          <TouchableOpacity style={styles.followBox}>
            <Icon name="users" size={18} color="black" />
            <Text style={styles.followText}>{userData?.followers || 0} Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followBox}>
            <Icon name="user-check" size={18} color="black" />
            <Text style={styles.followText}>{userData?.following || 0} Following</Text>
          </TouchableOpacity>
        </View>

        {/* 🔴 Кнопка выхода */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="log-out" size={16} color="white" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRightIcons: {
    flexDirection: "row",
    position: "absolute",
    right: 20,
    top: 2,
    gap: 15,
    zIndex: 2,
  },
  iconButton: {
    padding: 6,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  editButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginBottom: 25,
  },
  editText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  followBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  followText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ProfileScreen;
