// ✅ ChatScreen.js (обновлён с защитой истории)
import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const ChatScreen = ({ route }) => {
  const { targetUserName } = route.params;
  const { user } = useContext(AuthContext);
  const userName = user?.username || "anonymous";


  const roomId = [userName, targetUserName].sort().join("_");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const { height } = useWindowDimensions();
  const ws = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://192.168.1.15:8080/api/chat/history/${roomId}?user=${userName}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.warn("⚠️ История не является массивом:", data);
        }
      } catch (error) {
        console.error("Ошибка загрузки истории:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.1.15:8080/ws/chat?room=${roomId}&user=${userName}`);

    ws.current.onopen = () => {
      console.log("✅ WebSocket подключен");
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.current.onerror = (e) => {
      console.error("❌ Ошибка WebSocket:", e.message);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket отключен");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(inputText.trim());
      setInputText("");
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.user === userName;
    return (
      <View
        style={[styles.message, isUser ? styles.userMessage : styles.otherMessage]}
      >
        <Text style={styles.messageUser}>{isUser ? "Вы" : item.user}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { minHeight: height }]}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>Чат с {targetUserName}</Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите сообщение..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Отправить</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  message: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageUser: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0084ff",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChatScreen;
