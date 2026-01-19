import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "../../../utils/formatCurrency";
// Import Icons
import {
  MdLocationOn,
  MdAddShoppingCart,
  MdFavoriteBorder,
  MdAccessTime,
} from "react-icons/md";

const BikeCard = ({ bike }) => {
  return (
    <Link
      to={`/bikes/${bike.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-orange-200 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* --- 1. PHẦN ẢNH (Image Section) --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Đã xóa Badge "Inspector Verified" ở đây theo yêu cầu */}

        {/* Badge: Độ mới (Vẫn giữ lại vì người bán tự khai báo tình trạng) */}
        <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
          Mới {bike.condition}%
        </div>

        {/* Nút Tim (Chỉ hiện khi hover) */}
        <button
          className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
          onClick={(e) => {
            e.preventDefault(); // Chặn click vào Link cha
            // Xử lý logic yêu thích tại đây
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
            {bike.brand} • {bike.type}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <MdLocationOn /> {bike.location?.split(",")[0]}{" "}
            {/* Chỉ hiện Quận/Huyện */}
          </span>
        </div>

        {/* Tên xe */}
        <h3 className="font-bold text-base text-zinc-900 line-clamp-2 mb-1 leading-snug group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
          {bike.name}
        </h3>

        {/* Giá & Nút Mua */}
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {bike.originalPrice && (
              <span className="text-xs text-zinc-400 line-through mb-0.5">
                {formatCurrency(bike.originalPrice)}
              </span>
            )}
            <span className="text-lg font-black text-orange-600 tracking-tight">
              {formatCurrency(bike.price)}
            </span>
          </div>

          <button
            className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 flex items-center justify-center transition-all duration-300 shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // Xử lý thêm vào giỏ
            }}
          >
            <MdAddShoppingCart size={18} />
          </button>
        </div>

        {/* Footer Card: Người bán & Thời gian */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center gap-2">
          <img
            src={bike.seller?.avatar || "https://ui-avatars.com/api/?name=User"}
            className="w-5 h-5 rounded-full border border-gray-200"
            alt="seller"
          />
          <span className="text-xs text-zinc-500 truncate max-w-[100px]">
            {bike.seller?.name}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-300 ml-auto">
            <MdAccessTime /> {bike.postedTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BikeCard;
