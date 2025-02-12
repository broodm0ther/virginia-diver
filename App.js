import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ChatScreen from "./screens/ChatScreen"; 
import SellScreen from "./screens/SellScreen";
import SearchScreen from "./screens/SearchScreen"; // ✅ Добавлен экран поиска!
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔐 Экран-заглушка для неавторизованных пользователей
const AuthRequiredScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.authRequiredContainer}>
      <Text style={styles.authText}>Войдите, чтобы посмотреть этот раздел</Text>
      <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.authButtonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔻 Вкладки нижней навигации
const MainTabs = () => {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Главная"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontSize: 10 },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Главная") iconName = "home";
          else if (route.name === "Поиск") iconName = "search";  
          else if (route.name === "Продать") iconName = "plus-circle";
          else if (route.name === "Сообщения") iconName = "message-square";
          else if (route.name === "Профиль") iconName = "user";
          return <Icon name={iconName} size={24} color={focused ? "black" : "gray"} />;
        },
      })}
    >
      <Tab.Screen name="Главная" component={user ? HomeScreen : AuthRequiredScreen} />
      <Tab.Screen name="Поиск" component={SearchScreen} />
      <Tab.Screen name="Продать" component={SellScreen} />
      <Tab.Screen name="Сообщения" component={user ? MessagesScreen : AuthRequiredScreen} />
      <Tab.Screen name="Профиль" component={user ? ProfileScreen : AuthRequiredScreen} />
    </Tab.Navigator>
  );
};

// 📌 Главная навигация
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// 🎨 Стили
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    height: 76,
    borderTopWidth: 0,
    elevation: 5,
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  authText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  authButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
