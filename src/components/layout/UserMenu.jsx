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

  // 1. Xử lý hiển thị Tên: Ưu tiên fullName từ DB, nếu không có thì dùng username/name từ Token
  const displayName =
    user?.fullName || user?.name || user?.username || "Người dùng";

  // 2. Xử lý Avatar: Nếu user chưa có avatar, tạo avatar tự động dựa trên tên hiển thị
  const displayAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${displayName}&background=random&color=fff&background=ea580c`;

  // 3. Kiểm tra quyền Admin (Xử lý chuỗi an toàn)
  // Backend trả về role có thể là chuỗi hoặc mảng, nên convert về string để check
  const userRole = String(user?.role || "").toUpperCase();
  const isAdmin = userRole.includes("ADMIN");

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
        className="flex items-center gap-2 focus:outline-none group"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-zinc-800 group-hover:text-orange-600 transition-colors">
            {displayName} {/* ✅ Đã sửa */}
          </p>
        </div>
        <div className="relative">
          <img
            src={displayAvatar} // ✅ Đã sửa
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-100 group-hover:border-orange-200 transition-colors object-cover shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-gray-100">
            <MdKeyboardArrowDown className="text-gray-500" size={12} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-zinc-900 truncate">
              {displayName} {/* ✅ Đã sửa */}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {user.email || "Chưa cập nhật email"}{" "}
              {/* ✅ Fallback nếu thiếu email */}
            </p>
          </div>

          <div className="py-2">
            {/* --- LOGIC HIỂN THỊ MENU --- */}

            {/* TRƯỜNG HỢP 1: LÀ ADMIN */}
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <MdAdminPanelSettings size={20} className="text-orange-500" />{" "}
                Trang quản trị
              </Link>
            ) : (
              /* TRƯỜNG HỢP 2: USER THƯỜNG */
              <>
                <Link
                  to="/profile?tab=info"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <MdPerson size={20} className="text-gray-400" /> Hồ sơ cá nhân
                </Link>

                <Link
                  to="/profile?tab=transaction-manage"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <MdManageAccounts size={20} className="text-gray-400" /> Quản
                  lý giao dịch
                </Link>

                <Link
                  to="/profile?tab=my-bikes"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <MdPedalBike size={20} className="text-gray-400" /> Xe của tôi
                </Link>

                <Link
                  to="/profile?tab=transactions-history"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <MdHistory size={20} className="text-gray-400" /> Lịch sử giao
                  dịch
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-50 pt-2 mt-1 px-3 pb-1">
            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
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
