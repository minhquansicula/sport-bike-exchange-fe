import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

/**
 * Decode JWT payload
 */
const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user từ localStorage khi refresh page
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Login
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const data = response.data;

      if (data?.result?.token) {
        const token = data.result.token;
        localStorage.setItem("token", token);

        // ✅ FIX: LẤY ROLE TỪ JWT THAY VÌ HARDCODE
        const payload = parseJwt(token);
        const role = payload?.scope || "USER";

        const userPayload = {
          username,
          role,
        };

        setUser(userPayload);
        localStorage.setItem("user", JSON.stringify(userPayload));

        setLoading(false);
        return userPayload;
      }

      throw new Error("Login failed");
    } catch (error) {
      setLoading(false);
      throw new Error(
        error.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không đúng",
      );
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /**
   * Update user info (nếu cần)
   */
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
