import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import UserAvatar from "../components/UserAvatar";
import { ScrollView } from "react-native-gesture-handler";

const ProfileScreen = ({ navigation }) => {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 🔝 Иконки */}
        <View style={styles.topRightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="settings" size={22} color="black" />
          </TouchableOpacity>
        </View>

        {/* 👤 Аватар, имя, email */}
        <View style={styles.profileHeader}>
          <UserAvatar avatarUri={userData?.avatar} username={userData?.username} size={130} />
          <Text style={styles.username}>{userData?.username || "User"}</Text>
          <Text style={styles.email}>{userData?.email || ""}</Text>
        </View>

        {/* 🔘 Кнопки: Edit, Избранное, Доставка */}
        <View style={styles.horizontalActions}>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => navigation.navigate("FavoritesScreen")}
          >
            <Text style={styles.actionText}>Избранное</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => navigation.navigate("ComingSoonScreen")}
          >
            <Text style={styles.actionText}>Доставка</Text>
          </TouchableOpacity>
        </View>

        {/* 📊 Рейтинг и прочее */}
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

        {/* 🤝 Подписчики */}
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

        {/* 🔴 Logout */}
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
    top: 10,
    gap: 15,
    zIndex: 2,
  },
  iconButton: {
    padding: 6,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  horizontalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 25,
    width: "100%",
  },
  horizontalButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
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
