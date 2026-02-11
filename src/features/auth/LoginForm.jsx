import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Giữ nguyên đường dẫn Context của bạn
// Import Icons
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdLogin,
  MdPerson,
} from "react-icons/md";

const LoginForm = () => {
  // ĐÃ CẬP NHẬT: Khớp với username 'admin' và password '1' từ ApplicationInitConfig ở Backend
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const getRedirectPath = (role) => {
    const roleLower = role ? role.toLowerCase() : "";

    if (roleLower.includes("admin")) return "/admin";
    if (roleLower.includes("inspector")) return "/inspector";
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Gọi hàm login từ AuthContext (hiện tại đã được trỏ vào API thật)
      const user = await login(username, password);

      // Redirect theo role của user - Giữ nguyên logic của bạn
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath);
    } catch (err) {
      console.error("Login Error:", err);
      // Hiển thị lỗi từ Promise reject trong AuthContext hoặc từ API phản hồi
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-200 px-4 py-12 relative overflow-hidden">
      {/* Background Decor - Giữ nguyên thiết kế Blobs của bạn */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-50px] left-[20%] w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white relative z-10">
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-400 hover:text-orange-600 transition-colors"
        >
          <MdArrowBack size={24} />
        </Link>

        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-orange-100 text-orange-600 mb-4 shadow-sm">
            <MdLogin size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Chào mừng trở lại!
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Đăng nhập để vào hệ thống quản trị
          </p>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm flex items-center gap-2 animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
              <MdPerson size={20} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all"
              placeholder="Username hoặc Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
              <MdLock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-bold hover:underline"
          >
            Tạo tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
