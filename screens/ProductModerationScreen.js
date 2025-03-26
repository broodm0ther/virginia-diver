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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const ProductModerationScreen = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const normalize = (product) => ({
    ...product,
    id: product.id || product.ID,
    images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
  });

  const fetchPendingProducts = async () => {
    try {
      const res = await fetch("http://192.168.1.15:8080/api/products/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const rawList = Array.isArray(data) ? data : data.products;
      const list = rawList.map(normalize);
      setProducts(list);
      setFilteredProducts(list);
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://192.168.1.15:8080/api/products/${action}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (res.ok) {
          fetchPendingProducts();
        } else {
          Alert.alert("Ошибка", data.error || "Не удалось обновить товар");
        }
      } catch (e) {
        console.log("⚠️ Не JSON ответ:", text);
        if (res.ok) {
          fetchPendingProducts();
        } else {
          Alert.alert("Ошибка", "Сервер вернул неожиданный ответ");
        }
      }
    } catch (err) {
      console.log("❌ Ошибка при отправке запроса:", err);
      Alert.alert("Ошибка", "Ошибка сети");
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {item.images?.length > 0 && (
          <Image
            source={{ uri: `http://192.168.1.15:8080${item.images[0]}` }}
            style={styles.image}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.price} ₽ • {item.size} • {item.gender === "male" ? "Мужское" : "Женское"}
          </Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleAction(item.id, "reject")}>
          <Text style={styles.btnText}>Отклонить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleAction(item.id, "approve")}>
          <Text style={styles.btnText}>Одобрить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Icon name="x" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Модерация товаров</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по названию..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredProducts}
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
  productCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  meta: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveBtn: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  rejectBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProductModerationScreen;
