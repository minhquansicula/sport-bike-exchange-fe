import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Proxy Vite sẽ lo phần chuyển hướng
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn Token vào Header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
