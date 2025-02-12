import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

const messages = [
  { id: "1", name: "Иван Иванов", lastMessage: "Привет, как дела?", time: "14:30", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Алексей Смирнов", lastMessage: "Отправил фото.", time: "13:10", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "3", name: "Мария Козлова", lastMessage: "Спасибо!", time: "10:45", avatar: "https://randomuser.me/api/portraits/women/3.jpg" }
];

const MessagesScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions(); // 📌 Получаем высоту экрана

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageContainer} onPress={() => navigation.navigate("Chat", { userName: item.name })}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { minHeight: height }]}>
      <FlatList 
        data={messages} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled" // 📌 Фикс скролла на iPhone
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10, // 📌 Фикс бага с вылетом вверх на iPhone 13 Mini
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
  time: {
    fontSize: 12,
    color: "gray",
  },
});

export default MessagesScreen;
