import axios from "axios";

const API_URL = "http://localhost:8080/api/auth"; // Убедись, что сервер работает

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Ошибка регистрации" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Ошибка входа" };
  }
};
