import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "./UserMenu";
import {
  MdMenu,
  MdPedalBike,
  MdSearch,
  MdHome,
  MdStorefront,
  MdAdd,
  MdFavoriteBorder,
  MdNotifications,
} from "react-icons/md";

const Header = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Kiểm tra xem user có phải là admin không
  // Giả sử user object có thuộc tính role. Nếu không có user (chưa login) thì không phải admin.
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/bikes?search=${encodeURIComponent(keyword)}`);
      setKeyword("");
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-6">
        {/* --- 1. LOGO THƯƠNG HIỆU --- */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
          >
            <MdMenu size={26} />
          </button>

          <Link to="/" className="flex items-center gap-2 group select-none">
            <MdPedalBike className="text-orange-600 text-3xl" />
            <span className="hidden sm:block font-bold text-xl text-gray-900 tracking-tight">
              Old<span className="text-orange-600">Bike</span>
            </span>
          </Link>
        </div>

        {/* --- 2. THANH TÌM KIẾM --- */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-auto relative group"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400 text-lg group-focus-within:text-orange-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm xe đạp..."
            className="w-full bg-gray-100 text-gray-900 rounded-full pl-10 pr-4 py-2 outline-none border border-transparent focus:bg-white focus:border-orange-200 focus:ring-2 focus:ring-orange-50 transition-all duration-200 placeholder-gray-500 text-sm font-medium"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* --- 3. MENU & CÔNG CỤ --- */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/"
              title="Trang chủ"
              className={`p-2 rounded-full transition-colors ${
                location.pathname === "/"
                  ? "bg-orange-50 text-orange-600"
                  : "text-orange-600 hover:bg-orange-50"
              }`}
            >
              <MdHome size={26} />
            </Link>

            <Link
              to="/bikes"
              className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold text-sm transition-all ${
                location.pathname === "/bikes"
                  ? "bg-orange-50 text-orange-600"
                  : "text-orange-600 hover:bg-orange-50"
              }`}
            >
              <MdStorefront size={22} />
              <span>Mua xe</span>
            </Link>
          </div>

          <div className="hidden lg:block w-px h-6 bg-gray-200 mx-1"></div>

          <div className="flex items-center gap-1">
            {/* Logic hiển thị: Nếu KHÔNG phải Admin thì mới hiện nút Đăng tin và Wishlist */}
            {!isAdmin && (
              <>
                {/* Nút Đăng Tin (+) */}
                <Link
                  to="/post-bike"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white shadow-md shadow-orange-200 hover:bg-orange-700 hover:scale-105 transition-all duration-200 ml-1"
                  title="Đăng tin bán xe"
                >
                  <MdAdd size={24} />
                </Link>

                {/* Yêu thích */}
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                  title="Danh sách yêu thích"
                >
                  <MdFavoriteBorder size={24} />
                </Link>
              </>
            )}

            {/* Icon Thông Báo (Hiển thị cho cả Admin và User) */}
            <button
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors mr-2"
              title="Thông báo"
            >
              <MdNotifications size={24} />
            </button>
          </div>

          <div className="pl-2 border-l border-gray-100">
            {user ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-gray-900 hover:text-orange-600 px-2 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
