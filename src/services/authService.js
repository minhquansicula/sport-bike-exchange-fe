import api from "../config/api";

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    // Trả về toàn bộ data để bên Context xử lý
    return response.data;
  },

  register: async (userData) => {
    // userData gồm: username, password, fullName, email, phone...
    const response = await api.post("/users", userData);
    return response.data;
  },

  requestMagicLink: async (email) => {
    const response = await api.post(
      `/auth/request-magic-link?email=${encodeURIComponent(email)}`,
    );
    return response.data; // Đã thêm .data
  },

  verifyMagicLink: async (token) => {
    const response = await api.post(
      `/auth/verify-magic-link?token=${encodeURIComponent(token)}`,
    );
    return response.data; // Đã thêm .data
  },
};
