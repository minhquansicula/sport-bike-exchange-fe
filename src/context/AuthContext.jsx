import React, { createContext, useState, useContext } from "react";

// Đã thêm chữ 'export' để file useAuth.js có thể tìm thấy nó
export const AuthContext = createContext();

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

// Export hook dùng nội bộ (nếu cần), nhưng bạn đang dùng file hook riêng nên dòng này optional
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
