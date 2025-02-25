import React, { useContext, useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Добавлено
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";

const ProfileScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
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
        {/* 🔵 Верхняя часть профиля */}
        <View style={styles.header}>
          <Image source={{ uri: userData?.avatar || "https://placehold.co/100" }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userData?.username || "User"}</Text>
            <Text style={styles.transactions}>{userData?.transactions || 0} Transactions</Text>
          </View>

          {/* Настройки и шэринг */}
          <View style={styles.icons}>
            <TouchableOpacity>
              <Icon name="share" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="settings" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔵 Рейтинг, подписки и подписчики */}
        <View style={styles.stats}>
          <Text>⭐ {userData?.rating || "0.0"} ({userData?.reviews || 0} Reviews)</Text>
          <Text>{userData?.following || 0} Following</Text>
          <Text>{userData?.followers || 0} Followers</Text>
        </View>

        {/* 🔵 Кнопка редактирования профиля */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* 🔵 Топ бренды */}
        <Text style={styles.sectionTitle}>Top Designers</Text>
        <View style={styles.brands}>
          {["IF SIX WAS NINE", "NUMBER (N)INE", "LE GRANDE BLEU (L.G.B.)"].map((brand, index) => (
            <TouchableOpacity key={index} style={styles.brandButton}>
              <Text>{brand}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔵 Навигация по профилю */}
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.activeTab}><Text>SELLING</Text></TouchableOpacity>
          <TouchableOpacity><Text>FAVORITES</Text></TouchableOpacity>
          <TouchableOpacity><Text>🔒 SAVED</Text></TouchableOpacity>
          <TouchableOpacity><Text>🔒 CLOSET</Text></TouchableOpacity>
        </View>

        {/* 🔵 Список товаров (заглушка) */}
        <Text style={styles.emptyMessage}>You don't have any listings for sale.</Text>
        <Text style={styles.sellHint}>Go to the 💲 Sell tab to get started.</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { // ✅ Добавлено
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20, // ✅ Исправлено
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactions: {
    fontSize: 12,
    color: "gray",
  },
  icons: {
    flexDirection: "row",
    gap: 15,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  brands: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  brandButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "black",
    paddingBottom: 5,
  },
  emptyMessage: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sellHint: {
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ProfileScreen;
