import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
// Import bộ icon Material Design
import {
  MdHome,
  MdStorefront,
  MdAddCircleOutline,
  MdArticle,
  MdClose,
  MdLogin,
  MdPersonAdd,
  MdLogout,
  MdVerified,
} from "react-icons/md";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: "Trang chủ", path: "/", icon: <MdHome size={24} /> },
    { label: "Mua xe", path: "/bikes", icon: <MdStorefront size={24} /> },
    {
      label: "Đăng bán",
      path: "/post-bike",
      icon: <MdAddCircleOutline size={24} />,
    },
  ];

  const activeClass =
    "bg-orange-50 text-primary font-bold border-r-4 border-primary";
  const normalClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <span className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-primary text-2xl">🚴‍♂️</span> Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 bg-gradient-to-br from-orange-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border-2 border-white shadow-md"
                />
                <div>
                  <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                  <p className="text-xs text-primary flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded-full shadow-sm w-fit mt-1">
                    <MdVerified /> Verified Member
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-6 py-3.5 transition-all ${
                      location.pathname === item.path
                        ? activeClass
                        : normalClass
                    }`}
                  >
                    <span
                      className={
                        location.pathname === item.path
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-3 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
              >
                <MdLogout size={20} /> Đăng xuất
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <MdLogin size={20} /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all"
                >
                  <MdPersonAdd size={20} /> Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
