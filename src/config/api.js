import axios from "axios";

const api = axios.create({
  // Sử dụng biến môi trường của Vite
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor gắn token (giữ nguyên logic cũ của bạn)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc lấy từ nơi bạn lưu
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
