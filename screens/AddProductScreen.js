import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const cities = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург",
  "Казань", "Нижний Новгород", "Челябинск", "Самара",
  "Омск", "Ростов-на-Дону", "Уфа", "Красноярск",
  "Пермь", "Воронеж", "Волгоград", "Саратов",
  "Тюмень", "Тольятти", "Ижевск", "Барнаул"
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const AddProductScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Москва");
  const [gender, setGender] = useState("male");
  const [size, setSize] = useState("M");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets].slice(0, 10));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !price.trim() || images.length === 0) {
      Alert.alert("Ошибка", "Заполните все поля и добавьте хотя бы 1 фото");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("gender", gender);
    formData.append("size", size);
    formData.append("category", "clothing");

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        name: `photo${index}.jpg`,
        type: "image/jpeg",
      });
    });

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.15:8080/api/products/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Успешно", "Товар добавлен на проверку", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Ошибка", data.error || "Не удалось добавить товар");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Сервер не отвечает");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="x" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>Добавить товар</Text>

        <TextInput
          style={styles.input}
          placeholder="Название товара"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Описание"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Цена (₽)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Размер (например: M)"
          value={size}
          onChangeText={setSize}
        />

        <TextInput
          style={styles.input}
          placeholder="Пол (male/female)"
          value={gender}
          onChangeText={setGender}
        />

        <TextInput
          style={styles.input}
          placeholder="Город (например: Казань)"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
          <Text style={styles.imageButtonText}>Добавить фото ({images.length}/10)</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={{ marginVertical: 10 }}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: img.uri }}
                style={styles.imageThumb}
              />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
              >
                <Icon name="x" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>


        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Выставить на продажу</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "black",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },  
  imageButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "black",
    paddingVertical: 25,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 50,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddProductScreen;
