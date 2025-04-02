// ✅ MessagesScreen с lastMessage для каждого собеседника
import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";

const MessagesScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { height } = useWindowDimensions();
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;

    const fetchPartners = async () => {
      try {
        const response = await fetch(`http://192.168.1.15:8080/api/public/chat-partners?user=${user.username}`);
        const data = await response.json();

        const withMessages = await Promise.all(
          data.map(async (partner) => {
            const roomId = [user.username, partner.username].sort().join("_");
            try {
              const res = await fetch(`http://192.168.1.15:8080/api/chat/history/${roomId}?user=${user.username}`);
              const history = await res.json();
              const lastMessage = Array.isArray(history) ? history[history.length - 1]?.text || "" : "";
              return { ...partner, lastMessage };
            } catch (err) {
              return { ...partner, lastMessage: "" };
            }
          })
        );

        setPartners(withMessages);
      } catch (err) {
        console.error("❌ Ошибка загрузки партнёров:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() =>
        navigation.navigate("Chat", {
          targetUserName: item.username,
        })
      }
      
    >
      <Image source={{ uri: `http://192.168.1.15:8080${item.avatar}` }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || "Начните диалог"}</Text>
      </View>
    </TouchableOpacity>
  );

  const filtered = partners.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { minHeight: height }]}> 
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск собеседника..."
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : filtered.length === 0 ? (
        <Text style={styles.empty}>Вы никому не отправляли сообщений</Text>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
  searchInput: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "gray",
  },
});

export default MessagesScreen;
