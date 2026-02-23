import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      if (isTokenValid(token)) {
        setUser(JSON.parse(storedUser));
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);

      if (data?.result?.token) {
        const token = data.result.token;
        const decoded = jwtDecode(token);

        // Đảm bảo lấy rõ ràng avatar và fullName từ Token Backend gửi về
        const userPayload = {
          username: username,
          role: decoded.scope || "USER",
          avatar: decoded.avatar || "",
          fullName: decoded.FullName || "",
          ...decoded,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userPayload));

        setUser(userPayload);
        setLoading(false);
        return userPayload;
      }

      throw new Error("Không nhận được token");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
