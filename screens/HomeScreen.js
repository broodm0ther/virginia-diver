import React, { useEffect, useState, useContext } from "react";
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, Dimensions
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    MomTypewriter: require("../assets/fonts/MomTypewriter.ttf"),
  });

  const fetchApprovedProducts = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch("http://192.168.1.15:8080/api/products/approved", {
        headers,
      });

      const data = await res.json();
      if (res.ok) {
        const parsed = data.products.map(p => ({
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

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>amazonica project</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoBox: {
    paddingTop: 55,
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
});

export default HomeScreen;
