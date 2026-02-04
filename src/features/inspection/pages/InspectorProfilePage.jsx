import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdCameraAlt,
  MdVerified,
  MdSave,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
  MdStar,
  MdCheckCircle,
  MdAssignment,
} from "react-icons/md";

const InspectorProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    alert("Cập nhật thông tin thành công!");
  };

  // Mock thống kê
  const stats = [
    { label: "Tổng kiểm định", value: 156, icon: <MdAssignment size={20} /> },
    { label: "Đánh giá", value: "4.9", icon: <MdStar size={20} /> },
    { label: "Hoàn thành", value: "98%", icon: <MdCheckCircle size={20} /> },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 shadow-lg cursor-pointer transition-transform hover:scale-110">
              <MdCameraAlt size={16} />
            </button>
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
              {user.name}
              <MdVerified className="text-emerald-300" size={22} />
            </h1>
            <p className="text-emerald-200 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <MdWork size={16} /> Inspector
            </p>
            <p className="text-emerald-100 text-sm mt-2 max-w-md">
              {user.bio || "Chuyên gia kiểm định xe đạp tại OldBike"}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center text-emerald-300 mb-1">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdPerson className="text-emerald-500" />
            Thông tin cá nhân
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <MdSave size={16} /> Lưu
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdPerson className="text-gray-400" /> Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                isEditing
                  ? "border-gray-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdEmail className="text-gray-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className="w-full px-4 py-2.5 border border-transparent bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdPhone className="text-gray-400" /> Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                isEditing
                  ? "border-gray-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdLocationOn className="text-gray-400" /> Địa chỉ làm việc
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                isEditing
                  ? "border-gray-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới thiệu bản thân
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              placeholder="Mô tả ngắn về bạn..."
              className={`w-full px-4 py-2.5 border rounded-lg transition-colors resize-none ${
                isEditing
                  ? "border-gray-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Work History */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <MdAssignment className="text-emerald-500" />
          Lịch sử công việc gần đây
        </h2>

        <div className="space-y-4">
          {[
            { bike: "Trek Marlin 7", date: "28/01/2026", result: "Đạt" },
            { bike: "Giant Escape 2", date: "27/01/2026", result: "Đạt" },
            { bike: "Specialized Allez", date: "25/01/2026", result: "Không đạt" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{item.bike}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.result === "Đạt"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectorProfilePage;
