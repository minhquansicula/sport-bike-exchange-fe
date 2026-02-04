import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdNotifications,
  MdKeyboardArrowDown,
  MdLogout,
  MdPerson,
  MdStorefront,
  MdHome,
  MdAssignment,
  MdFactCheck,
  MdHistory,
} from "react-icons/md";

const InspectorHeader = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu điều hướng chính
  const navItems = [
    {
      label: "Trang chủ",
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

  return (
    <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-30 flex items-center px-6 shadow-sm">
      {/* Navigation Menu */}
      <nav className="flex items-center gap-2">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={isActive(item.path) ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
            {index < navItems.length - 1 && (
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Link to Main Site */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-all text-sm font-medium"
          title="Trang mua sắm"
        >
          <MdStorefront size={20} />
          <span className="hidden md:inline">Trang mua sắm</span>
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
                <Link
                  to="/inspector/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <MdPerson size={18} className="text-gray-400" />
                  Hồ sơ của tôi
                </Link>
                <hr className="my-2 border-gray-100" />
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
