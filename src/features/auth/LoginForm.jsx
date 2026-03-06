import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // THÊM IMPORT NÀY
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdLogin,
  MdPerson,
} from "react-icons/md";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // setSession không có trong context của bạn nên ta bỏ đi
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const getRedirectPath = (role) => {
    const roleLower = role ? role.toLowerCase() : "";
    if (roleLower.includes("admin")) return "/admin";
    if (roleLower.includes("inspector")) return "/inspector";
    return "/";
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(usernameOrEmail, password);
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath);
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không đúng.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-200 px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
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
            Đăng nhập để vào hệ thống
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm flex items-center gap-2 animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
              <MdPerson size={20} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all"
              placeholder="Username hoặc Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
              <MdLock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
            <button
              type="button"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline bg-transparent border-none cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <div className="flex justify-center w-full mt-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError("");
              setIsLoading(true);
              try {
                const idToken = credentialResponse.credential;
                const response = await authService.loginWithGoogle(idToken);

                // Lấy Token từ kết quả trả về
                const systemToken = response.result?.token;

                if (systemToken) {
                  // GIẢI MÃ TOKEN ĐỂ LƯU USER Y HỆT HÀM LOGIN BẰNG PASSWORD
                  const decoded = jwtDecode(systemToken);
                  const userPayload = {
                    username: decoded.sub || "",
                    role: decoded.scope || decoded.role || "USER",
                    avatar: decoded.avatar || "",
                    fullName: decoded.FullName || "",
                    ...decoded,
                  };

                  // Bắt buộc phải lưu cả 2 cái này thì AuthContext mới hiểu là đã đăng nhập
                  localStorage.setItem("token", systemToken);
                  localStorage.setItem("user", JSON.stringify(userPayload));

                  // Ép tải lại trang để Header cập nhật Avatar
                  window.location.href = "/";
                } else {
                  throw new Error("Không lấy được token từ hệ thống");
                }
              } catch (err) {
                console.error("Google Login Error:", err);
                setError("Xác thực Google thất bại trên hệ thống.");
              } finally {
                setIsLoading(false);
              }
            }}
            onError={() => {
              setError("Đăng nhập Google bị hủy hoặc thất bại.");
            }}
            width="350"
            shape="pill"
            theme="outline"
            size="large"
            text="signin_with"
          />
        </div>

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
