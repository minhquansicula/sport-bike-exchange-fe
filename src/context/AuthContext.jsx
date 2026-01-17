// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// 1. Tạo Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 2. Hook quan trọng để các trang khác dùng
export const useAuth = () => {
  return useContext(AuthContext);
};
