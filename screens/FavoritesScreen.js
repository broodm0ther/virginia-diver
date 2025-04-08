import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, Image, StyleSheet, TouchableOpacity,
  Dimensions, RefreshControl, ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { token, user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://192.168.1.15:8080/api/products/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const parsed = data.products.map(p => ({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
        }));
        setFavorites(parsed);
      }
    } catch (err) {
      console.error("Ошибка загрузки избранных:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
  }, []);

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
          <Text numberOfLines={1} style={styles.title}>{item.title?.toUpperCase()}</Text>
          <Text numberOfLines={2} style={styles.subtitle}>{item.description}</Text>
          <Text style={styles.price}>{item.price}₽</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Избранное</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="x" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="heart" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Нет избранных товаров</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: -30,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    
  },
  closeButton: {
    padding: 6,
  },
  container: {
    padding: 10,
    paddingTop: 10,
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
    fontWeight: "600",
    color: "#222",
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
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default FavoritesScreen;
