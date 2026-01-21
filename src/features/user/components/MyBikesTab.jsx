import React from "react";
import { Link } from "react-router-dom";

const MyBikesTab = ({ myBikes }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-zinc-900">Kho xe của tôi</h2>
        <Link
          to="/post-bike"
          className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-md"
        >
          + Đăng tin mới
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myBikes.map((bike) => (
          <div
            key={bike.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
              <img
                src={bike.image}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                Đang hiển thị
              </span>
            </div>
            <h3 className="font-bold text-zinc-900 line-clamp-1 mb-1">
              {bike.name}
            </h3>
            <p className="text-orange-600 font-bold mb-4">
              {bike.price.toLocaleString("vi-VN")} đ
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-50 hover:bg-gray-200 text-zinc-700 py-2 rounded-lg text-sm font-bold transition-colors">
                Sửa
              </button>
              <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold transition-colors">
                Gỡ tin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBikesTab;
