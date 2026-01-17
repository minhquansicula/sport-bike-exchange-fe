import React from "react";
import BikeCard from "../components/BikeCard";
import { MOCK_BIKES } from "../../../mockData/bikes"; // Đảm bảo đường dẫn này đúng với cấu trúc của bạn

const BikeListPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Phần Tiêu đề & Bộ lọc nhanh */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Chợ Xe Đạp</h1>
          <p className="text-gray-500 mt-1">
            Tìm thấy {MOCK_BIKES.length} xe đang được rao bán
          </p>
        </div>

        {/* Bộ lọc giao diện (Chưa cần logic) */}
        <div className="flex gap-3">
          <select className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
            <option>Loại xe: Tất cả</option>
            <option>Road (Đua)</option>
            <option>MTB (Địa hình)</option>
            <option>Touring</option>
          </select>
          <select className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
            <option>Sắp xếp: Mới nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* 2. Lưới sản phẩm */}
      {/* Grid: Mobile 1 cột, Tablet 2 cột, Desktop 4 cột */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_BIKES.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
        {/* Lặp lại data giả để nhìn cho đầy trang (nếu ít xe quá) */}
        {MOCK_BIKES.map((bike) => (
          <BikeCard key={`duplicate-${bike.id}`} bike={bike} />
        ))}
      </div>

      {/* 3. Phân trang (Giao diện tĩnh) */}
      <div className="flex justify-center mt-12 gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-gray-600"
          disabled
        >
          &laquo; Trước
        </button>
        <button className="px-3 py-1 bg-primary text-white rounded font-bold">
          1
        </button>
        <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600">
          2
        </button>
        <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600">
          3
        </button>
        <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600">
          Sau &raquo;
        </button>
      </div>
    </div>
  );
};

// QUAN TRỌNG: Dòng này giúp Router tìm thấy component này
export default BikeListPage;
