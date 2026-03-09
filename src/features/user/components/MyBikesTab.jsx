import React from "react";
import { Link } from "react-router-dom";
import {
  MdAdd,
  MdDirectionsBike,
  MdOutlineEdit,
  MdOutlineDelete,
  MdCircle,
} from "react-icons/md";

const MyBikesTab = ({ myBikes, isLoading, onDelete }) => {
  // 1. SMART LOADING: Hiệu ứng Skeleton hiện đại
  if (isLoading)
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-100">
          <div className="h-8 w-40 bg-zinc-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-zinc-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] p-3 border border-zinc-100 flex flex-col"
            >
              <div className="aspect-[4/3] bg-zinc-200 rounded-[16px] mb-4"></div>
              <div className="px-2 space-y-3">
                <div className="h-5 w-3/4 bg-zinc-200 rounded"></div>
                <div className="h-6 w-1/3 bg-zinc-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // 2. EMPTY STATE: Đơn giản, mềm mại và tập trung vào Call-to-Action
  if (!myBikes || myBikes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 rounded-[32px] border border-zinc-100">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-5">
          <MdDirectionsBike size={32} className="text-zinc-300" />
        </div>
        <h3 className="text-xl font-black text-zinc-900 mb-2">
          Kho xe của bạn đang trống
        </h3>
        <p className="text-zinc-500 mb-8 text-sm">
          Hãy đăng bán chiếc xe đầu tiên để kết nối với người mua.
        </p>
        <Link
          to="/post-bike"
          className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-zinc-200 active:scale-95"
        >
          <MdAdd size={20} /> Bắt đầu đăng tin
        </Link>
      </div>
    );
  }

  // 3. MAIN CONTENT: Thiết kế thẻ xe (Card) tinh gọn
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Kho xe của tôi
          </h2>
          <p className="text-sm text-zinc-500 font-medium mt-1">
            Quản lý {myBikes.length} tin đăng bán
          </p>
        </div>
        <Link
          to="/post-bike"
          className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <MdAdd size={18} /> Đăng tin mới
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myBikes.map((bike) => {
          const isApproved = bike.status?.toLowerCase() === "available";
          return (
            <div
              key={bike.listingId}
              className="group bg-white border border-zinc-100 rounded-[24px] p-3 hover:border-zinc-200 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500 flex flex-col"
            >
              {/* Image Area */}
              <Link to={`/bikes/${bike.listingId}`} className="block relative">
                <div className="aspect-[4/3] bg-zinc-100 rounded-[16px] overflow-hidden mb-4 relative mask-image">
                  <img
                    src={
                      bike.image_url ||
                      "https://placehold.co/600x400/f4f4f5/a1a1aa?text=No+Image"
                    }
                    alt={bike.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Status Badge (Hiệu ứng kính mờ - Glassmorphism) */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                    <MdCircle
                      size={8}
                      className={
                        isApproved
                          ? "text-green-500 animate-pulse"
                          : "text-amber-500"
                      }
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-800">
                      {isApproved ? "Đang hiển thị" : "Chờ duyệt"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Info Area */}
              <div className="px-2 flex-1 flex flex-col">
                <Link to={`/bikes/${bike.listingId}`}>
                  <h3 className="font-bold text-zinc-900 text-lg line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                    {bike.title}
                  </h3>
                  <p className="text-orange-600 font-black text-xl mb-4">
                    {bike.price?.toLocaleString("vi-VN")} đ
                  </p>
                </Link>

                {/* Actions Area - Đường kẻ mỏng phân tách, nút dạng minimal */}
                <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Mã: #{bike.listingId}
                  </span>

                  <div className="flex gap-1">
                    <Link
                      to={`/edit-bike/${bike.listingId}`}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors tooltip-trigger"
                      title="Sửa tin"
                    >
                      <MdOutlineEdit size={20} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(bike.listingId);
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Gỡ tin"
                    >
                      <MdOutlineDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBikesTab;
