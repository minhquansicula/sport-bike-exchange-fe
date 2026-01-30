import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // Nhớ kiểm tra đường dẫn này
import {
  MdNotifications,
  MdKeyboardArrowDown,
  MdLogout,
  MdStorefront,
  MdDashboard,
  MdPeople,
  MdReceipt,
} from "react-icons/md";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu điều hướng chính
  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <MdDashboard size={20} />,
    },
    {
      label: "Người dùng",
      path: "/admin/users",
      icon: <MdPeople size={20} />,
    },
    {
      label: "Giao dịch",
      path: "/admin/transactions",
      icon: <MdReceipt size={20} />,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 flex items-center px-4 md:px-8 shadow-sm transition-all">
      {/* 1. NAVIGATION MENU (Đẩy sang trái vì đã bỏ Logo) */}
      <nav className="flex items-center bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              isActive(item.path)
                ? "text-orange-700 bg-white shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-zinc-900 hover:bg-gray-100/50"
            }`}
          >
            <span
              className={`transition-colors ${
                isActive(item.path)
                  ? "text-orange-600"
                  : "text-gray-400 group-hover:text-zinc-600"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* SPACER */}
      <div className="flex-1"></div>

      {/* 2. RIGHT SECTION (TOOLS & PROFILE) */}
      <div className="flex items-center gap-4">
        {/* Quick Link */}
        <Link
          to="/"
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full text-zinc-600 hover:bg-orange-50 hover:text-orange-600 transition-all text-sm font-bold bg-gray-50 border border-transparent hover:border-orange-100"
          title="Về trang mua sắm"
        >
          <MdStorefront size={20} />
          <span>Cửa hàng</span>
        </Link>

        {/* Notification */}
        <button className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-zinc-900 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200">
          <MdNotifications size={24} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors">
                {user?.name || "Admin"}
              </p>
              {/* Giữ lại label Admin nhỏ để biết role */}
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                Quản trị viên
              </p>
            </div>

            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    user?.name || "Admin"
                  }&background=0f172a&color=fff`
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:shadow-lg transition-all object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 group-hover:bg-white group-hover:text-orange-600 transition-colors">
              <MdKeyboardArrowDown
                size={16}
                className={`transition-transform duration-300 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu (Đã bỏ thông tin Email, chỉ còn nút Logout) */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-4 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-2">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <MdLogout size={18} />
                  </div>
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
