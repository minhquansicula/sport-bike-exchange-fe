import React, { useState } from "react";
import {
  MdSave,
  MdSettings,
  MdNotifications,
  MdSecurity,
  MdCreditCard,
  MdEmail,
  MdPhone,
  MdStore,
  MdBuild,
  MdOutlineToggleOff,
  MdOutlineToggleOn,
} from "react-icons/md";

const AdminSettingsPage = () => {
  // --- STATE ---
  const [generalInfo, setGeneralInfo] = useState({
    appName: "OldBike Marketplace",
    contactEmail: "admin@oldbike.vn",
    hotline: "1900 8888",
    address: "Tòa nhà Tech, Cầu Giấy, Hà Nội",
  });

  const [banking, setBanking] = useState({
    bankName: "MB Bank",
    accountNumber: "9999 8888 6666",
    accountName: "CONG TY OLD BIKE VIET NAM",
    qrTemplate: "compact",
  });

  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    emailNotification: true,
    autoApprovePost: false,
  });

  // --- HANDLERS ---
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankingChange = (e) => {
    const { name, value } = e.target;
    setBanking((prev) => ({ ...prev, [name]: value }));
  };

  const toggleConfig = (key) => {
    setSystemConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Call API Save Settings
    alert("Đã lưu cài đặt hệ thống thành công!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Cài đặt Hệ thống
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý thông tin chung, thanh toán và trạng thái server
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-xl shadow-gray-200"
        >
          <MdSave size={20} /> Lưu cài đặt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === CỘT TRÁI: THÔNG TIN CHUNG === */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. General Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MdStore size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Thông tin Sàn</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Tên ứng dụng
                </label>
                <input
                  type="text"
                  name="appName"
                  value={generalInfo.appName}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all font-medium text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <MdEmail /> Email liên hệ
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={generalInfo.contactEmail}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all font-medium text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <MdPhone /> Hotline
                </label>
                <input
                  type="text"
                  name="hotline"
                  value={generalInfo.hotline}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all font-medium text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Địa chỉ văn phòng
                </label>
                <input
                  type="text"
                  name="address"
                  value={generalInfo.address}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all font-medium text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* 2. Banking Config (Nhận tiền cọc) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <MdCreditCard size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Tài khoản Nhận cọc
                </h3>
                <p className="text-xs text-gray-400">
                  Tiền cọc của người dùng sẽ chuyển về đây
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Form */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Ngân hàng
                  </label>
                  <select
                    name="bankName"
                    value={banking.bankName}
                    onChange={handleBankingChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-green-200 focus:bg-white transition-all font-medium text-gray-900"
                  >
                    <option value="MB Bank">MB Bank</option>
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="Techcombank">Techcombank</option>
                    <option value="VPBank">VPBank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={banking.accountNumber}
                    onChange={handleBankingChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-green-200 focus:bg-white transition-all font-medium text-gray-900 font-mono tracking-wide"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={banking.accountName}
                    onChange={handleBankingChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-green-200 focus:bg-white transition-all font-bold text-gray-900 uppercase"
                  />
                </div>
              </div>

              {/* Card Preview */}
              <div className="w-full md:w-80 h-48 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute w-40 h-40 bg-white opacity-5 rounded-full -top-10 -right-10"></div>
                <div className="flex justify-between items-start z-10">
                  <span className="font-bold tracking-wider opacity-80">
                    {banking.bankName}
                  </span>
                  <MdCreditCard size={24} className="opacity-80" />
                </div>
                <div className="z-10">
                  <p className="text-xs opacity-60 mb-1">Account Number</p>
                  <p className="font-mono text-xl tracking-widest">
                    {banking.accountNumber}
                  </p>
                </div>
                <div className="z-10">
                  <p className="text-xs opacity-60 mb-1">Card Holder</p>
                  <p className="font-bold tracking-wide truncate">
                    {banking.accountName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: CẤU HÌNH HỆ THỐNG === */}
        <div className="lg:col-span-1 space-y-8">
          {/* 1. System Toggles */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MdSettings size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Cấu hình</h3>
            </div>

            <div className="space-y-6">
              {/* Toggle: Maintenance */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <MdBuild className="text-gray-400" /> Bảo trì hệ thống
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ Admin mới truy cập được
                  </p>
                </div>
                <button
                  onClick={() => toggleConfig("maintenanceMode")}
                  className={`text-4xl transition-colors ${systemConfig.maintenanceMode ? "text-orange-500" : "text-gray-300"}`}
                >
                  {systemConfig.maintenanceMode ? (
                    <MdOutlineToggleOn />
                  ) : (
                    <MdOutlineToggleOff />
                  )}
                </button>
              </div>

              <div className="w-full h-px bg-gray-50"></div>

              {/* Toggle: Email Notification */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <MdNotifications className="text-gray-400" /> Gửi Email tự
                    động
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Thông báo khi có giao dịch mới
                  </p>
                </div>
                <button
                  onClick={() => toggleConfig("emailNotification")}
                  className={`text-4xl transition-colors ${systemConfig.emailNotification ? "text-green-500" : "text-gray-300"}`}
                >
                  {systemConfig.emailNotification ? (
                    <MdOutlineToggleOn />
                  ) : (
                    <MdOutlineToggleOff />
                  )}
                </button>
              </div>

              <div className="w-full h-px bg-gray-50"></div>

              {/* Toggle: Auto Approve */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <MdSecurity className="text-gray-400" /> Duyệt tin tự động
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Bỏ qua kiểm duyệt (Không khuyên dùng)
                  </p>
                </div>
                <button
                  onClick={() => toggleConfig("autoApprovePost")}
                  className={`text-4xl transition-colors ${systemConfig.autoApprovePost ? "text-blue-500" : "text-gray-300"}`}
                >
                  {systemConfig.autoApprovePost ? (
                    <MdOutlineToggleOn />
                  ) : (
                    <MdOutlineToggleOff />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Security Banner */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 font-bold mb-2">
              <MdSecurity size={20} /> Bảo mật
            </div>
            <p className="text-sm text-orange-800 mb-4">
              Mật khẩu Admin lần cuối thay đổi vào <strong>20/01/2026</strong>.
              Hãy đổi mật khẩu định kỳ để bảo vệ hệ thống.
            </p>
            <button className="w-full py-2 bg-white text-orange-600 font-bold rounded-xl text-sm shadow-sm hover:bg-orange-50 transition-colors">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
