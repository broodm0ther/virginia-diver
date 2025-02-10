import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
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

// Стек навигации для авторизации (будет открываться ТОЛЬКО при нажатии)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  </Stack.Navigator>
);

// Обёртка для защищённых страниц (перенаправляет на логин, если нет пользователя)
const ProtectedScreen = ({ component: Component, navigation }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    navigation.navigate("Auth"); // Открываем стек авторизации при попытке зайти на защищённую страницу
    return null;
  }
  return <Component />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// Основные вкладки
const MainTabs = () => (
  <Tab.Navigator
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
    <Tab.Screen name="Сообщения">
      {(props) => <ProtectedScreen {...props} component={MessagesScreen} />}
    </Tab.Screen>
    <Tab.Screen name="Профиль" component={ProfileScreen} />
  </Tab.Navigator>
);

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
});
