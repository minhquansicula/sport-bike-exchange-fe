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
  MdEvent,
  MdClose,
} from "react-icons/md";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuSections = [
    {
      title: "Tổng quan",
      items: [
        {
          label: "Trang chủ Admin",
          path: "/admin",
          icon: <MdHome size={20} />,
        },
      ],
    },
    {
      title: "Quản lý sự kiện",
      items: [
        {
          label: "Danh sách sự kiện",
          path: "/admin/events",
          icon: <MdEvent size={20} />,
        },
      ],
    },
    {
      title: "Quản lý tin đăng",
      items: [
        {
          label: "Duyệt tin đăng",
          path: "/admin/posts",
          icon: <MdArticle size={20} />,
        },
      ],
    },
    {
      title: "Điều phối giao dịch",
      items: [
        {
          label: "Giao dịch chờ xử lý",
          path: "/admin/transactions",
          icon: <MdSwapHoriz size={20} />,
        },
      ],
    },
    {
      title: "Cấu hình hệ thống",
      items: [
        {
          label: "Phí & Giá",
          path: "/admin/pricing",
          icon: <MdAttachMoney size={20} />,
        },
        {
          label: "Địa điểm giao dịch",
          path: "/admin/locations",
          icon: <MdLocationOn size={20} />,
        },
        {
          label: "Cài đặt chung",
          path: "/admin/settings",
          icon: <MdSettings size={20} />,
        },
      ],
    },
    {
      title: "Quản lý người dùng",
      items: [
        {
          label: "Danh sách thành viên",
          path: "/admin/users",
          icon: <MdPeople size={20} />,
        },
        {
          label: "Xử lý vi phạm",
          path: "/admin/violations",
          icon: <MdWarning size={20} />,
        },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-[260px] bg-zinc-950 text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 bg-zinc-950/80">
        <Link to="/admin" className="flex items-center gap-2 group">
          <MdPedalBike className="text-orange-500 text-3xl group-hover:-translate-x-1 transition-transform" />
          <div className="flex flex-col">
            <span className="font-black text-xl text-white tracking-tight leading-none">
              Velo<span className="text-orange-500">X</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* User Info Mini */}
      {user && (
        <div className="p-5 border-b border-zinc-800/50 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-orange-500/30 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {user.name}
              </p>
              <p className="text-xs text-orange-400 flex items-center gap-1 font-medium mt-0.5">
                <MdVerified size={13} /> Administrator
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        isActive(item.path)
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-orange-400 transition-colors"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/80">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/80 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-bold text-sm border border-transparent hover:border-red-500/20"
        >
          <MdLogout size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
