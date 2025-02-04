import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen.js";
import MessagesScreen from "./screens/MessagesScreen.js";
import SellScreen from "./screens/SellScreen";
import Icon from "react-native-vector-icons/Feather";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Убираем заголовок сверху
          tabBarStyle: styles.tabBar, // Стили для Bottom Tabs
          tabBarLabelStyle: { fontSize: 10 }, // Размер текста
          tabBarActiveTintColor: "black", // Цвет активного текста
          tabBarInactiveTintColor: "gray", // Цвет неактивного текста
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === "Главная") {
              iconName = "home";
            } else if (route.name === "Поиск") {
              iconName = "search";
            } else if (route.name === "Продать") {
              iconName = "plus-circle";
            } else if (route.name === "Сообщения") {
              iconName = "message-square";
            } else if (route.name === "Профиль") {
              iconName = "user";
            }
            return <Icon name={iconName} size={24} color={focused ? "black" : "gray"} />;
          },
        })}
      >
        <Tab.Screen name="Главная" component={HomeScreen} />
        <Tab.Screen name="Поиск" component={View} />
        <Tab.Screen name="Продать" component={SellScreen} />
        <Tab.Screen name="Сообщения" component={MessagesScreen} />
        <Tab.Screen name="Профиль" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0, // Поднять Bottom Tabs
    left: 0,
    right: 0,
    backgroundColor: "white", // Цвет фона
    height: 76,
    borderTopWidth: 0,
    elevation: 5,
  },
});
