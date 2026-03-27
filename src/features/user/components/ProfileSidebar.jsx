// File: src/pages/user/components/ProfileSidebar.jsx
import React from "react";
import {
  MdPerson,
  MdLock,
  MdNotifications,
  MdPedalBike,
  MdHistory,
  MdLogout,
  MdManageAccounts,
  MdAccountBalanceWallet,
  MdEventAvailable, // <-- Thêm import icon
} from "react-icons/md";

const ProfileSidebar = ({
  activeTab,
  setActiveTab,
  logout,
}) => {
  const accountItems = [
    { id: "info", icon: <MdPerson size={20} />, label: "Thông tin cá nhân" },
    { id: "security", icon: <MdLock size={20} />, label: "Bảo mật tài khoản" },
    {
      id: "notification",
      icon: <MdNotifications size={20} />,
      label: "Cài đặt thông báo",
    },
  ];

  const manageItems = [
    {
      id: "wallet",
      icon: <MdAccountBalanceWallet size={20} />,
      label: "Ví của tôi",
    },
    {
      id: "transaction-manage",
      icon: <MdManageAccounts size={20} />,
      label: "Quản lý giao dịch",
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { id: "my-bikes", icon: <MdPedalBike size={20} />, label: "Xe của tôi" },
    {
      id: "my-event-bikes",
      icon: <MdEventAvailable size={20} />,
      label: "Xe sự kiện",
    }, // <-- THÊM NÚT NÀY
    {
      id: "transactions-history",
      icon: <MdHistory size={20} />,
      label: "Lịch sử giao dịch",
    },
  ];

  const renderButton = (item) => (
    <button
      key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm whitespace-nowrap shrink-0 lg:shrink max-w-full ${
        activeTab === item.id
          ? "bg-orange-50 text-orange-600 shadow-sm"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {item.icon} {item.label}
      {/* Render Badge nếu có */}
      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
          {item.badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-white lg:rounded-[24px] shadow-sm border-b lg:border border-gray-100 overflow-hidden lg:sticky lg:top-24 -mx-4 lg:mx-0">
      <nav className="flex lg:flex-col p-2 space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto scrollbar-hide">
        <p className="hidden lg:block px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Tài khoản
        </p>
        {accountItems.map(renderButton)}

        <div className="hidden lg:block h-px bg-gray-100 my-2"></div>

        <p className="hidden lg:block px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Quản lý
        </p>
        {manageItems.map(renderButton)}

        <div className="hidden lg:block h-px bg-gray-100 my-2"></div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50 whitespace-nowrap shrink-0 lg:shrink"
        >
          <MdLogout size={20} /> Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
