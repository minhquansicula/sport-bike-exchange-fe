import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../mockData/users";

// 👇 THÊM TỪ KHÓA 'export' VÀO ĐÂY
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password,
        );

        if (foundUser) {
          const { password, ...userWithoutPass } = foundUser;
          setUser(userWithoutPass);
          localStorage.setItem("user", JSON.stringify(userWithoutPass));
          setLoading(false);
          resolve(userWithoutPass);
        } else {
          setLoading(false);
          reject(new Error("Email hoặc mật khẩu không chính xác!"));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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

// Nếu bạn đã có file 'src/hooks/useAuth.js' riêng thì dòng dưới đây trong file này là thừa,
// nhưng để lại cũng không sao.
export const useAuth = () => useContext(AuthContext);
