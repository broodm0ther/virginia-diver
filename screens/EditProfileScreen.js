import React, { useState, useContext, useEffect, useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, Alert, ActivityIndicator, Keyboard 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";
import { useWindowDimensions } from "react-native";

const EditProfileScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const { height } = useWindowDimensions(); // 🔹 Адаптивность под айфоны
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Рефы для фокусировки на следующее поле при нажатии Enter
  const regionRef = useRef(null);
  const bioRef = useRef(null);
  const saveButtonRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
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

  // ✅ Открытие галереи
  const pickImage = async () => {
    console.log("📸 Запрос разрешений...");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Ошибка", "Доступ к галерее запрещен. Разрешите его в настройках.");
      return;
    }

    console.log("✅ Разрешения даны. Открываем галерею...");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("✅ Фото выбрано:", result.assets[0].uri);
      setAvatar(result.assets[0].uri);
    }
  };

  // ✅ Сохранение профиля (только если username не пустой)
  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Ошибка", "Имя пользователя обязательно!");
      return;
    }
  
    setLoading(true);
  
    try {
      let formData = new FormData();
      formData.append("username", username);
      formData.append("region", region);
      formData.append("bio", bio);
  
      if (avatar) {
        let filename = avatar.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
  
        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type,
        });
      }
  
      console.log("📤 Отправка данных на сервер...", formData);
  
      const response = await fetch("http://192.168.1.15:8080/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // ❌ НЕ ДОБАВЛЯЕМ "Content-Type" вручную!
        },
        body: formData,
      });
  
      const responseText = await response.text(); // ✅ Читаем ответ как текст
      console.log("🔍 Ответ сервера:", responseText);
  
      try {
        const data = JSON.parse(responseText); // ✅ Пробуем распарсить JSON
        if (response.ok) {
          Alert.alert("Успех", "Профиль успешно обновлен!");
          navigation.goBack();
        } else {
          Alert.alert("Ошибка", data.error || "Не удалось обновить профиль");
        }
      } catch (jsonError) {
        console.error("❌ Ошибка парсинга JSON:", jsonError);
        Alert.alert("Ошибка", "Сервер вернул некорректный ответ. Проверьте бэкенд.");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка сети. Проверьте подключение к интернету.");
      console.error("Ошибка обновления профиля:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, { minHeight: height * 0.9 }]}>
        
        {/* Назад */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Edit Profile</Text>
        </TouchableOpacity>

        {/* Аватарка */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image source={{ uri: avatar || "https://placehold.co/100" }} style={styles.avatar} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        {/* Поля ввода */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
          returnKeyType="next"
          onSubmitEditing={() => regionRef.current?.focus()} // ➡️ Переключение на Region
        />

        <Text style={styles.label}>Region</Text>
        <TextInput
          ref={regionRef}
          style={styles.input}
          value={region}
          onChangeText={setRegion}
          placeholder="Your region"
          returnKeyType="next"
          onSubmitEditing={() => bioRef.current?.focus()} // ➡️ Переключение на Bio
        />

        <Text style={styles.label}>Biography</Text>
        <TextInput 
          ref={bioRef}
          style={[styles.input, styles.bioInput]} 
          value={bio} 
          onChangeText={setBio} 
          placeholder="Tell us about yourself"
          multiline
          returnKeyType="done"
          onSubmitEditing={() => saveButtonRef.current?.focus()} // ➡️ Переключение на кнопку SAVE
        />

        {/* Кнопка сохранения (всегда активна, но проверяет username) */}
        <TouchableOpacity
          ref={saveButtonRef}
          style={[styles.saveButton, !username.trim() && styles.disabledButton]} 
          onPress={handleSave}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>SAVE</Text>}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

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
