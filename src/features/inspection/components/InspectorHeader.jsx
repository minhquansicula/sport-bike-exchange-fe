import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdSearch,
  MdNotifications,
  MdKeyboardArrowDown,
  MdLogout,
  MdStorefront,
  MdHome,
  MdAssignment,
  MdFactCheck,
  MdHistory,
} from "react-icons/md";

const InspectorHeader = () => {
  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu điều hướng chính
  const navItems = [
    {
      label: "Dashboard",
      path: "/inspector",
      icon: <MdHome size={18} />,
    },
    {
      label: "Nhiệm vụ",
      path: "/inspector/tasks",
      icon: <MdAssignment size={18} />,
    },
    {
      label: "Tạo báo cáo",
      path: "/inspector/create-report",
      icon: <MdFactCheck size={18} />,
    },
    {
      label: "Lịch sử",
      path: "/inspector/history",
      icon: <MdHistory size={18} />,
    },
  ];

  const isActive = (path) => {
    if (path === "/inspector") {
      return location.pathname === "/inspector";
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/inspector?search=${encodeURIComponent(keyword)}`);
      setKeyword("");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-30 flex items-center px-6 shadow-sm">
      {/* Navigation Menu */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span
              className={
                isActive(item.path) ? "text-emerald-500" : "text-gray-400"
              }
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ..."
            className="w-full bg-gray-50 text-gray-900 rounded-lg pl-10 pr-4 py-2 outline-none border border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all duration-200 placeholder-gray-400 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Link to Main Site */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-all text-sm font-medium"
          title="Xem trang chính"
        >
          <MdStorefront size={20} />
          <span className="hidden md:inline">Trang chính</span>
        </Link>

        {/* Notification Button */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-all">
          <MdNotifications size={22} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-gray-50 transition-all"
          >
            <img
              src={user?.avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-lg border border-gray-200 object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-emerald-600 font-medium">Inspector</p>
            </div>
            <MdKeyboardArrowDown
              className={`text-gray-400 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
