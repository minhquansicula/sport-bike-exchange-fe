import React, { useState } from "react";
import { Link } from "react-router-dom";
// Import Icons
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdArrowBack,
  MdAppRegistration,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 relative overflow-hidden">
      {/* Hình trang trí nền khác màu một chút để phân biệt */}
      <div className="absolute top-[-50px] right-[-50px] w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white relative z-10">
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <MdArrowBack size={24} />
        </Link>

        <div className="text-center mb-8">
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

        <form className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdPerson size={20} />
            </div>
            <input
              type="text"
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Địa chỉ Email"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <MdLock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Mật khẩu"
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Xác nhận mật khẩu"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2"
          >
            Đăng Ký Tài Khoản
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
