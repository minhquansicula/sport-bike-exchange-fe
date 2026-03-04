import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "../../../utils/formatCurrency";
import {
  MdLocationOn,
  MdHandshake,
  MdFavoriteBorder,
  MdAccessTime,
} from "react-icons/md";

const BikeCard = ({ bike }) => {
  return (
    <Link
      to={`/bikes/${bike.listingId}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-orange-200 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* --- 1. PHẦN ẢNH (Image Section) --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={
            bike.image_url ||
            bike.imageUrl ||
            "https://placehold.co/400x300/eeeeee/999999?text=Chua+co+anh"
          }
          alt={bike.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Nút Tim */}
        <button
          className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
          onClick={(e) => {
            e.preventDefault();
            // Thêm logic yêu thích ở đây
          }}
        >
          <MdFavoriteBorder />
        </button>
      </div>

      {/* --- 2. PHẦN THÔNG TIN (Info Section) --- */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Dòng 1: Hãng & Loại xe */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
            {bike.brand || "Khác"} • {bike.category || "Chưa phân loại"}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <MdLocationOn />{" "}
            {bike.location ? bike.location.split(",")[0] : "Toàn quốc"}
          </span>
        </div>

        {/* Tên xe */}
        <h3 className="font-bold text-base text-zinc-900 line-clamp-2 mb-1 leading-snug group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
          {bike.title}
        </h3>

        {/* Giá & Nút Yêu cầu Giao dịch */}
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-orange-600 tracking-tight">
              {formatCurrency(bike.price || 0)}
            </span>
          </div>

          <button
            className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm group/btn relative"
            title="Gửi yêu cầu giao dịch"
            onClick={(e) => {
              e.preventDefault();
              console.log("Mở modal yêu cầu giao dịch cho xe:", bike.listingId);
            }}
          >
            <MdHandshake size={20} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              Yêu cầu giao dịch
            </span>
          </button>
        </div>

        {/* Footer Card */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
          <span className="text-xs text-zinc-500 truncate max-w-[100px]">
            Người bán
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-300 ml-auto">
            <MdAccessTime />{" "}
            {bike.createdAt
              ? new Date(bike.createdAt).toLocaleDateString("vi-VN")
              : "Mới đây"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BikeCard;
