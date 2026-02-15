import React from "react";
import { MdSave } from "react-icons/md";

const UserInfoTab = ({ formData, handleChange, onSave, loading }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
        Hồ sơ của tôi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Họ tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Email</label>
          <input
            type="text"
            value={formData.email}
            disabled
            className="w-full px-4 py-2.5 bg-gray-100 border rounded-xl text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">SĐT</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-zinc-700">Bio</label>
          <textarea
            rows="3"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 resize-none"
          />
        </div>

        <button
          onClick={onSave}
          disabled={loading}
          className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm mt-4 w-fit hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50"
        >
          <MdSave className="inline mr-2" />
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default UserInfoTab;
