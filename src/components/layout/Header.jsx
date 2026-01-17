// src/components/layout/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Dùng hook lấy user

const Header = () => {
  const { user, logout } = useAuth(); // Lấy user từ Context

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-primary flex items-center gap-2"
        >
          <span>🚴‍♂️</span> OldBike
        </Link>

        {/* Menu chính */}
        <nav className="hidden md:flex space-x-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-primary transition">
            Trang chủ
          </Link>
          <Link to="/bikes" className="hover:text-primary transition">
            Mua xe
          </Link>
          <Link to="/post-bike" className="hover:text-primary transition">
            Bán xe
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            // Nếu ĐÃ đăng nhập
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold hidden sm:block">
                Chào, {user.name}
              </span>
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full border"
              />
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-500 font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            // Nếu CHƯA đăng nhập
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-5 py-2 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-200"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
