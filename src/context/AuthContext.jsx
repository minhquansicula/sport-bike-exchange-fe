import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api"; //

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giữ nguyên logic kiểm tra user khi F5
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Kiểm tra thêm token

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sửa logic login để gọi API thật nhưng giữ nguyên cấu trúc async/await
  const login = async (username, password) => {
    setLoading(true);
    try {
      // Gọi đúng endpoint /auth/login của Backend
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const data = response.data; // Cấu trúc ApiResponse từ Backend

      if (data.result && data.result.token) {
        // 1. Lưu Token để các request sau tự động đính kèm Bearer
        localStorage.setItem("token", data.result.token);

        // 2. Tạo payload user (vì login trả về token, ta map role để điều hướng)
        // Backend mặc định admin là user đầu tiên
        const userPayload = { username, role: "ADMIN" };

        setUser(userPayload);
        localStorage.setItem("user", JSON.stringify(userPayload));

        setLoading(false);
        return userPayload;
      }
    } catch (error) {
      setLoading(false);
      // Giữ nguyên cách bạn ném lỗi để LoginForm bắt được
      throw new Error(
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác!",
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Xóa cả token khi đăng xuất
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {/* Giữ nguyên logic render children không đợi loading để tránh màn hình trắng */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
