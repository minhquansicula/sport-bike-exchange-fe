import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "./UserMenu";
// Import Icon
import { MdMenu, MdPedalBike } from "react-icons/md";

const Header = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-bold relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
      : "text-gray-500 hover:text-primary transition-colors";

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm transition-all">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-lg transition-colors"
        >
          <MdMenu size={28} />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2 group select-none"
        >
          <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
            <MdPedalBike className="text-primary text-2xl group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span>
            Old<span className="text-primary">Bike</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-10 text-sm font-medium uppercase tracking-wide">
          <Link to="/" className={isActive("/")}>
            Trang chủ
          </Link>
          <Link to="/bikes" className={isActive("/bikes")}>
            Mua xe
          </Link>
          <Link to="/post-bike" className={isActive("/post-bike")}>
            Bán xe
          </Link>
          <Link to="/news" className={isActive("/news")}>
            Tin tức
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-600 font-bold hover:text-primary transition px-4 py-2"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
