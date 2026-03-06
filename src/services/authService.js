// File: src/services/authService.js
import api from "../config/api";

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  loginWithGoogle: async (idToken) => {
    const response = await api.post("/auth/google", { idToken: idToken });
    return response.data;
  },
};
