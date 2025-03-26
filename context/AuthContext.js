import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          const response = await fetch("http://192.168.1.15:8080/api/auth/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const data = await response.json();
          if (response.ok) {
            setUser(data);
            console.log("✅ Пользователь загружен:", data);
          } else {
            console.log("🔴 Ошибка загрузки профиля, удаляем токен...");
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
  
        // ✅ Запрашиваем профиль пользователя заново
        const profileResponse = await fetch("http://192.168.1.15:8080/api/auth/profile", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
  
        const profile = await profileResponse.json();
        if (profileResponse.ok) {
          setUser(profile);
          console.log("✅ Пользователь после логина:", profile);
        } else {
          console.log("❌ Ошибка получения профиля после логина");
        }
      } else {
        console.error("❌ Ошибка авторизации:", data.error);
      }
      return data;
    } catch (error) {
      console.error("❌ Ошибка при входе:", error);
    }
  };
  
  

  const logout = async () => {
    console.log("🔴 Выход из системы...");
    setLoading(true);
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
