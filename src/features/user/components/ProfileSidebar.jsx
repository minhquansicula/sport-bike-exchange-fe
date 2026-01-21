import React from "react";
import {
  MdPerson,
  MdLock,
  MdNotifications,
  MdPedalBike,
  MdHistory,
  MdLogout,
  MdManageAccounts,
} from "react-icons/md";

const ProfileSidebar = ({ activeTab, setActiveTab, logout }) => {
  const menuItems = [
    { id: "info", icon: <MdPerson size={20} />, label: "Thông tin cá nhân" },
    { id: "security", icon: <MdLock size={20} />, label: "Bảo mật tài khoản" },
    {
      id: "notification",
      icon: <MdNotifications size={20} />,
      label: "Cài đặt thông báo",
    },

    // --- PHẦN QUẢN LÝ ---
    {
      id: "transaction-manage",
      icon: <MdManageAccounts size={20} />,
      label: "Quản lý giao dịch",
    }, // 👈 MỚI
    { id: "my-bikes", icon: <MdPedalBike size={20} />, label: "Xe của tôi" },
    {
      id: "transactions-history",
      icon: <MdHistory size={20} />,
      label: "Lịch sử giao dịch",
    }, // Đổi ID cho rõ nghĩa
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      <nav className="flex flex-col p-2 space-y-1">
        <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Tài khoản
        </p>
        {menuItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === item.id
                ? "bg-orange-50 text-orange-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <div className="h-px bg-gray-100 my-2"></div>
        <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Quản lý
        </p>
        {menuItems.slice(3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === item.id
                ? "bg-orange-50 text-orange-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <div className="h-px bg-gray-100 my-2"></div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
        >
          <MdLogout size={20} /> Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
