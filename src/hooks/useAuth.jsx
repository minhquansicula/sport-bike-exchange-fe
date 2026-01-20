// src/hooks/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../mockData/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user từ localStorage khi F5 lại trang
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm Login trả về kết quả True/False để trang Login biết đường xử lý
  const login = (email, password) => {
    // 1. Tìm user trong danh sách Mock
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    // 2. Kiểm tra kết quả
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return { success: true };
    } else {
      return { success: false, message: "Email hoặc mật khẩu không đúng!" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
