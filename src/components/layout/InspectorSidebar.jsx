import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  MdHome,
  MdAssignment,
  MdFactCheck,
  MdHistory,
  MdPerson,
  MdLogout,
  MdPedalBike,
  MdVerified,
} from "react-icons/md";

const InspectorSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Menu items cho Inspector
  const menuSections = [
    {
      title: "Tổng quan",
      items: [
        {
          label: "Dashboard",
          path: "/inspector",
          icon: <MdHome size={22} />,
        },
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

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-emerald-900 text-white flex flex-col z-50 shadow-xl">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-emerald-800">
        <Link to="/inspector" className="flex items-center gap-2 group">
          <MdPedalBike className="text-emerald-400 text-3xl" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none">
              Old<span className="text-emerald-400">Bike</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">
              Inspector Panel
            </span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-emerald-400"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {user.name}
              </p>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <MdVerified size={12} /> Inspector
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 px-3 mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "text-emerald-200 hover:bg-emerald-800 hover:text-white"
                    }`}
                  >
                    <span
                      className={isActive(item.path) ? "text-white" : "text-emerald-400"}
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

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-800 text-emerald-200 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 font-medium text-sm"
        >
          <MdLogout size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default InspectorSidebar;
