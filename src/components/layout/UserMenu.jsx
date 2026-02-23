import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  MdPerson,
  MdHistory,
  MdLogout,
  MdKeyboardArrowDown,
  MdPedalBike,
  MdManageAccounts,
  MdAdminPanelSettings,
} from "react-icons/md";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName =
    user?.fullName || user?.name || user?.username || "Người dùng";

  // Sửa lỗi dư dấu phẩy ở hàm encodeURIComponent
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName,
  )}&background=random&color=fff&background=ea580c&size=128`;

  const displayAvatar =
    user?.avatar && user.avatar.trim() !== "" ? user.avatar : fallbackAvatar;

  const isAdmin = String(user?.role || "")
    .toUpperCase()
    .includes("ADMIN");

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

  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group p-1 rounded-full hover:bg-gray-50 transition-colors"
      >
        <div className="text-right hidden md:block px-2">
          <p className="text-sm font-bold text-zinc-800 group-hover:text-orange-600 transition-colors max-w-[150px] truncate">
            {displayName}
          </p>
        </div>
        <div className="relative">
          <img
            src={displayAvatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-orange-200 transition-all"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatar;
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-gray-100">
            <MdKeyboardArrowDown
              className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              size={14}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
            <img
              src={displayAvatar}
              alt="Avatar Small"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackAvatar;
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user.email || "Chưa cập nhật email"}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${isAdmin ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}
              >
                {isAdmin ? "Quản trị viên" : "Thành viên"}
              </span>
            </div>
          </div>

          <div className="py-2 px-2 space-y-1">
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <MdAdminPanelSettings size={20} className="text-white" /> Trang
                quản trị
              </Link>
            ) : (
              <>
                <Link
                  to="/profile?tab=info"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                >
                  <MdPerson size={20} className="text-gray-400" /> Hồ sơ cá nhân
                </Link>
                <Link
                  to="/profile?tab=transaction-manage"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                >
                  <MdManageAccounts size={20} className="text-gray-400" /> Quản
                  lý giao dịch
                </Link>
                <Link
                  to="/profile?tab=my-bikes"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                >
                  <MdPedalBike size={20} className="text-gray-400" /> Xe của tôi
                </Link>
                <Link
                  to="/profile?tab=transactions-history"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                >
                  <MdHistory size={20} className="text-gray-400" /> Lịch sử giao
                  dịch
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-50 pt-2 mt-1 px-3 pb-2">
            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
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
