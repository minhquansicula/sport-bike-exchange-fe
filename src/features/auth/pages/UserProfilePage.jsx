import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth"; // Đảm bảo đường dẫn đúng tới hook
// Import Icons
import {
  MdPerson,
  MdLock,
  MdNotifications,
  MdEdit,
  MdCameraAlt,
  MdVerified,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSave,
  MdHistory,
  MdLogout,
} from "react-icons/md";

const UserProfilePage = () => {
  const { user, logout } = useAuth(); // Lấy hàm logout nếu cần
  const [activeTab, setActiveTab] = useState("info"); // info | security | notification

  // Mock data form (Sau này sẽ bind với API)
  const [formData, setFormData] = useState({
    name: user?.name || "Người dùng OldBike",
    email: user?.email || "email@example.com",
    phone: "0912 345 678",
    address: "Đống Đa, Hà Nội",
    bio: "Đam mê xe đạp, thích sưu tầm các dòng Vintage.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- 1. HEADER PROFILE (Cover & Avatar) --- */}
        <div className="relative mb-24">
          {/* Cover Image - Gradient sang trọng */}
          <div className="h-48 w-full bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>

          {/* Avatar Section (Nổi lên trên Cover) */}
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${formData.name}&background=random`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Nút đổi avatar */}
              <button className="absolute bottom-0 right-0 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 shadow-md transition-all transform group-hover:scale-110 cursor-pointer">
                <MdCameraAlt />
              </button>
            </div>

            <div className="mb-2">
              <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-2">
                {formData.name}
                <MdVerified
                  className="text-blue-500 text-xl"
                  title="Đã xác thực danh tính"
                />
              </h1>
              <p className="text-gray-500 font-medium">
                Thành viên OldBike từ 2024
              </p>
            </div>
          </div>
        </div>

        {/* --- 2. MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR (Menu) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "info" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdPerson size={20} /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "security" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdLock size={20} /> Bảo mật tài khoản
                </button>
                <button
                  onClick={() => setActiveTab("notification")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "notification" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdNotifications size={20} /> Cài đặt thông báo
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
                >
                  <MdLogout size={20} /> Đăng xuất
                </button>
              </nav>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MdHistory /> Hoạt động
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-sm">Tin đang rao</span>
                  <span className="font-bold text-xl">05</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-sm">Xe đã bán</span>
                  <span className="font-bold text-xl text-orange-400">03</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Điểm uy tín</span>
                  <span className="font-bold text-xl">100</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT (Form) */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              {/* === TAB 1: THÔNG TIN CÁ NHÂN === */}
              {activeTab === "info" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900">
                        Hồ sơ của tôi
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                      </p>
                    </div>
                    <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 hover:shadow-orange-200 hover:-translate-y-0.5">
                      <MdSave size={18} /> Lưu thay đổi
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ tên */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Họ và tên
                      </label>
                      <div className="relative group">
                        <MdPerson
                          className="absolute top-3 left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                          size={20}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Email (Read only) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Email (Không thể thay đổi)
                      </label>
                      <div className="relative">
                        <MdEmail
                          className="absolute top-3 left-3 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                        />
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Số điện thoại
                      </label>
                      <div className="relative group">
                        <MdPhone
                          className="absolute top-3 left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                          size={20}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Địa chỉ
                      </label>
                      <div className="relative group">
                        <MdLocationOn
                          className="absolute top-3 left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                          size={20}
                        />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        rows="4"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium resize-none"
                        placeholder="Chia sẻ một chút về sở thích xe đạp của bạn..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB 2: BẢO MẬT === */}
              {activeTab === "security" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Đổi mật khẩu
                  </h2>
                  <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                      />
                    </div>
                    <div className="pt-4">
                      <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB 3: THÔNG BÁO === */}
              {activeTab === "notification" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Cài đặt thông báo
                  </h2>
                  <div className="space-y-4">
                    {[
                      "Thông báo khi có yêu cầu giao dịch mới",
                      "Thông báo khi xe bạn quan tâm giảm giá",
                      "Nhận bản tin khuyến mãi qua Email",
                      "Nhắc nhở lịch hẹn giao dịch tại trạm",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors"
                      >
                        <span className="font-medium text-zinc-700">
                          {item}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={idx === 0 || idx === 3}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
