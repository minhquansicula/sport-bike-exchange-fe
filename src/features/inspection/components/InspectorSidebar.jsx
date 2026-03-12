import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdHome,
  MdAssignment,
  MdFactCheck,
  MdHistory,
  MdPerson,
  MdLogout,
  MdPedalBike,
  MdVerified,
  MdClose,
} from "react-icons/md";

const InspectorSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuSections = [
    {
      title: "Tổng quan",
      items: [
        { label: "Trang chủ", path: "/inspector", icon: <MdHome size={22} /> },
      ],
    },
    {
      title: "Công việc",
      items: [
        {
          label: "Nhiệm vụ kiểm định",
          path: "/inspector/tasks",
          icon: <MdAssignment size={22} />,
          badge: "3",
        },
        {
          label: "Tạo báo cáo",
          path: "/inspector/create-report",
          icon: <MdFactCheck size={22} />,
        },
        {
          label: "Lịch sử kiểm định",
          path: "/inspector/history",
          icon: <MdHistory size={22} />,
        },
      ],
    },
    {
      title: "Tài khoản",
      items: [
        {
          label: "Hồ sơ cá nhân",
          path: "/inspector/profile",
          icon: <MdPerson size={22} />,
        },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === "/inspector") return location.pathname === "/inspector";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-[260px] bg-emerald-950 text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-emerald-800/50 bg-emerald-950/50">
        <Link to="/inspector" className="flex items-center gap-2 group">
          <MdPedalBike className="text-emerald-400 text-3xl group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col">
            <span className="font-black text-xl text-white tracking-tight leading-none">
              Velo<span className="text-emerald-400">X</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              Inspector
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
        <div className="p-5 border-b border-emerald-800/50 bg-emerald-900/20">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-emerald-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {user.name || user.username}
              </p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <MdVerified size={14} /> Chuyên gia
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/80 px-3 mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                        : "text-emerald-100 hover:bg-emerald-900/50 hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        isActive(item.path)
                          ? "text-white"
                          : "text-emerald-500 group-hover:text-emerald-400"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive(item.path)
                            ? "bg-white text-emerald-600"
                            : "bg-emerald-600 text-white"
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

      {/* Logout */}
      <div className="p-4 border-t border-emerald-800/50 bg-emerald-950/50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-900/50 text-emerald-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 font-bold text-sm"
        >
          <MdLogout size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default InspectorSidebar;
