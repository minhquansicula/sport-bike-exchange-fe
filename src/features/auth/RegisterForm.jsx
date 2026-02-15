import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService"; // Import service
// Import Icons
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdArrowBack,
  MdAppRegistration,
  MdVisibility,
  MdVisibilityOff,
  MdPhone, // Thêm icon điện thoại
} from "react-icons/md";

const RegisterForm = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Chuẩn bị dữ liệu gửi lên (loại bỏ confirmPassword)
      const dataToSend = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      };

      // 3. Gọi API
      await authService.register(dataToSend);

      // 4. Thành công -> Chuyển hướng
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      // Xử lý lỗi từ Backend trả về
      console.error("Register Error:", err);
      const msg =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-50px] right-[-50px] w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white relative z-10">
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <MdArrowBack size={24} />
        </Link>

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
            <MdAppRegistration size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Tạo Tài Khoản
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Tham gia cộng đồng OldBike ngay hôm nay
          </p>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdPerson size={20} />
            </div>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Tên đăng nhập (Username)"
            />
          </div>

          {/* Full Name */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdPerson size={20} />
            </div>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Họ và tên đầy đủ"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdEmail size={20} />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Địa chỉ Email"
            />
          </div>

          {/* Phone (Thêm field này vì Backend UserCreationRequest có field phone) */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdPhone size={20} />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Số điện thoại"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdLock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Mật khẩu (Tối thiểu 6 ký tự)"
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

          {/* Confirm Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdLock size={20} />
            </div>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Xác nhận mật khẩu"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
