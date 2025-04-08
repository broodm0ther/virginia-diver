// 📦 Компонент UserAvatar.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const UserAvatar = ({ avatar, username, size = 130 }) => {
  if (avatar) {
    return <Image source={{ uri: avatar }} style={{ ...styles.avatar, width: size, height: size, borderRadius: size / 2 }} />;
  }

  const initials = username?.slice(0, 2).toUpperCase() || "??";
  return (
    <View style={{ ...styles.placeholder, width: size, height: size, borderRadius: size / 2 }}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 15,
  },
  placeholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  initials: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
});

export default UserAvatar;
