import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "../../../utils/formatCurrency"; // Đảm bảo file này đã có export default

const BikeCard = ({ bike }) => {
  return (
    <Link
      to={`/bikes/${bike.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Phần Ảnh */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          Mới {bike.condition}%
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          📍 {bike.location}
        </div>
      </div>

      {/* Phần Thông tin */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {bike.type}
          </span>
          <span className="text-xs text-gray-400">{bike.postedDate}</span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
          {bike.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs line-through">
              {formatCurrency(bike.originalPrice)}
            </span>
            <span className="text-orange-600 font-bold text-xl">
              {formatCurrency(bike.price)}
            </span>
          </div>
          <button className="bg-orange-50 text-orange-600 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

// 👇 QUAN TRỌNG: Dòng này giúp sửa lỗi của bạn
export default BikeCard;
