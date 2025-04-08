import React, { useState, useEffect, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, FlatList, Image, Dimensions, Keyboard
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert("Ошибка", "Введите запрос для поиска!");
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch("http://192.168.1.15:8080/api/products/approved", { headers });
      const data = await res.json();

      if (res.ok) {
        const filtered = data.products.filter((p) =>
          (p.title + p.description).toLowerCase().includes(query.toLowerCase())
        );
        const parsed = filtered.map((p) => ({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
        }));
        setResults(parsed);
      } else {
        Alert.alert("Ошибка", "Не удалось получить объявления");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const renderItem = ({ item }) => {
    const firstImage = item.images?.[0] || "";
    return (
      <View style={styles.card}>
        {firstImage ? (
          <Image source={{ uri: `http://192.168.1.15:8080${firstImage}` }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>Нет фото</Text>
          </View>
        )}
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.subtitle}>{item.description}</Text>
          <Text style={styles.price}>{item.price}₽</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top - 30 }]}>
      <Text style={styles.titleHeader}>Поиск</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Введите запрос..."
          value={query}
          onChangeText={setQuery}
        />
        {results.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Искать</Text>
      </TouchableOpacity>

      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={1}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  titleHeader: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  clearButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  clearText: {
    color: "#333",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  noImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#aaa",
    fontSize: 12,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
    color: "#111",
  },
});

export default SearchScreen;
