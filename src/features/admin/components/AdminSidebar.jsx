import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdHome,
  MdArticle,
  MdPeople,
  MdSettings,
  MdLocationOn,
  MdSwapHoriz,
  MdAttachMoney,
  MdLogout,
  MdPedalBike,
  MdVerified,
  MdWarning,
  MdEvent, // 👈 ĐÃ THÊM IMPORT NÀY
} from "react-icons/md";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Menu items cho Admin
  const menuSections = [
    {
      title: "Tổng quan",
      items: [
        {
          label: "Trang chủ Admin",
          path: "/admin",
          icon: <MdHome size={22} />,
        },
      ],
    },
    // 👇 Phần này bạn đã thêm nhưng thiếu import icon nên bị lỗi
    {
      title: "Quản lý sự kiện",
      items: [
        {
          label: "Danh sách sự kiện",
          path: "/admin/events",
          icon: <MdEvent size={22} />,
        },
      ],
    },
    {
      title: "Quản lý tin đăng",
      items: [
        {
          label: "Duyệt tin đăng",
          path: "/admin/posts",
          icon: <MdArticle size={22} />,
          badge: "12",
        },
      ],
    },
    {
      title: "Điều phối giao dịch",
      items: [
        {
          label: "Giao dịch chờ xử lý",
          path: "/admin/transactions",
          icon: <MdSwapHoriz size={22} />,
          badge: "5",
        },
      ],
    },
    {
      title: "Cấu hình hệ thống",
      items: [
        {
          label: "Phí & Giá",
          path: "/admin/pricing",
          icon: <MdAttachMoney size={22} />,
        },
        {
          label: "Địa điểm giao dịch",
          path: "/admin/locations",
          icon: <MdLocationOn size={22} />,
        },
        {
          label: "Cài đặt chung",
          path: "/admin/settings",
          icon: <MdSettings size={22} />,
        },
      ],
    },
    {
      title: "Quản lý người dùng",
      items: [
        {
          label: "Danh sách thành viên",
          path: "/admin/users",
          icon: <MdPeople size={22} />,
        },
        {
          label: "Xử lý vi phạm",
          path: "/admin/violations",
          icon: <MdWarning size={22} />,
          badge: "3",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-zinc-900 text-white flex flex-col z-50 shadow-xl">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link to="/" className="flex items-center gap-2 group">
          <MdPedalBike className="text-orange-500 text-3xl" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none">
              Velo<span className="text-orange-500">X</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.name}&background=random`
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {user.name}
              </p>
              <p className="text-xs text-orange-500 flex items-center gap-1">
                <MdVerified size={12} /> Administrator
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        isActive(item.path) ? "text-white" : "text-zinc-500"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive(item.path)
                            ? "bg-white text-orange-600"
                            : "bg-orange-600 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-red-600/20 hover:text-red-500 transition-all duration-200 font-medium text-sm"
        >
          <MdLogout size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
