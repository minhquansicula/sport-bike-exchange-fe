import React from "react";
import { MdSave } from "react-icons/md";

const UserInfoTab = ({ formData, handleChange, onSave, loading }) => {
  // Hàm wrapper để xử lý sự kiện form submit (ngăn reload trang)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
        Hồ sơ của tôi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Họ tên</label>
          <input
            type="text"
            name="name" // Khớp với state formData.name ở cha
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
            required
          />
        </div>

        {/* Email - Read Only hoặc Editable tùy logic backend */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // Nếu backend cho sửa email thì bỏ disabled
            className="w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">SĐT</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Giới thiệu (Bio)
          </label>
          <textarea
            rows="3"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Chia sẻ đôi chút về bạn..."
            className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 resize-none transition-all"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-4 w-fit hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MdSave size={18} />
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};

export default UserInfoTab;
