import React, { useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import SellScreen from "./screens/SellScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Экран загрузки (показывается, пока проверяется авторизация)
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="black" />
    <Text>Загрузка...</Text>
  </View>
);

// Основной стек навигации
const MainStack = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />; // ✅ Теперь `App.js` ждёт загрузки пользователя

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

// Стек авторизации
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  </Stack.Navigator>
);

// Основные вкладки с поддержкой выбора активного экрана через `params`
const MainTabs = ({ route }) => (
  <Tab.Navigator
    initialRouteName={route?.params?.screen || "Главная"}
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
    <Tab.Screen name="Главная" component={HomeScreen} />
    <Tab.Screen name="Поиск" component={View} />
    <Tab.Screen name="Продать" component={SellScreen} />
    <Tab.Screen name="Сообщения" component={MessagesScreen} />
    <Tab.Screen name="Профиль" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
});
