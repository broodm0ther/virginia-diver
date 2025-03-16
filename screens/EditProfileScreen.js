import React, { useState, useContext, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, Alert, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";
import { useWindowDimensions } from "react-native";

const EditProfileScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const { height } = useWindowDimensions();
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
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
      } catch (error) {
        console.error("Ошибка получения профиля:", error);
      }
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ошибка", "Доступ к галерее запрещен. Разрешите его в настройках.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Ошибка", "Имя пользователя обязательно!");
      return;
    }
  
    setLoading(true);
    console.log("📤 Начинаем отправку данных...");

    try {
      let formData = new FormData();
      formData.append("username", username);
      formData.append("region", region);
      formData.append("bio", bio);
  
      if (avatar) {
        let filename = avatar.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type,
        });
      }

      console.log("📤 Данные для отправки:", formData);
  
      const response = await fetch("http://192.168.1.15:8080/api/auth/update-profile", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      console.log("🔍 Ждём ответ от сервера...");
  
      const responseText = await response.text();
      console.log("🔍 Ответ сервера:", responseText);
  
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          Alert.alert("Успех", "Профиль успешно обновлен!");
          navigation.goBack();
        } else {
          Alert.alert("Ошибка", data.error || "Не удалось обновить профиль");
        }
      } catch (jsonError) {
        console.error("❌ Ошибка парсинга JSON:", jsonError);
        Alert.alert("Ошибка", "Сервер вернул некорректный ответ.");
      }
    } catch (error) {
      console.error("❌ Ошибка запроса:", error);
      Alert.alert("Ошибка", "Ошибка сети.");
    } finally {
      console.log("⏹ Останавливаем загрузку...");
      setLoading(false);
    }
};


  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, { minHeight: height * 0.9 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image source={{ uri: avatar || "https://placehold.co/100" }} style={styles.avatar} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Region</Text>
        <TextInput
          style={styles.input}
          value={region}
          onChangeText={setRegion}
          placeholder="Your region"
        />

        <Text style={styles.label}>Biography</Text>
        <TextInput 
          style={[styles.input, styles.bioInput]} 
          value={bio} 
          onChangeText={setBio} 
          placeholder="Tell us about yourself"
          multiline
        />

        <TouchableOpacity style={[styles.saveButton, !username.trim() && styles.disabledButton]} onPress={handleSave}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>SAVE</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ✅ **Стили для экрана**
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  changePhotoText: {
    color: "blue",
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  bioInput: {
    height: 80,
  },
  saveButton: {
    backgroundColor: "blue",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
