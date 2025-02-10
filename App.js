import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import { AuthProvider } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import SellScreen from "./screens/SellScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Sell" component={SellScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: { fontSize: 10 },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
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
          <Tab.Screen name="Продать" component={AuthStack} />
          <Tab.Screen name="Сообщения" component={MessagesScreen} />
          <Tab.Screen name="Профиль" component={ProfileScreen} />
        </Tab.Navigator>
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
});
