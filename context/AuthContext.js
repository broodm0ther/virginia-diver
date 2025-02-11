import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Загружаем токен при запуске
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${storedToken}` },
          });

          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            await AsyncStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // ✅ Логин теперь обновляет состояние мгновенно
  const login = async (email, password) => {
    try {
      const response = await fetch("http://192.168.1.15:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user); // ✅ Теперь `user` обновляется сразу
      }
      return data;
    } catch (error) {
      console.error("Ошибка при входе:", error);
    }
  };

  // ✅ Выход из аккаунта
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
