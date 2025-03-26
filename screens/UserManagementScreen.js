import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const UserManagementScreen = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const result = data.users.filter((u) => u.id !== user.id && u.role !== "admin");
        setUsers(result);
        setFilteredUsers(result);
      } else {
        Alert.alert("Ошибка", data.error || "Не удалось получить список");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "seller" ? "registered" : "seller";
    setUpdatingId(userId);

    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/set-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });
      const data = await response.json();

      if (response.ok) {
        fetchUsers();
      } else {
        Alert.alert("Ошибка", data.error || "Не удалось обновить роль");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка сети");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = users.filter((u) =>
      u.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <View>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => toggleRole(item.id, item.role)}
        disabled={updatingId === item.id}
      >
        {updatingId === item.id ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {item.role === "seller" ? "Снять статус" : "Выдать статус"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Иконка выхода */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Icon name="x" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Управление пользователями</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по нику..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  list: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "gray",
  },
  toggleButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    minWidth: 110,
    maxWidth: 140,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

export default UserManagementScreen;
