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

const InspectorHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <MdMenu size={24} />
      </button>
      <div className="flex-1"></div> {/* Spacer */}
      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-sm font-medium"
          title="Trang mua sắm"
        >
          <MdStorefront size={20} />
          <span className="hidden sm:inline">Trang mua sắm</span>
        </Link>

        {/* Notification */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-all">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-all"
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.name}&background=10B981&color=fff`
              }
              alt="Avatar"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-gray-200 object-cover"
            />
            <div className="hidden md:block text-left mr-1">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || user?.username || "Inspector"}
              </p>
            </div>
            <MdKeyboardArrowDown
              className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 z-20 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/inspector/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hồ sơ cá nhân
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

export default InspectorHeader;
