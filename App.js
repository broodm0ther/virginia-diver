import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
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
import Modal from "react-native-modal";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="black" />
    <Text>Загрузка...</Text>
  </View>
);

const MainStack = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

// Модальное окно логина с логами
const AuthModal = ({ isVisible, onClose }) => {
  console.log("🔵 AuthModal рендерится, isVisible:", isVisible);

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <LoginScreen onClose={onClose} />
      </View>
    </Modal>
  );
};

// Экран-заглушка для заблокированных вкладок
const AuthRequiredScreen = ({ onLoginPress }) => (
  <View style={styles.authRequiredContainer}>
    <Text style={styles.authText}>Войдите, чтобы посмотреть этот раздел</Text>
    <TouchableOpacity style={styles.authButton} onPress={onLoginPress}>
      <Text style={styles.authButtonText}>Войти</Text>
    </TouchableOpacity>
  </View>
);

const MainTabs = () => {
  const { user } = useContext(AuthContext);
  const [isLoginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    console.log("🟡 MainTabs рендерится, isLoginVisible:", isLoginVisible);
  }, [isLoginVisible]);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Поиск"
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
        <Tab.Screen name="Поиск" component={MessagesScreen} />
        <Tab.Screen name="Продать" component={SellScreen} />
        <Tab.Screen
          name="Сообщения"
          component={user ? MessagesScreen : () => <AuthRequiredScreen onLoginPress={() => setLoginVisible(true)} />}
        />
        <Tab.Screen
          name="Профиль"
          component={user ? ProfileScreen : () => <AuthRequiredScreen onLoginPress={() => setLoginVisible(true)} />}
        />
      </Tab.Navigator>

      {/* Модальное окно логина */}
      <AuthModal isVisible={isLoginVisible} onClose={() => setLoginVisible(false)} />
    </>
  );
};

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
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
