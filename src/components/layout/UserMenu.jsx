import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
// Import icon Material Design
import {
  MdPerson,
  MdDirectionsBike,
  MdSettings,
  MdLogout,
  MdKeyboardArrowDown,
} from "react-icons/md";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <span className="hidden md:block text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
          {user.name}
        </span>
        <div className="relative">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.name}&background=random`
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-100 group-hover:border-primary transition-colors object-cover"
          />
          {/* Icon mũi tên nhỏ bên cạnh avatar */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border">
            <MdKeyboardArrowDown className="text-gray-500" size={12} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
            >
              <MdPerson size={20} /> Hồ sơ cá nhân
            </Link>
            <Link
              to="/my-bikes"
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
            >
              <MdDirectionsBike size={20} /> Xe của tôi
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
            >
              <MdSettings size={20} /> Cài đặt tài khoản
            </Link>
          </div>

          <div className="border-t border-gray-50 pt-2 mt-1 px-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <MdLogout size={20} /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
