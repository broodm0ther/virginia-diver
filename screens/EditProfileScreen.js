import React, { useState, useContext, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
  ActivityIndicator, Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfileScreen = () => {
  const { token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username || "");
          setRegion(data.region || "");
          setBio(data.bio || "");
          setAvatar(data.avatar ? `http://192.168.1.15:8080${data.avatar}` : null);
        } else {
          Alert.alert("Ошибка", "Не удалось загрузить профиль");
        }
      } catch (err) {
        Alert.alert("Ошибка", "Не удалось получить данные");
      }
    };
    fetchProfile();
  }, []);

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const pickedUri = result.assets[0].uri;
        const fileName = pickedUri.split("/").pop();
        const newPath = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.copyAsync({ from: pickedUri, to: newPath });
        setAvatar(newPath);
        console.log("✅ Файл скопирован:", newPath);
      }
    } catch (err) {
      console.log("❌ Ошибка выбора аватара:", err);
      Alert.alert("Ошибка", "Не удалось выбрать фото");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Ошибка", "Имя пользователя обязательно");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("region", region);
    formData.append("bio", bio);

    if (avatar && avatar.startsWith("file://")) {
      const fileName = avatar.split("/").pop() || "avatar.jpg";
      const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;

      formData.append("avatar", {
        uri: avatar,
        name: fileName,
        type: mimeType,
      });

      console.log("📦 Файл добавлен:", fileName, mimeType);
    } else {
      console.log("⚠️ avatar не валиден или http:", avatar);
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/update-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const text = await response.text();
      console.log("📬 Ответ сервера:", text);

      const data = JSON.parse(text);

      if (response.ok) {
        Alert.alert("Успешно", "Профиль обновлён");
        navigation.goBack();
      } else {
        Alert.alert("Ошибка", data.error || "Не удалось обновить профиль");
      }
    } catch (err) {
      console.log("❌ Ошибка запроса:", err);
      Alert.alert("Ошибка", "Сервер не отвечает");
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = () => {
    if (avatar) {
      return <Image source={{ uri: avatar }} style={styles.avatar} />;
    } else if (username) {
      return (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>
            {username.slice(0, 2).toUpperCase()}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>??</Text>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>

        <View style={styles.avatarSection}>
          {renderAvatar()}
          <TouchableOpacity onPress={pickAvatar}>
            <Text style={styles.changePhoto}>Изменить фото</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Имя пользователя</Text>
        <TextInput style={styles.input} placeholder="Введите имя" value={username} onChangeText={setUsername} />

        <Text style={styles.label}>Регион</Text>
        <TextInput style={styles.input} placeholder="Ваш регион" value={region} onChangeText={setRegion} />

        <Text style={styles.label}>О себе</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Кратко расскажи о себе" value={bio} onChangeText={setBio} multiline />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Сохранить</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, backgroundColor: "#fff", flexGrow: 1 },
  backButton: { alignSelf: "flex-start", marginBottom: 15 },
  backText: { fontSize: 16, fontWeight: "bold" },
  avatarSection: { alignItems: "center", marginBottom: 25 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  changePhoto: { marginTop: 10, color: "#007bff", fontWeight: "bold" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 50,
  },
  saveText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default EditProfileScreen;
