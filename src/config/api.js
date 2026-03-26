// import axios from "axios";

// const api = axios.create({
//   // Sử dụng biến môi trường của Vite
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor gắn token (giữ nguyên logic cũ của bạn)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // Hoặc lấy từ nơi bạn lưu
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// export default api;

// src/api/api.js (hoặc file bạn đang dùng)

import axios from "axios";

// ⚠️ Lấy từ ENV (Vercel)
const BASE_URL = import.meta.env.VITE_API_URL;

// Debug để kiểm tra trên production
console.log("🔥 API BASE URL:", BASE_URL);

// ❌ Nếu không có ENV thì báo lỗi luôn (tránh fallback sai)
if (!BASE_URL) {
  throw new Error(
    "❌ VITE_API_URL is not defined. Check your environment variables!",
  );
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // nếu dùng cookie (optional)
});

// Interceptor gắn token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
