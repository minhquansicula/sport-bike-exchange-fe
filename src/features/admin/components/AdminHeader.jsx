import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdNotifications,
  MdKeyboardArrowDown,
  MdLogout,
  MdStorefront,
  MdMenu,
} from "react-icons/md";

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 shadow-sm transition-all">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MdMenu size={24} />
      </button>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right Section (TOOLS & PROFILE) */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Link */}
        <Link
          to="/"
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition-all text-sm font-bold bg-gray-50 border border-transparent hover:border-orange-100"
          title="Về trang mua sắm"
        >
          <MdStorefront size={18} />
          <span>Cửa hàng</span>
        </Link>

        {/* Notification */}
        <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-zinc-900 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200">
          <MdNotifications size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group"
          >
            <div className="text-right hidden md:block mr-1">
              <p className="text-sm font-bold text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Quản trị viên
              </p>
            </div>

            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=f97316&color=fff`
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-orange-600 transition-colors">
              <MdKeyboardArrowDown
                size={18}
                className={`transition-transform duration-300 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-2">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <MdLogout size={18} />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
