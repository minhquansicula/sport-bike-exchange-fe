import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Dùng thư viện chuẩn để không lỗi font chữ
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm check xem token còn hạn dùng không
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime; // True nếu còn hạn
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      // Logic mới: Chỉ set user nếu token còn hạn
      if (isTokenValid(token)) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token hết hạn thì logout luôn cho sạch
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Gọi qua service
      const data = await authService.login(username, password);

      if (data?.result?.token) {
        const token = data.result.token;

        // Giải mã token an toàn
        const decoded = jwtDecode(token);

        // Tạo object user từ token (đảm bảo đúng field backend trả về)
        const userPayload = {
          username: username,
          role: decoded.scope || "USER", // Lấy role từ token
          ...decoded, // Lưu thêm các thông tin khác nếu cần
        };

        // Lưu vào Storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userPayload));

        // Cập nhật State
        setUser(userPayload);
        setLoading(false);
        return userPayload;
      }

      throw new Error("Không nhận được token");
    } catch (error) {
      setLoading(false);
      throw error; // Ném lỗi ra để LoginForm hiển thị
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
