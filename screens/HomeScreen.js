// 📁 screens/HomeScreen.js
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApprovedProducts().finally(() => setRefreshing(false));
  }, []);


  const fetchApprovedProducts = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}`} : {};
      const res = await fetch("http://192.168.1.15:8080/api/products/approved", { headers });
      const data = await res.json();

      if (res.ok) {
        const parsed = data.products.map((p) => ({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
        }));
        setProducts(parsed);
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProducts();
  }, [token]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setDeleteReason("");
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteReason.trim()) {
      Alert.alert("Ошибка", "Укажите причину удаления");
      return;
    }

    try {
      const res = await fetch(`http://192.168.1.15:8080/api/products/delete/${selectedProductId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Успех", "Объявление удалено");
        fetchApprovedProducts();
        setModalVisible(false);
      } else {
        Alert.alert("Ошибка", data.error || "Ошибка удаления");
      }
    } catch (err) {
      Alert.alert("Ошибка", "Ошибка запроса");
    }
  };

  const renderItem = ({ item }) => {
    const firstImage = item.images?.[0] || "";
    const isFav = favorites.includes(item.id);
    const author = item.user?.username || "Автор неизвестен";

    return (
      <View style={styles.card}>
        {user?.role === "admin" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => openDeleteModal(item.id)}
          >
            <Icon name="trash" size={16} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteIcon}>
          {isFav ? (
            <Image source={require("../assets/heart_filled.png")} style={{ width: 20, height: 20 }} />
          ) : (
            <Icon name="heart" size={18} color="#bbb" />
          )}
        </TouchableOpacity>

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
          <Text style={styles.author}>{author}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>amazonica project</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.container, { paddingTop: 12 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Удалить товар</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Укажите причину удаления"
              value={deleteReason}
              onChangeText={setDeleteReason}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setDeleteReason("");
                }}
                style={styles.cancelButton}
              >
                <Text style={{ color: "#000" }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.confirmButton}>
                <Text style={{ color: "white" }}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  logoBox: {
    paddingTop: 65,
    paddingBottom: 10,
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoText: {
    fontFamily: "MomTypewriter",
    fontSize: 26,
    color: "#222",
  },
  container: {
    padding: 10,
    paddingTop: 0,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: (width - 30) / 2,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
    color: "#111",
  },
  author: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    marginTop: 4,
  },
  favoriteIcon: {
    position: "absolute",
    zIndex: 5,
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "red",
    padding: 6,
    borderRadius: 20,
    zIndex: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
});

export default HomeScreen;
